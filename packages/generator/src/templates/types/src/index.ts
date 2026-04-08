/**
 * Shared Types Package
 *
 * This package contains shared TypeScript types used across the monorepo.
 * Types are auto-generated from the Prisma schema and supplemented with utility types.
 *
 * [AI] - This file will be auto-generated based on the Prisma schema
 */

// ============================================================================
// Prisma Generated Types
// ============================================================================

// Re-export types from Prisma generated client
// These will be populated when the AI generates the Prisma schema
export type {
	// Prisma types will be exported here after schema generation
} from "../../apps/api/src/generated/prisma/client.js";

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
 * Make specific properties required, keeping the rest optional
 */
export type RequiredOnly<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Standard API success response
 */
export interface ApiResponse<T> {
	success: true;
	data: T;
	meta: {
		timestamp: string;
		[key: string]: unknown;
	};
}

/**
 * Standard API error response
 */
export interface ApiError {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta: {
		timestamp: string;
	};
}

/**
 * API response type (union of success and error)
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination query parameters
 */
export interface PaginationParams {
	page: number;
	limit: number;
}

/**
 * Paginated response wrapper
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

// ============================================================================
// Common Types
// ============================================================================

/**
 * UUID string type
 */
export type UUID = string;

/**
 * ISO datetime string
 */
export type ISO8601 = string;

/**
 * Entity with timestamps
 */
export interface Timestamped {
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Soft-deleteable entity
 */
export interface SoftDeletable extends Timestamped {
	deletedAt?: Date;
}
