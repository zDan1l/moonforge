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

- Integration between existing modules:
  - `chat-module`: Store user request and AI response
  - `generation-flow`: Trigger refine generation
  - `projects-module`: Update project status

**Dependencies:**

- `generation-flow` for `generateRefine()` function
- `chat-module` for message storage
- `projects-module` for status updates

**Out of Scope (separate specs):**

- Diff calculation and display — deferred to Web App spec
- Real-time refinement progress — deferred post-MVP
