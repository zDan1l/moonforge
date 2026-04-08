# Claude Client

**Status:** Planned
**Type:** Infrastructure
**Module:** ai-integration

---

## Purpose

Provide a typed, singleton Claude API client for MoonForge's AI customization features.

**PRD Reference:** Section 2.2 — AI Customization using Anthropic Claude API.

---

## File

`apps/api/src/lib/anthropic.ts`

---

## Implementation

```typescript
import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic Claude API client singleton
 *
 * Uses environment variable ANTHROPIC_API_KEY for authentication.
 * Model: claude-sonnet-4-7-20250514 (balanced capability/cost)
 */
const anthropic = new Anthropic();

export default anthropic;

// ============================================================================
// Types
// ============================================================================

export type ClaudeModel = "claude-sonnet-4-7-20250514";

export interface ClaudeMessage {
	role: "user" | "assistant";
	content: string;
}

export interface ClaudeRequestOptions {
	model?: ClaudeModel;
	messages: ClaudeMessage[];
	maxTokens?: number;
	temperature?: number;
	system?: string;
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Send a simple message to Claude and get a response
 */
export async function sendMessage(options: ClaudeRequestOptions) {
	const {
		model = "claude-sonnet-4-7-20250514",
		messages,
		maxTokens = 4096,
		temperature = 0.7,
		system,
	} = options;

	const requestOptions: Anthropic.MessageCreateParams = {
		model,
		max_tokens: maxTokens,
		messages: messages.map((m) => ({
			role: m.role,
			content: m.content,
		})),
		...(system && { system }),
		temperature,
	};

	const response = await anthropic.messages.create(requestOptions);

	return {
		content: response.content[0].type === "text" ? response.content[0].text : "",
		usage: {
			inputTokens: response.usage.input_tokens,
			outputTokens: response.usage.output_tokens,
		},
	};
}
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key |

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing API key | Throw error on startup |
| API error | Propagate as `AppError` with details |
| Rate limit | Return 429 to client with retry info |

---

## Future Enhancements

- Streaming responses via `messages.stream`
- Token usage tracking per user/project
- Request caching for repeated contexts
