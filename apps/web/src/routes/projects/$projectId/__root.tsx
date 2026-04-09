import { createFileRoute } from "@tanstack/react-router";
import { ChatPanel } from "../../../components/workspace/ChatPanel";
import { CodePreviewPanel } from "../../../components/workspace/CodePreviewPanel";
import { FileExplorerPanel } from "../../../components/workspace/FileExplorerPanel";
import { WorkspaceProvider } from "../../../components/workspace/WorkspaceContext";
import { WorkspaceHeader } from "../../../components/workspace/WorkspaceHeader";
import { api } from "../../../lib/api";

export const Route = createFileRoute("/projects/$projectId/__root")({
	loader: async ({ params }) => {
		try {
			const project = await api.projects.get(params.projectId);
			return { project };
		} catch {
			throw new Error("Project not found");
		}
	},
	component: WorkspaceLayout,
});

function WorkspaceLayout() {
	const { project } = Route.useLoaderData();

	const handleDownload = () => {
		// Trigger download via API
		window.open(`/api/projects/${project.id}/download`, "_blank");
	};

	return (
		<WorkspaceProvider project={project}>
			<div className="flex h-[calc(100vh-3.5rem)] flex-col">
				{/* Workspace Header */}
				<WorkspaceHeader onDownload={handleDownload} />

				{/* Three-Panel Layout */}
				<div className="flex flex-1 overflow-hidden">
					{/* Panel Kiri — Chat */}
					<ChatPanel />

					{/* Panel Tengah — Code Preview */}
					<CodePreviewPanel />

					{/* Panel Kanan — File Explorer */}
					<FileExplorerPanel />
				</div>
			</div>
		</WorkspaceProvider>
	);
}
