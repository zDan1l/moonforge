/**
 * File Explorer Panel Component (Placeholder)
 *
 * Right panel for displaying project file tree.
 * TODO: Will be implemented in file-explorer-panel spec
 */

import { FileText } from "lucide-react";
import type { ProjectFile } from "../../lib/api";
import { useWorkspace } from "./WorkspaceContext";

export function FileExplorerPanel() {
	const { selectedFile, setSelectedFile, project } = useWorkspace();

	// Temporary mock file tree - will be replaced with actual API data
	const mockFiles: ProjectFile[] =
		project?._count && project._count.files > 0
			? [
					{
						id: "1",
						path: "apps/api/src/index.ts",
						content: "",
						updated_at: new Date().toISOString(),
					},
				]
			: [];

	return (
		<aside className="workspace-panel flex w-72 flex-shrink-0 flex-col border-l border-[var(--line)] bg-[var(--header-bg)]">
			<div className="flex items-center border-b border-[var(--line)] px-4 py-3">
				<h2 className="text-sm font-semibold text-[var(--sea-ink)]">Files</h2>
			</div>
			<div className="flex-1 overflow-auto p-2">
				{mockFiles.length === 0 ? (
					<div className="py-8 text-center text-sm text-[var(--sea-ink-soft)]">
						<FileText className="mx-auto mb-2 h-8 w-8 text-[var(--sea-ink-soft)]" />
						<p>No files yet</p>
						<p className="mt-1 text-xs">Generate your project to see files</p>
					</div>
				) : (
					<ul className="space-y-1">
						{mockFiles.map((file) => (
							<li key={file.id}>
								<button
									type="button"
									onClick={() => setSelectedFile(file)}
									className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-[var(--surface)] ${
										selectedFile?.id === file.id
											? "bg-[var(--surface-strong)] text-[var(--sea-ink)]"
											: "text-[var(--sea-ink-soft)]"
									}`}
								>
									<FileText className="h-4 w-4 shrink-0" />
									<span className="truncate">{file.path}</span>
								</button>
							</li>
						))}
					</ul>
				)}
			</div>
		</aside>
	);
}
