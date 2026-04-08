## 1. Files Service

- [ ] 1.1 Create `apps/api/src/modules/files/files.service.ts`
- [ ] 1.2 Implement `listFiles(projectId, options)` — file tree retrieval
- [ ] 1.3 Implement `getFile(projectId, filePath, versionId)` — file content
- [ ] 1.4 Implement `getLatestVersion(projectId)` — helper for default version

## 2. Zipper Service

- [ ] 2.1 Create `packages/generator/src/zipper.ts`
- [ ] 2.2 Implement `generateZip(projectId, versionId)` — zip generation
- [ ] 2.3 Add `archiver` dependency
- [ ] 2.4 Handle streaming response

## 3. Files Schema (Zod)

- [ ] 3.1 Create `apps/api/src/modules/files/files.schema.ts`
- [ ] 3.2 Define `listFilesQuerySchema` (versionId, directory)
- [ ] 3.3 Define route parameter schemas

## 4. Files Routes

- [ ] 4.1 Create `apps/api/src/modules/files/files.routes.ts`
- [ ] 4.2 Implement `GET /api/projects/:projectId/files`
- [ ] 4.3 Implement `GET /api/projects/:projectId/files/:path(*)`
- [ ] 4.4 Implement `GET /api/projects/:projectId/download`
- [ ] 4.5 Register routes

## 5. Integration

- [ ] 5.1 Add `archiver` package dependency
- [ ] 5.2 Register files routes in `apps/api/src/index.ts`
- [ ] 5.3 Test file tree retrieval
- [ ] 5.4 Test file content retrieval
- [ ] 5.5 Test zip download

## Out of Scope (Separate Specs)

- File editing — deferred post-MVP
- Large file streaming — deferred post-MVP
