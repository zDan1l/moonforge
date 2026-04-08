// Load environment variables FIRST before any other imports
import { config } from "dotenv";
config({ path: "../../.env" });

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

// Import routes after env is loaded
import projectsRouter from "./routes/projects.js";
import progressRouter from "./routes/progress.js";

const app = new Hono();

// CORS middleware
app.use("*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003", process.env.FRONTEND_URL].filter(Boolean) as string[],
  credentials: true,
}));

// Health check
app.get("/", (c) => {
  return c.json({
    name: "MoonForge API",
    version: "1.0.0",
    status: "ok",
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// API routes
app.route("/api/projects", projectsRouter);
app.route("/api/projects", progressRouter);

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json(
    {
      error: "Internal server error",
      message: err.message,
    },
    500,
  );
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Start server
const port = Number.parseInt(process.env.PORT || "8000", 10);

console.log(`Starting MoonForge API on port ${port}...`);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
    console.log(`Health check: http://localhost:${info.port}/health`);
  },
);
