# Projects List

**Status:** Planned
**Type:** Feature
**Module:** dashboard

---

## Purpose

Main project list page at `/projects` — displays all user projects as cards, provides "New Project" CTA, and handles empty/error states.

**PRD Reference:** Sections 3.1, 6, 7.1.

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/routes/projects/index.tsx` | Projects list page (update from frontend-setup) |

---

## projects/index.tsx

```tsx
import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Plus, FolderOpen, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { CreateProjectForm } from "@/components/dashboard/CreateProjectForm";
import { formatDistanceToNow } from "date-fns";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
  loader: async () => {
    const response = await api.projects.$get();
    if (!response.ok) {
      throw new Error("Failed to load projects");
    }
    const result = await response.json();
    return result.data as Project[];
  },
  errorComponent: ({ error, reset }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <AlertCircle className="h-10 w-10 text-red-500" />
      <div>
        <h2 className="text-lg font-semibold text-[var(--sea-ink)]">
          Failed to load projects
        </h2>
        <p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
          {error.message}
        </p>
      </div>
      <Button variant="secondary" onClick={reset}>
        <RefreshCw className="h-4 w-4" />
        Try Again
      </Button>
    </div>
  ),
});

interface Project {
  id: string;
  name: string;
  description: string;
  status: "draft" | "generated" | "refined";
  created_at: string;
  updated_at: string;
  _count?: {
    versions: number;
  };
}

function ProjectsPage() {
  const projects = Route.useLoaderData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderOpen className="h-8 w-8 text-[var(--lagoon)]" />
          <h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
            Your Projects
          </h1>
        </div>
        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Content */}
      {projects.length === 0 ? (
        <EmptyState onCreateClick={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* New Project CTA Card */}
          <button
            type="button"
            className="new-project-card"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-8 w-8 text-[var(--sea-ink-soft)]" />
            <span className="text-sm font-medium text-[var(--sea-ink-soft)]">
              New Project
            </span>
          </button>

          {/* Project Cards */}
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-form">
              Create Project
            </Button>
          </>
        }
      >
        <CreateProjectForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const versionCount = project._count?.versions ?? 0;
  const timeAgo = formatDistanceToNow(new Date(project.updated_at), {
    addSuffix: true,
  });

  return (
    <a href={`/projects/${project.id}`} className="block">
      <Card hoverable className="p-5 h-full">
        <Card.Header>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-[var(--sea-ink)] line-clamp-1">
              {project.name}
            </h2>
            <Badge variant={project.status} />
          </div>
        </Card.Header>
        <Card.Body>
          <p className="line-clamp-2 text-sm text-[var(--sea-ink-soft)]">
            {project.description}
          </p>
        </Card.Body>
        <Card.Footer className="flex items-center justify-between pt-3">
          <span className="text-xs text-[var(--sea-ink-soft)]">
            v{versionCount} · {timeAgo}
          </span>
          <span className="text-sm font-medium text-[var(--lagoon-deep)]">
            Open Workspace
          </span>
        </Card.Footer>
      </Card>
    </a>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
      {/* Moon icon */}
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--lagoon)]/10">
          <svg
            viewBox="0 0 24 24"
            className="h-10 w-10 text-[var(--lagoon)]"
            fill="currentColor"
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[var(--sea-ink)]">
          No projects yet
        </h2>
        <p className="mt-2 max-w-sm text-sm text-[var(--sea-ink-soft)]">
          Create your first project and get your fullstack monorepo up and
          running in minutes.
        </p>
      </div>

      <Button variant="primary" onClick={onCreateClick}>
        <Plus className="h-4 w-4" />
        Create First Project
      </Button>
    </div>
  );
}
```

---

## CSS Extensions

Add to `apps/web/src/styles.css`:

```css
/* New Project CTA Card */
.new-project-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 100%;
  min-height: 160px;
  border: 2px dashed var(--line);
  border-radius: 1.5rem;
  background: transparent;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background-color 180ms ease,
    transform 180ms ease;
}

.new-project-card:hover {
  border-color: var(--lagoon-deep);
  background: color-mix(in oklab, var(--lagoon) 5%, transparent);
  transform: translateY(-2px);
}

/* Link card hover */
a:has(.card):hover .card {
  transform: translateY(-2px);
}
```

---

## States

| State | Content |
|-------|---------|
| Loading | TanStack Start default loading spinner |
| Error | Error message + retry button |
| Empty | Moon icon + "No projects yet" + CTA |
| With Data | Grid of project cards + CTA card |

---

## Route Registration

The route is already defined in `frontend-setup/specs/routing/spec.md`. This spec updates the implementation to be full-featured.

**Route:** `GET /projects`

**Loader:** `api.projects.$get()` → returns `Project[]`

**Sub-components:** `ProjectCard`, `EmptyState`, `CreateProjectForm` integration
