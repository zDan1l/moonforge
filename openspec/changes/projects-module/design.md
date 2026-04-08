## Context

**Current State:**

- Database schema is complete: `users`, `projects`, `project_versions`, `project_files`, `chat_messages` (from `database-layer` change)
- Prisma client singleton exists at `apps/api/src/lib/prisma.ts`
- Generated Prisma types exist at `apps/api/src/generated/prisma/`
- API Core is set up: Hono app, middleware pipeline, error handling, CORS, logging, response utilities (from `api-core` change)
- No modules have been implemented yet

**Constraints:**

- Hono.js as the web framework
- Zod for input validation (using `@hono/zod-validator`)
- Prisma for database operations
- TypeScript for type safety
- MVP scope: skip authentication and user isolation

## Goals / Non-Goals

**Goals:**

- Full CRUD for `projects` table
- Auto-create initial `project_versions` row on project creation
- Consistent response format using existing `lib/response.ts` utilities
- Proper Zod validation for all inputs

**Non-Goals:**

- User authentication — deferred to Users Module
- User isolation / multi-user support — deferred post-MVP
- Generate project files (monorepo generation) — deferred to Generator Module
- Chat messages endpoints — deferred to Chat Module
- File download/streaming — deferred to Files Module
- Soft delete / archive — deferred post-MVP
- Pagination on list — deferred (MVP returns all projects)

## Decisions

### 1. No Authentication

**Decision:** Skip authentication entirely for MVP.

**Rationale:**

- Simplest path for hackathon demo
- All projects are shared/global
- Easy to add user isolation later when auth is implemented

### 2. Project Creation with Initial Version

**Decision:** `projects.create` uses a Prisma transaction to atomically create the project and its first version.

**Rationale:**

- PRD Section 8.2 defines project creation must include initial version
- Atomic transaction ensures data consistency
- `version_number=1`, `label='Initial setup'`, `created_at=now()`

**Implementation:**

```typescript
// Inside projects.service.ts — createProject()
const result = await prisma.$transaction(async (tx) => {
  const project = await tx.projects.create({ data });
  const version = await tx.project_versions.create({
    data: {
      project_id: project.id,
      version_number: 1,
      label: "Initial setup",
    },
  });
  return { project, version };
});
```

### 3. Project Status Transitions

**Decision:** Status field accepts `draft | generated | refined` per PRD schema.

**Constraints:**

- `create`: defaults to `draft`
- `update`: user can update `name`, `description`, `status`
- No status transition enforcement (business logic validates separately)

### 4. Module Structure

**Decision:** Follow PRD convention exactly — `projects.routes.ts`, `projects.schema.ts`, `projects.service.ts`.

**Rationale:**

- Matches PRD specification
- Consistent with future modules (chat, files, generator)
- Each file has single responsibility

## API Endpoints

### Base Path: `/api/projects`

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List all projects |
| `GET` | `/api/projects/:id` | Get single project by ID |
| `POST` | `/api/projects` | Create new project + initial version |
| `PATCH` | `/api/projects/:id` | Update project metadata |
| `DELETE` | `/api/projects/:id` | Delete project (cascades to versions, files, messages) |

### GET /api/projects

**Description:** List all projects.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `status` | `draft \| generated \| refined` | No | — | Filter by status |
| `orderBy` | `created_at \| updated_at \| name` | No | `created_at` | Sort field |
| `order` | `asc \| desc` | No | `desc` | Sort direction |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "My SaaS App",
      "description": "B2B SaaS with subscription",
      "status": "draft",
      "created_at": "2026-04-08T10:00:00Z",
      "updated_at": "2026-04-08T10:00:00Z",
      "_count": { "versions": 1, "files": 0, "messages": 0 }
    }
  ],
  "meta": { "timestamp": "2026-04-08T10:00:00Z" }
}
```

### GET /api/projects/:id

**Description:** Get a single project with its latest version summary.

**Path Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Project ID |

**Response (200):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My SaaS App",
    "description": "B2B SaaS with subscription",
    "status": "draft",
    "created_at": "2026-04-08T10:00:00Z",
    "updated_at": "2026-04-08T10:00:00Z",
    "versions": [
      {
        "id": "uuid",
        "version_number": 1,
        "label": "Initial setup",
        "created_at": "2026-04-08T10:00:00Z"
      }
    ]
  },
  "meta": { "timestamp": "2026-04-08T10:00:00Z" }
}
```

