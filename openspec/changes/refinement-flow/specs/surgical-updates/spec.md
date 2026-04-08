# Surgical Updates

**Status:** Planned
**Type:** Feature
**Module:** refinement-flow

---

## Purpose

Orchestrate the full refinement flow: user request → AI generation → file storage → chat update.

**PRD Reference:** Sections 3.2 (Fase 2 — Refine), 8.2 (Logika Penyimpanan File).

---

## Files

| File | Purpose |
|------|---------|
| `apps/api/src/modules/refinement/refinement.service.ts` | Orchestration logic |
| `apps/api/src/modules/refinement/refinement.routes.ts` | API endpoint |

---

## refinement.service.ts

```typescript
import { prisma } from "@/lib/prisma.js";
import { AppError, NotFoundError } from "@/middleware/error-handler.js";
import { generateRefine } from "@/modules/generate/generate.service.js";
import { createMessage } from "@/modules/chat/chat.service.js";

/**
 * Execute full refinement flow
 *
 * 1. Store user message
 * 2. Execute AI refinement (creates new version)
 * 3. Store AI response with file changes
 * 4. Return combined result
 */
export async function executeRefine(
  projectId: string,
  userRequest: string
) {
  // 1. Get current version for context
  const currentVersion = await prisma.project_versions.findFirst({
    where: { project_id: projectId },
    orderBy: { version_number: "desc" },
  });

  if (!currentVersion) {
    throw new AppError("Project has no versions", 400, "NO_VERSIONS");
  }

  // 2. Store user message
  const userMessage = await createMessage(projectId, {
    role: "user",
    content: userRequest,
    versionId: currentVersion.id,
  });

  // 3. Execute AI refinement
  // This creates new version, copies files, updates changed files
  const generationResult = await generateRefine(projectId, userRequest);

  // 4. Store assistant message with file changes
  const assistantMessage = await createMessage(projectId, {
    role: "assistant",
    content: generationResult.summary,
    versionId: generationResult.versionId,
    fileChanges: generationResult.filesChanged,
  });

  // 5. Return combined result
  return {
    versionId: generationResult.versionId,
    versionNumber: generationResult.versionNumber,
    filesChanged: generationResult.filesChanged,
    summary: generationResult.summary,
    messages: {
      userMessage,
      assistantMessage,
    },
  };
}
```

---

## refinement.routes.ts

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success } from "@/lib/response.js";
import { executeRefine } from "./refinement.service.js";
import { z } from "zod";

const refinement = new Hono();

// Validation schema
const refineSchema = z.object({
  projectId: z.string().uuid(),
  request: z.string().min(1),
});

// POST /api/refine
refinement.post("/", zValidator("json", refineSchema), async (c) => {
  const { projectId, request } = c.req.valid("json");
  const result = await executeRefine(projectId, request);
  return c.json(success(result));
});

export default refinement;
```

---

## API Response

**POST /api/refine**

```json
{
  "success": true,
  "data": {
    "versionId": "uuid",
    "versionNumber": 2,
    "filesChanged": [
      "apps/api/prisma/schema.prisma",
      "apps/api/src/modules/products/products.routes.ts"
    ],
    "summary": "Added products module with CRUD operations",
    "messages": {
      "userMessage": {
        "id": "uuid",
        "role": "user",
        "content": "Add products module",
        "versionId": "uuid-prev",
        "created_at": "2026-04-09T10:00:00Z"
      },
      "assistantMessage": {
        "id": "uuid",
        "role": "assistant",
        "content": "Added products module...",
        "file_changes": ["apps/api/prisma/schema.prisma", "..."],
        "versionId": "uuid-new",
        "created_at": "2026-04-09T10:00:05Z"
      }
    }
  },
  "meta": { "timestamp": "..." }
}
```

---

## Integration

The refinement flow coordinates:

```
┌─────────────────────────────────────────────────────────────┐
│                    refinement.service.ts                       │
├─────────────────────────────────────────────────────────────┤
│  1. createMessage()  →  chat-module                         │
│  2. generateRefine() →  generation-flow                     │
│     └── Creates new version                                  │
│     └── Copies existing files (copy-on-write)                │
│     └── Updates changed files (file_source = 'modified')    │
│     └── Returns filesChanged list                            │
│  3. createMessage()  →  chat-module (with file_changes)     │
└─────────────────────────────────────────────────────────────┘
```
