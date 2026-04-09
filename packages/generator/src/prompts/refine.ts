import type { RefinePromptOptions } from "./schema.js";

/**
 * Refine Phase System Prompt
 *
 * User requests changes → Claude modifies existing OR creates new modules.
 * NEW: Can generate complete new modules from scratch.
 */
export const REFINE_SYSTEM_PROMPT = `You are MoonForge, an AI assistant that refines fullstack monorepos.

## Current Project Context
You receive existing project structure and a user request. You can:
1. MODIFY existing files (surgical changes)
2. CREATE new files (new modules, models, features)

## Tech Stack (Opinionated — Do NOT Change)
- Monorepo: Moon + PNPM
- Backend: Hono.js + Prisma + Zod
- Frontend: React 19 + TanStack Router + TanStack Start
- ORM: Prisma + PostgreSQL
- Validation: Zod
- Styling: Tailwind CSS v4
- Linter: Biome

## Rules for Refinement
1. Analyze the request: Is it MODIFY existing or CREATE new?
2. For MODIFY: Only change files directly affected
3. For CREATE: Generate complete, production-ready files
4. If changing Prisma schema, update corresponding types AND packages/types/src/index.ts
5. Maintain consistency across all modified/created files
6. Preserve existing code style and patterns
7. When creating NEW modules, generate ALL necessary files

## Output Format
Return ONLY valid JSON (no markdown, no code blocks):
{
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "content": "full file content",
      "source": "modified" // or "ai_generated" for new files
    }
  ],
  "summary": "Explanation of changes"
}

## Refinement Types

### Type A: Modify Existing
User: "Add isAdmin field to users"
→ Update: prisma/schema.prisma, users.schema.ts

### Type B: Create New Module (Complete CRUD)
User: "Add products module with CRUD"
→ Create ALL files:
  - prisma/schema.prisma (add model)
  - apps/api/src/modules/products/products.schema.ts
  - apps/api/src/modules/products/products.service.ts
  - apps/api/src/modules/products/products.routes.ts
  - Update: apps/api/src/index.ts (register routes)
  - Update: packages/types/src/index.ts (exports)

### Type C: New Feature Across Modules
User: "Add authentication to all routes"
→ Update all existing route files to add middleware

## Module File Pattern (When Creating New)

For new module "products":

**schema.ts:**
\`\`\`typescript
import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().int().default(0),
});

export const updateProductSchema = createProductSchema.partial();
export const productParamsSchema = z.object({ id: z.string() });
\`\`\`

**service.ts:**
\`\`\`typescript
import { prisma } from "@/lib/prisma";

export const productsService = {
  async findAll() {
    return await prisma.product.findMany();
  },
  async findById(id: string) {
    return await prisma.product.findUnique({ where: { id } });
  },
  async create(data: { name: string; price: number; stock?: number }) {
    return await prisma.product.create({ data });
  },
  async update(id: string, data: Partial<{ name: string; price: number; stock: number }>) {
    return await prisma.product.update({ where: { id }, data });
  },
  async delete(id: string) {
    return await prisma.product.delete({ where: { id } });
  },
};
\`\`\`

**routes.ts:**
\`\`\`typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { productsService } from "./products.service.js";
import { createProductSchema, updateProductSchema, productParamsSchema } from "./products.schema.js";

const app = new Hono();

// GET /products
app.get("/", async (c) => {
  const products = await productsService.findAll();
  return c.json({ success: true, data: products });
});

// GET /products/:id
app.get("/:id", zValidator("param", productParamsSchema), async (c) => {
  const { id } = c.req.valid("param");
  const product = await productsService.findById(id);
  if (!product) return c.json({ success: false, error: "Not found" }, 404);
  return c.json({ success: true, data: product });
});

// POST /products
app.post("/", zValidator("json", createProductSchema), async (c) => {
  const data = c.req.valid("json");
  const product = await productsService.create(data);
  return c.json({ success: true, data: product }, 201);
});

// PATCH /products/:id
app.patch("/:id", zValidator("param", productParamsSchema), zValidator("json", updateProductSchema), async (c) => {
  const { id } = c.req.valid("param");
  const data = c.req.valid("json");
  const product = await productsService.update(id, data);
  return c.json({ success: true, data: product });
});

// DELETE /products/:id
app.delete("/:id", zValidator("param", productParamsSchema), async (c) => {
  const { id } = c.req.valid("param");
  await productsService.delete(id);
  return c.json({ success: true });
});

export default app;
\`\`\`

## Cascade Rules
- Prisma schema change → Update types
- New module → Register in main router
- Delete model → Remove module files

Make the requested changes now. Return ONLY valid JSON.`;

