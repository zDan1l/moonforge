## Context

**Current State:**

- Workspace layout has a placeholder code preview panel (from frontend-setup)
- No code preview component exists
- `projects/$projectId/files/$path.tsx` route exists but uses placeholder code

**PRD Requirements:**

- Panel Tengah displays file content
- Diff highlighting for modified files (PRD Section 3.2)
- Read-only (no editing for MVP)

## Goals / Non-Goals

**Goals:**

- Display file content with syntax highlighting
- Show diff between versions when viewing a modified file
- Display file metadata (path, source badge, size)
- Empty state when no file selected
- Loading state during file load

**Non-Goals:**

- File editing (post-MVP)
- Full version comparison (post-MVP)
- Inline comments (post-MVP)
- Large file virtual scrolling (post-MVP)

## Decisions

### 1. Syntax Highlighting Approach

**Decision:** Use `react-syntax-highlighter` or `@uiw/react-md-editor` for MVP.

**Rationale:**

- Quick to integrate
- Supports many languages out of the box
- No backend needed for highlighting

**Post-MVP consideration:** Could use Shiki for server-side highlighting (consistent across SSR/CSR).

### 2. Diff Display Mode

**Decision:** Inline diff view (unified) for MVP.

**Rationale:**

- Simpler to implement than side-by-side
- Easier to fit in narrow panel
- Good enough for MVP

**Post-MVP:** Side-by-side diff option for wide screens.

### 3. Diff Calculation

**Decision:** Backend provides old and new content; frontend renders diff.

**Rationale:**

- Diffing on frontend is fast with modern libraries
- Backend already has both versions from copy-on-write
- Reduces complexity vs doing diff in backend

### 4. Selected File State

**Decision:** File path comes from URL (`/projects/:projectId/files/:path`).

**Rationale:** Bookmarkable, shareable, browser back/forward works naturally.

## Layout Structure

```
┌──────────────────────────────────────────────────────────┐
│  apps/api/prisma/schema.prisma          [v2] [T] [···] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1  │ model User {                                      │
│  2  │   id        String   @id @default(uuid())         │
│  3  │   email     String   @unique                      │
│  4  │   name      String?                                │
│  5  │   createdAt DateTime @default(now())              │
│  6  │ }                                                  │
│  7  │                                                    │
│  8  │ model Product {                                   │
│  9  │ +  id        String   @id @default(uuid())  ← NEW │
│  10 │ +  name      String                            ← NEW │
│  11 │ +  price     Decimal @db.Decimal(10,2)       ← NEW │
│  12 │ + }                                       ← NEW │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

- **Line numbers** — Left gutter, dimmed color
- **Diff markers** — `+` (green), `-` (red), inline highlight
- **Scroll** — Both horizontal (long lines) and vertical
- **Header** — File path + version badge + source badge + actions menu

## Diff Highlighting

```css
/* Added lines */
.diff-added {
  background: color-mix(in oklab, var(--palm) 15%, transparent);
  border-left: 3px solid var(--palm);
}

/* Removed lines */
.diff-removed {
  background: color-mix(in oklab, #ef4444 10%, transparent);
  border-left: 3px solid #ef4444;
  text-decoration: line-through;
  opacity: 0.7;
}

/* Changed lines (inline diff) */
.diff-changed {
  background: color-mix(in oklab, var(--lagoon) 15%, transparent);
}
```

## File Header

```
apps/api/prisma/schema.prisma          [v2]  [AI]  [⋮]
```

- **File path** — Truncated with ellipsis if too long
- **Version** — `v{number}` badge
- **Source** — [T] / [AI] / [Modified] badge
- **Actions menu** — Download file, Copy path, View raw (future)

## Empty State

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│              📄                                          │
│                                                          │
│         No file selected                                 │
│                                                          │
│    Select a file from the explorer or send a message     │
│    to generate your project structure.                   │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## States

| State | Visual |
|-------|--------|
| Empty | Empty state illustration + prompt |
| Loading | Skeleton lines (like code) |
| File content | Syntax-highlighted code |
| Diff view | Code with diff highlighting |
| Error | Error message + retry button |

## API Integration

### Load File Content

```typescript
// In CodePreviewPanel or route loader
const response = await api.projects.files.$get({
  query: { projectId, path: filePath },
});
const data = await response.json();
// data: { path, content, fileSource, size }
```

### Load Diff (for modified files)

```typescript
// Compare current version with previous version
const currentFile = await api.projects.files.$get({
  query: { projectId, path, versionId: currentVersionId },
});
const previousFile = await api.projects.files.$get({
  query: { projectId, path, versionId: previousVersionId },
});

// Use diff library to compute inline diff
import { diffLines } from "diff";
const changes = diffLines(previousFile.content, currentFile.content);
```

### Syntax Highlighter Usage

```tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

<SyntaxHighlighter
  language={getLanguageFromPath(filePath)}
  style={vscDarkPlus}
  showLineNumbers
  customStyle={{
    background: "var(--sand)",
    fontSize: "0.8125rem",
  }}
>
  {file.content}
</SyntaxHighlighter>
```

## Language Detection

```typescript
function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    prisma: "prisma",
    json: "json",
    css: "css",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
    sql: "sql",
  };
  return map[ext ?? ""] ?? "text";
}
```

## Risks / Trade-offs

### Trade-off: Client vs Server Highlighting

**Decision:** Client-side highlighting for MVP.

**Rationale:** Faster to implement, no backend changes needed.

### Trade-off: Inline vs Side-by-Side Diff

**Decision:** Inline diff for MVP.

**Rationale:** Fits better in narrow panel. Side-by-side is post-MVP.
