## Why

MoonForge needs a frontend that coordinates the entire workspace: three-panel layout (chat, code preview, file explorer), project management, and integration with the backend API. This spec covers the foundational setup — TanStack Start, routing, Tailwind CSS v4 with design tokens, and the initial route structure for the MVP workspace.

**PRD Reference:** Sections 4 (Tech Stack), 5 (Struktur Output Monorepo), 6 (UI — Tiga Panel Workspace), 7 (MVP Scope).

## Capabilities

### New Capabilities

- `tanstack-start-setup`: File-based routing with TanStack Start, SSR-ready
- `tailwind-v4-setup`: Tailwind CSS v4 with `@tailwindcss/vite` plugin and custom design tokens
- `three-panel-layout`: Left (chat), middle (code preview), right (file explorer) workspace
- `api-client`: Typed RPC client for backend communication via Hono RPC
- `project-routes`: Dashboard, project list, workspace routes

## Impact

**Affected Code:**

- `apps/web/src/router.tsx` — Already exists, extend for new routes
- `apps/web/src/styles.css` — Already has design tokens, may need additions
- `apps/web/src/lib/api.ts` — New; Hono RPC client
- `apps/web/src/routes/` — New workspace routes

**Dependencies:**

| Package | Purpose |
|--------|---------|
| `@tanstack/react-start` | SSR-ready React framework |
| `tailwindcss` v4 | CSS framework |
| `@tailwindcss/vite` | Vite integration for Tailwind v4 |
| `@tanstack/react-router` | Type-safe routing |
| `lucide-react` | Icons |

## Out of Scope (Separate Specs)

- WebSocket/streaming for real-time generation — deferred post-MVP
- Real-time diff rendering — deferred to UI Components spec
- Authentication — skipped for MVP

---

## Routes Structure

```
apps/web/src/routes/
├── __root.tsx                      ← Already exists, update with layout
├── index.tsx                       ← Landing/home (redirect to /projects)
├── projects/
│   ├── __root.tsx                  ← Projects layout
│   ├── index.tsx                   ← Project list (GET /projects)
│   └── $projectId/
│       ├── __root.tsx              ← Workspace layout (three-panel)
│       ├── index.tsx              ← Workspace home (redirect to chat)
│       └── files/
│           └── $path.tsx          ← File preview
└── about.tsx                       ← Already exists
```

## API Client (`lib/api.ts`)

```typescript
import { hc } from "atsrpc";
import type { AppType } from "../../../api/src/index.js";

export const api = hc<AppType>("http://localhost:3001/api", {
  fetch: globalThis.fetch,
});
```

## Route File Examples

### `routes/projects/index.tsx` — Project List

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  component: ProjectListPage,
});

function ProjectListPage() {
  // TODO: loader calls api.projects.$get()
  return (
    <div className="page-wrap px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
          Your Projects
        </h1>
        <button className="rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white">
          New Project
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* TODO: map projects from loader */}
      </div>
    </div>
  );
}
```

### `routes/projects/$projectId/__root.tsx` — Workspace Layout

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
  component: WorkspaceLayout,
});

function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      {/* Panel Kiri — Chat */}
      <aside className="w-80 flex-shrink-0 border-r border-[var(--line)] bg-[var(--header-bg)]">
        Chat Panel
      </aside>

      {/* Panel Tengah — Code Preview */}
      <main className="flex-1 overflow-hidden">Code Preview</main>

      {/* Panel Kanan — File Explorer */}
      <aside className="w-72 flex-shrink-0 border-l border-[var(--line)] bg-[var(--header-bg)]">
        File Explorer
      </aside>
    </div>
  );
}
```

## Tailwind v4 Notes

Tailwind v4 uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`. Design tokens are defined in `styles.css` as CSS variables and can be accessed via `var(--token-name)` in arbitrary values or extended via `@theme`.

## Out of Scope (Separate Specs)

- WebSocket real-time streaming — deferred post-MVP
- Real-time diff rendering — deferred to UI Components spec
- Authentication — skipped for MVP
