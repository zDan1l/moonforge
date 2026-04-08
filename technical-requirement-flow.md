# MoonForge — Generation Context Flow
## Pendekatan Deterministik: Membuat Claude Tidak Pernah "Random"

> **Dokumen ini adalah suplemen dari** `MoonForge-Technical-Requirements.md`  
> **Fokus:** Bagaimana memastikan setiap Claude call menghasilkan output yang konsisten,
> terprediksi, dan selalu sinkron antar file — bukan dokumen arsitektur umum.

---

## Inti Masalah: Mengapa Claude Bisa "Random"

Claude adalah language model — dia tidak punya memori antar API call. Setiap kali kamu
memanggil Claude untuk generate `users.routes.ts`, dia tidak tahu apa yang sudah
dia tulis di `schema.prisma` sebelumnya, kecuali kamu **eksplisit memberikan konteks itu**.

Ini berarti tanpa sistem konteks yang ketat:
- `schema.prisma` punya field `userId String`, tapi `users.service.ts` pakai `user_id`
- `users.routes.ts` import dari path yang tidak ada
- Zod schema di `users.schema.ts` punya field berbeda dari Prisma model
- Nama fungsi di `service.ts` tidak cocok dengan yang dipanggil di `routes.ts`

**Solusi:** Setiap Claude call harus membawa "single source of truth" yang sama sebagai
konteks wajib. Konteks ini dibangun secara bertahap dan di-lock setelah setiap tahap selesai.

---

## Konsep: ProjectContext Object

`ProjectContext` adalah objek tunggal yang dibangun secara bertahap selama proses generate.
Setiap Claude call menerima bagian dari `ProjectContext` yang relevan — dan hasilnya
langsung ditambahkan ke `ProjectContext` untuk dipakai oleh call berikutnya.

```typescript
// packages/generator/src/types/context.ts

export interface ProjectContext {
  // ── IDENTITAS PROJECT ──────────────────────────────────────────
  projectName: string          // "property-management-saas"
  projectNamePascal: string    // "PropertyManagementSaas"
  description: string          // Deskripsi asli dari user

  // ── OPENSPEC (di-lock setelah user konfirmasi) ────────────────
  openspec: {
    modules: ModuleSpec[]
    prismaModels: PrismaModelSpec[]
    frontendPages: PageSpec[]
  }

  // ── LOCKED ARTIFACTS (ditambahkan saat setiap file selesai) ───
  // Setelah schema.prisma selesai di-generate dan divalidasi,
  // isinya di-lock di sini. Semua call berikutnya wajib pakai ini.
  prismaSchema: string | null

  // Setelah packages/types/index.ts selesai
  sharedTypes: string | null

  // Setelah setiap module selesai, hasilnya disimpan di sini
  generatedModules: Record<string, GeneratedModule>
  //  key: nama module ("users", "products")
  //  value: { routesContent, schemaContent, serviceContent }
}

export interface ModuleSpec {
  name: string              // "users"
  namePascal: string        // "Users"
  nameSingular: string      // "user"
  description: string
  endpoints: string[]       // ["GET /api/users", "POST /api/users", ...]
  prismaModelName: string   // "User" — nama model yang berelasi
}

export interface PrismaModelSpec {
  name: string              // "User"
  tableName: string         // "users"  (untuk @@map)
  fields: PrismaFieldSpec[]
  relations: PrismaRelationSpec[]
}

export interface PrismaFieldSpec {
  name: string              // "email"
  type: string              // "String"
  isOptional: boolean
  isUnique: boolean
  attributes: string[]      // ["@default(cuid())", "@unique"]
}

export interface PrismaRelationSpec {
  fieldName: string         // "posts"
  modelName: string         // "Post"
  type: "one-to-many" | "many-to-one" | "many-to-many" | "one-to-one"
  foreignKey?: string       // "userId"
}

export interface GeneratedModule {
  name: string
  routesContent: string
  schemaContent: string     // Zod schema
  serviceContent: string
  registeredAs: string      // "/api/users" — path di Hono entry
}
```

---

## Tahap Generate: Dari Deskripsi ke File Lengkap

### TAHAP 0 — Parse Deskripsi → OpenSpec (1 Claude Call)

Ini adalah satu-satunya tahap yang menerima teks bebas dari user. Outputnya adalah
`OpenSpec` yang **terstruktur, tervalidasi, dan di-lock** — tidak boleh berubah setelah
user konfirmasi.

