/**
 * Chat Panel Component (Placeholder)
 *
 * Left panel for AI chat interface.
 * TODO: Will be implemented in chatbot-panel spec
 */

import { MessageSquare } from "lucide-react";
import { useWorkspace } from "./WorkspaceContext";

export function ChatPanel() {
	const { isGenerating } = useWorkspace();

	return (
		<aside className="workspace-panel flex w-80 flex-shrink-0 flex-col border-r border-[var(--line)] bg-[var(--header-bg)]">
			<div className="flex items-center border-b border-[var(--line)] px-4 py-3">
				<h2 className="text-sm font-semibold text-[var(--sea-ink)]">Chat</h2>
			</div>
			<div className="flex-1 overflow-auto p-4">
				<div className="flex h-full flex-col items-center justify-center text-center">
					<MessageSquare className="mb-3 h-10 w-10 text-[var(--sea-ink-soft)]" />
					<p className="text-sm text-[var(--sea-ink-soft)]">
						{isGenerating
							? "AI is generating your project..."
							: "Start a conversation to refine your project"}
					</p>
				</div>
			</div>
			{/* Chat Input */}
			<div className="border-t border-[var(--line)] p-3">
				<textarea
					className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)]"
					placeholder={
						isGenerating ? "Generating in progress..." : "Type your message..."
					}
					rows={3}
					disabled={isGenerating}
				/>
				<div className="mt-2 flex justify-end">
					<button
						type="button"
						disabled={isGenerating}
						className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isGenerating ? (
							<>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
								Sending...
							</>
						) : (
							"Send"
						)}
					</button>
				</div>
			</div>
		</aside>
	);
}
