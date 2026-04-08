# 🌕 MoonForge

**Product Requirements Document**

> *Setup fullstack monorepo dalam hitungan menit.*
> *Sesuaikan kebutuhan project-mu selamanya lewat chat.*

| | |
|---|---|
| **Versi** | 1.0 — MVP (Revised) |
| **Target** | Hackathon Refactory |
| **Timeline** | 24 Jam Build Sprint |
| **Status** | CONFIDENTIAL — Database Schema Revised |

---

## 1. Executive Summary

MoonForge adalah AI workspace untuk setup dan refinement fullstack monorepo. Produk ini memangkas proses setup dari berjam-jam menjadi hitungan menit dengan menggabungkan template monorepo yang sudah teruji dengan kustomisasi berbasis Claude AI.

> ⚠️ **Problem Statement**
>
> Setup fullstack monorepo dengan Moon memakan waktu lama. Developer harus mengkonfigurasi secara manual struktur folder, Moon tasks, koneksi antar app, Prisma schema, Zod validation, routing, dan shared types — semua harus konsisten sejak awal. Ketika project berkembang, menambah satu tabel berarti update schema, types, routes, dan service sekaligus. Satu file tidak sinkron = aplikasi error.

MoonForge hadir untuk membebaskan developer dari boilerplate dan konfigurasi, sehingga mereka bisa fokus membangun produk.

---

## 2. Product Overview

### 2.1 One-Liner

*"Setup fullstack Moon monorepo dalam hitungan menit. Sesuaikan kebutuhan project-mu selamanya lewat chat."*

### 2.2 Pendekatan Utama

MoonForge menggunakan pendekatan **Template Base + AI Customization**:

| Komponen | Deskripsi |
|---|---|
| **Template Base** | Seluruh infrastruktur yang tidak berubah antar project — Moon config, koneksi antar app, Biome, Docker, pnpm workspace, tsconfig. Sudah teruji dan siap jalan. |
| **AI Customization** | Hanya bagian yang spesifik per project — Prisma schema, module routes/service/Zod, shared types, dan OpenSpec docs. |

### 2.3 Dua Fase Utama

**Fase 1 — Setup**

1. User mendeskripsikan kebutuhan project dalam bahasa natural.
2. AI menampilkan MoonForge merge template + customization Claude.
3. File disimpan ke PostgreSQL → tampilkan file tree → download `.zip`.
4. `pnpm install` → `pnpm run dev` → langsung jalan.

**Fase 2 — Refine**

5. User bisa kembali ke project kapanpun dari history.
6. Chatbot context-aware mengetahui seluruh struktur project.
7. Claude memodifikasi hanya file yang relevan (surgical, bukan regenerate ulang).
8. Sebelum download, user melihat diff view — perubahan file mana saja.
9. Download `.zip` versi terbaru → sinkronisasi database dengan `pnpm prisma migrate dev`.

---

## 3. User Flow

### 3.1 Fase 1 — Setup: Dari Deskripsi ke Monorepo Siap Jalan

#### Langkah 1 — Buat Project Baru

User membuka MoonForge dan membuat project baru dengan menekan tombol "New Project". Project kosong langsung terbuat dan user diarahkan ke halaman workspace utama.

#### Langkah 2 — Chatbot Terbuka Otomatis

Begitu project terbuat, chatbot langsung aktif dan terbuka di panel kiri. Tidak ada form panjang, tidak ada wizard multi-step. User langsung disambut dengan prompt input yang siap menerima deskripsi project.

#### Langkah 3 — User Menginput Prompt

User mendeskripsikan kebutuhan project mereka dalam bahasa natural:

- "SaaS B2B dengan module users, subscription, dan dashboard analytics"
- "Marketplace dengan module products, orders, payments, dan reviews"
- "Internal tool HR dengan module employees, attendance, dan payroll"

Setelah prompt dikirim, AI langsung memproses dan mulai generate struktur monorepo.

#### Langkah 4 — File Tree Muncul, Chatbot Tetap Terbuka

UI langsung menampilkan File Tree dari monorepo yang baru di-generate — tanpa halaman terpisah. File Tree muncul di panel kanan, chatbot tetap aktif di panel kiri.

- File bertanda `[T]` — berasal dari template, tidak perlu disentuh
- File bertanda `[AI]` — di-generate oleh Claude berdasarkan deskripsi user

#### Langkah 5 — Download dan Jalankan

User bisa langsung download seluruh project sebagai file `.zip`. Setelah di-extract:

```bash
pnpm install
pnpm prisma migrate dev
pnpm run dev
```

### 3.2 Fase 2 — Refine: Modifikasi Surgical Kapanpun

#### Cara Refine Bekerja

User menulis permintaan perubahan dalam bahasa natural di chatbot:

- "Tambah tabel products dengan field name, price, stock, dan category_id"
- "Tambah route GET /users/:id/orders di module orders"

#### Setelah Refine

- File Tree diperbarui — file yang berubah ditandai dengan warna berbeda
- Code Preview menampilkan diff highlighting — perubahan lama vs baru terlihat jelas
- User bisa download `.zip` versi terbaru kapanpun
- Shared types di `packages/types` diperbarui otomatis setiap ada perubahan Prisma schema

---

## 4. Tech Stack Output

Stack ini bersifat opinionated dan tidak dapat diganti. Yang dikustomisasi hanyalah schema, module, dan routing sesuai deskripsi project.

| Layer | Tool / Library |
|---|---|
| Monorepo | Moon + PNPM |
| Frontend | React 19 + TanStack Router + TanStack Start |
| Backend | Hono.js |
| ORM | Prisma + PostgreSQL |
| Validation | Zod |
| Styling | Tailwind CSS v4 |
| Linter | Biome |
| Git Hooks | Husky |

---

## 5. Struktur Output Monorepo

### 5.1 File Architecture

```
📁 {project-name}/
│
├── .moon/
│   ├── workspace.yml [T]         — Moon workspace config
│   └── tasks.yml [T]             — Moon tasks definition
│
├── apps/
│   ├── platform/ [T]             — Frontend app utama (TanStack Start)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx [T]           — Root layout dengan providers
│   │   │   │   ├── index.tsx [T]            — Redirect ke /dashboard
│   │   │   │   └── dashboard/
│   │   │   │       ├── __root.tsx [T]       — Dashboard layout
│   │   │   │       └── index.tsx [T]        — Dashboard home page
│   │   │   ├── components/
│   │   │   │   └── ui/ [T]                  — Shared UI components (button, card, input, dll)
│   │   │   ├── lib/
│   │   │   │   └── api.ts [AI]              — Hono RPC client (fully typed)
│   │   │   ├── styles.css [T]
│   │   │   └── router.tsx [T]
│   │   ├── package.json [T]      — Deps: TanStack Start, React 19, Tailwind v4
│   │   ├── tsconfig.json [T]
│   │   ├── vite.config.ts [T]
│   │   └── moon.yml [T]
│   │
│   ├── admin/ [T]                — Admin panel (TanStack Start)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx [T]           — Root layout
│   │   │   │   └── index.tsx [T]            — Admin home
│   │   │   └── components/
│   │   │       └── ui/ [T]                  — Shared UI components
│   │   ├── package.json [T]
│   │   ├── tsconfig.json [T]
│   │   ├── vite.config.ts [T]
│   │   └── moon.yml [T]
│   │
│   └── api/ [T]                  — Backend (Hono + Prisma + Zod)
│       ├── prisma/
│       │   └── schema.prisma [AI]           — Model & relasi sesuai kebutuhan user
│       ├── src/
│       │   ├── generated/
│       │   │   └── prisma/ [T]              — Prisma client output
│       │   ├── modules/ [AI]                — Generated per module
│       │   │   ├── {module-name}/
│       │   │   │   ├── {module}.routes.ts [AI]   — Hono routes dengan zValidator
│       │   │   │   ├── {module}.schema.ts [AI]   — Zod validation schemas
│       │   │   │   └── {module}.service.ts [AI]  — Business logic dengan Prisma
│       │   │   ├── users/
│       │   │   │   ├── users.routes.ts
│       │   │   │   ├── users.schema.ts
│       │   │   │   └── users.service.ts
│       │   │   └── ... (other modules)
│       │   ├── lib/
│       │   │   └── prisma.ts [T]            — Prisma client singleton
│       │   └── index.ts [AI]               — Hono app entry dengan semua routes
│       ├── package.json [T]      — Deps: Hono, Prisma, Zod, @anthropic-ai/sdk
│       ├── tsconfig.json [T]
│       └── moon.yml [T]
│
├── packages/
│   └── types/ [AI]               — Shared TypeScript types
│       ├── src/
│       │   └── index.ts [AI]     — Re-export Prisma types + utility types
│       ├── package.json [T]
│       └── tsconfig.json [T]
│
├── .env.example [T]              — Template environment variables
├── .gitignore [T]
├── biome.json [T]                — Biome linter config
├── docker-compose.yml [T]        — PostgreSQL + app services
├── docker-compose.dev.yaml [T]   — Dev environment
├── moon.yml [T]                  — Root Moon config
├── package.json [T]              — Root package.json with scripts
├── pnpm-lock.yaml [T]            — Generated (template includes base deps)
├── pnpm-workspace.yaml [T]       — Workspace config
└── tsconfig.json [T]             — Root TypeScript config
```

