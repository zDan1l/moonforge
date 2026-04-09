import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../lib/api";

export const Route = createFileRoute("/projects/$projectId/files/$path")({
	loader: async ({ params }) => {
		const file = await api.files.get(params.projectId, params.path);
		return { file };
	},
	component: FilePreviewPage,
});

function FilePreviewPage() {
	const { file } = Route.useLoaderData();

	return (
		<div className="h-full overflow-auto bg-[var(--sand)]">
			<div className="p-4">
				<div className="mb-2 flex items-center justify-between">
					<h2 className="font-mono text-sm font-medium text-[var(--sea-ink)]">
						{file.path}
					</h2>
					<span
						className={`rounded px-2 py-0.5 text-xs font-medium ${
							file.file_source === "template"
								? "bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] border border-[var(--chip-line)]"
								: "bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] border border-[var(--lagoon)]/30"
						}`}
					>
						{file.file_source === "template"
							? "[T]"
							: file.file_source === "ai_generated"
								? "[AI]"
								: "[Modified]"}
					</span>
				</div>
				<pre className="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4 font-mono text-xs text-[var(--sea-ink)] overflow-x-auto">
					<code>{file.content}</code>
				</pre>
			</div>
		</div>
	);
}
