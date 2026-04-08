# FileTree Component

**Status:** Planned
**Type:** Component
**Module:** ui-components

---

## Purpose

File tree component for the workspace file explorer panel. Displays file structure with icons and source badges ([T], [AI], modified).

**PRD Reference:** Sections 3.1, 3.2, 6 (UI — Panel Kanan File Explorer).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/FileTree.tsx` | FileTree component |

---

## FileTree.tsx

```tsx
import { type ReactNode } from "react";
import {
  File,
  Folder,
  FolderOpen,
  FileCode,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Badge } from "./Badge";

type FileSource = "template" | "ai_generated" | "modified";

export interface FileTreeItemProps {
  name: string;
  path: string;
  fileSource?: FileSource;
  isActive?: boolean;
  isDirectory?: boolean;
  children?: ReactNode;
  onClick?: (path: string) => void;
}

export function FileTreeItem({
  name,
  path,
  fileSource,
  isActive,
  isDirectory,
  children,
  onClick,
}: FileTreeItemProps) {
  const Icon = isDirectory ? Folder : FileCode;

  return (
    <div className="file-tree-group">
      <button
        type="button"
        className={`file-tree-item w-full ${isActive ? "active" : ""}`}
        onClick={() => onClick?.(path)}
      >
        {isDirectory && (
          <span className="file-tree-chevron">
            <ChevronRight className="h-3 w-3" />
          </span>
        )}
        <Icon className="h-4 w-4 flex-shrink-0 text-[var(--sea-ink-soft)]" />
        <span className="truncate">{name}</span>
        {fileSource && (
          <Badge variant={fileSource === "template" ? "template" : fileSource === "ai_generated" ? "ai" : "modified"} />
        )}
      </button>
      {children}
    </div>
  );
}

export interface FileTreeProps {
  files: Array<{
    path: string;
    name: string;
    fileSource?: FileSource;
  }>;
  activePath?: string;
  onFileClick?: (path: string) => void;
}

interface TreeNode {
  name: string;
  path: string;
  fileSource?: FileSource;
  children: TreeNode[];
}

function buildTree(files: FileTreeProps["files"]): TreeNode[] {
  const root: TreeNode[] = [];

  for (const file of files) {
    const parts = file.path.split("/");
    let current = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const currentPath = parts.slice(0, i + 1).join("/");
      const isLast = i === parts.length - 1;

      let node = current.find((n) => n.name === part);

      if (!node) {
        node = {
          name: part,
          path: currentPath,
          fileSource: isLast ? file.fileSource : undefined,
          children: [],
        };
        current.push(node);
      }

      current = node.children;
    }
  }

  return root;
}

function sortTree(nodes: TreeNode[]): TreeNode[] {
  return nodes
    .sort((a, b) => {
      if (a.children.length > 0 && b.children.length === 0) return -1;
      if (a.children.length === 0 && b.children.length > 0) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((node) => ({
      ...node,
      children: sortTree(node.children),
    }));
}

export function FileTree({ files, activePath, onFileClick }: FileTreeProps) {
  const tree = sortTree(buildTree(files));

  return (
    <div className="file-tree">
      {tree.map((node) => (
        <FileTreeNode
          key={node.path}
          node={node}
          activePath={activePath}
          onFileClick={onFileClick}
        />
      ))}
    </div>
  );
}

function FileTreeNode({
  node,
  activePath,
  onFileClick,
}: {
  node: TreeNode;
  activePath?: string;
  onFileClick?: (path: string) => void;
}) {
  const isDirectory = node.children.length > 0;
  const isActive = activePath === node.path;

  if (isDirectory) {
    return (
      <div className="file-tree-directory">
        <FileTreeItem
          name={node.name}
          path={node.path}
          isDirectory
          isActive={isActive}
          onClick={onFileClick}
        />
        <div className="file-tree-children">
          {node.children.map((child) => (
            <FileTreeNode
              key={child.path}
              node={child}
              activePath={activePath}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <FileTreeItem
      name={node.name}
      path={node.path}
      fileSource={node.fileSource}
      isActive={isActive}
      onClick={onFileClick}
    />
  );
}
```

---

## FileTree CSS Classes

Add to `apps/web/src/styles.css`:

```css
/* File tree container */
.file-tree {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem;
}

/* File tree item button */
.file-tree-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--sea-ink-soft);
  cursor: pointer;
  transition:
    background 150ms ease,
    color 150ms ease;
  text-align: left;
  border: none;
  background: transparent;
  width: 100%;
}

.file-tree-item:hover {
  background: var(--surface);
}

.file-tree-item.active {
  color: var(--lagoon-deep);
  background: color-mix(in oklab, var(--lagoon) 12%, transparent);
}

.file-tree-item .file-badge {
  margin-left: auto;
}

/* Directory chevron */
.file-tree-chevron {
  display: flex;
  align-items: center;
  color: var(--sea-ink-soft);
}

/* Nested children */
.file-tree-children {
  padding-left: 1rem;
}

/* File tree group */
.file-tree-group {
  display: flex;
  flex-direction: column;
}

.file-tree-directory {
  display: flex;
  flex-direction: column;
}
```

---

## Usage Examples

```tsx
// Basic file tree
<FileTree
  files={[
    { path: "apps/api/prisma/schema.prisma", name: "schema.prisma", fileSource: "ai_generated" },
    { path: "apps/api/src/modules/users/users.routes.ts", name: "users.routes.ts", fileSource: "ai_generated" },
    { path: "apps/api/src/modules/users/users.service.ts", name: "users.service.ts", fileSource: "ai_generated" },
    { path: "apps/api/src/lib/prisma.ts", name: "prisma.ts", fileSource: "template" },
    { path: "packages/types/src/index.ts", name: "index.ts", fileSource: "modified" },
  ]}
  activePath="/projects/123/files/apps/api/prisma/schema.prisma"
  onFileClick={(path) => console.log("Selected:", path)}
/>
```

---

## File Source Badge Mapping

| fileSource | Badge variant | Display |
|------------|--------------|---------|
| `template` | `template` | [T] |
| `ai_generated` | `ai` | [AI] |
| `modified` | `modified` | [Modified] |

---

## Accessibility

- Uses `<button>` for keyboard navigation
- `aria-selected` on active item
- Icon-based visual indication supplemented with badge text
- Proper focus management for keyboard users
