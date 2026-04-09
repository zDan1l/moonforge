import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/projects/__root")({
	component: ProjectsLayout,
});

function ProjectsLayout() {
	return (
		<div className="min-h-[calc(100vh-3.5rem)]">
			<Outlet />
		</div>
	);
}
