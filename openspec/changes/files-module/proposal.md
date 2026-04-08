## Why

MoonForge needs a Files Module to serve project files for preview and download. This includes file tree API, individual file retrieval, and zip download functionality.

**PRD Reference:** Sections 3.1 (Langkah 4-5), 3.2 (Setelah Refine), 6 (UI — Tiga Panel Workspace), 8 (Database Schema — project_files).

## Capabilities

### New Capabilities

- `file-tree`: Retrieve file tree structure for a project version
- `file-content`: Get individual file content
- `zip-download`: Download project as .zip archive

## Impact

**Affected Code:**

- `apps/api/src/modules/files/files.routes.ts` — New; file serving endpoints
- `apps/api/src/modules/files/files.service.ts` — New; file retrieval logic
- `packages/generator/src/zipper.ts` — New; zip generation logic

**Dependencies:**

- `project_files` table in database
- `packages/generator/src/zipper.ts` for zip generation

## Out of Scope (separate specs):

- File editing (read-only for MVP)
- Real-time file watching
- Large file streaming
