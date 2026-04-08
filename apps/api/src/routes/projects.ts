import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { projectService } from "../services/project.service.js";
import { claudeService, type OpenSpec } from "../services/claude.service.js";

const app = new Hono();

// Validation schemas
const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1),
});

// GET /api/projects - Get all projects
app.get("/", async (c) => {
  try {
    const projects = await projectService.getAllProjects();
    return c.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return c.json({ error: "Failed to fetch projects" }, 500);
  }
});

// POST /api/projects - Create a new project
app.post("/", zValidator("json", createProjectSchema), async (c) => {
  try {
    const data = c.req.valid("json");
    const project = await projectService.createProject(data);
    return c.json(project, 201);
  } catch (error) {
    console.error("Error creating project:", error);
    return c.json({ error: "Failed to create project" }, 500);
  }
});

// GET /api/projects/:id - Get a single project
app.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await projectService.getProjectById(id);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return c.json({ error: "Failed to fetch project" }, 500);
  }
});

// DELETE /api/projects/:id - Delete a project
app.delete("/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const success = await projectService.deleteProject(id);

    if (!success) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json({ message: "Project deleted" }, 200);
  } catch (error) {
    console.error("Error deleting project:", error);
    return c.json({ error: "Failed to delete project" }, 500);
  }
});

// GET /api/projects/:id/files - Get project files
app.get("/:id/files", async (c) => {
  try {
    const id = c.req.param("id");
    const files = await projectService.getProjectFiles(id);

    return c.json(
      files.map((f) => ({
        path: f.path,
        mimeType: f.mimeType,
      })),
    );
  } catch (error) {
    console.error("Error fetching project files:", error);
    return c.json({ error: "Failed to fetch project files" }, 500);
  }
});

// POST /api/projects/:id/generate-spec - Generate OpenSpec using Claude
app.post("/:id/generate-spec", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await projectService.getProjectById(id);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    // Generate OpenSpec using Claude
    const openspec = await claudeService.generateOpenSpec(project.description);

    // Update project with OpenSpec and status
    const updated = await projectService.updateProjectStatus(id, "PREVIEWING", openspec);

    return c.json(openspec);
  } catch (error) {
    console.error("Error generating spec:", error);
    return c.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate spec",
      },
      500,
    );
  }
});

// POST /api/projects/:id/confirm-generate - Start generation process
app.post("/:id/confirm-generate", async (c) => {
  try {
    const id = c.req.param("id");
    const project = await projectService.getProjectById(id);

    if (!project) {
      return c.json({ error: "Project not found" }, 404);
    }

    if (project.status !== "PREVIEWING" && !project.openspec) {
      return c.json({ error: "Project not ready for generation" }, 400);
    }

    // Update status to GENERATING
    await projectService.updateProjectStatus(id, "GENERATING");

    // Trigger background generation
    // In production, this should use a job queue
    startGeneration(id, project.openspec as OpenSpec).catch((err) => {
      console.error("Generation failed:", err);
      projectService.updateProjectStatus(id, "FAILED").catch(console.error);
    });

    return c.json({ message: "Generation started" });
  } catch (error) {
    console.error("Error starting generation:", error);
    return c.json({ error: "Failed to start generation" }, 500);
  }
});

// GET /api/projects/:id/export - Export project as ZIP
app.get("/:id/export", async (c) => {
  try {
    const id = c.req.param("id");
    const files = await projectService.getProjectFilesForExport(id);

    if (files.length === 0) {
      return c.json({ error: "No files to export" }, 404);
    }

    // Use JSZip for simpler ZIP creation
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();

    // Add files to ZIP
    for (const file of files) {
      zip.file(file.path, file.content);
    }

    // Generate ZIP buffer
    const buffer = await zip.generateAsync({ type: "uint8array" });

    // Headers for ZIP download
    c.header("Content-Type", "application/zip");
    c.header(
      "Content-Disposition",
      `attachment; filename="project-${id}.zip"`,
    );

    return c.body(buffer);
  } catch (error) {
    console.error("Error exporting project:", error);
    return c.json({ error: "Failed to export project" }, 500);
  }
});

