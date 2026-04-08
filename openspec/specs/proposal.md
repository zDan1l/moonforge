# 🌕 MoonForge - OpenSpec (Ready to Generate)

**Version:** 1.0 MVP (Revised)  
**Target:** Hackathon Refactory  
**Timeline:** 24 Jam Build Sprint  
**Status:** CONFIDENTIAL - Ready for Generation  
**Last Updated:** 2025-01-08

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Tech Stack Specifications](#tech-stack-specifications)
4. [Database Schema & Migrations](#database-schema--migrations)
5. [API Specifications](#api-specifications)
6. [Frontend Specifications](#frontend-specifications)
7. [File Structure & Generation](#file-structure--generation)
8. [Implementation Tasks](#implementation-tasks)
9. [Setup Instructions](#setup-instructions)

---

## Project Overview

### Problem Statement
Setup fullstack monorepo dengan Moon memakan waktu lama. Developer harus mengkonfigurasi secara manual struktur folder, Moon tasks, koneksi antar app, Prisma schema, Zod validation, routing, dan shared types — semua harus konsisten sejak awal.

### Solution
**MoonForge** = Template Base + AI Customization  
- **Template Base [T]:** Infrastruktur stabil yang tidak berubah (Moon config, Docker, pnpm workspace, tsconfig, Biome, Husky)
- **AI Customization [AI]:** File spesifik per project (Prisma schema, modules, routes, services, shared types)

### Value Proposition
- ⚡ **Setup in Minutes:** Setup production-ready fullstack monorepo dalam hitungan menit (bukan jam)
- 🤖 **AI-Powered Refinement:** Modify project selamanya via chat dengan surgical changes (bukan regenerate ulang)
- 📦 **Type-Safe by Default:** Shared types otomatis update setiap ada schema change
- 🌙 **Moon Native:** Designed khusus untuk developer yang menggunakan Moon monorepo
- 💾 **Persistent Workspace:** History project tersimpan, bisa refine kapan saja dengan versioning

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         MoonForge Web                        │
│              (TanStack Start + React 19)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│                      MoonForge API                           │
│                      (Hono.js)                              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │ Project Routes  │  │ Generator Logic │  │ Chat Routes  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
   ┌────────┐    ┌──────────┐    ┌──────────┐
   │ Claude │    │PostgreSQL│    │Generator │
   │  API   │    │   DB     │    │ Package  │
   └────────┘    └──────────┘    └──────────┘
```

### Data Flow

**Fase 1 - Setup:**
```
User Input (Natural Language)
    ↓
Claude API (Generate OpenSpec)
    ↓
Generator Package (Template Merge + Customization)
    ↓
PostgreSQL (Save project files & metadata)
    ↓
File Tree Preview [T] vs [AI]
    ↓
Download .zip
```

**Fase 2 - Refine:**
```
User Chat Input
    ↓
Load Project State (from PostgreSQL)
    ↓
Claude API (Context-aware modification)
    ↓
Generator Package (Surgical file updates)
    ↓
Create New Version (project_versions)
    ↓
Diff View Preview
    ↓
Download .zip
```

---

## Tech Stack Specifications

### Technology Stack (Opinionated, Non-negotiable)

#### Monorepo & Package Management
- **Monorepo Tool:** Moon (v1.x) with PNPM workspaces
- **Node Version:** 18.x or 20.x (LTS)
- **Package Manager:** PNPM 9.x

#### Backend
- **Runtime:** Node.js (via Hono)
- **Framework:** Hono.js (v4.x) with zValidator middleware
- **ORM:** Prisma v5.x + PostgreSQL 15+
- **Validation:** Zod v3.x
- **API Client:** @anthropic-ai/sdk (untuk Claude API calls)
- **HTTP Client:** node-fetch (built-in di Node 18+)

#### Frontend
- **UI Framework:** React 19.x
- **Router:** TanStack Router v2.x
- **Meta Framework:** TanStack Start (React SSR)
- **Styling:** Tailwind CSS v4.x + PostCSS
- **State:** React Query v5.x (data fetching)
- **Build Tool:** Vite (via TanStack Start)

#### Database
- **Primary DB:** PostgreSQL 15+
- **ORM:** Prisma v5.x
- **Migrations:** Prisma migrate
- **Seed:** Prisma seed script

#### Code Quality
- **Linter & Formatter:** Biome v1.x
- **Type Checking:** TypeScript 5.x
- **Git Hooks:** Husky + lint-staged
- **Testing:** Vitest (optional, Post-MVP)

#### Infrastructure
- **Containerization:** Docker + Docker Compose
- **Orchestration:** Kubernetes (deployment ready)
- **ENV Management:** dotenv (.env + .env.example)

### Dependencies Summary

**Root package.json:**
```json
{
  "name": "moonforge",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "moon run :dev",
    "build": "moon run :build",
    "lint": "biome lint .",
    "format": "biome format .",
    "type-check": "moon run :type-check",
    "db:push": "cd apps/api && pnpm prisma db push",
    "db:migrate": "cd apps/api && pnpm prisma migrate dev",
    "db:seed": "cd apps/api && pnpm prisma db seed"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.8.3",
    "@moon/cli": "^1.24.0",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.7",
    "typescript": "^5.3.3"
  },
  "workspaces": [
    "apps/*",
    "packages/*"
  ]
}
```

---

## Database Schema & Migrations

### PostgreSQL Setup

**Connection String Format:**
```
postgresql://user:password@localhost:5432/moonforge
```

**Docker Compose (PostgreSQL Service):**
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: moonforge
      POSTGRES_USER: moonforge
      POSTGRES_PASSWORD: moonforge
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

### Prisma Schema (apps/api/prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ========== Users ==========
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects     Project[]
  chatMessages ChatMessage[]

  @@map("users")
}

// ========== Projects ==========
model Project {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name        String
  description String
  status      ProjectStatus @default(DRAFT)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  versions      ProjectVersion[]
  files         ProjectFile[]
  chatMessages  ChatMessage[]

  @@map("projects")
}

enum ProjectStatus {
  DRAFT
  GENERATED
  REFINED
}

// ========== Project Versions ==========
model ProjectVersion {
  id              String   @id @default(cuid())
  projectId       String
  project         Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  versionNumber   Int
  label           String?
  createdAt       DateTime @default(now())

  files           ProjectFile[]
  chatMessages    ChatMessage[]

  @@unique([projectId, versionNumber])
  @@map("project_versions")
}

// ========== Project Files ==========
model ProjectFile {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  versionId   String
  version     ProjectVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  
  path        String // relative path e.g., "apps/api/prisma/schema.prisma"
  content     String // full file content
  fileSource  FileSource @default(AI_GENERATED)
  
  updatedAt   DateTime @updatedAt

  @@unique([versionId, path])
  @@map("project_files")
}

enum FileSource {
  TEMPLATE
  AI_GENERATED
  MODIFIED
}

// ========== Chat Messages ==========
model ChatMessage {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  
  versionId   String
  version     ProjectVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)
  
  role        MessageRole
  content     String
  fileChanges Json? // { "modifiedPaths": ["path1", "path2"] }
  
  createdAt   DateTime @default(now())

  @@map("chat_messages")
}

enum MessageRole {
  USER
  ASSISTANT
}
```

### Migration Steps

```bash
# 1. Initialize Prisma (sudah ada di template)
cd apps/api
pnpm prisma init --datasource-provider postgresql

# 2. Set DATABASE_URL in .env
# DATABASE_URL="postgresql://user:pass@localhost:5432/moonforge"

# 3. Create initial migration
pnpm prisma migrate dev --name init

# 4. Seed initial data (optional)
pnpm prisma db seed

# 5. Generate Prisma Client
pnpm prisma generate
```

---

## API Specifications

### Base API Structure (apps/api/src)

```
src/
├── index.ts (main Hono app)
├── lib/
│   ├── prisma.ts (Prisma client singleton)
│   └── anthropic.ts (Claude API client)
├── middleware/
│   ├── auth.ts (user authentication)
│   └── error-handler.ts
└── modules/
    ├── projects/
    │   ├── projects.routes.ts
    │   ├── projects.schema.ts
    │   └── projects.service.ts
    ├── generator/
    │   ├── generator.routes.ts
    │   ├── generator.schema.ts
    │   └── generator.service.ts
    └── chat/
        ├── chat.routes.ts
        ├── chat.schema.ts
        └── chat.service.ts
```

### Core API Endpoints

#### Projects Module

**POST /api/projects**
```typescript
// Create new project
Request:
{
  name: string;
  description: string;
}

Response:
{
  id: string;
  userId: string;
  name: string;
  description: string;
  status: "DRAFT" | "GENERATED" | "REFINED";
  createdAt: string;
}
```

**GET /api/projects**
```typescript
// List all projects for user
Response:
{
  projects: Array<{
    id: string;
    name: string;
    status: string;
    updatedAt: string;
  }>;
}
```

**GET /api/projects/:id**
```typescript
// Get single project with latest version
Response:
{
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
  };
  currentVersion: {
    id: string;
    versionNumber: number;
    label?: string;
  };
  files: Array<{
    path: string;
    fileSource: "TEMPLATE" | "AI_GENERATED" | "MODIFIED";
  }>;
}
```

#### Generator Module

**POST /api/generate**
```typescript
// Generate project from natural language
Request:
{
  projectId: string;
  prompt: string; // natural language description
}

Response:
{
  versionId: string;
  versionNumber: number;
  fileCount: number;
  generatedFiles: string[]; // list of paths
  status: "PROCESSING" | "COMPLETED" | "FAILED";
}
```

**GET /api/generate/:projectId/preview**
```typescript
// Get OpenSpec preview before confirming
Response:
{
  schema: string; // Prisma schema content
  modules: Array<{
    name: string;
    routes: string[];
    description: string;
  }>;
  summary: string;
}
```

#### Chat Module

**POST /api/chat**
```typescript
// Send chat message for refinement
Request:
{
  projectId: string;
  message: string;
}

Response:
{
  versionId: string;
  versionNumber: number;
  messageId: string;
  modifiedFiles: string[];
  preview: {
    filesDiff: Array<{
      path: string;
      oldContent?: string;
      newContent: string;
    }>;
  };
}
```

**GET /api/chat/:projectId/history**
```typescript
// Get chat history for project
Response:
{
  messages: Array<{
    id: string;
    role: "USER" | "ASSISTANT";
    content: string;
    createdAt: string;
  }>;
}
```

#### Files Module

**GET /api/projects/:projectId/files**
```typescript
// Get all files for current version
Response:
{
  files: Array<{
    path: string;
    content: string;
    fileSource: "TEMPLATE" | "AI_GENERATED" | "MODIFIED";
    updatedAt: string;
  }>;
}
```

**GET /api/projects/:projectId/download**
```typescript
// Download project as .zip
Response: Binary .zip file
```

**GET /api/projects/:projectId/versions**
```typescript
// Get version history
Response:
{
  versions: Array<{
    id: string;
    versionNumber: number;
    label?: string;
    createdAt: string;
    modifiedFiles: number;
  }>;
}
```

---

## Frontend Specifications

### Layout Architecture

The MoonForge workspace uses a **3-panel layout:**

```
┌─────────────────────────────────────────────────────────────┐
│                     Top Navigation                          │
├─────────┬──────────────────────────┬──────────────────────┤
│         │                          │                      │
│ Panel 1 │       Panel 2            │     Panel 3          │
│ Chatbot │   Code Preview           │  File Explorer       │
│         │   (with Diff)            │                      │
│         │                          │                      │
│         │                          │                      │
└─────────┴──────────────────────────┴──────────────────────┘
```

### Page Structure

#### Route: /
```
Redirect → /dashboard
```

#### Route: /dashboard
```
Dashboard home - list of all projects, create new project button
```

#### Route: /projects/new
```
Setup form:
- Project name input
- Project description textarea
- "Create Project" button
- Once clicked → redirect to /projects/:id
```

#### Route: /projects/:id
```
3-Panel Workspace:

Panel 1 (Left) - Chatbot
├── Project info header
├── Chat input textarea
├── Chat history (scrollable)
└── Controls (download, version history)

Panel 2 (Center) - Code Preview
├── File path display
├── Code editor with syntax highlighting
├── Diff highlighting (green for added, red for removed)
├── File tabs / breadcrumb navigation
└── Line numbers

Panel 3 (Right) - File Explorer
├── Project structure tree
├── File icons with labels:
│   ├── [T] = Template (gray)
│   ├── [AI] = AI-Generated (blue)
│   └── Modified (yellow)
├── Click file → show in Panel 2
└── Expand/collapse folders
```

### Key Components

```
components/
├── ui/ (shared reusable components)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── CodeEditor.tsx (with syntax highlighting)
│   └── DiffViewer.tsx
├── Chatbot.tsx (Panel 1)
├── CodePreview.tsx (Panel 2)
├── FileExplorer.tsx (Panel 3)
└── WorkspaceLayout.tsx (3-panel grid)
```

### Pages

```
routes/
├── __root.tsx (root layout with providers)
├── index.tsx (redirect to /dashboard)
├── dashboard/
│   ├── __layout.tsx (dashboard layout)
│   └── index.tsx (projects list)
├── projects/
│   ├── new/ (create new project)
│   │   └── index.tsx
│   └── $projectId/ (single project workspace)
│       └── index.tsx (3-panel workspace)
```

### State Management

**TanStack Query for server state:**
```typescript
// Queries
useQuery({
  queryKey: ['projects'],
  queryFn: async () => api.getProjects()
});

useQuery({
  queryKey: ['project', projectId],
  queryFn: async () => api.getProject(projectId)
});

// Mutations
useMutation({
  mutationFn: async (data) => api.createProject(data)
});

useMutation({
  mutationFn: async ({ projectId, message }) => api.sendChat(projectId, message)
});
```

### Styling with Tailwind CSS v4

**Color Palette:**
- Primary: Indigo-600
- Template [T]: Gray-400
- AI-Generated [AI]: Blue-500
- Modified: Amber-500
- Success: Green-500
- Error: Red-500

**Layout Utilities:**
- 3-panel grid: `grid grid-cols-[1fr_2fr_1fr]`
- Sidebar: `w-64 overflow-auto border-r`
- Main content: `overflow-auto`
- Code editor: `font-mono text-sm`

---

## File Structure & Generation

### Template Base Files [T]

Files ini adalah **statis dan tidak di-generate** oleh Claude:

```
.moon/
├── workspace.yml
└── tasks.yml

apps/platform/ (TanStack Start template)
├── src/routes/__root.tsx
├── src/routes/index.tsx
├── src/routes/dashboard/index.tsx
├── src/components/ui/*
├── vite.config.ts
├── tsconfig.json
└── moon.yml

apps/admin/ (TanStack Start template)
├── src/routes/__root.tsx
├── src/routes/index.tsx
├── src/components/ui/*
├── vite.config.ts
├── tsconfig.json
└── moon.yml

apps/api/ (Hono template)
├── src/lib/prisma.ts
├── src/lib/anthropic.ts
├── src/middleware/*
├── src/index.ts (entry point, routes merged here)
├── package.json
├── tsconfig.json
├── moon.yml
└── prisma/ (folder)

packages/types/
├── src/index.ts (template, re-exports from Prisma)
├── package.json
└── tsconfig.json

Root files:
├── .env.example
├── .gitignore
├── biome.json
├── docker-compose.yml
├── docker-compose.dev.yaml
├── moon.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
└── husky/ (git hooks)
```

### AI-Generated Files [AI]

Files ini **di-generate oleh Claude** berdasarkan user prompt:

```
apps/api/prisma/
└── schema.prisma [AI]
    (Prisma models based on user description)

apps/api/src/modules/{moduleName}/
├── {module}.routes.ts [AI]
│   (Hono routes dengan zValidator)
├── {module}.schema.ts [AI]
│   (Zod validation schemas)
└── {module}.service.ts [AI]
    (Business logic dengan Prisma queries)

packages/types/src/
└── index.ts [AI]
    (Re-export dari Prisma types + utility types)

openspec/specs/ (internal documentation)
├── proposal.md [AI]
│   (OpenSpec proposal dari Claude)
└── tasks.md [AI]
    (Implementation tasks breakdown)
```

### Generation Logic

**Step 1: Parse User Input**
```typescript
const prompt = "SaaS B2B dengan module users, subscription, dan dashboard analytics";
// Parse → identify modules, entities, relationships
```

**Step 2: Generate Prisma Schema**
```prisma
// Claude generates based on:
// - Identified entities
// - Relationships
// - Business logic requirements
model User { ... }
model Subscription { ... }
model Analytics { ... }
```

**Step 3: Generate Module Stubs**
```typescript
// For each module:
// - {module}.routes.ts (CRUD endpoints)
// - {module}.schema.ts (Zod validators)
// - {module}.service.ts (Prisma queries)
```

**Step 4: Update packages/types**
```typescript
// Re-export Prisma types + create utility types
export type { User, Subscription } from "@prisma/client";
```

**Step 5: Merge with Template**
```
Template files [T] + Generated files [AI] → Complete monorepo
```

### File Naming Conventions

**Routes:** `{module}.routes.ts`
```typescript
export const router = new Hono()
  .get('/', listHandler)
  .post('/', createHandler)
  .get('/:id', getHandler)
  .put('/:id', updateHandler)
  .delete('/:id', deleteHandler);
```

**Schemas:** `{module}.schema.ts`
```typescript
export const createSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});
```

**Services:** `{module}.service.ts`
```typescript
export const service = {
  list: async () => prisma.{entity}.findMany(),
  create: async (data) => prisma.{entity}.create({ data }),
  // ... other methods
};
```

---

## Implementation Tasks

### Phase 1: Setup (Hackathon Day 1)

**Backend Setup**
- [ ] Initialize Moon monorepo structure
- [ ] Configure pnpm workspaces
- [ ] Setup PostgreSQL connection
- [ ] Create Prisma schema base
- [ ] Setup Hono.js API server
- [ ] Create authentication middleware
- [ ] Create error handling middleware
- [ ] Setup Anthropic SDK integration

**Database**
- [ ] Create all tables (users, projects, versions, files, chat_messages)
- [ ] Create migrations
- [ ] Setup seed script

**Frontend Setup**
- [ ] Initialize TanStack Start app
- [ ] Setup 3-panel layout component
- [ ] Create basic routing structure
- [ ] Setup TanStack Query
- [ ] Setup Tailwind CSS v4
- [ ] Create shared UI components

**Generator Package**
- [ ] Create template merger logic
- [ ] Create Prisma schema generator
- [ ] Create module stub generator
- [ ] Create file zipper utility

### Phase 2: AI Integration (Hackathon Day 1-2)

**Claude Integration**
- [ ] Create prompt templates for schema generation
- [ ] Create prompt templates for module generation
- [ ] Implement context-aware chat system
- [ ] Create surgical file updater logic

**OpenSpec Generation**
- [ ] Generate example OpenSpec from prompts
- [ ] Create OpenSpec preview endpoint
- [ ] Create OpenSpec approval flow

### Phase 3: Core Features (Hackathon Day 2)

**Setup Feature**
- [ ] Create project form
- [ ] Implement generation flow
- [ ] Create file tree preview
- [ ] Implement zip download

**Refine Feature**
- [ ] Implement chat interface
- [ ] Create file diff viewer
- [ ] Implement surgical updates
- [ ] Create version management
- [ ] Auto-update shared types

**UI Polish**
- [ ] Code syntax highlighting (Shiki / Prism)
- [ ] Diff highlighting
- [ ] File explorer interactions
- [ ] Chat message streaming
- [ ] Loading states

### Phase 4: Testing & Polish (Hackathon Day 2)

- [ ] End-to-end flow testing
- [ ] Error handling refinement
- [ ] Performance optimization
- [ ] Documentation
- [ ] Demo preparation

---

## Setup Instructions

### Step 1: Prerequisites

**Install Required Tools**
```bash
# Node.js 18+ or 20.x LTS
node --version

# PNPM 9.x
npm install -g pnpm@latest
pnpm --version

# Docker (for PostgreSQL)
docker --version
docker-compose --version

# Moon CLI (optional, for local development)
curl -fsSL https://moon.tools/install.sh | bash
```

**Clone MoonForge Repository**
```bash
git clone https://github.com/moonforge/moonforge.git
cd moonforge
```

### Step 2: Environment Setup

**Copy Environment Template**
```bash
cp .env.example .env
```

**Edit .env**
```env
# Database
DATABASE_URL="postgresql://moonforge:moonforge@localhost:5432/moonforge"

# Claude API
ANTHROPIC_API_KEY="sk-ant-..."

# Application
NODE_ENV="development"
API_PORT=3000
```

### Step 3: Start PostgreSQL

**Option A: Docker Compose (Recommended)**
```bash
docker-compose -f docker-compose.dev.yaml up -d postgres
# Verify connection
docker-compose -f docker-compose.dev.yaml logs postgres
```

**Option B: Local PostgreSQL**
```bash
# macOS (via Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb moonforge
createuser moonforge

# Set password
psql moonforge -c "ALTER USER moonforge WITH PASSWORD 'moonforge';"
```

### Step 4: Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install workspace dependencies
pnpm install --recursive
```

### Step 5: Database Setup

```bash
# Navigate to API workspace
cd apps/api

# Create migration
pnpm prisma migrate dev --name init

# Generate Prisma client
pnpm prisma generate

# Seed initial data (optional)
pnpm prisma db seed

# Return to root
cd ../..
```

### Step 6: Verify Setup with Tests

```bash
# Type check
pnpm type-check

# Lint
pnpm lint

# Format (auto-fix)
pnpm format
```

### Step 7: Start Development Servers

**Option A: Start All Services**
```bash
pnpm run dev
# This starts:
# - API (Hono) on http://localhost:3000
# - Platform (TanStack Start) on http://localhost:3001
# - Admin (TanStack Start) on http://localhost:3002
```

**Option B: Start Individual Services**
```bash
# Terminal 1: API
cd apps/api && pnpm dev

# Terminal 2: Platform Frontend
cd apps/platform && pnpm dev

# Terminal 3: Admin Frontend
cd apps/admin && pnpm dev
```

### Step 8: Verify Everything Works

**Check API Health**
```bash
curl http://localhost:3000/api/health
# Expected: { "status": "ok" }
```

**Access Web UI**
```
http://localhost:3001/dashboard
# Should see dashboard (may need to create account first)
```

**Access Prisma Studio (optional)**
```bash
cd apps/api && pnpm prisma studio
# Opens on http://localhost:5555
```

### Step 9: Build for Production

```bash
# Build all packages
pnpm build

# Output:
# - apps/platform/dist/
# - apps/admin/dist/
# - apps/api/dist/
```

### Step 10: Deploy with Docker

**Build Docker Image**
```bash
docker build -f Dockerfile.api -t moonforge-api:latest .
```

**Run with Docker Compose (Production)**
```bash
docker-compose up -d
```

---

## OpenSpec Generation Flow

### How Claude Generates from PRD

When user inputs: *"SaaS B2B dengan module users, subscription, dan dashboard analytics"*

**Claude Processing:**

1. **Parse Intent**
   - Identify: SaaS, B2B, multi-tenant architecture
   - Modules: users, subscription, analytics
   - Features: Dashboard, likely with charts/reports

2. **Generate OpenSpec**
   ```markdown
   # SaaS B2B Platform - OpenSpec
   
   ## Entities
   - User (email, name, role, tenant_id)
   - Subscription (plan, status, billing_date)
   - Analytics (metric, value, date)
   
   ## Modules
   - users: CRUD users, assign roles
   - subscription: Manage plans, billing
   - analytics: Query metrics, charts
   
   ## API Endpoints
   - GET /users, POST /users, PUT /users/:id
   - GET /subscriptions, POST /subscriptions
   - GET /analytics, GET /analytics/:metric
   ```

3. **Generate Prisma Schema**
   ```prisma
   model User {
     id String @id @default(cuid())
     email String @unique
     name String
     role Role @default(USER)
     tenantId String
     tenant Tenant @relation(fields: [tenantId], references: [id])
     subscriptions Subscription[]
     // ...
   }
   
   model Subscription {
     id String @id @default(cuid())
     userId String
     user User @relation(fields: [userId], references: [id])
     plan Plan
     status SubscriptionStatus
     // ...
   }
   
   model Analytics {
     id String @id @default(cuid())
     metric String
     value Float
     date DateTime
     // ...
   }
   ```

4. **Generate Module Stubs**
   ```
   - users.routes.ts (with all CRUD endpoints)
   - users.schema.ts (Zod validators)
   - users.service.ts (Prisma queries)
   - subscription.routes.ts
   - subscription.schema.ts
   - subscription.service.ts
   - analytics.routes.ts
   - analytics.schema.ts
   - analytics.service.ts
   ```

5. **Update Shared Types**
   ```typescript
   // packages/types/src/index.ts
   export type { User, Subscription, Analytics } from "@prisma/client";
   export type TenantUser = User & { tenant: Tenant };
   ```

6. **Merge with Template**
   ```
   Template [T] (Moon, Docker, Biome, etc.)
   + Generated [AI] (Schema, modules, types)
   = Complete Monorepo ready to run
   ```

### Directory Structure After Generation

```
{project-name}/
├── .moon/
├── apps/
│   ├── platform/ [T]
│   ├── admin/ [T]
│   └── api/ [T/AI mixed]
│       ├── prisma/schema.prisma [AI]
│       └── src/modules/
│           ├── users/ [AI]
│           ├── subscription/ [AI]
│           └── analytics/ [AI]
├── packages/
│   └── types/src/index.ts [AI]
└── [other template files]
```

---

## Key Architectural Decisions

### Why Template Base + AI Customization?

| Approach | Pros | Cons |
|----------|------|------|
| **Pure Template** | Fast, consistent | Not customizable, manual config |
| **Pure AI Generate** | Fully custom | Inconsistent, no guarantees |
| **Template + AI** | Custom + consistent | More complex |

**MoonForge chose:** Template + AI
- Ensures core infrastructure is always solid (template)
- Allows full customization (AI-generated modules)
- Guarantees type safety with shared types auto-update

### Why Prisma + Zod + Hono?

- **Prisma:** Type-safe ORM, auto-generates types, great DX
- **Zod:** Lightweight validation, runtime type checking, excellent error messages
- **Hono:** Lightweight, edge-ready, excellent TypeScript support, great DX

### Why TanStack Stack?

- **TanStack Router:** Modern, lightweight, file-based routing
- **TanStack Start:** SSR ready, streaming support
- **TanStack Query:** Server state management, built for modern APIs

### Why Separate Template from Generated?

- **Template:** Stability, tested, not touched by Claude
- **Generated:** Full control, matches user requirements exactly
- **Merge:** Best of both worlds

---

## Monitoring & Observability

### Logging Strategy

```typescript
// apps/api/src/lib/logger.ts
export const logger = {
  info: (msg, meta?) => console.log(`[INFO] ${msg}`, meta),
  error: (msg, err?) => console.error(`[ERROR] ${msg}`, err),
  debug: (msg, meta?) => console.debug(`[DEBUG] ${msg}`, meta),
};
```

### Database Query Logging

```typescript
// Enable Prisma logging
const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
});
```

### API Request Logging

```typescript
// Hono middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  logger.info(`${c.req.method} ${c.req.path}`, { duration, status: c.res.status });
});
```

---

## Security Considerations

### Authentication

- [ ] Implement JWT or session-based auth
- [ ] Protect /api/projects routes with auth middleware
- [ ] Validate user ownership of projects before operations

### Claude API Key Management

- [ ] Store ANTHROPIC_API_KEY in secure secrets manager
- [ ] Never commit to git (use .env.example)
- [ ] Rotate keys regularly
- [ ] Rate limit API calls

### Input Validation

- [ ] Validate all user inputs with Zod
- [ ] Sanitize file paths to prevent directory traversal
- [ ] Validate Prisma schema modifications

### Database Security

- [ ] Use strong passwords for PostgreSQL
- [ ] Enable SSL for database connections (production)
- [ ] Regular backups
- [ ] Don't expose DATABASE_URL to frontend

---

## Performance Optimizations

### Caching Strategy

```typescript
// Cache generated projects in memory
const projectCache = new Map<string, ProjectData>();

// Invalidate cache on updates
const invalidateCache = (projectId: string) => {
  projectCache.delete(projectId);
};
```

### Database Optimization

- [ ] Index frequently queried columns (userId, projectId)
- [ ] Use pagination for lists
- [ ] Implement connection pooling

### Frontend Optimization

- [ ] Code splitting with TanStack Router
- [ ] Image optimization
- [ ] CSS minification (Tailwind)
- [ ] Defer non-critical JavaScript

---

## Troubleshooting

### Common Issues

**PostgreSQL Connection Failed**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yaml ps

# Check logs
docker-compose -f docker-compose.dev.yaml logs postgres

# Verify credentials in .env
```

**Prisma Migration Issues**
```bash
cd apps/api

# Reset database (development only)
pnpm prisma migrate reset

# View current schema
pnpm prisma db push --skip-generate
```

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

**Module Not Found Errors**
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Regenerate Prisma client
cd apps/api && pnpm prisma generate
```

---

## Next Steps / Post-MVP

### Phase 2 Features
- [ ] Rename tabel dengan cascade changes
- [ ] Auto-generate migration SQL
- [ ] Advanced diff viewer
- [ ] Team collaboration features
- [ ] Project templates marketplace
- [ ] Automated testing generation

### Monitoring & Analytics
- [ ] Usage analytics
- [ ] Error tracking
- [ ] Performance monitoring

### DevX Improvements
- [ ] VS Code extension
- [ ] CLI tool for local development
- [ ] Template customization
- [ ] Plugin system

---

## References

- Moon Docs: https://moonrepo.dev
- Prisma Docs: https://www.prisma.io/docs
- Zod Docs: https://zod.dev
- Hono Docs: https://hono.dev
- TanStack Docs: https://tanstack.com
- Tailwind CSS: https://tailwindcss.com
- Anthropic API: https://docs.anthropic.com

---

**Status:** ✅ Ready for Generation  
**Last Reviewed:** 2025-01-08  
**Approval:** Ready for Hackathon Implementation
