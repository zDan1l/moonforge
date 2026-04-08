# File Explorer Panel

**Status:** Planned
**Type:** Component
**Module:** file-explorer-panel

---

## Purpose

The file explorer panel component — displays file tree with badges and download functionality.

**PRD Reference:** Sections 3.1, 3.2, 6.

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/workspace/FileExplorerPanel.tsx` | Main file explorer panel |

---

## FileExplorerPanel.tsx

```tsx
import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Files, Download, Loader2, FolderTree } from "lucide-react";
import { api } from "@/lib/api";
import { useWorkspace } from "../workspace-layout/WorkspaceContext";
import { FileTree } from "@/components/ui/FileTree";
import { Button } from "@/components/ui/Button";
import { formatDistanceToNow } from "date-fns";

interface FileEntry {
  path: string;
  name: string;
  directory: string;
  size: number;
  fileSource: "template" | "ai_generated" | "modified";
}

interface FilesResponse {
  files: FileEntry[];
  versionId: string;
  versionNumber: number;
  totalFiles: number;
}

interface FileExplorerPanelProps {
  projectId: string;
  projectName: string;
}

export function FileExplorerPanel({
  projectId,
  projectName,
}: FileExplorerPanelProps) {
  const { currentVersionId, currentVersionNumber, selectedFilePath, setSelectedFilePath, changedFilePaths } =
    useWorkspace();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file tree
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await api.projects.files.$get({
          query: { projectId, versionId: currentVersionId },
        });

        if (!res.ok) {
          throw new Error("Failed to load files");
        }

        const json = await res.json();
        setFiles(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load files");
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [projectId, currentVersionId]);

  // Handle file click
  const handleFileClick = (path: string) => {
    setSelectedFilePath(path);
    navigate({
      to: "/projects/$projectId/files/$path",
      params: {
        projectId,
        path: encodeURIComponent(path),
      },
    });
  };

  // Handle download
  const handleDownload = async () => {
    setIsDownloading(true);

    try {
      const res = await fetch(
        `http://localhost:3001/api/projects/${projectId}/download${
          currentVersionId ? `?versionId=${currentVersionId}` : ""
        }`
      );

      if (!res.ok) {
        throw new Error("Download failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const sanitizedName = projectName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${sanitizedName}-v${currentVersionNumber}.zip`;

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // TODO: Show error toast
    } finally {
      setIsDownloading(false);
    }
  };

  const hasFiles = files.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Panel Header */}
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
        <Files className="h-4 w-4 text-[var(--sea-ink-soft)]" />
        <span className="flex-1 text-sm font-medium text-[var(--sea-ink)]">
          Files
        </span>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDownload}
          loading={isDownloading}
          className="h-7 px-2 text-xs"
        >
          <Download className="h-3 w-3" />
          <span className="hidden sm:inline">.zip</span>
        </Button>
      </div>

      {/* File Tree or States */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState error={error} onRetry={() => {}} />
        ) : !hasFiles ? (
          <EmptyState />
        ) : (
          <FileTree
            files={files}
            activePath={selectedFilePath ?? undefined}
            onFileClick={handleFileClick}
          />
        )}
      </div>

      {/* Footer: file count */}
      {hasFiles && (
        <div className="border-t border-[var(--line)] px-4 py-2">
          <span className="text-xs text-[var(--sea-ink-soft)]">
            {files.length} files
          </span>
        </div>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--sea-ink-soft)]" />
      <span className="text-xs text-[var(--sea-ink-soft)]">Loading files...</span>
    </div>
  );
}

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-xs text-red-500">{error}</p>
      <button
        onClick={onRetry}
        className="text-xs text-[var(--lagoon-deep)] hover:underline"
      >
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)]">
        <FolderTree className="h-6 w-6 text-[var(--sea-ink-soft)]" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
          No files yet
        </h3>
        <p className="mt-1 max-w-xs text-xs text-[var(--sea-ink-soft)]">
          Send a message to generate your project structure.
        </p>
      </div>
    </div>
  );
}
```

---

## API Integration Notes

**File tree:**
```typescript
// GET /api/projects/:projectId/files
api.projects.files.$get({
  query: { projectId, versionId: currentVersionId },
});
```

**Download:**
Uses direct fetch with absolute URL for blob download. Hono RPC doesn't support blob responses directly.

```typescript
const res = await fetch(`${API_BASE}/projects/${projectId}/download`);
const blob = await res.blob();
```

---

## Badge Mapping

| fileSource | Badge variant | Display |
|------------|--------------|---------|
| `template` | `template` | [T] |
| `ai_generated` | `ai` | [AI] |
| `modified` | `modified` | [Modified] |

The `FileTree` component from ui-components handles badge rendering based on `fileSource` prop.

---

## Changed Files Highlight

When files have been modified in the current version (from `changedFilePaths` in workspace context):

```tsx
// In FileTree, check if file is in changedFilePaths
const isNewlyModified = changedFilePaths.includes(file.path);

<FileTreeItem
  isNewlyModified={isNewlyModified}
  // ...other props
/>
```

CSS for newly modified files:
```css
.file-tree-item.newly-modified {
  background: color-mix(in oklab, var(--lagoon) 15%, transparent);
  border-left: 2px solid var(--lagoon);
}
```
