# Projects CRUD

**Status:** Planned
**Type:** Feature
**Module:** projects-module

---

## Overview

Full CRUD for `projects` table. No authentication or user isolation for MVP.

**PRD Reference:** Sections 3.1 (Fase 1 — Setup), 7.1 (MVP Scope — Setup), 8 (Database Schema).

---

## Files

| File | Purpose |
|------|---------|
| `apps/api/src/modules/projects/projects.service.ts` | Prisma business logic |
| `apps/api/src/modules/projects/projects.schema.ts` | Zod validation schemas |
| `apps/api/src/modules/projects/projects.routes.ts` | Hono route handlers |

---

## projects.service.ts

### Functions

#### `listProjects(query)`

```typescript
type ListProjectsQuery = {
  status?: "draft" | "generated" | "refined";
  orderBy?: "created_at" | "updated_at" | "name";
  order?: "asc" | "desc";
};

const projects = await prisma.projects.findMany({
  where: query.status ? { status: query.status } : undefined,
  orderBy: { [query.orderBy || "created_at"]: query.order || "desc" },
  select: {
    id: true,
    name: true,
    description: true,
    status: true,
    created_at: true,
    updated_at: true,
    _count: { select: { versions: true, files: true, messages: true } },
  },
});
```

#### `getProject(id)`

```typescript
const project = await prisma.projects.findUnique({
  where: { id },
  include: {
    versions: {
      orderBy: { version_number: "desc" },
      select: { id: true, version_number: true, label: true, created_at: true },
    },
  },
});
if (!project) throw new NotFoundError("Project");
return project;
```

#### `createProject(data)`

```typescript
type CreateProjectInput = { name: string; description: string };

const result = await prisma.$transaction(async (tx) => {
  const project = await tx.projects.create({
    data: { name: data.name, description: data.description },
  });
  const version = await tx.project_versions.create({
    data: {
      project_id: project.id,
      version_number: 1,
      label: "Initial setup",
    },
  });
  return { project, version };
});

return prisma.projects.findUnique({
  where: { id: result.project.id },
  include: {
    versions: {
      orderBy: { version_number: "desc" },
      select: { id: true, version_number: true, label: true, created_at: true },
    },
  },
});
```

#### `updateProject(id, data)`

```typescript
type UpdateProjectInput = {
  name?: string;
  description?: string;
  status?: "draft" | "generated" | "refined";
};

const project = await prisma.projects.findUnique({ where: { id } });
if (!project) throw new NotFoundError("Project");

return prisma.projects.update({
  where: { id },
  data,
  include: {
    versions: {
      orderBy: { version_number: "desc" },
      select: { id: true, version_number: true, label: true, created_at: true },
    },
  },
});
```

#### `deleteProject(id)`

```typescript
const project = await prisma.projects.findUnique({ where: { id } });
if (!project) throw new NotFoundError("Project");

await prisma.projects.delete({ where: { id } });
return { id, deleted: true };
```

---

## projects.schema.ts

```typescript
import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
  description: z.string().min(1, "Description is required"),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["draft", "generated", "refined"]).optional(),
});

export const listProjectsQuerySchema = z.object({
  status: z.enum(["draft", "generated", "refined"]).optional(),
  orderBy: z.enum(["created_at", "updated_at", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});

export const projectIdSchema = z.object({
  id: z.string().uuid("Invalid project ID format"),
});
```

---

## projects.routes.ts

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success } from "@/lib/response";
import * as projectsService from "./projects.service";
import {
  createProjectSchema,
  updateProjectSchema,
  listProjectsQuerySchema,
  projectIdSchema,
} from "./projects.schema";

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
```

---

## index.ts Update

```typescript
// apps/api/src/index.ts — add after middleware setup

import projectsRoutes from "@/modules/projects/projects.routes";

app.route("/api/projects", projectsRoutes);
```

---

## Response Shape

All endpoints return:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "..." }
}
```

Errors follow existing error-handler format:

```json
{
  "success": false,
  "error": { "code": "...", "message": "..." },
  "meta": { "timestamp": "..." }
}
```