```
INPUT:
  "Aku mau bikin SaaS B2B untuk manajemen properti.
   Ada module tenant, unit, pembayaran sewa, dan laporan.
   Admin bisa lihat semua, tenant hanya bisa lihat unit mereka."

CLAUDE CALL #0 — OpenSpec Generator
System prompt: [lihat seksi Prompt Catalog]
User prompt  : deskripsi user

OUTPUT (JSON, divalidasi dengan Zod sebelum disimpan):
  {
    "projectName": "property-management-saas",
    "modules": [
      { "name": "tenants", "prismaModelName": "Tenant", ... },
      { "name": "units",   "prismaModelName": "Unit", ... },
      ...
    ],
    "prismaModels": [
      { "name": "User", "fields": [...], "relations": [...] },
      { "name": "Tenant", "fields": [...], "relations": [...] },
      ...
    ],
    "frontendPages": [...]
  }
```

**Setelah tahap ini:** `ProjectContext.openspec` di-lock. User konfirmasi, tidak ada
perubahan lagi pada spec kecuali user explicitly request edit.

---

### TAHAP 1 — Copy Static Templates (No Claude, ~50ms)

Semua file yang **tidak bergantung pada konten project** langsung dicopy dari template
dan di-interpolasi dengan nama project.

```
TIDAK ADA CLAUDE CALL — murni string interpolation

Files yang dihasilkan di tahap ini:
  .moon/workspace.yml          ← interpolasi: projectName
  .moon/tasks.yml              ← tidak ada interpolasi
  pnpm-workspace.yaml          ← tidak ada interpolasi
  tsconfig.json (root)         ← tidak ada interpolasi
  biome.json                   ← tidak ada interpolasi
  docker-compose.yml           ← interpolasi: projectName (DB name)
  docker-compose.dev.yaml      ← interpolasi: projectName
  .env.example                 ← interpolasi: projectName
  apps/api/package.json        ← interpolasi: projectName (semua versi di-pin)
  apps/api/tsconfig.json       ← tidak ada interpolasi
  apps/api/moon.yml            ← tidak ada interpolasi
  apps/platform/package.json   ← interpolasi: projectName (semua versi di-pin)
  apps/platform/tsconfig.json  ← tidak ada interpolasi
  apps/platform/moon.yml       ← tidak ada interpolasi
  apps/admin/package.json      ← interpolasi: projectName
  apps/admin/tsconfig.json     ← tidak ada interpolasi
  apps/admin/moon.yml          ← tidak ada interpolasi
  packages/types/package.json  ← interpolasi: projectName
  packages/types/tsconfig.json ← tidak ada interpolasi
```

**Setelah tahap ini:** Semua file konfigurasi yang tidak bisa salah sudah ada di DB.
`ProjectContext` tidak berubah.

---

### TAHAP 2 — Generate Prisma Schema (1 Claude Call)

Ini adalah **call terpenting** dalam seluruh pipeline. Output dari call ini menjadi
"source of truth" untuk semua call selanjutnya.

```
INPUT KE CLAUDE:
  - ProjectContext.openspec.prismaModels   (list model + field + relasi)
  - ProjectContext.openspec.modules        (untuk naming convention)
  - [STACK RULES] — aturan Prisma yang wajib diikuti (lihat seksi ini)

CLAUDE CALL #1 — Prisma Schema Generator
Output: konten schema.prisma

VALIDATOR (wajib sebelum lanjut):
  1. Parse dengan @prisma/internals — syntax valid?
  2. Semua relasi bilateral? (A.posts → B, B.author → A)
  3. Semua model punya id, createdAt, updatedAt?
  4. Semua model punya @@map()?
  5. Tidak ada circular dependency?

JIKA GAGAL: retry max 3x dengan error sebagai konteks tambahan
JIKA MASIH GAGAL: batalkan generate, tampilkan error ke user
```

**Setelah tahap ini:** `ProjectContext.prismaSchema` di-lock dengan konten
`schema.prisma` yang sudah tervalidasi. Tidak ada call setelah ini yang boleh
mengasumsikan field name — semuanya HARUS membaca dari `prismaSchema` ini.

---

### TAHAP 3 — Generate Shared Types (1 Claude Call)

