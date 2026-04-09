/**
 * Files Routes
 *
 * API endpoints for file retrieval and download operations.
 * GET /api/projects/:projectId/files - List files as tree
 * GET /api/projects/:projectId/files/* - Get file content
 * GET /api/projects/:projectId/download - Download project as zip
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { success } from "../../lib/response.js";
import {
	diffQuerySchema,
	downloadQuerySchema,
	filePathParamSchema,
	listFilesQuerySchema,
	projectIdParamSchema,
} from "./files.schema.js";
import {
	generateProjectZip,
	getFile,
	getFileCount,
	getFileDiff,
	getVersionDiff,
	listFiles,
} from "./files.service.js";

const files = new Hono();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/projects/:projectId/files
 *
 * List files for a project as a tree structure.
 *
 * @example
 * Request: GET /api/projects/123/files?versionId=abc
 * Response (200):
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "name": "apps",
 *       "type": "directory",
 *       "children": [...]
 *     }
 *   ]
 * }
 */
files.get(
	"/:projectId/files",
	zValidator("param", projectIdParamSchema),
	zValidator("query", listFilesQuerySchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { versionId, directory } = c.req.valid("query");

		const tree = await listFiles({
			projectId,
			versionId,
			directory,
		});

		return c.json(success(tree), 200);
	},
);

/**
 * GET /api/projects/:projectId/files/:path
 *
 * Get a single file's content.
 *
 * @example
 * Request: GET /api/projects/123/files/apps/api/src/index.ts
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "path": "apps/api/src/index.ts",
 *     "content": "...",
 *     "source": "ai_generated",
 *     "isBinary": false
 *   }
 * }
 */
files.get(
	"/:projectId/files/:path",
	zValidator("param", filePathParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { path } = c.req.valid("param");
		const versionId = c.req.query("versionId");

		const file = await getFile(projectId, path, versionId);

		return c.json(success(file), 200);
	},
);

/**
 * GET /api/projects/:projectId/download
 *
 * Download project as a zip file.
 *
 * @example
 * Request: GET /api/projects/123/download?versionId=abc
 * Response: Binary zip file with Content-Disposition header
 */
files.get(
	"/:projectId/download",
	zValidator("param", projectIdParamSchema),
	zValidator("query", downloadQuerySchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { versionId } = c.req.valid("query");

		const { zipBuffer, filename, metadata } = await generateProjectZip(
			projectId,
			versionId,
		);

		// Set headers for download
		c.header("Content-Type", "application/zip");
		c.header("Content-Disposition", `attachment; filename="${filename}"`);
		c.header("X-Metadata", JSON.stringify(metadata));

		return c.body(zipBuffer as unknown as ArrayBuffer);
	},
);

/**
 * GET /api/projects/:projectId/files-count
 *
 * Get the total number of files in a project version.
 *
 * @example
 * Request: GET /api/projects/123/files-count
 * Response (200):
 * {
 *   "success": true,
 *   "data": { "count": 42 }
 * }
 */
files.get(
	"/:projectId/files-count",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const versionId = c.req.query("versionId");

		const count = await getFileCount(projectId, versionId);

		return c.json(success({ count }), 200);
	},
);

/**
 * GET /api/projects/:projectId/diff
 *
 * Get diff between two versions of a project.
 *
 * @example
 * Request: GET /api/projects/123/diff?baseVersionId=abc&targetVersionId=def
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "baseVersionId": "abc",
 *     "targetVersionId": "def",
 *     "files": [...],
 *     "summary": { "total": 10, "added": 2, "deleted": 0, "modified": 3, "unchanged": 5 }
 *   }
 * }
 */
files.get(
	"/:projectId/diff",
	zValidator("param", projectIdParamSchema),
	zValidator("query", diffQuerySchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { baseVersionId, targetVersionId, filePath } = c.req.valid("query");

		if (filePath) {
			// Single file diff
			const diff = await getFileDiff(
				projectId,
				baseVersionId,
				targetVersionId,
				filePath,
			);
			return c.json(success(diff), 200);
		}

		// Full version diff
		const diff = await getVersionDiff(
			projectId,
			baseVersionId,
			targetVersionId,
		);
		return c.json(success(diff), 200);
	},
);

export default files;
