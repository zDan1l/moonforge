# Prompt Templates

**Status:** Planned
**Type:** Feature
**Module:** ai-integration

---

## Purpose

Structured prompts for Claude to generate consistent, PRD-compliant monorepo structures. Two templates: Setup (full generation) and Refine (surgical modifications).

**PRD Reference:** Sections 2.2, 3.1, 3.2, 5.2.

---

## Files

| File | Purpose |
|------|---------|
| `packages/generator/src/prompts/index.ts` | Exports and type definitions |
| `packages/generator/src/prompts/setup.ts` | Setup phase prompt |
| `packages/generator/src/prompts/refine.ts` | Refine phase prompt |

---

## Output Schema

Both prompts expect Claude to return JSON with this structure:

```typescript
interface ClaudeGenerationOutput {
	files: Array<{
		path: string;        // e.g., "apps/api/prisma/schema.prisma"
		content: string;     // Full file content
		source: "template" | "ai_generated" | "modified";
	}>;
	summary: string;        // Human-readable summary of changes
}
```

---

## setup.ts

```typescript
/**
 * Setup Phase Prompt
 *
 * User describes their project requirements → Claude generates full monorepo structure.
 */

export const SETUP_SYSTEM_PROMPT = `You are MoonForge, an AI assistant that generates fullstack monorepo structures.

## Tech Stack (Opinionated — Do NOT Change)
- Monorepo: Moon + PNPM
- Backend: Hono.js + Prisma + Zod
- Frontend: React 19 + TanStack Router + TanStack Start
- ORM: Prisma + PostgreSQL
- Validation: Zod
- Styling: Tailwind CSS v4
- Linter: Biome
- Git Hooks: Husky

## Your Task
Generate a complete monorepo structure based on the user's description.

## Output Format
Return JSON with:
1. "files": Array of {path, content, source} for all AI-generated files
2. "summary": Brief explanation of what was generated

## Files to Generate
Based on user's description, generate:

1. prisma/schema.prisma
   - Models with fields matching user's requirements
   - Include enums for status fields
   - Add @@map() for table names

2. apps/api/src/modules/{module}/*.ts (per module)
   - {module}.routes.ts: Hono routes with zValidator
   - {module}.schema.ts: Zod validation schemas
   - {module}.service.ts: Prisma operations

3. packages/types/src/index.ts
   - Re-export Prisma types
   - Add utility types

## Conventions
- Use TypeScript 5.x
- Zod schemas for validation
- Prisma for database
- Biome for linting
- Follow existing patterns in context`;

export interface SetupPromptOptions {
	userDescription: string;     // User's natural language description
	projectName: string;         // Name of the project
	additionalContext?: string;  // Optional extra context
}

export function buildSetupPrompt(options: SetupPromptOptions): string {
	const { userDescription, projectName, additionalContext } = options;

	return `${SETUP_SYSTEM_PROMPT}

## User Request
Project Name: ${projectName}
Description: ${userDescription}
${additionalContext ? `\nAdditional Context:\n${additionalContext}` : ""}

Generate the complete monorepo structure now.`;
```

---

## refine.ts

```typescript
/**
 * Refine Phase Prompt
 *
 * User requests surgical changes → Claude modifies only affected files.
 */

export const REFINE_SYSTEM_PROMPT = `You are MoonForge, an AI assistant that makes surgical modifications to existing fullstack monorepos.

## Current Project Context
You will receive the existing project structure and a change request. Only modify the files that need to change.

## Tech Stack (Opinionated — Do NOT Change)
- Monorepo: Moon + PNPM
- Backend: Hono.js + Prisma + Zod
- Backend: Hono.js + Prisma + Zod
- Frontend: React 19 + TanStack Router + TanStack Start
- ORM: Prisma + PostgreSQL
- Validation: Zod
- Styling: Tailwind CSS v4
- Linter: Biome

## Rules for Refinement
1. ONLY modify files that are directly affected by the request
2. Do NOT regenerate entire files — make surgical changes
3. If changing Prisma schema, update corresponding types and routes
4. Maintain consistency across all modified files
5. Do NOT touch template files (marked [T])

## Output Format
Return JSON with:
1. "files": Array of {path, content, source} for modified files
   - Set source to "modified" for existing files
   - Set source to "ai_generated" for new files
2. "summary": Brief explanation of what changed and why

## Common Refinements
- Add new model → schema.prisma + new module files + types
- Add field to model → schema.prisma + types + affected modules
- Add new route → module routes file + schema
- Rename model → schema.prisma + all references in modules + types`;

export interface RefinePromptOptions {
	userRequest: string;           // User's change request
	existingFiles: Array<{          // Current project files
		path: string;
		content: string;
	}>;
	projectContext?: string;        // Optional context about project
}

export function buildRefinePrompt(options: RefinePromptOptions): string {
	const { userRequest, existingFiles, projectContext } = options;

	const filesContext = existingFiles
		.map((f) => `## File: ${f.path}\n\`\`\`\n${f.content}\n\`\`\``)
		.join("\n\n");

	return `${REFINE_SYSTEM_PROMPT}

## Change Request
${userRequest}

${projectContext ? `## Project Context\n${projectContext}\n` : ""}

## Existing Project Files
${filesContext}

Make the requested changes now. Return ONLY the JSON output.`;
```

---

## Response Parsing

```typescript
import { z } from "zod";

// Response schema for Claude output
export const ClaudeOutputSchema = z.object({
	files: z.array(
		z.object({
			path: z.string(),
			content: z.string(),
			source: z.enum(["template", "ai_generated", "modified"]),
		}),
	),
	summary: z.string(),
});

export type ClaudeOutput = z.infer<typeof ClaudeOutputSchema>;
```

---

## Usage Example

```typescript
import { anthropic } from "@/lib/anthropic";
import { buildSetupPrompt, ClaudeOutputSchema } from "./prompts";

async function generateProject(description: string, name: string) {
	const prompt = buildSetupPrompt({
		userDescription: description,
		projectName: name,
	});

	const response = await anthropic.messages.create({
		model: "claude-sonnet-4-7-20250514",
		max_tokens: 4096,
		messages: [{ role: "user", content: prompt }],
	});

	const text = response.content[0].type === "text"
		? response.content[0].text
		: "";

	// Parse JSON from response
	const jsonMatch = text.match(/```json\n([\s\S]*?)\n```|({[\s\S]*})/);
	if (!jsonMatch) throw new Error("No JSON found in response");

	const parsed = JSON.parse(jsonMatch[1] || jsonMatch[2]);
	return ClaudeOutputSchema.parse(parsed);
}
```