```
INPUT KE CLAUDE:
  - ProjectContext.prismaSchema             ← WAJIB ADA
  - [INSTRUCTION] re-export semua Prisma types + derive helper types

CLAUDE CALL #2 — Shared Types Generator
Output: konten packages/types/src/index.ts

VALIDATOR:
  1. TypeScript syntax check
  2. Setiap model di prismaSchema punya export-nya?

JIKA GAGAL: retry max 3x
```

**Setelah tahap ini:** `ProjectContext.sharedTypes` di-lock. Tidak ada ambiguitas
soal nama type yang dipakai di frontend maupun backend.

---

### TAHAP 4 — Generate Per Module (N Claude Calls, Sequential Per Modul)

Untuk setiap module di `openspec.modules`, jalankan **3 call secara sequential**
(bukan paralel — tiap file bergantung pada file sebelumnya dalam modul yang sama).

```
Untuk setiap module M di openspec.modules:

  ┌─ CALL #A — Zod Schema (schema.ts) ────────────────────────────┐
  │  INPUT:                                                         │
  │    - ProjectContext.prismaSchema       ← nama field yang benar  │
  │    - ProjectContext.sharedTypes        ← types yang tersedia    │
  │    - openspec.modules[M]              ← endpoint yang ada       │
  │    - openspec.prismaModels[M.model]   ← field yang perlu Zod   │
  │  OUTPUT: {M}.schema.ts                                          │
  │  VALIDATOR: TypeScript syntax, semua Zod object punya .parse()  │
  └─────────────────────────────────────────────────────────────────┘
           ↓ (konten schema.ts menjadi input call berikutnya)

  ┌─ CALL #B — Service (service.ts) ──────────────────────────────┐
  │  INPUT:                                                         │
  │    - ProjectContext.prismaSchema       ← model name yang benar  │
  │    - schemaContent dari CALL #A        ← Zod types yang ada    │
  │    - openspec.modules[M]              ← operasi yang diperlukan │
  │  OUTPUT: {M}.service.ts                                         │
  │  VALIDATOR: TypeScript syntax, semua fungsi yang di-export      │
  │             cocok dengan yang dibutuhkan routes                 │
  └─────────────────────────────────────────────────────────────────┘
           ↓ (konten service.ts menjadi input call berikutnya)

  ┌─ CALL #C — Routes (routes.ts) ────────────────────────────────┐
  │  INPUT:                                                         │
  │    - schemaContent dari CALL #A        ← nama Zod schema        │
  │    - serviceContent dari CALL #B       ← nama fungsi service    │
  │    - openspec.modules[M].endpoints    ← endpoint yang dibuat    │
  │  OUTPUT: {M}.routes.ts                                          │
  │  VALIDATOR: TypeScript syntax, import path valid                │
  └─────────────────────────────────────────────────────────────────┘

  Setelah 3 call selesai:
  ProjectContext.generatedModules[M.name] = {
    routesContent, schemaContent, serviceContent,
    registeredAs: `/api/${M.name}`
  }
```

**Modules diproses secara sequential**, bukan paralel. Alasannya: kalau ada module
yang memiliki relasi ke module lain (misal `payments` butuh `units`), kita perlu
memastikan module yang direferensikan sudah selesai dulu.

---

### TAHAP 5 — Generate Hono Entry Point (1 Claude Call)

Ini adalah call yang paling singkat tapi krusial — dia harus tahu **semua module**
yang sudah dibuat untuk bisa register semuanya.

```
INPUT KE CLAUDE:
  - Object.keys(ProjectContext.generatedModules)
    → ["tenants", "units", "payments", "reports"]
  - Setiap module registeredAs path
  - [TEMPLATE] struktur Hono app yang harus diikuti

CLAUDE CALL — Hono Entry Generator
Output: apps/api/src/index.ts

ISI YANG DIHASILKAN (contoh):
  import { Hono } from 'hono'
  import { cors } from 'hono/cors'
  import { tenantsRoutes } from './modules/tenants/tenants.routes'
  import { unitsRoutes } from './modules/units/units.routes'
  import { paymentsRoutes } from './modules/payments/payments.routes'
  import { reportsRoutes } from './modules/reports/reports.routes'

  const app = new Hono()
  app.use('*', cors())
  app.route('/api/tenants', tenantsRoutes)
  app.route('/api/units', unitsRoutes)
  app.route('/api/payments', paymentsRoutes)
  app.route('/api/reports', reportsRoutes)

  export default app
```

