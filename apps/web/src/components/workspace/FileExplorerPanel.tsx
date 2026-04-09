/**
 * File Explorer Panel Component
 *
 * Right panel for displaying project file tree.
 * Shows files with [T], [AI], and modified badges.
 */

import { ChevronDown, ChevronRight, File, FileText, Folder } from "lucide-react";
import { useEffect, useState } from "react";
import type { FileTreeNode } from "../../lib/api";
import { api } from "../../lib/api";
import { useWorkspace } from "./WorkspaceContext";
import { FileSourceBadge } from "../ui/Badge";

export function FileExplorerPanel() {
	const { project, selectedFile, setSelectedFile } = useWorkspace();
	const [files, setFiles] = useState<FileTreeNode[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [expandedDirs, setExpandedDirs] = useState<Set<string>>(new Set());

	// Load files when project changes
	useEffect(() => {
		if (!project) return;

		const loadFiles = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const data = await api.files.list(project.id);
				setFiles(data);

				// Auto-expand first level directories
				const firstLevelDirs = data
					.filter((f) => f.type === "directory")
					.map((f) => f.path);
				setExpandedDirs(new Set(firstLevelDirs));
			} catch (err) {
				console.error("Failed to load files:", err);
				setError(err instanceof Error ? err.message : "Failed to load files");
			} finally {
				setIsLoading(false);
			}
		};

		loadFiles();
	}, [project]);

	const toggleDirectory = (path: string) => {
		setExpandedDirs((prev) => {
			const next = new Set(prev);
			if (next.has(path)) {
				next.delete(path);
			} else {
				next.add(path);
			}
			return next;
		});
	};

	const handleFileClick = async (node: FileTreeNode) => {
		if (!project || node.type !== "file") return;

		try {
			const fileData = await api.files.get(project.id, node.path);
			setSelectedFile({
				id: node.path,
				path: fileData.path,
				content: fileData.content,
				file_source: fileData.file_source,
				updated_at: new Date().toISOString(),
			});
		} catch (err) {
			console.error("Failed to load file:", err);
		}
	};

	return (
		<aside className="workspace-panel flex w-72 flex-shrink-0 flex-col border-r border-[var(--line)] bg-[var(--header-bg)]">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
				<h2 className="text-sm font-semibold text-[var(--sea-ink)]">Files</h2>
				{!isLoading && files.length > 0 && (
					<span className="text-xs text-[var(--sea-ink-soft)]">
						{countFiles(files)} file{countFiles(files) !== 1 ? "s" : ""}
					</span>
				)}
			</div>

			{/* Files Tree */}
			<div className="flex-1 overflow-auto p-2">
				{isLoading ? (
					<div className="flex h-full items-center justify-center">
						<div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--lagoon)]/30 border-t-[var(--lagoon)]" />
					</div>
				) : error ? (
					<div className="py-8 text-center text-sm text-[var(--palm)]">
						<FileText className="mx-auto mb-2 h-8 w-8" />
						<p>{error}</p>
					</div>
				) : files.length === 0 ? (
					<div className="flex h-full flex-col items-center justify-center text-center">
						<FileText className="mb-2 h-8 w-8 text-[var(--sea-ink-soft)]" />
						<p className="text-sm text-[var(--sea-ink-soft)]">No files yet</p>
						<p className="mt-1 text-xs text-[var(--sea-ink-soft)]">
							Generate your project to see files
						</p>
					</div>
				) : (
					<ul className="space-y-0.5">
						{files.map((node) => (
							<FileTreeNodeItem
								key={node.path}
								node={node}
								level={0}
								expandedDirs={expandedDirs}
								onToggleDir={toggleDirectory}
								onFileClick={handleFileClick}
								selectedPath={selectedFile?.path}
							/>
						))}
					</ul>
				)}
			</div>
		</aside>
	);
}

interface FileTreeNodeItemProps {
	node: FileTreeNode;
	level: number;
	expandedDirs: Set<string>;
	onToggleDir: (path: string) => void;
	onFileClick: (node: FileTreeNode) => void;
	selectedPath?: string;
}

function FileTreeNodeItem({
	node,
	level,
	expandedDirs,
	onToggleDir,
	onFileClick,
	selectedPath,
}: FileTreeNodeItemProps) {
	const isExpanded = expandedDirs.has(node.path);
	const isSelected = selectedPath === node.path;
	const paddingLeft = 8 + level * 16;

	const handleClick = () => {
		if (node.type === "directory") {
			onToggleDir(node.path);
		} else {
			onFileClick(node);
		}
	};

	return (
		<li>
			<button
				type="button"
				onClick={handleClick}
				className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1 text-left text-sm transition ${
					isSelected
						? "bg-[var(--lagoon)]/10 text-[var(--lagoon-deep)]"
						: "text-[var(--sea-ink-soft)] hover:bg-[var(--surface)]"
				}`}
				style={{ paddingLeft: `${paddingLeft}px` }}
			>
				{node.type === "directory" ? (
					<>
						{isExpanded ? (
							<ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
						) : (
							<ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
						)}
						<Folder
							className={`h-4 w-4 flex-shrink-0 ${
								isExpanded
									? "text-[var(--lagoon)]"
									: "text-[var(--sea-ink-soft)]"
							}`}
						/>
						<span className="truncate">{node.name}</span>
					</>
				) : (
					<>
						<span className="h-3.5 w-3.5 flex-shrink-0" />
						<File className="h-4 w-4 flex-shrink-0" />
						<span className="truncate">{node.name}</span>
						<FileSourceBadge source={node.source} size="sm" className="ml-auto" />
					</>
				)}
			</button>

			{node.type === "directory" && isExpanded && node.children && (
				<ul>
					{node.children.map((child) => (
						<FileTreeNodeItem
							key={child.path}
							node={child}
							level={level + 1}
							expandedDirs={expandedDirs}
							onToggleDir={onToggleDir}
							onFileClick={onFileClick}
							selectedPath={selectedPath}
						/>
					))}
				</ul>
			)}
		</li>
	);
}

function countFiles(nodes: FileTreeNode[]): number {
	let count = 0;
	for (const node of nodes) {
		if (node.type === "file") {
			count++;
		} else if (node.children) {
			count += countFiles(node.children);
		}
	}
	return count;
}
