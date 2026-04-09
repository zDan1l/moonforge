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
import { generateRefine, generateSetup } from "./generate.service.js";

const generate = new Hono();

// ============================================================================
// Validation Schemas
// ============================================================================

const setupSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
	description: z.string().min(1, "Description is required"),
	additionalContext: z.string().optional(),
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
 * Generate initial monorepo structure from user description.
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
 *     "filesGenerated": 15,
 *     "summary": "Generated SaaS B2B structure..."
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
 * POST /api/generate/refine
 *
 * Apply surgical modifications to existing project.
 *
 * @example
 * Request:
 * {
 *   "projectId": "123e4567-e89b-12d3-a456-426614174000",
 *   "request": "Add products module with name, price, and stock fields"
 * }
 *
 * Response (200):
 * {
 *   "success": true,
 *   "data": {
 *     "projectId": "...",
 *     "versionId": "...",
 *     "versionNumber": 2,
 *     "filesChanged": 4,
 *     "summary": "Added products module with CRUD operations"
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
