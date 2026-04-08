# Workspace Layout Shell

**Status:** Planned
**Type:** Feature
**Module:** workspace-layout

---

## Purpose

The workspace layout shell that wraps the three panels with a shared header and context.

**PRD Reference:** Sections 3.1, 6.

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/workspace/WorkspaceContext.tsx` | React context for panel coordination |
| `apps/web/src/components/workspace/WorkspaceHeader.tsx` | Top header component |
| `apps/web/src/components/workspace/WorkspaceLayout.tsx` | Three-panel shell |

---

## WorkspaceContext.tsx

```tsx
import { createContext, useContext, type ReactNode } from "react";

interface WorkspaceContextValue {
  projectId: string;
  projectName: string;
  currentVersionId: string;
  currentVersionNumber: number;
  selectedFilePath: string | null;
  setSelectedFilePath: (path: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  changedFilePaths: string[];
  setChangedFilePaths: (paths: string[]) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({
  children,
  projectId,
  projectName,
  currentVersionId,
  currentVersionNumber,
  initialSelectedFilePath = null,
}: {
  children: ReactNode;
  projectId: string;
  projectName: string;
  currentVersionId: string;
  currentVersionNumber: number;
  initialSelectedFilePath?: string | null;
}) {
  // Use state for reactive values
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(
    initialSelectedFilePath
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [changedFilePaths, setChangedFilePaths] = useState<string[]>([]);

  return (
    <WorkspaceContext.Provider
      value={{
        projectId,
        projectName,
        currentVersionId,
        currentVersionNumber,
        selectedFilePath,
        setSelectedFilePath,
        isGenerating,
        setIsGenerating,
        changedFilePaths,
        setChangedFilePaths,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return ctx;
}
```

---

## WorkspaceHeader.tsx

```tsx
import { ArrowLeft, Download, Moon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useWorkspace } from "./WorkspaceContext";

interface WorkspaceHeaderProps {
  onDownload: () => void;
  isDownloading?: boolean;
}

export function WorkspaceHeader({
  onDownload,
  isDownloading = false,
}: WorkspaceHeaderProps) {
  const { projectName, currentVersionNumber } = useWorkspace();

  return (
    <header className="workspace-header">
      <div className="flex h-14 flex-shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
        {/* Back Button */}
        <a
          href="/projects"
          className="flex items-center gap-1.5 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back</span>
        </a>

        <div className="h-5 w-px bg-[var(--line)]" />

        {/* Moon Icon + Breadcrumb */}
        <div className="flex items-center gap-2">
          <Moon className="h-5 w-5 text-[var(--lagoon)]" />
          <span className="text-sm text-[var(--sea-ink-soft)]">MoonForge /</span>
          <span className="text-sm font-semibold text-[var(--sea-ink)]">
            {projectName}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Version Badge */}
        <Badge variant="generated" className="mr-2">
          v{currentVersionNumber}
        </Badge>

        {/* Download Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onDownload}
          loading={isDownloading}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download .zip</span>
        </Button>
      </div>
    </header>
  );
}
```

---

## WorkspaceLayout.tsx

```tsx
import { type ReactNode } from "react";
import { WorkspaceProvider, useWorkspace } from "./WorkspaceContext";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { ChatPanel } from "../chatbot-panel/ChatPanel";
import { CodePreviewPanel } from "../code-preview-panel/CodePreviewPanel";
import { FileExplorerPanel } from "../file-explorer-panel/FileExplorerPanel";

interface WorkspaceLayoutProps {
  children: ReactNode;
  projectId: string;
  projectName: string;
  currentVersionId: string;
  currentVersionNumber: number;
  selectedFilePath?: string | null;
  onDownload: () => void;
}

export function WorkspaceLayout(props: WorkspaceLayoutProps) {
  return (
    <WorkspaceProvider
      projectId={props.projectId}
      projectName={props.projectName}
      currentVersionId={props.currentVersionId}
      currentVersionNumber={props.currentVersionNumber}
      initialSelectedFilePath={props.selectedFilePath}
    >
      <WorkspaceLayoutInner {...props} />
    </WorkspaceProvider>
  );
}

function WorkspaceLayoutInner({
  children,
  onDownload,
}: WorkspaceLayoutProps) {
  const {} = useWorkspace();

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[var(--bg-base)]">
      {/* Header */}
      <WorkspaceHeader onDownload={onDownload} />

      {/* Three Panels */}
      <div className="flex flex-1 overflow-hidden">
        {/* Panel Kiri — Chat */}
        <aside className="flex w-80 flex-shrink-0 flex-col border-r border-[var(--line)]">
          <ChatPanel />
        </aside>

        {/* Panel Tengah — Code Preview */}
        <main className="flex-1 overflow-hidden">
          <CodePreviewPanel />
        </main>

        {/* Panel Kanan — File Explorer */}
        <aside className="flex w-72 flex-shrink-0 flex-col border-l border-[var(--line)]">
          <FileExplorerPanel />
        </aside>
      </div>

      {/* Outlet for nested routes */}
      {children}
    </div>
  );
}
```

---

## CSS Extensions

Add to `apps/web/src/styles.css`:

```css
/* Workspace header */
.workspace-header {
  flex-shrink: 0;
}

/* Panel base (shared) */
.workspace-panel {
  background: var(--header-bg);
  backdrop-filter: blur(8px);
}
```
