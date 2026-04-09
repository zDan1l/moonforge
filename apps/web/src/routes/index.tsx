import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Bot,
	ChevronRight,
	Code2,
	Database,
	Download,
	FolderOpen,
	Hexagon,
	History,
	Layout,
	Lock,
	MessageCircle,
	Moon,
	RefreshCw,
	Sparkles,
	Terminal,
	Zap,
} from "lucide-react";
import { useState } from "react";

const STEPS = [
	{ icon: MessageCircle, label: "Describe", sub: "Natural Language" },
	{ icon: Sparkles, label: "AI Generates", sub: "Stack Config" },
	{ icon: Layout, label: "Preview", sub: "File Tree Template" },
	{ icon: Download, label: "Download", sub: ".zip Ready" },
];

const FEATURES = [
	{
		icon: Moon,
		title: "Moon Monorepo",
		desc: "Moon + PNPM workspace setup out-of-the-box. Integrated task automation, pre-configured git hooks, and intelligent caching for ultra-fast CI/CD.",
	},
	{
		icon: Bot,
		title: "Context-Aware Chatbot",
		desc: "Our AI understands the whole project structure. Ask for surgical edits, new API endpoints, or UI components—it injects code exactly where it belongs.",
	},
	{
		icon: History,
		title: "Version History",
		desc: "Never lose a working state. Download old versions, compare diff views of generated code, and perform instant rollbacks with one click.",
	},
	{
		icon: RefreshCw,
		title: "Auto Type Sync",
		desc: "Prisma schema updates automatically synchronize shared types across your apps and packages. End-to-end type safety without the manual work.",
	},
];

const TECH_STACK = [
	{ icon: Moon, label: "Moon + PNPM" },
	{ icon: Code2, label: "React 19" },
	{ icon: Zap, label: "Hono.js" },
	{ icon: Database, label: "Prisma + PG" },
	{ icon: Lock, label: "Zod" },
	{ icon: Terminal, label: "Biome" },
	{ icon: Hexagon, label: "Tailwind" },
];

export const Route = createFileRoute("/")({
	component: LandingPage,
});

