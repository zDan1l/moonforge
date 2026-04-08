# MoonForge Template Base — File Tree Output

Struktur monorepo yang di-generate untuk user download.  
File dengan `[T]` = dari template (statis), file dengan `[AI]` = di-generate oleh Claude.

```
{project-name}/
│
├── .moon/
│   ├── workspace.yml         [T] — Moon workspace config
│   └── tasks.yml             [T] — Moon tasks definition
│
├── apps/
│   ├── platform/             [T] — Frontend app utama (TanStack Start)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx           [T] — Root layout dengan providers
│   │   │   │   ├── index.tsx            [T] — Redirect ke /dashboard
│   │   │   │   └── dashboard/
│   │   │   │       ├── __root.tsx       [T] — Dashboard layout
│   │   │   │       └── index.tsx        [T] — Dashboard home page
│   │   │   ├── components/
│   │   │   │   └── ui/                  [T] — Shared UI components (button, card, input, dll)
│   │   │   ├── lib/
│   │   │   │   └── api.ts               [AI] — Hono RPC client (fully typed)
│   │   │   ├── styles.css               [T]
│   │   │   └── router.tsx               [T]
│   │   ├── package.json                [T] — Deps: TanStack Start, React 19, Tailwind v4
│   │   ├── tsconfig.json               [T]
│   │   ├── vite.config.ts              [T]
│   │   └── moon.yml                    [T]
│   │
│   ├── admin/                [T] — Admin panel (TanStack Start)
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   │   ├── __root.tsx           [T] — Root layout
│   │   │   │   └── index.tsx            [T] — Admin home
│   │   │   └── components/
│   │   │       └── ui/                  [T] — Shared UI components
│   │   ├── package.json                [T] — Deps sama seperti platform
│   │   ├── tsconfig.json               [T]
│   │   ├── vite.config.ts              [T]
│   │   └── moon.yml                    [T]
│   │
│   └── api/                  [T] — Backend (Hono + Prisma + Zod)
│       ├── prisma/
│       │   └── schema.prisma           [AI] — Model & relasi sesuai kebutuhan user
│       ├── src/
│       │   ├── generated/
│       │   │   └── prisma/             [T] — Prisma client output
│       │   ├── modules/                [AI] — Generated per module
│       │   │   ├── {module-name}/
│       │   │   │   ├── {module}.routes.ts    [AI] — Hono routes dengan zValidator
│       │   │   │   ├── {module}.schema.ts    [AI] — Zod validation schemas
│       │   │   │   └── {module}.service.ts   [AI] — Business logic dengan Prisma
│       │   │   ├── users/
│       │   │   │   ├── users.routes.ts
│       │   │   │   ├── users.schema.ts
│       │   │   │   └── users.service.ts
│       │   │   └── ... (other modules)
│       │   ├── lib/
│       │   │   └── prisma.ts            [T] — Prisma client singleton
│       │   └── index.ts                 [AI] — Hono app entry dengan semua routes
│       ├── package.json                [T] — Deps: Hono, Prisma, Zod, @anthropic-ai/sdk
│       ├── tsconfig.json               [T]
│       └── moon.yml                    [T]
│
├── packages/
│   └── types/                [AI] — Shared TypeScript types
│       ├── src/
│       │   └── index.ts             [AI] — Re-export Prisma types + utility types
│       ├── package.json            [T]
│       └── tsconfig.json           [T]
│
├── .env.example           [T] — Template environment variables
├── .gitignore             [T]
├── biome.json             [T] — Biome linter config
├── docker-compose.yml     [T] — PostgreSQL + app services
├── docker-compose.dev.yaml [T] — Dev environment
├── moon.yml               [T] — Root Moon config
├── package.json           [T] — Root package.json with scripts
├── pnpm-lock.yaml         [T] — Generated (but template includes base deps)
├── pnpm-workspace.yaml    [T] — Workspace config
└── tsconfig.json          [T] — Root TypeScript config
```

---

## File Distribution Breakdown

### Template Files (Statis) — ~22 files
| Category | Files |
|----------|-------|
| Config | .moon/*, moon.yml, biome.json, pnpm-workspace.yaml, tsconfig files |
| Docker | docker-compose.yml, docker-compose.dev.yaml |
| Root | package.json, .env.example, .gitignore |
| Platform/Admin | package.json, vite.config.ts, moon.yml, tsconfig.json, routes/__root.tsx, routes/index.tsx, components/ui/*, styles.css, router.tsx |
| API | package.json, moon.yml, tsconfig.json, vite.config.ts, lib/prisma.ts |

### AI Generated Files — Dinamis berdasarkan user input
| File | Content Source |
|------|----------------|
| prisma/schema.prisma | OpenSpec prismaModels |
| packages/types/src/index.ts | Dari schema.prisma |
| src/modules/{m}/*.ts | Dari OpenSpec modules + schema |
| src/index.ts | Dari semua generated modules |
| lib/api.ts | Dari src/index.ts (RPC client) |

---

## Module Structure Detail

Setiap module di `apps/api/src/modules/{module-name}/` memiliki 3 file:

```
users/
├── users.schema.ts    — Zod schemas: CreateUser, UpdateUser, UserParams, UserQuery
├── users.service.ts   — CRUD: getAllUsers, getUserById, createUser, updateUser, deleteUser
└── users.routes.ts    — Hono router: GET /, GET /:id, POST, PUT /:id, DELETE /:id
```

Dependencies antar file dalam module:
```
routes.ts  →  schema.ts (zValidator) + service.ts (business logic)
service.ts →  schema.ts (input types) + prisma (database)
```

---

## Quick Start untuk User

```bash
# Download & extract
unzip {project-name}.zip
cd {project-name}

# Install dependencies
pnpm install

# Setup database
docker-compose up -d db
pnpm --filter=api prisma migrate dev
pnpm --filter=api prisma generate

# Run development
pnpm dev
# → API: http://localhost:8000
# → Platform: http://localhost:3000
# → Admin: http://localhost:3001
```
