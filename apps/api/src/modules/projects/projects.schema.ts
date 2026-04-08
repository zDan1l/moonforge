import { z } from "zod";

// ============================================================================
// Schemas
// ============================================================================

/**
 * Schema for creating a new project
 */
export const createProjectSchema = z.object({
	name: z.string().min(1, "Name is required").max(255, "Name too long"),
	description: z.string().min(1, "Description is required"),
});

/**
 * Schema for updating an existing project
 */
export const updateProjectSchema = z.object({
	name: z.string().min(1).max(255).optional(),
	description: z.string().min(1).optional(),
	status: z.enum(["draft", "generated", "refined"]).optional(),
});

/**
 * Schema for list query parameters
 */
export const listProjectsQuerySchema = z.object({
	status: z.enum(["draft", "generated", "refined"]).optional(),
	orderBy: z.enum(["created_at", "updated_at", "name"]).optional(),
	order: z.enum(["asc", "desc"]).optional(),
});

/**
 * Schema for project ID route parameter
 */
export const projectIdSchema = z.object({
	id: z.string().uuid("Invalid project ID format"),
});

// ============================================================================
// Types (inferred from schemas)
// ============================================================================

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;
