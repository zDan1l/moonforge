## Context

**Current State:**

- `apps/api` has Projects CRUD module
- `packages/generator` has template files (backend, frontend, root)
- `ai-integration` spec defines Claude client + prompts (pending implementation)

**PRD Requirements:**

- Setup Phase: User description → AI generates → Files stored → Project ready
- Refine Phase: User request → AI modifies → New version → Project updated

## Goals / Non-Goals

**Goals:**

- Orchestrate full generation flow (AI → Parse → Store)
- Merge AI files with template base
- Version management for files
- Update project status appropriately

**Non-Goals:**

- Streaming responses (MVP returns complete response)
- Real-time progress updates (MVP waits for completion)
- .zip download (deferred to Files Module)
- Frontend UI (deferred to Web App spec)

## Decisions

### 1. Generation as Single Request

**Decision:** MVP uses synchronous request/response for generation.

**Rationale:**

- Simplest implementation
- Frontend polls or refreshes after completion
- Streaming can be added post-MVP

### 2. Template Merge Strategy

**Decision:** Template files are copied as-is; AI generates overrides.

**Rationale:**

- Template files marked `[T]` are fixed infrastructure
- AI only generates `[AI]` and `[modified]` files
- Merge = copy template + add AI files

### 3. Version Management

**Decision:** Each generation (Setup or Refine) creates a new version.

**Rationale:**

- PRD Section 8.2 defines copy-on-write versioning
- New version = increment `version_number`
- All files from that generation belong to that version

### 4. File Source Tracking

**Decision:** Track file source as `template | ai_generated | modified`.

**Rationale:**

- PRD Section 8 requires this for UI display
- Setup: AI files = `ai_generated`
- Refine: changed files = `modified`

## API Endpoints

### POST /api/generate/setup

**Description:** Generate initial monorepo from user description.

**Request:**

```json
{
  "projectId": "uuid",
  "description": "SaaS B2B with users, subscriptions, dashboard"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "versionId": "uuid",
    "versionNumber": 1,
    "filesGenerated": 15,
    "summary": "Generated SaaS B2B structure with 3 modules"
  }
}
```

### POST /api/generate/refine

**Description:** Apply surgical changes to existing project.

**Request:**

```json
{
  "projectId": "uuid",
  "request": "Add products module with name, price, stock fields"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "projectId": "uuid",
    "versionId": "uuid",
    "versionNumber": 2,
    "filesChanged": 4,
    "summary": "Added products module with CRUD operations"
  }
}
```

## File Structure

```
apps/api/src/modules/
└── generate/
    ├── generate.routes.ts     # API endpoints
    └── generate.service.ts    # Business logic

packages/generator/src/
├── index.ts                   # Exports
├── merger.ts                  # Template merge logic
└── files.ts                  # File storage utilities
```

## Generation Service Logic

### generateSetupService

```typescript
async function generateSetupService(projectId: string, description: string) {
  // 1. Get project
  const project = await projectsService.getProject(projectId);

  // 2. Build prompt with user description
  const prompt = buildSetupPrompt({
    userDescription: description,
    projectName: project.name,
  });

  // 3. Call Claude
  const response = await sendMessage({ messages: [{ role: "user", content: prompt }] });

  // 4. Parse JSON output
  const output = ClaudeOutputSchema.parse(JSON.parse(response.content));

  // 5. Create new version
  const version = await prisma.project_versions.create({
    data: {
      project_id: projectId,
      version_number: await getNextVersionNumber(projectId),
      label: "Initial setup",
    },
  });

  // 6. Store files
  for (const file of output.files) {
    await storeFile(version.id, file);
  }

  // 7. Update project status
  await projectsService.updateProject(projectId, { status: "generated" });

  return { versionId: version.id, filesGenerated: output.files.length, summary: output.summary };
}
```

### generateRefineService

```typescript
async function generateRefineService(projectId: string, request: string) {
  // 1. Get project with latest version files
  const project = await projectsService.getProject(projectId);
  const latestVersion = project.versions[0];
  const existingFiles = await getFilesForVersion(latestVersion.id);

  // 2. Build prompt with existing files
  const prompt = buildRefinePrompt({
    userRequest: request,
    existingFiles,
    projectContext: project.description,
  });

  // 3. Call Claude
  const response = await sendMessage({ messages: [{ role: "user", content: prompt }] });

  // 4. Parse JSON output
  const output = ClaudeOutputSchema.parse(JSON.parse(response.content));

  // 5. Create new version
  const version = await prisma.project_versions.create({
    data: {
      project_id: projectId,
      version_number: await getNextVersionNumber(projectId),
      label: `Refine: ${request.slice(0, 50)}...`,
    },
  });

  // 6. Copy existing files to new version
  await copyFilesToVersion(latestVersion.id, version.id);

  // 7. Update/modify files from AI output
  for (const file of output.files) {
    await storeFile(version.id, { ...file, source: "modified" });
  }

  // 8. Update project status
  await projectsService.updateProject(projectId, { status: "refined" });

  return { versionId: version.id, filesChanged: output.files.length, summary: output.summary };
}
```

## Template Merge

```typescript
import * as fs from "fs/promises";
import * as path from "path";

async function mergeWithTemplate(aiFiles: GeneratedFile[]) {
  const merged: FileEntry[] = [];

  // 1. Copy all template files
  const templateDir = path.join(__dirname, "templates");
  const templateFiles = await getAllFiles(templateDir);

  for (const file of templateFiles) {
    const relativePath = path.relative(templateDir, file.path);
    const content = await fs.readFile(file.path, "utf-8");
    merged.push({
      path: relativePath,
      content,
      source: "template",
    });
  }

  // 2. Override with AI-generated files
  for (const aiFile of aiFiles) {
    const existing = merged.findIndex((f) => f.path === aiFile.path);
    if (existing >= 0) {
      merged[existing] = aiFile; // Override
    } else {
      merged.push(aiFile); // Add new
    }
  }

  return merged;
}
```

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `@anthropic-ai/sdk` | Claude API (from ai-integration) |
| `projects-module` | Project CRUD + versioning |
| `packages/generator/templates` | Template files |

## Risks / Trade-offs

### Risk: Claude JSON Parsing

**Risk:** Claude may not always return valid JSON.

**Mitigation:**

- Include JSON format instruction in prompt
- Try-catch with fallback message
- Retry once on parse failure

### Trade-off: Sync vs Async

**Decision:** MVP uses synchronous generation.

**Rationale:** Simpler implementation. Async/streaming can be added post-MVP.

## Open Questions

None — design is straightforward for MVP scope.
