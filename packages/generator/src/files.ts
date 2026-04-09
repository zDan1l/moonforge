/**
 * File Storage & Template Merge Utilities
 *
 * Handles merging AI-generated files with template base,
 * and utilities for storing files to database.
 */

import type { GeneratedFile } from "./index.js";
import { loadTemplateFiles } from "./template-loader.js";

// ============================================================================
// Types
// ============================================================================

export interface TemplateFile {
	path: string;
	content: string;
	isBinary?: boolean;
}

export interface MergeOptions {
	/**
	 * AI-generated files take priority over template files
	 */
	aiPriority?: boolean;
}

export interface MergeResult {
	files: GeneratedFile[];
	templateCount: number;
	aiCount: number;
	mergedCount: number;
}

// ============================================================================
// Template Merge
// ============================================================================

/**
 * Merge AI-generated files with template base
 *
 * AI files override template files on same path.
 * Template files are included for paths not in AI output.
 */
export async function mergeWithTemplate(
	aiFiles: GeneratedFile[],
	_options: MergeOptions = {},
): Promise<MergeResult> {
	// Load all template files
	const templateFiles = await loadTemplateFiles();

	// Create a map of AI files for quick lookup
	const aiFileMap = new Map<string, GeneratedFile>();
	for (const file of aiFiles) {
		aiFileMap.set(file.path, file);
	}

	// Merge: AI files take priority, template files fill gaps
	const mergedFiles: GeneratedFile[] = [];
	const templatePaths = new Set<string>();

	for (const template of templateFiles) {
		templatePaths.add(template.path);

		// Skip if AI has a file at this path (AI priority)
		if (aiFileMap.has(template.path)) {
			continue;
		}

		// Add template file
		mergedFiles.push({
			path: template.path,
			content: template.content,
			source: "template",
			isBinary: template.isBinary ?? false,
		});
	}

	// Add all AI files
	for (const aiFile of aiFiles) {
		const source = templatePaths.has(aiFile.path)
			? ("modified" as const)
			: aiFile.source;

		mergedFiles.push({
			...aiFile,
			source,
		});
	}

	return {
		files: mergedFiles,
		templateCount: templateFiles.length,
		aiCount: aiFiles.length,
		mergedCount: mergedFiles.length,
	};
}

/**
 * Merge files for refine phase
 * Existing files are preserved, only new/modified files from AI
 */
export function mergeForRefine(
	existingFiles: GeneratedFile[],
	aiFiles: GeneratedFile[],
): GeneratedFile[] {
	// Create a map of existing files
	const existingMap = new Map<string, GeneratedFile>();
	for (const file of existingFiles) {
		existingMap.set(file.path, file);
	}

	// Create a map of AI files
	const aiFileMap = new Map<string, GeneratedFile>();
	for (const file of aiFiles) {
		aiFileMap.set(file.path, file);
	}

	// Start with all existing files
	const result: GeneratedFile[] = [...existingFiles];

	// Update or add files from AI
	for (const [path, aiFile] of aiFileMap) {
		if (existingMap.has(path)) {
			// Update existing file
			const index = result.findIndex((f) => f.path === path);
			if (index !== -1) {
				result[index] = {
					...aiFile,
					source: "modified" as const,
				};
			}
		} else {
			// Add new file
			result.push({
				...aiFile,
				source:
					aiFile.source === "template"
						? ("ai_generated" as const)
						: aiFile.source,
			});
		}
	}

	return result;
}

// ============================================================================
// File Path Utilities
// ============================================================================

/**
 * Normalize file path for consistent storage
 */
export function normalizePath(path: string): string {
	return path.replace(/\\/g, "/").replace(/^\//, "");
}

/**
 * Validate file path is safe (no path traversal)
 */
export function isValidPath(path: string): boolean {
	const normalized = normalizePath(path);

	// Check for path traversal attempts
	if (normalized.includes("..")) {
		return false;
	}

	// Check for absolute paths
	if (normalized.startsWith("/")) {
		return false;
	}

	// Check for invalid characters
	const invalidChars = /[<>:"|?*]/;
	if (invalidChars.test(normalized)) {
		return false;
	}

	// Check for control characters (0x00-0x1F)
	for (const char of normalized) {
		const code = char.charCodeAt(0);
		if (code < 32) {
			return false;
		}
	}

	return true;
}

/**
 * Get file extension from path
 */
export function getFileExtension(path: string): string {
	const parts = path.split(".");
	return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "";
}

/**
 * Determine if file is binary based on extension
 */
export function isBinaryFile(path: string): boolean {
	const binaryExtensions = [
		"ico",
		"png",
		"jpg",
		"jpeg",
		"gif",
		"webp",
		"woff",
		"woff2",
		"ttf",
		"eot",
	];
	const ext = getFileExtension(path);
	return binaryExtensions.includes(ext);
}

// ============================================================================
// File Content Utilities
// ============================================================================

/**
 * Encode binary content to base64
 */
export function encodeBinaryContent(buffer: Buffer): string {
	return buffer.toString("base64");
}

/**
 * Decode binary content from base64
 */
export function decodeBinaryContent(base64: string): Buffer {
	return Buffer.from(base64, "base64");
}

/**
 * Validate file content is not empty
 */
export function isNotEmpty(content: string): boolean {
	return content.trim().length > 0;
}

/**
 * Truncate content for preview
 */
export function truncateContent(content: string, maxLength = 100): string {
	if (content.length <= maxLength) {
		return content;
	}
	return `${content.slice(0, maxLength)}...`;
}

// ============================================================================
// File Summary Utilities
// ============================================================================

export interface FileSummary {
	totalFiles: number;
	bySource: {
		template: number;
		ai_generated: number;
		modified: number;
	};
	byExtension: Record<string, number>;
	binaryFiles: number;
}

/**
 * Generate summary of files
 */
export function summarizeFiles(files: GeneratedFile[]): FileSummary {
	const summary: FileSummary = {
		totalFiles: files.length,
		bySource: {
			template: 0,
			ai_generated: 0,
			modified: 0,
		},
		byExtension: {},
		binaryFiles: 0,
	};

	for (const file of files) {
		// Count by source
		summary.bySource[file.source]++;

		// Count by extension
		const ext = getFileExtension(file.path);
		summary.byExtension[ext] = (summary.byExtension[ext] || 0) + 1;

		// Count binary files
		if (file.isBinary || isBinaryFile(file.path)) {
			summary.binaryFiles++;
		}
	}

	return summary;
}
