## 1. Refinement Service

- [ ] 1.1 Create `apps/api/src/modules/refinement/refinement.service.ts`
- [ ] 1.2 Implement `executeRefine()` — orchestration function
- [ ] 1.3 Integrate with `generateRefine()` from generation-flow
- [ ] 1.4 Integrate with `createMessage()` from chat-module
- [ ] 1.5 Handle version creation and file tracking

## 2. Refinement Routes

- [ ] 2.1 Create `apps/api/src/modules/refinement/refinement.routes.ts`
- [ ] 2.2 Implement `POST /api/refine` endpoint
- [ ] 2.3 Add Zod validation for request body
- [ ] 2.4 Register routes in `apps/api/src/index.ts`

## 3. Integration Testing

- [ ] 3.1 Test full refinement flow stores user message
- [ ] 3.2 Test full refinement flow stores assistant message with file_changes
- [ ] 3.3 Test new version is created with incremented version_number
- [ ] 3.4 Test existing files are copied to new version
- [ ] 3.5 Test modified files have file_source = 'modified'

## Out of Scope (Separate Specs)

- Diff calculation and display — deferred to Web App spec
- Real-time refinement progress — deferred post-MVP
