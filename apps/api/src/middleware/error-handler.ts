import type { ErrorHandler } from "hono";

/**
 * Custom error classes for API error handling
 */

export class AppError extends Error {
	statusCode = 500;
	code = "INTERNAL_ERROR";

	constructor(message: string, statusCode = 500, code?: string) {
		super(message);
		this.name = "AppError";
		this.statusCode = statusCode;
		if (code) this.code = code;
	}
}

export class ValidationError extends AppError {
	details?: unknown;

	constructor(message: string, details?: unknown) {
		super(message, 400, "VALIDATION_ERROR");
		this.name = "ValidationError";
		this.details = details;
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string = "Resource") {
		super(`${resource} not found`, 404, "NOT_FOUND");
		this.name = "NotFoundError";
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, "CONFLICT");
		this.name = "ConflictError";
	}
}

/**
 * Global error handler middleware
 * Converts all errors to consistent JSON response format
 */
export const errorHandler: ErrorHandler = (err, c) => {
	const isDev =
		c.env?.NODE_ENV === "development" || process.env.NODE_ENV === "development";

	// Handle our custom errors
	if (err instanceof AppError) {
		return c.json(
			{
				success: false,
				error: {
					code: err.code,
					message: err.message,
					...(err instanceof ValidationError && err.details
						? { details: err.details }
						: {}),
					...(isDev ? { stack: err.stack } : {}),
				},
				meta: {
					timestamp: new Date().toISOString(),
				},
			},
			err.statusCode,
		);
	}

	// Handle unknown errors
	console.error("Unhandled error:", err);
	return c.json(
		{
			success: false,
			error: {
				code: "INTERNAL_ERROR",
				message: isDev ? err.message : "An unexpected error occurred",
				...(isDev ? { stack: err.stack } : {}),
			},
			meta: {
				timestamp: new Date().toISOString(),
			},
		},
		500,
	);
};
