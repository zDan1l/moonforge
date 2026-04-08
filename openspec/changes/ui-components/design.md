## Context

**Current State:**

- `apps/web/src/styles.css` has design tokens as CSS custom properties
- Starter template has basic `.island-shell`, `.feature-card`, `.nav-link` classes
- No reusable UI component library exists
- Need components for project list, workspace three-panel layout, chat, file tree

**PRD Requirements:**

- Button with variants (primary, secondary, ghost)
- Badge for file source labels ([T], [AI]) and project status
- Card for project listing
- Chat bubbles for workspace
- File tree with source badges
- Form inputs for new project creation

## Goals / Non-Goals

**Goals:**

- Shared component library matching existing design tokens
- Components use existing `.island-shell`, `.island-kicker` patterns
- TypeScript-first with proper props typing
- Tailwind v4 utility classes + custom CSS classes where needed

**Non-Goals:**

- Complete component library (dropdown, modal, table) — MVP minimal set
- Storybook / documentation
- Animation library integration
- Internationalization (i18n)

## Decisions

### 1. Component Location

**Decision:** `apps/web/src/components/ui/` directory.

**Rationale:**

- Consistent with PRD Section 5.1 (`apps/platform/src/components/ui/`)
- Easy to copy to generated output later
- Follows TanStack Start convention

### 2. Tailwind v4 + Custom CSS Mix

**Decision:** Use Tailwind utility classes for layout/spacing, custom CSS classes for tokens.

**Rationale:**

- Tailwind v4 has excellent utility classes
- Design tokens in CSS custom properties not in Tailwind config
- Hybrid approach matches existing `styles.css` patterns

### 3. Component Variants

**Decision:** CSS class-based variants, not inline styles.

**Rationale:**

- Matches existing codebase pattern
- Easier to extend with CSS custom properties
- Better for dark mode via CSS variable switching

### 4. Icon Integration

**Decision:** lucide-react (already installed) for all icons.

**Rationale:**

- Already in dependencies
- Consistent with PRD Section 4 (Tech Stack)
- Tree-shakeable, modern icon set

## Component Inventory

### Button

**States:** default, hover, active, disabled, loading

**Variants:**
- `primary` — `bg-[var(--lagoon)] text-white hover:bg-[var(--lagoon-deep)]`
- `secondary` — `border border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink)]`
- `ghost` — `text-[var(--sea-ink-soft)] hover:bg-[var(--surface)]`

**Sizes:** sm (py-1.5 px-3), md (py-2 px-4), lg (py-2.5 px-5)

### Input

**States:** default, focus, error, disabled

**Parts:** label (above), input field, hint/error (below)

```tsx
<div className="flex flex-col gap-1">
  <label className="text-sm font-medium text-[var(--sea-ink)]">Label</label>
  <input className="island-shell rounded-lg ..." />
  <span className="text-xs text-red-600">Error message</span>
</div>
```

### Card

**Pattern:** `.island-shell` for base, `.feature-card` for hoverable

**Parts:** header (optional), body, footer (optional)

### Badge

**Variants:**
- `draft` — gray
- `generated` — `--palm`
- `refined` — `--lagoon`
- `template` — chip style (PRD [T])
- `ai` — lagoon tint (PRD [AI])
- `modified` — palm tint

### ChatBubble

**Variants:**
- `user` — right-aligned, lagoon background, white text
- `assistant` — left-aligned, surface background, sea-ink text

### FileTreeItem

**Pattern:** Uses `lucide-react` icons (File, Folder, FileCode)

**Badges:** `[T]` (template), `[AI]` (ai_generated), colored dot (modified)

## File Structure

```
apps/web/src/components/ui/
├── Button.tsx
├── Input.tsx
├── Textarea.tsx
├── Card.tsx
├── Badge.tsx
├── ChatBubble.tsx
└── FileTree.tsx

apps/web/src/styles.css      ← Add component utility classes
```

## CSS Extensions

```css
/* Button utilities */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 9999px;
  transition: all 180ms ease;
  cursor: pointer;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--lagoon);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--lagoon-deep);
}

.btn-secondary {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--sea-ink);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--lagoon-deep);
}

.btn-ghost {
  background: transparent;
  color: var(--sea-ink-soft);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface);
}

/* Form utilities */
.input {
  border: 1px solid var(--line);
  border-radius: 0.75rem;
  padding: 0.5rem 0.875rem;
  background: var(--surface);
  color: var(--sea-ink);
  transition: border-color 180ms ease, box-shadow 180ms ease;
}

.input:focus {
  outline: none;
  border-color: var(--lagoon-deep);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--lagoon) 20%, transparent);
}

.input-error {
  border-color: #ef4444;
}

.input-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

/* File tree */
.file-tree {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  padding: 0.5rem;
}

.file-tree-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: var(--sea-ink-soft);
  cursor: pointer;
  transition: background 150ms ease;
}

.file-tree-item:hover {
  background: var(--surface);
}

.file-tree-item.active {
  color: var(--lagoon-deep);
  background: color-mix(in oklab, var(--lagoon) 12%, transparent);
}

.file-badge {
  margin-left: auto;
  font-size: 0.625rem;
  padding: 1px 5px;
  border-radius: 4px;
  font-weight: 600;
}

.file-badge-template {
  background: var(--chip-bg);
  border: 1px solid var(--chip-line);
  color: var(--sea-ink-soft);
}

.file-badge-ai {
  background: color-mix(in oklab, var(--lagoon) 20%, transparent);
  border: 1px solid color-mix(in oklab, var(--lagoon-deep) 35%, transparent);
  color: var(--lagoon-deep);
}
```

## Risks / Trade-offs

### Trade-off: CSS-in-JS vs Plain CSS

**Decision:** Plain CSS with Tailwind utilities.

**Rationale:** No runtime CSS-in-JS overhead, matches existing codebase patterns.

### Trade-off: Radix UI Primitives vs Custom

**Decision:** Custom for MVP.

**Rationale:** Simpler for MVP scope. Radix adds dependency weight for basic badges and buttons.

### Trade-off: Animation

**Decision:** CSS transitions only for MVP.

**Rationale:** `styles.css` already has `.rise-in` animation. Additional animations deferred.