**Catatan:** File ini bisa saja di-generate tanpa Claude (pure template + interpolasi
dari `generatedModules`). Tapi menggunakan Claude memberi fleksibilitas untuk auth
middleware dan error handling yang kontekstual.

---

### TAHAP 6 — Generate Hono RPC Client (1 Claude Call)

```
INPUT KE CLAUDE:
  - Konten apps/api/src/index.ts dari Tahap 5
  - Setiap {M}.routes.ts dari ProjectContext.generatedModules
  - [INSTRUCTION] buat Hono RPC client yang fully typed

CLAUDE CALL — RPC Client Generator
Output: apps/platform/src/utils/api.ts
```

---

### TAHAP 7 — Generate Frontend Pages (N Claude Calls, Paralel)

Halaman frontend adalah yang paling "loose" — mereka tidak mempengaruhi satu sama
lain, sehingga bisa diproses **secara paralel** (max 3 concurrent).

```
Untuk setiap page di openspec.frontendPages:

  CLAUDE CALL — TanStack Page Generator
  INPUT:
    - openspec.frontendPages[P]            ← path + description
    - ProjectContext.sharedTypes           ← types yang tersedia
    - apps/platform/src/utils/api.ts       ← RPC client yang bisa dipakai
    - [TEMPLATE] struktur TanStack Route yang wajib diikuti

  OUTPUT: apps/platform/src/routes/{path}.tsx

  PARALEL — max 3 concurrent calls
```

---

## Visualisasi Urutan Lengkap

```
User input
    │
    ▼
CALL #0 ──── OpenSpec Generator
    │         output: openspec JSON (di-lock)
    │
    ▼
[TAHAP 1] ── Copy Static Templates (no Claude)
    │         output: semua file config
    │
    ▼
CALL #1 ──── Prisma Schema Generator
    │         konteks: openspec.prismaModels
    │         output: schema.prisma (di-lock sebagai prismaSchema)
    │
    ▼
CALL #2 ──── Shared Types Generator
    │         konteks: prismaSchema
    │         output: packages/types/index.ts (di-lock sebagai sharedTypes)
    │
    ├── Module "tenants" ──────────────────────────────────────────┐
    │   CALL #3a  Zod Schema  ← konteks: prismaSchema, sharedTypes │
    │       ↓ hasil schema masuk konteks                            │
    │   CALL #4a  Service     ← konteks: prismaSchema, schemaContent│
    │       ↓ hasil service masuk konteks                           │
    │   CALL #5a  Routes      ← konteks: schemaContent, serviceContent│
    │       ↓ simpan ke generatedModules["tenants"]                 │
    │                                                               │
    ├── Module "units" (setelah tenants selesai) ───────────────────┤
    │   CALL #3b  Zod Schema  ← konteks: prismaSchema, sharedTypes  │
    │   CALL #4b  Service     ← ...                                 │
    │   CALL #5b  Routes      ← ...                                 │
    │                                                               │
    ├── Module "payments" (setelah units selesai) ──────────────────┤
    │   ...                                                         │
    │                                                               │
    └── Module "reports" (setelah payments selesai) ────────────────┘
                │
                ▼
CALL #N-1 ─── Hono Entry Point Generator
    │          konteks: semua generatedModules (daftar nama + path)
    │          output: apps/api/src/index.ts
    │
    ▼
CALL #N ───── Hono RPC Client Generator
    │          konteks: index.ts + semua routes content
    │          output: apps/platform/src/utils/api.ts
    │
    ▼
[PARALEL] ─── Frontend Pages (max 3 concurrent)
    │          konteks: sharedTypes + api.ts client
    │          output: apps/platform/src/routes/*.tsx
    │
    ▼
SELESAI — semua file ada di project_files DB
```

---

## Prompt Catalog: Setiap Call Punya System Prompt Sendiri

Ini adalah kunci deterministik. Setiap Claude call punya **system prompt yang berbeda**,
bukan satu system prompt generik "kamu adalah AI coding assistant".

### System Prompt #0 — OpenSpec Generator

