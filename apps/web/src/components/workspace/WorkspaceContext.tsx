/**
 * Workspace Context
 *
 * Shared state for the workspace layout.
 * Manages selected file, generation state, and active message.
 */

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from "react";
import type { ProjectFile } from "../../lib/api";

export interface WorkspaceState {
	// Currently selected file for preview
	selectedFile: ProjectFile | null;
	setSelectedFile: (file: ProjectFile | null) => void;

	// Generation state
	isGenerating: boolean;
	setIsGenerating: (isGenerating: boolean) => void;

	// Active chat message with file changes
	activeMessageId: string | null;
	setActiveMessageId: (id: string | null) => void;

	// Messages with file changes (for highlighting in explorer)
	messagesWithChanges: Set<string>;
	addMessageWithChanges: (messageId: string) => void;
	removeMessageWithChanges: (messageId: string) => void;

	// Project data
	project: {
		id: string;
		name: string;
		description: string;
		status: "draft" | "generated" | "refined";
		_count?: {
			versions: number;
			files: number;
			messages: number;
		};
	} | null;
	setProject: (project: WorkspaceState["project"]) => void;
}

const WorkspaceContext = createContext<WorkspaceState | null>(null);

export interface WorkspaceProviderProps {
	children: ReactNode;
	project: WorkspaceState["project"];
}

export function WorkspaceProvider({
	children,
	project,
}: WorkspaceProviderProps) {
	const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
	const [messagesWithChanges, setMessagesWithChanges] = useState<Set<string>>(
		new Set(),
	);
	const [currentProject, setCurrentProject] = useState(project);

	const addMessageWithChanges = (messageId: string) => {
		setMessagesWithChanges((prev) => new Set(prev).add(messageId));
	};

	const removeMessageWithChanges = (messageId: string) => {
		setMessagesWithChanges((prev) => {
			const next = new Set(prev);
			next.delete(messageId);
			return next;
		});
	};

	const setProject = useCallback((project: WorkspaceState["project"]) => {
		setCurrentProject(project);
	}, []);

	return (
		<WorkspaceContext.Provider
			value={{
				selectedFile,
				setSelectedFile,
				isGenerating,
				setIsGenerating,
				activeMessageId,
				setActiveMessageId,
				messagesWithChanges,
				addMessageWithChanges,
				removeMessageWithChanges,
				project: currentProject,
				setProject,
			}}
		>
			{children}
		</WorkspaceContext.Provider>
	);
}

export function useWorkspace() {
	const context = useContext(WorkspaceContext);
	if (!context) {
		throw new Error("useWorkspace must be used within WorkspaceProvider");
	}
	return context;
}
