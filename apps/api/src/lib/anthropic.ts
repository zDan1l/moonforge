import Anthrophic from "@anthropic-ai/sdk";

// ============================================================================
// Singleton Client
// ============================================================================

/**
 * Anthropic Claude API client singleton
 *
 * Uses environment variable ANTHROPIC_API_KEY for authentication.
 * Model: claude-sonnet-4-7-20250514 (balanced capability/cost)
 */
const anthropic = new Anthrophic();

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

export interface ClaudeResponse {
	content: string;
	usage: {
		inputTokens: number;
		outputTokens: number;
	};
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Send a simple message to Claude and get a response
 */
export async function sendMessage(
	options: ClaudeRequestOptions,
): Promise<ClaudeResponse> {
	const {
		model = "claude-sonnet-4-7-20250514",
		messages,
		maxTokens = 16384, // Increased to handle larger monorepo structures
		temperature = 0.7,
		system,
	} = options;

	const requestOptions: Anthrophic.MessageCreateParams = {
		model,
		max_tokens: maxTokens,
		messages: messages.map((m) => ({
			role: m.role,
			content: m.content,
		})),
		...(system && { system }),
		temperature,
	};

	console.log("[Anthropic] Sending request with maxTokens:", maxTokens);
	console.log(
		"[Anthropic] User prompt length:",
		messages[0]?.content?.length ?? 0,
	);

	const response = await anthropic.messages.create(requestOptions);

	const textBlock =
		response.content.find((block) => block.type === "text")?.type === "text"
			? response.content.find((block) => block.type === "text")
			: undefined;

	const content = textBlock?.text ?? "";

	// Log token usage - check if response was truncated
	console.log("[Anthropic] Input tokens:", response.usage.input_tokens);
	console.log("[Anthropic] Output tokens:", response.usage.output_tokens);
	console.log("[Anthropic] Max tokens:", maxTokens);

	// Warn if output is close to max tokens (potential truncation)
	if (response.usage.output_tokens >= maxTokens * 0.95) {
		console.warn(
			`[Anthropic] WARNING: Output tokens (${response.usage.output_tokens}) is near maxTokens (${maxTokens}). Response may be truncated!`,
		);
	}

	console.log("[Anthropic] Response content length:", content.length);

	return {
		content,
		usage: {
			inputTokens: response.usage.input_tokens,
			outputTokens: response.usage.output_tokens,
		},
	};
}

/**
 * Extract JSON from Claude response text
 * Handles both ```json``` code blocks and plain JSON
 */
export function extractJson(text: string): unknown {
	const jsonMatch =
		text.match(/```json\n([\s\S]*?)\n```/) || text.match(/({[\s\S]*})/);

	if (!jsonMatch) {
		throw new Error("No JSON found in Claude response");
	}

	const jsonStr = jsonMatch[1] || jsonMatch[0];
	return JSON.parse(jsonStr);
}