```
You are MoonForge's OpenSpec Analyzer. Your ONLY job is to analyze a project
description and output a structured JSON specification.

RULES (non-negotiable):
- Output ONLY valid JSON. No markdown, no explanation, no preamble.
- projectName must be kebab-case
- Module names must be lowercase, kebab-case, plural
- Model names must be PascalCase, singular
- Always include a User model with: id, email, passwordHash, createdAt, updatedAt
- Maximum 6 modules
- Every module must have at least 4 endpoints: GET list, GET single, POST create, PUT update
- Every relation must have a corresponding foreign key field explicitly listed

OUTPUT SCHEMA:
{
  "projectName": string,
  "modules": Array<{
    "name": string,
    "namePascal": string,
    "nameSingular": string,
    "description": string,
    "prismaModelName": string,
    "endpoints": string[]
  }>,
  "prismaModels": Array<{
    "name": string,
    "tableName": string,
    "fields": Array<{
      "name": string,
      "type": "String"|"Int"|"Decimal"|"Boolean"|"DateTime"|"Json",
      "isOptional": boolean,
      "isUnique": boolean,
      "attributes": string[]
    }>,
    "relations": Array<{
      "fieldName": string,
      "modelName": string,
      "type": "one-to-many"|"many-to-one"|"many-to-many"|"one-to-one",
      "foreignKey": string
    }>
  }>,
  "frontendPages": Array<{
    "path": string,
    "description": string,
    "dataNeeded": string[]
  }>
}
```

### System Prompt #1 — Prisma Schema Generator

```
You are MoonForge's Prisma Schema Writer. You receive a structured spec and write
a valid schema.prisma file.

RULES (non-negotiable — every violation will be caught by our validator):
1. Output ONLY the raw content of schema.prisma. No markdown fences, no explanation.
2. Generator block: provider="prisma-client-js", output="../generated/prisma"
3. Datasource: provider="postgresql", url=env("DATABASE_URL")
4. Every model MUST have these fields in this order:
   - id        String   @id @default(cuid())
   - [other fields]
   - createdAt DateTime @default(now())
   - updatedAt DateTime @updatedAt
5. Every model MUST have @@map("snake_case_plural_table_name")
6. Decimal fields use @db.Decimal(10, 2)
7. Optional fields end with ?
8. String fields without explicit @db length have no length limit (this is correct for Postgres)
9. Every relation MUST be defined on BOTH sides
10. Enum values use ALL_CAPS
11. Foreign key fields must be present as explicit fields (e.g., userId String, not just @relation)

REFERENCE — the exact spec you must implement:
[OPENSPEC PRISMA MODELS JSON akan di-inject di sini]
```

### System Prompt #2 — Shared Types Generator

```
You are MoonForge's Type Exporter. Your job is to write packages/types/src/index.ts
that re-exports Prisma-generated types for use across the monorepo.

RULES:
1. Output ONLY the raw file content. No markdown.
2. Import from "@prisma/client" (this is the standard Prisma client path)
3. Re-export every model type: export type { User, Tenant, Unit, ... } from "@prisma/client"
4. Re-export every enum: export { Role, Status, ... } from "@prisma/client"
5. Add these utility types for every model:
   - CreateXxxInput: Omit<Xxx, 'id' | 'createdAt' | 'updatedAt'>
   - UpdateXxxInput: Partial<CreateXxxInput>
6. Do NOT import from relative paths inside packages/types
7. Do NOT define any types manually — derive everything from Prisma

CURRENT PRISMA SCHEMA (your source of truth):
[PRISMA SCHEMA CONTENT akan di-inject di sini]
```

### System Prompt #3 — Zod Schema Generator (per module)

```
You are MoonForge's Zod Schema Writer for the "{MODULE_NAME}" module.

RULES:
1. Output ONLY the raw content of {module}.schema.ts. No markdown.
2. Import Zod as: import { z } from 'zod'
3. Create these schemas (and export all of them):
   - Create{Model}Schema: all required fields, no id/createdAt/updatedAt
   - Update{Model}Schema: Create{Model}Schema.partial()
   - {Model}ParamsSchema: z.object({ id: z.string() })
   - {Model}QuerySchema: pagination params + any filterable fields
4. Field types must exactly match the Prisma schema — use the reference below
5. String fields that are emails: use z.string().email()
6. Decimal fields: use z.number().positive()
7. Optional Prisma fields: use z.string().optional() (not .nullable())
8. Do NOT import from packages/types — Zod schemas are standalone

PRISMA MODEL REFERENCE (your source of truth for field names and types):
[RELEVANT PRISMA MODEL akan di-inject di sini]
```

