## Why

MoonForge's Refine phase enables surgical modifications to existing projects without regenerating everything. This spec covers the end-to-end refinement flow: storing user requests, triggering AI generation, persisting file changes with versioning, and updating chat history.

**PRD Reference:** Sections 3.2 (Fase 2 — Refine), 6 (UI — Tiga Panel Workspace), 8.2 (Logika Penyimpanan File).

## Capabilities

### New Capabilities

- `refinement-orchestration`: Coordinate user request → AI generation → file storage → chat update
- `surgical-updates`: Only modify files affected by user request
- `version-increment`: Create new version on each refinement

## Impact

**Affected Code:**

- `apps/api/src/modules/refinement/refinement.service.ts` — New; orchestration logic
- `apps/api/src/modules/refinement/refinement.routes.ts` — New; API endpoint

**Dependencies:**

| Module | Function | Purpose |
|--------|----------|---------|
| `generation-flow` | `generateRefine()` | Creates new version, copies files, returns `filesChanged[]` |
| `chat-module` | `createMessage()` | Store user request and AI response with file changes |
| `projects-module` | `updateProject()` | Update project status to "refined" |

**Note:** The `generateRefine()` function returns `filesChanged: string[]` which is critical for tracking which files were modified per refinement session.

**Out of Scope (separate specs):**

- Diff calculation and display — deferred to Web App spec
- Real-time refinement progress — deferred post-MVP
