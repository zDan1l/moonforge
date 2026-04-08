# Types Generation

**Status:** Planned
**Type:** Feature
**Module:** type-safety

---

## Purpose

Specification for how `packages/types/src/index.ts` is generated and auto-updated when the Prisma schema changes.

**PRD Reference:** Sections 3.2, 5.2, 7.2.

---

## Files

| File | Purpose |
|------|---------|
| `packages/generator/src/prompts/setup.ts` | Updated with types generation instruction |
| `packages/generator/src/prompts/refine.ts` | Updated with types update instruction |

---

## Types File Template

The template placeholder for `packages/types/src/index.ts`:

```typescript
/**
 * MoonForge Shared Types
 * Auto-generated from Prisma schema.
 * DO NOT EDIT MANUALLY — changes will be overwritten.
 */

// =============================================================================
// Prisma Types
// =============================================================================

export type { /* AI will fill in Prisma model types */ } from "@prisma/client";

// =============================================================================
// API Types
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
    // Additional models will be added by AI
  }

  export type PaginationMeta = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };

  export type ApiResponse<T> = {
    success: boolean;
    data: T;
    meta?: PaginationMeta & { timestamp: string };
  };

  export type Project = {
    id: string;
    name: string;
    description: string;
    status: "draft" | "generated" | "refined";
    createdAt: Date;
    updatedAt: Date;
  };
}
```

---

## AI Prompt Update — Setup

### Changes to `packages/generator/src/prompts/setup.ts`

Add to the files to generate list:

```typescript
// In setup.ts, update SETUP_SYSTEM_PROMPT:
export const SETUP_SYSTEM_PROMPT = `...
## Files to Generate
1. prisma/schema.prisma
2. apps/api/src/modules/{module}/*.ts
3. packages/types/src/index.ts
   - Re-export all Prisma models as Api.Models namespace
   - Include Api namespace with ApiResponse<T>, PaginationMeta
   - Add Project, ProjectVersion types
   - Include FileSource type for UI badges`;

// Update ClaudeOutputSchema to include types validation
export const ClaudeOutputSchema = z.object({
  files: z.array(
    z.object({
      path: z.string(),
      content: z.string(),
      source: z.enum(["template", "ai_generated", "modified"]),
    })
  ),
  summary: z.string(),
});
```

### Validation Rule

After parsing AI output, validate that `packages/types/src/index.ts` is present in files:

```typescript
const typesFile = output.files.find(
  (f) => f.path === "packages/types/src/index.ts"
);

if (!typesFile) {
  throw new AppError(
    "AI output missing packages/types/src/index.ts. Types must be generated.",
    500,
    "MISSING_TYPES"
  );
}

// Validate types file contains expected patterns
if (!typesFile.content.includes("export namespace Api")) {
  throw new AppError(
    "Types file missing Api namespace",
    500,
    "INVALID_TYPES"
  );
}
```

---

## AI Prompt Update — Refine

### Changes to `packages/generator/src/prompts/refine.ts`

Update the "Common Refinements" section:

```typescript
export const REFINE_SYSTEM_PROMPT = `...
## Common Refinements
- Add new model → schema.prisma + module files + packages/types/src/index.ts
- Add field to model → schema.prisma + types + affected modules
- Add new route → module routes file + schema
- Rename model → schema.prisma + all module references + types

## Types Update Rule
When the Prisma schema is modified:
1. Update packages/types/src/index.ts with new/updated model types
2. Keep existing types that are not affected
3. Always maintain Api namespace with ApiResponse<T>`;
```

### Conditional Types Update

In `generateRefine()`, check if schema changed:

```typescript
// In generateRefine() — check if types need update
const schemaChanged = output.files.some(
  (f) => f.path === "prisma/schema.prisma"
);

const typesFile = output.files.find(
  (f) => f.path === "packages/types/src/index.ts"
);

// If schema changed but types not in output, regenerate types
if (schemaChanged && !typesFile) {
  // Trigger types regeneration (could be done by AI or a helper)
  const regeneratedTypes = await regenerateTypesFromSchema(schemaContent);
  output.files.push(regeneratedTypes);
}
```

---

## Expected AI Output Format

When the AI generates the types file, it should follow this structure:

```json
{
  "path": "packages/types/src/index.ts",
  "content": "export namespace Api { ... }",
  "source": "ai_generated"
}
```

The types file path is always `packages/types/src/index.ts` regardless of whether it's setup or refine.

## Integration with File Storage

The types file is stored like any other generated file:

```typescript
// In generateSetup() or generateRefine()
for (const file of output.files) {
  await storeFile(version.id, {
    path: file.path,
    content: file.content,
    source: file.source,
  });
}
```

---

## Verification Checklist

After generation, verify:

- [ ] `packages/types/src/index.ts` exists in generated files
- [ ] File contains `export namespace Api`
- [ ] File contains `export type` for all Prisma models
- [ ] File contains `ApiResponse<T>` type
- [ ] API can import from `packages/types`
- [ ] Web can import from `packages/types`