### System Prompt #4 — Service Generator (per module)

```
You are MoonForge's Service Writer for the "{MODULE_NAME}" module.

RULES:
1. Output ONLY the raw content of {module}.service.ts. No markdown.
2. Import Prisma client as:
   import { PrismaClient } from '../../../generated/prisma'
   const prisma = new PrismaClient()
3. Import Zod types from the module's own schema file:
   import { Create{Model}Schema, Update{Model}Schema } from './{module}.schema'
4. Export these functions (names must match EXACTLY — routes will import them by name):
   - getAll{Models}(query: z.infer<typeof {Model}QuerySchema>)
   - get{Model}ById(id: string)
   - create{Model}(data: z.infer<typeof Create{Model}Schema>)
   - update{Model}(id: string, data: z.infer<typeof Update{Model}Schema>)
   - delete{Model}(id: string)
5. Use async/await throughout
6. Prisma model name for this module: "{PRISMA_MODEL_NAME}"
7. Throw Error with descriptive message when record not found

ZOD SCHEMA CONTENT (already written — import from here):
[ZOD SCHEMA CONTENT dari CALL #A akan di-inject di sini]

PRISMA SCHEMA REFERENCE:
[PRISMA SCHEMA akan di-inject di sini]
```

### System Prompt #5 — Routes Generator (per module)

```
You are MoonForge's Hono Routes Writer for the "{MODULE_NAME}" module.

RULES:
1. Output ONLY the raw content of {module}.routes.ts. No markdown.
2. Import Hono as: import { Hono } from 'hono'
3. Import zValidator as: import { zValidator } from '@hono/zod-validator'
4. Import ALL service functions from './{module}.service' — use these EXACT names:
   [LIST FUNGSI YANG DIEKSPOR SERVICE akan di-inject di sini]
5. Import ALL zod schemas from './{module}.schema' — use these EXACT names:
   [LIST SCHEMA YANG DIEKSPOR akan di-inject di sini]
6. Export: export const {module}Routes = new Hono()
7. Register routes exactly as listed in the spec below
8. Use zValidator('json', SchemaName) for POST/PUT body validation
9. Use zValidator('param', {Model}ParamsSchema) for :id routes
10. Return JSON responses: c.json({ data: result }) for success

ENDPOINTS TO IMPLEMENT:
[ENDPOINTS dari openspec.modules[M] akan di-inject di sini]

SERVICE CONTENT (already written — copy function names exactly):
[SERVICE CONTENT dari CALL #B akan di-inject di sini]
```

---

## Mekanisme "Lock" — Mencegah Drift Antar Call

Setiap artifact yang di-lock disimpan di `ProjectContext` dan di-hash untuk deteksi
perubahan yang tidak sah.

```typescript
// packages/generator/src/context/lock.ts

export class ContextLock {
  private locks: Map<string, { content: string; hash: string }> = new Map()

  lock(key: string, content: string): void {
    if (this.locks.has(key)) {
      throw new Error(`Context key "${key}" is already locked. Cannot override.`)
    }
    this.locks.set(key, {
      content,
      hash: createHash('sha256').update(content).digest('hex')
    })
  }

  get(key: string): string {
    const locked = this.locks.get(key)
    if (!locked) {
      throw new Error(
        `Context key "${key}" is not yet available. Check generation order.`
      )
    }
    return locked.content
  }

  isLocked(key: string): boolean {
    return this.locks.has(key)
  }
}

// USAGE dalam orchestrator:
const lock = new ContextLock()

// Setelah schema.prisma selesai dan tervalidasi:
lock.lock('prismaSchema', generatedPrismaContent)

// Setelah packages/types/index.ts selesai:
lock.lock('sharedTypes', generatedTypesContent)

// Jika ada yang coba override:
lock.lock('prismaSchema', newContent)
// → throws: Context key "prismaSchema" is already locked. Cannot override.
```

---

## Context Injection: Template Untuk Setiap Call

Setiap prompt dirakit dari dua bagian: **system prompt** (tetap) + **user message**
(berisi konteks yang di-inject).

