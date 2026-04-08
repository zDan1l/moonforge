## Why

The File Explorer Panel is Panel Kanan of the three-panel workspace. It displays the project file tree with source badges, version context, and download functionality.

**PRD Reference:** Sections 3.1 (Langkah 4 — File Tree Muncul), 3.2 (Setelah Refine — File Tree diperbarui), 6 (UI — Panel Kanan).

## Capabilities

### New Capabilities

- `file-tree-display`: Load and display file tree from API
- `file-source-badges`: Show [T], [AI], [Modified] badges
- `version-context`: Version selector/indicator
- `file-click-navigation`: Click file → load in Code Preview Panel
- `download-zip`: Download project as .zip

## Impact

**Affected Code:**

- `apps/web/src/components/workspace/FileExplorerPanel.tsx` — File explorer panel component

**Dependencies:**

| API Endpoint | Module | Purpose |
|-------------|--------|---------|
| `GET /api/projects/:projectId/files` | files-module | List files |
| `GET /api/projects/:projectId/download` | files-module | Download .zip |

**Dependencies (UI):**

| Component | Module |
|-----------|--------|
| `FileTree` | ui-components |
| `Badge` | ui-components |
| `Button` | ui-components |

## Out of Scope (Separate Specs)

- Directory expansion/collapse state persistence — deferred post-MVP
- File search/filter — deferred post-MVP
- File upload — deferred post-MVP
