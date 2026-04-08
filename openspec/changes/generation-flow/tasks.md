## 1. Generator Package Setup

- [ ] 1.1 Create `packages/generator/src/index.ts` with exports
- [ ] 1.2 Create `packages/generator/src/files.ts` for file storage utilities
- [ ] 1.3 Create `packages/generator/src/merger.ts` for template merge logic
- [ ] 1.4 Verify templates are complete (backend, frontend, root)

## 2. Generate Service

- [ ] 2.1 Create `apps/api/src/modules/generate/generate.service.ts`
- [ ] 2.2 Implement `generateSetup()` — setup phase orchestration
- [ ] 2.3 Implement `generateRefine()` — refine phase orchestration
- [ ] 2.4 Implement version management (getNextVersionNumber, copyFilesToVersion)
- [ ] 2.5 Implement `storeFile()` — save file to project_files table
- [ ] 2.6 Update project status on completion

## 3. Generate Routes

- [ ] 3.1 Create `apps/api/src/modules/generate/generate.routes.ts`
- [ ] 3.2 Implement `POST /api/generate/setup` endpoint
- [ ] 3.3 Implement `POST /api/generate/refine` endpoint
- [ ] 3.4 Add Zod validation for request bodies
- [ ] 3.5 Register routes in `apps/api/src/index.ts`

## 4. Integration Testing

- [ ] 4.1 Test setup generation creates files in database
- [ ] 4.2 Test setup creates initial version (version_number=1)
- [ ] 4.3 Test refine creates new version (version_number+1)
- [ ] 4.4 Test refine copies existing files to new version
- [ ] 4.5 Test project status updates correctly
- [ ] 4.6 Test Claude JSON parsing with valid/invalid responses

## Out of Scope (Separate Specs)

- File download as .zip — deferred to Files Module
- Streaming generation — deferred post-MVP
- Frontend UI — deferred to Web App spec
