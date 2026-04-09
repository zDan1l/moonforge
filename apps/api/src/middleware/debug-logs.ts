import type { Context, Next } from "hono";

/**
 * Debug Logs Middleware
 *
 * Captures console.log output during request and sends it to frontend
 * via response headers for development debugging.
 */

const isDev =
	process.env.NODE_ENV === "development" ||
	process.env.NODE_ENV !== "production";

type LogEntry = {
	level: "log" | "info" | "warn" | "error";
	message: string;
	timestamp: string;
};

/**
 * Capture console output and store in context
 */
export const debugLogsMiddleware = async (c: Context, next: Next) => {
	if (!isDev) {
		await next();
		return;
	}

	const logs: LogEntry[] = [];
	const requestId = c.get("requestId") || "unknown";

	// Store original console methods
	const originalLog = console.log;
	const originalInfo = console.info;
	const originalWarn = console.warn;
	const originalError = console.error;
	const originalDebug = console.debug;

	// Override console methods to capture logs
	const captureLog = (level: LogEntry["level"], args: unknown[]) => {
		const message = args
			.map((arg) => {
				if (typeof arg === "string") return arg;
				if (arg instanceof Error) return arg.stack || arg.message;
				try {
					return JSON.stringify(arg);
				} catch {
					return String(arg);
				}
			})
			.join(" ");

		logs.push({
			level,
			message,
			timestamp: new Date().toISOString(),
		});

		// Also call original console for server-side visibility
		const prefix = `[${requestId}]`;
		switch (level) {
			case "log":
				originalLog(prefix, ...args);
				break;
			case "info":
				originalInfo(prefix, ...args);
				break;
			case "warn":
				originalWarn(prefix, ...args);
				break;
			case "error":
				originalError(prefix, ...args);
				break;
		}
	};

	console.log = (...args: unknown[]) => captureLog("log", args);
	console.info = (...args: unknown[]) => captureLog("info", args);
	console.warn = (...args: unknown[]) => captureLog("warn", args);
	console.error = (...args: unknown[]) => captureLog("error", args);
	console.debug = (...args: unknown[]) => captureLog("log", args);

	try {
		await next();
	} finally {
		// Restore original console methods
		console.log = originalLog;
		console.info = originalInfo;
		console.warn = originalWarn;
		console.error = originalError;
		console.debug = originalDebug;
	}

	// Attach logs to response header
	if (logs.length > 0) {
		try {
			const logsJson = JSON.stringify(logs);
			// Split into multiple headers if too long (header size limit is ~8KB)
			const chunkSize = 7000;
			for (let i = 0; i < logsJson.length; i += chunkSize) {
				const chunk = logsJson.slice(i, i + chunkSize);
				c.res.headers.append(`X-Debug-Logs-${i}`, chunk);
			}
			// Add count header
			c.res.headers.set("X-Debug-Logs-Count", logs.length.toString());
		} catch {
			// If JSON.stringify fails, just add a summary
			c.res.headers.set("X-Debug-Logs-Error", "Failed to serialize logs");
			c.res.headers.set("X-Debug-Logs-Count", logs.length.toString());
		}
	}
};

/**
 * Extract debug logs from response headers
 */
export function extractDebugLogs(headers: Headers): LogEntry[] {
	const count = headers.get("X-Debug-Logs-Count");
	if (!count || parseInt(count, 10) === 0) {
		return [];
	}

	try {
		// Collect all chunks
		let logsJson = "";
		let i = 0;
		while (true) {
			const chunk = headers.get(`X-Debug-Logs-${i}`);
			if (!chunk) break;
			logsJson += chunk;
			i++;
		}

		if (!logsJson) {
			return [];
		}

		return JSON.parse(logsJson) as LogEntry[];
	} catch {
		return [];
	}
}
