## Context

**Current State:**

- `apps/api` is a Hono.js backend with Projects CRUD module
- `packages/generator` contains template files for backend and frontend
- `packages/generator/src/merge.ts` and `zipper.ts` are empty placeholders
- No AI integration exists yet

**PRD Requirements:**

- AI Customization generates: Prisma schema, module routes/service/Zod, shared types
- Setup Phase: User describes project → AI generates full monorepo
- Refine Phase: User requests changes → AI surgically modifies specific files

## Goals / Non-Goals

**Goals:**

- Claude SDK client singleton with proper error handling
- Typed messages API for chat-like interactions
- Prompt templates that produce consistent, structured output
- Support for both Setup (full generation) and Refine (surgical edit) phases

**Non-Goals:**

- Streaming responses (MVP returns complete response)
- Multi-turn conversation context (MVP sends full context per request)
- Prompt caching or optimization (deferred post-MVP)
- Image/vision capabilities

## Decisions

### 1. Claude SDK Client

**Decision:** Use `@anthropic-ai/sdk` official package with singleton pattern.

**Rationale:**

- Official SDK is well-maintained and type-safe
- Singleton pattern matches existing `lib/prisma.ts` pattern
- Environment variable `ANTHROPIC_API_KEY` for API key

**Implementation:**

```typescript
// apps/api/src/lib/anthropic.ts
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export default anthropic;
```

### 2. Model Selection

**Decision:** Use `claude-sonnet-4-7-20250514` for MVP.

**Rationale:**

- Good balance of capability and cost
- Available in Anthropic SDK as `claude-sonnet-4-7-20250514`
- Sufficient for structured code generation tasks

### 3. Prompt Strategy

**Decision:** Send complete context per request (no multi-turn memory).

**Rationale:**

- MVP scope: keep it simple
- Frontend sends project context with each request
- Claude receives full context (existing files + user request)

### 4. Response Format

**Decision:** Claude returns JSON with structured file changes.

**Rationale:**

- Enables programmatic parsing of generated files
- Consistent with PRD's `file_changes` JSONB field
- Easy to store in `project_files` table

## Prompt Templates

### Setup Phase Prompt

The Setup prompt instructs Claude to generate:

1. `prisma/schema.prisma` — Models based on user's description
2. `packages/types/src/index.ts` — Shared TypeScript types
3. `apps/api/src/modules/{module}/*.ts` — Routes, schemas, services per module
4. `openspec/specs/{module}/*.md` — OpenSpec documentation

### Refine Phase Prompt

The Refine prompt instructs Claude to:

1. Read existing project structure
2. Understand the requested change
3. Only modify affected files (surgical approach)
4. Return diff-style changes

## File Structure

```
apps/api/src/lib/
└── anthropic.ts        # NEW — Claude SDK client singleton

packages/generator/src/prompts/
├── index.ts            # NEW — exports
├── setup.ts            # NEW — setup phase prompt
└── refine.ts           # NEW — refine phase prompt
```

## Dependencies

| Package | Purpose | Status |
|---------|---------|--------|
| `@anthropic-ai/sdk` | Anthropic Claude API | New — needs install |
| `dotenv` | Environment variables | Already installed |

## Risks / Trade-offs

### Risk: API Cost

**Risk:** Each generation request sends full context, increasing token usage.

**Mitigation:** MVP scope allows this. Post-MVP can implement context compression or caching.

### Trade-off: No Streaming

**Decision:** MVP returns complete response (no streaming).

**Rationale:** Simpler implementation. Streaming can be added in Web App spec.

### Trade-off: Prompt Engineering

**Decision:** Start with basic prompts, optimize after MVP based on output quality.

**Rationale:** Avoid over-engineering prompts before seeing real user inputs.

## Open Questions

None — design is straightforward for MVP scope.
