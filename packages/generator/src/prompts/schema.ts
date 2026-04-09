import { z } from "zod";

/**
 * Response schema for Claude output
 */
export const ClaudeOutputSchema = z.object({
	files: z.array(
		z.object({
			path: z.string().describe("File path relative to project root"),
			content: z.string().describe("Full file content"),
			source: z
				.enum(["template", "ai_generated", "modified"])
				.describe("Where the file came from"),
		}),
	),
	summary: z.string().describe("Human-readable summary of changes"),
});

export type ClaudeOutput = z.infer<typeof ClaudeOutputSchema>;

/**
 * File generated/modified by Claude
 */
export interface GeneratedFile {
	path: string;
	content: string;
	source: "template" | "ai_generated" | "modified";
}

/**
 * Result from Claude generation
 */
export interface GenerationResult {
	files: GeneratedFile[];
	summary: string;
}

/**
 * Options for Setup phase prompt
 */
export interface SetupPromptOptions {
	userDescription: string;
	projectName: string;
	additionalContext?: string;
}

/**
 * Options for Refine phase prompt
 */
export interface RefinePromptOptions {
	userRequest: string;
	existingFiles: Array<{
		path: string;
		content: string;
	}>;
	projectContext?: string;
}
