# ChatBubble Component

**Status:** Planned
**Type:** Component
**Module:** ui-components

---

## Purpose

Chat message bubbles for the workspace chat panel. User messages appear right-aligned (lagoon background), assistant messages appear left-aligned (surface background).

**PRD Reference:** Sections 3.2, 6 (UI — Panel Kiri Chatbot).

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/ui/ChatBubble.tsx` | ChatBubble component |

---

## ChatBubble.tsx

```tsx
import { type HTMLAttributes } from "react";
import { formatDistanceToNow } from "date-fns";

type ChatRole = "user" | "assistant";

export interface ChatBubbleProps extends HTMLAttributes<HTMLDivElement> {
  role: ChatRole;
  content: string;
  timestamp?: Date;
}

function formatTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

export function ChatBubble({
  role,
  content,
  timestamp,
  className = "",
  ...props
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"} ${className}`}
      {...props}
    >
      <div
        className={`rounded-2xl px-4 py-3 text-sm ${
          isUser
            ? "chat-bubble-user rounded-br-md"
            : "chat-bubble-assistant rounded-bl-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
      {timestamp && (
        <span className="text-xs text-[var(--sea-ink-soft)] opacity-70">
          {formatTime(timestamp)}
        </span>
      )}
    </div>
  );
}
```

---

## ChatBubble CSS Classes

Add to `apps/web/src/styles.css`:

```css
/* User bubble — right aligned, lagoon bg */
.chat-bubble-user {
  background: var(--lagoon);
  color: white;
  border-bottom-right-radius: 0.25rem;
}

/* Assistant bubble — left aligned, surface bg */
.chat-bubble-assistant {
  background: var(--surface-strong);
  border: 1px solid var(--line);
  color: var(--sea-ink);
  border-bottom-left-radius: 0.25rem;
}

/* Message container */
.chat-message {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.chat-message.user {
  align-items: flex-end;
}

.chat-message.assistant {
  align-items: flex-start;
}

/* Message animation */
.chat-bubble-animate {
  animation: rise-in 400ms cubic-bezier(0.16, 1, 0.3, 1) both;
}
```

---

## Usage Examples

```tsx
// User message
<ChatBubble
  role="user"
  content="Add products module with CRUD operations"
  timestamp={new Date()}
/>

// Assistant message
<ChatBubble
  role="assistant"
  content="I'll add a products module with the following files:
- apps/api/src/modules/products/products.routes.ts
- apps/api/src/modules/products/products.service.ts
- apps/api/src/modules/products/products.schema.ts

The module will include CRUD operations with proper Zod validation."
  timestamp={new Date()}
/>
```

---

## ChatPanel Layout

For the workspace chat panel:

```tsx
function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex h-10 items-center gap-2 border-b border-[var(--line)] px-4">
        <MessageSquare className="h-4 w-4" />
        <span className="text-sm font-medium">Chat</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex flex-col gap-4">
          {messages.map((msg, i) => (
            <ChatBubble
              key={i}
              role={msg.role}
              content={msg.content}
              timestamp={new Date(msg.created_at)}
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-[var(--line)] p-4">
        <form className="flex flex-col gap-2">
          <textarea
            className="input w-full resize-none"
            placeholder="Describe your changes..."
            rows={3}
          />
          <Button variant="primary" size="sm" className="self-end">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## Dependencies

| Package | Purpose |
|---------|---------|
| `date-fns` | Time formatting (`formatDistanceToNow`) |

Note: Check if `date-fns` is already installed in `apps/web/package.json`. If not, add it.

---

## Accessibility

- Uses semantic `<div>` with appropriate ARIA roles if needed
- Timestamp is visually hidden from some assistive tech but available
- Message content is readable by screen readers
