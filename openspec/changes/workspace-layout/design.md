## Context

**Current State:**

- `apps/web/src/routes/projects/$projectId/__root.tsx` — placeholder with empty panels (from frontend-setup)
- No workspace layout component exists
- Three panels are defined structurally but not coordinated

**PRD Requirements:**

- Header with project name, back button
- Three panels: chat (kiri), code preview (tengah), file explorer (kanan)
- Panels coordinate via shared state (selected file, active message)

## Goals / Non-Goals

**Goals:**

- Workspace header with project info and navigation
- Three-panel container with fixed proportions
- State coordination via React context or URL params
- Responsive layout (panels stack on narrow screens — post-MVP)
- Version indicator in header

**Non-Goals:**

- Resizable panels (post-MVP)
- Panel collapse/expand (post-MVP)
- Panel reordering (post-MVP)
- Full responsive/mobile layout (post-MVP)

## Decisions

### 1. State Coordination Strategy

**Decision:** URL-based state for selected file (`/projects/:projectId/files/:path`), React context for transient state (panel loading states).

**Rationale:**

- Selected file is bookmarkable/shareable
- Easy to deep-link to a specific file
- Chat message selection can use URL hash (`#msg-123`) or context
- React context for panel-level state (loading, error)

### 2. Panel Dimensions

**Decision:** Fixed widths in pixels, not percentage.

| Panel | Width | Rationale |
|-------|-------|-----------|
| Chat (Kiri) | `320px` (w-80) | Comfortable chat width, not too wide |
| Code Preview (Tengah) | `flex-1` | Takes remaining space |
| File Explorer (Kanan) | `288px` (w-72) | Compact file tree |

### 3. Header Height

**Decision:** `56px` (h-14) fixed header.

**Rationale:** Space for project name + back button + version badge. Compact but readable.

## Layout Structure

```
┌─────────────────────────────────────────────────────────────────────┐
│  Header (h-14)                                                      │
│  [← Back] │ Project Name                          [v2] [Download .zip]│
├──────────────┬──────────────────────────────────┬─────────────────────┤
│              │                                   │                     │
│  Chat        │  Code Preview                     │  File Explorer      │
│  (w-80)      │  (flex-1)                        │  (w-72)             │
│              │                                   │                     │
│  [messages]  │  [file content / diff]           │  [file tree]        │
│              │                                   │                     │
│  [input]     │                                   │                     │
└──────────────┴──────────────────────────────────┴─────────────────────┘
```

## Component Architecture

```
WorkspaceLayout (route __root.tsx)
├── WorkspaceHeader
│   ├── BackButton
│   ├── ProjectName
│   ├── VersionBadge
│   └── DownloadButton
├── ChatPanel (Panel Kiri)
├── CodePreviewPanel (Panel Tengah)
└── FileExplorerPanel (Panel Kanan)
```

## State Management

```typescript
// URL: /projects/:projectId/files/:path
// - projectId from route params
// - path from route params (selected file)

// React Context for transient state
interface WorkspaceContext {
  selectedFile: string | null;
  setSelectedFile: (path: string | null) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  activeMessageId: string | null;
  setActiveMessageId: (id: string | null) => void;
}
```

## WorkspaceHeader Design

```
┌──────────────────────────────────────────────────────────────────────┐
│  [←]  MoonForge / SaaS App           [v2 ▼]    [↓ Download .zip]   │
└──────────────────────────────────────────────────────────────────────┘
```

- **Back button** — ArrowLeft icon, links to `/projects`
- **Breadcrumb** — "MoonForge / {projectName}"
- **Version selector** — Dropdown to switch between versions (optional MVP)
- **Download button** — Primary button, triggers zip download

## Responsive Behavior

**MVP:** Horizontal three-panel layout only. No responsive breakpoints.

**Post-MVP considerations:**

- Mobile: Stack panels vertically, tab-based navigation
- Tablet: Two panels visible at a time, swipe to navigate
- Wide: Expand code preview, collapsible side panels

## Risks / Trade-offs

### Trade-off: URL State vs Context State

**Decision:** URL for selected file, context for UI state.

**Rationale:** Selected file is primary navigation state — should be bookmarkable. UI state (loading, panel sizes) doesn't belong in URL.

### Trade-off: Header vs No Header

**Decision:** Keep header for navigation context.

**Rationale:** User needs to know which project they're in, and needs quick access to download. Minimal cost for high value.
