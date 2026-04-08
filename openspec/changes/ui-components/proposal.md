## Why

MoonForge needs a shared component library that matches the existing design tokens and PRD Section 6 (UI — Tiga Panel Workspace). These components will be used across all pages: landing, project list, and the three-panel workspace.

**PRD Reference:** Sections 4 (Tech Stack), 6 (UI — Tiga Panel Workspace), 7 (MVP Scope).

## Capabilities

### New Capabilities

- `ui-button`: Primary, secondary, ghost variants with loading state
- `ui-input`: Text input with label, error state
- `ui-card`: Elevated card with optional header and footer
- `ui-badge`: Status badges (draft, generated, refined)
- `ui-chat-bubble`: Chat message bubbles for user/assistant
- `ui-file-tree`: File tree with icons, badges (T/AI/modified)
- `ui-textarea`: Multi-line chat input for workspace

## Impact

**Affected Code:**

- `apps/web/src/components/ui/` — New; shared UI components
- `apps/web/src/styles.css` — Extend with component-specific classes
- `apps/web/src/routes/` — Use components in routes

**Dependencies:**

| Component | Used In |
|-----------|---------|
| `Button` | Project list, workspace, forms |
| `Card` | Project list, file tree |
| `Badge` | Project status, file source labels |
| `ChatBubble` | Workspace chat panel |
| `FileTree` | Workspace file explorer |
| `Textarea` | Chat input in workspace |

## Design Token Reference

Existing tokens from `styles.css`:

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--sea-ink` | #173a40 | #d7ece8 | Primary text |
| `--lagoon` | #4fb8b2 | #60d7cf | Primary accent |
| `--palm` | #2f6a4a | #6ec89a | Success states |
| `--sand` | #e7f0e8 | #0f1a1e | Background |
| `--foam` | #f3faf5 | #101d22 | Surface |
| `--line` | rgba(...) | rgba(...) | Borders |

## Out of Scope (Separate Specs)

- Full component library with all form controls — MVP uses minimal set
- Storybook documentation — post-MVP
- Dark mode toggle component — already in `__root.tsx`

---

## Button Component

```tsx
import { type ReactNode, type ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: ReactNode;
}

// Usage:
// <Button variant="primary" size="md" onClick={handleClick}>
//   New Project
// </Button>

// <Button variant="secondary" loading={isLoading}>
//   Generating...
// </Button>
```

**Variants:**

- `primary` — `--lagoon` background, white text
- `secondary` — transparent, border, `--sea-ink` text
- `ghost` — transparent, no border, `--sea-ink-soft` text, hover background

## Input Component

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// Usage:
// <Input
//   label="Project Name"
//   placeholder="My SaaS App"
//   error={errors.name}
// />
```

## Card Component

```tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

// Usage:
// <Card hoverable>
//   <Card.Header>Project Name</Card.Header>
//   <Card.Body>Description...</Card.Body>
//   <Card.Footer>Actions</Card.Footer>
// </Card>
```

## Badge Component

```tsx
type BadgeVariant = "draft" | "generated" | "refined" | "template" | "ai" | "modified";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

// Usage:
// <Badge variant="draft">Draft</Badge>
// <Badge variant="ai">[AI]</Badge>
// <Badge variant="template">[T]</Badge>
```

**Color mapping:**

- `draft` — gray chip
- `generated` — palm/palm-deep
- `refined` — lagoon
- `template` — chip-bg + chip-line (PRD [T])
- `ai` — lagoon tint (PRD [AI])
- `modified` — different color for modified files

## ChatBubble Component

```tsx
interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

// Usage:
// <ChatBubble role="user" content="Add products module" />
// <ChatBubble role="assistant" content="I'll add the products..." />
```

## FileTreeItem Component

```tsx
interface FileTreeItemProps {
  name: string;
  path: string;
  fileSource: "template" | "ai_generated" | "modified";
  isActive?: boolean;
  onClick?: (path: string) => void;
}

// Usage:
// <FileTreeItem
//   name="schema.prisma"
//   path="apps/api/prisma/schema.prisma"
//   fileSource="ai_generated"
//   isActive={true}
// />
```

## Textarea Component (Chat Input)

```tsx
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

// Usage:
// <Textarea
//   placeholder="Describe your project needs..."
//   rows={3}
// />
```

## Out of Scope (Separate Specs)

- Dropdown, Select components — deferred post-MVP
- Modal / Dialog — deferred post-MVP
- Data table for project list — deferred post-MVP
- Syntax highlighting in code preview — deferred to UI Components spec (can add later)
