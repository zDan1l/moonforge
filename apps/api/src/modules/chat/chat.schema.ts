/**
 * Chat Module - Zod Validation Schemas
 *
 * Validation schemas for chat message CRUD operations.
 */

import { z } from "zod";

// ============================================================================
// Enums
// ============================================================================

/**
 * Message role enum - matches database message_role
 */
export const messageRoleEnum = z.enum(["user", "assistant"]);

export type MessageRole = z.infer<typeof messageRoleEnum>;

// ============================================================================
// Request Schemas
// ============================================================================

/**
 * Schema for creating a new chat message
 */
export const createMessageSchema = z.object({
	role: messageRoleEnum,
	content: z.string().min(1, "Message content is required"),
	versionId: z.string().uuid("Invalid version ID format").optional(),
	fileChanges: z
		.record(
			z.string(),
			z.object({
				path: z.string(),
				change: z.enum(["created", "modified", "deleted"]),
			}),
		)
		.optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;

/**
 * Schema for listing messages with pagination
 */
export const listMessagesQuerySchema = z.object({
	limit: z.coerce.number().min(1).max(100).default(50),
	cursor: z.string().optional(),
	versionId: z.string().uuid("Invalid version ID format").optional(),
});

export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>;

/**
 * Schema for route parameters
 */
export const projectIdParamSchema = z.object({
	projectId: z.string().uuid("Invalid project ID format"),
});

export type ProjectIdParam = z.infer<typeof projectIdParamSchema>;

/**
 * Schema for updating a message (if needed in future)
 */
export const updateMessageSchema = z
	.object({
		content: z.string().min(1).optional(),
		fileChanges: z
			.record(
				z.string(),
				z.object({
					path: z.string(),
					change: z.enum(["created", "modified", "deleted"]),
				}),
			)
			.optional(),
	})
	.refine((data) => data.content || data.fileChanges, {
		message: "At least one field must be provided",
	});

export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
