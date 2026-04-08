# Card Component

**Status:** Planned
**Type:** Component
**Module:** ui-components

---

## Purpose

Card container component with optional header, body, and footer sections. Uses existing `.island-shell` and `.feature-card` patterns from `styles.css`.

**PRD Reference:** Section 6 (UI — Project list cards).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/Card.tsx` | Card component with compound pattern |

---

## Card.tsx

```tsx
import { type HTMLAttributes, type ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: ReactNode;
}

function Card({ hoverable, children, className = "", ...props }: CardProps) {
  const baseClass = hoverable ? "feature-card" : "island-shell";
  return (
    <div className={`${baseClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardHeader({ children, className = "", ...props }: CardHeaderProps) {
  return (
    <div className={`mb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardBody({ children, className = "", ...props }: CardBodyProps) {
  return (
    <div className={`text-sm text-[var(--sea-ink-soft)] ${className}`} {...props}>
      {children}
    </div>
  );
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

function CardFooter({ children, className = "", ...props }: CardFooterProps) {
  return (
    <div
      className={`mt-3 border-t border-[var(--line)] pt-3 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card };
export type { CardProps };
```

---

## Card CSS Classes

Uses existing classes from `styles.css`:

- `.island-shell` — default card base with border, shadow, backdrop blur
- `.feature-card` — hoverable card with lift effect on hover

Additional utility classes:

```css
/* Card sections (using utility classes, no new CSS needed) */
.card-header {
  margin-bottom: 0.75rem;
}

.card-body {
  font-size: 0.875rem;
  color: var(--sea-ink-soft);
}

.card-footer {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--line);
}
```

---

## Usage Examples

```tsx
// Basic card
<Card>
  <Card.Header>
    <h3>Project Name</h3>
  </Card.Header>
  <Card.Body>
    <p>Project description...</p>
  </Card.Body>
</Card>

// Hoverable card with footer
<Card hoverable>
  <Card.Header>
    <div className="flex items-center justify-between">
      <h3>My SaaS App</h3>
      <Badge variant="generated" />
    </div>
  </Card.Header>
  <Card.Body>
    SaaS B2B with users, subscriptions, and dashboard.
  </Card.Body>
  <Card.Footer>
    <span>3 versions</span>
    <Link href={`/projects/${id}`}>Open</Link>
  </Card.Footer>
</Card>
```

---

## Compound Component Pattern

Card uses the compound component pattern where sub-components (`Header`, `Body`, `Footer`) are attached as properties:

```tsx
<Card>
  <Card.Header>...</Card.Header>
  <Card.Body>...</Card.Body>
  <Card.Footer>...</Card.Footer>
</Card>
```

**Benefits:**
- Clear semantic structure in JSX
- Each sub-component has its own styled defaults
- Easy to customize via className override
- No prop drilling for section-specific styles
