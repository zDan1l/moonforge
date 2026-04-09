/**
 * Chat Routes
 *
 * API endpoints for chat message operations.
 * GET /api/projects/:projectId/messages - List messages
 * POST /api/projects/:projectId/messages - Create message
 * DELETE /api/projects/:projectId/messages - Delete all messages
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { paginated, success } from "../../lib/response.js";
import {
	createMessageSchema,
	listMessagesQuerySchema,
	projectIdParamSchema,
} from "./chat.schema.js";
import {
	createMessage,
	deleteMessage,
	deleteMessages,
	getMessage,
	getMessageCount,
	listMessages,
} from "./chat.service.js";

const chat = new Hono();

// ============================================================================
// Routes
// ============================================================================

/**
 * GET /api/projects/:projectId/messages
 *
 * List chat messages for a project with pagination.
 *
 * @example
 * Request: GET /api/projects/123/messages?limit=20&cursor=abc
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "items": [...],
 *     "pagination": { "page": 1, "limit": 20, "total": 50, "totalPages": 3 }
 *   }
 * }
 */
chat.get(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	zValidator("query", listMessagesQuerySchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { limit, cursor, versionId } = c.req.valid("query");

		const result = await listMessages({
			projectId,
			limit,
			cursor,
			versionId,
		});

		// Get total count for pagination
		const total = await getMessageCount(projectId);

		return c.json(
			paginated(
				result.messages,
				1, // page is always 1 with cursor-based pagination
				limit,
				total,
			),
			200,
		);
	},
);

/**
 * POST /api/projects/:projectId/messages
 *
 * Create a new chat message.
 *
 * @example
 * Request:
 * {
 *   "role": "user",
 *   "content": "Add a products module",
 *   "versionId": "..."
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": { "id": "...", "role": "user", "content": "...", ... }
 * }
 */
chat.post(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	zValidator("json", createMessageSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const data = c.req.valid("json");

		const message = await createMessage(projectId, {
			role: data.role,
			content: data.content,
			versionId: data.versionId,
			fileChanges: data.fileChanges,
		});

		return c.json(success(message), 201);
	},
);

/**
 * DELETE /api/projects/:projectId/messages
 *
 * Delete all chat messages for a project.
 *
 * @example
 * Response (200):
 * {
 *   "success": true,
 *   "data": { "deletedCount": 15 }
 * }
 */
chat.delete(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");

		const result = await deleteMessages(projectId);

		return c.json(success(result), 200);
	},
);

/**
 * GET /api/projects/:projectId/messages/:messageId
 *
 * Get a single chat message.
 */
chat.get(
	"/:projectId/messages/:messageId",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { messageId } = c.req.param();

		const message = await getMessage(projectId, messageId);

		return c.json(success(message), 200);
	},
);

/**
 * DELETE /api/projects/:projectId/messages/:messageId
 *
 * Delete a single chat message.
 */
chat.delete(
	"/:projectId/messages/:messageId",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { messageId } = c.req.param();

		const result = await deleteMessage(projectId, messageId);

		return c.json(success(result), 200);
	},
);

export default chat;
