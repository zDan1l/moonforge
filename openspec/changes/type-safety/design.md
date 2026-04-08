## Context

**Current State:**

- PRD Section 5.2 defines `packages/types/src/index.ts` as an AI-generated file
- PRD Section 3.2 and 7.2 require auto-update when Prisma schema changes
- Prompt templates (ai-integration) instruct AI to generate types
- No explicit types-generator implementation exists

**PRD Requirements:**

- `packages/types/src/index.ts` re-exports Prisma types + utility types
- Types auto-update when schema changes (setup or refine)
- Types available across apps via pnpm workspace

## Goals / Non-Goals

**Goals:**

- Generate `packages/types/src/index.ts` with Prisma re-exports and utility types
- Integrate types generation into generation flow (after schema change)
- Include common utility types used across API and frontend
- Handle partial schema updates (only affected types regenerate)

**Non-Goals:**

- Type-level runtime validation (Zod already handles this)
- Frontend-specific type generation (beyond Prisma re-exports)
- Type generation for generated API clients (handled by Hono RPC)
- Schema migration SQL generation (post-MVP)

## Decisions

### 1. Types Generation Source

**Decision:** AI generates types content directly in `generateSetup()` / `generateRefine()` flow.

**Rationale:**

- AI has full context of Prisma schema and project structure
- Consistent with existing prompt templates (ai-integration) which already instruct AI to generate `packages/types/src/index.ts`
- No separate "type generator" step needed — AI output includes types file

### 2. Types Content Structure

**Decision:** `packages/types/src/index.ts` contains re-exports + utility types.

**Content:**
```typescript
// Re-exports from Prisma (via generated client)
export type { User, Product, Order } from "@prisma/client";

// Namespaced types for API responses
export namespace Types {
  export type User = {
    id: string;
    email: string;
    name: string | null;
    createdAt: Date;
  };
}

// Utility types
export type Pagination = { page: number; limit: number; total: number };
export type ApiResponse<T> = { success: boolean; data: T; meta?: Meta };
```

### 3. Auto-Update Trigger Point

**Decision:** Types regenerated when Prisma schema is in the changed files list.

**Rationale:**

- During setup: all files generated fresh, types included
- During refine: if schema.prisma is in `filesChanged`, re-generate types
- AI prompt instructs: "If changing Prisma schema, update corresponding types"

### 4. Cross-App Type Sharing

**Decision:** `packages/types` is a pnpm workspace package, imported by both `apps/api` and `apps/web`.

**Rationale:**

- pnpm workspace allows `packages/types` to be imported as `"@project/types"`
- Frontend uses types for API response shapes
- API uses types for internal consistency

## Types Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    generation-flow                            │
│                                                              │
│  generateSetup() / generateRefine()                         │
│       │                                                      │
│       ├── AI generates files including:                      │
│       │   ├── prisma/schema.prisma                           │
│       │   ├── packages/types/src/index.ts  ← AI-generated   │
│       │   └── ...                                           │
│       │                                                      │
│       └── storeFile() → saved to DB                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                 AI Prompt (setup.ts / refine.ts)             │
│                                                              │
│  Include in output:                                          │
│  - packages/types/src/index.ts with Prisma re-exports       │
│  - Update types when schema changes                         │
└─────────────────────────────────────────────────────────────┘
```

## Output File Structure

```
packages/types/
├── src/
│   └── index.ts         ← AI-generated, re-exports + utilities
├── package.json         ← Template [T]
└── tsconfig.json        ← Template [T]
```

## `packages/types/src/index.ts` Content

```typescript
/**
 * MoonForge Shared Types
 *
 * Auto-generated from Prisma schema.
 * DO NOT EDIT MANUALLY — changes will be overwritten.
 */

// =============================================================================
// Prisma Types — Re-exported from @prisma/client
// =============================================================================

export type {
  // User model
  User,
  UserCreateInput,
  UserUpdateInput,
  UserWhereInput,
  UserWhereUniqueInput,
  UserOrderByWithRelationInput,
  UserRelationFilter,
} from "@prisma/client";

// =============================================================================
// Namespaced API Types — Stable interface for API responses
// =============================================================================

export namespace Api {
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
  }

  // =============================================================================
  // Pagination & Cursor
  // =============================================================================

  export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  export type CursorMeta = {
    nextCursor: string | null;
  };

  // =============================================================================
  // API Response Shape
  // =============================================================================

  export type ApiResponse<T> = {
    success: boolean;
    data: T;
    meta?: PaginationMeta | CursorMeta & { timestamp: string };
  };

  export type ApiError = {
    success: false;
    error: {
      code: string;
      message: string;
    };
    meta: { timestamp: string };
  };

  // =============================================================================
  // Project & Version Types
  // =============================================================================

  export type Project = {
    id: string;
    name: string;
    description: string;
    status: "draft" | "generated" | "refined";
    createdAt: Date;
    updatedAt: Date;
  };

  export type ProjectVersion = {
    id: string;
    versionNumber: number;
    label: string | null;
    createdAt: Date;
  };

  // =============================================================================
  // File Source Labels (UI)
  // =============================================================================

  export type FileSource = "template" | "ai_generated" | "modified";

  export type FileEntry = {
    path: string;
    name: string;
    directory: string;
    size: number;
    fileSource: FileSource;
  };
}
```

## AI Prompt for Types Generation

In `packages/generator/src/prompts/setup.ts` and `refine.ts`, the prompt instructs:

```typescript
// In setup prompt:
export const SETUP_SYSTEM_PROMPT = `...
3. packages/types/src/index.ts
   - Re-export all Prisma models as Types namespace
   - Include Api namespace with API response types
   - Add utility types: Pagination, ApiResponse, etc.`;

// In refine prompt:
export const REFINE_SYSTEM_PROMPT = `...
## Common Refinements
- Add new model → schema.prisma + new module files + types  ← important!
- If changing Prisma schema, update packages/types/src/index.ts`;
```

## Risks / Trade-offs

### Trade-off: AI-Generated vs Prisma-CLI-Generated

**Decision:** AI generates types file directly in the JSON output.

**Rationale:**

- Simpler than running `prisma generate` during generation
- Works without Prisma CLI in the build environment
- Consistent with other AI-generated files in the output

**Risk:** AI might generate incorrect types if schema is complex.
**Mitigation:** AI prompt provides explicit instructions for types format.

### Trade-off: Manual Edit vs Auto-Overwrite

**Decision:** Types file is auto-overwritten on each generation.

**Rationale:**

- Single source of truth: Prisma schema
- Prevents manual edits from going out of sync
- Consistent with PRD "auto-update" requirement

**Risk:** User edits to types are lost.
**Mitigation:** User should edit Prisma schema, not types directly.
