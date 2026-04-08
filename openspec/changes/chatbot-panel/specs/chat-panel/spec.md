# Chat Panel

**Status:** Planned
**Type:** Component
**Module:** chatbot-panel

---

## Purpose

The chat panel component — displays message history and chat input for the workspace.

**PRD Reference:** Sections 3.1, 3.2, 6.

---

## Files

| File | Purpose |
|------|---------|
| `apps/web/src/components/workspace/ChatPanel.tsx` | Main chat panel |
| `apps/web/src/components/workspace/ChatInput.tsx` | Chat input textarea + send |

---

## ChatPanel.tsx

```tsx
import { useRef, useEffect, useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useWorkspace } from "../workspace-layout/WorkspaceContext";
import { ChatBubble } from "@/components/ui/ChatBubble";
import { ChatInput } from "./ChatInput";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  file_changes?: string[];
  created_at: string;
}

interface ChatPanelProps {
  messages: Message[];
  projectId: string;
  versionId: string;
  onMessagesChange?: (messages: Message[]) => void;
}

export function ChatPanel({
  messages: initialMessages,
  projectId,
  versionId,
  onMessagesChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { setChangedFilePaths } = useWorkspace();

  // Sync external changes
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Refetch messages
  const refetchMessages = async () => {
    const res = await api.projects[":projectId"].messages.$get({
      param: { projectId },
      query: {},
    });
    const json = await res.json();
    setMessages(json.data);
    onMessagesChange?.(json.data);
  };

  const handleSend = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // 1. Save user message
      await api.projects[":projectId"].messages.$post({
        param: { projectId },
        json: { role: "user", content, versionId },
      });

      // Optimistically add user message
      const optimisticUserMsg: Message = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticUserMsg]);

      // 2. Determine if first message (setup) or refine
      const isFirstMessage = messages.length === 0;

      // 3. Trigger generation
      if (isFirstMessage) {
        await api.generate.setup.$post({
          json: { projectId, description: content },
        });
      } else {
        await api.generate.refine.$post({
          json: { projectId, request: content },
        });
      }

      // 4. Refetch all messages (includes AI response)
      await refetchMessages();

      // 5. Update changed files in workspace context
      const latestMsg = messages[messages.length - 1];
      if (latestMsg?.file_changes) {
        setChangedFilePaths(latestMsg.file_changes);
      }
    } catch (error) {
      console.error("Generation failed:", error);
      // TODO: Show error toast
    } finally {
      setIsGenerating(false);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-full flex-col">
      {/* Panel Header */}
      <div className="flex h-10 flex-shrink-0 items-center gap-2 border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
        <MessageSquare className="h-4 w-4 text-[var(--sea-ink-soft)]" />
        <span className="text-sm font-medium text-[var(--sea-ink)]">Chat</span>
        {isGenerating && (
          <Loader2 className="ml-auto h-4 w-4 animate-spin text-[var(--lagoon)]" />
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-auto p-4">
        {!hasMessages ? (
          <WelcomeState />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                role={msg.role}
                content={msg.content}
                timestamp={new Date(msg.created_at)}
              />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--line)] p-4">
        <ChatInput
          onSend={handleSend}
          disabled={isGenerating}
          placeholder={
            hasMessages
              ? "Describe your changes..."
              : "Describe your project in natural language..."
          }
        />
      </div>
    </div>
  );
}

function WelcomeState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
      {/* Moon icon */}
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lagoon)]/10">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-[var(--lagoon)]"
          fill="currentColor"
        >
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[var(--sea-ink)]">
          Welcome to your workspace!
        </h3>
        <p className="mt-1 max-w-xs text-xs text-[var(--sea-ink-soft)]">
          Describe your project in natural language and I'll generate the
          fullstack monorepo for you.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-[var(--line)] bg-[var(--surface)] p-3">
        <p className="text-xs text-[var(--sea-ink-soft)]">
          Try:{" "}
          <span className="italic text-[var(--sea-ink)]">
            "SaaS B2B with users, subscriptions, and dashboard"
          </span>
        </p>
      </div>
    </div>
  );
}
```

---

## ChatInput.tsx

```tsx
import { useState, useRef, useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Describe your changes...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
  };

  const handleSend = async () => {
    if (!value.trim() || disabled || isSending) return;

    setIsSending(true);
    try {
      await onSend(value.trim());
      setValue("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <textarea
        ref={textareaRef}
        className="input w-full resize-none text-sm"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled || isSending}
        autoFocus
      />
      <Button
        variant="primary"
        size="sm"
        onClick={handleSend}
        disabled={!value.trim() || disabled || isSending}
        loading={isSending}
        className="mb-0.5 flex-shrink-0"
        aria-label="Send message"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

## API Integration Notes

The exact RPC client method depends on how chat routes are registered in `apps/api/src/index.ts`. If routes are under `/api/projects/:projectId/messages`, the client methods would be:

```typescript
// List messages
api.projects[":projectId"].messages.$get({ param: { projectId } })

// Create message
api.projects[":projectId"].messages.$post({
  param: { projectId },
  json: { role: "user", content, versionId },
})
```

Verify the exact path during implementation.
