# File Serving

**Status:** Planned
**Type:** Feature
**Module:** files-module

---

## Purpose

Serve project files for preview and tree display in the frontend UI.

**PRD Reference:** Sections 3.1, 6 (UI — File Explorer panel).

---

## Files

| File | Purpose |
|------|---------|
| `apps/api/src/modules/files/files.service.ts` | File retrieval logic |
| `apps/api/src/modules/files/files.schema.ts` | Zod validation schemas |
| `apps/api/src/modules/files/files.routes.ts` | API endpoints |

---

## files.service.ts

```typescript
import { prisma } from "@/lib/prisma.js";
import { NotFoundError } from "@/middleware/error-handler.js";

/**
 * List files for a project version
 */
export async function listFiles(
  projectId: string,
  options: { versionId?: string; directory?: string } = {}
) {
  const { versionId, directory } = options;

  // Get version (latest if not specified)
  const version = versionId
    ? await prisma.project_versions.findUnique({ where: { id: versionId } })
    : await prisma.project_versions.findFirst({
        where: { project_id: projectId },
        orderBy: { version_number: "desc" },
      });

  if (!version) {
    throw new NotFoundError("Version");
  }

  // Get files
  const files = await prisma.project_files.findMany({
    where: {
      project_id: projectId,
      version_id: version.id,
      ...(directory && {
        path: { startsWith: directory },
      }),
    },
    orderBy: { path: "asc" },
    select: {
      path: true,
      content: true,
      file_source: true,
    },
  });

  // Transform to tree format
  const fileEntries = files.map((f) => {
    const parts = f.path.split("/");
    const name = parts.pop() || "";
    return {
      path: f.path,
      name,
      directory: parts.join("/"),
      size: f.content.length,
      fileSource: f.file_source,
    };
  });

  return {
    files: fileEntries,
    versionId: version.id,
    versionNumber: version.version_number,
    totalFiles: fileEntries.length,
  };
}

/**
 * Get single file content
 */
export async function getFile(
  projectId: string,
  filePath: string,
  versionId?: string
) {
  // Get version
  const version = versionId
    ? await prisma.project_versions.findUnique({ where: { id: versionId } })
    : await prisma.project_versions.findFirst({
        where: { project_id: projectId },
        orderBy: { version_number: "desc" },
      });

  if (!version) {
    throw new NotFoundError("Version");
  }

  // Get file
  const file = await prisma.project_files.findFirst({
    where: {
      project_id: projectId,
      version_id: version.id,
      path: filePath,
    },
  });

  if (!file) {
    throw new NotFoundError("File");
  }

  return {
    path: file.path,
    content: file.content,
    fileSource: file.file_source,
    size: file.content.length,
  };
}
```

---

## files.schema.ts

```typescript
import { z } from "zod";

export const listFilesQuerySchema = z.object({
  versionId: z.string().uuid().optional(),
  directory: z.string().optional()
});

export const projectIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format")
});

export const filePathSchema = z.object({
  projectId: z.string().uuid(),
  path: z.string().min(1)
});
```

---

## files.routes.ts

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success } from "@/lib/response.js";
import * as filesService from "./files.service.js";
import {
  listFilesQuerySchema,
  projectIdSchema,
} from "./files.schema.js";

const files = new Hono();

// GET /api/projects/:projectId/files — List file tree
files.get(
  "/:projectId/files",
  zValidator("param", projectIdSchema),
  zValidator("query", listFilesQuerySchema),
  async (c) => {
    const { projectId } = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await filesService.listFiles(projectId, query);
    return c.json(
      success(result.files, {
        versionId: result.versionId,
        versionNumber: result.versionNumber,
        totalFiles: result.totalFiles,
      })
    );
  }
);

// GET /api/projects/:projectId/files/:path(*) — Get file content
files.get(
  "/:projectId/files/:path(*)",
  async (c) => {
    const projectId = c.req.param("projectId");
    const path = c.req.param("path");
    const versionId = c.req.query("versionId");

    if (!projectId || !path) {
      return c.json(
        { success: false, error: { code: "INVALID_PARAMS", message: "Missing parameters" } },
        400
      );
    }

    const file = await filesService.getFile(projectId, path, versionId);
    return c.json(success(file));
  }
);

export default files;
```

---

## API Responses

### GET /api/projects/:projectId/files

```json
{
  "success": true,
  "data": [
    {
      "path": "apps/api/prisma/schema.prisma",
      "name": "schema.prisma",
      "directory": "apps/api/prisma",
      "size": 1234,
      "fileSource": "ai_generated"
    }
  ],
  "meta": {
    "versionId": "uuid",
    "versionNumber": 2,
    "totalFiles": 45,
    "timestamp": "..."
  }
}
```

### GET /api/projects/:projectId/files/apps/api/prisma/schema.prisma

```json
{
  "success": true,
  "data": {
    "path": "apps/api/prisma/schema.prisma",
    "content": "// Prisma schema content...",
    "fileSource": "ai_generated",
    "size": 1234
  },
  "meta": { "timestamp": "..." }
}
```
