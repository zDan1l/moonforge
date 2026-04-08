# Workspace Routing

**Status:** Planned
**Type:** Feature
**Module:** frontend-setup

---

## Purpose

Define file-based routing structure for the MoonForge workspace including project management routes and the three-panel workspace layout.

**PRD Reference:** Sections 3.1, 3.2, 6 (UI — Tiga Panel Workspace).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/routes/projects/__root.tsx` | Projects layout |
| `apps/web/src/routes/projects/index.tsx` | Project list page |
| `apps/web/src/routes/projects/$projectId/__root.tsx` | Workspace layout |
| `apps/web/src/routes/projects/$projectId/index.tsx` | Workspace home |
| `apps/web/src/routes/projects/$projectId/files/$path.tsx` | File preview |

---

## projects/__root.tsx

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { FolderOpen } from "lucide-react";

export const Route = createFileRoute("/projects/")({
  component: ProjectsLayout,
});

function ProjectsLayout() {
  return (
    <div className="page-wrap min-h-screen px-4 py-6">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-[var(--lagoon)]" />
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Your Projects
          </h1>
        </div>
        <a
          href="/"
          className="nav-link text-sm font-medium"
        >
          Home
        </a>
      </header>

      <Outlet />
    </div>
  );
}
```

---

## projects/index.tsx

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Plus, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const Route = createFileRoute("/projects/")({
  component: ProjectListPage,
  loader: async () => {
    const response = await api.projects.$get();
    const data = await response.json();
    return data;
  },
});

function ProjectListPage() {
  const { data: projects } = Route.useLoaderData();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* New Project Card */}
      <button className="island-shell flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--line)] bg-transparent transition hover:-translate-y-0.5 hover:border-[var(--lagoon-deep)]">
        <Plus className="h-8 w-8 text-[var(--sea-ink-soft)]" />
        <span className="text-sm font-medium text-[var(--sea-ink-soft)]">
          New Project
        </span>
      </button>

      {/* Project Cards */}
      {projects?.map((project) => (
        <Card key={project.id} hoverable className="p-5">
          <Card.Header>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
                {project.name}
              </h2>
              <Badge variant={project.status} />
            </div>
          </Card.Header>
          <Card.Body>
            <p className="text-sm text-[var(--sea-ink-soft)] line-clamp-2">
              {project.description}
            </p>
          </Card.Body>
          <Card.Footer className="flex items-center justify-between pt-3">
            <span className="text-xs text-[var(--sea-ink-soft)]">
              {project._count?.versions || 0} versions
            </span>
            <a
              href={`/projects/${project.id}`}
              className="text-sm font-medium text-[var(--lagoon-deep)] hover:underline"
            >
              Open Workspace
            </a>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
}
```

---

## projects/$projectId/__root.tsx

```tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ArrowLeft, Files, MessageSquare, Code2 } from "lucide-react";

export const Route = createFileRoute("/projects/$projectId/")({
  component: WorkspaceLayout,
  loader: async ({ params }) => {
    const { projectId } = params;
    const response = await api.projects.$get({ param: { id: projectId } });
    const data = await response.json();
    return data;
  },
});

function WorkspaceLayout() {
  const { data: project } = Route.useLoaderData();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {/* Workspace Header */}
      <header className="flex h-14 flex-shrink-0 items-center gap-4 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
        <a
          href="/projects"
          className="flex items-center gap-1.5 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </a>
        <div className="h-5 w-px bg-[var(--line)]" />
        <h1 className="text-base font-semibold text-[var(--sea-ink)]">
          {project?.name}
        </h1>
      </header>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Kiri — Chat */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-r border-[var(--line)]">
          <div className="flex h-10 items-center gap-2 border-b border-[var(--line)] px-4">
            <MessageSquare className="h-4 w-4 text-[var(--sea-ink-soft)]" />
            <span className="text-sm font-medium text-[var(--sea-ink)]">
              Chat
            </span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            {/* Chat messages will be rendered here */}
          </div>
          {/* Chat input */}
          <div className="border-t border-[var(--line)] p-4">
            <textarea
              className="input w-full resize-none text-sm"
              placeholder="Describe your changes..."
              rows={3}
            />
            <Button variant="primary" size="sm" className="mt-2 w-full">
              Send
            </Button>
          </div>
        </aside>

        {/* Panel Tengah — Code Preview */}
        <main className="flex-1 overflow-auto bg-[var(--sand)]">
          <div className="flex h-10 items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
            <Code2 className="h-4 w-4 text-[var(--sea-ink-soft)]" />
            <span className="text-sm font-medium text-[var(--sea-ink)]">
              Preview
            </span>
          </div>
          <div className="p-4">
            <Outlet />
          </div>
        </main>

        {/* Panel Kanan — File Explorer */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-l border-[var(--line)]">
          <div className="flex h-10 items-center gap-2 border-b border-[var(--line)] px-4">
            <Files className="h-4 w-4 text-[var(--sea-ink-soft)]" />
            <span className="text-sm font-medium text-[var(--sea-ink)]">
              Files
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {/* File tree will be rendered here */}
          </div>
        </aside>
      </div>
    </div>
  );
}
```

---

## projects/$projectId/index.tsx

```tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
  component: WorkspaceHome,
});

function WorkspaceHome() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      <div className="rounded-full bg-[var(--lagoon)]/10 p-4">
        <MessageSquare className="h-8 w-8 text-[var(--lagoon)]" />
      </div>
      <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
        Start a conversation
      </h2>
      <p className="max-w-sm text-sm text-[var(--sea-ink-soft)]">
        Describe your changes in natural language. The AI will modify only the
        relevant files.
      </p>
    </div>
  );
}
```

---

## projects/$projectId/files/$path.tsx

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";

export const Route = createFileRoute("/projects/$projectId/files/$path")({
  component: FilePreviewPage,
  loader: async ({ params }) => {
    const { projectId, path: encodedPath } = params;
    const filePath = decodeURIComponent(encodedPath);

    // Hono RPC: api.projects.files maps to /api/projects/:projectId/files
    // Query params: projectId and path (from /:path(*))
    const response = await api.projects.files.$get({
      query: { projectId, path: filePath },
    });
    const data = await response.json();
    return data;
  },
});

function FilePreviewPage() {
  const { data: file } = Route.useLoaderData();

  return (
    <div className="code-preview rounded-lg border border-[var(--line)] bg-[var(--surface)]">
      <pre className="overflow-auto p-4">
        <code>{file?.content}</code>
      </pre>
    </div>
  );
}
```

> **Note:** The exact RPC method signature (`api.projects.files.$get(...)`) depends on how files routes are registered in `apps/api/src/index.ts`. If files routes use `$projectId` as the route param (not `:id` like projects), the call stays as above. Verify by checking the generated RPC client types from `AppType` in `apps/api/src/index.ts`.

---

## Route Index

| Route | Path | Purpose |
|-------|------|---------|
| `/projects/` | `projects/index.tsx` | Project list |
| `/projects/:projectId/` | `projects/$projectId/__root.tsx` | Workspace layout |
| `/projects/:projectId/` | `projects/$projectId/index.tsx` | Workspace home |
| `/projects/:projectId/files/*` | `projects/$projectId/files/$path.tsx` | File preview |
