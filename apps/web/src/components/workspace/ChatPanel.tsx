/**
 * Chat Panel Component
 *
 * Left panel for AI chat interface.
 * Displays conversation history and allows sending refine requests.
 */

import { Bot, FileText, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "../../lib/api";
import { api } from "../../lib/api";
import { useWorkspace } from "./WorkspaceContext";

export function ChatPanel() {
	const {
		project,
		isGenerating,
		setIsGenerating,
		activeMessageId,
		setActiveMessageId,
		addMessageWithChanges,
	} = useWorkspace();
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const projectId = project?.id || "";

	// Load messages when project changes
	useEffect(() => {
		if (!project) return;

		const loadMessages = async () => {
			try {
				const data = await api.chat.list(project.id, { limit: 50 });
				setMessages(data);
			} catch (error) {
				console.error("Failed to load messages:", error);
			}
		};

		loadMessages();
	}, [project]);

	// Scroll to bottom when messages change
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	const handleSendMessage = async () => {
		if (!input.trim() || isLoading || isGenerating) return;

		const userMessage = input.trim();
		setInput("");
		setIsLoading(true);

		try {
			// Create user message
			const userMsg = await api.chat.create(projectId, {
				role: "user",
				content: userMessage,
			});

			setMessages((prev) => [...prev, userMsg]);

			// Call refine endpoint
			setIsGenerating(true);
			setActiveMessageId(userMsg.id);

			const result = await api.generate.refine({
				projectId,
				request: userMessage,
			});

			// Create assistant message with response
			const assistantMsg = await api.chat.create(projectId, {
				role: "assistant",
				content: result.summary || "Changes applied successfully.",
				versionId: result.versionId,
				fileChanges: result.fileChanges,
			});

			setMessages((prev) => [...prev, assistantMsg]);

			// Track message with file changes
			if (
				result.data.fileChanges &&
				Object.keys(result.data.fileChanges).length > 0
			) {
				addMessageWithChanges(assistantMsg.id);
			}
		} catch (error) {
			console.error("Failed to send message:", error);

			// Add error message
			setMessages((prev) => [
				...prev,
				{
					id: "error",
					project_id: projectId,
					version_id: null,
					role: "assistant",
					content: "Failed to process your request. Please try again.",
					file_changes: null,
					created_at: new Date().toISOString(),
				} as ChatMessage,
			]);
		} finally {
			setIsLoading(false);
			setIsGenerating(false);
			setActiveMessageId(null);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	const handleToggleFileChanges = (messageId: string) => {
		if (activeMessageId === messageId) {
			setActiveMessageId(null);
		} else {
			setActiveMessageId(messageId);
		}
	};

	return (
		<aside className="workspace-panel flex w-80 flex-shrink-0 flex-col border-l border-[var(--line)] bg-[var(--header-bg)]">
			{/* Header */}
			<div className="flex items-center border-b border-[var(--line)] px-4 py-3">
				<h2 className="text-sm font-semibold text-[var(--sea-ink)]">Chat</h2>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-auto p-4">
				{messages.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center text-center">
						<Bot className="mb-3 h-10 w-10 text-[var(--sea-ink-soft)]" />
						<p className="text-sm text-[var(--sea-ink-soft)]">
							{isGenerating
								? "AI is generating your project..."
								: "Start a conversation to refine your project"}
						</p>
					</div>
				) : (
					<div className="space-y-4">
						{messages.map((message) => (
							<div key={message.id}>
								{/* Message */}
								<div
									className={`flex gap-2 ${
										message.role === "user" ? "justify-end" : "justify-start"
									}`}
								>
									{message.role === "assistant" && (
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon)]">
											<Bot className="h-4 w-4 text-white" />
										</div>
									)}
									<div
										className={`max-w-[80%] rounded-lg px-3 py-2 ${
											message.role === "user"
												? "bg-[var(--lagoon)] text-white"
												: "bg-[var(--surface)] text-[var(--sea-ink)]"
										}`}
									>
										<p className="text-sm whitespace-pre-wrap">
											{message.content}
										</p>
									</div>
									{message.role === "user" && (
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--sea-ink-soft)]">
											<User className="h-4 w-4 text-white" />
										</div>
									)}
								</div>

								{/* File Changes */}
								{message.file_changes &&
									Object.keys(message.file_changes).length > 0 && (
										<div className="ml-10 mt-1">
											<button
												type="button"
												onClick={() => handleToggleFileChanges(message.id)}
												className="flex items-center gap-1 rounded px-2 py-1 text-xs text-[var(--sea-ink-soft)] transition hover:bg-[var(--surface)]"
											>
												<FileText className="h-3 w-3" />
												{activeMessageId === message.id ? "Hide" : "Show"}{" "}
												{Object.keys(message.file_changes).length} file change
												{Object.keys(message.file_changes).length > 1
													? "s"
													: ""}
											</button>
											{activeMessageId === message.id && (
												<ul className="ml-4 mt-1 space-y-0.5">
													{Object.entries(message.file_changes).map(
														([fileId, change]) => (
															<li
																key={fileId}
																className="flex items-center gap-2 text-xs text-[var(--sea-ink-soft)]"
															>
																<span
																	className={`capitalize ${
																		change.change === "created"
																			? "text-green-600"
																			: change.change === "deleted"
																				? "text-red-600"
																				: "text-orange-600"
																	}`}
																>
																	{change.change}
																</span>
																<span className="truncate">{change.path}</span>
															</li>
														),
													)}
												</ul>
											)}
										</div>
									)}
							</div>
						))}
						<div ref={messagesEndRef} />
					</div>
				)}
			</div>

			{/* Chat Input */}
			<div className="border-t border-[var(--line)] p-3">
				<textarea
					className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)]"
					placeholder={
						isGenerating || isLoading
							? "Processing in progress..."
							: "Type your message..."
					}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={handleKeyDown}
					rows={3}
					disabled={isGenerating || isLoading}
				/>
				<div className="mt-2 flex justify-end">
					<button
						type="button"
						onClick={handleSendMessage}
						disabled={!input.trim() || isGenerating || isLoading}
						className="flex items-center gap-1.5 rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
					>
						{isGenerating || isLoading ? (
							<>
								<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
								Sending...
							</>
						) : (
							<>
								<Send className="h-4 w-4" />
								Send
							</>
						)}
					</button>
				</div>
			</div>
		</aside>
	);
}
