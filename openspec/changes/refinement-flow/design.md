## Context

**Current State:**

- `generation-flow` spec defines `generateRefine()` function
- `chat-module` can store user and assistant messages
- `projects-module` manages project status

**PRD Requirements:**

- Surgical file modifications (not full regeneration)
- New version on each refinement
- Chat history for continuity
- File changes tracked per message

## Goals / Non-Goals

**Goals:**

- Orchestrate end-to-end refinement flow
- Coordinate AI generation, file storage, and chat updates
- Create new version with copy-on-write
- Track file changes per refinement

**Non-Goals:**

- Diff calculation/display (handled by frontend)
- Streaming responses
- Real-time progress updates

## Decisions

### 1. Refinement Flow Steps

**Decision:** Orchestrate refinement in this sequence:

1. Store user message in chat_messages
2. Call `generateRefine()` to create new version
3. Store AI response with file_changes in chat_messages
4. Return result with file changes

**Rationale:**

- Ensures chat history is complete
- File changes tracked alongside AI response
- Easy to trace which files changed per message

### 2. File Changes Tracking

**Decision:** File changes come from `generateRefine()` output.

**Output includes:**

```typescript
{
  versionId: string;
  versionNumber: number;
  filesChanged: string[];  // Array of file paths
  summary: string;
}
```

### 3. Chat Message Flow

**Decision:** Store both user request and AI response.

```
User: "Add products module"
  ↓
Store: { role: "user", content: "Add products module" }
  ↓
AI Generation: generateRefine()
  ↓
Store: { role: "assistant", content: "Generated...", file_changes: [...] }
  ↓
Return: { versionId, filesChanged, summary }
```

## Refinement Service

```typescript
import { prisma } from "@/lib/prisma.js";
import { generateRefine } from "@/modules/generate/generate.service.js";
import { createMessage } from "@/modules/chat/chat.service.js";

interface RefineRequest {
  projectId: string;
  request: string;  // User's natural language request
}

interface RefineResult {
  versionId: string;
  versionNumber: number;
  filesChanged: string[];
  summary: string;
  messages: {
    userMessage: object;
    assistantMessage: object;
  };
}

/**
 * Execute full refinement flow
 */
export async function executeRefine(request: RefineRequest): Promise<RefineResult> {
  const { projectId, request: userRequest } = request;

  // 1. Get current version for context
  const currentVersion = await prisma.project_versions.findFirst({
    where: { project_id: projectId },
    orderBy: { version_number: "desc" },
  });

  if (!currentVersion) {
    throw new AppError("Project has no versions", 400, "NO_VERSIONS");
  }

  // 2. Store user message
  const userMessage = await createMessage(projectId, {
    role: "user",
    content: userRequest,
    versionId: currentVersion.id,
  });

  // 3. Execute AI refinement (creates new version)
  const generationResult = await generateRefine(projectId, userRequest);

  // 4. Store assistant message with file changes
  const assistantMessage = await createMessage(projectId, {
    role: "assistant",
    content: generationResult.summary,
    versionId: generationResult.versionId,
    fileChanges: generationResult.filesChanged,
  });

  // 5. Return combined result
  return {
    versionId: generationResult.versionId,
    versionNumber: generationResult.versionNumber,
    filesChanged: generationResult.filesChanged,
    summary: generationResult.summary,
    messages: {
      userMessage,
      assistantMessage,
    },
  };
}
```

## API Endpoint

### POST /api/refine

**Description:** Execute full refinement flow (store message → generate → store response).

**Request:**

```json
{
  "projectId": "uuid",
  "request": "Add products module with name, price, stock"
}
```

**Response (200):**

```json
{
  "success": true,
  "data": {
    "versionId": "uuid",
    "versionNumber": 2,
    "filesChanged": [
      "apps/api/prisma/schema.prisma",
      "apps/api/src/modules/products/products.routes.ts",
      "apps/api/src/modules/products/products.schema.ts",
      "apps/api/src/modules/products/products.service.ts"
    ],
    "summary": "Added products module with CRUD operations",
    "messages": {
      "userMessage": {
        "id": "uuid",
        "role": "user",
        "content": "Add products module with name, price, stock"
      },
      "assistantMessage": {
        "id": "uuid",
        "role": "assistant",
        "content": "Added products module...",
        "file_changes": ["..."]
      }
    }
  }
}
```

## File Structure

The refinement flow reuses existing modules:

```
apps/api/src/
└── modules/
    ├── generate/           # Existing: generateRefine()
    ├── chat/              # Existing: createMessage()
    └── projects/          # Existing: updateProject()

# Refinement flow is an orchestration layer
apps/api/src/modules/refinement/
└── refinement.service.ts  # NEW: Orchestration logic
```

## Integration with Generation Flow

The refinement flow depends on `generateRefine()` from generation-flow:

```typescript
// In refinement.service.ts
import { generateRefine } from "@/modules/generate/generate.service.js";

// The generateRefine() already:
// 1. Creates new version
// 2. Copies existing files (copy-on-write)
// 3. Updates modified files
// 4. Returns file changes list
```

## Risks / Trade-offs

### Trade-off: Sync vs Async

**Decision:** MVP uses synchronous refinement.

**Rationale:** Simpler implementation. Frontend can poll for completion.

## Open Questions

None — design reuses existing modules effectively.