```typescript
// packages/generator/src/context/inject.ts

export function buildUserMessage(template: string, injections: Record<string, string>): string {
  // Template menggunakan placeholder {{KEY}}
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (!(key in injections)) {
      throw new Error(`Missing injection: {{${key}}} — check that this context is locked before this call`)
    }
    return injections[key]
  })
}

// Contoh: user message untuk Zod Schema Generator
const zodSchemaUserMessage = buildUserMessage(
  `Generate the Zod schema for the "{{moduleName}}" module.
  
  The Prisma model you must match exactly:
  \`\`\`
  {{relevantPrismaModel}}
  \`\`\`
  
  Full prisma schema for reference:
  \`\`\`
  {{prismaSchema}}
  \`\`\``,
  {
    moduleName: "tenants",
    relevantPrismaModel: extractModelFromSchema(lock.get('prismaSchema'), 'Tenant'),
    prismaSchema: lock.get('prismaSchema'),  // ERROR jika belum di-lock
  }
)
```

---

## Orchestrator: Implementasi Lengkap Urutan Generate

```typescript
// packages/generator/src/orchestrator.ts

export async function orchestrateGenerate(
  description: string,
  onProgress: (event: ProgressEvent) => void
): Promise<GenerateResult> {

  const lock = new ContextLock()
  const db = new ProjectFileRepository()

  // ── TAHAP 0: OpenSpec ────────────────────────────────────────────
  onProgress({ type: 'stage_start', stage: 'openspec' })
  const openspec = await generateOpenSpec(description)
  validateOpenSpec(openspec)  // Zod validation
  lock.lock('openspec', JSON.stringify(openspec))
  onProgress({ type: 'stage_done', stage: 'openspec' })

  // ── TAHAP 1: Static Templates ────────────────────────────────────
  onProgress({ type: 'stage_start', stage: 'templates' })
  const staticFiles = renderAllTemplates(openspec)
  await db.saveMany(staticFiles)
  onProgress({ type: 'stage_done', stage: 'templates', count: staticFiles.length })

  // ── TAHAP 2: Prisma Schema ───────────────────────────────────────
  onProgress({ type: 'file_start', file: 'apps/api/prisma/schema.prisma' })
  const prismaContent = await generateWithRetry(
    SYSTEM_PROMPTS.prismaSchema,
    buildPrismaUserMessage(openspec),
    validatePrismaSchema
  )
  lock.lock('prismaSchema', prismaContent)
  await db.save('apps/api/prisma/schema.prisma', prismaContent)
  onProgress({ type: 'file_done', file: 'apps/api/prisma/schema.prisma' })

  // ── TAHAP 3: Shared Types ────────────────────────────────────────
  onProgress({ type: 'file_start', file: 'packages/types/src/index.ts' })
  const typesContent = await generateWithRetry(
    SYSTEM_PROMPTS.sharedTypes,
    buildTypesUserMessage(lock.get('prismaSchema')),
    validateTypeScript
  )
  lock.lock('sharedTypes', typesContent)
  await db.save('packages/types/src/index.ts', typesContent)
  onProgress({ type: 'file_done', file: 'packages/types/src/index.ts' })

  // ── TAHAP 4: Per Module (Sequential) ────────────────────────────
  const generatedModules: Record<string, GeneratedModule> = {}

  for (const module of openspec.modules) {
    onProgress({ type: 'module_start', module: module.name })

    // 4A: Zod Schema
    const schemaContent = await generateWithRetry(
      buildZodSystemPrompt(module.name),
      buildZodUserMessage(module, lock),
      validateTypeScript
    )
    await db.save(`apps/api/src/modules/${module.name}/${module.name}.schema.ts`, schemaContent)

    // 4B: Service (menerima schema sebagai konteks)
    const serviceContent = await generateWithRetry(
      buildServiceSystemPrompt(module.name),
      buildServiceUserMessage(module, schemaContent, lock),
      validateTypeScript
    )
    await db.save(`apps/api/src/modules/${module.name}/${module.name}.service.ts`, serviceContent)

    // 4C: Routes (menerima schema + service sebagai konteks)
    const routesContent = await generateWithRetry(
      buildRoutesSystemPrompt(module.name),
      buildRoutesUserMessage(module, schemaContent, serviceContent),
      validateTypeScript
    )
    await db.save(`apps/api/src/modules/${module.name}/${module.name}.routes.ts`, routesContent)

    generatedModules[module.name] = { schemaContent, serviceContent, routesContent, registeredAs: `/api/${module.name}` }
    onProgress({ type: 'module_done', module: module.name })
  }

  lock.lock('generatedModules', JSON.stringify(generatedModules))

  // ── TAHAP 5: Hono Entry ──────────────────────────────────────────
  const entryContent = await generateWithRetry(
    SYSTEM_PROMPTS.honoEntry,
    buildEntryUserMessage(generatedModules),
    validateTypeScript
  )
  await db.save('apps/api/src/index.ts', entryContent)
  lock.lock('honoEntry', entryContent)

  // ── TAHAP 6: RPC Client ──────────────────────────────────────────
  const rpcContent = await generateWithRetry(
    SYSTEM_PROMPTS.rpcClient,
    buildRpcUserMessage(entryContent, generatedModules),
    validateTypeScript
  )
  await db.save('apps/platform/src/utils/api.ts', rpcContent)

  // ── TAHAP 7: Frontend Pages (Paralel, max 3) ─────────────────────
  await pMap(openspec.frontendPages, async (page) => {
    const pageContent = await generateWithRetry(
      SYSTEM_PROMPTS.tanstackPage,
      buildPageUserMessage(page, lock.get('sharedTypes'), rpcContent),
      validateTypeScript
    )
    await db.save(`apps/platform/src/routes${page.path}.tsx`, pageContent)
    onProgress({ type: 'file_done', file: `apps/platform/src/routes${page.path}.tsx` })
  }, { concurrency: 3 })

  return { success: true, totalFiles: await db.count() }
}
```

---

## Untuk Fase Refine: Konteks Yang Dimuat Ulang

Saat user membuka project lama dan mengirim pesan chat, konteks dibangun ulang dari DB
— bukan dari memori. Prosesnya berbeda dari generate:

```typescript
// packages/generator/src/refine/context-loader.ts

