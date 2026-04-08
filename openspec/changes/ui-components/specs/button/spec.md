# Button Component

**Status:** Planned
**Type:** Component
**Module:** ui-components

---

## Purpose

Reusable button component with variants (primary, secondary, ghost), sizes, and loading state.

**PRD Reference:** Section 6 (UI — Tiga Panel Workspace).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/Button.tsx` | Button component |
| `apps/web/src/styles.css` | Button utility classes |

---

## Button.tsx

```tsx
import { type ReactNode, type ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={`btn ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
```

---

## Button CSS Classes

Add to `apps/web/src/styles.css`:

```css
/* Button base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  border-radius: 9999px;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Primary variant */
.btn-primary {
  background: var(--lagoon);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--lagoon-deep);
  transform: translateY(-0.5px);
}

/* Secondary variant */
.btn-secondary {
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--sea-ink);
}

.btn-secondary:hover:not(:disabled) {
  border-color: var(--lagoon-deep);
  background: var(--surface-strong);
}

/* Ghost variant */
.btn-ghost {
  background: transparent;
  color: var(--sea-ink-soft);
}

.btn-ghost:hover:not(:disabled) {
  background: var(--surface);
  color: var(--sea-ink);
}

/* Sizes */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8125rem;
}

.btn-md {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-lg {
  padding: 0.625rem 1.25rem;
  font-size: 1rem;
}
```

---

## Usage Examples

```tsx
// Primary button
<Button variant="primary" onClick={handleClick}>
  New Project
</Button>

// Secondary button with loading
<Button variant="secondary" loading={isLoading}>
  Generating...
</Button>

// Ghost button (icon buttons)
<Button variant="ghost" size="sm" aria-label="Close">
  <X className="h-4 w-4" />
</Button>

// Full width button
<Button variant="primary" className="w-full">
  Create Project
</Button>
```

---

## Accessibility

- Uses native `<button>` element
- `disabled` state prevents interaction and is communicated to assistive tech
- `loading` state shows spinner, indicates async operation
- `aria-label` should be provided for icon-only buttons
