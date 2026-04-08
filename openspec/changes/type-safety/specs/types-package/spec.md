# Types Package Structure

**Status:** Planned
**Type:** Structure
**Module:** type-safety

---

## Purpose

Define the structure of the `packages/types` output package and how it's used across the monorepo.

**PRD Reference:** Sections 5.1, 5.2.

---

## Package Structure

```
packages/types/
├── src/
│   └── index.ts         ← AI-generated [AI]
├── package.json         ← Template [T]
└── tsconfig.json        ← Template [T]
```

---

## `packages/types/package.json`

```json
{
  "name": "@project/types",
  "version": "0.0.1",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "@prisma/client": "*"
  }
}
```

---

## `packages/types/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "references": []
}
```

---

## Generated `packages/types/src/index.ts`

```typescript
/**
 * MoonForge Shared Types
 * Auto-generated from Prisma schema.
 * DO NOT EDIT MANUALLY — changes will be overwritten.
 */

// =============================================================================
// Prisma Types — Re-exported from @prisma/client
// =============================================================================

export type {
  User,
  Product,
  Order,
  // ... all models from Prisma schema
} from "@prisma/client";

// =============================================================================
// API Types — Stable interface for API responses
// =============================================================================

export namespace Api {
  // ---------------------------------------------------------------------------
  // Model Types — Mirror Prisma models for stable API interface
  // ---------------------------------------------------------------------------

  export namespace Models {
    export type User = {
      id: string;
      email: string;
      name: string | null;
      createdAt: Date;
      updatedAt: Date;
    };

    export type Product = {
      id: string;
      name: string;
      price: number;
      stock: number;
      categoryId: string | null;
      createdAt: Date;
      updatedAt: Date;
    };

    export type Order = {
      id: string;
      userId: string;
      status: "pending" | "paid" | "shipped" | "delivered";
      total: number;
      createdAt: Date;
      updatedAt: Date;
    };
  }

  // ---------------------------------------------------------------------------
  // Metadata Types
  // ---------------------------------------------------------------------------

  export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  export type CursorMeta = {
    nextCursor: string | null;
  };

  export type TimestampMeta = {
    timestamp: string;
  };

  // ---------------------------------------------------------------------------
  // Response Types
  // ---------------------------------------------------------------------------

  export type ApiResponse<T> = {
    success: true;
    data: T;
    meta: (PaginationMeta | CursorMeta) & TimestampMeta;
  };

  export type ApiError = {
    success: false;
    error: {
      code: string;
      message: string;
    };
    meta: TimestampMeta;
  };

  export type ApiResult<T> = ApiResponse<T> | ApiError;

  // ---------------------------------------------------------------------------
  // Project & Version Types
  // ---------------------------------------------------------------------------

  export type ProjectStatus = "draft" | "generated" | "refined";

  export type Project = {
    id: string;
    name: string;
    description: string;
    status: ProjectStatus;
    createdAt: Date;
    updatedAt: Date;
  };

  export type ProjectVersion = {
    id: string;
    versionNumber: number;
    label: string | null;
    createdAt: Date;
  };

  // ---------------------------------------------------------------------------
  // File Types — Used by file explorer UI
  // ---------------------------------------------------------------------------

  export type FileSource = "template" | "ai_generated" | "modified";

  export type FileEntry = {
    path: string;
    name: string;
    directory: string;
    size: number;
    fileSource: FileSource;
  };

  // ---------------------------------------------------------------------------
  // Chat Types — Used by chatbot UI
  // ---------------------------------------------------------------------------

  export type MessageRole = "user" | "assistant";

  export type ChatMessage = {
    id: string;
    role: MessageRole;
    content: string;
    fileChanges: string[] | null;
    createdAt: Date;
  };

  // ---------------------------------------------------------------------------
  // Generation Types — Used by generation flow
  // ---------------------------------------------------------------------------

  export type GenerationResult = {
    projectId: string;
    versionId: string;
    versionNumber: number;
    filesGenerated: number;
    summary: string;
  };

  export type RefineResult = {
    projectId: string;
    versionId: string;
    versionNumber: number;
    filesChanged: string[];
    summary: string;
  };
}
```

---

## Usage Across Apps

### In `apps/api` (Backend)

```typescript
import type { Api, Project } from "@project/types";

// Use Api namespace types in routes
const getProject = async (id: string): Promise<Api.ApiResponse<Project>> => {
  const project = await prisma.projects.findUnique({ where: { id } });
  return {
    success: true,
    data: project as Project,
    meta: { timestamp: new Date().toISOString() },
  };
};
```

### In `apps/web` (Frontend)

```typescript
import type { Api, Project, FileEntry } from "@project/types";

// Use types for API response handling
const { data: projects } = useLoaderData<typeof loader>();
const typedProjects: Api.Models.Project[] = projects;

// Use FileEntry type in file explorer
const files: FileEntry[] = response.data;
```

---

## Template vs Generated Files

| File | Status | Source |
|------|--------|--------|
| `packages/types/src/index.ts` | `[AI]` | AI-generated from Prisma schema |
| `packages/types/package.json` | `[T]` | Template — never changes |
| `packages/types/tsconfig.json` | `[T]` | Template — never changes |

---

## pnpm Workspace Configuration

Ensure `packages/types` is part of the workspace:

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

This allows both `apps/api` and `apps/web` to import from `@project/types` via workspace protocol.
