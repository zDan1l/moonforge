# Code Preview Panel

**Status:** Planned
**Type:** Component
**Module:** code-preview-panel

---

## Purpose

The code preview panel component — displays file content with syntax highlighting and diff view.

**PRD Reference:** Sections 3.2, 6.

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/workspace/CodePreviewPanel.tsx` | Main code preview panel |
| `apps/web/src/components/workspace/DiffViewer.tsx` | Inline diff viewer |

---

## Dependencies

```bash
pnpm add react-syntax-highlighter
pnpm add diff
```

---

## CodePreviewPanel.tsx

```tsx
import { useState, useEffect } from "react";
import { Code2, FileQuestion, Loader2 } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { api } from "@/lib/api";
import { useWorkspace } from "../workspace-layout/WorkspaceContext";
import { Badge } from "@/components/ui/Badge";

interface FileContent {
  path: string;
  content: string;
  fileSource: "template" | "ai_generated" | "modified";
  size: number;
}

type ViewMode = "content" | "diff";

interface CodePreviewPanelProps {
  projectId: string;
  selectedFilePath: string | null;
}

export function CodePreviewPanel({
  projectId,
  selectedFilePath,
}: CodePreviewPanelProps) {
  const { currentVersionId, currentVersionNumber } = useWorkspace();
  const [file, setFile] = useState<FileContent | null>(null);
  const [previousContent, setPreviousContent] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("content");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load file content when path changes
  useEffect(() => {
    if (!selectedFilePath) {
      setFile(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const loadFile = async () => {
      try {
        const res = await api.projects.files.$get({
          query: { projectId, path: selectedFilePath },
        });

        if (!res.ok) {
          throw new Error("File not found");
        }

        const json = await res.json();
        setFile(json.data);

        // If file is modified, load previous version for diff
        if (json.data.fileSource === "modified") {
          const prevRes = await api.projects.files.$get({
            query: {
              projectId,
              path: selectedFilePath,
              versionId: String(currentVersionId - 1),
            },
          });
          if (prevRes.ok) {
            const prevJson = await prevRes.json();
            setPreviousContent(prevJson.data?.content ?? null);
            setViewMode("diff");
          }
        } else {
          setPreviousContent(null);
          setViewMode("content");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load file");
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [selectedFilePath, projectId, currentVersionId]);

  // Show empty state
  if (!selectedFilePath) {
    return <EmptyState />;
  }

  // Show loading
  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <CodePreviewHeader file={null} viewMode={viewMode} onViewModeChange={() => {}} />
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--sea-ink-soft)]" />
        </div>
      </div>
    );
  }

  // Show error
  if (error || !file) {
    return (
      <div className="flex h-full flex-col">
        <CodePreviewHeader file={null} viewMode={viewMode} onViewModeChange={() => {}} />
        <div className="flex flex-1 items-center justify-center text-center">
          <div>
            <p className="text-sm text-red-500">{error ?? "File not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <CodePreviewHeader
        file={file}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="flex-1 overflow-auto">
        {viewMode === "diff" && previousContent ? (
          <DiffViewer
            oldContent={previousContent}
            newContent={file.content}
            language={getLanguageFromPath(file.path)}
          />
        ) : (
          <SyntaxHighlighter
            language={getLanguageFromPath(file.path)}
            style={oneLight}
            showLineNumbers
            customStyle={{
              margin: 0,
              padding: "1rem",
              background: "var(--sand)",
              fontSize: "0.8125rem",
              lineHeight: "1.6",
              minHeight: "100%",
            }}
            lineNumberStyle={{
              color: "var(--sea-ink-soft)",
              opacity: 0.5,
              paddingRight: "1rem",
              minWidth: "2.5rem",
            }}
          >
            {file.content}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
}

interface CodePreviewHeaderProps {
  file: FileContent | null;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

function CodePreviewHeader({
  file,
  viewMode,
  onViewModeChange,
}: CodePreviewHeaderProps) {
  const { currentVersionNumber } = useWorkspace();

  return (
    <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
      <Code2 className="h-4 w-4 flex-shrink-0 text-[var(--sea-ink-soft)]" />

      {file ? (
        <>
          <span
            className="truncate text-sm text-[var(--sea-ink)]"
            title={file.path}
          >
            {file.path}
          </span>

          <Badge variant="generated" className="ml-1 flex-shrink-0">
            v{currentVersionNumber}
          </Badge>

          {viewMode === "diff" ? (
            <button
              className="ml-auto text-xs text-[var(--lagoon-deep)] hover:underline"
              onClick={() => onViewModeChange("content")}
            >
              View file
            </button>
          ) : (
            <button
              className="ml-auto text-xs text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
              onClick={() => onViewModeChange("diff")}
            >
              View diff
            </button>
          )}
        </>
      ) : (
        <span className="text-sm text-[var(--sea-ink-soft)]">Preview</span>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
        <Code2 className="h-4 w-4 text-[var(--sea-ink-soft)]" />
        <span className="text-sm text-[var(--sea-ink)]">Preview</span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--surface)]">
          <FileQuestion className="h-8 w-8 text-[var(--sea-ink-soft)]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
            No file selected
          </h3>
          <p className="mt-1 max-w-xs text-xs text-[var(--sea-ink-soft)]">
            Select a file from the explorer or send a message to generate your
            project structure.
          </p>
        </div>
      </div>
    </div>
  );
}

function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "tsx",
    js: "javascript",
    jsx: "jsx",
    prisma: "prisma",
    json: "json",
    css: "css",
    scss: "scss",
    html: "html",
    md: "markdown",
    yaml: "yaml",
    yml: "yaml",
    sh: "bash",
    sql: "sql",
    toml: "toml",
  };
  return map[ext] ?? "text";
}
```

---

## DiffViewer.tsx

```tsx
import { useMemo } from "react";
import { diffLines } from "diff";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  language?: string;
}

export function DiffViewer({
  oldContent,
  newContent,
  language = "text",
}: DiffViewerProps) {
  const changes = useMemo(
    () => diffLines(oldContent, newContent),
    [oldContent, newContent]
  );

  // Build highlighted output
  const lines = useMemo(() => {
    const result: Array<{
      content: string;
      type: "added" | "removed" | "unchanged";
    }> = [];

    for (const change of changes) {
      const parts = change.value.split("\n");
      // Remove last empty part from trailing newline
      if (parts[parts.length - 1] === "") {
        parts.pop();
      }

      for (const part of parts) {
        result.push({
          content: part,
          type: change.added
            ? "added"
            : change.removed
              ? "removed"
              : "unchanged",
        });
      }
    }

    return result;
  }, [changes]);

  // Build display text with diff markers
  const displayText = lines
    .map((line) => {
      if (line.type === "added") return `+ ${line.content}`;
      if (line.type === "removed") return `- ${line.content}`;
      return `  ${line.content}`;
    })
    .join("\n");

  return (
    <div className="diff-viewer">
      <SyntaxHighlighter
        language={language}
        style={oneLight}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "var(--sand)",
          fontSize: "0.8125rem",
          lineHeight: "1.6",
        }}
        lineNumberStyle={{
          color: "var(--sea-ink-soft)",
          opacity: 0.5,
          paddingRight: "1rem",
          minWidth: "2.5rem",
        }}
        wrapLines
        lineProps={(lineNumber) => {
          const line = lines[lineNumber - 1];
          if (!line) return {};
          return {
            className: `diff-line diff-line-${line.type}`,
            style: {
              background:
                line.type === "added"
                  ? "color-mix(in oklab, var(--palm) 12%, transparent)"
                  : line.type === "removed"
                    ? "color-mix(in oklab, #ef4444 8%, transparent)"
                    : undefined,
            },
          };
        }}
      >
        {displayText}
      </SyntaxHighlighter>
    </div>
  );
}
```

---

## CSS Extensions

Add to `apps/web/src/styles.css`:

```css
/* Diff line colors */
.diff-line-added {
  background: color-mix(in oklab, var(--palm) 12%, transparent) !important;
}

.diff-line-removed {
  background: color-mix(in oklab, #ef4444 8%, transparent) !important;
  opacity: 0.75;
}

/* Code preview scrollbar */
.diff-viewer pre,
.code-preview-panel pre {
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
```
