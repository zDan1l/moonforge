import { File, FileCode, Folder } from "lucide-react";
import { FileSourceBadge } from "./Badge";

export type FileSource = "template" | "ai_generated" | "modified";

export interface FileTreeItemProps {
	name: string;
	path: string;
	fileSource?: FileSource;
	isActive?: boolean;
	isDirectory?: boolean;
	onClick?: (path: string) => void;
	className?: string;
}

function getFileIcon({
	name,
	isDirectory,
}: {
	name: string;
	isDirectory?: boolean;
}) {
	if (isDirectory) {
		return Folder;
	}

	// Determine icon based on file extension
	const ext = name.split(".").pop()?.toLowerCase();

	const iconMap: Record<string, typeof FileCode> = {
		ts: FileCode,
		tsx: FileCode,
		js: FileCode,
		jsx: FileCode,
		mjs: FileCode,
		tsconfig: FileCode,
		json: FileCode,
		prisma: FileCode,
		yml: FileCode,
		yaml: FileCode,
	};

	const Icon = iconMap[ext || ""] || File;
	return Icon;
}

export function FileTreeItem({
	name,
	path,
	fileSource,
	isActive = false,
	isDirectory = false,
	onClick,
	className = "",
}: FileTreeItemProps) {
	const Icon = getFileIcon({ name, isDirectory });

	return (
		<button
			type="button"
			onClick={() => onClick?.(path)}
			className={`group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-all duration-150 ${
				isActive
					? "bg-[var(--lagoon)]/12 text-[var(--lagoon-deep)]"
					: "text-[var(--sea-ink-soft)] hover:bg-[var(--surface)] hover:text-[var(--sea-ink)]"
			} ${className}`}
		>
			<Icon
				className={`h-4 w-4 flex-shrink-0 ${
					isActive
						? "text-[var(--lagoon-deep)]"
						: "text-[var(--sea-ink-soft)] group-hover:text-[var(--sea-ink)]"
				}`}
			/>
			<span className="truncate">{name}</span>
			{fileSource && !isDirectory && (
				<FileSourceBadge
					source={fileSource}
					size="sm"
					className="ml-auto flex-shrink-0"
				/>
			)}
		</button>
	);
}

export interface FileTreeProps {
	files: Array<{
		name: string;
		path: string;
		isDirectory?: boolean;
		fileSource?: FileSource;
	}>;
	activePath?: string;
	onFileClick?: (path: string) => void;
	className?: string;
}

export function FileTree({
	files,
	activePath,
	onFileClick,
	className = "",
}: FileTreeProps) {
	return (
		<div className={`flex flex-col gap-0.5 p-2 ${className}`}>
			{files.length === 0 ? (
				<div className="py-8 text-center">
					<Folder className="mx-auto mb-2 h-8 w-8 text-[var(--sea-ink-soft)]" />
					<p className="text-sm text-[var(--sea-ink-soft)]">No files yet</p>
					<p className="mt-1 text-xs text-[var(--sea-ink-soft)]/60">
						Generate your project to see files
					</p>
				</div>
			) : (
				files.map((file) => (
					<FileTreeItem
						key={file.path}
						name={file.name}
						path={file.path}
						fileSource={file.fileSource}
						isActive={activePath === file.path}
						isDirectory={file.isDirectory}
						onClick={onFileClick}
					/>
				))
			)}
		</div>
	);
}

// Empty state component for file tree
export interface FileTreeEmptyProps {
	className?: string;
}

export function FileTreeEmpty({ className = "" }: FileTreeEmptyProps) {
	return (
		<div className={`py-8 text-center ${className}`}>
			<Folder className="mx-auto mb-2 h-8 w-8 text-[var(--sea-ink-soft)]" />
			<p className="text-sm text-[var(--sea-ink-soft)]">No files yet</p>
			<p className="mt-1 text-xs text-[var(--sea-ink-soft)]/60">
				Generate your project to see files
			</p>
		</div>
	);
}
