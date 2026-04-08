## 1. Claude Client Setup

- [ ] 1.1 Install `@anthropic-ai/sdk` package
- [ ] 1.2 Create `apps/api/src/lib/anthropic.ts` with singleton pattern
- [ ] 1.3 Add `ANTHROPIC_API_KEY` to `.env.example`
- [ ] 1.4 Test client initialization with mock API key

## 2. Prompt Templates

- [ ] 2.1 Create `packages/generator/src/prompts/index.ts`
- [ ] 2.2 Create `packages/generator/src/prompts/setup.ts` with setup phase prompt
- [ ] 2.3 Create `packages/generator/src/prompts/refine.ts` with refine phase prompt
- [ ] 2.4 Define response schema for Claude output (JSON structure)

## 3. Testing

- [ ] 3.1 Test Claude client can make API calls
- [ ] 3.2 Test setup prompt produces valid JSON response
- [ ] 3.3 Test refine prompt understands existing project context
- [ ] 3.4 Verify generated code follows PRD conventions

## Out of Scope (Separate Specs)

- Streaming responses — deferred to Web App spec
- Generation Flow API — deferred to generation-flow spec
- Prompt optimization — deferred post-MVP
