## 1. WorkspaceContext

- [ ] 1.1 Create `apps/web/src/components/workspace/WorkspaceContext.tsx`
- [ ] 1.2 Define WorkspaceContext interface (selectedFile, isGenerating, activeMessageId)
- [ ] 1.3 Implement React context provider
- [ ] 1.4 Export useWorkspace hook

## 2. WorkspaceHeader

- [ ] 2.1 Create `apps/web/src/components/workspace/WorkspaceHeader.tsx`
- [ ] 2.2 Implement back button (links to /projects)
- [ ] 2.3 Add breadcrumb with project name
- [ ] 2.4 Add version indicator badge
- [ ] 2.5 Add download button
- [ ] 2.6 Apply design tokens (header-bg, line, sea-ink)

## 3. WorkspaceLayout Shell

- [ ] 3.1 Update `apps/web/src/routes/projects/$projectId/__root.tsx`
- [ ] 3.2 Wrap with WorkspaceContext provider
- [ ] 3.3 Implement three-panel flex container
- [ ] 3.4 Add WorkspaceHeader at top
- [ ] 3.5 Add ChatPanel, CodePreviewPanel, FileExplorerPanel
- [ ] 3.6 Handle project not found state

## 4. Route Loader Integration

- [ ] 4.1 Update workspace route loader to fetch project + files + messages
- [ ] 4.2 Pass data to panels via context/loader
- [ ] 4.3 Handle loading states

## 5. Panel Coordination

- [ ] 5.1 Implement selected file state management
- [ ] 5.2 File click → update selected file → loads in CodePreviewPanel
- [ ] 5.3 Message with fileChanges → highlight files in FileExplorerPanel

## 6. CSS Extensions

- [ ] 6.1 Add `.workspace-header`, `.workspace-panel` classes to styles.css
- [ ] 6.2 Ensure dark mode compatibility
- [ ] 6.3 Test panel layout in different viewport sizes

## Out of Scope (Separate Specs)

- Resizable panels — deferred post-MVP
- Panel collapse/expand — deferred post-MVP
- Mobile responsive layout — deferred post-MVP
