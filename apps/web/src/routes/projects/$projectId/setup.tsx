import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "#/lib/api";

export const Route = createFileRoute("/projects/$projectId/setup")({
	component: SetupPage,
	loader: async ({ params }) => {
		try {
			const project = await api.projects.get(params.projectId);
			return { project };
		} catch {
			throw new Error("Project not found");
		}
	},
});

function SetupPage() {
	const { project } = Route.useLoaderData();
	const navigate = useNavigate();

	const [name, setName] = useState(project.name);
	const [description, setDescription] = useState(project.description);
	const [prompt, setPrompt] = useState("");
	const [errors, setErrors] = useState<{
		name?: string;
		description?: string;
		prompt?: string;
	}>({});
	const [isGenerating, setIsGenerating] = useState(false);
	const [mutationError, setMutationError] = useState<string | null>(null);

	// Auto-fill prompt with description if empty on mount
	useEffect(() => {
		if (!prompt && description) {
			setPrompt(description);
		}
	}, [description, prompt]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsGenerating(true);
		setMutationError(null);
		setErrors({});

		// Validate
		const newErrors: {
			name?: string;
			description?: string;
			prompt?: string;
		} = {};

		if (name.trim().length < 3) {
			newErrors.name = "Project name must be at least 3 characters";
		} else if (name.trim().length > 50) {
			newErrors.name = "Project name must be 50 characters or less";
		}

		if (description.trim().length < 10) {
			newErrors.description = "Description must be at least 10 characters";
		}

		if (prompt.trim().length < 10) {
			newErrors.prompt = "Prompt must be at least 10 characters";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setIsGenerating(false);
			return;
		}

		try {
			// First update project metadata if changed
			if (name !== project.name || description !== project.description) {
				await api.projects.update(project.id, {
					name: name.trim(),
					description: description.trim(),
				});
			}

			// Then call generate setup
			await api.generate.setup({
				projectId: project.id,
				description: prompt.trim(),
			});

			// Navigate to workspace
			navigate({
				to: "/projects/$projectId",
				params: { projectId: project.id },
			});
		} catch (error) {
			const message =
				error instanceof Error
					? error.message
					: "Failed to generate project. Please try again.";
			setMutationError(message);
		} finally {
			setIsGenerating(false);
		}
	};

	const handleBack = () => {
		navigate({ to: "/projects" });
	};

	return (
		<div className="page-wrap px-4 py-8">
			{/* Back Button */}
			<button
				type="button"
				onClick={handleBack}
				className="mb-6 flex items-center gap-2 text-sm text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)]"
			>
				<ArrowLeft className="h-4 w-4" />
				<span>Back to Projects</span>
			</button>

			{/* Header */}
			<div className="mb-8">
				<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--lagoon)]/10">
					<Sparkles className="h-6 w-6 text-[var(--lagoon)]" />
				</div>
				<h1 className="display-title mb-2 text-3xl font-bold text-[var(--sea-ink)]">
					Generate Your Project
				</h1>
				<p className="text-[var(--sea-ink-soft)]">
					Describe what you want to build and AI will generate a
					production-ready Moon monorepo for you.
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
				<div className="island-shell rounded-2xl p-6">
					{/* Project Name */}
					<div className="mb-6">
						<label
							htmlFor="project-name"
							className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]"
						>
							Project Name <span className="text-[var(--palm)]">*</span>
						</label>
						<input
							id="project-name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g., My SaaS App"
							className="w-full rounded-lg border border-[var(--input-border)] bg-white px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20"
							disabled={isGenerating}
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-[var(--palm)]">{errors.name}</p>
						)}
					</div>

					{/* Description */}
					<div className="mb-6">
						<label
							htmlFor="project-description"
							className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]"
						>
							Description <span className="text-[var(--palm)]">*</span>
						</label>
						<textarea
							id="project-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Brief description of your project"
							rows={2}
							className="w-full rounded-lg border border-[var(--input-border)] bg-white px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20 resize-none"
							disabled={isGenerating}
						/>
						{errors.description && (
							<p className="mt-1 text-xs text-[var(--palm)]">
								{errors.description}
							</p>
						)}
					</div>

					{/* Generate Prompt */}
					<div className="mb-6">
						<label
							htmlFor="generate-prompt"
							className="mb-1.5 block text-sm font-medium text-[var(--sea-ink)]"
						>
							Generate Prompt <span className="text-[var(--palm)]">*</span>
						</label>
						<p className="mb-2 text-xs text-[var(--sea-ink-soft)]">
							Describe your project in detail. Include the modules, features,
							and any specific requirements.
						</p>
						<textarea
							id="generate-prompt"
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							placeholder="E.g., 'Build a SaaS B2B platform with the following modules:
- Users: registration, login, profile management
- Subscriptions: billing plans, payment processing with Stripe
- Analytics: dashboard with charts and metrics
- Admin panel: manage users and subscriptions'

Or keep it simple: 'E-commerce marketplace with products, orders, and reviews'"
							rows={8}
							className="w-full rounded-lg border border-[var(--input-border)] bg-white px-3 py-3 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20 resize-none"
							disabled={isGenerating}
						/>
						{errors.prompt && (
							<p className="mt-1 text-xs text-[var(--palm)]">{errors.prompt}</p>
						)}
						<p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
							{prompt.length}/1000 characters
						</p>
					</div>

					{/* Error Message */}
					{mutationError && (
						<div className="mb-6 rounded-lg bg-[var(--palm)]/10 border border-[var(--palm)]/30 px-4 py-3 text-sm text-[var(--palm)]">
							{mutationError}
						</div>
					)}

					{/* Submit Button */}
					<div className="flex justify-end gap-3">
						<button
							type="button"
							onClick={handleBack}
							className="rounded-lg border border-[var(--border-color)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--surface)]"
							disabled={isGenerating}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isGenerating}
							className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isGenerating ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Generating...
								</>
							) : (
								<>
									<Sparkles className="h-4 w-4" />
									Generate Project
								</>
							)}
						</button>
					</div>
				</div>

				{/* Tips */}
				<div className="mt-6 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] p-4">
					<h3 className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">
						Tips for better results:
					</h3>
					<ul className="space-y-1 text-xs text-[var(--sea-ink-soft)]">
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">•</span>
							<span>Be specific about the features and modules you need</span>
						</li>
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">•</span>
							<span>
								Mention any specific technologies or patterns you prefer
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">•</span>
							<span>
								You can always refine and add more features later via chat
							</span>
						</li>
					</ul>
				</div>
			</form>
		</div>
	);
}
