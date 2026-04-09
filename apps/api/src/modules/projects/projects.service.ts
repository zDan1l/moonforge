import { prisma } from "../../lib/prisma.js";
import { NotFoundError } from "../../middleware/error-handler.js";

// ============================================================================
// Types
// ============================================================================

export type ListProjectsQuery = {
	status?: "draft" | "generated" | "refined";
	orderBy?: "created_at" | "updated_at" | "name";
	order?: "asc" | "desc";
};

export type CreateProjectInput = {
	name: string;
	description: string;
};

export type UpdateProjectInput = {
	name?: string;
	description?: string;
	status?: "draft" | "generated" | "refined";
};

// ============================================================================
// Service Functions
// ============================================================================

/**
 * List all projects with optional filtering and sorting
 */
export async function listProjects(query: ListProjectsQuery) {
	const projects = await prisma.projects.findMany({
		where: query.status ? { status: query.status } : undefined,
		orderBy: { [query.orderBy || "created_at"]: query.order || "desc" },
		select: {
			id: true,
			name: true,
			description: true,
			status: true,
			created_at: true,
			updated_at: true,
			_count: {
				select: { versions: true, files: true, messages: true },
			},
		},
	});

	return projects;
}

/**
 * Get a single project by ID with its versions
 */
export async function getProject(id: string) {
	const project = await prisma.projects.findUnique({
		where: { id },
		include: {
			versions: {
				orderBy: { version_number: "desc" },
				select: {
					id: true,
					version_number: true,
					label: true,
					created_at: true,
				},
			},
		},
	});

	if (!project) {
		throw new NotFoundError("Project");
	}

	return project;
}

/**
 * Create a new project with an initial version
 * Uses a transaction to ensure atomicity
 */
export async function createProject(data: CreateProjectInput) {
	const result = await prisma.$transaction(async (tx) => {
		const project = await tx.projects.create({
			data: {
				name: data.name,
				description: data.description,
			},
		});

		const version = await tx.project_versions.create({
			data: {
				project_id: project.id,
				version_number: 1,
				label: "Initial setup",
			},
		});

		return { project, version };
	});

	// Return the created project with its versions
	const project = await prisma.projects.findUnique({
		where: { id: result.project.id },
		include: {
			versions: {
				orderBy: { version_number: "desc" },
				select: {
					id: true,
					version_number: true,
					label: true,
					created_at: true,
				},
			},
		},
	});

	return project;
}

/**
 * Update a project's metadata
 */
export async function updateProject(id: string, data: UpdateProjectInput) {
	const existing = await prisma.projects.findUnique({ where: { id } });

	if (!existing) {
		throw new NotFoundError("Project");
	}

	const project = await prisma.projects.update({
		where: { id },
		data,
		include: {
			versions: {
				orderBy: { version_number: "desc" },
				select: {
					id: true,
					version_number: true,
					label: true,
					created_at: true,
				},
			},
		},
	});

	return project;
}

/**
 * Delete a project (cascade handles versions, files, messages)
 */
export async function deleteProject(id: string) {
	const existing = await prisma.projects.findUnique({ where: { id } });

	if (!existing) {
		throw new NotFoundError("Project");
	}

	await prisma.projects.delete({ where: { id } });

	return { id, deleted: true };
}
