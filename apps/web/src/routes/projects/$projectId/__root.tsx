import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Code, FileText, MessageSquare } from "lucide-react";
import { api } from "../../../lib/api";

export const Route = createFileRoute("/projects/$projectId/")({
	loader: async ({ params }) => {
		const project = await api.projects.get(params.projectId);
		return { project };
	},
	component: WorkspaceLayout,
});

function WorkspaceLayout() {
	const { project } = Route.useLoaderData();

	return (
		<div className="flex h-[calc(100vh-3.5rem)] flex-col">
			{/* Workspace Header */}
			<div className="flex h-12 items-center justify-between border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
				<div className="flex items-center gap-3">
					<Link
						to="/projects"
						className="flex items-center gap-1 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)]"
					>
						<ArrowLeft className="h-4 w-4" />
						<span>Back</span>
					</Link>
					<span className="text-[var(--line)]">|</span>
					<h1 className="text-sm font-semibold text-[var(--sea-ink)]">
						{project.name}
					</h1>
				</div>

				{/* Tab Navigation */}
				<div className="flex items-center gap-1 rounded-lg bg-[var(--surface)] p-1">
					<button
						type="button"
						className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--sea-ink-soft)] transition hover:bg-[var(--surface-strong)]"
					>
						<MessageSquare className="h-4 w-4" />
						Chat
					</button>
					<button
						type="button"
						className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--sea-ink-soft)] transition hover:bg-[var(--surface-strong)]"
					>
						<Code className="h-4 w-4" />
						Code
					</button>
					<button
						type="button"
						className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-[var(--sea-ink-soft)] transition hover:bg-[var(--surface-strong)]"
					>
						<FileText className="h-4 w-4" />
						Files
					</button>
				</div>
			</div>

			{/* Three-Panel Layout */}
			<div className="flex flex-1 overflow-hidden">
				{/* Panel Kiri — Chat */}
				<aside className="flex w-80 flex-shrink-0 flex-col border-r border-[var(--line)] bg-[var(--header-bg)]">
					<div className="flex items-center border-b border-[var(--line)] px-4 py-3">
						<h2 className="text-sm font-semibold text-[var(--sea-ink)]">
							Chat
						</h2>
					</div>
					<div className="flex-1 overflow-auto p-4">
						<div className="flex h-full flex-col items-center justify-center text-center">
							<MessageSquare className="mb-3 h-10 w-10 text-[var(--sea-ink-soft)]" />
							<p className="text-sm text-[var(--sea-ink-soft)]">
								Start a conversation to refine your project
							</p>
						</div>
					</div>
					{/* Chat Input */}
					<div className="border-t border-[var(--line)] p-3">
						<textarea
							className="w-full resize-none rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm text-[var(--sea-ink)] placeholder-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-1 focus:ring-[var(--lagoon)]"
							placeholder="Type your message..."
							rows={3}
						/>
						<div className="mt-2 flex justify-end">
							<button
								type="button"
								className="rounded-full bg-[var(--lagoon)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
							>
								Send
							</button>
						</div>
					</div>
				</aside>

				{/* Panel Tengah — Code Preview */}
				<main className="flex flex-1 flex-col overflow-hidden bg-[var(--sand)]">
					<div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2">
						<span className="text-sm font-medium text-[var(--sea-ink)]">
							Code Preview
						</span>
						<span className="text-xs text-[var(--sea-ink-soft)]">
							Select a file from the explorer
						</span>
					</div>
					<div className="flex flex-1 items-center justify-center">
						<div className="text-center">
							<Code className="mx-auto mb-3 h-12 w-12 text-[var(--sea-ink-soft)]" />
							<p className="text-[var(--sea-ink-soft)]">
								Select a file to preview its contents
							</p>
						</div>
					</div>
				</main>

				{/* Panel Kanan — File Explorer */}
				<aside className="flex w-72 flex-shrink-0 flex-col border-l border-[var(--line)] bg-[var(--header-bg)]">
					<div className="flex items-center border-b border-[var(--line)] px-4 py-3">
						<h2 className="text-sm font-semibold text-[var(--sea-ink)]">
							Files
						</h2>
					</div>
					<div className="flex-1 overflow-auto p-2">
						<div className="py-2 text-center text-sm text-[var(--sea-ink-soft)]">
							<p>No files yet</p>
							<p className="mt-1 text-xs">Generate your project to see files</p>
						</div>
					</div>
				</aside>
			</div>
		</div>
	);
}
