/**
 * Workspace Header Component
 *
 * Header for the workspace with back navigation, project name, and actions.
 */

import { Link } from "@tanstack/react-router";
import { ArrowLeft, Download } from "lucide-react";
import { api } from "../../lib/api";
import { useWorkspace } from "./WorkspaceContext";

export interface WorkspaceHeaderProps {
	onDownload?: () => void;
}

export function WorkspaceHeader({ onDownload }: WorkspaceHeaderProps) {
	const { project } = useWorkspace();

	if (!project) {
		return null;
	}

	const handleDownload = () => {
		// Download current project as zip
		if (onDownload) {
			onDownload();
		} else {
			// Default behavior: trigger download via API
			const downloadUrl = api.files.download(project.id);
			window.open(downloadUrl, "_blank");
		}
	};

	return (
		<div className="workspace-header flex h-12 items-center justify-between border-b border-[var(--line)] bg-[var(--header-bg)] px-4">
			<div className="flex items-center gap-3">
				<Link
					to="/projects"
					className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm text-[var(--sea-ink-soft)] transition hover:bg-[var(--surface)] hover:text-[var(--sea-ink)]"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>Back</span>
				</Link>

				<span className="text-[var(--line)]">|</span>

				<div className="flex items-center gap-2">
					<h1 className="text-sm font-semibold text-[var(--sea-ink)]">
						{project.name}
					</h1>
					<VersionBadge status={project.status} />
				</div>
			</div>

			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={handleDownload}
					className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-transparent px-3 py-1.5 text-sm text-[var(--sea-ink)] transition hover:bg-[var(--surface)] hover:text-[var(--sea-ink)]"
				>
					<Download className="h-4 w-4" />
					Download
				</button>
			</div>
		</div>
	);
}

function VersionBadge({
	status,
}: {
	status: "draft" | "generated" | "refined";
}) {
	const config = {
		draft: {
			label: "Draft",
			className:
				"rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-2 py-0.5 text-xs font-medium text-[var(--sea-ink-soft)]",
		},
		generated: {
			label: "Generated",
			className:
				"rounded-full border border-[var(--lagoon)]/30 bg-[var(--lagoon)]/10 px-2 py-0.5 text-xs font-medium text-[var(--lagoon-deep)]",
		},
		refined: {
			label: "Refined",
			className:
				"rounded-full border border-[var(--palm)]/30 bg-[var(--palm)]/10 px-2 py-0.5 text-xs font-medium text-[var(--palm)]",
		},
	} as const;

	const { label, className } = config[status];

	return <span className={className}>{label}</span>;
}
