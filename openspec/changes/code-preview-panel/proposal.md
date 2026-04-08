## Why

The Code Preview Panel is Panel Tengah of the three-panel workspace. It displays file content with syntax highlighting and shows diffs when a file has been modified during refine sessions.

**PRD Reference:** Sections 3.2 (Setelah Refine — diff highlighting), 6 (UI — Panel Tengah).

## Capabilities

### New Capabilities

- `file-preview`: Display file content with syntax highlighting
- `diff-view`: Side-by-side or inline diff highlighting (old vs new)
- `file-header`: Show file path, source badge, version info
- `empty-preview-state`: Prompt to select a file or start a conversation

## Impact

**Affected Code:**

- `apps/web/src/components/workspace/CodePreviewPanel.tsx` — Code preview panel component
- `apps/web/src/components/workspace/DiffViewer.tsx` — Diff viewer component

**Dependencies:**

| API Endpoint | Module | Purpose |
|-------------|--------|---------|
| `GET /api/projects/:projectId/files` | files-module | List files |
| `GET /api/projects/:projectId/files/:path` | files-module | Get file content |
| `GET /api/projects/:projectId/versions` | projects-module | Get version info |

## Out of Scope (Separate Specs)

- Full diff between two arbitrary versions — deferred post-MVP
- Line-level commenting — deferred post-MVP
- File editing — deferred post-MVP
- Large file virtual scrolling — deferred post-MVP
