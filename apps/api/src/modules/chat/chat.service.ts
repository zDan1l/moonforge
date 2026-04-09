/**
 * Chat Service
 *
 * Business logic for chat message CRUD operations.
 * Manages conversation history per project.
 */

import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../middleware/error-handler.js";
import type { MessageRole } from "./chat.schema.js";

// ============================================================================
// Types
// ============================================================================

export interface CreateMessageInput {
	role: MessageRole;
	content: string;
	versionId?: string;
	fileChanges?: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	>;
}

export interface ListMessagesOptions {
	projectId: string;
	limit?: number;
	cursor?: string;
	versionId?: string;
}

export interface MessageOutput {
	id: string;
	projectId: string;
	versionId: string | null;
	role: MessageRole;
	content: string;
	fileChanges: Record<string, unknown> | null;
	createdAt: Date;
}

export interface PaginatedMessagesResult {
	messages: MessageOutput[];
	nextCursor: string | null;
	hasMore: boolean;
}

// ============================================================================
// Service Functions
// ============================================================================

/**
 * Check if project exists
 */
async function ensureProjectExists(projectId: string): Promise<void> {
	const project = await prisma.projects.findUnique({
		where: { id: projectId },
		select: { id: true },
	});

	if (!project) {
		throw new NotFoundError("Project");
	}
}

/**
 * List messages for a project with pagination
 */
export async function listMessages(
	options: ListMessagesOptions,
): Promise<PaginatedMessagesResult> {
	const { projectId, limit = 50, cursor, versionId } = options;

	// Ensure project exists
	await ensureProjectExists(projectId);

	// Build where clause
	const where: {
		project_id: string;
		version_id?: string;
		id?: { lt?: string };
	} = {
		project_id: projectId,
	};

	if (versionId) {
		where.version_id = versionId;
	}

	if (cursor) {
		where.id = { ...where.id, lt: cursor };
	}

	// Fetch messages
	const messages = await prisma.chat_messages.findMany({
		where,
		orderBy: { created_at: "desc" },
		take: limit + 1, // Fetch one extra to determine if there's more
		select: {
			id: true,
			project_id: true,
			version_id: true,
			role: true,
			content: true,
			file_changes: true,
			created_at: true,
		},
	});

	// Determine if there are more messages
	const hasMore = messages.length > limit;
	const items = hasMore ? messages.slice(0, limit) : messages;

	// Get next cursor
	const nextCursor = hasMore ? items[items.length - 1].id : null;

	// Return in chronological order (oldest first for chat display)
	return {
		messages: items.reverse().map((msg) => ({
			id: msg.id,
			projectId: msg.project_id,
			versionId: msg.version_id,
			role: msg.role as MessageRole,
			content: msg.content,
			fileChanges: msg.file_changes as Record<string, unknown> | null,
			createdAt: msg.created_at,
		})),
		nextCursor,
		hasMore,
	};
}

/**
 * Create a new chat message
 */
export async function createMessage(
	projectId: string,
	data: CreateMessageInput,
): Promise<MessageOutput> {
	// Ensure project exists
	await ensureProjectExists(projectId);

	// If versionId is provided, verify it belongs to the project
	if (data.versionId) {
		const version = await prisma.project_versions.findFirst({
			where: {
				id: data.versionId,
				project_id: projectId,
			},
		});

		if (!version) {
			throw new NotFoundError("Version");
		}
	}

	// Create message
	const createData: {
		project_id: string;
		version_id: string | undefined;
		role: "user" | "assistant";
		content: string;
		file_changes: Record<string, unknown> | null;
	} = {
		project_id: projectId,
		version_id: data.versionId,
		role: data.role,
		content: data.content,
		file_changes: data.fileChanges
			? (JSON.parse(JSON.stringify(data.fileChanges)) as Record<string, unknown>)
			: null,
	};

	const message = await prisma.chat_messages.create({
		data: createData as never,
		select: {
			id: true,
			project_id: true,
			version_id: true,
			role: true,
			content: true,
			file_changes: true,
			created_at: true,
		},
	});

	return {
		id: message.id,
		projectId: message.project_id,
		versionId: message.version_id,
		role: message.role as MessageRole,
		content: message.content,
		fileChanges: message.file_changes as Record<string, unknown> | null,
		createdAt: message.created_at,
	};
}

/**
 * Get a single message by ID
 */
export async function getMessage(
	projectId: string,
	messageId: string,
): Promise<MessageOutput> {
	const message = await prisma.chat_messages.findFirst({
		where: {
			id: messageId,
			project_id: projectId,
		},
		select: {
			id: true,
			project_id: true,
			version_id: true,
			role: true,
			content: true,
			file_changes: true,
			created_at: true,
		},
	});

	if (!message) {
		throw new NotFoundError("Message");
	}

	return {
		id: message.id,
		projectId: message.project_id,
		versionId: message.version_id,
		role: message.role as MessageRole,
		content: message.content,
		fileChanges: message.file_changes as Record<string, unknown> | null,
		createdAt: message.created_at,
	};
}

/**
 * Delete all messages for a project
 */
export async function deleteMessages(projectId: string): Promise<{ deletedCount: number }> {
	// Ensure project exists
	await ensureProjectExists(projectId);

	// Delete all messages for the project
	const result = await prisma.chat_messages.deleteMany({
		where: { project_id: projectId },
	});

	return { deletedCount: result.count };
}

/**
 * Delete a single message
 */
export async function deleteMessage(
	projectId: string,
	messageId: string,
): Promise<{ id: string }> {
	// Ensure message exists and belongs to project
	const message = await prisma.chat_messages.findFirst({
		where: {
			id: messageId,
			project_id: projectId,
		},
	});

	if (!message) {
		throw new NotFoundError("Message");
	}

	await prisma.chat_messages.delete({
		where: { id: messageId },
	});

	return { id: messageId };
}

/**
 * Get message count for a project
 */
export async function getMessageCount(projectId: string): Promise<number> {
	const count = await prisma.chat_messages.count({
		where: { project_id: projectId },
	});

	return count;
}
