## Why

MoonForge membutuhkan kemampuan AI untuk generate monorepo. Saat ini Generator Core punya template storage dan merger logic tapi belum ada cara untuk berkomunikasi dengan Anthropic Claude API. AI Integration adalah fondasi untuk:
- **Chat Module** - Chatbot butuh AI responses
- **Generation Flow** - Generate monorepo dari deskripsi user
- **Projects Module** - Butuh AI content generator
- **Refinement Flow** - Surgical file updates via AI

## What Changes

- **Install Anthropic SDK** - `@anthropic-ai/sdk` dependency
- **Create Claude client** - Shared package untuk API calls
- **Environment setup** - `ANTHROPIC_API_KEY` configuration
- **Prompt templates** - Reusable prompts untuk generate dan refine
- **Generate API client** - Wrapper untuk Claude API calls
- **Error handling** - Claude API error handling & retry logic
- **Rate limiting wrapper** - Basic rate limiting untuk API calls

## Capabilities

### New Capabilities

- `claude-sdk-client`: Anthropic Claude SDK client setup dengan proper configuration
- `generate-prompt-templates`: Prompt templates untuk generate phase (initial monorepo generation)
- `refine-prompt-templates`: Prompt templates untuk refine phase (surgical file updates)
- `api-rate-limiting`: Basic rate limiting untuk Claude API calls
- `error-handling`: Claude API error handling dengan exponential backoff

### Modified Capabilities

None - ini adalah feature baru.

## Impact

**Affected Code:**
- `packages/generator/src/ai-generator.ts` - Replace mock dengan real Claude SDK calls
- `apps/api/src/lib/anthropic.ts` - New file for Claude client wrapper
- `apps/api/.env.example` - Add ANTHROPIC_API_KEY
- `packages/generator/package.json` - Add @anthropic-ai/sdk dependency

**New Structure:**
```
apps/api/src/lib/
├── prisma.ts       # Already exists
└── anthropic.ts    # NEW: Claude SDK client wrapper

packages/generator/src/
├── prompts/
│   ├── generate.ts      # Generate phase prompts
│   └── refine.ts        # Refine phase prompts
├── ai/
│   ├── client.ts        # Claude SDK client configuration
│   ├── generator.ts     # Generate functions
│   └── errors.ts        # Custom error classes
└── ai-generator.ts   # Update: use real Claude SDK
```

**Dependencies:**
- `@anthropic-ai/sdk` - For Claude API calls
- Environment variable: `ANTHROPIC_API_KEY`

**API Implications:**
- Chat Module akan menggunakan `anthropic.ts` untuk chat responses
- Generator Core akan menggunakan `generate()` functions untuk generate content
- Projects Module akan menggunakan AI content generator untuk membuat files
