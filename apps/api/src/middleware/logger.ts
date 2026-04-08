import type { Context, Next } from "hono";

/**
 * Request ID generation and logging middleware
 */

const isDev = process.env.NODE_ENV === "development";

// Log levels
type LogLevel = "debug" | "info" | "warn" | "error";

function log(level: LogLevel, message: string, data: Record<string, unknown>) {
	const logEntry = {
		level,
		message,
		...data,
		timestamp: new Date().toISOString(),
	};

	// In production, only log warn and error
	if (!isDev && (level === "debug" || level === "info")) {
		return;
	}

	// Console output with colors in development
	const colors = {
		debug: "\x1b[36m", // cyan
		info: "\x1b[32m", // green
		warn: "\x1b[33m", // yellow
		error: "\x1b[31m", // red
	};
	const reset = "\x1b[0m";

	if (isDev) {
		console.log(
			`${colors[level]}[${level.toUpperCase()}]${reset} ${message}`,
			JSON.stringify(logEntry),
		);
	} else {
		console.log(JSON.stringify(logEntry));
	}
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
	return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Logger middleware
 * Tracks request timing, request ID, and logs all requests
 */
export const loggerMiddleware = async (c: Context, next: Next) => {
	const requestId = generateRequestId();
	const startTime = Date.now();

	// Store request ID in context for use in other middleware/routes
	c.set("requestId", requestId);

	// Log incoming request
	log("info", "Incoming request", {
		requestId,
		method: c.req.method,
		path: c.req.path,
		query: c.req.query(),
		headers: isDev ? Object.fromEntries(c.req.header()) : undefined,
	});

	// Wait for response
	await next();

	// Calculate duration
	const duration = Date.now() - startTime;

	// Log response
	const status = c.res.status;
	const logLevel = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

	log(logLevel, "Request completed", {
		requestId,
		method: c.req.method,
		path: c.req.path,
		status,
		duration: `${duration}ms`,
		...(duration > 1000 ? { warning: "Slow request" } : {}),
	});

	// Add request ID to response header
	c.res.headers.set("X-Request-ID", requestId);
};
