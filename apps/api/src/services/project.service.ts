import { prisma } from "../lib/prisma.js";
import type { Project, ProjectFile, ProjectStatus } from "../generated/prisma";

export interface CreateProjectInput {
  name: string;
  description: string;
}

export interface UpdateProjectInput {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  openspec?: unknown;
}

export interface ProjectWithFiles extends Project {
  files: ProjectFile[];
}

export class ProjectService {
  /**
   * Get all projects
   */
  async getAllProjects(): Promise<Project[]> {
    return prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Get project by ID with files
   */
  async getProjectById(id: string): Promise<ProjectWithFiles | null> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!project) {
      return null;
    }

    return project as ProjectWithFiles;
  }

  /**
   * Create a new project
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    return prisma.project.create({
      data: {
        name: input.name,
        description: input.description,
        status: "PENDING",
      },
    });
  }

  /**
   * Update project
   */
  async updateProject(id: string, input: UpdateProjectInput): Promise<Project | null> {
    try {
      return await prisma.project.update({
        where: { id },
        data: input,
      });
    } catch {
      return null;
    }
  }

  /**
   * Update project status
   */
  async updateProjectStatus(
    id: string,
    status: ProjectStatus,
    openspec?: unknown,
  ): Promise<Project | null> {
    try {
      return await prisma.project.update({
        where: { id },
        data: {
          status,
          ...(openspec !== undefined && { openspec: openspec as never }),
        },
      });
    } catch {
      return null;
    }
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<boolean> {
    try {
      await prisma.project.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get project files
   */
  async getProjectFiles(id: string): Promise<ProjectFile[]> {
    const project = await prisma.project.findUnique({
      where: { id },
      include: { files: true },
    });

    if (!project) {
      return [];
    }

    return project.files;
  }

  /**
   * Save or update a project file
   */
  async saveProjectFile(
    projectId: string,
    path: string,
    content: string,
    mimeType: string,
  ): Promise<ProjectFile> {
    return prisma.projectFile.upsert({
      where: {
        projectId_path: {
          projectId,
          path,
        },
      },
      create: {
        projectId,
        path,
        content,
        mimeType,
        size: content.length,
      },
      update: {
        content,
        mimeType,
        size: content.length,
      },
    });
  }

  /**
   * Delete all files for a project
   */
  async deleteProjectFiles(projectId: string): Promise<void> {
    await prisma.projectFile.deleteMany({
      where: { projectId },
    });
  }

  /**
   * Get file content for export
   */
  async getProjectFilesForExport(id: string): Promise<ProjectFile[]> {
    return prisma.projectFile.findMany({
      where: { projectId },
      orderBy: { path: "asc" },
    });
  }
}

export const projectService = new ProjectService();
