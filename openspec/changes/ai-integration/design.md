## Context

**Current State:**
- Database schema siap dengan 5 tabel
- API Core selesai dengan middleware dan error handling
- Generator Core punya template storage tapi mock AI generator
- `packages/generator/` package belum ada package.json
- `@anthropic-ai/sdk` belum terinstall

**Constraints:**
- Shared package approach (bukan app standalone)
- Akan di-integrasi dengan Generator Core, Chat Module, Projects Module
- Anthropic API key via environment variable
- Perlu rate limiting untuk mengontrol API usage
- TypeScript 5.x dengan proper type safety

## Goals / Non-Goals

**Goals:**
- Setup Anthropic SDK client di shared package
- Create reusable prompt templates untuk generate dan refine
- Implement error handling dengan retry logic
- Add basic rate limiting wrapper
- Mock AI generator di Generator Core → real Claude SDK

**Non-Goals:**
- Full chat UI (itu Chat Module spec)
- Complex conversation memory (Chat Module)
- Multi-turn conversation streaming (Chat Module)
- Prompt engineering otomatisasi (manual untuk MVP)

## Decisions

### 1. Claude SDK Client Setup

**Decision:** Use `@anthropic-ai/sdk` di shared package `packages/generator/src/ai/`.

**Rationale:**
- Shared karena dipakai oleh multiple modules (Generator, Chat, Projects)
- Type definitions dari SDK penting untuk type safety
- Centralized configuration dan error handling

**Location:**
```
packages/generator/src/ai/
├── client.ts           # AnthropicClient configuration
├── generator.ts       # Generate functions
└── errors.ts          # Custom error classes
```

### 2. API Key Configuration

**Decision:** Use `ANTHROPIC_API_KEY` environment variable.

**Rationale:**
- Standard practice for API keys
- Easy to configure per environment
- Supports multiple keys for dev/staging/production

**Configuration:**
```typescript
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
```

### 3. Prompt Templates Structure

**Decision:** Separate prompt templates untuk generate dan refine phase.

**Rationale:**
- Generate phase: Buat monorepo baru dari deskripsi
- Refine phase: Modifikasi file yang spesifik

**Structure:**
```
packages/generator/src/prompts/
├── generate.ts          # Generate phase prompts
└── refine.ts            # Refine phase prompts
```

### 4. Rate Limiting Strategy

**Decision:** Request-based rate limiting dengan exponential backoff.

**Rationale:**
- Anthropic API has rate limits (60 RPM for claude-3.5-sonnet)
- Simple counter-based tracking di memory
- Exponential backoff untuk transient errors
- No external dependency needed

**Implementation:**
```typescript
class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  async checkLimit(key: string): Promise<boolean>
  async recordRequest(key: string): Promise<void>
}
```

### 5. Error Handling & Retry

**Decision:** Custom error classes dengan exponential backoff.

**Rationale:**
- Distinguish error types (API error, rate limit, validation)
- Retry dengan exponential backoff untuk transient errors
- No retry for validation errors

**Error Types:**
- `ClaudeAPIError` - Base class
- `RateLimitError` - Rate limit exceeded
- `ValidationError` - Invalid input
- `TimeoutError` - Request timeout

### 6. Mock AI Replacement

**Decision:** Generator Core mock generator akan diganti dengan real SDK calls.

**Approach:**
- Buat interface di Generator Core yang dipakai oleh AI Integration
```typescript
// In Generator Core (interface)
async function generatePrismaSchema(description: string): Promise<GeneratedFile[]>

// In AI Integration (implementation)
async function generatePrismaSchema(description: string): Promise<GeneratedFile[]> {
  // Call Claude API and parse response
}
```

### 7. Package Dependencies

**Required Dependencies:**
| Package | Purpose | Version |
|---------|---------|
| `@anthropic-ai/sdk` | Claude SDK | Latest |
| `@anthropic-ai/sdk` | TypeScript types | Latest |

**Installation:**
```bash
pnpm add @anthropic-ai/sdk
```

## API Design

### Claude SDK Client Configuration

```typescript
// packages/generator/src/ai/client.ts
import Anthropic from "@anthropic-ai/sdk";

export const createClaudeClient = () => {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }

  return new Anthropic({
    apiKey,
    baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
    maxRetries: 3,
    timeout: 60000, // 60 seconds
  });
};
```

### Generate API Wrapper

```typescript
// packages/generator/src/ai/generator.ts
export async function generatePrismaSchema(description: string): Promise<GeneratedFile[]> {
  const prompt = `TODO: Load from prompts/generate.ts`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      { role: "user", content: description }
    ]
  });

  // Parse response and generate files
  return parseResponseAndGenerateFiles(response);
}
```

## File Organization

```
packages/generator/src/
├── ai/
│   ├── client.ts              # Claude SDK client configuration
│   ├── generator.ts          # Generate functions using Claude
│   ├── errors.ts             # Custom error classes
│   └── prompts/
│       ├── generate.ts        # Generate phase prompts
│       └── refine.ts          # Refine phase prompts
├── template-loader.ts        # Load template files
├── builder.ts                 # Build file structure
├── merger.ts                  # Merge template + AI content
├── zipper.ts                  # Create .zip
└── index.ts                   # Export all public functions
```

## Risks / Trade-offs

### Risk: API Key Exposure

**Risk:** API key di codebase bisa ter-expose.

**Mitigation:**
- Add `.env` to `.gitignore`
- Document clearly di README bahwa API key harus ada di environment
- Gunakan service account dengan minimal permissions
- Consider GitHub Secrets atau similar for production

### Risk: Rate Limiting

**Risk:** Anthropic API has rate limits (60 RPM for claude-3.5-sonnet).

**Mitigation:**
- Simple request counter-based rate limiting
- Log semua API calls
- Return proper error when limit exceeded
- Consider Redis-based counter for production

### Risk: Large Context Windows

**Risk:** Generate large schemas may exceed context window.

**Mitigation:**
- Limit context token usage (~4000 tokens for Claude)
- Chunk large generation into multiple requests
- Fallback ke smaller models jika perlu

### Trade-off: Streaming vs Single Request

**Decision:** Single request untuk MVP.

**Rationale:**
- Simpler implementation
- Sufficient for MVP scope
- Streaming bisa ditambahkan post-MVP

## Dependencies

| Package | Version | Required |
|---------|----------|
| `@anthropic-ai/sdk` | ^4.0.0 | Yes |
| TypeScript | ^5.0.0 | Already in project |
| Node.js built-in fs | N/A | Yes |

## Migration Plan

1. **Development:**
   - Install dependencies: `pnpm add @anthropic-ai/sdk`
   - Create Claude client wrapper
   - Implement mock replacement function

2. **Testing:**
   - Test with Claude API key
   - Test rate limiting logic
   - Test error handling

3. **Deployment:**
   - Set ANTHROPIC_API_KEY in production environment
   - Configure retry limits dan timeouts

## Open Questions

1. **Model selection:** Use `claude-3-5-sonnet-20241022` or `claude-3-opus-20240229`?
   → **Default:** `claude-3-5-sonnet-20241022` (recommended for code gen)

2. **Fallback strategy:** What to do if AI API fails?
   → **Default:** Return error, suggest user describe project differently

3. **Prompt format:** How structured prompts should be?
   → **Default:** Structured JSON (schema, models, etc.) for easier parsing

4. **Cost estimation:** Budget consideration for API usage during development?
   → **Default:** No budget limits for hackathon dev
