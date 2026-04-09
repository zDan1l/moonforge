import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/$projectId/")({
	beforeLoad: () => {
		// Redirect to chat tab by default (future: add tab state)
		// For now, just stay on the workspace page
	},
	component: WorkspaceHome,
});

function WorkspaceHome() {
	// The three-panel layout is in the parent route (__root.tsx)
	// This component can be used for future workspace-specific content
	return null;
}
