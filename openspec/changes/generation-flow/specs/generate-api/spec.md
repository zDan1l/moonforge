# Generate API

**Status:** Planned
**Type:** Feature
**Module:** generation-flow

---

## Purpose

REST API endpoints to trigger monorepo generation for Setup and Refine phases.

**PRD Reference:** Sections 3.1 (Fase 1 — Setup), 3.2 (Fase 2 — Refine).

---

## Files

| File | Purpose |
|------|---------|
| `apps/api/src/modules/generate/generate.routes.ts` | API endpoints |
| `apps/api/src/modules/generate/generate.service.ts` | Business logic |

---

## Routes

### POST /api/generate/setup

Generate initial monorepo structure from user description.

**Request:**

```json
{
  "projectId": "uuid",
  "description": "SaaS B2B with users, subscriptions, dashboard"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "versionId": "uuid",
    "versionNumber": 1,
    "filesGenerated": 15,
    "summary": "Generated SaaS B2B structure with 3 modules"
  },
  "meta": { "timestamp": "2026-04-09T10:00:00Z" }
}
```

**Errors:**

- `404 NOT_FOUND` — Project not found
- `400 VALIDATION_ERROR` — Invalid request body
- `500 INTERNAL_ERROR` — Claude API error or parsing failure

### POST /api/generate/refine

Apply surgical modifications to existing project.

**Request:**

```json
{
  "projectId": "uuid",
  "request": "Add products module with name, price, stock fields"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "versionId": "uuid",
    "versionNumber": 2,
    "filesChanged": 4,
    "summary": "Added products module with CRUD operations"
  },
  "meta": { "timestamp": "2026-04-09T10:00:00Z" }
}
```

**Errors:**

- `404 NOT_FOUND` — Project not found
- `400 VALIDATION_ERROR` — Invalid request body
- `500 INTERNAL_ERROR` — Claude API error or parsing failure

---

## generate.service.ts

```typescript
import { prisma } from "@/lib/prisma.js";
import { AppError } from "@/middleware/error-handler.js";
import { sendMessage } from "@/lib/anthropic.js";
import { buildSetupPrompt, buildRefinePrompt, ClaudeOutputSchema } from "@/prompts/index.js";
import { mergeWithTemplate, storeFile } from "@/generator/files.js";

interface SetupResult {
  projectId: string;
  versionId: string;
  versionNumber: number;
  filesGenerated: number;
  summary: string;
}

interface RefineResult {
  projectId: string;
  versionId: string;
  versionNumber: number;
  filesChanged: number;
  summary: string;
}

/**
 * Generate initial monorepo from user description
 */
export async function generateSetup(
  projectId: string,
  description: string
): Promise<SetupResult> {
  // 1. Get project
  const project = await prisma.projects.findUnique({ where: { id: projectId } });
  if (!project) throw new NotFoundError("Project");

  // 2. Call Claude
  const prompt = buildSetupPrompt({
    userDescription: description,
    projectName: project.name,
  });

  const response = await sendMessage({
    messages: [{ role: "user", content: prompt }],
  });

  // 3. Parse JSON
  let output;
  try {
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
    if (!jsonMatch) throw new Error("No JSON found");
    output = ClaudeOutputSchema.parse(JSON.parse(jsonMatch[1] || jsonMatch[2]));
  } catch (error) {
    throw new AppError("Failed to parse AI response", 500, "PARSE_ERROR");
  }

  // 4. Create new version
  const versionNumber = 1;
  const version = await prisma.project_versions.create({
    data: {
      project_id: projectId,
      version_number: versionNumber,
      label: "Initial setup",
    },
  });

  // 5. Merge with template and store files
  const mergedFiles = await mergeWithTemplate(output.files);
  for (const file of mergedFiles) {
    await storeFile(version.id, file);
  }

  // 6. Update project status
  await prisma.projects.update({
    where: { id: projectId },
    data: { status: "generated" },
  });

  return {
    projectId,
    versionId: version.id,
    versionNumber,
    filesGenerated: mergedFiles.length,
    summary: output.summary,
  };
}

/**
 * Apply surgical modifications to existing project
 */
export async function generateRefine(
  projectId: string,
  request: string
): Promise<RefineResult> {
  // 1. Get project with latest version
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
    include: {
      versions: {
        orderBy: { version_number: "desc" },
        take: 1,
        include: {
          files: true,
        },
      },
    },
  });
  if (!project) throw new NotFoundError("Project");

  const latestVersion = project.versions[0];
  if (!latestVersion) throw new AppError("No versions found", 500, "NO_VERSIONS");

  // 2. Build context from existing files
  const existingFiles = latestVersion.files.map((f) => ({
    path: f.path,
    content: f.content,
  }));

  // 3. Call Claude
  const prompt = buildRefinePrompt({
    userRequest: request,
    existingFiles,
    projectContext: project.description,
  });

  const response = await sendMessage({
    messages: [{ role: "user", content: prompt }],
  });

  // 4. Parse JSON
  let output;
  try {
    const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
    if (!jsonMatch) throw new Error("No JSON found");
    output = ClaudeOutputSchema.parse(JSON.parse(jsonMatch[1] || jsonMatch[2]));
  } catch (error) {
    throw new AppError("Failed to parse AI response", 500, "PARSE_ERROR");
  }

  // 5. Create new version
  const versionNumber = latestVersion.version_number + 1;
  const version = await prisma.project_versions.create({
    data: {
      project_id: projectId,
      version_number: versionNumber,
      label: `Refine: ${request.slice(0, 50)}...`,
    },
  });

  // 6. Copy existing files to new version
  for (const file of latestVersion.files) {
    await prisma.project_files.create({
      data: {
        project_id: projectId,
        version_id: version.id,
        path: file.path,
        content: file.content,
        file_source: file.file_source,
      },
    });
  }

  // 7. Add/update files from AI output
  for (const file of output.files) {
    await storeFile(version.id, { ...file, source: "modified" });
  }

  // 8. Update project status
  await prisma.projects.update({
    where: { id: projectId },
    data: { status: "refined" },
  });

  return {
    projectId,
    versionId: version.id,
    versionNumber,
    filesChanged: output.files.length,
    summary: output.summary,
  };
}
```

---

## generate.routes.ts

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success } from "@/lib/response.js";
import { generateSetup, generateRefine } from "./generate.service.js";
import { z } from "zod";

const generate = new Hono();

// Validation schemas
const setupSchema = z.object({
  projectId: z.string().uuid(),
  description: z.string().min(1),
});

const refineSchema = z.object({
  projectId: z.string().uuid(),
  request: z.string().min(1),
});

// POST /api/generate/setup
generate.post("/setup", zValidator("json", setupSchema), async (c) => {
  const { projectId, description } = c.req.valid("json");
  const result = await generateSetup(projectId, description);
  return c.json(success(result), 200);
});

// POST /api/generate/refine
generate.post("/refine", zValidator("json", refineSchema), async (c) => {
  const { projectId, request } = c.req.valid("json");
  const result = await generateRefine(projectId, request);
  return c.json(success(result), 200);
});

export default generate;
```
