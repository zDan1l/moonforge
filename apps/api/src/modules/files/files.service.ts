/**
 * Files Service
 *
 * Business logic for file retrieval and download operations.
 */

import type { GeneratedFile } from "@moonforge/generator/index.js";
import { createProjectZip } from "@moonforge/generator/zipper.js";
import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../middleware/error-handler.js";

// ============================================================================
// Types
// ============================================================================

export interface FileTreeNode {
	name: string;
	path: string;
	type: "file" | "directory";
	source: "template" | "ai_generated" | "modified";
	children?: FileTreeNode[];
}

export interface FileContent {
	path: string;
	content: string;
	source: "template" | "ai_generated" | "modified";
	isBinary: boolean;
}

export interface ListFilesOptions {
	projectId: string;
	versionId?: string;
	directory?: string;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Ensure project exists
 */
async function ensureProjectExists(projectId: string): Promise<void> {
	const project = await prisma.projects.findUnique({
		where: { id: projectId },
		select: { id: true },
	});

	if (!project) {
		throw new NotFoundError("Project");
	}
}

/**
 * Get the latest version for a project
 */
export async function getLatestVersion(projectId: string): Promise<{
	id: string;
	versionNumber: number;
}> {
	const version = await prisma.project_versions.findFirst({
		where: { project_id: projectId },
		orderBy: { version_number: "desc" },
		select: {
			id: true,
			version_number: true,
		},
	});

	if (!version) {
		throw new NotFoundError("Version");
	}

	return { id: version.id, versionNumber: version.version_number };
}

/**
 * Build a tree structure from flat file list
 */
function buildFileTree(
	files: Array<{ path: string; source: string; isBinary?: boolean }>,
): FileTreeNode[] {
	const tree = new Map<string, FileTreeNode>();

	// First pass: create all nodes
	for (const file of files) {
		const parts = file.path.split("/");
		let currentPath = "";

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isLast = i === parts.length - 1;
			const parentPath = currentPath;
			currentPath = currentPath ? `${currentPath}/${part}` : part;

			if (!tree.has(currentPath)) {
				const node: FileTreeNode = {
					name: part,
					path: currentPath,
					type: isLast ? "file" : ("directory" as const),
					source: isLast
						? (file.source as "template" | "ai_generated" | "modified")
						: ("template" as const),
					children: isLast ? undefined : [],
				};

				if (isLast) {
					node.source = file.source as "template" | "ai_generated" | "modified";
				}

				tree.set(currentPath, node);

				// Add to parent's children
				if (parentPath && tree.has(parentPath)) {
					const parentNode = tree.get(parentPath);
					if (parentNode?.children) {
						parentNode.children.push(node);
					}
				}
			}
		}
	}

	// Return only root level nodes (files/folders without "/" in path except first level)
	return Array.from(tree.values()).filter(
		(node) => !node.path.includes("/") || node.path.split("/").length === 1,
	);
}

/**
 * List files for a project as a tree structure
 */
export async function listFiles(
	options: ListFilesOptions,
): Promise<FileTreeNode[]> {
	const { projectId, versionId, directory } = options;

	// Ensure project exists
	await ensureProjectExists(projectId);

	// Get version (use latest if not specified)
	let targetVersionId = versionId;
	if (!targetVersionId) {
		const latest = await getLatestVersion(projectId);
		targetVersionId = latest.id;
	}

	// Fetch files from database
	const files = await prisma.project_files.findMany({
		where: {
			project_id: projectId,
			version_id: targetVersionId,
		},
		select: {
			path: true,
			file_source: true,
		},
		orderBy: { path: "asc" },
	});

	// Filter by directory if specified
	let filteredFiles = files;
	if (directory) {
		filteredFiles = files.filter((f) =>
			f.path.startsWith(directory.endsWith("/") ? directory : `${directory}/`),
		);
	}

	// Build tree structure
	const tree = buildFileTree(
		filteredFiles.map((f) => ({
			path: f.path,
			source: f.file_source as "template" | "ai_generated" | "modified",
		})),
	);

	return tree;
}

/**
 * Get a single file's content
 */
export async function getFile(
	projectId: string,
	filePath: string,
	versionId?: string,
): Promise<FileContent> {
	// Ensure project exists
	await ensureProjectExists(projectId);

	// Get version (use latest if not specified)
	let targetVersionId = versionId;
	if (!targetVersionId) {
		const latest = await getLatestVersion(projectId);
		targetVersionId = latest.id;
	}

	// Fetch file
	const file = await prisma.project_files.findFirst({
		where: {
			project_id: projectId,
			version_id: targetVersionId,
			path: filePath,
		},
	});

	if (!file) {
		throw new NotFoundError("File");
	}

	// Determine if binary (simple check based on extension)
	const binaryExtensions = [
		".ico",
		".png",
		".jpg",
		".jpeg",
		".gif",
		".webp",
		".woff",
		".woff2",
		".ttf",
		".eot",
	];
	const isBinary = binaryExtensions.some((ext) =>
		file.path.toLowerCase().endsWith(ext),
	);

	return {
		path: file.path,
		content: file.content,
		source: file.file_source as "template" | "ai_generated" | "modified",
		isBinary,
	};
}

/**
 * Generate a zip file for a project version
 */
export async function generateProjectZip(
	projectId: string,
	versionId?: string,
): Promise<{
	zipBuffer: Buffer;
	filename: string;
	metadata: {
		generatedAt: string;
		projectName: string;
		versionNumber: number;
		totalFiles: number;
	};
}> {
	// Ensure project exists
	const project = await prisma.projects.findUnique({
		where: { id: projectId },
		select: { name: true },
	});

	if (!project) {
		throw new NotFoundError("Project");
	}

	// Get version (use latest if not specified)
	let targetVersionId = versionId;
	let versionNumber = 1;

	if (!targetVersionId) {
		const latest = await getLatestVersion(projectId);
		targetVersionId = latest.id;
		versionNumber = latest.versionNumber;
	} else {
		const version = await prisma.project_versions.findFirst({
			where: { id: targetVersionId },
			select: { version_number: true },
		});
		if (version) {
			versionNumber = version.version_number;
		}
	}

	// Fetch all files for the version
	const files = await prisma.project_files.findMany({
		where: {
			project_id: projectId,
			version_id: targetVersionId,
		},
		select: {
			path: true,
			content: true,
			file_source: true,
		},
	});

	// Convert to GeneratedFile format
	const generatedFiles: GeneratedFile[] = files.map((f) => ({
		path: f.path,
		content: f.content,
		source: f.file_source as "template" | "ai_generated" | "modified",
		isBinary: false, // We'll detect this in the zipper
	}));

	// Create zip
	const zipBuffer = createProjectZip(generatedFiles, project.name);

	// Sanitize project name for filename
	const sanitizedName = project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

	return {
		zipBuffer,
		filename: `${sanitizedName}-v${versionNumber}.zip`,
		metadata: {
			generatedAt: new Date().toISOString(),
			projectName: project.name,
			versionNumber,
			totalFiles: files.length,
		},
	};
}

/**
 * Get file count for a project version
 */
export async function getFileCount(
	projectId: string,
	versionId?: string,
): Promise<number> {
	let targetVersionId = versionId;
	if (!targetVersionId) {
		const latest = await getLatestVersion(projectId);
		targetVersionId = latest.id;
	}

	const count = await prisma.project_files.count({
		where: {
			project_id: projectId,
			version_id: targetVersionId,
		},
	});

	return count;
}
