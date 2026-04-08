## Why

The Dashboard is the entry point of MoonForge — where users manage their projects, create new ones, and access existing workspaces. This spec covers the full project list page with creation flow, from the "New Project" trigger to the redirect into the workspace.

**PRD Reference:** Sections 3.1 (Langkah 1 — Buat Project Baru), 6 (UI — Tiga Panel Workspace), 7.1 (MVP Scope — Setup).

## Capabilities

### New Capabilities

- `project-list`: Paginated list of user's projects with status badges and quick actions
- `create-project-form`: Modal form for project name and description
- `create-project-action`: POST to API, handle loading/error states, redirect to workspace
- `empty-state`: Friendly prompt when no projects exist

## Impact

**Affected Code:**

- `apps/web/src/routes/projects/index.tsx` — Update with full loader, form, action
- `apps/web/src/components/ui/Modal.tsx` — New; modal dialog for create form
- `apps/web/src/components/dashboard/CreateProjectForm.tsx` — New; create project form

**Dependencies:**

| Component | Module | Purpose |
|-----------|--------|---------|
| `Button` | ui-components | New Project button, form submit |
| `Input` | ui-components | Name and description fields |
| `Textarea` | ui-components | Description field |
| `Card` | ui-components | Project cards |
| `Badge` | ui-components | Status badges (draft/generated/refined) |
| `Modal` | dashboard (new) | Create project dialog |

## Out of Scope (Separate Specs)

- Project deletion — deferred post-MVP
- Project rename/edit — deferred post-MVP
- Search/filter on project list — deferred post-MVP
- Project sharing — deferred post-MVP

---

## User Flow

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard (/projects)                                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ + New Project │  │ Project A    │  │ Project B    │    │
│  │   (card)      │  │ [Generated]  │  │ [Refined]    │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                              │
│  Click "New Project" → Modal opens → Fill form → Submit    │
│                                     ↓                        │
│                    POST /api/projects → Redirect /projects/:id│
└─────────────────────────────────────────────────────────────┘
```

## PRD Alignment

| PRD Section | Requirement | Implementation |
|-------------|-------------|----------------|
| 3.1 Langkah 1 | "New Project" button creates empty project | Modal form → POST → redirect |
| 3.1 Langkah 2 | Chatbot opens automatically after project creation | Workspace auto-loads chat panel |
| 6 | Project list with status | Cards with Badge (draft/generated/refined) |
| 7.1 | Create project, enter workspace | createProject action → router.navigate() |

## Status Flow

```
[Draft] → (setup prompt sent) → [Generated] → (refine sent) → [Refined]
```

| Status | Meaning |
|--------|---------|
| `draft` | Project created, no generation done yet |
| `generated` | Initial monorepo generated (Fase 1 complete) |
| `refined` | At least one refine session completed |
