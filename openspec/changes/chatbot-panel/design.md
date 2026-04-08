## Context

**Current State:**

- Workspace layout has a placeholder chat panel (from frontend-setup)
- `ChatBubble` component exists in ui-components
- No chat panel component implemented
- No chat API integration exists

**PRD Requirements:**

- Display chat history (messages per project)
- Chat input for natural language prompt
- Auto-focus input when workspace loads (PRD Section 3.1 Step 2)
- After setup: file tree appears, chatbot remains open

## Goals / Non-Goals

**Goals:**

- Load chat messages from `GET /api/projects/:projectId/messages`
- Display messages with ChatBubble component
- Send message via `POST /api/projects/:projectId/messages`
- Trigger generation/refine after send
- Show loading state during generation
- Empty state when no messages

**Non-Goals:**

- Real-time WebSocket streaming (post-MVP)
- Message editing/deletion (post-MVP)
- Typing indicator (post-MVP)
- Message reactions (post-MVP)

## Decisions

### 1. Message Loading Strategy

**Decision:** Load messages in the workspace route loader, pass as data to ChatPanel.

**Rationale:**

- Messages available immediately when panel renders
- SSR-compatible
- No loading flash on initial render
- Can refetch on send for simplicity (MVP)

### 2. Send Action Flow

**Decision:** User sends message → POST to API → trigger generation → load new messages → scroll to bottom.

**Flow:**
```
User types prompt → clicks Send
  → POST /api/projects/:projectId/messages { role: "user", content, versionId }
  → POST /api/generate/setup (or /refine)
  → POST /api/projects/:projectId/messages { role: "assistant", content, fileChanges }
  → Refetch messages → scroll to bottom
```

### 3. Empty State

**Decision:** Show welcome message + auto-focused input when no messages exist.

**Rationale:** PRD Section 3.1 Step 2: "User langsung sambut dengan prompt input yang siap menerima deskripsi project."

### 4. Message Display Order

**Decision:** Chronological (oldest at top, newest at bottom).

**Rationale:** Natural conversation flow. Newest messages are most relevant.

## Layout Structure

```
┌────────────────────────────────────┐
│  Chat                        [?]   │  ← Panel header
├────────────────────────────────────┤
│                                    │
│  [ChatBubble: assistant]           │  ← Welcome message (if empty)
│                                    │
│  [ChatBubble: user]                │
│                                    │
│  [ChatBubble: assistant]           │
│                                    │
│  [ChatBubble: user]                │
│                                    │
│  [ChatBubble: assistant]           │
│                                    │
├────────────────────────────────────┤
│  [Textarea: placeholder...]  [→]  │  ← Chat input
└────────────────────────────────────┘
```

## Chat Input Design

```
┌─────────────────────────────────────────────┐
│  SaaS B2B with users and subscriptions...  │
│                                              │
└─────────────────────────────────────────────┘
                                              [→]
```

- Textarea: auto-resize up to 4 lines, then scrollable
- Send button: right side, primary style, disabled when empty
- Enter to send (Shift+Enter for newline)
- Disabled during generation (to prevent double-send)

## States

| State | Visual |
|-------|--------|
| Idle | Input ready, messages displayed |
| Sending | Input disabled, send button shows spinner |
| Generating | "Generating..." message shown, input disabled |
| Error | Error message, retry button, input re-enabled |

## Auto-Scroll Behavior

- On new message: scroll to bottom
- On user scroll up: don't auto-scroll (user is reading history)
- On send: scroll to bottom immediately

## API Integration

### Load Messages

```typescript
// Workspace route loader
const response = await api.projects["$projectId"].messages.$get({
  query: { projectId: route.params.projectId },
});
```

### Send Message

```typescript
// In ChatPanel
const handleSend = async (content: string) => {
  // 1. Save user message
  await api.projects["$projectId"].messages.$post({
    json: { role: "user", content, versionId },
  });

  // 2. Trigger generation (setup or refine)
  if (isFirstMessage) {
    await api.generate.setup.$post({ json: { projectId, description: content } });
  } else {
    await api.generate.refine.$post({ json: { projectId, request: content } });
  }

  // 3. Reload messages
  await refetch();
};
```

## Welcome Message (Empty State)

When no messages exist:

```
┌────────────────────────────────────┐
│  Chat                               │
├────────────────────────────────────┤
│                                      │
│  🌕                                 │
│                                      │
│  Welcome to your workspace!          │
│                                      │
│  Describe your project in natural    │
│  language and I'll generate the      │
│  fullstack monorepo for you.        │
│                                      │
│  Try: "SaaS B2B with users,          │
│  subscriptions, and dashboard"      │
│                                      │
├────────────────────────────────────┤
│  [SaaS B2B...              ]  [→]  │  ← Input auto-focused
└────────────────────────────────────┘
```

## File Changes Display

When assistant message contains `fileChanges`, show a summary:

```
┌────────────────────────────────────┐
│  [ChatBubble: assistant]           │
│  I'll generate the following        │
│  structure:                        │
│                                      │
│  📁 apps/api/src/modules/users/     │
│  📁 apps/api/src/modules/products/  │
│  📄 prisma/schema.prisma            │
│                                      │
│  [View Files →]                     │
└────────────────────────────────────┘
```

Clicking "View Files" highlights changed files in the File Explorer panel.

## Risks / Trade-off

### Trade-off: Polling vs WebSocket

**Decision:** Polling with manual refetch after send for MVP.

**Rationale:** Simpler to implement, no backend WebSocket support needed. Post-MVP: switch to WebSocket for real-time streaming.

### Trade-off: Optimistic Updates vs Server Response

**Decision:** Wait for server response before showing message.

**Rationale:** Simpler — avoid handling out-of-order messages. Post-MVP: optimistic updates for better UX.
