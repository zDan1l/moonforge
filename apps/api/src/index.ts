import { serve } from "@hono/node-server";
import { config } from "dotenv";
import { Hono } from "hono";
import packageJson from "../package.json" with { type: "json" };
import { prisma } from "./lib/prisma.js";
import { success } from "./lib/response.js";

import { corsMiddleware } from "./middleware/cors.js";
import { debugLogsMiddleware } from "./middleware/debug-logs.js";
import { errorHandler } from "./middleware/error-handler.js";
import { loggerMiddleware } from "./middleware/logger.js";
import generateRoutes from "./modules/generate/generate.routes.js";
import projectsRoutes from "./modules/projects/projects.routes.js";

config({ path: "../../.env" });

// ============================================================================
// Hono App Setup
// ============================================================================

const app = new Hono();

// ============================================================================
// Middleware Pipeline
// Order: Logger → Debug Logs → CORS → Route Handlers → Error Handler
// ============================================================================

app.use("*", loggerMiddleware);
app.use("*", debugLogsMiddleware);
app.use("*", corsMiddleware);
app.onError(errorHandler);

// ============================================================================
// Health Check Endpoint
// ============================================================================

app.get("/health", async (c) => {
	const startTime = Date.now();
	const _isHealthy = true;

	// Check database connectivity
	let dbStatus = "healthy";
	let dbDuration = 0;

	try {
		const dbStart = Date.now();
		await prisma.$queryRaw`SELECT 1`;
		dbDuration = Date.now() - dbStart;

		if (dbDuration > 50) {
			dbStatus = "degraded";
		}
	} catch (error) {
		console.error("Database connection error:", error);
		dbStatus = "unhealthy";
		return c.json(
			{
				success: false,
				error: {
					code: "SERVICE_UNHEALTHY",
					message: "Database connection failed",
				},
				meta: {
					timestamp: new Date().toISOString(),
				},
			},
			503,
		);
	}

	const overallStatus = dbStatus === "healthy" ? "healthy" : "degraded";
	const duration = Date.now() - startTime;

	return c.json(
		success(
			{
				service: {
					name: "moonforge-api",
					version: packageJson.version,
					environment: process.env.NODE_ENV || "development",
				},
				status: overallStatus,
				checks: {
					database: {
						status: dbStatus,
						duration: `${dbDuration}ms`,
					},
				},
				duration: `${duration}ms`,
			},
			{
				timestamp: new Date().toISOString(),
			},
		),
		overallStatus === "degraded" ? 200 : 200,
	);
});

// ============================================================================
// Module Routes
// ============================================================================

app.route("/api/projects", projectsRoutes);
app.route("/api/generate", generateRoutes);

// ============================================================================
// Root Endpoint (temporary)
// ============================================================================

app.get("/", (c) => {
	return c.json(
		success(
			{
				message: "MoonForge API",
				version: packageJson.version,
				docs: "/health",
			},
			{
				timestamp: new Date().toISOString(),
			},
		),
	);
});

// ============================================================================
// 404 Handler
// ============================================================================

app.notFound((c) => {
	return c.json(
		{
			success: false,
			error: {
				code: "NOT_FOUND",
				message: `Route ${c.req.method} ${c.req.path} not found`,
			},
			meta: {
				timestamp: new Date().toISOString(),
			},
		},
		404,
	);
});

// ============================================================================
// Start Server
// ============================================================================

const port = parseInt(process.env.API_PORT || "5000", 10);

serve(
	{
		fetch: app.fetch,
		port,
	},
	(info) => {
		console.log(`🚀 MoonForge API running on http://localhost:${info.port}`);
		console.log(`📊 Health check: http://localhost:${info.port}/health`);
		console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
	},
);
