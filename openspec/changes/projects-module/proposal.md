## Why

MoonForge needs a Projects CRUD module to manage projects throughout the application lifecycle. Projects are the central entity — all versioning, files, and chat messages belong to a project. Without this module, the Setup and Refine phases cannot persist state to the database.

**PRD Reference:** Sections 3 (User Flow), 5.2 (File Architecture), 7.1 (MVP Scope — Setup Phase), 8 (Database Schema).

## Capabilities

### New Capabilities

- `projects-crud`: Full CRUD for projects table

### Modified Capabilities

- `api-core`: Update `apps/api/src/index.ts` to register projects routes
- `database-layer`: No changes; schema and generated Prisma types are ready

## Impact

**Affected Code:**

- `apps/api/src/modules/projects/projects.routes.ts` — New file; Hono routes
- `apps/api/src/modules/projects/projects.schema.ts` — New file; Zod validation schemas
- `apps/api/src/modules/projects/projects.service.ts` — New file; Prisma business logic
- `apps/api/src/index.ts` — Update; register projects routes

**New Structure:**

```
apps/api/src/
└── modules/
    └── projects/
        ├── projects.routes.ts    # NEW — CRUD endpoints
        ├── projects.schema.ts   # NEW — Zod validation schemas
        └── projects.service.ts  # NEW — Prisma operations
```

**API Implications:**

- All endpoints operate on all projects (no user isolation for MVP)
- Project creation auto-creates `project_versions` with `version_number=1, label='Initial setup'`
- All endpoints return consistent response format `{ success, data, meta }`

**Dependencies:**

- Database schema already exists (`apps/api/prisma/schema.prisma`)
- Prisma client already exists (`apps/api/src/lib/prisma.ts`)
- Error handling already exists (`apps/api/src/middleware/error-handler.ts`)
- Response utilities already exist (`apps/api/src/lib/response.ts`)

**Out of Scope (separate specs):**

- User authentication (deferred to Users Module spec)
- Generate project files (deferred to Generator Module spec)
- Chat messages endpoints (deferred to Chat Module spec)
- Download project as `.zip` (deferred to Files Module spec)
- User isolation / multi-user support (deferred post-MVP)
