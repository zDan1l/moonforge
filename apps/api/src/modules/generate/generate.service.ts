/**
 * Generate Service
 *
 * Orchestrates the Setup and Refine phases for monorepo generation.
 * Integrates with Claude AI and manages file storage.
 */

import {
	isValidPath,
	mergeForRefine,
	mergeWithTemplate,
	normalizePath,
} from "@moonforge/generator/files.js";
import type { GeneratedFile } from "@moonforge/generator/index.js";
import {
	buildRefinePrompt,
	buildSetupPrompt,
	ClaudeOutputSchema,
} from "@moonforge/generator/prompts/index.js";
import { sendMessage } from "../../lib/anthropic.js";
import { prisma } from "../../lib/prisma.js";
import { AppError, NotFoundError } from "../../middleware/error-handler.js";

// ============================================================================
// Types
// ============================================================================

export interface SetupResult {
	projectId: string;
	versionId: string;
	versionNumber: number;
	filesGenerated: number;
	summary: string;
	fileChanges: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	>;
}

export interface RefineResult {
	projectId: string;
	versionId: string;
	versionNumber: number;
	filesChanged: number;
	summary: string;
	fileChanges: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	>;
}

export interface GenerateSetupInput {
	projectId: string;
	description: string;
	additionalContext?: string;
}

