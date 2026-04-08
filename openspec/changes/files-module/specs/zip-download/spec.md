# Zip Download

**Status:** Planned
**Type:** Feature
**Module:** files-module

---

## Purpose

Generate and serve project files as a downloadable .zip archive.

**PRD Reference:** Sections 3.1 (Langkah 5), 3.2 (Setelah Refine).

---

## Files

| File | Purpose |
|------|---------|
| `packages/generator/src/zipper.ts` | Zip generation logic |

---

## zipper.ts

```typescript
import { Readable } from "stream";
import archiver from "archiver";
import { prisma } from "../../../../apps/api/src/lib/prisma.js";
import { NotFoundError } from "../../../../apps/api/src/middleware/error-handler.js";

/**
 * Generate a zip archive for a project version
 * Returns a readable stream for streaming response
 */
export async function generateProjectZip(
  projectId: string,
  versionId?: string
): Promise<{ stream: Readable; filename: string; fileCount: number }> {
  // Get version
  const version = versionId
    ? await prisma.project_versions.findUnique({ where: { id: versionId } })
    : await prisma.project_versions.findFirst({
        where: { project_id: projectId },
        orderBy: { version_number: "desc" },
      });

  if (!version) {
    throw new NotFoundError("Version");
  }

  // Get project for name
  const project = await prisma.projects.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new NotFoundError("Project");
  }

  // Get all files for version
  const files = await prisma.project_files.findMany({
    where: {
      project_id: projectId,
      version_id: version.id,
    },
    select: {
      path: true,
      content: true,
    },
  });

  // Create archive
  const archive = archiver("zip", {
    zlib: { level: 9 }, // Maximum compression
  });

  // Add files to archive
  for (const file of files) {
    archive.append(file.content, { name: file.path });
  }

  // Finalize archive
  archive.finalize();

  // Generate filename
  const sanitizedName = project.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const filename = `${sanitizedName}-v${version.version_number}.zip`;

  return {
    stream: archive,
    filename,
    fileCount: files.length,
  };
}
```

---

## Route Integration

Add to `files.routes.ts`:

```typescript
import { generateProjectZip } from "@/generator/zipper.js";

// GET /api/projects/:projectId/download — Download as zip
files.get(
  "/:projectId/download",
  zValidator("param", projectIdSchema),
  async (c) => {
    const { projectId } = c.req.valid("param");
    const versionId = c.req.query("versionId") || undefined;

    const { stream, filename, fileCount } = await generateProjectZip(
      projectId,
      versionId
    );

    // Set headers for zip download
    c.header("Content-Type", "application/zip");
    c.header(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );
    c.header("X-Total-Files", fileCount.toString());

    // Stream response
    return c.body(stream);
  }
);
```

---

## Response

**GET /api/projects/:projectId/download**

**Headers:**

```
Content-Type: application/zip
Content-Disposition: attachment; filename="my-project-v1.zip"
X-Total-Files: 45
```

**Body:** Binary zip file

---

## Error Responses

| Status | Code | Message |
|--------|-------|---------|
| 404 | NOT_FOUND | Project not found |
| 404 | NOT_FOUND | Version not found |

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `archiver` | Zip archive generation |

Install: `pnpm add archiver`
