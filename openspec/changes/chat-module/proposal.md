## Why

MoonForge needs a Chat Module to persist conversation history between user and AI assistant. Each project has its own chat history, enabling the chatbot to be context-aware across sessions. Chat messages are linked to specific versions for traceability.

**PRD Reference:** Sections 3.2 (Fase 2 — Refine), 6 (UI — Tiga Panel Workspace), 8 (Database Schema — chat_messages).

## Capabilities

### New Capabilities

- `messages-crud`: CRUD for chat messages per project
- `message-history`: Retrieve chat history for a project
- `file-changes`: Store file change references per message

## Impact

**Affected Code:**

- `apps/api/src/modules/chat/chat.routes.ts` — New file; Hono routes
- `apps/api/src/modules/chat/chat.schema.ts` — New file; Zod validation schemas
- `apps/api/src/modules/chat/chat.service.ts` — New file; Prisma business logic

**Dependencies:**

- `chat_messages` table in database (already defined in schema)
- `projects-module` for project existence validation

**Out of Scope (separate specs):**

- Real-time chat (WebSocket/SSE) — deferred post-MVP
- Streaming AI responses — deferred to Web App spec
