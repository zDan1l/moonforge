import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { success } from "../../lib/response.js";
import {
	createMessageSchema,
	listMessagesQuerySchema,
	projectIdParamSchema,
} from "../chat/chat.schema.js";
import * as chatService from "../chat/chat.service.js";
import {
	createProjectSchema,
	listProjectsQuerySchema,
	projectIdSchema,
	updateProjectSchema,
} from "./projects.schema.js";
import * as projectsService from "./projects.service.js";

// ============================================================================
// Routes
// ============================================================================

const projects = new Hono();

// GET / — List all projects
projects.get("/", zValidator("query", listProjectsQuerySchema), async (c) => {
	const query = c.req.valid("query");
	const projects = await projectsService.listProjects(query);
	return c.json(success(projects));
});

// GET /:id — Get single project
projects.get("/:id", zValidator("param", projectIdSchema), async (c) => {
	const { id } = c.req.valid("param");
	const project = await projectsService.getProject(id);
	return c.json(success(project));
});

// POST / — Create project
projects.post("/", zValidator("json", createProjectSchema), async (c) => {
	const data = c.req.valid("json");
	const project = await projectsService.createProject(data);
	return c.json(success(project), 201);
});

// PATCH /:id — Update project
projects.patch(
	"/:id",
	zValidator("param", projectIdSchema),
	zValidator("json", updateProjectSchema),
	async (c) => {
		const { id } = c.req.valid("param");
		const data = c.req.valid("json");
		const project = await projectsService.updateProject(id, data);
		return c.json(success(project));
	},
);

// DELETE /:id — Delete project
projects.delete("/:id", zValidator("param", projectIdSchema), async (c) => {
	const { id } = c.req.valid("param");
	const result = await projectsService.deleteProject(id);
	return c.json(success(result));
});

// ============================================================================
// Chat Routes (nested under projects)
// ============================================================================

// GET /:projectId/messages — List chat messages for a project
projects.get(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	zValidator("query", listMessagesQuerySchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { limit, cursor, versionId } = c.req.valid("query");

		const result = await chatService.listMessages({
			projectId,
			limit,
			cursor,
			versionId,
		});

		const total = await chatService.getMessageCount(projectId);

		return c.json(
			{
				success: true,
				data: {
					items: result.messages,
					pagination: {
						page: 1,
						limit,
						total,
						totalPages: Math.ceil(total / limit),
						nextCursor: result.nextCursor,
						hasMore: result.hasMore,
					},
				},
				meta: { timestamp: new Date().toISOString() },
			},
			200,
		);
	},
);

// POST /:projectId/messages — Create a new chat message
projects.post(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	zValidator("json", createMessageSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const data = c.req.valid("json");

		const message = await chatService.createMessage(projectId, {
			role: data.role,
			content: data.content,
			versionId: data.versionId,
			fileChanges: data.fileChanges,
		});

		return c.json(success(message), 201);
	},
);

// DELETE /:projectId/messages — Delete all messages for a project
projects.delete(
	"/:projectId/messages",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const result = await chatService.deleteMessages(projectId);
		return c.json(success(result), 200);
	},
);

// GET /:projectId/messages/:messageId — Get a single message
projects.get(
	"/:projectId/messages/:messageId",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { messageId } = c.req.param();
		const message = await chatService.getMessage(projectId, messageId);
		return c.json(success(message), 200);
	},
);

// DELETE /:projectId/messages/:messageId — Delete a single message
projects.delete(
	"/:projectId/messages/:messageId",
	zValidator("param", projectIdParamSchema),
	async (c) => {
		const { projectId } = c.req.valid("param");
		const { messageId } = c.req.param();
		const result = await chatService.deleteMessage(projectId, messageId);
		return c.json(success(result), 200);
	},
);

export default projects;
