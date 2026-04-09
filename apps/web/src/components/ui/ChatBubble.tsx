import type { ReactNode } from "react";

export interface ChatBubbleProps {
	role: "user" | "assistant";
	content: ReactNode;
	timestamp?: Date;
	className?: string;
}

function formatTime(date: Date): string {
	return date.toLocaleTimeString("en-US", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function ChatBubble({
	role,
	content,
	timestamp,
	className = "",
}: ChatBubbleProps) {
	const isUser = role === "user";

	return (
		<div
			className={`flex ${isUser ? "justify-end" : "justify-start"} ${className}`}
		>
			<div
				className={`max-w-[80%] animate-[rise-in_300ms_ease-out] ${
					isUser
						? "order-2 rounded-2xl rounded-br-md bg-[var(--lagoon)] px-4 py-2.5 text-white"
						: "order-1 rounded-2xl rounded-bl-md border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-[var(--sea-ink)]"
				}`}
			>
				<div className="text-sm leading-relaxed">{content}</div>
				{timestamp && (
					<div
						className={`mt-1 text-[10px] ${
							isUser ? "text-white/60" : "text-[var(--sea-ink-soft)]"
						}`}
					>
						{formatTime(timestamp)}
					</div>
				)}
			</div>
		</div>
	);
}

// Chat message container for scrollable list
export interface ChatMessageListProps {
	children: ReactNode;
	className?: string;
}

export function ChatMessageList({
	children,
	className = "",
}: ChatMessageListProps) {
	return (
		<div className={`flex flex-col gap-3 overflow-y-auto p-4 ${className}`}>
			{children}
		</div>
	);
}

// Empty state for chat
export interface ChatEmptyStateProps {
	message?: string;
	className?: string;
}

export function ChatEmptyState({
	message = "Start a conversation to refine your project",
	className = "",
}: ChatEmptyStateProps) {
	return (
		<div
			className={`flex h-full flex-col items-center justify-center text-center ${className}`}
		>
			<svg
				className="mb-3 h-10 w-10 text-[var(--sea-ink-soft)]"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.5}
					d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
				/>
			</svg>
			<p className="text-sm text-[var(--sea-ink-soft)]">{message}</p>
		</div>
	);
}
