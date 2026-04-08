/**
 * Mock AI Content Generator
 * Generates realistic mock content for MVP testing
 * This will be replaced with real Claude AI integration later
 */

import type { GeneratedFile } from "./index.js";

/**
 * Parse description to extract modules
 */
function extractModulesFromDescription(description: string): string[] {
	const commonModules = [
		"users",
		"auth",
		"products",
		"orders",
		"payments",
		"subscriptions",
		"dashboard",
		"analytics",
		"reviews",
		"categories",
		"tags",
		"comments",
		"notifications",
		"settings",
		"profile",
	];

	const words = description.toLowerCase().split(/\s+/);
	const found: string[] = [];

	for (const module of commonModules) {
		if (words.some((w) => w.includes(module))) {
			found.push(module);
		}
	}

	// Default to users if no modules found
	return found.length > 0 ? found : ["users"];
}

/**
 * Generate mock Prisma schema based on description
 */
export function generateMockPrismaSchema(description: string): GeneratedFile[] {
	const modules = extractModulesFromDescription(description);
	const files: GeneratedFile[] = [];

	// Build models based on modules
	const models: string[] = [];

	for (const module of modules) {
		const modelName = module.charAt(0).toUpperCase() + module.slice(1);
		models.push(`/// ${modelName} model
model ${modelName} {
  id        String   @id @default(uuid()) @db.Uuid
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  ${module === "users" ? `email     String   @unique
  name      String?` : ""}
  ${module === "products" ? `name        String
  price      Decimal @db.Decimal(10, 2)
  stock      Int     @default(0)
  categoryId String? @map("category_id") @db.Uuid
  category   Category? @relation(fields: [categoryId], references: [id])` : ""}
  ${module === "orders" ? `userId    String  @map("user_id") @db.Uuid
  status    String  @default("pending")
  total     Decimal @db.Decimal(10, 2)
  user      User    @relation(fields: [userId], references: [id])` : ""}
  ${module === "categories" ? `name      String
  slug      String  @unique
  products  Product[]` : ""}
  ${module === "subscriptions" ? `userId    String   @map("user_id") @db.Uuid
  plan      String
  status    String  @default("active")
  expiresAt DateTime @map("expires_at")
  user      User    @relation(fields: [userId], references: [id])` : ""}

  @@map("${module}")
}`);
	}

	const schema = `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

// ============================================================================
// Models
// ============================================================================

${models.join("\n\n")}
`;

	files.push({
		path: "prisma/schema.prisma",
		content: schema,
		source: "ai_generated",
		isBinary: false,
	});

	return files;
}

/**
 * Generate mock module files (routes, schema, service)
 */
