## Context

**Current State:**

- Workspace layout has a placeholder file explorer panel (from frontend-setup)
- `FileTree` component exists in ui-components
- No file explorer panel component implemented
- Files API endpoint exists (`GET /api/projects/:projectId/files`)

**PRD Requirements:**

- Panel Kanan displays file tree with [T], [AI], [Modified] badges
- File badges distinguish template vs AI-generated vs modified files
- Click file → loads in Code Preview Panel
- After refine: file tree updates, changed files highlighted

## Goals / Non-Goals

**Goals:**

- Load and display file tree from API
- Show file source badges ([T], [AI], [Modified])
- Click to select file (navigate URL)
- Show version context (current version indicator)
- Download button for .zip

**Non-Goals:**

- Directory expansion state persistence (post-MVP)
- File search/filter (post-MVP)
- File drag-and-drop (post-MVP)
- File upload (post-MVP)

## Decisions

### 1. File Tree Library

**Decision:** Use existing `FileTree` component from ui-components.

**Rationale:** Already spec'd with tree building logic. Minimal work to integrate.

### 2. File Selection

**Decision:** Navigate to `/projects/:projectId/files/:encodedPath` on click.

**Rationale:**

- Consistent with CodePreviewPanel URL-based state
- Browser back/forward works
- Deep-linking supported

### 3. File Source Badge Display

**Decision:** Show badge inline with file name, right-aligned.

**Rationale:**

- Consistent with ui-components FileTree spec
- `[T]` and `[AI]` are short enough to fit inline
- Color-coded for quick visual scanning

### 4. Version Context

**Decision:** Show version indicator at top of panel, not in each file.

**Rationale:**

- Cleaner file list
- Version badge on each file would be noisy
- Version selector is in workspace header (workspace-layout spec)

### 5. Download Button

**Decision:** Primary action in panel header.

**Rationale:**

- Prominent access to PRD Section 3.1 Step 5 requirement
- Quick workflow: generate → download
- Could also be in workspace header (workspace-layout)

## Layout Structure

```
┌────────────────────────────────────┐
│  Files                   [↓ .zip] │  ← Panel header + download
├────────────────────────────────────┤
│                                    │
│  📁 apps/                         │
│   📁 api/                         │
│    📄 schema.prisma    [AI]       │
│    📁 src/                        │
│     📁 modules/                   │
│      📁 users/                    │
│       📄 users.routes.ts [AI]    │
│       📄 users.service.ts [AI]   │
│       📄 users.schema.ts  [AI]   │
│      📁 products/                │
│       📄 products.routes.ts [AI] │
│       📄 products.service.ts [AI]│
│       📄 products.schema.ts [AI] │
│     📁 lib/                       │
│      📄 prisma.ts       [T]      │
│    📁 prisma/                    │
│     📄 schema.prisma    [AI]     │
│  📁 packages/                     │
│   📁 types/                      │
│    📄 index.ts         [Modified]│
│                                    │
└────────────────────────────────────┘
```

**Badge Legend:**

| Badge | Color | Meaning |
|-------|-------|---------|
| `[T]` | gray chip | Template file — don't touch |
| `[AI]` | lagoon tint | AI-generated — may refine |
| `[Modified]` | palm tint | Manually modified after generation |

## Panel Header

```
┌────────────────────────────────────┐
│  Files                    [↓ .zip] │
├────────────────────────────────────┤
```

- Title: "Files" with Files icon
- Action: Download button (primary, compact)

## Empty State

When no files exist (e.g., new project):

```
┌────────────────────────────────────┐
│  Files                    [↓ .zip] │
├────────────────────────────────────┤
│                                    │
│         📁                         │
│                                    │
│    No files yet                    │
│                                    │
│   Send a message to generate       │
│   your project structure.          │
│                                    │
└────────────────────────────────────┘
```

## States

| State | Visual |
|-------|--------|
| Loading | Skeleton file tree |
| Empty | "No files yet" prompt |
| With data | File tree with badges |
| Error | Error message + retry |

## After Refine — Highlight Changed Files

PRD Section 3.2: "File Tree diperbarui — file yang berubah ditandai dengan warna berbeda."

```tsx
// When viewing a new version after refine,
// files that were modified in this version get visual emphasis
<FileTreeItem
  isNewlyModified={file.version_id === currentVersionId && file.file_source === "modified"}
/>
```

CSS for newly modified files:
```css
.file-tree-item.newly-modified {
  background: color-mix(in oklab, var(--lagoon) 15%, transparent);
  border-left: 2px solid var(--lagoon);
}
```

## API Integration

### Load File Tree

```typescript
// In FileExplorerPanel or route loader
const response = await api.projects.files.$get({
  query: { projectId, versionId: currentVersionId },
});
const data = await response.json();
// data: { files: FileEntry[], versionId, versionNumber, totalFiles }
```

### Download Zip

```typescript
// Trigger browser download
const response = await api.projects["$projectId"].download.$get({
  query: { versionId: currentVersionId },
  fetchOptions: {
    responseType: "blob",
  },
});

// Create download link
const blob = await response.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = `${projectName}-v${versionNumber}.zip`;
a.click();
URL.revokeObjectURL(url);
```

## Tree Building

The `FileTree` component in ui-components handles tree building from flat file list:

```tsx
// Input: flat list from API
const files = [
  { path: "apps/api/prisma/schema.prisma", name: "schema.prisma", fileSource: "ai_generated" },
  { path: "apps/api/src/lib/prisma.ts", name: "prisma.ts", fileSource: "template" },
  { path: "packages/types/src/index.ts", name: "index.ts", fileSource: "modified" },
];

// FileTree builds the tree structure internally
<FileTree
  files={files}
  activePath={selectedFilePath}
  onFileClick={(path) => navigate(`/projects/${projectId}/files/${encodeURIComponent(path)}`)}
/>
```

## Risks / Trade-offs

### Trade-off: Flat List vs Tree API

**Decision:** Backend returns flat list, frontend builds tree.

**Rationale:** Consistent with files-module design. Easier to filter/query. Tree building is trivial.

### Trade-off: Badge on Each File vs Legend

**Decision:** Badge inline with each file.

**Rationale:** Faster scanning. User doesn't need to look up legend. Works well for MVP file counts.
