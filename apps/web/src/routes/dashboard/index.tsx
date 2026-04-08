import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import { api, type Project } from "#/lib/api-client";
import { formatDate } from "#/lib/utils";

export const Route = createFileRoute("/dashboard/")({
	component: DashboardIndex,
});

function DashboardIndex() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: projects, isLoading } = useQuery({
		queryKey: ["projects"],
		queryFn: api.getProjects,
	});

	const deleteProject = useMutation({
		mutationFn: api.deleteProject,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projects"] });
		},
	});

	const statusVariants: Record<
		Project["status"],
		{ variant: Parameters<typeof Badge>[0]["variant"]; label: string }
	> = {
		PENDING: { variant: "default", label: "Pending" },
		PREVIEWING: { variant: "info", label: "Previewing" },
		GENERATING: { variant: "warning", label: "Generating" },
		GENERATED: { variant: "success", label: "Ready" },
		MODIFIED: { variant: "info", label: "Modified" },
		FAILED: { variant: "error", label: "Failed" },
	};

	return (
		<main className="page-wrap py-8">
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="animate-spin h-8 w-8 border-4 border-[var(--lagoon)] border-t-transparent rounded-full" />
				</div>
			) : !projects || projects.length === 0 ? (
				<div className="text-center py-12">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--surface)] mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-8 w-8 text-[var(--sea-ink-soft)]"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
							/>
						</svg>
					</div>
					<h2 className="text-xl font-semibold text-[var(--sea-ink)] mb-2">
						No projects yet
					</h2>
					<p className="text-[var(--sea-ink-soft)] mb-6">
						Create your first AI-generated workspace
					</p>
					<Button onClick={() => navigate({ to: "/dashboard/new" })}>
						Create Project
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((project) => {
						const status = statusVariants[project.status];
						return (
							<Card
								key={project.id}
								variant="elevated"
								className="group hover:shadow-xl transition-all"
							>
								<CardHeader>
									<div className="flex items-start justify-between">
										<div className="flex-1 min-w-0">
											<CardTitle className="truncate">
												{project.name}
											</CardTitle>
											<CardDescription className="mt-1 line-clamp-2">
												{project.description}
											</CardDescription>
										</div>
										<Badge variant={status.variant}>{status.label}</Badge>
									</div>
								</CardHeader>
								<CardContent>
									<div className="text-sm text-[var(--sea-ink-soft)]">
										Created {formatDate(project.createdAt)}
									</div>
								</CardContent>
								<CardFooter className="gap-2">
									<Button
										size="sm"
										variant="secondary"
										className="flex-1"
										onClick={() =>
											navigate({
												to: "/project/$id/generate",
												params: { id: project.id },
											})
										}
									>
										{project.status === "GENERATED" ||
										project.status === "MODIFIED"
											? "Open"
											: "View"}
									</Button>
									{project.status === "FAILED" && (
										<Button
											size="sm"
											variant="danger"
											onClick={() => {
												if (confirm("Delete this project?")) {
													deleteProject.mutate(project.id);
												}
											}}
										>
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
													d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
												/>
											</svg>
										</Button>
									)}
								</CardFooter>
							</Card>
						);
					})}
				</div>
			)}
		</main>
	);
}
