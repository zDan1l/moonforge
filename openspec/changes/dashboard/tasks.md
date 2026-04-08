## 1. Modal Component

- [ ] 1.1 Create `apps/web/src/components/ui/Modal.tsx`
- [ ] 1.2 Implement open/close state with backdrop
- [ ] 1.3 Add close on backdrop click
- [ ] 1.4 Add close on Escape key
- [ ] 1.5 Implement focus trap inside modal
- [ ] 1.6 Add entrance animation (fade + scale)

## 2. CreateProjectForm Component

- [ ] 2.1 Create `apps/web/src/components/dashboard/CreateProjectForm.tsx`
- [ ] 2.2 Add name field with label and validation
- [ ] 2.3 Add description field (textarea) with label and validation
- [ ] 2.4 Implement submit handler with loading state
- [ ] 2.5 Handle success → return project data
- [ ] 2.6 Handle error → show inline error messages

## 3. Projects Page — Loader

- [ ] 3.1 Update `apps/web/src/routes/projects/index.tsx`
- [ ] 3.2 Implement loader to fetch projects from API
- [ ] 3.3 Handle API error state
- [ ] 3.4 Return typed project data

## 4. Projects Page — New Project Button

- [ ] 4.1 Add "New Project" CTA card (dashed border, dashed outline style)
- [ ] 4.2 Add "New Project" button in header (primary button style)
- [ ] 4.3 Both trigger modal open

## 5. Projects Page — Modal Integration

- [ ] 5.1 Integrate Modal + CreateProjectForm
- [ ] 5.2 On form success, close modal and navigate to workspace
- [ ] 5.3 On form error, display error toast

## 6. Projects Page — Project Cards

- [ ] 6.1 Render project cards from loader data
- [ ] 6.2 Display name, description, status badge
- [ ] 6.3 Show version count in footer
- [ ] 6.4 Add "Open Workspace" link to each card
- [ ] 6.5 Add hover effect on cards

## 7. Projects Page — Empty State

- [ ] 7.1 Implement empty state when no projects
- [ ] 7.2 Show friendly illustration/icon
- [ ] 7.3 Show "Create First Project" CTA button
- [ ] 7.4 CTA triggers modal open

## 8. Projects Page — Error State

- [ ] 8.1 Handle loader error state
- [ ] 8.2 Show error message with retry button
- [ ] 8.3 Handle create error state

## 9. Dependencies Verification

- [ ] 9.1 Verify `date-fns` is installed (for relative time)
- [ ] 9.2 Verify all UI component dependencies are met
- [ ] 9.3 Verify API client exists at `@/lib/api`

## Out of Scope (Separate Specs)

- Project deletion — deferred post-MVP
- Project rename/edit — deferred post-MVP
- Search/filter/sort — deferred post-MVP
- Mobile full-screen modal — deferred post-MVP
