/**
 * Zip Creator
 * Creates downloadable .zip files from generated project files
 */

import AdmZip from "adm-zip";
import type { GeneratedFile } from "./index.js";

/**
 * Create a zip buffer from generated files
 *
 * @param files - Array of GeneratedFile objects
 * @param projectName - Name for the project folder inside zip
 * @returns Buffer containing the zip data
 */
export function createProjectZip(
	files: GeneratedFile[],
	projectName: string = "project",
): Buffer {
	const zip = new AdmZip();

	// Add metadata file
	const metadata = {
		generatedAt: new Date().toISOString(),
		generator: "@moonforge/generator",
		version: "1.0.0",
		totalFiles: files.length,
		files: files.map((f) => ({
			path: f.path,
			source: f.source,
			isBinary: f.isBinary,
		})),
	};
	zip.addFile(
		`${projectName}/.moonforge.json`,
		Buffer.from(JSON.stringify(metadata, null, 2)),
		"MoonForge metadata",
	);

	// Add all files to zip
	for (const file of files) {
		const fullPath = `${projectName}/${file.path}`;

		if (file.isBinary && file.content) {
			// Decode base64 for binary files
			const buffer = Buffer.from(file.content, "base64");
			zip.addFile(fullPath, buffer, `${file.path} (binary)`);
		} else {
			// Add text files directly - convert to Buffer
			zip.addFile(fullPath, Buffer.from(file.content), `${file.path}`);
		}
	}

	return zip.toBuffer();
}

/**
 * Get zip file metadata without creating the zip
 */
export function getZipMetadata(files: GeneratedFile[]): {
	totalFiles: number;
	totalSize: number;
	bySource: {
		template: number;
		ai_generated: number;
		modified: number;
	};
	binaryFiles: number;
} {
	const stats: {
		totalFiles: number;
		totalSize: number;
		bySource: { template: number; ai_generated: number; modified: number };
		binaryFiles: number;
	} = {
		totalFiles: files.length,
		totalSize: 0,
		bySource: {
			template: 0,
			ai_generated: 0,
			modified: 0,
		},
		binaryFiles: 0,
	};

	for (const file of files) {
		if (file.isBinary) {
			// Estimate binary size from base64
			stats.totalSize += Math.ceil((file.content.length * 3) / 4);
			stats.binaryFiles++;
		} else {
			stats.totalSize += Buffer.byteLength(file.content, "utf8");
		}

		// Increment by source type
		if (file.source === "template") stats.bySource.template++;
		else if (file.source === "ai_generated") stats.bySource.ai_generated++;
		else if (file.source === "modified") stats.bySource.modified++;
	}

	return stats;
}

/**
 * Write zip to a file path (Node.js only)
 */
export async function writeZipToFile(
	files: GeneratedFile[],
	outputPath: string,
	projectName: string = "project",
): Promise<void> {
	const { writeFile } = await import("node:fs/promises");
	const zipBuffer = createProjectZip(files, projectName);
	await writeFile(outputPath, zipBuffer);
}

/**
 * Extract files from a zip buffer
 */
export function extractFromZip(zipBuffer: Buffer): {
	files: GeneratedFile[];
	metadata: {
		generatedAt: string;
		generator: string;
		version: string;
		totalFiles: number;
	} | null;
} {
	const zip = new AdmZip(zipBuffer);
	const entries = zip.getEntries();

	const files: GeneratedFile[] = [];
	let metadata: {
		generatedAt: string;
		generator: string;
		version: string;
		totalFiles: number;
	} | null = null;

	for (const entry of entries) {
		// Skip directories
		if (entry.isDirectory) continue;

		// Extract metadata file
		if (entry.entryName.endsWith(".moonforge.json")) {
			try {
				const content = zip.readAsText(entry);
				metadata = JSON.parse(content);
			} catch {
				// Ignore invalid metadata
			}
			continue;
		}

		// Remove project name prefix from path
		const pathParts = entry.entryName.split("/");
		if (pathParts.length > 1) {
			pathParts.shift(); // Remove project name
		}
		const relativePath = pathParts.join("/");

		// Determine if binary
		const binaryExtensions = [
			".ico",
			".png",
			".jpg",
			".jpeg",
			".gif",
			".webp",
			".woff",
			".woff2",
		];
		const isBinary = binaryExtensions.some((ext) => relativePath.endsWith(ext));

		let content: string;
		if (isBinary) {
			content = entry.getData().toString("base64");
		} else {
			content = zip.readAsText(entry);
		}

		files.push({
			path: relativePath,
			content,
			source: "template", // Default, will be updated from metadata
			isBinary,
		});
	}

	return { files, metadata };
}

/**
 * Validate zip buffer
 */
export function isValidZip(buffer: Buffer): boolean {
	try {
		const zip = new AdmZip(buffer);
		const entries = zip.getEntries();
		return entries.length > 0;
	} catch {
		return false;
	}
}
