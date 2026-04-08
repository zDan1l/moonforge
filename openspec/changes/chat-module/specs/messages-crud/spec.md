# Messages CRUD

**Status:** Planned
**Type:** Feature
**Module:** chat-module

---

## Purpose

Full CRUD for chat messages per project. Messages are linked to versions for traceability.

**PRD Reference:** Sections 3.2 (Fase 2 — Refine), 8 (Database Schema — chat_messages).

---

## Files

| File | Purpose |
|------|---------|
| `apps/api/src/modules/chat/chat.service.ts` | Prisma business logic |
| `apps/api/src/modules/chat/chat.schema.ts` | Zod validation schemas |
| `apps/api/src/modules/chat/chat.routes.ts` | Hono route handlers |

---

## chat.service.ts

```typescript
import { prisma } from "@/lib/prisma.js";
import { NotFoundError } from "@/middleware/error-handler.js";

// ============================================================================
// Types
// ============================================================================

export type MessageRole = "user" | "assistant";

export interface CreateMessageInput {
  role: MessageRole;
  content: string;
  versionId: string;
  fileChanges?: string[];
}

export interface ListMessagesOptions {
  limit?: number;
  cursor?: string;
  versionId?: string;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * List chat messages for a project with pagination
 */
export async function listMessages(
  projectId: string,
  options: ListMessagesOptions = {}
) {
  const { limit = 50, cursor, versionId } = options;

  const messages = await prisma.chat_messages.findMany({
    where: {
      project_id: projectId,
      ...(versionId && { version_id: versionId }),
    },
    orderBy: { created_at: "asc" },
    take: limit + 1, // Fetch one extra to determine if there's a next page
    ...(cursor && {
      cursor: { id: cursor },
      skip: 1,
    }),
    select: {
      id: true,
      role: true,
      content: true,
      file_changes: true,
      created_at: true,
    },
  });

  const hasMore = messages.length > limit;
  const items = hasMore ? messages.slice(0, -1) : messages;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  return {
    items,
    nextCursor,
  };
}

/**
 * Create a new chat message
 */
export async function createMessage(
  projectId: string,
  data: CreateMessageInput
) {
  // Verify project exists
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new NotFoundError("Project");

  const message = await prisma.chat_messages.create({
    data: {
      project_id: projectId,
      version_id: data.versionId,
      role: data.role,
      content: data.content,
      file_changes: data.fileChanges || undefined,
    },
    select: {
      id: true,
      role: true,
      content: true,
      file_changes: true,
      created_at: true,
    },
  });

  return message;
}

/**
 * Delete all messages for a project
 */
export async function deleteMessages(projectId: string) {
  // Verify project exists
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });
  if (!project) throw new NotFoundError("Project");

  await prisma.chat_messages.deleteMany({
    where: { project_id: projectId },
  });

  return { deleted: true };
}
```

---

## chat.schema.ts

```typescript
import { z } from "zod";

// ============================================================================
// Schemas
// ============================================================================

export const createMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1),
  versionId: z.string().uuid(),
  fileChanges: z.array(z.string()).optional(),
});

export const listMessagesQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  cursor: z.string().uuid().optional(),
  versionId: z.string().uuid().optional(),
});

export const projectIdSchema = z.object({
  projectId: z.string().uuid("Invalid project ID format"),
});
```

---

## chat.routes.ts

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { success } from "@/lib/response.js";
import * as chatService from "./chat.service.js";
import {
  createMessageSchema,
  listMessagesQuerySchema,
  projectIdSchema,
} from "./chat.schema.js";

const chat = new Hono();

// GET /api/projects/:projectId/messages — List message history
chat.get(
  "/:projectId/messages",
  zValidator("param", projectIdSchema),
  zValidator("query", listMessagesQuerySchema),
  async (c) => {
    const { projectId } = c.req.valid("param");
    const query = c.req.valid("query");
    const result = await chatService.listMessages(projectId, query);
    return c.json(
      success(result.items, { nextCursor: result.nextCursor })
    );
  }
);

// POST /api/projects/:projectId/messages — Create message
chat.post(
  "/:projectId/messages",
  zValidator("param", projectIdSchema),
  zValidator("json", createMessageSchema),
  async (c) => {
    const { projectId } = c.req.valid("param");
    const data = c.req.valid("json");
    const message = await chatService.createMessage(projectId, data);
    return c.json(success(message), 201);
  }
);

// DELETE /api/projects/:projectId/messages — Delete all messages
chat.delete(
  "/:projectId/messages",
  zValidator("param", projectIdSchema),
  async (c) => {
    const { projectId } = c.req.valid("param");
    const result = await chatService.deleteMessages(projectId);
    return c.json(success(result));
  }
);

export default chat;
```

---

## Integration

Add chat routes to index.ts:

```typescript
import chatRoutes from "./modules/chat/chat.routes.js";

// Register under /api/projects prefix (nested routing)
// Note: Hono supports nested routing via app.route()
app.route("/api/projects", chatRoutes);
```

This makes routes available at:

- `GET /api/projects/:projectId/messages`
- `POST /api/projects/:projectId/messages`
- `DELETE /api/projects/:projectId/messages`