export async function loadProjectContextFromDB(projectId: string): Promise<RefineContext> {
  const files = await db.projectFile.findMany({ where: { projectId } })

  // Susun ulang "source of truth" dari file yang ada di DB
  const fileMap = Object.fromEntries(files.map(f => [f.path, f.content]))

  return {
    // Ini adalah prismaSchema yang sudah benar-benar divalidasi saat generate
    prismaSchema: fileMap['apps/api/prisma/schema.prisma'] ?? null,

    // Ini adalah types yang sudah diselaraskan dengan prisma schema
    sharedTypes: fileMap['packages/types/src/index.ts'] ?? null,

    // Index semua module yang ada berdasarkan file tree
    existingModules: detectModulesFromFileTree(fileMap),

    // Semua file lain sebagai referensi
    allFiles: fileMap,
  }
}

// Refine planner menerima context ini dan membuat rencana
export async function planRefinement(
  context: RefineContext,
  userRequest: string,
  chatHistory: ChatMessage[]
): Promise<RefinePlan> {

  // System prompt refine berbeda dari generate
  // Dia harus "understand existing code", bukan "create from scratch"
  const plan = await callClaude({
    system: SYSTEM_PROMPTS.refinePlanner,
    message: buildRefinePlannerMessage(context, userRequest, chatHistory)
  })

  return validateRefinePlan(JSON.parse(plan))
}
```

---

## Ringkasan: Apa yang Menjamin Konsistensi

| Mekanisme | Masalah yang Diselesaikan |
|-----------|--------------------------|
| `ContextLock` — artifact di-lock setelah selesai | Claude call belakangan tidak bisa "reinvent" schema |
| System prompt terpisah per file type | Claude tidak perlu "berpikir" apa rolenya — sudah ditentukan |
| Injection `{{KEY}}` yang eksplisit | Tidak ada asumsi — semua konteks selalu hadir secara eksplisit |
| Sequential module generation | Modul yang punya relasi ke modul lain punya akses konteks yang benar |
| Validator wajib sebelum lock | Artifact yang cacat tidak pernah menjadi "source of truth" |
| Retry dengan error sebagai konteks | Claude mendapat feedback spesifik, bukan generate ulang dari nol |
| Prisma schema sebagai pusat semua | Field name, type, dan relasi tidak pernah di-assume — selalu di-read |

---

*Dokumen ini adalah suplemen dari `MoonForge-Technical-Requirements.md` dan harus
dibaca bersama dokumen tersebut. Dokumen ini tidak mengulangi arsitektur sistem,
database schema, atau development phases — semua itu ada di dokumen utama.*