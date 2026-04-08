## 1. CodePreviewPanel Component

- [ ] 1.1 Create `apps/web/src/components/workspace/CodePreviewPanel.tsx`
- [ ] 1.2 Implement panel header with file path, badges, actions
- [ ] 1.3 Load file content from API based on URL path param
- [ ] 1.4 Implement empty state (no file selected)
- [ ] 1.5 Implement loading state (skeleton)
- [ ] 1.6 Implement error state with retry

## 2. Syntax Highlighting

- [ ] 2.1 Add `react-syntax-highlighter` dependency
- [ ] 2.2 Implement language detection from file extension
- [ ] 2.3 Apply syntax highlighting to file content
- [ ] 2.4 Add line numbers
- [ ] 2.5 Configure light/dark theme (match design tokens)

## 3. DiffViewer Component

- [ ] 3.1 Create `apps/web/src/components/workspace/DiffViewer.tsx`
- [ ] 3.2 Add `diff` library dependency
- [ ] 3.3 Compute inline diff between versions
- [ ] 3.4 Highlight added/removed lines
- [ ] 3.5 Apply diff color classes (.diff-added, .diff-removed)

## 4. File Header

- [ ] 4.1 Display file path (truncated with tooltip)
- [ ] 4.2 Show version badge (v{number})
- [ ] 4.3 Add actions menu (copy path, download file — future)

## 5. URL State Integration

- [ ] 5.1 Read selected file from URL (`/projects/:projectId/files/:path`)
- [ ] 5.2 Load file content when URL changes
- [ ] 5.3 Handle file not found state
- [ ] 5.4 Handle invalid URL encoding

## 6. Empty State

- [ ] 6.1 Implement illustration + prompt text
- [ ] 6.2 Show when no file is selected
- [ ] 6.3 Link to "send a message to start"

## 7. Integration with FileExplorerPanel

- [ ] 7.1 Listen for file selection changes
- [ ] 7.2 Update URL when FileExplorerPanel file is clicked
- [ ] 7.3 Scroll to top when file changes

## 8. Dependencies Verification

- [ ] 8.1 Verify/add `react-syntax-highlighter` dependency
- [ ] 8.2 Verify/add `diff` library dependency
- [ ] 8.3 Check API client for files endpoints

## Out of Scope (Separate Specs)

- File editing — deferred post-MVP
- Side-by-side diff — deferred post-MVP
- Inline comments — deferred post-MVP
- Large file virtual scrolling — deferred post-MVP
