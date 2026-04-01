# MoonForge — Technical Requirements & Development Roadmap

> **Versi Dokumen:** 1.0  
> **Status:** Pre-Development  
> **Tujuan:** Panduan teknikal lengkap untuk membangun MoonForge dari nol hingga MVP hackathon-ready dan production-ready

---

## Daftar Isi

1. [Ringkasan Eksekutif](#1-ringkasan-eksekutif)
2. [Arsitektur Sistem](#2-arsitektur-sistem)
3. [Database Schema Lengkap](#3-database-schema-lengkap)
4. [API Specification](#4-api-specification)
5. [AI & Prompt Engineering Requirements](#5-ai--prompt-engineering-requirements)
6. [Frontend Requirements](#6-frontend-requirements)
7. [Infrastructure Requirements](#7-infrastructure-requirements)
8. [Testing Strategy](#8-testing-strategy)
9. [Development Phases & Milestones](#9-development-phases--milestones)
10. [Definition of Done](#10-definition-of-done)
11. [Risk Register](#11-risk-register)

---

## 1. Ringkasan Eksekutif

### 1.1 Tujuan Utama

MoonForge adalah **persistent AI workspace** yang mengubah deskripsi natural language menjadi fullstack Moon monorepo yang langsung bisa dijalankan. Tujuan ini harus dijaga ketat di setiap keputusan teknikal:

- **Bukan** general-purpose code generator
- **Bukan** chatbot coding assistant
- **Adalah** opinionated generator + refiner untuk satu stack spesifik

### 1.2 North Star Metric

> File yang didownload user harus bisa berjalan dengan `pnpm install && moon run :dev` **tanpa error**, dari generate pertama hingga setelah 50 kali refine.

### 1.3 Tech Stack MoonForge Sendiri (Dogfooding)

| Layer | Tool | Versi |
|-------|------|-------|
| Monorepo | Moon + PNPM | Moon ^1.x, PNPM ^9.x |
| Frontend | Next.js App Router | ^15.x |
| Backend | Hono.js | ^4.x |
| Database | PostgreSQL | ^16.x |
| ORM | Prisma | ^5.x |
| AI | Claude API (Anthropic) | claude-sonnet-4 |
| Container | Docker + Kubernetes | K8s ^1.29 |
| Language | TypeScript | ^5.x strict mode |

---

## 2. Arsitektur Sistem

### 2.1 Monorepo Structure MoonForge

```
moonforge/
├── .moon/
│   ├── workspace.yml
│   └── tasks.yml
├── apps/
│   ├── web/                    ← Next.js 15 App Router (UI)
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── dashboard/      ← Project list
│   │   │   └── project/
│   │   │       └── [id]/       ← Editor + Chat
│   │   ├── components/
│   │   ├── lib/
│   │   └── moon.yml
│   └── api/                    ← Hono.js REST API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── projects/
│       │   │   ├── generate/
│       │   │   ├── refine/
│       │   │   └── export/
│       │   └── index.ts
│       └── moon.yml
├── packages/
│   ├── generator/              ← Core AI generation engine
│   │   ├── src/
│   │   │   ├── prompts/        ← Prompt templates per file type
│   │   │   ├── validators/     ← Code validation logic
│   │   │   ├── templates/      ← Static config templates
│   │   │   └── cascade/        ← Dependency graph resolver
│   │   └── package.json
│   ├── types/                  ← Shared TypeScript types
│   ├── ui/                     ← Shared React components
│   └── db/                     ← Prisma schema + client
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
└── infra/
    ├── k8s/
    │   ├── deployment.yaml
    │   ├── service.yaml
    │   └── ingress.yaml
    ├── Dockerfile.web
    └── Dockerfile.api
```

### 2.2 Data Flow Diagram

```
USER INPUT (natural language)
        │
        ▼
┌───────────────────┐
│   apps/web        │  Next.js UI
│   (frontend)      │
└────────┬──────────┘
         │ HTTP/REST
         ▼
┌───────────────────┐
│   apps/api        │  Hono.js
│   (backend)       │
└────────┬──────────┘
         │
    ┌────┴────────────────────────┐
    │                             │
    ▼                             ▼
┌──────────┐           ┌──────────────────┐
│ packages/│           │  Claude API       │
│ generator│ ◄────────►│  (Anthropic)      │
└──────────┘           └──────────────────┘
    │
    ├── validate (pre-save)
    │
    ▼
┌──────────────────┐
│   PostgreSQL      │  project_files (per path)
│   (packages/db)  │  chat_messages
└──────────────────┘  openspecs
```

### 2.3 Request Flow — Fase 1 Generate

```
1. POST /api/projects/generate
   body: { description: string }

2. api/generate module:
   a. Call Claude → generate OpenSpec JSON
   b. Return OpenSpec to client (preview state)

3. POST /api/projects/:id/confirm-generate
   (setelah user konfirmasi OpenSpec)

4. api/generate module:
   a. Untuk setiap file dalam rencana generate:
      i.  Render prompt template spesifik file tersebut
      ii. Call Claude → dapat content file
      iii. Run validator (Prisma syntax, TS syntax, etc.)
      iv. Jika gagal → retry max 3x dengan error sebagai konteks
      v.  Simpan ke project_files
   b. Emit SSE progress event ke frontend
   c. Return final file tree

5. POST /api/projects/:id/export
   a. Baca semua project_files dari DB
   b. Buat .zip file di memory
   c. Return sebagai file download
```

### 2.4 Request Flow — Fase 2 Refine

```
1. POST /api/projects/:id/chat
   body: { message: string }

2. api/refine module:
   a. Load seluruh project context dari DB
      - project_files (semua path + content)
      - openspec terbaru
      - chat_messages (history)
   b. Build context prompt dengan state lengkap
   c. Call Claude → dapat rencana perubahan (JSON)
   d. Return rencana ke client (preview/diff state)

3. POST /api/projects/:id/chat/:messageId/confirm
   (setelah user konfirmasi diff)

4. api/refine module:
   a. Untuk setiap file dalam rencana:
      i.  Jalankan surgical edit (bukan regenerate penuh)
      ii. Run validator
      iii. Retry jika gagal
      iv. Update row di project_files
   b. Catat file_changes di chat_messages
   c. Return updated diff view
```

---

## 3. Database Schema Lengkap

### 3.1 Prisma Schema

```prisma
// packages/db/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS ───────────────────────────────────────────────────

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  name         String?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  projects     Project[]
  sessions     Session[]

  @@map("users")
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ─── PROJECTS ────────────────────────────────────────────────

enum ProjectStatus {
  PENDING      // Deskripsi dimasukkan, belum generate
  PREVIEWING   // OpenSpec ditampilkan, menunggu konfirmasi
  GENERATING   // Sedang generate file
  GENERATED    // Generate selesai
  MODIFIED     // Sudah direfine setidaknya sekali
  FAILED       // Generate gagal
}

model Project {
  id          String        @id @default(cuid())
  userId      String
  name        String
  description String        @db.Text
  status      ProjectStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  user         User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  files        ProjectFile[]
  chatMessages ChatMessage[]
  openspecs    OpenSpec[]
  snapshots    ProjectSnapshot[]

  @@map("projects")
}

model ProjectFile {
  id        String   @id @default(cuid())
  projectId String
  path      String   // "apps/api/prisma/schema.prisma"
  content   String   @db.Text
  mimeType  String   @default("text/plain")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, path])  // Satu path unik per project
  @@map("project_files")
}

// Snapshot untuk undo functionality
model ProjectSnapshot {
  id        String   @id @default(cuid())
  projectId String
  label     String   // "Before: tambah tabel products"
  files     Json     // Array of { path, content }
  createdAt DateTime @default(now())

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("project_snapshots")
}

// ─── OPENSPEC ────────────────────────────────────────────────

model OpenSpec {
  id        String   @id @default(cuid())
  projectId String
  modules   Json     // Array of { name, description, endpoints }
  models    Json     // Array of { name, fields: { name, type, optional } }
  routes    Json     // Array of { method, path, description }
  pages     Json     // Array of { path, description }
  rawSpec   String   @db.Text  // Markdown representation untuk display
  version   Int      @default(1)
  createdAt DateTime @default(now())

  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("openspecs")
}

// ─── CHAT ────────────────────────────────────────────────────

enum MessageRole {
  USER
  ASSISTANT
}

enum MessageStatus {
  PENDING    // AI sedang memproses
  PREVIEWING // Rencana perubahan ditampilkan, menunggu konfirmasi
  CONFIRMED  // User konfirmasi, perubahan diterapkan
  REJECTED   // User reject perubahan
  ERROR      // AI gagal memproses
}

model ChatMessage {
  id          String        @id @default(cuid())
  projectId   String
  role        MessageRole
  content     String        @db.Text
  status      MessageStatus @default(PENDING)
  fileChanges Json?         // Array of { path, type: "added"|"modified"|"deleted", diff }
  errorDetail String?
  createdAt   DateTime      @default(now())

  project     Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@map("chat_messages")
}
```

### 3.2 Indeks yang Diperlukan

```sql
-- Untuk query file tree project
CREATE INDEX idx_project_files_project_id ON project_files(project_id);

-- Untuk chat history
CREATE INDEX idx_chat_messages_project_id_created ON chat_messages(project_id, created_at);

-- Untuk lookup file by path
CREATE INDEX idx_project_files_path ON project_files(project_id, path);
```

---

## 4. API Specification

### 4.1 Auth Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me
```

### 4.2 Project Endpoints

```
GET    /api/projects                          ← List semua project user
POST   /api/projects                          ← Buat project baru (simpan deskripsi)
GET    /api/projects/:id                      ← Detail project + metadata
DELETE /api/projects/:id                      ← Hapus project

POST   /api/projects/:id/generate-spec        ← Generate OpenSpec (preview)
POST   /api/projects/:id/confirm-generate     ← Konfirmasi OpenSpec → mulai generate
GET    /api/projects/:id/generate/progress    ← SSE stream progress generate

GET    /api/projects/:id/files                ← File tree (path + mimeType, no content)
GET    /api/projects/:id/files/:encodedPath   ← Isi satu file spesifik
GET    /api/projects/:id/export               ← Download .zip
```

### 4.3 Chat/Refine Endpoints

```
GET    /api/projects/:id/chat                 ← History chat
POST   /api/projects/:id/chat                 ← Kirim pesan, dapat rencana perubahan
POST   /api/projects/:id/chat/:msgId/confirm  ← Konfirmasi rencana perubahan
POST   /api/projects/:id/chat/:msgId/reject   ← Reject perubahan
POST   /api/projects/:id/undo                 ← Undo ke snapshot sebelumnya
```

### 4.4 Response Format Standard

```typescript
// Success
{
  success: true,
  data: T,
  meta?: {
    pagination?: { page, limit, total }
  }
}

// Error
{
  success: false,
  error: {
    code: string,      // "VALIDATION_ERROR" | "NOT_FOUND" | "AI_FAILURE" | ...
    message: string,
    details?: unknown
  }
}
```

### 4.5 SSE Progress Event Format

```typescript
// Stream event saat generate berjalan
interface GenerateProgressEvent {
  type: "file_start" | "file_complete" | "file_error" | "done" | "error"
  file?: string        // Path file yang sedang diproses
  total: number        // Total file yang akan dibuat
  completed: number    // File yang sudah selesai
  message?: string
}

// Contoh stream:
// data: {"type":"file_start","file":"apps/api/prisma/schema.prisma","total":24,"completed":0}
// data: {"type":"file_complete","file":"apps/api/prisma/schema.prisma","total":24,"completed":1}
// data: {"type":"done","total":24,"completed":24}
```

---

## 5. AI & Prompt Engineering Requirements

### 5.1 Dua Mode Pemanggilan Claude

**Mode 1: Generate (Fase 1)**
- Dipanggil per file type, bukan satu prompt untuk semua file
- Setiap file punya prompt template sendiri
- Output harus berupa konten file mentah (bukan JSON wrapper)

**Mode 2: Refine (Fase 2)**
- Dipanggil dengan konteks penuh project
- Output berupa JSON rencana perubahan, bukan konten file langsung
- Surgical — hanya file yang relevan

### 5.2 Prompt Templates (packages/generator/src/prompts/)

Setiap file type punya prompt template sendiri:

```
prompts/
├── openspec.ts          ← Generate OpenSpec dari deskripsi
├── prisma-schema.ts     ← Generate schema.prisma
├── hono-routes.ts       ← Generate {module}.routes.ts
├── hono-schema.ts       ← Generate {module}.schema.ts (Zod)
├── hono-service.ts      ← Generate {module}.service.ts
├── tanstack-page.ts     ← Generate halaman React
├── shared-types.ts      ← Generate packages/types/index.ts
├── moon-config.ts       ← Generate moon.yml files
├── refine-planner.ts    ← Analisis request refine → rencana JSON
└── refine-executor.ts   ← Execute surgical edit pada satu file
```

### 5.3 Struktur Prompt — OpenSpec Generator

```typescript
// packages/generator/src/prompts/openspec.ts

export function buildOpenSpecPrompt(description: string): string {
  return `
You are MoonForge, an AI that designs fullstack Moon monorepo architectures.

The user wants to build: "${description}"

Analyze this description and generate a structured OpenSpec in the following JSON format.
Do NOT include any explanation or markdown — respond ONLY with valid JSON.

{
  "projectName": "kebab-case-project-name",
  "modules": [
    {
      "name": "module-name",
      "description": "what this module does",
      "endpoints": ["GET /api/module", "POST /api/module", "GET /api/module/:id", ...]
    }
  ],
  "prismaModels": [
    {
      "name": "ModelName",
      "fields": [
        { "name": "id", "type": "String", "attributes": ["@id", "@default(cuid())"] },
        { "name": "email", "type": "String", "attributes": ["@unique"] },
        { "name": "createdAt", "type": "DateTime", "attributes": ["@default(now())"] }
      ],
      "relations": [
        { "field": "posts", "model": "Post", "type": "one-to-many" }
      ]
    }
  ],
  "frontendPages": [
    { "path": "/dashboard", "description": "Main dashboard" }
  ]
}

Rules:
- Module names must be lowercase, kebab-case
- Always include a User model with id, email, createdAt
- Always add standard CRUD endpoints for each module
- Relations must be explicitly defined and consistent
- Maximum 6 modules for MVP projects
`.trim()
}
```

### 5.4 Struktur Prompt — Prisma Schema Generator

```typescript
export function buildPrismaSchemaPrompt(openspec: OpenSpec): string {
  return `
You are generating a Prisma schema file for a Moon monorepo project.

OpenSpec:
${JSON.stringify(openspec, null, 2)}

Generate ONLY the content of schema.prisma — no markdown, no explanation.

Requirements:
1. Use PostgreSQL provider
2. Generator output: "prisma-client-js" with output = "../generated/prisma"
3. All models must have: id (String @id @default(cuid())), createdAt (DateTime @default(now())), updatedAt (DateTime @updatedAt)
4. Decimal fields use @db.Decimal(10, 2)
5. All relations must be bidirectional (both sides defined)
6. Use @@map("snake_case_table_name") for all models
7. Enums must use ALL_CAPS values
8. Optional fields marked with ?
`.trim()
}
```

### 5.5 Struktur Prompt — Refine Planner

```typescript
export function buildRefinePlannerPrompt(
  project: Project,
  allFiles: ProjectFile[],
  chatHistory: ChatMessage[],
  userRequest: string
): string {
  const fileTree = allFiles.map(f => f.path).join('\n')
  const prismaSchema = allFiles.find(f => f.path === 'apps/api/prisma/schema.prisma')?.content ?? ''
  const sharedTypes = allFiles.find(f => f.path === 'packages/types/src/index.ts')?.content ?? ''

  return `
You are MoonForge Refine, an AI that makes surgical edits to an existing Moon monorepo.

PROJECT: ${project.name}
DESCRIPTION: ${project.description}

CURRENT PRISMA SCHEMA:
\`\`\`prisma
${prismaSchema}
\`\`\`

CURRENT SHARED TYPES:
\`\`\`typescript
${sharedTypes}
\`\`\`

FILE TREE:
${fileTree}

CHAT HISTORY:
${chatHistory.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')}

USER REQUEST: "${userRequest}"

Analyze the request and respond ONLY with a JSON plan:
{
  "summary": "Short description of what will change",
  "filesToModify": [
    {
      "path": "apps/api/prisma/schema.prisma",
      "action": "modify",   // "modify" | "create" | "delete"
      "description": "Add Product model with name, price, stock fields",
      "instruction": "Detailed instruction for what to change in this file"
    }
  ],
  "warnings": ["Category model doesn't exist yet — will be created too"],
  "questions": ["Do you want me to also create the Category module with full CRUD?"]
}

Rules:
- Always include packages/types/src/index.ts in filesToModify if Prisma schema changes
- If adding a new Prisma model, always create: {module}.routes.ts, {module}.schema.ts, {module}.service.ts
- Never modify files unrelated to the request
- If unsure about scope, ask via "questions" field
- "instruction" must be specific enough for another AI to execute without ambiguity
`.trim()
}
```

### 5.6 Validation Pipeline (packages/generator/src/validators/)

```typescript
// validators/index.ts

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

export async function validateFile(path: string, content: string): Promise<ValidationResult> {
  if (path.endsWith('schema.prisma')) {
    return validatePrismaSchema(content)
  }
  if (path.endsWith('.ts') || path.endsWith('.tsx')) {
    return validateTypeScriptSyntax(content)
  }
  if (path.endsWith('package.json') || path.endsWith('.json')) {
    return validateJSON(content)
  }
  if (path.endsWith('.yml') || path.endsWith('.yaml')) {
    return validateYAML(content)
  }
  return { valid: true, errors: [], warnings: [] }
}

// Prisma validation: gunakan @prisma/internals untuk parse schema
async function validatePrismaSchema(content: string): Promise<ValidationResult> { ... }

// TS validation: gunakan typescript compiler API
async function validateTypeScriptSyntax(content: string): Promise<ValidationResult> { ... }
```

### 5.7 Retry Logic

```typescript
// generator/src/generateFile.ts

const MAX_RETRIES = 3

export async function generateFileWithRetry(
  prompt: string,
  validator: (content: string) => Promise<ValidationResult>,
  filePath: string
): Promise<string> {
  let lastError = ''

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const content = await callClaude(
      attempt === 1 ? prompt : `${prompt}\n\nPrevious attempt failed with error:\n${lastError}\n\nPlease fix this error and regenerate.`
    )

    const result = await validator(content)

    if (result.valid) {
      return content
    }

    lastError = result.errors.join('\n')

    if (attempt === MAX_RETRIES) {
      throw new GenerationError(`Failed to generate ${filePath} after ${MAX_RETRIES} attempts. Last error: ${lastError}`)
    }
  }

  throw new Error('Unreachable')
}
```

### 5.8 Dependency Graph untuk Cascade Update

```typescript
// generator/src/cascade/dependencyGraph.ts

// Ketika file A berubah, file mana yang harus ikut berubah?
const CASCADE_RULES: Record<string, string[]> = {
  'apps/api/prisma/schema.prisma': [
    'packages/types/src/index.ts',
    // Module files akan di-detect secara dinamis dari nama model
  ],
  'packages/types/src/index.ts': [
    // Tidak ada cascade — ini endpoint
  ],
}

// Untuk setiap model baru yang ditambahkan ke schema,
// generate 3 file baru: routes, schema (Zod), service
export function getRequiredNewFiles(newModelName: string, moduleName: string): string[] {
  return [
    `apps/api/src/modules/${moduleName}/${moduleName}.routes.ts`,
    `apps/api/src/modules/${moduleName}/${moduleName}.schema.ts`,
    `apps/api/src/modules/${moduleName}/${moduleName}.service.ts`,
  ]
}
```

---

## 6. Frontend Requirements

### 6.1 Pages & Routes (apps/web)

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── dashboard/
│   └── page.tsx                    ← List semua project
└── project/
    └── [id]/
        ├── page.tsx                ← Redirect ke /generate atau /editor
        ├── generate/
        │   └── page.tsx            ← OpenSpec preview + konfirmasi
        ├── editor/
        │   ├── page.tsx            ← File tree + file viewer
        │   └── [encodedPath]/
        │       └── page.tsx        ← Preview satu file
        └── chat/
            └── page.tsx            ← Refine chat interface
```

### 6.2 Key Components

```
components/
├── openspec/
│   ├── OpenSpecPreview.tsx         ← Card preview dengan modules, models, routes
│   └── OpenSpecEditor.tsx          ← Editable sebelum konfirmasi
├── file-tree/
│   ├── FileTree.tsx                ← Sidebar file explorer
│   ├── FileTreeNode.tsx
│   └── FilePreview.tsx             ← Content viewer dengan syntax highlighting
├── chat/
│   ├── ChatInterface.tsx           ← Chat container
│   ├── ChatMessage.tsx             ← Pesan individual
│   ├── DiffView.tsx                ← GitHub-style diff viewer
│   └── FileBadge.tsx               ← Clickable file path badge
├── generate/
│   ├── GenerateProgress.tsx        ← SSE-driven progress bar
│   └── GenerateComplete.tsx        ← Success state + download button
└── ui/
    ← shadcn/ui components
```

### 6.3 State Management

Gunakan **Zustand** untuk global state:

```typescript
interface ProjectStore {
  // Current project
  project: Project | null
  files: ProjectFile[]
  openspec: OpenSpec | null
  chatMessages: ChatMessage[]

  // UI state
  selectedFile: string | null
  generateProgress: { completed: number; total: number; currentFile: string }
  pendingDiff: FileChange[] | null  // Diff menunggu konfirmasi user

  // Actions
  setProject: (project: Project) => void
  setSelectedFile: (path: string) => void
  addChatMessage: (message: ChatMessage) => void
  setPendingDiff: (diff: FileChange[] | null) => void
  applyPendingDiff: () => void
}
```

### 6.4 Syntax Highlighting

Gunakan **Shiki** (server-side) atau **Prism.js** (client-side) untuk highlight file preview. Wajib support:
- TypeScript / TSX
- Prisma schema
- YAML
- JSON
- SQL (untuk migration files)

### 6.5 Diff View Requirements

Gunakan library **diff2html** atau implementasi custom:
- Side-by-side atau unified view
- Line numbers
- Highlight tambahan (hijau) dan hapusan (merah)
- File header menampilkan path + action (modified/added/deleted)

---

## 7. Infrastructure Requirements

### 7.1 Environment Variables

```bash
# apps/api/.env

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/moonforge"

# AI
ANTHROPIC_API_KEY="sk-ant-..."

# Auth
JWT_SECRET="..."
JWT_EXPIRES_IN="7d"

# App
NODE_ENV="development"
PORT=3001
CORS_ORIGIN="http://localhost:3000"

# Rate limiting
MAX_GENERATE_PER_HOUR=10      # Per user
MAX_REFINE_PER_HOUR=50        # Per user
MAX_TOKENS_PER_REQUEST=8000
```

### 7.2 Docker Configuration

```yaml
# docker-compose.dev.yaml (untuk development)
version: '3.8'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: moonforge
      POSTGRES_USER: moonforge
      POSTGRES_PASSWORD: moonforge_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis untuk rate limiting dan session cache (opsional di MVP)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 7.3 Kubernetes Manifests (infra/k8s/)

```yaml
# deployment.yaml — Minimal untuk hackathon
apiVersion: apps/v1
kind: Deployment
metadata:
  name: moonforge-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: moonforge-api
  template:
    spec:
      containers:
        - name: api
          image: moonforge/api:latest
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: moonforge-secrets
                  key: database-url
            - name: ANTHROPIC_API_KEY
              valueFrom:
                secretKeyRef:
                  name: moonforge-secrets
                  key: anthropic-api-key
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
```

### 7.4 Zip Generation Logic

File disimpan per-path di PostgreSQL. Export sebagai .zip dilakukan di server:

```typescript
// apps/api/src/modules/export/export.service.ts
import JSZip from 'jszip'

export async function generateProjectZip(projectId: string): Promise<Buffer> {
  const files = await db.projectFile.findMany({
    where: { projectId },
    select: { path: true, content: true }
  })

  const zip = new JSZip()

  for (const file of files) {
    zip.file(file.path, file.content)
  }

  return zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
}
```

---

## 8. Testing Strategy

### 8.1 Testing Pyramid

```
         [E2E Tests]
       Generate → Download → Run
      (Playwright, minimal suite)

     [Integration Tests]
   API endpoints + DB + AI mocks
   (Vitest + test containers)

  [Unit Tests]
 Validators, cascade logic, prompts
 (Vitest, target 80% coverage)
```

### 8.2 Critical Test Cases

**Unit: Validator Tests**
- Prisma schema dengan syntax valid → pass
- Prisma schema dengan relasi yang hilang satu sisi → fail dengan pesan jelas
- TS file dengan syntax error → fail
- JSON tidak valid → fail

**Unit: Cascade Tests**
- Tambah field ke model A → types/index.ts termasuk dalam rencana update
- Tambah model baru B → 3 file module B termasuk dalam rencana create

**Integration: Generate Flow**
- Mock Claude → return file content yang valid → semua file tersimpan ke DB
- Mock Claude → return Prisma schema invalid → retry terjadi → sukses di retry ke-2
- Mock Claude → selalu return invalid → error dikembalikan ke client setelah 3 retry

**Integration: Export**
- Semua file dari DB ter-zip dengan path yang benar
- .zip bisa diekstrak dan strukturnya sesuai

**E2E: Smoke Test**
- Generate project sederhana (2 module) → download .zip → jalankan di container Docker → tidak ada error

### 8.3 Snapshot Testing untuk Output

Buat fixture set: deskripsi project yang sudah diketahui outputnya. Setiap kali prompt template berubah, jalankan snapshot test untuk deteksi regresi format output.

---

## 9. Development Phases & Milestones

### Overview Timeline

```
Phase 0: Foundation          [Hari 1-2]
Phase 1: Core Backend        [Hari 3-5]
Phase 2: AI Engine           [Hari 6-9]
Phase 3: Frontend            [Hari 10-13]
Phase 4: Integration & E2E   [Hari 14-16]
Phase 5: Hardening           [Hari 17-20]
Phase 6: Infra & Deploy      [Hari 21-23]
Phase 7: Buffer & Polish     [Hari 24]
```

---

### Phase 0: Foundation (Hari 1–2)

**Tujuan:** Monorepo berjalan, semua developer bisa mulai kerja.

**Tasks:**
- [ ] Init Moon monorepo dengan struktur folder sesuai arsitektur
- [ ] Setup PNPM workspace dengan semua packages terdefinisi
- [ ] Konfigurasi TypeScript strict mode di semua packages
- [ ] Setup Prisma di `packages/db`, jalankan `prisma generate`
- [ ] Buat semua tabel database sesuai schema di atas
- [ ] Setup Hono.js di `apps/api` dengan health check endpoint
- [ ] Setup Next.js 15 di `apps/web` dengan layout minimal
- [ ] Setup Biome untuk lint + format
- [ ] Setup Husky pre-commit hook
- [ ] Docker Compose untuk PostgreSQL development
- [ ] `.env.example` lengkap di semua apps

**Definition of Done Phase 0:**
- `moon run :dev` berhasil start semua apps tanpa error
- `moon run :lint` berjalan tanpa error
- Database connection berhasil

---

### Phase 1: Core Backend (Hari 3–5)

**Tujuan:** Semua endpoint API berjalan, CRUD project berfungsi.

**Tasks:**

*Auth Module:*
- [ ] POST /api/auth/register (hash password dengan bcrypt)
- [ ] POST /api/auth/login (return JWT)
- [ ] Auth middleware (verify JWT di setiap protected route)
- [ ] GET /api/auth/me

*Projects Module:*
- [ ] GET /api/projects (list milik user yang login)
- [ ] POST /api/projects (simpan deskripsi, status: PENDING)
- [ ] GET /api/projects/:id
- [ ] DELETE /api/projects/:id

*Files Module:*
- [ ] GET /api/projects/:id/files (hanya path, bukan content)
- [ ] GET /api/projects/:id/files/:encodedPath (content satu file)
- [ ] Utility: seed beberapa dummy file untuk testing UI

*Export Module:*
- [ ] GET /api/projects/:id/export (generate .zip dari project_files)
- [ ] Install jszip, test dengan dummy files

**Definition of Done Phase 1:**
- Semua endpoint di atas return 200 dengan format response yang benar
- Auth middleware menolak request tanpa token
- Export zip bisa diekstrak dan isinya sesuai

---

### Phase 2: AI Engine (Hari 6–9)

**Tujuan:** `packages/generator` berfungsi, Fase 1 Generate end-to-end bekerja.

**Tasks:**

*packages/generator setup:*
- [ ] Install `@anthropic-ai/sdk`
- [ ] Buat `callClaude(prompt, systemPrompt)` wrapper dengan timeout dan error handling
- [ ] Buat fungsi `generateFileWithRetry(prompt, validator, filePath)` dengan retry logic

*Prompt Templates:*
- [ ] `prompts/openspec.ts` — Generate OpenSpec JSON dari deskripsi
- [ ] `prompts/prisma-schema.ts` — Generate schema.prisma dari OpenSpec
- [ ] `prompts/hono-routes.ts` — Generate routes.ts per module
- [ ] `prompts/hono-schema.ts` — Generate Zod schema per module
- [ ] `prompts/hono-service.ts` — Generate service.ts per module
- [ ] `prompts/shared-types.ts` — Generate packages/types/index.ts
- [ ] `prompts/moon-config.ts` — Generate moon.yml per app
- [ ] `prompts/tanstack-page.ts` — Generate halaman React dasar

*Validators:*
- [ ] `validators/prisma.ts` — Gunakan `@prisma/internals` untuk parse + validate
- [ ] `validators/typescript.ts` — Gunakan `typescript` package untuk syntax check
- [ ] `validators/json.ts` — Validate JSON parseable
- [ ] `validators/yaml.ts` — Validate YAML parseable

*Generate Orchestrator:*
- [ ] `orchestrator.ts` — Urutan generate yang benar (schema dulu, baru dependent files)
- [ ] Emit progress events via callback
- [ ] Simpan setiap file ke DB segera setelah di-generate dan tervalidasi

*Generate API Endpoints:*
- [ ] POST /api/projects/:id/generate-spec → panggil openspec prompt, simpan ke openspecs tabel
- [ ] POST /api/projects/:id/confirm-generate → jalankan orchestrator, stream SSE progress
- [ ] GET /api/projects/:id/generate/progress → SSE endpoint

**Definition of Done Phase 2:**
- Deskripsi "SaaS B2B dengan module users, subscription, dashboard" → OpenSpec JSON yang valid
- Konfirmasi → semua file tersimpan ke project_files
- Semua file lolos validator (tidak ada syntax error)
- SSE progress event diterima di client

---

### Phase 3: Frontend (Hari 10–13)

**Tujuan:** UI lengkap, user bisa generate project dan download .zip.

**Tasks:**

*Auth UI:*
- [ ] Login page dengan form
- [ ] Register page
- [ ] Auth state management (Zustand atau Context)
- [ ] Protected route wrapper

*Dashboard:*
- [ ] List project cards (nama, status, tanggal)
- [ ] New Project button → modal atau redirect
- [ ] Delete project dengan konfirmasi

*Generate Flow UI:*
- [ ] Input deskripsi (textarea besar, bisa bahasa Indonesia/Inggris)
- [ ] Loading state "Generating OpenSpec..."
- [ ] OpenSpec Preview Card:
  - Modules list
  - Prisma Models list dengan fields
  - API Routes count
  - Frontend Pages list
- [ ] Tombol Konfirmasi / Edit / Batalkan
- [ ] Generate Progress:
  - File-by-file progress dengan nama file saat ini
  - Progress bar
  - Estimasi waktu (opsional)
- [ ] Generate Complete:
  - Summary (X file generated)
  - Download .zip button
  - Tombol "Buka di Editor" dan "Mulai Refine"

*File Explorer UI:*
- [ ] Sidebar file tree (collapsible folder)
- [ ] File content viewer dengan syntax highlighting (Shiki)
- [ ] Tab untuk buka multiple files (opsional, nice to have)

*Chat / Refine UI:*
- [ ] Chat input di bagian bawah
- [ ] Riwayat pesan (User + Assistant)
- [ ] Diff view embedded di pesan Assistant
- [ ] Tombol Konfirmasi / Reject di setiap rencana perubahan
- [ ] Clickable file paths di pesan AI → buka di file viewer
- [ ] Download .zip versi terbaru

**Definition of Done Phase 3:**
- User bisa flow lengkap: daftar → login → buat project → generate → download .zip
- File explorer menampilkan tree yang benar
- Syntax highlighting berfungsi untuk TypeScript, Prisma, YAML, JSON

---

### Phase 4: Refine Engine & Integration (Hari 14–16)

**Tujuan:** Fase 2 Refine end-to-end berfungsi.

**Tasks:**

*packages/generator — Refine:*
- [ ] `prompts/refine-planner.ts` — Analisis request → JSON rencana perubahan
- [ ] `prompts/refine-executor.ts` — Surgical edit satu file berdasarkan instruction
- [ ] `cascade/dependencyGraph.ts` — Resolve file yang harus ikut berubah
- [ ] Refine service: load konteks → plan → execute → validate → simpan

*Refine API Endpoints:*
- [ ] POST /api/projects/:id/chat → proses pesan, return rencana
- [ ] POST /api/projects/:id/chat/:msgId/confirm → execute perubahan
- [ ] POST /api/projects/:id/chat/:msgId/reject → tandai REJECTED, tidak ada perubahan
- [ ] POST /api/projects/:id/undo → restore dari snapshot terakhir

*Snapshot System:*
- [ ] Sebelum setiap Refine yang dikonfirmasi, simpan snapshot semua file ke project_snapshots
- [ ] Undo endpoint restore dari snapshot terbaru dan hapus snapshot tersebut

*Integration Testing:*
- [ ] Test flow: Generate → Refine "tambah tabel X" → Konfirmasi → Download → Verify file
- [ ] Test cascade: Tambah model Prisma → types/index.ts ikut berubah
- [ ] Test undo: Refine → Undo → file kembali ke state sebelumnya

**Definition of Done Phase 4:**
- Pesan "tambahin tabel products" → AI return rencana perubahan dengan 5 file yang benar
- Konfirmasi → file-file tersebut ter-update di DB
- Undo berhasil restore state sebelumnya

---

### Phase 5: Hardening (Hari 17–20)

**Tujuan:** Output yang dihasilkan benar-benar bisa dijalankan.

**Tasks:**

*Output Quality Testing:*
- [ ] Generate project sederhana (2 module) → download → jalankan di Docker container bersih
- [ ] Cek apakah `pnpm install` berjalan tanpa error
- [ ] Cek apakah `moon run api:db-push` berjalan tanpa error
- [ ] Cek apakah `moon run :dev` start semua apps tanpa error
- [ ] Iterasi: perbaiki prompt atau template berdasarkan error yang ditemukan

*Error Handling:*
- [ ] Rate limiting per user (10 generate/jam, 50 refine/jam)
- [ ] Timeout handling untuk AI calls (max 60 detik per file)
- [ ] Graceful error jika generate gagal di tengah jalan (partial state cleanup)
- [ ] Error messages yang jelas dan actionable di UI

*Edge Cases:*
- [ ] Deskripsi sangat pendek ("bikin todo app") → OpenSpec yang masuk akal
- [ ] Deskripsi sangat panjang (>1000 karakter) → tetap berfungsi
- [ ] Request refine yang ambigu → AI meminta klarifikasi
- [ ] Request refine yang konflik dengan schema existing → AI memberikan warning

**Definition of Done Phase 5:**
- Minimal 3 project yang di-generate dari deskripsi berbeda bisa dijalankan tanpa error
- Semua error case ditangani dengan pesan yang jelas

---

### Phase 6: Infrastructure & Deployment (Hari 21–23)

**Tujuan:** MoonForge berjalan di Kubernetes.

**Tasks:**
- [ ] Dockerfile.web (multi-stage build)
- [ ] Dockerfile.api (multi-stage build)
- [ ] K8s Deployment untuk web dan api
- [ ] K8s Service untuk web dan api
- [ ] K8s Ingress dengan domain
- [ ] K8s Secret untuk environment variables sensitif
- [ ] PostgreSQL di K8s (atau managed PostgreSQL)
- [ ] Smoke test di environment K8s
- [ ] CI/CD minimal (GitHub Actions: build → push image → apply manifests)

**Definition of Done Phase 6:**
- MoonForge accessible via domain
- Generate flow berfungsi di production environment

---

### Phase 7: Buffer & Polish (Hari 24)

**Tujuan:** Siap demo, tidak ada bug blocker.

**Tasks:**
- [ ] Run full demo flow dari awal (register → generate → download → run → refine → download)
- [ ] Fix semua bug yang ditemukan
- [ ] Polish UI untuk screenshot/demo
- [ ] Siapkan project demo yang sudah pre-generated (backup kalau AI lambat saat demo)
- [ ] Latihan demo pitch (target: 5 menit, end-to-end)

---

## 10. Definition of Done

### DoD — Per Feature

Sebuah feature dianggap selesai jika:
1. Endpoint/fungsi berjalan sesuai spesifikasi
2. Unit test untuk kasus utama dan kasus error ada dan pass
3. Tidak ada TypeScript error (`tsc --noEmit` clean)
4. Linter tidak ada warning/error (`biome check`)

### DoD — MVP (Hackathon)

MVP dianggap selesai jika:
1. User bisa register, login, buat project baru
2. Deskripsi natural language → OpenSpec preview → Generate → file tersimpan di DB
3. Download .zip → `pnpm install && moon run :dev` berjalan tanpa error (minimal untuk 2 project test)
4. Buka project dari history → chat refine "tambah tabel X" → konfirmasi → download versi terbaru
5. MoonForge sendiri berjalan di Kubernetes

### DoD — North Star (Post-MVP)

Produk dianggap production-ready jika:
- Dari 100 generate berbeda, minimal 95 menghasilkan monorepo yang langsung bisa dijalankan
- Refine cascade selalu konsisten (tidak ada desync antar file)
- Response time generate < 3 menit untuk project dengan 4 module

---

## 11. Risk Register

| Risiko | Kemungkinan | Dampak | Mitigasi |
|--------|-------------|--------|----------|
| AI generate code yang tidak compile | Tinggi | Tinggi | Retry logic + validator + prompt iteration |
| Prompt terlalu panjang (context limit) | Sedang | Tinggi | Generate per file, bukan semua sekaligus |
| Claude API lambat/down saat demo | Rendah | Sangat Tinggi | Siapkan pre-generated project sebagai backup |
| .zip tidak bisa dijalankan karena versi package conflik | Sedang | Tinggi | Pin semua versi package di templates, test manual |
| Scope creep — fitur tambah terus | Tinggi | Sedang | Patuhi MVP scope, fitur baru masuk backlog |
| Cascade update tidak lengkap | Sedang | Tinggi | Integration test untuk setiap perubahan cascade |
| Database terlambat (file besar) | Rendah | Sedang | Index yang benar, content disimpan sebagai Text bukan Bytea |

---

## Appendix A: Urutan Generate Files

Generate harus mengikuti urutan ini karena dependency:

```
1. .moon/workspace.yml
2. .moon/tasks.yml
3. pnpm-workspace.yaml
4. tsconfig.json (root)
5. biome.json
6. moon.yml (root)
7. docker-compose.yml
8. docker-compose.dev.yaml
9. .env.example

10. packages/types/package.json
11. packages/types/tsconfig.json

12. apps/api/package.json
13. apps/api/prisma/schema.prisma          ← PALING PENTING, generate dulu
14. packages/types/src/index.ts            ← Derived dari Prisma schema

15. apps/api/src/index.ts                  ← Hono entry point
16. apps/api/moon.yml
17. apps/api/tsconfig.json

18. Untuk setiap module:
    apps/api/src/modules/{mod}/{mod}.schema.ts    ← Zod, derived dari Prisma
    apps/api/src/modules/{mod}/{mod}.service.ts
    apps/api/src/modules/{mod}/{mod}.routes.ts

19. apps/platform/package.json
20. apps/platform/moon.yml
21. apps/platform/tsconfig.json
22. apps/platform/src/utils/api.ts          ← Hono RPC client
23. Untuk setiap halaman frontend:
    apps/platform/src/routes/{page}.tsx

24. apps/admin/ (struktur sama dengan platform)****
```

---

## Appendix B: Guardrails — Menjaga Produk Sesuai Tujuan

Setiap PR dan keputusan teknikal harus **divalidasi** terhadap pertanyaan-pertanyaan ini:

1. **Apakah ini membantu user menghasilkan monorepo yang langsung bisa dijalankan?**
   → Kalau tidak, fitur ini tidak perlu ada di MVP.

2. **Apakah ini menambah variabilitas pada output?**
   → Kalau ya (misalnya opsi stack berbeda), tolak. Konsistensi lebih penting dari fleksibilitas.

3. **Apakah ini membuat output lebih atau kurang reliable?**
   → Prioritaskan reliability di atas features.

4. **Apakah ini scope creep dari tujuan utama (generator + refiner untuk Moon monorepo)?**
   → Masukkan ke backlog post-hackathon.
```