/**
 * Generate Service
 *
 * Orchestrates the Setup and Refine phases for monorepo generation.
 * Integrates with Claude AI and manages file storage.
 */

import {
	isValidPath,
	mergeForRefine,
	normalizePath,
} from "@moonforge/generator/files.js";
import type { GeneratedFile } from "@moonforge/generator/index.js";
import {
	buildRefinePrompt,
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

export interface ScanResult {
	projectId: string;
	versionId: string;
	analysis: string;
	models: string[];
	modules: string[];
	keyFiles: string[];
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

export interface GenerateScanInput {
	projectId: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse JSON from Claude response
 */
function parseClaudeResponse(content: string) {
	try {
		// Log response info for debugging
		console.log("[parseClaudeResponse] Response length:", content.length);
		console.log(
			"[parseClaudeResponse] Response preview (first 200 chars):",
			content.slice(0, 200),
		);
		console.log(
			"[parseClaudeResponse] Response preview (last 200 chars):",
			content.slice(-200),
		);

		// Try code block first
		const codeBlockMatch = content.match(/```json\n([\s\S]*?)\n```/);
		if (codeBlockMatch) {
			console.log(
				"[parseClaudeResponse] Found JSON code block, length:",
				codeBlockMatch[1].length,
			);
			const parsed = JSON.parse(codeBlockMatch[1]);
			return ClaudeOutputSchema.parse(parsed);
		}

		// Try plain JSON - find the opening { and matching closing }
		// This is more robust than greedy regex for large JSON
		const startIndex = content.indexOf("{");
		if (startIndex !== -1) {
			let depth = 0;
			let inString = false;
			let escapeNext = false;
			let endIndex = -1;

			for (let i = startIndex; i < content.length; i++) {
				const char = content[i];

				if (escapeNext) {
					escapeNext = false;
					continue;
				}

				if (char === "\\") {
					escapeNext = true;
					continue;
				}

				if (char === '"') {
					inString = !inString;
					continue;
				}

				if (!inString) {
					if (char === "{") {
						depth++;
					} else if (char === "}") {
						depth--;
						if (depth === 0) {
							endIndex = i;
							break;
						}
					}
				}
			}

			if (endIndex !== -1) {
				const jsonStr = content.slice(startIndex, endIndex + 1);
				console.log(
					"[parseClaudeResponse] Found plain JSON, length:",
					jsonStr.length,
				);
				const parsed = JSON.parse(jsonStr);
				return ClaudeOutputSchema.parse(parsed);
			}

			// If we couldn't find matching closing brace, JSON is truncated
			console.error(
				"[parseClaudeResponse] JSON appears to be truncated - no matching closing brace found",
			);
			console.error(
				"[parseClaudeResponse] This usually means maxTokens is too low",
			);
		}

		console.error("[parseClaudeResponse] No JSON found in response");
		console.error("[parseClaudeResponse] Full response:", content);
		throw new Error("No JSON found in response");
	} catch (error) {
		console.error("[parseClaudeResponse] Parse error:", error);
		if (error instanceof Error) {
			console.error("[parseClaudeResponse] Error message:", error.message);
			if (error.cause) {
				console.error("[parseClaudeResponse] Error cause:", error.cause);
			}
		}
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
 * Generate initial monorepo from template only (Setup phase - No AI)
 *
 * NEW FLOW: Template → Scan → Refine
 * This phase only copies template files without AI generation.
 * AI involvement happens in Scan and Refine phases.
 */
export async function generateSetup(
	input: GenerateSetupInput,
): Promise<SetupResult> {
	try {
		const { projectId, description } = input;
		console.log("[generateSetup] Starting for project:", projectId);

		// 1. Get project
		const project = await prisma.projects.findUnique({
			where: { id: projectId },
		});

		if (!project) {
			throw new NotFoundError("Project");
		}

		// 2. Load template files only (NO AI CALL)
		console.log("[generateSetup] Loading template files...");
		const { loadTemplateFiles } = await import(
			"@moonforge/generator/template-loader.js"
		);
		const templateFiles = await loadTemplateFiles();
		console.log(
			"[generateSetup] Loaded",
			templateFiles.length,
			"template files",
		);

		// 3. Get next version number
		const versionNumber = await getNextVersionNumber(projectId);

		// 4. Create new version
		const version = await prisma.project_versions.create({
			data: {
				project_id: projectId,
				version_number: versionNumber,
				label: "Template setup",
			},
		});

		// 5. Store template files directly
		const fileChanges: Record<
			string,
			{ path: string; change: "created" | "modified" | "deleted" }
		> = {};

		for (const file of templateFiles) {
			const normalizedPath = normalizePath(file.path);

			if (!isValidPath(normalizedPath)) {
				console.warn(`[generateSetup] Skipping invalid path: ${file.path}`);
				continue;
			}

			await prisma.project_files.create({
				data: {
					project_id: projectId,
					version_id: version.id,
					path: normalizedPath,
					content: file.content,
					file_source: "template",
				},
			});

			fileChanges[normalizedPath] = { path: normalizedPath, change: "created" };
		}

		// 6. Save system message about template creation
		const summary = `Project template initialized with ${templateFiles.length} files. Ready for scan and refinement.`;

		await prisma.chat_messages.create({
			data: {
				project_id: projectId,
				version_id: version.id,
				role: "assistant",
				content: summary,
				file_changes: JSON.parse(JSON.stringify(fileChanges)),
			},
		});

		// 7. Save user description as first message for context
		await prisma.chat_messages.create({
			data: {
				project_id: projectId,
				version_id: version.id,
				role: "user",
				content: `Project requirements: ${description}`,
			},
		});

		// 8. Update project status to "template" (new status before scan)
		await prisma.projects.update({
			where: { id: projectId },
			data: {
				status: "template",
				description: description, // Store description for later use
			},
		});

		return {
			projectId,
			versionId: version.id,
			versionNumber,
			filesGenerated: templateFiles.length,
			summary,
			fileChanges,
		};
	} catch (error) {
		console.error("[generateSetup] Error:", error);
		throw error;
	}
}

/**
 * Scan and analyze existing project structure (Scan phase)
 *
 * NEW FLOW: Template → Scan → Refine
 * This phase uses AI to analyze the template structure and understand
 * what exists, preparing context for subsequent refine operations.
 */
export async function generateScan(
	input: GenerateScanInput,
): Promise<ScanResult> {
	const { projectId } = input;
	console.log("[generateScan] Starting scan for project:", projectId);

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
			"No versions found for this project. Run setup first.",
			400,
			"NO_VERSIONS",
		);
	}

	// 2. Build context from existing files
	const existingFiles: GeneratedFile[] = latestVersion.files.map((f) => ({
		path: f.path,
		content: f.content,
		source: f.file_source as "template" | "ai_generated" | "modified",
	}));

	// 3. Build scan prompt and call Claude for analysis
	const scanPrompt = buildScanPrompt({
		existingFiles,
		projectDescription: project.description || undefined,
	});

	const response = await sendMessage({
		messages: [{ role: "user", content: scanPrompt }],
		system: `You are MoonForge, an expert fullstack developer AI. Analyze project structure and provide structured insights. Always return valid JSON.`,
	});

	// 4. Parse scan response
	const scanOutput = parseScanResponse(response.content);

	// 5. Update project status to "scanned"
	await prisma.projects.update({
		where: { id: projectId },
		data: { status: "scanned" },
	});

	// 6. Save scan result as context message
	await prisma.chat_messages.create({
		data: {
			project_id: projectId,
			version_id: latestVersion.id,
			role: "assistant",
			content: `Project scan complete: ${scanOutput.analysis}`,
		},
	});

	return {
		projectId,
		versionId: latestVersion.id,
		analysis: scanOutput.analysis,
		models: scanOutput.models,
		modules: scanOutput.modules,
		keyFiles: scanOutput.keyFiles,
	};
}

/**
 * Parse scan response from Claude
 */
function parseScanResponse(content: string): {
	analysis: string;
	models: string[];
	modules: string[];
	keyFiles: string[];
} {
	try {
		// Try code block first
		const codeBlockMatch = content.match(/```json\n([\s\S]*?)\n```/);
		if (codeBlockMatch) {
			return JSON.parse(codeBlockMatch[1]);
		}

		// Try plain JSON
		const jsonMatch = content.match(/({[\s\S]*})/);
		if (jsonMatch) {
			return JSON.parse(jsonMatch[1]);
		}

		// Fallback: return raw content as analysis
		return {
			analysis: content.slice(0, 500),
			models: [],
			modules: [],
			keyFiles: [],
		};
	} catch (error) {
		console.error("[parseScanResponse] Parse error:", error);
		return {
			analysis: "Failed to parse scan response",
			models: [],
			modules: [],
			keyFiles: [],
		};
	}
}

/**
 * Build scan prompt for AI analysis
 */
function buildScanPrompt(options: {
	existingFiles: GeneratedFile[];
	projectDescription?: string;
}): string {
	const { existingFiles, projectDescription } = options;

	// Filter to key files for analysis
	const keyFiles = existingFiles.filter(
		(f) =>
			f.path.includes("schema.prisma") ||
			f.path.includes("package.json") ||
			f.path.endsWith(".routes.ts") ||
			f.path.endsWith(".service.ts") ||
			f.path.includes("index.ts"),
	);

	let prompt = `Analyze this MoonForge monorepo project structure and provide a structured summary.

## Task
Read the existing files and identify:
1. What Prisma models are defined (or if schema is empty)
2. What API modules exist (routes/services)
3. Key configuration files
4. Current project state (ready for what features?)

## Output Format
Return ONLY valid JSON:
{
  "analysis": "Brief summary of project state and readiness",
  "models": ["ModelName1", "ModelName2"],
  "modules": ["users", "products"],
  "keyFiles": ["prisma/schema.prisma", "apps/api/src/index.ts"]
}`;

	if (projectDescription) {
		prompt += `\n\n## Project Requirements\n${projectDescription}`;
	}

	prompt += `\n\n## Existing Files (${keyFiles.length} key files of ${existingFiles.length} total)\n`;

	for (const file of keyFiles.slice(0, 15)) {
		prompt += `\n### File: ${file.path}\n\`\`\`\n${file.content.slice(0, 1000)}\n\`\`\`\n`;
	}

	prompt += "\n\nProvide your analysis now. Return ONLY valid JSON.";

	return prompt;
}

/**
 * Apply surgical modifications to existing project (Refine phase)
 *
 * ENHANCED: Can now generate new modules or modify existing ones
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
