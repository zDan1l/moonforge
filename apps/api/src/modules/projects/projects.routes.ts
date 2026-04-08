import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { success } from "../../lib/response.js";
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

export default projects;