export function generateMockModules(modules: string[]): GeneratedFile[] {
	const files: GeneratedFile[] = [];

	for (const module of modules) {
		const modelName = module.charAt(0).toUpperCase() + module.slice(1);

		// Routes file
		files.push({
			path: `src/modules/${module}/${module}.routes.ts`,
			content: `import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { success } from "../../lib/response.js";
import { ${modelName}Schema } from "./${module}.schema.js";
import * as ${modelName}Service from "./${module}.service.js";

// ============================================================================
// Routes
// ============================================================================

const ${module} = new Hono();

// GET /${module} — List all ${module}
${module}.get("/", zValidator("query", ${modelName}Schema.listQuery), async (c) => {
	const query = c.req.valid("query");
	const data = await ${modelName}Service.list${modelName}(query);
	return c.json(success(data));
});

// GET /${module}/:id — Get single ${module}
${module}.get("/:id", zValidator("param", ${modelName}Schema.byId), async (c) => {
	const { id } = c.req.valid("param");
	const data = await ${modelName}Service.get${modelName}(id);
	return c.json(success(data));
});

// POST /${module} — Create ${module}
${module}.post("/", zValidator("json", ${modelName}Schema.create), async (c) => {
	const data = c.req.valid("json");
	const result = await ${modelName}Service.create${modelName}(data);
	return c.json(success(result), 201);
});

// PATCH /${module}/:id — Update ${module}
${module}.patch("/:id", zValidator("param", ${modelName}Schema.byId), zValidator("json", ${modelName}Schema.update), async (c) => {
	const { id } = c.req.valid("param");
	const data = c.req.valid("json");
	const result = await ${modelName}Service.update${modelName}(id, data);
	return c.json(success(result));
});

// DELETE /${module}/:id — Delete ${module}
${module}.delete("/:id", zValidator("param", ${modelName}Schema.byId), async (c) => {
	const { id } = c.req.valid("param");
	const result = await ${modelName}Service.delete${modelName}(id);
	return c.json(success(result));
});

export default ${module};
`,
			source: "ai_generated",
			isBinary: false,
		});

		// Schema file
		files.push({
			path: `src/modules/${module}/${module}.schema.ts`,
			content: `import { z } from "zod";

// ============================================================================
// Schemas
// ============================================================================

export const ${modelName}Schema = {
	byId: z.object({
		id: z.string().uuid("Invalid ID format"),
	}),

	create: z.object({
		${module === "users" ? `email: z.string().email("Invalid email"),
		name: z.string().min(1).optional(),` : ""}
		${module === "products" ? `name: z.string().min(1),
		price: z.number().positive(),
		stock: z.number().int().min(0).optional(),
		categoryId: z.string().uuid().optional(),` : ""}
		${module === "orders" ? `userId: z.string().uuid(),
		total: z.number().positive(),
		status: z.string().optional(),` : ""}
		${module === "categories" ? `name: z.string().min(1),
		slug: z.string().min(1),` : ""}
		${module === "subscriptions" ? `userId: z.string().uuid(),
		plan: z.string().min(1),
		expiresAt: z.string().datetime(),` : ""}
	}),

	update: z.object({
		${module === "users" ? `email: z.string().email().optional(),
		name: z.string().min(1).optional(),` : ""}
		${module === "products" ? `name: z.string().min(1).optional(),
		price: z.number().positive().optional(),
		stock: z.number().int().min(0).optional(),
		categoryId: z.string().uuid().optional(),` : ""}
		${module === "orders" ? `status: z.string().optional(),` : ""}
	}),

	listQuery: z.object({
		${module === "users" ? `orderBy: z.enum(["createdAt", "email", "name"]).optional(),
		order: z.enum(["asc", "desc"]).optional(),` : ""}
		${module === "products" ? `categoryId: z.string().uuid().optional(),
		minPrice: z.number().optional(),
		maxPrice: z.number().optional(),` : ""}
		${module === "orders" ? `userId: z.string().uuid().optional(),
		status: z.string().optional(),` : ""}
	}),
};
`,
			source: "ai_generated",
			isBinary: false,
		});

		// Service file
		files.push({
			path: `src/modules/${module}/${module}.service.ts`,
			content: `import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../middleware/error-handler.js";

// ============================================================================
// Types
// ============================================================================

export type List${modelName}Query = z.infer<typeof ${modelName}Schema.listQuery>;
export type Create${modelName}Input = z.infer<typeof ${modelName}Schema.create>;
export type Update${modelName}Input = z.infer<typeof ${modelName}Schema.update>;

// ============================================================================
// Service Functions
// ============================================================================

/**
 * List all ${module} with optional filtering
 */
export async function list${modelName}(query: List${modelName}Query) {
	return prisma.${modelName}.findMany({
		where: {
			${module === "products" ? `categoryId: query.categoryId,
			price: {
				gte: query.minPrice,
				lte: query.maxPrice,
			},` : ""}
			${module === "orders" ? `userId: query.userId,
			status: query.status as string | undefined,` : ""}
		},
		orderBy: { createdAt: query.order || "desc" },
	});
}

/**
 * Get a single ${module} by ID
 */
export async function get${modelName}(id: string) {
	const data = await prisma.${modelName}.findUnique({ where: { id } });
	if (!data) throw new NotFoundError("${modelName}");
	return data;
}

/**
 * Create a new ${module}
 */
export async function create${modelName}(data: Create${modelName}Input) {
	return prisma.${modelName}.create({ data });
}

/**
 * Update a ${module}
 */
export async function update${modelName}(id: string, data: Update${modelName}Input) {
	const existing = await prisma.${modelName}.findUnique({ where: { id } });
	if (!existing) throw new NotFoundError("${modelName}");
	return prisma.${modelName}.update({ where: { id }, data });
}

/**
 * Delete a ${module}
 */
export async function delete${modelName}(id: string) {
	const existing = await prisma.${modelName}.findUnique({ where: { id } });
	if (!existing) throw new NotFoundError("${modelName}");
	await prisma.${modelName}.delete({ where: { id } });
	return { id, deleted: true };
}
`,
			source: "ai_generated",
			isBinary: false,
		});
	}

	return files;
}

/**
 * Generate mock types package content
 */
export function generateMockTypes(): GeneratedFile[] {
	return [
		{
			path: "src/index.ts",
			content: `/**
 * Shared Types Package
 * Re-exports types from Prisma and adds utility types
 */

// Re-export Prisma types
export type {
	// Prisma generated types will be available here
} from "../apps/api/src/generated/prisma/client.js";

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Make specific properties optional
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Make all properties required
 */
export type RequiredAll<T> = {
	[P in keyof T]-?: T[P];
};

/**
 * Extract element type from array
 */
export type ArrayElement<T> = T extends readonly (infer E)[] ? E : never;

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	meta: {
		timestamp: string;
		[key: string]: unknown;
	};
}

/**
 * Pagination params
 */
export interface PaginationParams {
	page: number;
	limit: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
	items: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
`,
			source: "ai_generated",
			isBinary: false,
		},
		{
			path: "package.json",
			content: JSON.stringify(
				{
					name: "types",
					version: "0.1.0",
					main: "./src/index.ts",
					types: "./src/index.ts",
					exports: {
						".": "./src/index.ts",
					},
				},
				null,
				2,
			),
			source: "ai_generated",
			isBinary: false,
		},
		{
			path: "tsconfig.json",
			content: JSON.stringify(
				{
					extends: "../../tsconfig.json",
				compilerOptions: {
						outDir: "./dist",
						rootDir: "./src",
					},
					include: ["src/**/*"],
				},
				null,
				2,
			),
			source: "ai_generated",
			isBinary: false,
		},
	];
}
