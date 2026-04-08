## Context

**Current State:**

- Database has `project_files` table with `project_id`, `version_id`, `path`, `content`, `file_source`
- `packages/generator/src/zipper.ts` exists but is empty
- No file serving endpoints exist

**PRD Requirements:**

- File tree display in UI (panel kanan)
- Code preview with diff (panel tengah)
- Download .zip for deployment

## Goals / Non-Goals

**Goals:**

- Retrieve file tree structure
- Get individual file content
- Generate and serve .zip download
- Filter by version for historical access

**Non-Goals:**

- File editing (read-only)
- Large file streaming (MVP limit ~10MB)
- Real-time file watching

## Decisions

### 1. File Tree Structure

**Decision:** Return flat list of files with metadata, frontend builds tree.

**Rationale:**

- Simpler API, frontend handles tree building
- Easier to filter by path pattern
- Consistent with database structure

**Response Format:**

```typescript
interface FileEntry {
  path: string;           // e.g., "apps/api/prisma/schema.prisma"
  name: string;           // e.g., "schema.prisma"
  directory: string;       // e.g., "apps/api/prisma"
  size: number;           // bytes
  fileSource: "template" | "ai_generated" | "modified";
}
```

### 2. Zip Generation

**Decision:** Generate .zip in memory and stream to client.

**Rationale:**

- Files already in database, no disk I/O needed
- Streaming response handles large zips better
- Clean up after response

### 3. Version Selection

**Decision:** Use latest version by default, allow versionId query param.

**Rationale:**

- Common use case is latest version
- Historical access via versionId

## API Endpoints

### GET /api/projects/:projectId/files

**Description:** Get file tree for a project.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `versionId` | UUID | No | latest | Specific version |
| `directory` | string | No | — | Filter by directory prefix |

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "path": "apps/api/prisma/schema.prisma",
      "name": "schema.prisma",
      "directory": "apps/api/prisma",
      "size": 1234,
      "fileSource": "ai_generated"
    }
  ],
  "meta": {
    "versionId": "uuid",
    "versionNumber": 2,
    "totalFiles": 45,
    "timestamp": "..."
  }
}
```

### GET /api/projects/:projectId/files/:path

**Description:** Get content of a specific file.

**Response (200):**

```json
{
  "success": true,
  "data": {
    "path": "apps/api/prisma/schema.prisma",
    "content": "// Prisma schema content...",
    "fileSource": "ai_generated",
    "size": 1234
  }
}
```

### GET /api/projects/:projectId/download

**Description:** Download project as .zip archive.

**Query Parameters:**

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `versionId` | UUID | No | latest | Specific version |

**Response:** Binary .zip file with `Content-Disposition: attachment`

## File Structure

```
apps/api/src/modules/files/
├── files.routes.ts     # Hono routes
├── files.schema.ts     # Zod validation schemas
└── files.service.ts   # File retrieval logic

packages/generator/src/
└── zipper.ts           # Zip generation logic
```

## Zip Generation

```typescript
import archiver from "archiver";
import { Readable } from "stream";

export async function generateZipStream(files: FileEntry[]): Promise<Readable> {
  const archive = archiver("zip");

  for (const file of files) {
    archive.append(file.content, { name: file.path });
  }

  archive.finalize();
  return archive;
}
```

## Risks / Trade-offs

### Trade-off: Memory vs Streaming

**Decision:** Stream zip directly to response.

**Rationale:** Avoids memory issues with large projects. Prisma streams data.

### Trade-off: File Size Limit

**Decision:** No explicit limit for MVP, Prisma handles pagination.

**Rationale:** Simple approach. Add limit if needed.

## Open Questions

None — design is straightforward for MVP scope.
