import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertCircle,
	FileCode,
	FolderOpen,
	Plus,
	RefreshCw,
} from "lucide-react";
import type { Project } from "../../lib/api";
import { api } from "../../lib/api";

export const Route = createFileRoute("/projects/")({
	component: ProjectListPage,
	loader: async () => {
		try {
			const projects = await api.projects.list();
			return { projects, error: null };
		} catch (error) {
			console.error("Failed to fetch projects:", error);
			return {
				projects: [] as Project[],
				error:
					error instanceof Error
						? error.message
						: "Gagal terhubung ke server. Pastikan API berjalan.",
			};
		}
	},
});

function ProjectListPage() {
	const { projects, error } = Route.useLoaderData();

	return (
		<div className="page-wrap px-4 py-8">
			<div className="mb-8 flex items-center justify-between">
				<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
					Your Projects
				</h1>
				<Link
					to="/projects/new"
					className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
				>
					<Plus className="h-4 w-4" />
					New Project
				</Link>
			</div>

			{/* Error State */}
			{error && (
				<div
					className="mb-6 flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-900 dark:bg-red-950"
					role="alert"
				>
					<AlertCircle
						className="mb-4 h-12 w-12 text-red-500 dark:text-red-400"
						aria-hidden="true"
					/>
					<h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-300">
						Terjadi kesalahan
					</h2>
					<p className="mb-6 max-w-md text-sm text-red-600 dark:text-red-400">
						{error}
					</p>
					<div className="flex gap-3">
						<button
							type="button"
							onClick={() => window.location.reload()}
							className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
						>
							<RefreshCw className="h-4 w-4" />
							Coba Lagi
						</button>
					</div>
					<p className="mt-4 text-xs text-red-500/70 dark:text-red-400/70">
						Pastikan backend API berjalan di port 5000
					</p>
				</div>
			)}

			{/* Empty State */}
			{!error && projects.length === 0 && (
				<div className="island-shell flex flex-col items-center justify-center rounded-2xl p-12 text-center">
					<FolderOpen className="mb-4 h-12 w-12 text-[var(--sea-ink-soft)]" />
					<h2 className="mb-2 text-lg font-semibold text-[var(--sea-ink)]">
						No projects yet
					</h2>
					<p className="mb-6 max-w-sm text-sm text-[var(--sea-ink-soft)]">
						Create your first project to get started with MoonForge. Describe
						your needs in natural language and let AI build your monorepo.
					</p>
					<Link
						to="/projects/new"
						className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
					>
						<Plus className="h-4 w-4" />
						Create First Project
					</Link>
				</div>
			)}

			{/* Project List */}
			{!error && projects.length > 0 && (
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{/* New Project Card */}
					<Link
						to="/projects/new"
						className="island-shell group flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border-color)] p-5 transition hover:-translate-y-0.5 hover:border-[var(--lagoon)] no-underline"
					>
						<div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--lagoon)]/10 transition group-hover:bg-[var(--lagoon)]/20">
							<Plus className="h-6 w-6 text-[var(--lagoon)] transition group-hover:text-[var(--lagoon-deep)]" />
						</div>
						<span className="mt-3 text-sm font-medium text-[var(--sea-ink)] transition group-hover:text-[var(--lagoon)]">
							New Project
						</span>
					</Link>

					{/* Project Cards */}
					{projects.map((project) => {
						// Draft projects go to setup, generated/refined go to workspace
						const targetRoute =
							project.status === "draft"
								? "/projects/$projectId/setup"
								: "/projects/$projectId";

						return (
							<Link
								key={project.id}
								to={targetRoute}
								params={{ projectId: project.id }}
								className="island-shell feature-card group block aspect-[4/3] flex flex-col rounded-2xl p-5 no-underline transition hover:-translate-y-0.5"
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
								<p className="mb-3 line-clamp-2 flex-1 text-sm text-[var(--sea-ink-soft)]">
									{project.description}
								</p>
								<div className="mt-auto flex items-center gap-4 text-xs text-[var(--sea-ink-soft)]">
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
						);
					})}
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