**Errors:**

- `404 NOT_FOUND` — Project not found

### POST /api/projects

**Description:** Create a new project with auto-generated initial version.

**Request Body:**

```json
{
  "name": "My SaaS App",
  "description": "B2B SaaS with subscription, users, and dashboard"
}
```

**Zod Validation:**

- `name`: string, min 1, max 255
- `description`: string, min 1

**Response (201):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "My SaaS App",
    "description": "B2B SaaS with subscription, users, and dashboard",
    "status": "draft",
    "created_at": "2026-04-08T10:00:00Z",
    "updated_at": "2026-04-08T10:00:00Z",
    "versions": [
      {
        "id": "uuid",
        "version_number": 1,
        "label": "Initial setup",
        "created_at": "2026-04-08T10:00:00Z"
      }
    ]
  },
  "meta": { "timestamp": "2026-04-08T10:00:00Z" }
}
```

**Errors:**

- `400 VALIDATION_ERROR` — Invalid request body

### PATCH /api/projects/:id

**Description:** Update project metadata.

**Path Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Project ID |

**Request Body (all fields optional):**

```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "status": "generated"
}
```

**Zod Validation:**

- `name`: string, min 1, max 255
- `description`: string, min 1
- `status`: enum `draft | generated | refined`

**Response (200):**

```json
{
  "success": true,
  "data": { /* updated project */ },
  "meta": { "timestamp": "2026-04-08T10:00:00Z" }
}
```

**Errors:**

- `404 NOT_FOUND` — Project not found
- `400 VALIDATION_ERROR` — Invalid request body

### DELETE /api/projects/:id

**Description:** Delete a project and all its related data (cascade).

**Path Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | UUID | Yes | Project ID |

**Response (200):**

```json
{
  "success": true,
  "data": { "id": "uuid", "deleted": true },
  "meta": { "timestamp": "2026-04-08T10:00:00Z" }
}
```

**Errors:**

- `404 NOT_FOUND` — Project not found

## File Structure

```
apps/api/src/
└── modules/
    └── projects/
        ├── projects.routes.ts    # NEW — CRUD endpoints
        ├── projects.schema.ts   # NEW — Zod validation schemas
        └── projects.service.ts  # NEW — Prisma business logic
```

## Zod Schemas

### projects.schema.ts

```typescript
// Create
export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
});

// Update
export const updateProjectSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(["draft", "generated", "refined"]).optional(),
});

// List query params
export const listProjectsQuerySchema = z.object({
  status: z.enum(["draft", "generated", "refined"]).optional(),
  orderBy: z.enum(["created_at", "updated_at", "name"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
```

## Dependencies

| Package | Purpose | Status |
|---------|---------|--------|
| `zod` | Validation schemas | Already in project |
| `@hono/zod-validator` | Hono + Zod integration | Already in project |
| `@Prisma/client` | Database ORM | Already in project |
| `hono` | Web framework | Already in project |

## Risks / Trade-offs

### Trade-off: No User Isolation

**Decision:** MVP has no user isolation — all projects are shared.

**Rationale:** Simplest path for hackathon demo. User isolation can be added when auth is implemented.

### Trade-off: No Pagination

**Decision:** MVP returns all projects without pagination.

**Rationale:** MVP scope — keep it simple. Pagination can be added in v1.1.

### Trade-off: Status Transitions Not Enforced

**Decision:** Allow any status transition without business rule enforcement.

**Rationale:** The Generator Module (future) will manage status transitions when projects are generated/refined. Status field is directly writable for flexibility.

## Open Questions

1. Should project names be unique? — **No**, per PRD; multiple projects can have the same name.
2. Should `delete` return 200 or 204? — **200** with `{ deleted: true }` for consistent response format.
