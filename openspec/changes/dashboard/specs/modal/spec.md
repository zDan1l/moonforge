# Modal Component

**Status:** Planned
**Type:** Component
**Module:** dashboard (ui sub-component)

---

## Purpose

Reusable modal dialog component for the Create Project form. Provides a clean overlay with backdrop, focus trap, and keyboard support.

**PRD Reference:** Section 3.1 (New Project flow — no wizard multi-step).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/Modal.tsx` | Modal component |

---

## Modal.tsx

```tsx
import { type ReactNode, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Handle open/close state
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else {
      dialog.close();
      previousActiveElement.current?.focus();
    }
  }, [open]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Handle Escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      className="modal-backdrop"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      <div className="modal-content" role="document">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="modal-close"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="modal-body">{children}</div>

        {/* Footer */}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </dialog>
  );
}
```

---

## Modal CSS Classes

Add to `apps/web/src/styles.css`:

```css
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop::backdrop {
  background: rgba(23, 58, 64, 0.4);
  backdrop-filter: blur(4px);
}

/* Content */
.modal-content {
  width: min(480px, calc(100% - 2rem));
  background: var(--surface-strong);
  border: 1px solid var(--line);
  border-radius: 1.5rem;
  box-shadow:
    0 1px 0 var(--inset-glint) inset,
    0 24px 48px rgba(30, 90, 72, 0.15),
    0 8px 24px rgba(23, 58, 64, 0.12);
  animation: modal-in 250ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--line);
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--sea-ink);
  margin: 0;
}

.modal-close {
  padding: 0.375rem;
  border-radius: 0.5rem;
}

/* Body */
.modal-body {
  padding: 1.5rem;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--line);
}
```

---

## Usage Example

```tsx
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>
        New Project
      </Button>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-form">
              Create Project
            </Button>
          </>
        }
      >
        <CreateProjectForm
          onSuccess={(project) => {
            setIsModalOpen(false);
            router.navigate({ to: `/projects/${project.id}` });
          }}
        />
      </Modal>
    </>
  );
}
```

---

## Accessibility

- Uses native `<dialog>` element for proper modal semantics
- Focus trap keeps keyboard navigation inside modal
- `Escape` key closes modal
- Backdrop click closes modal
- Focus returns to trigger element on close
- `aria-modal="true"` on dialog
- `role="dialog"` on content

## Dark Mode

Modal content uses existing design tokens — no additional dark mode handling needed. The `.modal-backdrop::backdrop` pseudo-element adapts via CSS variables.