export interface GenerateRefineInput {
	projectId: string;
	request: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse JSON from Claude response
 */
function parseClaudeResponse(content: string) {
	try {
		// Try code block first
		const codeBlockMatch = content.match(/```json\n([\s\S]*?)\n```/);
		if (codeBlockMatch) {
			return ClaudeOutputSchema.parse(JSON.parse(codeBlockMatch[1]));
		}

		// Try plain JSON
		const plainMatch = content.match(/({[\s\S]*})/);
		if (plainMatch) {
			return ClaudeOutputSchema.parse(JSON.parse(plainMatch[0]));
		}

		throw new Error("No JSON found in response");
	} catch (_error) {
		throw new AppError("Failed to parse AI response", 500, "PARSE_ERROR");
	}
}

/**
 * Extract file changes from Claude response for tracking
 */
function extractFileChanges(
	files: GeneratedFile[],
): Record<
	string,
	{ path: string; change: "created" | "modified" | "deleted" }
> {
	const changes: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	> = {};

	for (const file of files) {
		// Determine change type based on source
		// template files are never "created" by AI
		// For new files, assume "created"
		// For existing files that match template, it's a template copy
		// For files that were modified by AI, they come from ai_generated or modified
		const change: "created" | "modified" | "deleted" =
			file.source === "template"
				? "created"
				: file.source === "ai_generated"
					? "created"
					: "modified";

		changes[file.path] = { path: file.path, change };
	}

	return changes;
}

/**
 * Store a single file to the database
 */
async function storeFile(
	versionId: string,
	file: GeneratedFile,
	projectId: string,
): Promise<void> {
	const normalizedPath = normalizePath(file.path);

	if (!isValidPath(normalizedPath)) {
		throw new AppError(`Invalid file path: ${file.path}`, 400, "INVALID_PATH");
	}

	await prisma.project_files.create({
		data: {
			project_id: projectId,
			version_id: versionId,
			path: normalizedPath,
			content: file.content,
			file_source: file.source,
		},
	});
}

/**
 * Get the next version number for a project
 */
async function getNextVersionNumber(projectId: string): Promise<number> {
	const latestVersion = await prisma.project_versions.findFirst({
		where: { project_id: projectId },
		orderBy: { version_number: "desc" },
	});

	return latestVersion ? latestVersion.version_number + 1 : 1;
}

/**
 * Copy all files from one version to another
 */
async function copyFilesToVersion(
	fromVersionId: string,
	toVersionId: string,
	projectId: string,
): Promise<void> {
	const files = await prisma.project_files.findMany({
		where: { version_id: fromVersionId },
	});

	for (const file of files) {
		await prisma.project_files.create({
			data: {
				project_id: projectId,
				version_id: toVersionId,
				path: file.path,
				content: file.content,
				file_source: file.file_source,
			},
		});
	}
}

// ============================================================================
// Main Service Functions
// ============================================================================

/**
 * Generate initial monorepo from user description (Setup phase)
 */
export async function generateSetup(
	input: GenerateSetupInput,
): Promise<SetupResult> {
	const { projectId, description, additionalContext } = input;

	// 1. Get project
	const project = await prisma.projects.findUnique({
		where: { id: projectId },
	});

	if (!project) {
		throw new NotFoundError("Project");
	}

	// 2. Build setup prompt and call Claude
	const prompt = buildSetupPrompt({
		userDescription: description,
		projectName: project.name,
		additionalContext,
	});

	const response = await sendMessage({
		messages: [{ role: "user", content: prompt }],
		system: `You are MoonForge, an expert fullstack developer AI. Generate complete, production-ready monorepo structures. Always return valid JSON.`,
	});

	// 3. Parse Claude response
	const output = parseClaudeResponse(response.content);

	// 4. Get next version number
	const versionNumber = await getNextVersionNumber(projectId);

	// 5. Create new version
	const version = await prisma.project_versions.create({
		data: {
			project_id: projectId,
			version_number: versionNumber,
			label: "Initial setup",
		},
	});

	// 6. Merge AI files with template and store
	const mergeResult = await mergeWithTemplate(output.files);

	// Track file changes for chat message
	const fileChanges = extractFileChanges(mergeResult.files);

	for (const file of mergeResult.files) {
		await storeFile(version.id, file, projectId);
	}

	// 7. Save assistant message with file changes
	await prisma.chat_messages.create({
		data: {
			project_id: projectId,
			version_id: version.id,
			role: "assistant",
			content: output.summary,
			file_changes: JSON.parse(JSON.stringify(fileChanges)),
		},
	});

	// 8. Update project status
	await prisma.projects.update({
		where: { id: projectId },
		data: { status: "generated" },
	});

	return {
		projectId,
		versionId: version.id,
		versionNumber,
		filesGenerated: mergeResult.files.length,
		summary: output.summary,
		fileChanges,
	};
}

/**
 * Apply surgical modifications to existing project (Refine phase)
 */
export async function generateRefine(
	input: GenerateRefineInput,
): Promise<RefineResult> {
	const { projectId, request } = input;

	// 1. Get project with latest version
	const project = await prisma.projects.findUnique({
		where: { id: projectId },
		include: {
			versions: {
				orderBy: { version_number: "desc" },
				take: 1,
				include: {
					files: true,
				},
			},
		},
	});

	if (!project) {
		throw new NotFoundError("Project");
	}

	const latestVersion = project.versions[0];
	if (!latestVersion) {
		throw new AppError(
			"No versions found for this project",
			500,
			"NO_VERSIONS",
		);
	}

	// 2. Build context from existing files
	const existingFiles: GeneratedFile[] = latestVersion.files.map((f) => ({
		path: f.path,
		content: f.content,
		source: f.file_source as "template" | "ai_generated" | "modified",
	}));

	// 3. Build refine prompt and call Claude
	const prompt = buildRefinePrompt({
		userRequest: request,
		existingFiles,
		projectContext: project.description,
	});

	const response = await sendMessage({
		messages: [{ role: "user", content: prompt }],
		system: `You are MoonForge, an expert fullstack developer AI. Make surgical, precise modifications to existing monorepo structures. Always return valid JSON.`,
	});

	// 4. Parse Claude response
	const output = parseClaudeResponse(response.content);

	// 5. Get next version number
	const versionNumber = latestVersion.version_number + 1;

	// 6. Create new version
	const version = await prisma.project_versions.create({
		data: {
			project_id: projectId,
			version_number: versionNumber,
			label: `Refine: ${request.slice(0, 50)}${request.length > 50 ? "..." : ""}`,
		},
	});

	// 7. Copy existing files to new version
	await copyFilesToVersion(latestVersion.id, version.id, projectId);

	// 8. Merge and apply AI changes
	const _mergedFiles = mergeForRefine(existingFiles, output.files);

	// Track file changes for chat message
	const fileChanges = extractFileChanges(output.files);

	// Delete and re-create files that were modified
	for (const file of output.files) {
		const normalizedPath = normalizePath(file.path);

		// Check if file exists in current version
		const existing = await prisma.project_files.findUnique({
			where: {
				version_id_path: {
					version_id: version.id,
					path: normalizedPath,
				},
			},
		});

		if (existing) {
			// Update existing file
			await prisma.project_files.update({
				where: { id: existing.id },
				data: {
					content: file.content,
					file_source: "modified",
				},
			});
		} else {
			// Create new file
			await storeFile(version.id, { ...file, source: "modified" }, projectId);
		}
	}

	// 9. Save assistant message with file changes
	await prisma.chat_messages.create({
		data: {
			project_id: projectId,
			version_id: version.id,
			role: "assistant",
			content: output.summary,
			file_changes: JSON.parse(JSON.stringify(fileChanges)),
		},
	});

	// 10. Auto-update shared types if Prisma schema changed
	await autoUpdateSharedTypes(projectId, version.id, output.files);

	// 11. Update project status
	await prisma.projects.update({
		where: { id: projectId },
		data: { status: "refined" },
	});

	return {
		projectId,
		versionId: version.id,
		versionNumber,
		filesChanged: output.files.length,
		summary: output.summary,
		fileChanges,
	};
}

// ============================================================================
// Auto-Update Shared Types
// ============================================================================

/**
 * Auto-update shared types when Prisma schema changes
 * PRD Section 7.2: "Auto-update shared types setiap ada perubahan Prisma schema"
 */
async function autoUpdateSharedTypes(
	projectId: string,
	versionId: string,
	files: GeneratedFile[],
): Promise<void> {
	// Check if Prisma schema was modified
	const prismaSchemaFile = files.find(
		(f) => f.path === "apps/api/prisma/schema.prisma",
	);

	if (!prismaSchemaFile) {
		return;
	}

	// Find the types/index.ts file in the output
	const typesIndexFile = files.find(
		(f) => f.path === "packages/types/src/index.ts",
	);

	// If there's a types file, regenerate it based on the new schema
	if (prismaSchemaFile?.content) {
		const generatedTypes = generateTypesFromSchema(prismaSchemaFile.content);

		if (typesIndexFile) {
			// Update existing types file
			await prisma.project_files.updateMany({
				where: {
					project_id: projectId,
					version_id: versionId,
					path: "packages/types/src/index.ts",
				},
				data: { content: generatedTypes, file_source: "modified" },
			});
		} else {
			// Create new types file
			await prisma.project_files.create({
				data: {
					project_id: projectId,
					version_id: versionId,
					path: "packages/types/src/index.ts",
					content: generatedTypes,
					file_source: "modified",
				},
			});
		}
	}
}

/**
 * Generate TypeScript types from Prisma schema content
 * Basic implementation - extracts models and generates types
 */
function generateTypesFromSchema(schemaContent: string): string {
	const lines = schemaContent.split("\n");
	const models: string[] = [];
	let currentModel: string | null = null;
	let inModel = false;

	// Extract model names from schema
	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed.startsWith("model ") && trimmed.endsWith("{")) {
			const modelName = trimmed.replace("model ", "").replace("{", "").trim();
			currentModel = modelName;
			inModel = true;
		} else if (trimmed === "}") {
			if (inModel && currentModel) {
				models.push(currentModel);
			}
			inModel = false;
			currentModel = null;
		}
	}

	// Generate TypeScript types
	const typeDefinitions = models
		.map((model) => {
			const typeName = model.charAt(0).toUpperCase() + model.slice(1);
			return `export type ${typeName} = {\n  id: string;\n  [key: string]: unknown;\n};\n`;
		})
		.join("\n");

	return `/**
 * Auto-generated types from Prisma schema
 * This file is auto-updated when the Prisma schema changes
 */

// Re-export Prisma types
${typeDefinitions}

// Utility types
export type Json = Record<string, unknown>;

export type PaginatedResult<T> = {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    nextCursor: string | null;
    hasMore: boolean;
  };
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    timestamp: string;
  };
};
`;
}