> 📝 Project template sudah ada di server beserta codenya.

### 5.2 File yang Di-generate AI

| File | Isi |
|---|---|
| `prisma/schema.prisma` | Model dan relasi sesuai kebutuhan user |
| `src/modules/{m}/*.ts` | Routes, Zod schema, service per module |
| `packages/types/src/index.ts` | Shared TypeScript types dari Prisma schema |
| `openspec/specs/{p}/*.md` | Proposal, tasks, dan design documentation (internal only) |

---

## 6. UI — Tiga Panel Workspace

Setelah monorepo ter-generate, user masuk ke workspace tiga panel:

| Panel | Fungsi |
|---|---|
| **Panel Kiri** | Chatbot refine — input permintaan perubahan dalam bahasa natural, riwayat percakapan per project. |
| **Panel Tengah** | Code preview — tampilkan isi file dengan diff highlighting, menandai baris yang berubah. |
| **Panel Kanan** | File explorer — tree struktur monorepo, file yang berubah ditandai dengan warna berbeda (template vs AI-generated vs modified). |

---

## 7. MVP Scope — 24 Jam

### 7.1 Fase 1 — Setup

- Input natural language
- OpenSpec preview + konfirmasi user
- Merge template + AI customization
- Simpan ke PostgreSQL
- File tree preview dengan label: template vs AI-generated
- Download `.zip` → `pnpm install` → `pnpm run dev`

### 7.2 Fase 2 — Refine

- History project dari database
- Chatbot context-aware (tahu seluruh struktur project)
- Modifikasi file spesifik (surgical)
- Auto-update shared types setiap ada perubahan schema
- Diff view sebelum download
- Download `.zip` versi terbaru

### 7.3 Kemampuan Refine — MVP vs Post-MVP

| Status | Kemampuan |
|---|---|
| ✅ **MVP** | Tambah Prisma model baru, tambah field ke model yang ada, tambah module baru (routes + schema + service), tambah route baru di module yang ada, auto-update shared types. |
| ❌ **Post-MVP** | Rename tabel dengan cascade changes, refactor struktur folder, auto-generate migration SQL. |

> 📝 **Catatan Database Migration**
>
> Untuk migrasi database di MVP: setelah download dan install, user cukup jalankan `pnpm prisma migrate dev` untuk menginisialisasi database dari schema yang sudah ada.

### 7.4 Infrastruktur

- Deploy di Kubernetes
- PostgreSQL untuk semua persistence (project files, chat history, user sessions)

---

## 8. Database Schema MoonForge (Revised)

> 🔧 **Ringkasan Perubahan Database Schema**
>
> Berikut adalah kesalahan yang ditemukan dan perbaikan yang diterapkan:
>
> 1. **[TAMBAH]** Tabel `project_versions` — PRD menyebut 'versi terbaru', 'diff view', dan kemampuan memuat ulang project dari history. Skema original tidak memiliki mekanisme versioning sama sekali.
>
> 2. **[TAMBAH]** Kolom `file_source` pada `project_files` — PRD mendefinisikan tiga jenis file: template `[T]`, AI-generated `[AI]`, dan modified. Kolom `is_template` (BOOLEAN) tidak cukup untuk membedakan 'AI-generated yang belum dimodifikasi' vs 'AI-generated yang sudah dimodifikasi'.
>
> 3. **[TAMBAH]** Kolom `version_id` pada `project_files` — Setiap file harus terikat ke versi tertentu agar diff view dan download per-versi dapat berfungsi dengan benar.
>
> 4. **[TAMBAH]** Kolom `version_id` pada `chat_messages` — Chat perlu dikaitkan ke versi spesifik agar chatbot context-aware bisa merekonstruksi state project pada titik waktu tertentu.
>
> 5. **[PERBAIKAN]** Kolom `status` pada `projects` — Menambahkan nilai 'refined' ke ENUM karena alur Fase 2 menghasilkan status yang berbeda dari 'modified' (yang bisa ambigu).

---

### TABLE: `users`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `email` | VARCHAR | Unique, login identifier |
| `name` | VARCHAR | Display name (opsional) |
| `created_at` | TIMESTAMP | Waktu registrasi |

---

### TABLE: `projects`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users.id |
| `name` | VARCHAR | Nama project |
| `description` | TEXT | Deskripsi natural language dari user |
| `status` | ENUM | `draft` \| `generated` \| `refined` ✦ Ditambahkan 'refined' untuk Fase 2 |
| `created_at` | TIMESTAMP | Waktu project dibuat |
| `updated_at` | TIMESTAMP | Waktu terakhir diubah |

---

