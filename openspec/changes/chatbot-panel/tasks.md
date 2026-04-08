## 1. ChatPanel Component

- [ ] 1.1 Create `apps/web/src/components/workspace/ChatPanel.tsx`
- [ ] 1.2 Implement panel header with title and help icon
- [ ] 1.3 Load messages from API via loader or context
- [ ] 1.4 Render messages with ChatBubble component
- [ ] 1.5 Auto-scroll to bottom on new messages
- [ ] 1.6 Implement empty welcome state

## 2. ChatInput Component

- [ ] 2.1 Create `apps/web/src/components/workspace/ChatInput.tsx`
- [ ] 2.2 Implement textarea with auto-resize
- [ ] 2.3 Add send button
- [ ] 2.4 Handle Enter to send (Shift+Enter for newline)
- [ ] 2.5 Disable during sending/generating
- [ ] 2.6 Clear input on send

## 3. Send Action Flow

- [ ] 3.1 POST user message to `/api/projects/:projectId/messages`
- [ ] 3.2 Trigger generation (setup or refine) based on message count
- [ ] 3.3 Show "Generating..." state
- [ ] 3.4 Refetch messages after generation completes
- [ ] 3.5 Scroll to bottom after new messages load

## 4. Error Handling

- [ ] 4.1 Handle message send failure (show error, retry option)
- [ ] 4.2 Handle generation failure (show error, allow retry)
- [ ] 4.3 Handle message load failure (show error, retry)

## 5. Welcome Message (Empty State)

- [ ] 5.1 Implement welcome illustration
- [ ] 5.2 Add helper text with example prompts
- [ ] 5.3 Auto-focus input

## 6. File Changes Summary

- [ ] 6.1 Parse fileChanges from assistant messages
- [ ] 6.2 Render clickable file list below message
- [ ] 6.3 "View Files" link highlights/changes panel

## 7. Integration with WorkspaceContext

- [ ] 7.1 Use isGenerating state from context
- [ ] 7.2 Update context on send
- [ ] 7.3 Coordinate with FileExplorerPanel for changed files

## 8. Dependencies Verification

- [ ] 8.1 Verify ChatBubble component exists
- [ ] 8.2 Verify Textarea component exists
- [ ] 8.3 Verify Button component exists
- [ ] 8.4 Check API client for messages endpoints

## Out of Scope (Separate Specs)

- Real-time WebSocket streaming — deferred post-MVP
- Message editing/deletion — deferred post-MVP
- Typing indicators — deferred post-MVP
- Message reactions — deferred post-MVP