// Background generation function
// This is a placeholder - in production, use a proper job queue
async function startGeneration(projectId: string, openspec: OpenSpec) {
  try {
    const totalFiles = openspec.modules.length * 3 + openspec.prismaModels.length + 10; // Approximate
    let completedFiles = 0;

    // Emit progress via SSE would go here
    // For now, we'll just generate some files

    // Generate Prisma schema
    const prismaSchema = generatePrismaSchema(openspec);
    await projectService.saveProjectFile(
      projectId,
      "apps/api/prisma/schema.prisma",
      prismaSchema,
      "text/prisma",
    );
    completedFiles++;

    // Generate package.json for each module
    for (const module of openspec.modules) {
      const modulePackageJson = generateModulePackageJson(module, openspec.projectName);
      await projectService.saveProjectFile(
        projectId,
        `apps/api/src/modules/${module.name}/package.json`,
        modulePackageJson,
        "application/json",
      );
      completedFiles++;
    }

    // Generate routes for each module
    for (const module of openspec.modules) {
      const routes = generateModuleRoutes(module);
      await projectService.saveProjectFile(
        projectId,
        `apps/api/src/modules/${module.name}/${module.name}.routes.ts`,
        routes,
        "text/typescript",
      );
      completedFiles++;
    }

    // Update status to GENERATED
    await projectService.updateProjectStatus(projectId, "GENERATED");
  } catch (error) {
    console.error("Generation error:", error);
    await projectService.updateProjectStatus(projectId, "FAILED");
    throw error;
  }
}

// Helper function to generate Prisma schema
function generatePrismaSchema(openspec: OpenSpec): string {
  let schema = `// This is your Prisma schema file

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

  for (const model of openspec.prismaModels) {
    schema += `model ${model.name} {\n`;
    schema += `  id        String   @id @default(cuid())\n`;

    for (const field of model.fields) {
      const optional = field.isOptional ? "?" : "";
      const attributes = field.attributes.length > 0 ? " " + field.attributes.join(" ") : "";
      schema += `  ${field.name}  ${field.type}${optional}${attributes}\n`;
    }

    for (const relation of model.relations) {
      schema += `  ${relation.fieldName}  ${relation.modelName} @relation("${relation.fieldName}")\n`;
    }

    schema += `  createdAt DateTime @default(now())\n`;
    schema += `  updatedAt DateTime @updatedAt\n`;
    schema += `  @@map("${model.tableName}")\n`;
    schema += `}\n\n`;
  }

  return schema;
}

// Helper function to generate module package.json
function generateModulePackageJson(
  module: OpenSpec["modules"][number],
  projectName: string,
): string {
  return JSON.stringify(
    {
      name: `${projectName}-${module.name}`,
      version: "1.0.0",
      main: `${module.name}.routes.ts`,
    },
    null,
    2,
  );
}

// Helper function to generate module routes
function generateModuleRoutes(module: OpenSpec["modules"][number]): string {
  return `import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

const app = new Hono();

// Validation schemas
const create${module.namePascal}Schema = z.object({
  // Add fields based on ${module.prismaModelName} model
});

// GET /api/${module.name} - List all ${module.name}
app.get('/', async (c) => {
  return c.json({ data: [] });
});

// GET /api/${module.name}/:id - Get single ${module.nameSingular}
app.get('/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ id });
});

// POST /api/${module.name} - Create new ${module.nameSingular}
app.post('/', zValidator('json', create${module.namePascal}Schema), async (c) => {
  const data = c.req.valid('json');
  return c.json({ data }, 201);
});

// PUT /api/${module.name}/:id - Update ${module.nameSingular}
app.put('/:id', zValidator('json', create${module.namePascal}Schema.partial()), async (c) => {
  const id = c.req.param('id');
  const data = c.req.valid('json');
  return c.json({ id, ...data });
});

// DELETE /api/${module.name}/:id - Delete ${module.nameSingular}
app.delete('/:id', async (c) => {
  const id = c.req.param('id');
  return c.json({ message: 'Deleted' });
});

export default app;
`;
}

export default app;
