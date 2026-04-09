import { createFileRoute, Link } from "@tanstack/react-router";
import {
	FileCode,
	FolderKanban,
	MessageSquare,
	TrendingUp,
	Plus,
	ArrowRight,
	Activity,
	Clock,
} from "lucide-react";
import { Card } from "#/components/ui/Card";
import { Button } from "#/components/ui/Button";
import { StatusBadge } from "#/components/ui";
import { api, type Project } from "#/lib/api";

export const Route = createFileRoute("/dashboard")({
	component: DashboardPage,
	loader: async () => {
		try {
			const projects = await api.projects.list();
			const sortedProjects = projects.sort(
				(a, b) =>
					new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
			);

			return {
				projects: sortedProjects,
				stats: {
					total: projects.length,
					draft: projects.filter((p) => p.status === "draft").length,
					generated: projects.filter((p) => p.status === "generated").length,
					refined: projects.filter((p) => p.status === "refined").length,
				},
			};
		} catch {
			return {
				projects: [] as Project[],
				stats: { total: 0, draft: 0, generated: 0, refined: 0 },
			};
		}
	},
});

function DashboardPage() {
	const { projects, stats } = Route.useLoaderData();
	const recentProjects = projects.slice(0, 6);

	return (
		<div className="page-wrap px-4 py-8">
			{/* Header */}
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="display-title text-3xl font-bold text-[var(--sea-ink)]">
						Dashboard
					</h1>
					<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
						Welcome back! Here's your project overview.
					</p>
				</div>
				<Link
					to="/projects/new"
					className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
				>
					<Plus className="h-4 w-4" />
					New Project
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="Total Projects"
					value={stats.total}
					icon={<FolderKanban className="h-5 w-5" />}
					color="lagoon"
					trend={stats.total > 0 ? "+0 this week" : undefined}
				/>
				<StatCard
					title="Draft"
					value={stats.draft}
					icon={<FileCode className="h-5 w-5" />}
					color="sea-ink-soft"
				/>
				<StatCard
					title="Generated"
					value={stats.generated}
					icon={<Activity className="h-5 w-5" />}
					color="palm"
				/>
				<StatCard
					title="Refined"
					value={stats.refined}
					icon={<TrendingUp className="h-5 w-5" />}
					color="lagoon"
				/>
			</div>

			{/* Quick Actions & Recent Projects */}
			<div className="grid gap-6 lg:grid-cols-3">
				{/* Quick Actions */}
				<div className="lg:col-span-1">
					<h2 className="mb-4 text-lg font-semibold text-[var(--sea-ink)]">
						Quick Actions
					</h2>
					<div className="flex flex-col gap-3">
						<Link
							to="/projects/new"
							className="island-shell group flex w-full items-start gap-3 rounded-xl p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--lagoon)] no-underline"
						>
							<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon)]/10 transition group-hover:bg-[var(--lagoon)]/20">
								<div className="text-[var(--lagoon-deep)]">
									<Plus className="h-5 w-5" />
								</div>
							</div>
							<div className="flex-1 min-w-0">
								<h3 className="mb-0.5 text-sm font-semibold text-[var(--sea-ink)] transition group-hover:text-[var(--lagoon)]">
									Create New Project
								</h3>
								<p className="text-xs text-[var(--sea-ink-soft)]">
									Start a new monorepo project
								</p>
							</div>
							<ArrowRight className="h-5 w-5 flex-shrink-0 text-[var(--sea-ink-soft)] transition group-hover:text-[var(--lagoon)]" />
						</Link>
						<Link
							to="/projects"
							className="block no-underline"
							activeProps={{ className: "is-active" }}
						>
							<ActionButton
								title="View All Projects"
								description="Browse and manage your projects"
								icon={<FolderKanban className="h-5 w-5" />}
							/>
						</Link>
					</div>
				</div>

				{/* Recent Projects */}
				<div className="lg:col-span-2">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold text-[var(--sea-ink)]">
							Recent Projects
						</h2>
						{projects.length > 6 && (
							<Link
								to="/projects"
								className="flex items-center gap-1 text-sm font-medium text-[var(--lagoon)] transition hover:text-[var(--lagoon-deep)]"
							>
								View all
								<ArrowRight className="h-4 w-4" />
							</Link>
						)}
					</div>

					{recentProjects.length === 0 ? (
						<Card className="p-8">
							<div className="flex flex-col items-center justify-center text-center">
								<FolderKanban className="mb-3 h-12 w-12 text-[var(--sea-ink-soft)]" />
								<h3 className="mb-2 text-base font-semibold text-[var(--sea-ink)]">
									No projects yet
								</h3>
								<p className="mb-4 max-w-sm text-sm text-[var(--sea-ink-soft)]">
									Create your first project to get started with MoonForge.
								</p>
								<Link
									to="/projects/new"
									className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
								>
									<Plus className="h-4 w-4" />
									Create First Project
								</Link>
							</div>
						</Card>
					) : (
						<div className="grid gap-3 sm:grid-cols-2">
							{recentProjects.map((project) => (
								<ProjectCard key={project.id} project={project} />
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

interface StatCardProps {
	title: string;
	value: number;
	icon: React.ReactNode;
	color: "lagoon" | "palm" | "sea-ink-soft";
	trend?: string;
}

function StatCard({ title, value, icon, color, trend }: StatCardProps) {
	const colorClasses = {
		lagoon: "text-[var(--lagoon)] bg-[var(--lagoon)]/10",
		palm: "text-[var(--palm)] bg-[var(--palm)]/10",
		"sea-ink-soft": "text-[var(--sea-ink-soft)] bg-[var(--chip-bg)]",
	};

	return (
		<Card className="p-5">
			<div className="flex items-start justify-between">
				<div>
					<p className="mb-1 text-xs font-medium text-[var(--sea-ink-soft)]">
						{title}
					</p>
					<p className="text-2xl font-bold text-[var(--sea-ink)]">{value}</p>
					{trend && (
						<p className="mt-1 text-xs text-[var(--sea-ink-soft)]">{trend}</p>
					)}
				</div>
				<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClasses[color]}`}>
					{icon}
				</div>
			</div>
		</Card>
	);
}

interface ActionButtonProps {
	title: string;
	description: string;
	icon: React.ReactNode;
	onClick?: () => void;
}

function ActionButton({ title, description, icon, onClick }: ActionButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="island-shell group flex w-full items-start gap-3 rounded-xl p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--lagoon)]"
		>
			<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon)]/10 transition group-hover:bg-[var(--lagoon)]/20">
				<div className="text-[var(--lagoon-deep)]">{icon}</div>
			</div>
			<div className="flex-1 min-w-0">
				<h3 className="mb-0.5 text-sm font-semibold text-[var(--sea-ink)] transition group-hover:text-[var(--lagoon)]">
					{title}
				</h3>
				<p className="text-xs text-[var(--sea-ink-soft)]">{description}</p>
			</div>
			<ArrowRight className="h-5 w-5 flex-shrink-0 text-[var(--sea-ink-soft)] transition group-hover:text-[var(--lagoon)]" />
		</button>
	);
}

interface ProjectCardProps {
	project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
	const updatedDate = new Date(project.updated_at);
	const timeAgo = getTimeAgo(updatedDate);

	// Draft projects go to setup, generated/refined go to workspace
	const targetRoute =
		project.status === "draft"
			? "/projects/$projectId/setup"
			: "/projects/$projectId";

	return (
		<Link
			to={targetRoute}
			params={{ projectId: project.id }}
			className="block no-underline"
		>
			<Card hoverable className="h-full">
				<div className="flex items-start justify-between mb-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--lagoon)]/10">
						<FileCode className="h-4.5 w-4.5 text-[var(--lagoon-deep)]" />
					</div>
					<StatusBadge status={project.status} size="sm" />
				</div>
				<h3 className="mb-1 text-base font-semibold text-[var(--sea-ink)] line-clamp-1">
					{project.name}
				</h3>
				<p className="mb-3 text-sm text-[var(--sea-ink-soft)] line-clamp-2">
					{project.description}
				</p>
				<div className="flex items-center justify-between text-xs text-[var(--sea-ink-soft)]">
					<div className="flex items-center gap-3">
						<span className="flex items-center gap-1">
							<MessageSquare className="h-3 w-3" />
							{project._count?.messages ?? 0}
						</span>
						<span className="flex items-center gap-1">
							<FileCode className="h-3 w-3" />
							{project._count?.files ?? 0}
						</span>
					</div>
					<span className="flex items-center gap-1">
						<Clock className="h-3 w-3" />
						{timeAgo}
					</span>
				</div>
			</Card>
		</Link>
	);
}

function getTimeAgo(date: Date): string {
	const now = new Date();
	const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (seconds < 60) return "just now";
	if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
	if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
	if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
	return date.toLocaleDateString();
}
