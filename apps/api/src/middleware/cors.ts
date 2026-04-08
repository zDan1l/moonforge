import { cors } from "hono/cors";

/**
 * CORS middleware configuration
 * Environment-based origin whitelist
 */

const isDev = process.env.NODE_ENV === "development";

// Development: allow localhost on any port
// Production: restrict to configured frontend URL
const allowedOrigins = isDev ? [] : process.env.FRONTEND_URL?.split(",") || [];

/**
 * CORS middleware instance
 */
export const corsMiddleware = cors({
	origin: (origin) => {
		if (isDev) {
			// Allow all localhost origins in development
			if (!origin) return true;
			return (
				origin.startsWith("http://localhost:") ||
				origin.startsWith("http://127.0.0.1:")
			);
		}
		// In production, check against allowed origins
		if (!origin) return false;
		return allowedOrigins.includes(origin);
	},
	credentials: false, // Will be true when auth is added
	maxAge: 86400, // 24 hours
});
