import { Hono } from "hono";
import { projectService } from "../services/project.service.js";

const app = new Hono();

// GET /api/projects/:id/generate/progress - SSE endpoint for generation progress
app.get("/:id/generate/progress", async (c) => {
  const id = c.req.param("id");

  // Set headers for SSE
  return c.streamText(async (stream) => {
    // Check if project exists
    const project = await projectService.getProjectById(id);

    if (!project) {
      await stream.write(
        `data: ${JSON.stringify({ type: "error", message: "Project not found" })}\n\n`,
      );
      return;
    }

    // If already generated, send done event
    if (project.status === "GENERATED" || project.status === "MODIFIED") {
      await stream.write(
        `data: ${JSON.stringify({
          type: "done",
          total: project.files.length,
          completed: project.files.length,
        })}\n\n`,
      );
      return;
    }

    // If failed, send error event
    if (project.status === "FAILED") {
      await stream.write(
        `data: ${JSON.stringify({ type: "error", message: "Generation failed" })}\n\n`,
      );
      return;
    }

    // If still pending or previewing, send waiting state
    if (project.status === "PENDING" || project.status === "PREVIEWING") {
      await stream.write(
        `data: ${JSON.stringify({
          type: "waiting",
          message: "Waiting for generation to start...",
        })}\n\n`,
      );
      return;
    }

    // If generating, poll for updates
    let attempts = 0;
    const maxAttempts = 300; // 5 minutes max (1 sec intervals)

    while (attempts < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const currentProject = await projectService.getProjectById(id);

      if (!currentProject) {
        await stream.write(
          `data: ${JSON.stringify({ type: "error", message: "Project not found" })}\n\n`,
        );
        break;
      }

      if (currentProject.status === "GENERATED" || currentProject.status === "MODIFIED") {
        await stream.write(
          `data: ${JSON.stringify({
            type: "done",
            total: currentProject.files.length,
            completed: currentProject.files.length,
          })}\n\n`,
        );
        break;
      }

      if (currentProject.status === "FAILED") {
        await stream.write(
          `data: ${JSON.stringify({ type: "error", message: "Generation failed" })}\n\n`,
        );
        break;
      }

      // Send progress update
      if (currentProject.status === "GENERATING") {
        await stream.write(
          `data: ${JSON.stringify({
            type: "progress",
            completed: currentProject.files.length,
            total: currentProject.files.length + 5, // Estimate
            message: "Generating files...",
          })}\n\n`,
        );
      }

      attempts++;
    }

    if (attempts >= maxAttempts) {
      await stream.write(
        `data: ${JSON.stringify({ type: "error", message: "Generation timeout" })}\n\n`,
      );
    }
  });
});

export default app;
