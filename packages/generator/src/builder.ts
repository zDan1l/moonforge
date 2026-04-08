/**
 * File Structure Builder
 * Functions for building the MoonForge monorepo folder structure
 */

import type { GeneratedFile } from "./index.js";

/**
 * Validate project name (no special characters, no path traversal)
 */
export function validateProjectName(name: string): boolean {
	// Must be valid directory name
	const validPattern = /^[a-zA-Z0-9][a-zA-Z0-9-_]*$/;
	return validPattern.test(name) && name.length <= 255;
}

/**
 * Sanitize project name for safe directory creation
 */
export function sanitizeProjectName(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/**
 * Build project structure paths
 * Maps template paths to final project paths
 */
export interface ProjectStructureOptions {
	projectName: string;
	projectSlug: string;
}

export function buildProjectStructure(
	options: ProjectStructureOptions,
): {
	rootPath: string;
	folderPaths: string[];
	templateMapping: Map<string, string>;
} {
	const { projectName, projectSlug } = options;

	// Root path for the project
	const rootPath = projectSlug;

	// All folder paths that need to be created
	const folderPaths = [
		rootPath,
		`${rootPath}/.moon`,
		`${rootPath}/apps`,
		`${rootPath}/apps/api`,
		`${rootPath}/apps/api/prisma`,
		`${rootPath}/apps/api/src`,
		`${rootPath}/apps/api/src/generated`,
		`${rootPath}/apps/api/src/generated/prisma`,
		`${rootPath}/apps/api/src/modules`,
		`${rootPath}/apps/api/src/lib`,
		`${rootPath}/apps/platform`,
		`${rootPath}/apps/platform/src`,
		`${rootPath}/apps/platform/src/routes`,
		`${rootPath}/apps/platform/src/routes/dashboard`,
		`${rootPath}/apps/platform/src/components`,
		`${rootPath}/apps/platform/src/components/ui`,
		`${rootPath}/apps/platform/src/lib`,
		`${rootPath}/apps/admin`,
		`${rootPath}/apps/admin/src`,
		`${rootPath}/apps/admin/src/routes`,
		`${rootPath}/apps/admin/src/components`,
		`${rootPath}/apps/admin/src/components/ui`,
		`${rootPath}/packages`,
		`${rootPath}/packages/types`,
		`${rootPath}/packages/types/src`,
	];

	// Map template paths to output paths
	const templateMapping = new Map<string, string>();

	// Root templates
	templateMapping.set("root/package.json", `${rootPath}/package.json`);
	templateMapping.set("root/pnpm-workspace.yaml", `${rootPath}/pnpm-workspace.yaml`);
	templateMapping.set("root/tsconfig.json", `${rootPath}/tsconfig.json`);
	templateMapping.set("root/.moon", `${rootPath}/.moon`);
	templateMapping.set("root/.moon/workspace.yml", `${rootPath}/.moon/workspace.yml`);
	templateMapping.set("root/.moon/tasks.yml", `${rootPath}/.moon/tasks.yml`);
	templateMapping.set("root/biome.json", `${rootPath}/biome.json`);
	templateMapping.set("root/.gitignore", `${rootPath}/.gitignore`);
	templateMapping.set("root/.env.example", `${rootPath}/.env.example`);
	templateMapping.set("root/docker-compose.yml", `${rootPath}/docker-compose.yml`);
	templateMapping.set("root/docker-compose.dev.yaml", `${rootPath}/docker-compose.dev.yaml`);
	templateMapping.set("root/moon.yml", `${rootPath}/moon.yml`);

	// Backend templates
	templateMapping.set("backend/package.json", `${rootPath}/apps/api/package.json`);
	templateMapping.set("backend/tsconfig.json", `${rootPath}/apps/api/tsconfig.json`);
	templateMapping.set("backend/prisma.config.ts", `${rootPath}/apps/api/prisma.config.ts`);
	templateMapping.set("backend/prisma/schema.prisma", `${rootPath}/apps/api/prisma/schema.prisma`);
	templateMapping.set("backend/src/index.ts", `${rootPath}/apps/api/src/index.ts`);
	templateMapping.set("backend/src/lib/prisma.ts", `${rootPath}/apps/api/src/lib/prisma.ts`);

	// Frontend templates (platform)
	templateMapping.set("frontend/package.json", `${rootPath}/apps/platform/package.json`);
	templateMapping.set("frontend/tsconfig.json", `${rootPath}/apps/platform/tsconfig.json`);
	templateMapping.set("frontend/vite.config.ts", `${rootPath}/apps/platform/vite.config.ts`);
	templateMapping.set("frontend/public", `${rootPath}/apps/platform/public`);

	// Admin templates
	templateMapping.set("admin/package.json", `${rootPath}/apps/admin/package.json`);
	templateMapping.set("admin/tsconfig.json", `${rootPath}/apps/admin/tsconfig.json`);

	// Types package
	templateMapping.set("types/package.json", `${rootPath}/packages/types/package.json`);
	templateMapping.set("types/tsconfig.json", `${rootPath}/packages/types/tsconfig.json`);
	templateMapping.set("types/src/index.ts", `${rootPath}/packages/types/src/index.ts`);

	return {
		rootPath,
		folderPaths,
		templateMapping,
	};
}

/**
 * Transform template paths to project paths using the mapping
 */
export function transformTemplatePaths(
	files: GeneratedFile[],
	templateMapping: Map<string, string>,
): GeneratedFile[] {
	return files.map((file) => {
		// Try to find exact match
		let outputPath = templateMapping.get(file.path);

		// If no exact match, try to find by checking if the path starts with a mapped directory
		if (!outputPath) {
			for (const [templatePath, projectPath] of templateMapping) {
				if (file.path.startsWith(templatePath)) {
					outputPath = file.path.replace(templatePath, projectPath);
					break;
				}
			}
		}

		// If still no match, use the original path but prefix with project name
		if (!outputPath) {
			// Keep the original path structure
			outputPath = file.path;
		}

		return {
			...file,
			path: outputPath,
		};
	});
}

/**
 * Create folder structure for a generated project
 * Returns array of folder paths that would be created
 */
export function getFolderStructure(projectSlug: string): string[] {
	const structure = buildProjectStructure({
		projectName: projectSlug,
		projectSlug,
	});
	return structure.folderPaths;
}

/**
 * Validate a path to prevent directory traversal attacks
 */
export function isValidOutputPath(path: string): boolean {
	// No absolute paths
	if (path.startsWith("/") || /^[a-zA-Z]:/.test(path)) {
		return false;
	}

	// No parent directory traversal
	if (path.includes("..")) {
		return false;
	}

	// No null bytes
	if (path.includes("\0")) {
		return false;
	}

	return true;
}

/**
 * Generate root-level config files for a new project
 */
export function generateRootConfigFiles(projectName: string, projectSlug: string): GeneratedFile[] {
	const rootFiles: GeneratedFile[] = [];

	// Root package.json
	rootFiles.push({
		path: `${projectSlug}/package.json`,
		content: JSON.stringify(
			{
				name: projectSlug,
				version: "1.0.0",
				private: true,
				packageManager: "pnpm@10.28.0",
				scripts: {
					dev: "pnpm -r --parallel run dev",
					build: "pnpm -r --filter=!web run build",
					"api:dev": "pnpm --filter=api dev",
					"web:dev": "pnpm --filter=web dev",
					lint: "pnpm -r run lint",
					"lint:fix": "pnpm -r run lint:fix",
					prepare: "husky",
					"db:generate": "pnpm --filter=api prisma generate",
					"db:migrate": "pnpm --filter=api prisma migrate dev",
					"db:push": "pnpm --filter=api prisma db push",
				},
				devDependencies: {
					"@biomejs/biome": "^2.4.10",
					husky: "^9.1.7",
				},
			},
			null,
			2,
		),
		source: "template",
		isBinary: false,
	});

	// pnpm-workspace.yaml
	rootFiles.push({
		path: `${projectSlug}/pnpm-workspace.yaml`,
		content: "packages:\n  - 'apps/*'\n  - 'packages/*'\n",
		source: "template",
		isBinary: false,
	});

	// .env.example
	rootFiles.push({
		path: `${projectSlug}/.env.example`,
		content: `# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moonforge?schema=public"

# API
API_PORT=5000
NODE_ENV=development
`,
		source: "template",
		isBinary: false,
	});

	// .gitignore
	rootFiles.push({
		path: `${projectSlug}/.gitignore`,
		content: `node_modules/
dist/
.env
*.log
.DS_Store
coverage/
.turbo/
.cache/
.moon/
!.moon/tasks.yml
!.moon/workspace.yml
`,
		source: "template",
		isBinary: false,
	});

	return rootFiles;
}
