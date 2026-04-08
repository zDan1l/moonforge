## Context

**Current State:**

- `apps/web` already exists with TanStack Start, React 19, Tailwind v4, lucide-react
- `apps/web/src/router.tsx` — router setup with TanStack Router
- `apps/web/src/routes/` — `__root.tsx`, `index.tsx`, `about.tsx` (starter template)
- `apps/web/src/styles.css` — custom design tokens (--sea-ink, --lagoon, --palm, --sand, --foam)
- No workspace routes, no three-panel layout, no API client

**PRD Requirements:**

- Three-panel workspace: left (chat), middle (code preview), right (file explorer)
- Project management: create, list, select project
- File tree display, code preview, chat interface
- Download `.zip` for deployment

## Goals / Non-Goals

**Goals:**

- Setup file-based routing structure for workspace
- Implement three-panel workspace layout
- Create API client for backend communication
- Add project routes (list, workspace)
- Integrate existing design tokens from `styles.css`

**Non-Goals:**

- WebSocket real-time streaming (post-MVP)
- Real-time diff rendering (UI Components spec)
- Authentication (skipped for MVP)
- Mobile-responsive workspace (post-MVP)

## Decisions

### 1. Route Structure

**Decision:** Use TanStack Start file-based routing (`createFileRoute` pattern).

**Rationale:**

- Already using TanStack Router in codebase
- File-based routing matches PRD Section 5 structure (`routes/dashboard/`, `routes/projects/`)
- Type-safe route params with `$projectId`, `$path`
- Server loaders for data fetching

### 2. Three-Panel Layout

**Decision:** Three fixed panels with resizable borders (CSS Grid + flex).

**Rationale:**

- PRD Section 6 defines clear panel roles
- Fixed widths with `flex-shrink-0` prevent collapse
- Panel content loaded via route loaders

**Layout:**
```
+------------------+------------------------+------------------+
|  Panel Kiri      |  Panel Tengah         |  Panel Kanan     |
|  (Chat)          |  (Code Preview)       |  (File Explorer) |
|  w-80            |  flex-1               |  w-72            |
+------------------+------------------------+------------------+
```

### 3. API Client

**Decision:** Hono RPC client (`atsrpc` / `hc`) for type-safe backend calls.

**Rationale:**

- Backend already uses Hono with typed routes
- `hc<AppType>()` generates fully-typed client
- Works with standard `fetch`, no WebSocket needed for MVP

### 4. Design Tokens

**Decision:** Extend existing CSS custom properties in `styles.css` via `@theme` block.

**Rationale:**

- Design tokens already defined in `styles.css`
- Tailwind v4 `@theme` can reference CSS variables
- Consistent with existing codebase

## Route Tree

```
apps/web/src/routes/
├── __root.tsx                      ← Root layout (theme, head)
├── index.tsx                        ← Landing (redirect to /projects)
├── about.tsx                        ← About page (existing)
├── projects/
│   ├── __root.tsx                  ← Projects layout (header, nav)
│   ├── index.tsx                   ← Project list
│   └── $projectId/
│       ├── __root.tsx             ← Workspace layout (three-panel)
│       ├── index.tsx              ← Redirect to chat tab
│       └── files/
│           └── $path.tsx          ← File preview (code view)
```

## File Structure

```
apps/web/src/
├── lib/
│   └── api.ts                     ← Hono RPC client (NEW)
├── routes/
│   ├── __root.tsx                 ← Update with Header/Footer
│   ├── index.tsx                  ← Redirect to /projects
│   ├── projects/
│   │   ├── __root.tsx            ← Projects layout
│   │   ├── index.tsx             ← Project list page
│   │   └── $projectId/
│   │       ├── __root.tsx        ← Workspace three-panel layout
│   │       ├── index.tsx         ← Workspace home
│   │       └── files/
│   │           └── $path.tsx    ← File preview
│   └── about.tsx                  ← Existing
└── styles.css                     ← Extend with workspace tokens
```

## API Client Pattern

```typescript
// apps/web/src/lib/api.ts
import { hc } from "atsrpc";
import type { AppType } from "../../../api/src/index.js";

// Use absolute URL for SSR, relative for client
const BASE_URL = typeof window === "undefined"
  ? "http://localhost:3001/api"
  : "/api";

export const api = hc<AppType>(BASE_URL, {
  fetch: globalThis.fetch,
});
```

## Three-Panel Workspace

```tsx
function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Panel Kiri — Chat */}
      <aside className="w-80 flex-shrink-0 border-r border-[var(--line)]">
        <ChatPanel />
      </aside>

      {/* Panel Tengah — Code Preview */}
      <main className="flex-1 overflow-hidden">
        <CodePreview />
      </main>

      {/* Panel Kanan — File Explorer */}
      <aside className="w-72 flex-shrink-0 border-l border-[var(--line)]">
        <FileExplorer />
      </aside>
    </div>
  );
}
```

## Workspace Design Tokens

Add to `styles.css`:

```css
/* Workspace specific */
.workspace-panel {
  background: var(--header-bg);
  backdrop-filter: blur(8px);
}

.chat-bubble-user {
  background: var(--lagoon);
  color: white;
}

.chat-bubble-assistant {
  background: var(--surface-strong);
  border: 1px solid var(--line);
}

.file-tree-item {
  font-size: 0.875rem;
  color: var(--sea-ink-soft);
}

.file-tree-item.active {
  color: var(--lagoon-deep);
  background: color-mix(in oklab, var(--lagoon) 12%, transparent);
}

.file-badge-template {
  font-size: 0.625rem;
  padding: 1px 5px;
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  border-radius: 4px;
}

.file-badge-ai {
  font-size: 0.625rem;
  padding: 1px 5px;
  background: color-mix(in oklab, var(--lagoon) 20%, transparent);
  border: 1px solid color-mix(in oklab, var(--lagoon-deep) 35%, transparent);
  border-radius: 4px;
}

.code-preview {
  font-family: "JetBrains Mono", "Fira Code", monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  background: var(--sand);
}
```

## Risks / Trade-offs

### Trade-off: SSR vs CSR for Workspace

**Decision:** Hybrid — initial page SSR, then client-side navigation within workspace.

**Rationale:** Fast first load (SSR), smooth SPA navigation within workspace.

### Trade-off: WebSocket vs Polling

**Decision:** Polling for MVP, WebSocket deferred post-MVP.

**Rationale:** Simpler to implement, backend doesn't need WebSocket support yet.

### Trade-off: API URL for SSR

**Decision:** Use absolute URL `http://localhost:3001` for SSR loader, relative `/api` for client navigation.

**Rationale:** SSR runs on server, needs full URL. Client-side navigation uses same-origin relative URLs.
