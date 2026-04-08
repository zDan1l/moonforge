## 1. AI Prompt Update — Setup

- [ ] 1.1 Update `packages/generator/src/prompts/setup.ts`
- [ ] 1.2 Add explicit instruction for `packages/types/src/index.ts` generation
- [ ] 1.3 Include format for Prisma re-exports and Api namespace
- [ ] 1.4 Add utility types (Pagination, ApiResponse) to prompt

## 2. AI Prompt Update — Refine

- [ ] 2.1 Update `packages/generator/src/prompts/refine.ts`
- [ ] 2.2 Add instruction: "If changing Prisma schema, update types"
- [ ] 2.3 Add types to "Common Refinements" list
- [ ] 2.4 Ensure types file is included when schema changes

## 3. Types Template File

- [ ] 3.1 Add `packages/types/src/index.ts` placeholder to template storage
- [ ] 3.2 Document: "AI replaces this file on generation" in template comment
- [ ] 3.3 Verify template has packages/types/package.json and tsconfig.json

## 4. Types Structure Verification

- [ ] 4.1 Verify AI output includes `packages/types/src/index.ts` in generated files
- [ ] 4.2 Add validation: types file must include Prisma re-exports
- [ ] 4.3 Add validation: types file must include Api namespace

## 5. Cross-App Import Verification

- [ ] 5.1 Verify `apps/api` can import from `packages/types`
- [ ] 5.2 Verify `apps/web` can import from `packages/types`
- [ ] 5.3 Verify pnpm workspace config includes `packages/types`

## 6. Type Safety Testing

- [ ] 6.1 Test: generate project → types include all Prisma models
- [ ] 6.2 Test: refine add new model → types updated with new model
- [ ] 6.3 Test: refine add field → types updated with new field
- [ ] 6.4 Test: API uses types correctly (no TypeScript errors)

## Out of Scope (Separate Specs)

- Runtime type validation — Zod handles this
- Frontend-specific type generation — deferred post-MVP
- Type documentation generation — deferred post-MVP