function LandingPage() {
	const [prompt, setPrompt] = useState("");

	return (
		<div className="min-h-screen">
			{/* ===== HERO SECTION ===== */}
			<section className="relative px-6 pt-32 pb-20">
				{/* Glow orbs */}
				<div
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
				>
					<div
						className="absolute top-0 left-1/2 -translate-x-1/2 h-[700px] w-full rounded-full opacity-20 blur-3xl"
						style={{
							background:
								"radial-gradient(circle at 50% 0%, var(--lagoon), transparent 70%)",
						}}
					/>
				</div>

				<div className="page-wrap text-center">
					{/* Logo mark */}
					<div className="mb-6 inline-flex items-center justify-center">
						<div
							className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
							style={{
								background:
									"linear-gradient(135deg, var(--lagoon), var(--lagoon-deep))",
								boxShadow: "0 0 32px rgba(79, 184, 178, 0.35)",
							}}
						>
							<Moon className="h-8 w-8 text-white" />
							<div
								aria-hidden="true"
								className="absolute inset-0 rounded-2xl opacity-40"
								style={{
									background:
										"linear-gradient(135deg, rgba(255,255,255,0.3), transparent 60%)",
								}}
							/>
						</div>
					</div>

					<h1
						className="display-title mb-6 text-6xl font-bold tracking-tight md:text-7xl"
						style={{ color: "var(--sea-ink)" }}
					>
						MoonForge
					</h1>
					<p
						className="mx-auto mb-12 max-w-xl text-lg leading-relaxed md:text-xl"
						style={{ color: "var(--sea-ink-soft)" }}
					>
						Setup fullstack monorepo dalam hitungan menit.
						<br className="hidden md:block" />
						Sesuaikan kebutuhan project-mu selamanya lewat chat.
					</p>

					{/* Prompt box */}
					<div className="relative mx-auto mb-16 max-w-2xl">
						<div
							aria-hidden="true"
							className="absolute -inset-1 rounded-2xl opacity-25 blur-sm"
							style={{
								background:
									"linear-gradient(135deg, var(--lagoon), var(--lagoon-deep))",
							}}
						/>
						<div className="relative island-shell rounded-xl p-4">
							<div className="flex flex-col md:flex-row items-center gap-4">
								<MessageCircle
									className="hidden md:block h-5 w-5 flex-shrink-0"
									style={{ color: "var(--lagoon)" }}
								/>
								<input
									type="text"
									value={prompt}
									onChange={(e) => setPrompt(e.target.value)}
									placeholder={
										'"SaaS B2B dengan module users, subscription, dan dashboard analytics"'
									}
									className="flex-1 bg-transparent text-center md:text-left placeholder:text-center md:placeholder:text-left border-none focus:outline-none text-base"
									style={{ color: "var(--sea-ink)" }}
								/>
								<button
									type="button"
									className="flex w-full md:w-auto items-center justify-center gap-2 whitespace-nowrap rounded-xl px-8 py-3 font-semibold text-white transition hover:brightness-105"
									style={{
										background:
											"linear-gradient(135deg, var(--lagoon), var(--lagoon-deep))",
										boxShadow: "0 4px 16px rgba(79, 184, 178, 0.3)",
									}}
								>
									Generate Project
									<ArrowRight className="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ===== HOW IT WORKS ===== */}
			<section className="py-20" style={{ background: "var(--surface)" }}>
				<div className="page-wrap">
					<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
						{STEPS.map((step) => (
							<div key={step.label} className="group text-center">
								<div
									className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
									style={{
										background: "var(--surface-strong)",
										border: "1px solid var(--line)",
										boxShadow: "0 4px 12px rgba(30, 90, 72, 0.08)",
									}}
								>
									<step.icon
										className="h-7 w-7"
										style={{ color: "var(--lagoon)" }}
									/>
								</div>
								<h3
									className="mb-1 font-bold text-lg"
									style={{ color: "var(--sea-ink)" }}
								>
									{step.label}
								</h3>
								<p className="island-kicker text-xs">{step.sub}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== FEATURES BENTO ===== */}
			<section className="py-24 px-6">
				<div className="page-wrap">
					<h2
						className="display-title mb-14 text-center text-4xl font-bold"
						style={{ color: "var(--sea-ink)" }}
					>
						Architected for Speed
					</h2>
					<div className="grid gap-6 md:grid-cols-2">
						{FEATURES.map((f) => (
							<div
								key={f.title}
								className="feature-card rounded-2xl border p-8 transition hover:-translate-y-0.5"
								style={{ borderColor: "var(--line)" }}
							>
								<div
									className="mb-5 inline-flex rounded-xl p-3"
									style={{
										background:
											"color-mix(in oklab, var(--lagoon) 12%, transparent)",
									}}
								>
									<f.icon
										className="h-6 w-6"
										style={{ color: "var(--lagoon)" }}
									/>
								</div>
								<h3
									className="mb-3 text-2xl font-bold"
									style={{ color: "var(--sea-ink)" }}
								>
									{f.title}
								</h3>
								<p
									className="leading-relaxed"
									style={{ color: "var(--sea-ink-soft)" }}
								>
									{f.desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== WORKSPACE PREVIEW ===== */}
			<section className="py-20" style={{ background: "var(--surface)" }}>
				<div className="page-wrap">
					<p className="island-kicker mb-3 text-center">Developer Workspace</p>
					<h2
						className="display-title mb-10 text-center text-4xl font-bold"
						style={{ color: "var(--sea-ink)" }}
					>
						The Forge Interface
					</h2>

					{/* Three-panel mockup */}
					<div
						className="mx-auto overflow-hidden rounded-2xl border shadow-2xl"
						style={{
							borderColor: "var(--line)",
							background: "var(--surface)",
						}}
					>
						<div className="grid h-[500px] overflow-hidden md:grid-cols-12">
							{/* Left: Chat */}
							<div
								className="col-span-12 flex flex-col border-b border-r-0 p-4 md:col-span-3 md:border-b-0 md:border-r"
								style={{
									background: "var(--surface-strong)",
									borderColor: "var(--line)",
								}}
							>
								<div className="mb-5 flex items-center gap-2 px-2">
									<MessageCircle
										className="h-4 w-4"
										style={{ color: "var(--lagoon)" }}
									/>
									<span
										className="font-bold text-xs uppercase tracking-wider"
										style={{ color: "var(--sea-ink)" }}
									>
										Contextual Chat
									</span>
								</div>
								<div className="flex-1 space-y-3 overflow-y-auto">
									<div
										className="rounded-xl p-3 text-sm"
										style={{
											background: "var(--surface)",
											color: "var(--sea-ink-soft)",
										}}
									>
										"Tambahkan module Stripe untuk payment processing."
									</div>
									<div
										className="rounded-xl border p-3 text-sm"
										style={{
											background:
												"color-mix(in oklab, var(--lagoon) 8%, transparent)",
											borderColor:
												"color-mix(in oklab, var(--lagoon) 25%, transparent)",
											color: "var(--lagoon-deep)",
										}}
									>
										Tentu! Saya sedang memperbarui schema.prisma dan menambahkan
										package Stripe.
									</div>
								</div>
								<div
									className="mt-4 rounded-lg border p-3 text-center text-xs italic"
									style={{
										borderColor: "var(--line)",
										color: "var(--sea-ink-soft)",
									}}
								>
									Ketik perintah baru...
								</div>
							</div>

							{/* Center: Code */}
							<div
								className="col-span-12 flex flex-col p-5 md:col-span-6"
								style={{ background: "var(--bg-base)" }}
							>
								<div
									className="mb-4 flex items-center justify-between border-b pb-4"
									style={{ borderColor: "var(--line)" }}
								>
									<div className="flex items-center gap-2">
										<Database
											className="h-4 w-4"
											style={{ color: "#f59e0b" }}
										/>
										<span
											className="text-sm"
											style={{ color: "var(--sea-ink-soft)" }}
										>
											schema.prisma
										</span>
									</div>
									<div className="flex gap-1.5">
										<div className="h-3 w-3 rounded-full bg-red-400/50" />
										<div className="h-3 w-3 rounded-full bg-yellow-400/50" />
										<div className="h-3 w-3 rounded-full bg-green-400/50" />
									</div>
								</div>
								<div className="flex-1 overflow-auto">
									<pre
										className="text-sm leading-relaxed"
										style={{
											fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
											color: "var(--sea-ink-soft)",
										}}
									>
										<code>
											<span style={{ color: "var(--sea-ink-soft)" }}>
												model
											</span>{" "}
											<span style={{ color: "var(--lagoon)" }}>User</span>{" "}
											&#123;
										</code>
										<code>
											{"  "}id{"  "}
											<span style={{ color: "var(--lagoon)" }}>String</span> @id
											@default(cuid())
										</code>
										<code>
											{"  "}email{" "}
											<span style={{ color: "var(--lagoon)" }}>String</span>{" "}
											@unique
										</code>
										<code>
											{"  "}name{" "}
											<span style={{ color: "var(--lagoon)" }}>String?</span>
										</code>
										<code>
											{"  "}createdAt{" "}
											<span style={{ color: "var(--lagoon)" }}>DateTime</span>{" "}
											@default(now())
										</code>
										<code>{"  "}</code>
										<code>
											{"  "}
											<span
												style={{
													color: "var(--sea-ink-soft)",
													opacity: 0.6,
												}}
											>
												{/* Added by AI Forge */}
											</span>
										</code>
										<code>
											{"  "}stripeId{" "}
											<span style={{ color: "var(--lagoon)" }}>String?</span>
										</code>
										<code>
											{"  "}status{" "}
											<span style={{ color: "var(--lagoon)" }}>
												SubscriptionStatus
											</span>{" "}
											@default(FREE)
										</code>
										<code>&#125;</code>
									</pre>
								</div>
							</div>

							{/* Right: File Tree */}
							<div
								className="col-span-12 flex flex-col border-t border-l-0 p-4 md:col-span-3 md:border-t-0 md:border-l"
								style={{
									background: "var(--surface-strong)",
									borderColor: "var(--line)",
								}}
							>
								<div className="mb-5 flex items-center gap-2 px-2">
									<FolderOpen
										className="h-4 w-4"
										style={{ color: "var(--lagoon)" }}
									/>
									<span
										className="font-bold text-xs uppercase tracking-wider"
										style={{ color: "var(--sea-ink)" }}
									>
										Project Explorer
									</span>
								</div>
								<div
									className="space-y-1 text-sm"
									style={{ color: "var(--sea-ink-soft)" }}
								>
									<div className="flex items-center gap-2">
										<ChevronRight className="h-3 w-3" />
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										apps
									</div>
									<div className="ml-5 flex items-center gap-2">
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										web
									</div>
									<div className="ml-5 flex items-center gap-2">
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										api
									</div>
									<div className="flex items-center gap-2">
										<ChevronRight className="h-3 w-3" />
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										packages
									</div>
									<div
										className="ml-5 flex items-center gap-2"
										style={{ color: "var(--sea-ink-soft)", opacity: 0.7 }}
									>
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										types
									</div>
									<div
										className="ml-5 flex items-center gap-2"
										style={{ color: "var(--sea-ink-soft)", opacity: 0.7 }}
									>
										<FolderOpen
											className="h-3 w-3"
											style={{ color: "var(--lagoon)" }}
										/>
										ui
									</div>
									<div
										className="ml-8 flex items-center gap-2"
										style={{ color: "var(--sea-ink-soft)", opacity: 0.5 }}
									>
										<ChevronRight className="h-3 w-3" />
										moon.yml
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ===== TECH STACK ===== */}
			<section
				className="py-16"
				style={{
					borderTop: "1px solid var(--line)",
					borderBottom: "1px solid var(--line)",
					background: "var(--surface)",
				}}
			>
				<div className="page-wrap">
					<div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
						{TECH_STACK.map((t) => (
							<div
								key={t.label}
								className="flex items-center gap-2 font-semibold opacity-60 transition-opacity hover:opacity-100"
								style={{ color: "var(--sea-ink)" }}
							>
								<t.icon
									className="h-5 w-5"
									style={{ color: "var(--lagoon)" }}
								/>
								{t.label}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== FINAL CTA ===== */}
			<section className="py-28 px-6">
				<div className="page-wrap">
					<div
						className="mx-auto max-w-2xl rounded-3xl p-12 text-center"
						style={{
							background: "var(--surface-strong)",
							border: "1px solid var(--line)",
							boxShadow: "0 24px 64px rgba(30, 90, 72, 0.12)",
						}}
					>
						<h2
							className="display-title mb-6 text-4xl font-bold"
							style={{ color: "var(--sea-ink)" }}
						>
							Mulai Project Pertamamu
						</h2>
						<div className="relative mx-auto mb-8 max-w-md">
							<input
								type="text"
								placeholder="Apa yang ingin kamu buat?"
								className="w-full rounded-xl border px-5 py-3 text-center md:text-left"
								style={{
									background: "var(--bg-base)",
									borderColor: "var(--line)",
									color: "var(--sea-ink)",
								}}
							/>
						</div>
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-xl px-8 py-3 font-bold text-white transition hover:brightness-105"
							style={{
								background:
									"linear-gradient(135deg, var(--lagoon), var(--lagoon-deep))",
								boxShadow: "0 4px 16px rgba(79, 184, 178, 0.3)",
							}}
						>
							<Sparkles className="h-5 w-5" />
							Create Free Project
						</button>
						<p
							className="mt-6 text-xs uppercase tracking-widest"
							style={{ color: "var(--sea-ink-soft)" }}
						>
							Tidak perlu kartu kredit. 100% Free untuk 1 project.
						</p>
					</div>
				</div>
			</section>

			{/* ===== FOOTER ===== */}
			<footer
				className="site-footer px-12 py-12"
				style={{
					borderTop: "1px solid var(--line)",
					background: "var(--surface)",
				}}
			>
				<div className="page-wrap flex flex-col items-center justify-between gap-6 md:flex-row">
					<div>
						<div className="mb-2 flex items-center gap-2">
							<Moon className="h-5 w-5" style={{ color: "var(--lagoon)" }} />
							<span
								className="text-lg font-bold"
								style={{ color: "var(--sea-ink)" }}
							>
								MoonForge
							</span>
						</div>
						<p className="text-xs" style={{ color: "var(--sea-ink-soft)" }}>
							© 2026 MoonForge. All rights reserved.
						</p>
					</div>
					<div
						className="flex flex-wrap items-center justify-center gap-6 text-xs uppercase tracking-wider"
						style={{ color: "var(--sea-ink-soft)" }}
					>
						<a href="/docs" className="transition hover:text-[var(--lagoon)]">
							Documentation
						</a>
						<a
							href="/changelog"
							className="transition hover:text-[var(--lagoon)]"
						>
							Changelog
						</a>
						<a href="/status" className="transition hover:text-[var(--lagoon)]">
							Status
						</a>
						<a
							href="/privacy"
							className="transition hover:text-[var(--lagoon)]"
						>
							Privacy
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
