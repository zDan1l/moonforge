/**
 * Files Module - Zod Validation Schemas
 *
 * Validation schemas for file retrieval and download operations.
 */

import { z } from "zod";

// ============================================================================
// Request Schemas
// ============================================================================

/**
 * Schema for listing files query parameters
 */
export const listFilesQuerySchema = z.object({
	versionId: z.string().uuid("Invalid version ID format").optional(),
	directory: z.string().optional(),
});

export type ListFilesQuery = z.infer<typeof listFilesQuerySchema>;

/**
 * Schema for route parameters
 */
export const projectIdParamSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
});

export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;

/**
 * Schema for file path parameter (catch-all route)
 */
export const filePathParamSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
	path: z.string().min(1, "File path is required"),
});

export type FilePathParam = z.infer<typeof filePathParamSchema>;

/**
 * Schema for download query parameters
 */
export const downloadQuerySchema = z.object({
	versionId: z.string().uuid("Invalid version ID format").optional(),
});

export type DownloadQuery = z.infer<typeof downloadQuerySchema>;
