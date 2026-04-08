## Why

The Workspace Layout is the shell container that wraps all three panels of the MoonForge workspace. It provides the project header, manages the overall panel structure, and coordinates panel state (e.g., which file is selected, which chat message is active).

**PRD Reference:** Sections 3.1 (Langkah 2: Chatbot terbuka otomatis), 6 (UI — Tiga Panel Workspace).

## Capabilities

### New Capabilities

- `workspace-header`: Project name, back navigation, version badge
- `workspace-container`: Three-panel flex container with fixed widths
- `panel-coordination`: Share state between panels (selected file, active message)

## Impact

**Affected Code:**

- `apps/web/src/routes/projects/$projectId/__root.tsx` — Workspace layout route
- `apps/web/src/components/workspace/WorkspaceLayout.tsx` — Layout shell component
- `apps/web/src/components/workspace/WorkspaceHeader.tsx` — Header component

**Dependencies:**

| Component | Module | Purpose |
|-----------|--------|---------|
| `ChatPanel` | chatbot-panel | Left panel |
| `CodePreviewPanel` | code-preview-panel | Middle panel |
| `FileExplorerPanel` | file-explorer-panel | Right panel |

## Out of Scope (Separate Specs)

- Resizable panels — deferred post-MVP
- Panel collapse/expand — deferred post-MVP
- Panel tab reordering — deferred post-MVP
