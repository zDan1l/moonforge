import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCode, FolderOpen, Plus } from "lucide-react";
import { api, type Project } from "../../lib/api";

export const Route = createFileRoute("/projects/")({
	component: ProjectListPage,
	loader: async () => {
		try {
			const projects = await api.projects.list();
			return { projects };
		} catch {
			return { projects: [] as Project[] };
		}
	},
});

function ProjectListPage() {
	const { projects } = Route.useLoaderData();

	return (
		<div className="page-wrap px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
					Your Projects
				</h1>
				<button
					type="button"
					className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
				>
					<Plus className="h-4 w-4" />
					New Project
				</button>
			</div>

			{projects.length === 0 ? (
				<div className="island-shell flex flex-col items-center justify-center rounded-2xl p-12 text-center">
					<FolderOpen className="mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
					<h2 className="mb-2 text-lg font-semibold text-[var(--sea-ink)]">
						No projects yet
					</h2>
					<p className="mb-6 max-w-sm text-sm text-[var(--sea-ink-soft)]">
						Create your first project to get started with MoonForge. Describe
						your needs in natural language and let AI build your monorepo.
					</p>
					<button
						type="button"
						className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
					>
						<Plus className="h-4 w-4" />
						Create First Project
					</button>
				</div>
			) : (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{projects.map((project) => (
						<Link
							key={project.id}
							to="/projects/$projectId"
							params={{ projectId: project.id }}
							className="island-shell feature-card group block rounded-2xl p-5 no-underline transition hover:-translate-y-0.5"
						>
							<div className="mb-3 flex items-start justify-between">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lagoon)]/10">
									<FileCode className="h-5 w-5 text-[var(--lagoon-deep)]" />
								</div>
								<StatusBadge status={project.status} />
							</div>
							<h3 className="mb-1 truncate text-base font-semibold text-[var(--sea-ink)]">
								{project.name}
							</h3>
							<p className="mb-3 line-clamp-2 text-sm text-[var(--sea-ink-soft)]">
								{project.description}
							</p>
							<div className="flex items-center gap-4 text-xs text-[var(--sea-ink-soft)]">
								<span>
									{project._count?.versions ?? 0} version
									{(project._count?.versions ?? 0) !== 1 ? "s" : ""}
								</span>
								<span>
									{project._count?.files ?? 0} file
									{(project._count?.files ?? 0) !== 1 ? "s" : ""}
								</span>
								<span>
									{project._count?.messages ?? 0} message
									{(project._count?.messages ?? 0) !== 1 ? "s" : ""}
								</span>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}

function StatusBadge({ status }: { status: Project["status"] }) {
	const config = {
		draft: {
			label: "Draft",
			className:
				"bg-[var(--chip-bg)] text-[var(--sea-ink-soft)] border-[var(--chip-line)]",
		},
		generated: {
			label: "Generated",
			className:
				"bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)] border-[var(--lagoon)]/30",
		},
		refined: {
			label: "Refined",
			className:
				"bg-[var(--palm)]/10 text-[var(--palm)] border-[var(--palm)]/30",
		},
	} as const;

	const { label, className } = config[status];

	return (
		<span
			className={`rounded-full border px-2 py-0.5 text-xs font-medium ${className}`}
		>
			{label}
		</span>
	);
}