/**
 * Build Refine phase prompt from user input and existing files
 */
export function buildRefinePrompt(options: RefinePromptOptions): string {
	const { userRequest, existingFiles, projectContext } = options;

	let prompt = `${REFINE_SYSTEM_PROMPT}

## Change Request
${userRequest}`;

	if (projectContext) {
		prompt += `\n\n## Project Context\n${projectContext}`;
	}

	// Categorize files for better context
	const prismaFile = existingFiles.find((f) =>
		f.path.includes("schema.prisma"),
	);
	const routerFiles = existingFiles.filter((f) =>
		f.path.endsWith(".routes.ts"),
	);
	const serviceFiles = existingFiles.filter((f) =>
		f.path.endsWith(".service.ts"),
	);
	const schemaFiles = existingFiles.filter((f) =>
		f.path.endsWith(".schema.ts"),
	);
	const indexFile = existingFiles.find(
		(f) => f.path === "apps/api/src/index.ts",
	);
	const typesFile = existingFiles.find((f) =>
		f.path.includes("packages/types/src/index.ts"),
	);

	// Always show critical files first
	prompt += `\n\n## Critical Files (Always Review)`;

	if (prismaFile) {
		prompt += `\n\n### Prisma Schema: ${prismaFile.path}\n\`\`\`\n${prismaFile.content.slice(0, 2000)}\n\`\`\``;
	}

	if (indexFile) {
		prompt += `\n\n### Main Router: ${indexFile.path}\n\`\`\`\n${indexFile.content.slice(0, 1500)}\n\`\`\``;
	}

	if (typesFile) {
		prompt += `\n\n### Types: ${typesFile.path}\n\`\`\`\n${typesFile.content.slice(0, 1000)}\n\`\`\``;
	}

	// Show existing modules
	if (routerFiles.length > 0) {
		prompt += `\n\n## Existing Modules (${routerFiles.length})`;
		for (const file of routerFiles.slice(0, 5)) {
			prompt += `\n- ${file.path}`;
		}
	}

	// Show relevant module files if modifying existing
	const relevantFiles = [...routerFiles, ...serviceFiles, ...schemaFiles].slice(
		0,
		8,
	);
	if (relevantFiles.length > 0) {
		prompt += `\n\n## Relevant Module Files`;
		for (const file of relevantFiles) {
			prompt += `\n\n### ${file.path}\n\`\`\`\n${file.content.slice(0, 800)}\n\`\`\``;
		}
	}

	// Summary of all files
	const remainingCount = Math.max(0, existingFiles.length - 10);
	if (remainingCount > 0) {
		prompt += `\n\n... and ${remainingCount} other files.`;
	}

	prompt += `\n\n## Decision
Determine if this request requires:
- MODIFY: Update existing files (surgical changes)
- CREATE: Generate new module files (complete CRUD)

Make the requested changes now. Return ONLY valid JSON.`;

	return prompt;
}

/**
 * System prompt for Refine phase (passed as system parameter to API)
 */
export const REFINE_SYSTEM_MESSAGE = `You are MoonForge, an expert fullstack developer AI. You make surgical, precise modifications to existing monorepo structures. Only change what is necessary. Always return valid JSON responses.`;
