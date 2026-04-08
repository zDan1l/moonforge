## Context

**Current State:**

- Database has `chat_messages` table with `project_id`, `version_id`, `role`, `content`, `file_changes`
- `projects-module` is ready for project existence checks
- No chat module exists yet

**PRD Requirements:**

- Chatbot context-aware knowing entire project structure
- Chat history per project for continuity
- File changes tracked per message for traceability

## Goals / Non-Goals

**Goals:**

- CRUD for chat messages per project
- Retrieve message history with pagination
- Store file change references
- Link messages to specific project versions

**Non-Goals:**

- Real-time chat (WebSocket/SSE)
- AI response generation (handled by Generation Flow)
- Streaming responses

## Decisions

### 1. Message Storage

**Decision:** Store messages after AI response is generated.

**Rationale:**

- Frontend sends user message → triggers generation → stores both user message and AI response
- Each message linked to current project version

### 2. File Changes Tracking

**Decision:** Store `file_changes` as JSON array of file paths.

**Format:**

```json
{
  "file_changes": ["apps/api/prisma/schema.prisma", "apps/api/src/modules/products/products.routes.ts"]
}
```

### 3. Pagination

**Decision:** MVP uses cursor-based pagination for chat history.

**Rationale:**

- Cursor-based is more efficient for large chat histories
- Consistent with Prisma's native pagination

## API Endpoints

### GET /api/projects/:projectId/messages

**Description:** Get chat message history for a project.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `limit` | number | No | 50 | Messages per page |
| `cursor` | string | No | — | Cursor for pagination |
| `versionId` | UUID | No | — | Filter by version |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "role": "user",
      "content": "Add products module",
      "file_changes": null,
      "created_at": "2026-04-09T10:00:00Z"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "Generated products module...",
      "file_changes": ["apps/api/prisma/schema.prisma"],
      "created_at": "2026-04-09T10:00:01Z"
    }
  ],
  "meta": {
    "timestamp": "...",
    "nextCursor": "uuid"
  }
}
```

### POST /api/projects/:projectId/messages

**Description:** Create a new chat message (used by frontend after generation).

**Request:**

```json
{
  "role": "user | assistant",
  "content": "Add products module",
  "versionId": "uuid",
  "fileChanges": ["apps/api/prisma/schema.prisma"]
}
```

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "role": "user",
    "content": "Add products module",
    "file_changes": null,
    "created_at": "2026-04-09T10:00:00Z"
  }
}
```

### DELETE /api/projects/:projectId/messages

**Description:** Delete all messages for a project (reset chat).

**Response (200):**

```json
{
  "success": true,
  "data": { "deleted": true }
}
```

## File Structure

```
apps/api/src/modules/chat/
├── chat.routes.ts     # Hono routes
├── chat.schema.ts     # Zod validation schemas
└── chat.service.ts   # Prisma business logic
```

## Response Format

All responses follow existing API response format:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "timestamp": "..." }
}
```

## Risks / Trade-offs

### Trade-off: No Real-time Chat

**Decision:** MVP uses request/response for chat.

**Rationale:** Simpler implementation. WebSocket/SSE can be added post-MVP.

## Open Questions

None — design is straightforward for MVP scope.
