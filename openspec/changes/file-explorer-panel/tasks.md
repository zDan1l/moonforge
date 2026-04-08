## 1. FileExplorerPanel Component

- [ ] 1.1 Create `apps/web/src/components/workspace/FileExplorerPanel.tsx`
- [ ] 1.2 Implement panel header with title and download button
- [ ] 1.3 Load file tree from API
- [ ] 1.4 Integrate FileTree component from ui-components
- [ ] 1.5 Implement loading state (skeleton)
- [ ] 1.6 Implement empty state
- [ ] 1.7 Implement error state with retry

## 2. File Selection Navigation

- [ ] 2.1 Handle file click event
- [ ] 2.2 Navigate to `/projects/:projectId/files/:encodedPath`
- [ ] 2.3 Update selected file in context
- [ ] 2.4 Highlight active file in tree

## 3. File Source Badges

- [ ] 3.1 Map fileSource to Badge variant
- [ ] 3.2 Display badge inline in FileTreeItem
- [ ] 3.3 [T] for template, [AI] for ai_generated, [Modified] for modified

## 4. Download ZIP Functionality

- [ ] 4.1 Implement download button in panel header
- [ ] 4.2 Call `/api/projects/:projectId/download`
- [ ] 4.3 Handle blob response and trigger download
- [ ] 4.4 Show loading state during download

## 5. Version Context

- [ ] 5.1 Display current version indicator (optional, may be in header)
- [ ] 5.2 Pass versionId to files API query
- [ ] 5.3 Reload tree when version changes

## 6. Changed Files Highlight (After Refine)

- [ ] 6.1 Detect files modified in current version
- [ ] 6.2 Apply visual emphasis (highlight/left border) to changed files
- [ ] 6.3 PRD Section 3.2: "file yang berubah ditandai dengan warna berbeda"

## 7. Integration with WorkspaceContext

- [ ] 7.1 Read current version from context
- [ ] 7.2 Update context when file is selected
- [ ] 7.3 Coordinate with ChatPanel for changed files display

## 8. Dependencies Verification

- [ ] 8.1 Verify FileTree component from ui-components is implemented
- [ ] 8.2 Verify Badge component from ui-components is implemented
- [ ] 8.3 Check API client for files endpoints

## Out of Scope (Separate Specs)

- Directory expansion state persistence — deferred post-MVP
- File search/filter — deferred post-MVP
- File drag-and-drop — deferred post-MVP
- File upload — deferred post-MVP
