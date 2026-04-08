const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function fetchAPI<T>(url: string, options?: RequestInit): Promise<T> {
	const response = await fetch(`${API_BASE_URL}${url}`, {
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
		...options,
	});

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}

	return response.json() as Promise<T>;
}

// Types based on requirement.md
export interface Project {
	id: string;
	name: string;
	description: string;
	status:
		| "PENDING"
		| "PREVIEWING"
		| "GENERATING"
		| "GENERATED"
		| "MODIFIED"
		| "FAILED";
	createdAt: string;
	updatedAt: string;
}

export interface OpenSpec {
	projectName: string;
	modules: Array<{
		name: string;
		namePascal: string;
		nameSingular: string;
		description: string;
		prismaModelName: string;
		endpoints: string[];
	}>;
	prismaModels: Array<{
		name: string;
		tableName: string;
		fields: Array<{
			name: string;
			type: string;
			isOptional: boolean;
			isUnique: boolean;
			attributes: string[];
		}>;
		relations: Array<{
			fieldName: string;
			modelName: string;
			type: string;
			foreignKey?: string;
		}>;
	}>;
	frontendPages: Array<{
		path: string;
		description: string;
	}>;
}

export interface ProjectFile {
	path: string;
	mimeType: string;
}

export interface GenerateProgressEvent {
	type: "file_start" | "file_complete" | "file_error" | "done" | "error";
	file?: string;
	total: number;
	completed: number;
	message?: string;
}

// API Functions
export const api = {
	// Projects
	getProjects: () => fetchAPI<Project[]>("/api/projects"),
	createProject: (data: { name: string; description: string }) =>
		fetchAPI<Project>("/api/projects", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	getProject: (id: string) => fetchAPI<Project>(`/api/projects/${id}`),
	deleteProject: (id: string) =>
		fetchAPI<void>(`/api/projects/${id}`, { method: "DELETE" }),

	// Generate
	generateSpec: (id: string) =>
		fetchAPI<OpenSpec>(`/api/projects/${id}/generate-spec`, { method: "POST" }),
	confirmGenerate: (id: string) =>
		fetchAPI<{ message: string }>(`/api/projects/${id}/confirm-generate`, {
			method: "POST",
		}),

	// Files
	getProjectFiles: (id: string) =>
		fetchAPI<ProjectFile[]>(`/api/projects/${id}/files`),

	// Export (returns blob for download)
	exportProject: async (id: string): Promise<Blob> => {
		const response = await fetch(`${API_BASE_URL}/api/projects/${id}/export`);
		if (!response.ok) throw new Error("Export failed");
		return response.blob();
	},

	// SSE for progress
	connectProgress: (id: string): EventSource => {
		return new EventSource(
			`${API_BASE_URL}/api/projects/${id}/generate/progress`,
		);
	},
};
