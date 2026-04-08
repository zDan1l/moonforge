import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { api } from "#/lib/api-client";

export const Route = createFileRoute("/dashboard/new")({
	component: NewProject,
});

function NewProject() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [prompt, setPrompt] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const createProject = useMutation({
		mutationFn: api.createProject,
		onSuccess: (project) => {
			setIsSubmitted(true);
			setTimeout(() => {
				queryClient.invalidateQueries({ queryKey: ["projects"] });
				navigate({ to: "/project/$id/generate", params: { id: project.id } });
			}, 1500);
		},
		onError: (err: Error) => {
			console.error("Failed to create project:", err);
			setIsSubmitted(false);
			alert("Failed to create project: " + err.message);
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!prompt.trim()) return;

		setIsSubmitted(true);

		// Generate name dari prompt (ambil 50 karakter pertama)
		const name = prompt.trim().slice(0, 50) + (prompt.length > 50 ? "..." : "");

		createProject.mutate({
			name: name,
			description: prompt.trim(),
		});
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	// Loading state - menampilkan pesan setelah submit
	if (isSubmitted && createProject.isPending) {
		return (
			<div className="h-full flex items-center justify-center p-6">
				<div className="text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--lagoon)]/10 mb-6">
						<div className="animate-spin h-8 w-8 border-3 border-[var(--lagoon)] border-t-transparent rounded-full" />
					</div>
					<p className="text-[var(--sea-ink)] font-medium mb-2">Creating your workspace...</p>
					<p className="text-sm text-[var(--sea-ink-soft)]">This will only take a moment</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			{/* Welcome Message */}
			<div className="flex-1 flex items-center justify-center px-6">
				<div className="w-full max-w-2xl text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--lagoon)]/10 mb-6">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-[var(--lagoon)]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
							/>
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-[var(--sea-ink)] mb-3">
						What do you want to build?
					</h1>
					<p className="text-[var(--sea-ink-soft)] text-lg mb-8">
						Describe your workspace idea and AI will generate it for you
					</p>

					{/* Example Prompts */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 text-left">
						<button
							type="button"
							onClick={() => setPrompt("Build a SaaS for property management with tenant tracking, rent collection, and maintenance requests")}
							className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-colors text-left group"
						>
							<div className="text-sm font-medium text-[var(--sea-ink)] mb-1">
								Property Management SaaS
							</div>
							<div className="text-xs text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors">
								Tenant tracking, rent collection, maintenance
							</div>
						</button>
						<button
							type="button"
							onClick={() => setPrompt("Build an e-commerce platform with product catalog, shopping cart, checkout, and order management")}
							className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-colors text-left group"
						>
							<div className="text-sm font-medium text-[var(--sea-ink)] mb-1">
								E-commerce Platform
							</div>
							<div className="text-xs text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors">
								Catalog, cart, checkout, orders
							</div>
						</button>
						<button
							type="button"
							onClick={() => setPrompt("Build a task management app like Trello with boards, lists, cards, drag-and-drop, and team collaboration")}
							className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-colors text-left group"
						>
							<div className="text-sm font-medium text-[var(--sea-ink)] mb-1">
								Task Management App
							</div>
							<div className="text-xs text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors">
								Boards, lists, cards, collaboration
							</div>
						</button>
						<button
							type="button"
							onClick={() => setPrompt("Build a blog platform with markdown editor, categories, tags, comments, and SEO optimization")}
							className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] hover:bg-[var(--surface-strong)] transition-colors text-left group"
						>
							<div className="text-sm font-medium text-[var(--sea-ink)] mb-1">
								Blog Platform
							</div>
							<div className="text-xs text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)] transition-colors">
								Markdown editor, comments, SEO
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Input Area - Fixed Bottom */}
			<div className="border-t border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-sm p-4">
				<form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
					<div className="relative flex items-end gap-3">
						<div className="flex-1 relative">
							<textarea
								value={prompt}
								onChange={(e) => setPrompt(e.target.value)}
								onKeyDown={handleKeyPress}
								placeholder="Describe your workspace idea... (Press Enter to send, Shift+Enter for new line)"
								rows={1}
								className="w-full px-4 py-3 pr-12 rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)] focus:border-transparent resize-none transition-all"
								style={{
									minHeight: "48px",
									maxHeight: "200px",
								}}
								onInput={(e) => {
									const target = e.target as HTMLTextAreaElement;
									target.style.height = "auto";
									target.style.height = Math.min(target.scrollHeight, 200) + "px";
								}}
							/>
							<div className="absolute right-3 bottom-3 text-xs text-[var(--sea-ink-soft)]">
								{prompt.length > 0 && (
									<span>
										{prompt.length} chars
									</span>
								)}
							</div>
						</div>
						<button
							type="submit"
							disabled={!prompt.trim() || createProject.isPending}
							className="px-5 py-3 rounded-xl bg-[var(--lagoon)] text-white font-medium hover:bg-[var(--lagoon-deep)] disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 h-[48px]"
						>
							{createProject.isPending ? (
								<div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
							) : (
								<>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
										/>
									</svg>
									Send
								</>
							)}
						</button>
					</div>
					<p className="text-xs text-center text-[var(--sea-ink-soft)] mt-3">
						AI will generate a full Moon monorepo based on your description
					</p>
				</form>
			</div>
		</div>
	);
}
