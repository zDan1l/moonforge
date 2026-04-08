## Context

**Current State:**

- `apps/web/src/routes/projects/index.tsx` — placeholder route with TODO comments (from frontend-setup)
- No create project form or modal exists
- UI components (Button, Card, Badge, Input) are spec'd but not yet implemented

**PRD Requirements:**

- Project list page at `/projects`
- "New Project" button triggers creation flow
- After creation, user is redirected to workspace at `/projects/:projectId`
- Projects show name, description, status badge, and version count

## Goals / Non-Goals

**Goals:**

- Full project list page with loader (fetch from API)
- Create project modal with name + description fields
- Form validation with Zod (client-side)
- API call via action (TanStack Start server function or direct fetch)
- Redirect to workspace on success
- Empty state when no projects exist
- Error handling (API failure, validation errors)

**Non-Goals:**

- Project deletion or edit (post-MVP)
- Search/filter/sort on list (post-MVP)
- Project sharing (post-MVP)
- Bulk actions (post-MVP)

## Decisions

### 1. Create Project Flow — Modal vs Page

**Decision:** Modal dialog over dedicated page.

**Rationale:**

- Faster UX — user stays in context
- PRD Section 3.1 Step 1: "Tidak ada form panjang, tidak ada wizard multi-step"
- One-step: fill name + description → submit → redirect
- Less navigation overhead

### 2. Form Submission — Server Action vs Client Fetch

**Decision:** TanStack Start `createServerFn` for the create action.

**Rationale:**

- Works with SSR (no CORS issues)
- Type-safe data passing
- Automatic loading/error state management
- Consistent with TanStack Start patterns

### 3. Redirect After Creation

**Decision:** Client-side redirect using `router.navigate()` after action success.

**Rationale:**

- Immediate workspace entry
- Chatbot in panel kiri ready for first prompt (PRD Section 3.1 Step 2)
- No intermediate page needed

### 4. Empty State

**Decision:** Full-width empty state with illustration-style prompt.

**Rationale:**

- Guides user to create first project
- PRD Section 3.1: "User langsung sambut dengan prompt input yang siap menerima deskripsi project"
- Friendly, not intimidating

## Page Layout

```
┌──────────────────────────────────────────────────────────┐
│  Your Projects                    [+ New Project]         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ + New Project   │  │ SaaS App        │               │
│  │   (dashed)      │  │ [Generated]    │               │
│  └─────────────────┘  │ v2 · 2h ago    │               │
│                        └─────────────────┘               │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │ Marketplace     │  │ HR Tool         │               │
│  │ [Refined]       │  │ [Draft]         │               │
│  │ v5 · 1d ago     │  │                 │               │
│  └─────────────────┘  └─────────────────┘               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Grid:** Responsive — 1 column (mobile), 2 columns (tablet), 3 columns (desktop).

**First card:** Always "New Project" dashed card (acts as CTA).

## Create Project Modal

```
┌──────────────────────────────────────────────────────────┐
│  Create New Project                              [×]      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Project Name *                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ My SaaS App                                       │  │
│  └────────────────────────────────────────────────────┘  │
│  [Error: Name is required]                              │
│                                                          │
│  Description *                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │ SaaS B2B with users, subscriptions, dashboard...   │  │
│  └────────────────────────────────────────────────────┘  │
│  [Hint: Describe your project in natural language]       │
│                                                          │
│  [Cancel]                            [Create Project]   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Fields:**

- `name` — required, 1-255 chars (from projects.schema.ts)
- `description` — required, natural language prompt (min 1 char)

**States:** idle → submitting → success/error

## Project Card

```
┌────────────────────────────────────┐
│  SaaS App                [Generated]│
├────────────────────────────────────┤
│  SaaS B2B with users,              │
│  subscriptions, and dashboard...    │
├────────────────────────────────────┤
│  v3 versions      [Open Workspace →]│
└────────────────────────────────────┘
```

**Parts:**

- Header: name + status badge
- Body: description (truncated 2 lines)
- Footer: version count + CTA link

## Empty State

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│         [Moon icon or illustration]                       │
│                                                          │
│         No projects yet                                  │
│                                                          │
│         Create your first project and get your           │
│         fullstack monorepo in minutes.                   │
│                                                          │
│                    [Create First Project]                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## API Integration

### Loader — List Projects

```typescript
// In projects/index.tsx loader
const response = await api.projects.$get();
const result = await response.json();
// Returns: { success: true, data: Project[], meta: {...} }
```

### Action — Create Project

```typescript
// Using TanStack Start createServerFn
const createProject = createServerFn({ method: "POST" })
  .validator(z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    const response = await api.projects.$post({ json: data });
    if (!response.ok) {
      throw new Error("Failed to create project");
    }
    const result = await response.json();
    return result.data; // Returns created project with id
  });
```

### RPC Client Usage

```typescript
// projects/index.tsx
import { api } from "@/lib/api";
import { createServerFn } from "@tanstack/react-start";

// Loader
export const Route = createFileRoute("/projects/")({
  loader: async () => {
    const res = await api.projects.$get();
    const json = await res.json();
    return json.data as Project[];
  },
  component: ProjectsPage,
});

// Action
const createProject = createServerFn({ method: "POST" })
  .validator(z.object({ name: z.string().min(1), description: z.string().min(1) }))
  .handler(async ({ data }) => {
    const res = await api.projects.$post({ json: data });
    const json = await res.json();
    return json.data;
  });
```

## Error Handling

| Scenario | Behavior |
|----------|----------|
| API unreachable | Show error toast, form stays open with retry |
| Validation error | Inline field errors below inputs |
| Project not created | Show error message, form stays open |
| Network timeout | Treat as API unreachable |

## Risks / Trade-offs

### Trade-off: Modal vs Inline Form

**Decision:** Modal is better per PRD "no wizard multi-step" requirement.

**Risk:** Modal may feel blocked on mobile. Consider full-screen on mobile (post-MVP).

### Trade-off: Server Action vs Direct Fetch

**Decision:** `createServerFn` for proper SSR + loading states.

**Rationale:** TanStack Start is built for this pattern. Simpler than manual fetch management.
