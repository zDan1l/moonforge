## 1. API Client

- [ ] 1.1 Create `apps/web/src/lib/api.ts`
- [ ] 1.2 Implement Hono RPC client with `hc<AppType>`
- [ ] 1.3 Handle SSR vs client URL resolution
- [ ] 1.4 Export typed API client for use in routes

## 2. Root Layout Update

- [ ] 2.1 Update `apps/web/src/routes/__root.tsx` with Header component
- [ ] 2.2 Add navigation links (/projects, /about)
- [ ] 2.3 Keep existing TanStackDevtools setup

## 3. Landing Page Redirect

- [ ] 3.1 Update `apps/web/src/routes/index.tsx`
- [ ] 3.2 Implement redirect to `/projects` using `router.navigate()`
- [ ] 3.3 Remove or update existing starter content

## 4. Projects Layout

- [ ] 4.1 Create `apps/web/src/routes/projects/__root.tsx`
- [ ] 4.2 Implement projects layout with header
- [ ] 4.3 Add breadcrumb / navigation

## 5. Project List Page

- [ ] 5.1 Create `apps/web/src/routes/projects/index.tsx`
- [ ] 5.2 Implement loader to fetch projects from API
- [ ] 5.3 Display project cards with status badge
- [ ] 5.4 Add "New Project" button (placeholder for now)

## 6. Workspace Layout

- [ ] 6.1 Create `apps/web/src/routes/projects/$projectId/__root.tsx`
- [ ] 6.2 Implement three-panel layout (chat, code, files)
- [ ] 6.3 Add loader to fetch project data
- [ ] 6.4 Handle project not found state

## 7. Workspace Home

- [ ] 7.1 Create `apps/web/src/routes/projects/$projectId/index.tsx`
- [ ] 7.2 Default to chat tab panel
- [ ] 7.3 Implement redirect/tab switching

## 8. File Preview Route

- [ ] 8.1 Create `apps/web/src/routes/projects/$projectId/files/$path.tsx`
- [ ] 8.2 Implement loader to fetch file content from API
- [ ] 8.3 Display code with syntax highlighting (placeholder)
- [ ] 8.4 Handle file not found state

## 9. Design Token Extensions

- [ ] 9.1 Add workspace tokens to `apps/web/src/styles.css`
- [ ] 9.2 Add `.workspace-panel`, `.file-tree-item`, `.code-preview` classes
- [ ] 9.3 Test dark mode compatibility

## 10. Route Registration

- [ ] 10.1 Run `pnpm router-gen` to generate `routeTree.gen.ts`
- [ ] 10.2 Verify route tree includes new routes
- [ ] 10.3 Add routes to `router.tsx` if needed

## Out of Scope (Separate Specs)

- Chat real-time streaming — deferred to Chat Module or post-MVP
- File editing — deferred post-MVP
- Real-time diff rendering — deferred to UI Components spec
- Mobile responsive workspace — deferred post-MVP
