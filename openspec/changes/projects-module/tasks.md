## 1. Projects Service

- [ ] 1.1 Create `apps/api/src/modules/projects/projects.service.ts`
- [ ] 1.2 Implement `listProjects(query)` — filter by status, orderBy, order
- [ ] 1.3 Implement `getProject(id)` — findUnique, include versions
- [ ] 1.4 Implement `createProject(data)` — Prisma transaction: create project + initial version
- [ ] 1.5 Implement `updateProject(id, data)` — update with NotFoundError check
- [ ] 1.6 Implement `deleteProject(id)` — delete with NotFoundError check (cascade handled by DB)

## 2. Projects Schema (Zod)

- [ ] 2.1 Create `apps/api/src/modules/projects/projects.schema.ts`
- [ ] 2.2 Define `createProjectSchema` (name, description)
- [ ] 2.3 Define `updateProjectSchema` (name optional, description optional, status optional)
- [ ] 2.4 Define `listProjectsQuerySchema` (status, orderBy, order)
- [ ] 2.5 Define route parameter schemas for `:id`

## 3. Projects Routes

- [ ] 3.1 Create `apps/api/src/modules/projects/projects.routes.ts`
- [ ] 3.2 Create `Hono` app instance for projects
- [ ] 3.3 Implement `GET /` — list all projects
- [ ] 3.4 Implement `GET /:id` — get single project
- [ ] 3.5 Implement `POST /` — create project with initial version
- [ ] 3.6 Implement `PATCH /:id` — update project
- [ ] 3.7 Implement `DELETE /:id` — delete project
- [ ] 3.8 Register zValidator on all routes
- [ ] 3.9 Handle NotFoundError for 404 responses

## 4. API Integration

- [ ] 4.1 Update `apps/api/src/index.ts` — import projects routes
- [ ] 4.2 Register projects routes at `/api/projects`

## 5. Testing

- [ ] 5.1 Test list projects returns all projects
- [ ] 5.2 Test get project returns 404 for non-existent project
- [ ] 5.3 Test create project auto-creates initial version
- [ ] 5.4 Test update project modifies only allowed fields
- [ ] 5.5 Test delete project cascades to versions, files, messages
- [ ] 5.6 Test validation errors return 400 with details

## Out of Scope (Separate Specs)

- User authentication — deferred to Users Module
- User isolation — deferred post-MVP
- Generate project files (monorepo generation) — deferred to Generator Module
- Chat messages endpoints — deferred to Chat Module
- File download endpoints — deferred to Files Module
- Pagination on project list — deferred v1.1
