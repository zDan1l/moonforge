# Badge Component

**Status:** Planned
**Type:** Component
**Module:** ui-components

---

## Purpose

Status badges for project state and file source labels matching PRD Section 6.

**PRD Reference:** Sections 3.1, 3.2, 5.2, 6 (UI — File source labels [T], [AI]).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/Badge.tsx` | Badge component |

---

## Badge.tsx

```tsx
import { type ReactNode, type HTMLAttributes } from "react";

type BadgeVariant =
  | "draft"
  | "generated"
  | "refined"
  | "template"
  | "ai"
  | "modified";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant: BadgeVariant;
  children: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  draft: "badge-draft",
  generated: "badge-generated",
  refined: "badge-refined",
  template: "badge-template",
  ai: "badge-ai",
  modified: "badge-modified",
};

const defaultLabels: Record<BadgeVariant, string> = {
  draft: "Draft",
  generated: "Generated",
  refined: "Refined",
  template: "[T]",
  ai: "[AI]",
  modified: "[Modified]",
};

export function Badge({
  variant,
  children,
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`badge ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children ?? defaultLabels[variant]}
    </span>
  );
}
```

---

## Badge CSS Classes

Add to `apps/web/src/styles.css`:

```css
/* Badge base */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  white-space: nowrap;
}

/* Draft variant — gray */
.badge-draft {
  background: color-mix(in oklab, #6b7280 15%, transparent);
  color: #4b5563;
  border: 1px solid color-mix(in oklab, #6b7280 25%, transparent);
}

/* Generated variant — palm */
.badge-generated {
  background: color-mix(in oklab, var(--palm) 15%, transparent);
  color: var(--palm);
  border: 1px solid color-mix(in oklab, var(--palm) 25%, transparent);
}

/* Refined variant — lagoon */
.badge-refined {
  background: color-mix(in oklab, var(--lagoon) 15%, transparent);
  color: var(--lagoon-deep);
  border: 1px solid color-mix(in oklab, var(--lagoon-deep) 25%, transparent);
}

/* Template variant — PRD [T] */
.badge-template {
  background: var(--chip-bg);
  color: var(--sea-ink-soft);
  border: 1px solid var(--chip-line);
}

/* AI variant — PRD [AI] */
.badge-ai {
  background: color-mix(in oklab, var(--lagoon) 20%, transparent);
  color: var(--lagoon-deep);
  border: 1px solid color-mix(in oklab, var(--lagoon-deep) 35%, transparent);
}

/* Modified variant */
.badge-modified {
  background: color-mix(in oklab, var(--palm) 20%, transparent);
  color: var(--palm);
  border: 1px solid color-mix(in oklab, var(--palm) 35%, transparent);
}
```

---

## Usage Examples

```tsx
// Project status badges
<Badge variant="draft">Draft</Badge>
<Badge variant="generated">Generated</Badge>
<Badge variant="refined">Refined</Badge>

// File source labels (PRD [T], [AI])
<Badge variant="template" />
<Badge variant="ai" />
<Badge variant="modified" />

// Custom label
<Badge variant="ai">Custom Label</Badge>
```

---

## Color Reference

From `styles.css` design tokens:

| Token | Light | Dark |
|-------|-------|------|
| `--lagoon` | #4fb8b2 | #60d7cf |
| `--lagoon-deep` | #328f97 | #8de5db |
| `--palm` | #2f6a4a | #6ec89a |
| `--chip-bg` | rgba(255,255,255,0.8) | rgba(13,28,32,0.9) |
| `--chip-line` | rgba(47,106,74,0.18) | rgba(141,229,219,0.24) |

---

## Accessibility

- Uses `<span>` element, appropriate for inline content
- High contrast colors for readability
- Screen reader text inherits from content
