import { type ClaudeOutput, ClaudeOutputSchema } from "./schema.js";

/**
 * Extract JSON from Claude response text
 * Handles both ```json``` code blocks and plain JSON
 */
export function extractJson(text: string): unknown {
	// Try code block first
	const codeBlockMatch = text.match(/```json\n([\s\S]*?)\n```/);
	if (codeBlockMatch) {
		return JSON.parse(codeBlockMatch[1]);
	}

	// Try plain JSON (find first { and last })
	const plainMatch = text.match(/({[\s\S]*})/);
	if (plainMatch) {
		return JSON.parse(plainMatch[0]);
	}

	throw new Error("No valid JSON found in Claude response");
}

/**
 * Parse and validate Claude response
 */
export function parseClaudeResponse(text: string): ClaudeOutput {
	const parsed = extractJson(text);
	return ClaudeOutputSchema.parse(parsed);
}

/**
 * Extract content from Claude message response
 * (for use with Anthropic SDK)
 */
export function extractContent(response: {
	content: Array<{ type: string; text?: string }>;
}): string {
	const textBlock = response.content.find(
		(block) => block.type === "text" && block.text,
	);
	if (!textBlock?.text) {
		throw new Error("No text content found in Claude response");
	}
	return textBlock.text;
}
