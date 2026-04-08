/**
 * Consistent response utility functions
 */

export interface SuccessResponseMeta {
	timestamp?: string;
	[key: string]: unknown;
}

export interface ErrorResponseMeta {
	timestamp: string;
	[key: string]: unknown;
}

export interface SuccessResponse<T> {
	success: true;
	data: T;
	meta: ErrorResponseMeta;
}

export interface ErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta: ErrorResponseMeta;
}

/**
 * Create a success response
 */
export function success<T>(
	data: T,
	meta: SuccessResponseMeta = {},
): SuccessResponse<T> {
	return {
		success: true,
		data,
		meta: {
			timestamp: new Date().toISOString(),
			...meta,
		},
	};
}

/**
 * Create an error response
 */
export function error(
	code: string,
	message: string,
	details?: unknown,
): ErrorResponse {
	return {
		success: false,
		error: {
			code,
			message,
			...(details ? { details } : {}),
		},
		meta: {
			timestamp: new Date().toISOString(),
		},
	};
}

/**
 * Create a paginated response
 */
export function paginated<T>(
	data: T[],
	page: number,
	limit: number,
	total: number,
): SuccessResponse<{
	items: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}> {
	return success({
		items: data,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	});
}
