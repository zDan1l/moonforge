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
		maxTokens = 4096,
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

	const response = await anthropic.messages.create(requestOptions);

	const textBlock =
		response.content.find((block) => block.type === "text")?.type === "text"
			? response.content.find((block) => block.type === "text")
			: undefined;

	return {
		content: textBlock?.text ?? "",
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
