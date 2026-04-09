/**
 * Create Project Form Component
 *
 * Form for creating a new project with validation.
 */
import { useState } from "react";
import type { Project } from "../../lib/api";
import { api } from "../../lib/api";

export interface CreateProjectFormProps {
	onSuccess?: (project: Project) => void;
	onError?: (error: string) => void;
}

export function CreateProjectForm({
	onSuccess,
	onError,
}: CreateProjectFormProps) {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [errors, setErrors] = useState<{ name?: string; description?: string }>(
		{},
	);
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
			onSuccess?.(project);
			// Reset form
			setName("");
			setDescription("");
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to create project";
			setMutationError(message);
			onError?.(message);
		} finally {
			setIsPending(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			{/* Name Field */}
			<div>
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
			<div>
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
					placeholder="Describe your project needs in natural language. E.g., 'A B2B SaaS with user management, subscriptions, and analytics dashboard.'"
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
				<div className="rounded-lg bg-[var(--palm)]/10 border border-[var(--palm)]/30 px-3 py-2 text-sm text-[var(--palm)]">
					{mutationError}
				</div>
			)}

			{/* Submit Button */}
			<div className="flex justify-end gap-2 pt-2">
				<button
					type="submit"
					disabled={isPending}
					className="flex items-center gap-2 rounded-full bg-[var(--lagoon)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--lagoon-deep)] disabled:cursor-not-allowed disabled:opacity-50"
				>
					{isPending ? (
						<>
							<span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
							Creating...
						</>
					) : (
						"Create Project"
					)}
				</button>
			</div>
		</form>
	);
}
