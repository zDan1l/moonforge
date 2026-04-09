import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useState } from "react";
import { api } from "#/lib/api";

export const Route = createFileRoute("/projects/new")({
	component: NewProjectPage,
});

function NewProjectPage() {
	const navigate = useNavigate();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<{
		name?: string;
		description?: string;
	}>({});
	const [isPending, setIsPending] = useState(false);
	const [mutationError, setMutationError] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsPending(true);
		setMutationError(null);

		// Validate
		const newErrors: { name?: string; description?: string } = {};

		if (name.trim().length < 3) {
			newErrors.name = "Project name must be at least 3 characters";
		} else if (name.trim().length > 50) {
			newErrors.name = "Project name must be 50 characters or less";
		}

		if (description.trim().length < 10) {
			newErrors.description = "Description must be at least 10 characters";
		} else if (description.trim().length > 500) {
			newErrors.description = "Description must be 500 characters or less";
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			setIsPending(false);
			return;
		}

		setErrors({});

		try {
			const project = await api.projects.create({
				name: name.trim(),
				description: description.trim(),
			});

			// Navigate to setup page
			navigate({
				to: "/projects/$projectId/setup",
				params: { projectId: project.id },
			});
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create project";
			setMutationError(message);
			setIsPending(false);
		}
	};

	return (
		<div className="page-wrap px-4 py-8">
			{/* Back Button */}
			<button
				type="button"
				onClick={() => navigate({ to: "/projects" })}
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
					Create New Project
				</h1>
				<p className="text-[var(--sea-ink-soft)]">
					Start by giving your project a name and brief description.
				</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
				<div className="island-shell rounded-2xl p-6">
					{/* Name Field */}
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
							disabled={isPending}
						/>
						{errors.name && (
							<p className="mt-1 text-xs text-[var(--palm)]">{errors.name}</p>
						)}
					</div>

					{/* Description Field */}
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
							placeholder="Briefly describe what you want to build. E.g., 'A B2B SaaS platform with user management, subscriptions, and analytics dashboard.'"
							rows={4}
							className="w-full rounded-lg border border-[var(--input-border)] bg-white px-3 py-2 text-sm text-[var(--sea-ink)] placeholder:text-[var(--sea-ink-soft)] focus:border-[var(--lagoon)] focus:outline-none focus:ring-2 focus:ring-[var(--lagoon)]/20 resize-none"
							disabled={isPending}
						/>
						{errors.description && (
							<p className="mt-1 text-xs text-[var(--palm)]">
								{errors.description}
							</p>
						)}
						<p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
							{description.length}/500 characters
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
							onClick={() => navigate({ to: "/projects" })}
							className="rounded-lg border border-[var(--border-color)] bg-transparent px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:bg-[var(--surface)]"
							disabled={isPending}
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isPending}
							className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isPending ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
									Creating...
								</>
							) : (
								<>
									<Sparkles className="h-4 w-4" />
									Continue to Generate
								</>
							)}
						</button>
					</div>
				</div>

				{/* Info */}
				<div className="mt-6 rounded-lg bg-[var(--surface)] border border-[var(--border-color)] p-4">
					<h3 className="mb-2 text-sm font-semibold text-[var(--sea-ink)]">
						What happens next?
					</h3>
					<ul className="space-y-1 text-xs text-[var(--sea-ink-soft)]">
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">1.</span>
							<span>
								Enter a detailed prompt describing your project requirements
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">2.</span>
							<span>
								AI will generate a production-ready Moon monorepo structure
							</span>
						</li>
						<li className="flex gap-2">
							<span className="text-[var(--lagoon)]">3.</span>
							<span>
								Review the files in the workspace and download your project
							</span>
						</li>
					</ul>
				</div>
			</form>
		</div>
	);
}
