import { createFileRoute, useNavigate, Outlet } from "@tanstack/react-router";
import { Button } from "#/components/ui/button";

export const Route = createFileRoute("/dashboard")({
	component: DashboardLayout,
});

function DashboardLayout() {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen bg-[var(--bg-base)]">
			{/* Header */}
			<header className="border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-sm sticky top-0 z-10">
				<div className="page-wrap py-4 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold text-[var(--sea-ink)]">
							MoonForge
						</h1>
						<p className="text-sm text-[var(--sea-ink-soft)]">
							AI Workspace Generator
						</p>
					</div>
					<Button onClick={() => navigate({ to: "/dashboard/new" })}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 4v16m8-8H4"
							/>
						</svg>
						New Project
					</Button>
				</div>
			</header>

			{/* Outlet untuk child routes */}
			<Outlet />
		</div>
	);
}
