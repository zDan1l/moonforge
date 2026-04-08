# Component Exports

**Status:** Planned
**Type:** Configuration
**Module:** ui-components

---

## Purpose

Centralized exports for all UI components via a single index file. Enables clean imports across the app.

**PRD Reference:** Section 6 (UI — Component usage).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/index.ts` | Component barrel export |

---

## index.ts

```typescript
export { Button } from "./Button";
export type { ButtonProps } from "./Button";

export { Badge } from "./Badge";
export type { BadgeProps } from "./Badge";

export { Card } from "./Card";
export type { CardProps } from "./Card";

export { ChatBubble } from "./ChatBubble";
export type { ChatBubbleProps } from "./ChatBubble";

export { FileTree, FileTreeItem } from "./FileTree";
export type { FileTreeProps, FileTreeItemProps } from "./FileTree";

export { Input } from "./Input";
export type { InputProps } from "./Input";

export { Textarea } from "./Textarea";
export type { TextareaProps } from "./Textarea";
```

---

## Usage

```typescript
// Individual imports
import { Button, Badge, Card } from "@/components/ui";

// Type imports
import type { ButtonProps, BadgeProps } from "@/components/ui";

// Using components
function MyPage() {
  return (
    <Card>
      <Card.Header>
        <Badge variant="generated" />
      </Card.Header>
      <Card.Body>
        <Button variant="primary">Click me</Button>
      </Card.Body>
    </Card>
  );
}
```

---

## Benefits

1. **Clean imports** — Single path for all UI components
2. **Type safety** — Exported types for TypeScript users
3. **Tree-shaking** — Bundler can eliminate unused exports
4. **Discovery** — Easy to see all available components
