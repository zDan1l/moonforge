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
		list: (projectId: string, versionId?: string) => {
			const searchParams = versionId ? `?version_id=${versionId}` : "";
			return apiRequest<ProjectFile[]>(
				`/projects/${projectId}/files${searchParams}`,
			);
		},

		get: (projectId: string, path: string) =>
			apiRequest<ProjectFile>(
				`/projects/${projectId}/files/${encodeURIComponent(path)}`,
			),
	},
};

// Export types for use in components
export type { CreateProjectInput, ListProjectsQuery, UpdateProjectInput };
