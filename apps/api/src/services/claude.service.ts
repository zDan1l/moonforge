import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export interface OpenSpec {
  projectName: string;
  modules: Array<{
    name: string;
    namePascal: string;
    nameSingular: string;
    description: string;
    prismaModelName: string;
    endpoints: string[];
  }>;
  prismaModels: Array<{
    name: string;
    tableName: string;
    fields: Array<{
      name: string;
      type: string;
      isOptional: boolean;
      isUnique: boolean;
      attributes: string[];
    }>;
    relations: Array<{
      fieldName: string;
      modelName: string;
      type: string;
      foreignKey?: string;
    }>;
  }>;
  frontendPages: Array<{
    path: string;
    description: string;
  }>;
}

const OPENSPEC_SYSTEM_PROMPT = `You are MoonForge's OpenSpec Analyzer. Your ONLY job is to analyze a project description and output a structured JSON specification.

RULES (non-negotiable):
- Output ONLY valid JSON. No markdown, no explanation, no preamble.
- projectName must be kebab-case
- Module names must be lowercase, kebab-case, plural
- Model names must be PascalCase, singular
- Always include a User model with: id, email, passwordHash, createdAt, updatedAt
- Maximum 6 modules
- Every module must have at least 4 endpoints: GET list, GET single, POST create, PUT update
- Every relation must have a corresponding foreign key field explicitly listed

OUTPUT SCHEMA:
{
  "projectName": string,
  "modules": Array<{
    "name": string,
    "namePascal": string,
    "nameSingular": string,
    "description": string,
    "prismaModelName": string,
    "endpoints": string[]
  }>,
  "prismaModels": Array<{
    "name": string,
    "tableName": string,
    "fields": Array<{
      "name": string,
      "type": "String"|"Int"|"Decimal"|"Boolean"|"DateTime"|"Json",
      "isOptional": boolean,
      "isUnique": boolean,
      "attributes": string[]
    }>,
    "relations": Array<{
      "fieldName": string,
      "modelName": string,
      "type": "one-to-many"|"many-to-one"|"many-to-many"|"one-to-one",
      "foreignKey": string
    }>
  }>,
  "frontendPages": Array<{
    "path": string,
    "description": string
  }>
}`;

export class ClaudeService {
  /**
   * Generate OpenSpec from project description
   */
  async generateOpenSpec(description: string): Promise<OpenSpec> {
    try {
      const message = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: OPENSPEC_SYSTEM_PROMPT,
        messages: [
          {
            role: "user",
            content: description,
          },
        ],
      });

      const content = message.content[0];
      if (content.type !== "text") {
        throw new Error("Unexpected response type from Claude");
      }

      // Parse JSON from response
      let jsonText = content.text.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith("```")) {
        const lines = jsonText.split("\n");
        lines.shift(); // Remove first line (```)
        if (lines[0]?.startsWith("json")) {
          lines.shift(); // Remove "json" line
        }
        lines.pop(); // Remove last line (```)
        jsonText = lines.join("\n");
      }

      const openspec = JSON.parse(jsonText) as OpenSpec;

      // Validate required fields
      if (!openspec.projectName || !openspec.modules || !openspec.prismaModels) {
        throw new Error("Invalid OpenSpec: missing required fields");
      }

      return openspec;
    } catch (error) {
      console.error("Claude API error:", error);
      throw new Error(
        `Failed to generate OpenSpec: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }
}

export const claudeService = new ClaudeService();
