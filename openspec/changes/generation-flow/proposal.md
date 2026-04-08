## Why

MoonForge needs a Generation Flow to orchestrate the entire Setup and Refine phases. This spec covers:

1. **Generate API** — REST endpoint to trigger monorepo generation
2. **Template Merge** — Combine AI-generated files with template base
3. **File Storage** — Persist generated files to database

**PRD Reference:** Sections 2.3 (Dua Fase Utama), 3.1 (Fase 1 — Setup), 3.2 (Fase 2 — Refine), 8.2 (Logika Penyimpanan File).

## Capabilities

### New Capabilities

- `generate-api`: REST endpoint to trigger Setup or Refine generation
- `template-merge`: Merge AI-generated files with template base
- `file-storage`: Persist generated files to `project_files` table

### Modified Capabilities

- `ai-integration`: AI client and prompts are ready; this spec uses them
- `projects-module`: Projects module provides CRUD; this spec manages versions

## Impact

**Affected Code:**

- `apps/api/src/modules/generate/generate.routes.ts` — New; generation API endpoint
- `apps/api/src/modules/generate/generate.service.ts` — New; orchestration logic
- `packages/generator/src/merger.ts` — New; template merge logic
- `packages/generator/src/files.ts` — New; file storage utilities

**New Module Structure:**

```
apps/api/src/modules/
└── generate/
    ├── generate.routes.ts     # POST /api/generate/setup
    │                           POST /api/generate/refine
    └── generate.service.ts    # Orchestration logic
```

**Dependencies:**

- `ai-integration`: Claude client + prompts
- `projects-module`: Project versioning
- `packages/generator`: Template files + merge logic

## Generation Flow

### Setup Phase Flow

```
1. User POST /api/generate/setup { projectId, description }
2. Service calls Claude with setup prompt
3. Parse Claude JSON output
4. For each file in output:
   a. Check if template exists → merge with AI content
   b. Store in project_files table
5. Create initial version (version_number=1)
6. Update project status to "generated"
7. Return { files, summary }
```

### Refine Phase Flow

```
1. User POST /api/generate/refine { projectId, request }
2. Service fetches current project files from DB
3. Service calls Claude with refine prompt + existing files
4. Parse Claude JSON output
5. Create new version (version_number+1)
6. For each file in output:
   a. Update existing file or create new
   b. Set file_source = 'modified'
7. Update project status to "refined"
8. Return { files, summary }
```

## Out of Scope (Separate Specs)

- File download as .zip (deferred to Files Module)
- Streaming generation (deferred to Web App spec)
- Real-time progress updates (deferred post-MVP)
