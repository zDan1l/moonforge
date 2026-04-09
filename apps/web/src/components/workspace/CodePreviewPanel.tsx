/**
 * Code Preview Panel Component (Placeholder)
 *
 * Middle panel for displaying file contents.
 * TODO: Will be implemented in code-preview-panel spec
 */

import { Code } from "lucide-react";
import { useWorkspace } from "./WorkspaceContext";

export function CodePreviewPanel() {
	const { selectedFile } = useWorkspace();

	return (
		<main className="workspace-panel flex flex-1 flex-col overflow-hidden bg-[var(--sand)]">
			<div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2">
				<span className="text-sm font-medium text-[var(--sea-ink)]">
					Code Preview
				</span>
				{selectedFile && (
					<span className="text-xs text-[var(--sea-ink-soft)]">
						{selectedFile.path}
					</span>
				)}
			</div>
			<div className="flex flex-1 items-center justify-center">
				{selectedFile ? (
					<pre className="h-full w-full overflow-auto p-4 text-sm text-[var(--sea-ink)]">
						<code>{selectedFile.content}</code>
					</pre>
				) : (
					<div className="text-center">
						<Code className="mx-auto mb-3 h-12 w-12 text-[var(--sea-ink-soft)]" />
						<p className="text-[var(--sea-ink-soft)]">
							Select a file to preview its contents
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
