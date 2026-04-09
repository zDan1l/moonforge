/**
 * Template Loader
 * Functions for loading template files from the filesystem
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative, resolve } from "node:path";
import type { GeneratedFile } from "./index.js";

const TEMPLATE_BASE_PATH = resolve(import.meta.dirname, "templates");

// Binary file extensions to preserve as buffers
const BINARY_EXTENSIONS = new Set([
	".ico",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".svg",
	".webp",
	".woff",
	".woff2",
	".ttf",
	".eot",
	".otf",
	".pdf",
	".zip",
]);

/**
 * Check if a file extension is binary
 */
function isBinaryFile(filePath: string): boolean {
	const ext = filePath.toLowerCase();
	return BINARY_EXTENSIONS.has(ext);
}

/**
 * Validate that a path is safe (no directory traversal)
 */
function validatePath(basePath: string, targetPath: string): boolean {
	const resolved = resolve(basePath, targetPath);
	return resolved.startsWith(basePath);
}

/**
 * Load all files from a directory recursively
 */
async function loadDirectory(
	dirPath: string,
	basePath: string,
): Promise<GeneratedFile[]> {
	const files: GeneratedFile[] = [];

	try {
		const entries = await readdir(dirPath, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = join(dirPath, entry.name);
			const relativePath = relative(basePath, fullPath);

			// Skip hidden files and directories
			if (entry.name.startsWith(".")) {
				continue;
			}

			if (entry.isDirectory()) {
				// Recursively load subdirectory
				const subFiles = await loadDirectory(fullPath, basePath);
				files.push(...subFiles);
			} else if (entry.isFile()) {
				files.push(await loadFile(fullPath, relativePath));
			}
		}
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return [];
		}
		throw error;
	}

	return files;
}

/**
 * Load a single file
 */
async function loadFile(
	filePath: string,
	relativePath: string,
): Promise<GeneratedFile> {
	const binary = isBinaryFile(filePath);

	if (binary) {
		const buffer = await readFile(filePath);
		return {
			path: relativePath,
			content: buffer.toString("base64"),
			source: "template",
			isBinary: true,
		};
	}

	const content = await readFile(filePath, "utf-8");
	return {
		path: relativePath,
		content,
		source: "template",
		isBinary: false,
	};
}

/**
 * Load all template files from the templates directory
 */
export async function loadTemplateFiles(): Promise<GeneratedFile[]> {
	const basePath = TEMPLATE_BASE_PATH;
	return loadDirectory(basePath, basePath);
}

/**
 * Load template files for a specific component
 */
export async function loadTemplateComponent(
	component: "backend" | "frontend" | "root" | "types",
): Promise<GeneratedFile[]> {
	const componentPath = join(TEMPLATE_BASE_PATH, component);

	// Validate path to prevent directory traversal
	if (!validatePath(TEMPLATE_BASE_PATH, component)) {
		throw new Error(`Invalid component path: ${component}`);
	}

	return loadDirectory(componentPath, componentPath);
}

/**
 * Load a specific template file by path
 */
export async function loadTemplateFile(
	component: "backend" | "frontend" | "root" | "types",
	filePath: string,
): Promise<GeneratedFile | null> {
	const fullPath = join(TEMPLATE_BASE_PATH, component, filePath);

	// Validate path
	if (!validatePath(TEMPLATE_BASE_PATH, fullPath)) {
		throw new Error(`Invalid file path: ${filePath}`);
	}

	try {
		const fileStat = await stat(fullPath);

		if (!fileStat.isFile()) {
			return null;
		}

		const relativePath = join(component, filePath);
		return loadFile(fullPath, relativePath);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return null;
		}
		throw error;
	}
}

/**
 * Get the template base path (useful for debugging)
 */
export function getTemplateBasePath(): string {
	return TEMPLATE_BASE_PATH;
}

/**
 * Check if a template component exists
 */
export async function templateComponentExists(
	component: "backend" | "frontend" | "root" | "types",
): Promise<boolean> {
	const componentPath = join(TEMPLATE_BASE_PATH, component);

	try {
		const fileStat = await stat(componentPath);
		return fileStat.isDirectory();
	} catch {
		return false;
	}
}
