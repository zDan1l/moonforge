import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { OpenSpecPreview } from "#/components/openspec-preview";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";
import {
	api,
	type GenerateProgressEvent,
	type OpenSpec,
} from "#/lib/api-client";

export const Route = createFileRoute("/project_/$id/generate")({
	component: GenerateFlow,
});

type GenerateState =
	| "loading-spec"
	| "preview"
	| "generating"
	| "complete"
	| "error";

function GenerateFlow() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [state, setState] = useState<GenerateState>("loading-spec");
	const [openspec, setOpenspec] = useState<OpenSpec | null>(null);
	const [progress, setProgress] = useState({
		completed: 0,
		total: 0,
		currentFile: "",
	});
	const [error, setError] = useState<string | null>(null);
	const eventSourceRef = useRef<EventSource | null>(null);

	// Load project and generate OpenSpec
	const { data: project } = useQuery({
		queryKey: ["project", id],
		queryFn: () => api.getProject(id),
	});

	const generateSpec = useMutation({
		mutationFn: () => api.generateSpec(id),
		onSuccess: (data) => {
			setOpenspec(data);
			setState("preview");
		},
		onError: (err: Error) => {
			setError(err.message);
			setState("error");
		},
	});

	const confirmGenerate = useMutation({
		mutationFn: () => api.confirmGenerate(id),
		onSuccess: () => {
			setState("generating");
			// Connect to SSE for progress
			connectProgress();
		},
		onError: (err: Error) => {
			setError(err.message);
			setState("error");
		},
	});

	// Initialize: generate spec if not already done
	useEffect(() => {
		if (project) {
			if (project.status === "GENERATED" || project.status === "MODIFIED") {
				// Already generated, go to download view
				setState("complete");
			} else {
				generateSpec.mutate();
			}
		}

		// Cleanup EventSource on unmount
		return () => {
			if (eventSourceRef.current) {
				eventSourceRef.current.close();
			}
		};
t	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [project]);

	const connectProgress = () => {
		const eventSource = api.connectProgress(id);

		eventSource.onmessage = (e) => {
			try {
				const event: GenerateProgressEvent = JSON.parse(e.data);

				if (event.type === "file_start" && event.file) {
					setProgress({
						completed: event.completed,
						total: event.total,
						currentFile: event.file,
					});
				} else if (event.type === "file_complete") {
					setProgress((prev) => ({
						...prev,
						completed: event.completed,
						currentFile: event.file || "",
					}));
				} else if (event.type === "done") {
					setProgress((prev) => ({
						...prev,
						completed: event.total,
						currentFile: "",
					}));
					setState("complete");
					eventSource.close();
					queryClient.invalidateQueries({ queryKey: ["project", id] });
					queryClient.invalidateQueries({ queryKey: ["projects"] });
				} else if (event.type === "error") {
					setError(event.message || "Generation failed");
					setState("error");
					eventSource.close();
				}
			} catch (err) {
				console.error("Failed to parse SSE event:", err);
			}
		};

		eventSource.onerror = () => {
			setError("Connection lost. Please refresh to check status.");
			eventSource.close();
		};

		eventSourceRef.current = eventSource;
	};

	const handleDownload = async () => {
		try {
			const blob = await api.exportProject(id);
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${openspec?.projectName || `project`}.zip`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		} catch (err) {
			console.error("Download failed:", err);
		}
	};

	// Loading state
	if (state === "loading-spec" || generateSpec.isPending) {
		return (
			<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<div className="animate-spin h-12 w-12 border-4 border-[var(--lagoon)] border-t-transparent rounded-full mx-auto mb-4" />
						<h2 className="text-xl font-semibold text-[var(--sea-ink)] mb-2">
							Analyzing Your Request
						</h2>
						<p className="text-[var(--sea-ink-soft)]">
							AI is generating your workspace specification...
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Error state
	if (state === "error") {
		return (
			<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
				<Card className="w-full max-w-md">
					<CardContent className="pt-6 text-center">
						<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-6 w-6 text-red-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</div>
						<h2 className="text-xl font-semibold text-[var(--sea-ink)] mb-2">
							Something Went Wrong
						</h2>
						<p className="text-[var(--sea-ink-soft)] mb-4">
							{error || "Failed to generate workspace"}
						</p>
						<div className="flex gap-3 justify-center">
							<Button
								variant="secondary"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Back to Dashboard
							</Button>
							<Button
								onClick={() => {
									setError(null);
									setState("loading-spec");
									generateSpec.mutate();
								}}
							>
								Try Again
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Generating state
	if (state === "generating") {
		const percentage =
			progress.total > 0 ? (progress.completed / progress.total) * 100 : 0;

		return (
			<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
				<Card className="w-full max-w-lg">
					<CardContent className="pt-6 text-center">
						<div className="relative w-20 h-20 mx-auto mb-6">
							<svg className="animate-spin w-full h-full" viewBox="0 0 100 100">
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="var(--line)"
									strokeWidth="8"
								/>
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="var(--lagoon)"
									strokeWidth="8"
									strokeDasharray={`${percentage * 2.83} 283`}
									strokeLinecap="round"
									transform="rotate(-90 50 50)"
								/>
							</svg>
							<span className="absolute inset-0 flex items-center justify-center text-lg font-semibold text-[var(--sea-ink)]">
								{Math.round(percentage)}%
							</span>
						</div>

						<h2 className="text-xl font-semibold text-[var(--sea-ink)] mb-2">
							Generating Your Workspace
						</h2>
						<p className="text-[var(--sea-ink-soft)] mb-4">
							{progress.completed} of {progress.total} files created
						</p>

						{progress.currentFile && (
							<div className="bg-[var(--foam)] rounded-lg px-4 py-2 mb-4">
								<p className="text-sm text-[var(--sea-ink-soft)] truncate font-mono">
									{progress.currentFile}
								</p>
							</div>
						)}

						<Progress
							value={progress.completed}
							max={progress.total}
							size="lg"
							className="w-full"
						/>

						<p className="text-xs text-[var(--sea-ink-soft)] mt-4">
							This may take a minute or two. Please don't close this page.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Complete state
	if (state === "complete") {
		return (
			<div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
				<Card className="w-full max-w-lg">
					<CardContent className="pt-6 text-center">
						<div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>

						<h2 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">
							Workspace Ready!
						</h2>
						<p className="text-[var(--sea-ink-soft)] mb-6">
							Your {project?.name || "workspace"} has been generated
							successfully.
						</p>

						<div className="bg-[var(--foam)] rounded-lg p-4 mb-6 text-left">
							<h3 className="font-semibold text-[var(--sea-ink)] mb-2">
								Next Steps:
							</h3>
							<ol className="text-sm text-[var(--sea-ink-soft)] space-y-1">
								<li>1. Download the .zip file below</li>
								<li>2. Extract to your project directory</li>
								<li>
									3. Run{" "}
									<code className="px-1 py-0.5 rounded bg-[var(--surface)]">
										pnpm install
									</code>
								</li>
								<li>
									4. Run{" "}
									<code className="px-1 py-0.5 rounded bg-[var(--surface)]">
										moon run :dev
									</code>
								</li>
							</ol>
						</div>

						<div className="flex gap-3 justify-center">
							<Button
								variant="secondary"
								onClick={() => navigate({ to: "/dashboard" })}
							>
								Back to Dashboard
							</Button>
							<Button onClick={handleDownload}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4 mr-2"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
									/>
								</svg>
								Download .zip
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		);
	}

	// Preview state (default)
	return (
		<div className="min-h-screen bg-[var(--bg-base)]">
			{/* Header */}
			<header className="border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-sm sticky top-0 z-10">
				<div className="page-wrap py-4 flex items-center justify-between">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => navigate({ to: "/dashboard" })}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						Back
					</Button>
					<h1 className="text-lg font-semibold text-[var(--sea-ink)]">
						{project?.name}
					</h1>
					<div className="w-20" />
				</div>
			</header>

			{/* Main Content */}
			<main className="page-wrap py-8">
				<div className="max-w-3xl mx-auto">
					<div className="mb-6 text-center">
						<h1 className="text-2xl font-bold text-[var(--sea-ink)] mb-2">
							Review Your Workspace
						</h1>
						<p className="text-[var(--sea-ink-soft)]">
							AI has designed a Moon monorepo based on your description. Review
							the specification below before generating.
						</p>
					</div>

					{openspec && <OpenSpecPreview openspec={openspec} />}

					{/* Actions */}
					<div className="mt-8 flex justify-center gap-4">
						<Button
							variant="secondary"
							size="lg"
							onClick={() => navigate({ to: "/dashboard" })}
							disabled={confirmGenerate.isPending}
						>
							Cancel
						</Button>
						<Button
							size="lg"
							isLoading={confirmGenerate.isPending}
							onClick={() => confirmGenerate.mutate()}
						>
							Generate Workspace
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