### TABLE: `project_versions` ✦ BARU

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | UUID | FK → projects.id |
| `version_number` | INTEGER | Urutan versi, auto-increment per project (1, 2, 3...) |
| `label` | VARCHAR | Label opsional, e.g. 'Initial setup', 'Add products module' |
| `created_at` | TIMESTAMP | Waktu versi ini dibuat |

> **Mengapa `project_versions` diperlukan?**
> PRD menyebut 'download .zip versi terbaru', 'diff view perubahan', dan 'kembali ke project kapanpun dari history'. Tanpa tabel ini, tidak ada cara untuk membedakan state file sebelum dan sesudah refine. Setiap kali user menyelesaikan satu sesi generate atau refine, satu row versions baru dibuat.

---

### TABLE: `project_files` ✦

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | UUID | FK → projects.id |
| `version_id` | UUID | FK → project_versions.id ✦ BARU — ikat file ke versi |
| `path` | VARCHAR | Path relatif, e.g. `apps/api/prisma/schema.prisma` |
| `content` | TEXT | Isi file lengkap |
| `file_source` | ENUM | `template` \| `ai_generated` \| `modified` ✦ Ganti `is_template` (BOOLEAN) |
| `updated_at` | TIMESTAMP | Waktu file terakhir diubah |

> **Mengapa `file_source` menggantikan `is_template`?**
> PRD mendefinisikan tiga kategori file dengan label berbeda di UI:
> - `[T]` = template → `file_source = 'template'`
> - `[AI]` = generated by Claude → `file_source = 'ai_generated'`
> - (warna berbeda) = sudah dimodifikasi → `file_source = 'modified'`
>
> Kolom BOOLEAN `is_template` hanya bisa membedakan template vs non-template. Tidak bisa membedakan file AI yang belum disentuh vs yang sudah dimodifikasi lewat refine.

---

### TABLE: `chat_messages`

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | UUID | Primary key |
| `project_id` | UUID | FK → projects.id |
| `version_id` | UUID | FK → project_versions.id ✦ BARU — chat terikat ke versi |
| `role` | ENUM | `user` \| `assistant` |
| `content` | TEXT | Isi pesan |
| `file_changes` | JSONB | Daftar path file yang berubah akibat pesan ini |
| `created_at` | TIMESTAMP | Waktu pesan dikirim |

> **Mengapa `version_id` pada `chat_messages`?**
> Chatbot 'context-aware' di PRD berarti AI perlu merekonstruksi state project saat percakapan terjadi. Dengan `version_id`, sistem bisa:
> - Load semua file dari versi terkait sebagai konteks AI
> - Tampilkan chat history yang relevan per sesi refine
> - Korelasikan pesan dengan perubahan file yang terjadi pada versi tersebut

---

### 8.1 Ringkasan Relasi Antar Tabel

| Tabel Asal | Relasi | Tabel Tujuan |
|---|---|---|
| `users` | 1 → N | `projects` |
| `projects` | 1 → N | `project_versions` |
| `projects` | 1 → N | `project_files` |
| `projects` | 1 → N | `chat_messages` |
| `project_versions` | 1 → N | `project_files` |
| `project_versions` | 1 → N | `chat_messages` |

### 8.2 Logika Penyimpanan File

File disimpan per-path dan per-versi di database, bukan sebagai blob `.zip`. Ketika Claude memodifikasi satu file dalam sesi refine:

1. Buat row baru di `project_versions` (version_number +1).
2. Salin semua file dari versi sebelumnya ke versi baru (copy-on-write).
3. Update hanya row file yang berubah, set `file_source = 'modified'`.
4. File template tidak pernah disentuh kecuali ada perubahan versi template.

---

## 9. Arsitektur MoonForge

MoonForge sendiri dibangun sebagai Moon monorepo — dogfooding konsepnya sendiri.

```
📁 moonforge/
├── apps/
│   ├── web/          ← TanStack Start (UI utama)
│   └── api/          ← Hono.js (REST API)
│
├── packages/
│   ├── generator/    ← logic: template merge + AI customization
│   ├── types/        ← shared TypeScript types
│   ├── ui/           ← shared components
│   └── db/           ← Prisma + PostgreSQL
│
└── infra/
    ├── k8s/          ← Kubernetes manifests
    └── Dockerfile.*
```

---

## 10. Competitive Differentiation

| Fitur | Template CLI | AI Generator | MoonForge |
|---|---|---|---|
| Input | Pilih template | Natural language | **Natural language** |
| Output | Statis | Generate sekali | **Template + AI customization** |
| Konsistensi | Manual | Tidak terjamin | **Selalu terjamin** |
| Iterasi | Dari nol | Dari nol | **Surgical per file** |
| Moon support | ✗ | ✗ | **✓** |
| Persistent workspace | ✗ | ✗ | **✓** |
| Versioning | ✗ | ✗ | **✓ (via project_versions)** |
