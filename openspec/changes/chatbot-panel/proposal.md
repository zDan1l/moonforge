## Why

The Chatbot Panel is Panel Kiri of the three-panel workspace. It displays chat history for the current project and provides a chat input for submitting generation/refine requests.

**PRD Reference:** Sections 3.1 (Langkah 2 — Chatbot terbuka otomatis, Langkah 3 — User input prompt), 3.2 (Fase 2 — Refine), 6 (UI — Panel Kiri).

## Capabilities

### New Capabilities

- `chat-history`: Load and display message history from API
- `chat-input`: Textarea for natural language input with send action
- `chat-streaming-placeholder`: Placeholder for streaming response (MVP — polling, not WebSocket)
- `empty-chat-state`: Prompt when no messages exist yet

## Impact

**Affected Code:**

- `apps/web/src/components/workspace/ChatPanel.tsx` — Chat panel component
- `apps/web/src/components/workspace/ChatInput.tsx` — Chat input component

**Dependencies:**

| API Endpoint | Module | Purpose |
|-------------|--------|---------|
| `GET /api/projects/:projectId/messages` | chat-module | Load message history |
| `POST /api/projects/:projectId/messages` | chat-module | Send message |
| `POST /api/generate/setup` | generation-flow | Trigger initial generation |
| `POST /api/generate/refine` | generation-flow | Trigger refinement |

**Dependencies (UI):**

| Component | Module |
|-----------|--------|
| `ChatBubble` | ui-components |
| `Textarea` | ui-components |
| `Button` | ui-components |

## Out of Scope (Separate Specs)

- Real-time WebSocket streaming — deferred post-MVP
- Message editing/deletion — deferred post-MVP
- Typing indicators — deferred post-MVP
