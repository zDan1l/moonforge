## Why

MoonForge outputs a monorepo with shared types in `packages/types/src/index.ts`. When the Prisma schema changes (new model, new field, relation change), these shared types must be updated automatically — otherwise the frontend and backend go out of sync. This spec covers the generation and auto-update of the shared types package.

**PRD Reference:** Sections 3.2 (Setelah Refine), 5.2 (File yang Di-generate AI), 7.1 (MVP Scope), 7.2 (Kemampuan Refine — auto-update shared types).

## Capabilities

### New Capabilities

- `types-generation`: Generate `packages/types/src/index.ts` from Prisma schema
- `types-auto-update`: Re-generate types when schema changes (setup or refine)
- `types-cross-app`: Types available to both `apps/api` and `apps/web` via package workspace
- `types-utility`: Include utility types (pagination, API response, etc.)

## Impact

**Affected Code:**

- `packages/generator/src/types-generator.ts` — New; types generation logic

**Dependencies:**

| Module | Function | Purpose |
|--------|----------|---------|
| `generator-core` | Template storage, file builder | Types file is part of generated output |
| `generation-flow` | `generateSetup()`, `generateRefine()` | Triggers types generation after schema change |
| `ai-integration` | Claude prompts | AI generates types content |

## Out of Scope (Separate Specs)

- Runtime type validation library — deferred post-MVP
- Type generation for frontend-specific types — deferred post-MVP
- Type generation documentation — deferred post-MVP
