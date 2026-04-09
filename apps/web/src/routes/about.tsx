import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	Bolt,
	Code,
	FileCode,
	GitBranch,
	MessageSquare,
	Moon,
	Zap,
} from "lucide-react";

export const Route = createFileRoute("/about")({
	component: About,
});

function About() {
	return (
		<main className="page-wrap px-4 py-12">
			{/* Hero Section */}
			<section className="island-shell mb-12 rounded-2xl p-6 sm:p-8">
				<div className="flex items-center gap-3 mb-4">
					<Moon className="h-10 w-10 text-[var(--lagoon)]" />
					<p className="island-kicker mb-0">About</p>
				</div>
				<h1 className="display-title mb-4 text-4xl font-bold text-[var(--sea-ink)] sm:text-5xl">
					Setup fullstack monorepo in minutes. Refine forever with AI.
				</h1>
				<p className="m-0 max-w-3xl text-base leading-8 text-[var(--sea-ink-soft)]">
					MoonForge is an AI workspace for setting up and refining fullstack
					monorepos. Start with a production-ready Moon template, customize with
					natural language, and iterate surgically without breaking consistency.
				</p>
			</section>

			{/* Features Grid */}
			<section className="mb-12">
				<h2 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">
					Why MoonForge?
				</h2>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					<FeatureCard
						icon={<Zap className="h-5 w-5" />}
						title="Setup in Minutes"
						description="Describe your project in natural language. AI generates a working Moon monorepo with proper structure, types, and routing."
					/>
					<FeatureCard
						icon={<GitBranch className="h-5 w-5" />}
						title="Version Control"
						description="Every generate and refine action creates a new version. Roll back anytime, download any version as ZIP."
					/>
					<FeatureCard
						icon={<Bolt className="h-5 w-5" />}
						title="Surgical Refinement"
						description="AI modifies only the files that need to change. No regeneration of the entire codebase."
					/>
					<FeatureCard
						icon={<MessageSquare className="h-5 w-5" />}
						title="Context-Aware Chat"
						description="The AI knows your entire project structure. Ask for changes naturally and see diff previews."
					/>
					<FeatureCard
						icon={<FileCode className="h-5 w-5" />}
						title="File Labels"
						description="See which files are template [T], AI-generated [AI], or modified. Track changes at a glance."
					/>
					<FeatureCard
						icon={<Code className="h-5 w-5" />}
						title="Production Ready"
						description="Generated monorepos use React 19, TanStack Start, Hono.js, Prisma, and Tailwind CSS v4."
					/>
				</div>
			</section>

			{/* How It Works */}
			<section className="island-shell mb-12 rounded-2xl p-6 sm:p-8">
				<h2 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">
					How It Works
				</h2>
				<div className="mx-auto max-w-3xl space-y-6">
					<Step
						number={1}
						title="Create a Project"
						description="Give your project a name and describe what you want to build."
					/>
					<Step
						number={2}
						title="Generate with AI"
						description="MoonForge merges a battle-tested Moon template with AI-generated customizations based on your description."
					/>
					<Step
						number={3}
						title="Preview & Download"
						description="Review the file tree, preview code, and download as ZIP. Run pnpm install && pnpm run dev."
					/>
					<Step
						number={4}
						title="Refine Iteratively"
						description="Come back anytime. Chat with AI to add modules, modify schemas, or update routes. Download new versions."
					/>
				</div>
			</section>

			{/* Tech Stack */}
			<section className="mb-12">
				<h2 className="mb-6 text-2xl font-bold text-[var(--sea-ink)]">
					Tech Stack
				</h2>
				<div className="island-shell rounded-2xl p-6">
					<div className="grid gap-6 sm:grid-cols-2">
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">
								Frontend
							</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">
								React 19 + TanStack Router + TanStack Start
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">Backend</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">Hono.js</p>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">ORM</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">
								Prisma + PostgreSQL
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">
								Styling & Linting
							</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">
								Tailwind CSS v4 + Biome
							</p>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">Monorepo</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">Moon + PNPM</p>
						</div>
						<div>
							<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">
								Validation
							</h3>
							<p className="text-sm text-[var(--sea-ink-soft)]">Zod</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="island-shell rounded-2xl p-8 text-center">
				<h2 className="mb-3 text-2xl font-bold text-[var(--sea-ink)]">
					Ready to build?
				</h2>
				<p className="mb-6 text-[var(--sea-ink-soft)]">
					Create your first MoonForge project and go from idea to running monorepo
					in minutes.
				</p>
				<Link
					to="/dashboard"
					className="inline-flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)]"
				>
					Get Started
					<ArrowRight className="h-4 w-4" />
				</Link>
			</section>
		</main>
	);
}

interface FeatureCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
	return (
		<div className="island-shell feature-card rounded-xl p-5">
			<div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--lagoon)]/10">
				<div className="text-[var(--lagoon-deep)]">{icon}</div>
			</div>
			<h3 className="mb-2 font-semibold text-[var(--sea-ink)]">{title}</h3>
			<p className="text-sm text-[var(--sea-ink-soft)]">{description}</p>
		</div>
	);
}

interface StepProps {
	number: number;
	title: string;
	description: string;
}

function Step({ number, title, description }: StepProps) {
	return (
		<div className="flex gap-4">
			<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon)] font-semibold text-white">
				{number}
			</div>
			<div>
				<h3 className="mb-1 font-semibold text-[var(--sea-ink)]">{title}</h3>
				<p className="text-sm text-[var(--sea-ink-soft)]">{description}</p>
			</div>
		</div>
	);
}
