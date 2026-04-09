/**
 * API Client for MoonForge Backend
 * Type-safe API client for backend communication
 */

// Base URL configuration
// SSR runs on server, needs full URL; client-side uses relative URL
const getBaseUrl = () => {
	if (typeof window === "undefined") {
		return process.env.API_URL || "http://localhost:5000/api";
	}
	return "/api";
};

// Type definitions for API responses
export interface ApiResponse<T> {
	success: boolean;
	data: T;
	meta: {
		timestamp: string;
		[key: string]: unknown;
	};
}

export interface ApiError {
	success: false;
	error: {
		code: string;
		message: string;
		details?: unknown;
	};
	meta: {
		timestamp: string;
	};
}

// Project types
export interface Project {
	id: string;
	name: string;
	description: string;
	status: "draft" | "generated" | "refined";
	created_at: string;
	updated_at: string;
	_count?: {
		versions: number;
		files: number;
		messages: number;
	};
	versions?: ProjectVersion[];
}

export interface ProjectVersion {
	id: string;
	version_number: number;
	label: string | null;
	created_at: string;
}

export interface ProjectFile {
	id: string;
	path: string;
	content: string;
	file_source: "template" | "ai_generated" | "modified";
	updated_at: string;
}

export interface ChatMessage {
	id: string;
	project_id: string;
	version_id: string | null;
	role: "user" | "assistant";
	content: string;
	file_changes: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	> | null;
	created_at: string;
}

// List projects query params
export interface ListProjectsQuery {
	status?: "draft" | "generated" | "refined";
	orderBy?: "created_at" | "updated_at" | "name";
	order?: "asc" | "desc";
}

// Create project input
export interface CreateProjectInput {
	name: string;
	description: string;
}

// Update project input
export interface UpdateProjectInput {
	name?: string;
	description?: string;
	status?: "draft" | "generated" | "refined";
}

// Generate input
export interface GenerateSetupInput {
	projectId: string;
	description: string;
	additionalContext?: string;
}

export interface GenerateRefineInput {
	projectId: string;
	request: string;
}

export interface GenerateSetupResult {
	projectId: string;
	versionId: string;
	versionNumber: number;
	filesGenerated: number;
	summary: string;
}

export interface GenerateRefineResult {
	projectId: string;
	versionId: string;
	versionNumber: number;
	filesChanged: number;
	fileChanges: Record<
		string,
		{ path: string; change: "created" | "modified" | "deleted" }
	>;
	summary: string;
}

// File tree node type from API
export interface FileTreeNode {
	name: string;
	path: string;
	type: "file" | "directory";
	source: "template" | "ai_generated" | "modified";
	children?: FileTreeNode[];
}

// Generic API request function
async function apiRequest<T>(
	endpoint: string,
	options: RequestInit = {},
): Promise<T> {
	const baseUrl = getBaseUrl();
	const url = `${baseUrl}${endpoint}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	// Check if response is JSON
	const contentType = response.headers.get("content-type");
	if (!contentType?.includes("application/json")) {
		const text = await response.text();
		throw new Error(
			`API returned non-JSON response. URL: ${url}. Status: ${response.status}. ` +
				`Is the backend running? ${text.slice(0, 100)}${text.length > 100 ? "..." : ""}`,
		);
	}

	const data = (await response.json()) as ApiResponse<T> | ApiError;

	if (!response.ok || !("success" in data) || !data.success) {
		const error = data as ApiError;
		throw new Error(error.error?.message || "API request failed");
	}

	return data.data;
}

// API client methods
export const api = {
	projects: {
		list: (query?: ListProjectsQuery) => {
			const searchParams = query
				? "?" +
					new URLSearchParams(
						Object.entries(query).filter(([, v]) => v !== undefined) as [
							string,
							string,
						][],
					).toString()
				: "";
			return apiRequest<Project[]>(`/projects${searchParams}`);
		},

		get: (id: string) => apiRequest<Project>(`/projects/${id}`),

		create: (data: CreateProjectInput) =>
			apiRequest<Project>("/projects", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		update: (id: string, data: UpdateProjectInput) =>
			apiRequest<Project>(`/projects/${id}`, {
				method: "PATCH",
				body: JSON.stringify(data),
			}),

		delete: (id: string) =>
			apiRequest<{ id: string; deleted: boolean }>(`/projects/${id}`, {
				method: "DELETE",
			}),
	},

	files: {
		list: (
			projectId: string,
			query?: { versionId?: string; directory?: string },
		) => {
			const searchParams =
				query && Object.keys(query).length > 0
					? "?" +
						new URLSearchParams(
							Object.entries(query).filter(([, v]) => v !== undefined) as [
								string,
								string,
							][],
						).toString()
					: "";
			return apiRequest<FileTreeNode[]>(
				`/projects/${projectId}/files${searchParams}`,
			);
		},

		get: (projectId: string, path: string, versionId?: string) => {
			const searchParams = versionId ? `?versionId=${versionId}` : "";
			return apiRequest<ProjectFile>(
				`/projects/${projectId}/files/${encodeURIComponent(path)}${searchParams}`,
			);
		},

		download: (projectId: string, versionId?: string) => {
			// Returns a URL for direct browser download
			const params = versionId ? `?versionId=${versionId}` : "";
			return `/api/projects/${projectId}/download${params}`;
		},
	},

	chat: {
		list: (
			projectId: string,
			query?: { versionId?: string; limit?: number },
		) => {
			const searchParams =
				query && Object.keys(query).length > 0
					? "?" +
						new URLSearchParams(
							Object.entries(query).filter(([, v]) => v !== undefined) as [
								string,
								string,
							][],
						).toString()
					: "";
			return apiRequest<ChatMessage[]>(
				`/projects/${projectId}/messages${searchParams}`,
			);
		},

		create: (
			projectId: string,
			data: {
				role: "user" | "assistant";
				content: string;
				versionId?: string;
				fileChanges?: Record<
					string,
					{ path: string; change: "created" | "modified" | "deleted" }
				>;
			},
		) =>
			apiRequest<ChatMessage>(`/projects/${projectId}/messages`, {
				method: "POST",
				body: JSON.stringify(data),
			}),
	},

	generate: {
		setup: (data: GenerateSetupInput) =>
			apiRequest<GenerateSetupResult>("/generate/setup", {
				method: "POST",
				body: JSON.stringify(data),
			}),

		refine: (data: GenerateRefineInput) =>
			apiRequest<GenerateRefineResult>("/generate/refine", {
				method: "POST",
				body: JSON.stringify(data),
			}),
	},
};

// Export types for use in components
export type {
	CreateProjectInput,
	FileTreeNode,
	GenerateRefineInput,
	GenerateSetupInput,
	ListProjectsQuery,
	UpdateProjectInput,
};
