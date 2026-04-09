/**
 * Generate Routes
 *
 * API endpoints for triggering monorepo generation.
 * POST /api/generate/setup - Generate initial monorepo
 * POST /api/generate/refine - Apply surgical modifications
 */

import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { success } from "../../lib/response.js";
import {
	generateRefine,
	generateScan,
	generateSetup,
} from "./generate.service.js";

const generate = new Hono();

// ============================================================================
// Validation Schemas
// ============================================================================

const setupSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
	description: z.string().min(1, "Description is required"),
	additionalContext: z.string().optional(),
});

const scanSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
});

const refineSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
	request: z.string().min(1, "Request is required"),
});

// ============================================================================
// Routes
// ============================================================================

/**
 * POST /api/generate/setup
 *
 * Generate initial monorepo structure from template (NO AI).
 * NEW FLOW: Template → Scan → Refine
 *
 * @example
 * Request:
 * {
 *   "projectId": "123e4567-e89b-12d3-a456-426614174000",
 *   "description": "SaaS B2B with users, subscriptions, and dashboard"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "projectId": "...",
 *     "versionId": "...",
 *     "versionNumber": 1,
 *     "filesGenerated": 25,
 *     "summary": "Project template initialized..."
 *   },
 *   "meta": { "timestamp": "..." }
 * }
 */
generate.post("/setup", zValidator("json", setupSchema), async (c) => {
	const { projectId, description, additionalContext } = c.req.valid("json");

	const result = await generateSetup({
		projectId,
		description,
		additionalContext,
	});

	return c.json(success(result), 200);
});

/**
 * POST /api/generate/scan
 *
 * AI scans and analyzes the project structure.
 * Call this after setup to prepare for refine operations.
 *
 * @example
 * Request:
 * {
 *   "projectId": "123e4567-e89b-12d3-a456-426614174000"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "projectId": "...",
 *     "versionId": "...",
 *     "analysis": "Project has template structure ready...",
 *     "models": [],
 *     "modules": [],
 *     "keyFiles": ["prisma/schema.prisma", "apps/api/src/index.ts"]
 *   },
 *   "meta": { "timestamp": "..." }
 * }
 */
generate.post("/scan", zValidator("json", scanSchema), async (c) => {
	const { projectId } = c.req.valid("json");

	const result = await generateScan({
		projectId,
	});

	return c.json(success(result), 200);
});

/**
 * POST /api/generate/refine
 *
 * Apply modifications or create new modules.
 * ENHANCED: Can now generate complete new modules with CRUD.
 *
 * @example
 * Modify existing:
 * {
 *   "projectId": "123e4567-e89b-12d3-a456-426614174000",
 *   "request": "Add isAdmin field to users model"
 * }
 *
 * @example
 * Create new module:
 * {
 *   "projectId": "123e4567-e89b-12d3-a456-426614174000",
 *   "request": "Create products module with name, price, stock fields and full CRUD"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "projectId": "...",
 *     "versionId": "...",
 *     "versionNumber": 2,
 *     "filesChanged": 5,
 *     "summary": "Created products module with CRUD operations"
 *   },
 *   "meta": { "timestamp": "..." }
 * }
 */
generate.post("/refine", zValidator("json", refineSchema), async (c) => {
	const { projectId, request } = c.req.valid("json");

	const result = await generateRefine({
		projectId,
		request,
	});

	return c.json(success(result), 200);
});

export default generate;
