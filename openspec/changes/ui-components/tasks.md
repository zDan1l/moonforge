## 1. Component Library Setup

- [ ] 1.1 Create `apps/web/src/components/ui/` directory
- [ ] 1.2 Verify lucide-react is installed
- [ ] 1.3 Add component utility classes to `styles.css`

## 2. Button Component

- [ ] 2.1 Create `apps/web/src/components/ui/Button.tsx`
- [ ] 2.2 Implement variants: primary, secondary, ghost
- [ ] 2.3 Implement sizes: sm, md, lg
- [ ] 2.4 Add loading state with spinner
- [ ] 2.5 Support `asChild` pattern for polymorphic usage (optional)

## 3. Input Component

- [ ] 3.1 Create `apps/web/src/components/ui/Input.tsx`
- [ ] 3.2 Add label, error, hint props
- [ ] 3.3 Implement focus ring with lagoon color
- [ ] 3.4 Handle disabled state

## 4. Textarea Component

- [ ] 4.1 Create `apps/web/src/components/ui/Textarea.tsx`
- [ ] 4.2 Reuse Input styles for consistency
- [ ] 4.3 Add auto-resize option (optional)

## 5. Card Component

- [ ] 5.1 Create `apps/web/src/components/ui/Card.tsx`
- [ ] 5.2 Implement Card.Header, Card.Body, Card.Footer sub-components
- [ ] 5.3 Add hoverable prop with `.feature-card` pattern
- [ ] 5.4 Export as compound component

## 6. Badge Component

- [ ] 6.1 Create `apps/web/src/components/ui/Badge.tsx`
- [ ] 6.2 Implement variants: draft, generated, refined, template, ai, modified
- [ ] 6.3 Match PRD [T], [AI] labels
- [ ] 6.4 Add pill style for badges

## 7. ChatBubble Component

- [ ] 7.1 Create `apps/web/src/components/ui/ChatBubble.tsx`
- [ ] 7.2 Implement user variant (right-aligned, lagoon bg)
- [ ] 7.3 Implement assistant variant (left-aligned, surface bg)
- [ ] 7.4 Add timestamp display
- [ ] 7.5 Use existing `.rise-in` animation

## 8. FileTree Components

- [ ] 8.1 Create `apps/web/src/components/ui/FileTree.tsx`
- [ ] 8.2 Implement FileTreeItem component
- [ ] 8.3 Add icons via lucide-react (File, Folder, FileCode)
- [ ] 8.4 Implement file source badges ([T], [AI])
- [ ] 8.5 Add click handler for navigation
- [ ] 8.6 Support directory expansion (optional for MVP)

## 9. Component Exports

- [ ] 9.1 Create `apps/web/src/components/ui/index.ts`
- [ ] 9.2 Export all components
- [ ] 9.3 Add type exports

## 10. Usage Integration

- [ ] 10.1 Update project list page to use Button, Card, Badge
- [ ] 10.2 Update workspace layout to use ChatBubble, FileTree
- [ ] 10.3 Test dark mode compatibility
- [ ] 10.4 Test accessibility (keyboard nav, screen reader)

## Out of Scope (Separate Specs)

- Dropdown, Select, Combobox — deferred post-MVP
- Modal / Dialog — deferred post-MVP
- Data table with sorting — deferred post-MVP
- Syntax highlighting — deferred to UI Components (add later)
- Animation library — CSS transitions only for MVP
