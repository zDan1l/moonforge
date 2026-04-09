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

// ============================================================================
// Diff Types
// ============================================================================

export interface FileDiff {
	path: string;
	status: "added" | "deleted" | "modified" | "unchanged";
	baseContent: string | null;
	targetContent: string | null;
	lineDiff?: LineDiff[];
}

export interface LineDiff {
	type: "added" | "removed" | "unchanged";
	content: string;
	lineNumber: number | null;
}

export interface DiffResult {
	baseVersionId: string;
	targetVersionId: string;
	versionNumber: number;
	projectId: string;
	files: FileDiff[];
	summary: {
		total: number;
		added: number;
		deleted: number;
		modified: number;
		unchanged: number;
	};
}

// ============================================================================
// Diff Functions
// ============================================================================

/**
 * Get file diff between two versions
 */
export async function getFileDiff(
	projectId: string,
	baseVersionId: string,
	targetVersionId: string,
	filePath: string,
): Promise<FileDiff> {
	// Get both versions to verify they exist
	const [baseVersion, targetVersion] = await Promise.all([
		prisma.project_versions.findUnique({ where: { id: baseVersionId } }),
		prisma.project_versions.findUnique({ where: { id: targetVersionId } }),
	]);

	if (!baseVersion || !targetVersion) {
		throw new NotFoundError("Version");
	}

	// Fetch file from both versions
	const [baseFile, targetFile] = await Promise.all([
		prisma.project_files.findFirst({
			where: {
				project_id: projectId,
				version_id: baseVersionId,
				path: filePath,
			},
		}),
		prisma.project_files.findFirst({
			where: {
				project_id: projectId,
				version_id: targetVersionId,
				path: filePath,
			},
		}),
	]);

	const baseContent = baseFile?.content ?? null;
	const targetContent = targetFile?.content ?? null;

	// Determine status
	let status: FileDiff["status"];
	if (!baseFile && targetFile) {
		status = "added";
	} else if (baseFile && !targetFile) {
		status = "deleted";
	} else if (baseContent === targetContent) {
		status = "unchanged";
	} else {
		status = "modified";
	}

	// Compute line diff if modified
	let lineDiff: LineDiff[] | undefined;
	if (status === "modified" && baseContent && targetContent) {
		lineDiff = computeLineDiff(baseContent, targetContent);
	}

	return {
		path: filePath,
		status,
		baseContent,
		targetContent,
		lineDiff,
	};
}

/**
 * Get all file diffs between two versions
 */
export async function getVersionDiff(
	projectId: string,
	baseVersionId: string,
	targetVersionId: string,
): Promise<Omit<DiffResult, "versionNumber">> {
	// Verify versions exist and belong to project
	const [baseVersion, targetVersion] = await Promise.all([
		prisma.project_versions.findUnique({
			where: { id: baseVersionId, project_id: projectId },
		}),
		prisma.project_versions.findUnique({
			where: { id: targetVersionId, project_id: projectId },
		}),
	]);

	if (!baseVersion || !targetVersion) {
		throw new NotFoundError("Version");
	}

	// Get all files from both versions
	const [baseFiles, targetFiles] = await Promise.all([
		prisma.project_files.findMany({
			where: { version_id: baseVersionId },
			select: { path: true, content: true },
		}),
		prisma.project_files.findMany({
			where: { version_id: targetVersionId },
			select: { path: true, content: true },
		}),
	]);

	const baseMap = new Map(baseFiles.map((f) => [f.path, f.content]));
	const targetMap = new Map(targetFiles.map((f) => [f.path, f.content]));

	// Collect all unique paths
	const allPaths = new Set([...baseMap.keys(), ...targetMap.keys()]);

	// Compute diff for each file
	const files: FileDiff[] = [];
	let added = 0;
	let deleted = 0;
	let modified = 0;
	let unchanged = 0;

	for (const path of Array.from(allPaths).sort()) {
		const baseContent = baseMap.get(path) ?? null;
		const targetContent = targetMap.get(path) ?? null;

		let status: FileDiff["status"];
		let lineDiff: LineDiff[] | undefined;

		if (baseContent === null && targetContent !== null) {
			status = "added";
			added++;
		} else if (baseContent !== null && targetContent === null) {
			status = "deleted";
			deleted++;
		} else if (baseContent === targetContent) {
			status = "unchanged";
			unchanged++;
		} else {
			status = "modified";
			modified++;
			if (baseContent && targetContent) {
				lineDiff = computeLineDiff(baseContent, targetContent);
			}
		}

		files.push({ path, status, baseContent, targetContent, lineDiff });
	}

	return {
		baseVersionId,
		targetVersionId,
		projectId,
		files,
		summary: {
			total: files.length,
			added,
			deleted,
			modified,
			unchanged,
		},
	};
}

/**
 * Compute line-by-line diff between two content strings
 */
function computeLineDiff(
	baseContent: string,
	targetContent: string,
): LineDiff[] {
	const baseLines = baseContent.split("\n");
	const targetLines = targetContent.split("\n");
	const result: LineDiff[] = [];

	// Simple line diff algorithm
	let baseIdx = 0;
	let targetIdx = 0;

	while (baseIdx < baseLines.length || targetIdx < targetLines.length) {
		if (baseIdx >= baseLines.length) {
			// Remaining lines are added
			result.push({
				type: "added",
				content: targetLines[targetIdx],
				lineNumber: null,
			});
			targetIdx++;
		} else if (targetIdx >= targetLines.length) {
			// Remaining lines are removed
			result.push({
				type: "removed",
				content: baseLines[baseIdx],
				lineNumber: null,
			});
			baseIdx++;
		} else if (baseLines[baseIdx] === targetLines[targetIdx]) {
			// Lines match
			result.push({
				type: "unchanged",
				content: baseLines[baseIdx],
				lineNumber: baseIdx + 1,
			});
			baseIdx++;
			targetIdx++;
		} else {
			// Lines differ - mark both (simple approach)
			result.push({
				type: "removed",
				content: baseLines[baseIdx],
				lineNumber: baseIdx + 1,
			});
			result.push({
				type: "added",
				content: targetLines[targetIdx],
				lineNumber: null,
			});
			baseIdx++;
			targetIdx++;
		}
	}

	return result;
}
