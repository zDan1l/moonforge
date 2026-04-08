## 1. Chat Service

- [ ] 1.1 Create `apps/api/src/modules/chat/chat.service.ts`
- [ ] 1.2 Implement `listMessages(projectId, options)` — paginated message history
- [ ] 1.3 Implement `createMessage(projectId, data)` — create user/assistant message
- [ ] 1.4 Implement `deleteMessages(projectId)` — delete all messages for project
- [ ] 1.5 Add project existence check

## 2. Chat Schema (Zod)

- [ ] 2.1 Create `apps/api/src/modules/chat/chat.schema.ts`
- [ ] 2.2 Define `createMessageSchema` (role, content, versionId, fileChanges)
- [ ] 2.3 Define `listMessagesQuerySchema` (limit, cursor, versionId)
- [ ] 2.4 Define route parameter schemas

## 3. Chat Routes

- [ ] 3.1 Create `apps/api/src/modules/chat/chat.routes.ts`
- [ ] 3.2 Implement `GET /api/projects/:projectId/messages`
- [ ] 3.3 Implement `POST /api/projects/:projectId/messages`
- [ ] 3.4 Implement `DELETE /api/projects/:projectId/messages`
- [ ] 3.5 Register zValidator on all routes

## 4. Integration

- [ ] 4.1 Add route to projects routes or create separate chat router
- [ ] 4.2 Update `apps/api/src/index.ts` if needed

## 5. Testing

- [ ] 5.1 Test list messages returns messages in chronological order
- [ ] 5.2 Test pagination with cursor
- [ ] 5.3 Test create message validates role enum
- [ ] 5.4 Test delete removes all messages for project

## Out of Scope (Separate Specs)

- Real-time chat (WebSocket/SSE) — deferred post-MVP
- Streaming AI responses — deferred to Web App spec
