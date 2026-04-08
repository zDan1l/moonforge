## Why

MoonForge uses Claude AI to generate custom Prisma schemas, module routes, services, and shared types based on user descriptions. This spec establishes the AI integration layer: Claude SDK client singleton and prompt templates for both Setup and Refine phases.

**PRD Reference:** Sections 2.2 (Template Base + AI Customization), 3.1 (Fase 1 — Setup), 3.2 (Fase 2 — Refine), 5.2 (File Architecture — AI-generated files).

## Capabilities

### New Capabilities

- `claude-client`: Singleton client for Anthropic Claude API with streaming support
- `prompt-templates`: Structured prompts for Setup phase (initial generation) and Refine phase (surgical modifications)

### Modified Capabilities

- `projects-module`: Projects module is ready; Generation Flow will use it

## Impact

**Affected Code:**

- `apps/api/src/lib/anthropic.ts` — New file; Claude API client singleton
- `packages/generator/src/prompts/` — New directory; prompt templates
- `packages/generator/src/prompts/setup.ts` — Setup phase prompt
- `packages/generator/src/prompts/refine.ts` — Refine phase prompt

**Dependencies:**

- `@anthropic-ai/sdk` package (Anthropic official SDK)
- `ANTHROPIC_API_KEY` environment variable

**Out of Scope (separate specs):**

- Generation Flow API (deferred to generation-flow spec)
- Streaming response handling in UI (deferred to Web App spec)
- Prompt optimization after MVP (deferred post-MVP)
