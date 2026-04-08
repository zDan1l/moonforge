# Tasks: Database Layer

## Phase 1: Prisma Setup

### Task 1.1: Install Prisma Dependencies
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Install Prisma ORM and required dependencies in the API app.

**Acceptance Criteria:**
- [x] `@prisma/client` installed in apps/api
- [x] `prisma` installed as dev dependency in apps/api
- [x] `tsx` installed for seed script execution

**Commands:**
```bash
cd apps/api
pnpm add @prisma/client
pnpm add -D prisma tsx
```

**Files:**
- `apps/api/package.json`

---

### Task 1.2: Initialize Prisma
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Initialize Prisma in the API app with PostgreSQL provider.

**Acceptance Criteria:**
- [x] `apps/api/prisma/` directory created
- [x] `schema.prisma` exists with PostgreSQL provider
- [x] DATABASE_URL environment variable configured

**Commands:**
```bash
cd apps/api
pnpm prisma init --datasource-provider postgresql
```

**Files:**
- `apps/api/prisma/schema.prisma`
- `apps/api/.env`

---

### Task 1.3: Define Complete Prisma Schema
**Duration:** 30 minutes
**Owner:** Backend

**Description:**
Define the complete Prisma schema with all 5 models, enums, relationships, indexes, and constraints.

**Acceptance Criteria:**
- [x] User model defined (id, email, name, timestamps)
- [x] Project model defined (id, userId, name, description, status, timestamps)
- [x] ProjectVersion model defined (id, projectId, versionNumber, label, createdAt)
- [x] ProjectFile model defined (id, projectId, versionId, path, content, fileSource)
- [x] ChatMessage model defined (id, projectId, versionId, role, content, fileChanges)
- [x] All enums defined (ProjectStatus, FileSource, MessageRole)
- [x] All relationships defined with proper onDelete: Cascade
- [x] Indexes added on foreign keys and frequently queried fields
- [x] Unique constraints defined

**Files:**
- `apps/api/prisma/schema.prisma`

---

## Phase 2: Database Client

### Task 2.1: Create Prisma Client Singleton
**Duration:** 15 minutes
**Owner:** Backend

**Description:**
Create a singleton Prisma client with proper configuration for development and production.

**Acceptance Criteria:**
- [x] `apps/api/src/lib/prisma.ts` created
- [x] Singleton pattern implemented (global caching)
- [x] Query logging enabled in development
- [x] Error logging enabled in production
- [x] Export named `prisma` constant

**Files:**
- `apps/api/src/lib/prisma.ts`

---

## Phase 3: Migrations

### Task 3.1: Create Initial Migration
**Duration:** 15 minutes
**Owner:** Backend

**Description:**
Create and apply the initial database migration.

**Acceptance Criteria:**
- [x] Migration file created in `prisma/migrations/`
- [x] Migration applied to PostgreSQL database
- [x] All 5 tables created with correct schema
- [x] All indexes and constraints created
- [x] Prisma Client generated

**Commands:**
```bash
cd apps/api
pnpm prisma migrate dev --name init
```

**Files:**
- `apps/api/prisma/migrations/{timestamp}_init/migration.sql`

---

### Task 3.2: Create Package.json Seed Script
**Duration:** 5 minutes
**Owner:** Backend

**Description:**
Configure seed script in package.json.

**Acceptance Criteria:**
- [ ] `prisma.seed` property added to apps/api/package.json
- [ ] Points to `tsx prisma/seed.ts`

**Files:**
- `apps/api/package.json`

---

## Phase 4: Seed Script

### Task 4.1: Create Seed Script
**Duration:** 30 minutes
**Owner:** Backend

**Description:**
Create a comprehensive seed script for development testing.

**Acceptance Criteria:**
- [ ] `apps/api/prisma/seed.ts` created
- [ ] Creates test user (test@moonforge.dev)
- [ ] Creates test project with DRAFT status
- [ ] Creates initial version for project
- [ ] Creates sample project files (README.md, .gitignore)
- [ ] Creates sample chat messages (user and assistant)
- [ ] Proper error handling and cleanup

**Files:**
- `apps/api/prisma/seed.ts`

---

### Task 4.2: Run Seed Script
**Duration:** 5 minutes
**Owner:** Backend

**Description:**
Execute the seed script and verify data is created.

**Acceptance Criteria:**
- [ ] `pnpm prisma db seed` completes without errors
- [ ] User created in database
- [ ] Project created with version
- [ ] Files created for project
- [ ] Chat messages created
- [ ] Verify with Prisma Studio or direct query

**Commands:**
```bash
cd apps/api
pnpm prisma db seed
```

---

## Phase 5: Verification

### Task 5.1: Verify Database Connection
**Duration:** 10 minutes
**Owner:** QA/Backend

**Description:**
Create a test script to verify database connection and basic operations.

**Acceptance Criteria:**
- [ ] Test script can connect to database
- [ ] Can query User table
- [ ] Can create a new record
- [ ] Can update a record
- [ ] Can delete a record
- [ ] All operations are type-safe

**Files:**
- `apps/api/src/__tests__/db-test.ts` (optional)

---

### Task 5.2: Verify Prisma Studio
**Duration:** 5 minutes
**Owner:** QA

**Description:**
Verify Prisma Studio works for viewing and editing data.

**Acceptance Criteria:**
- [ ] `pnpm prisma studio` starts successfully
- [ ] Studio opens in browser
- [ ] Can view all tables
- [ ] Can view records
- [ ] Can edit records
- [ ] Can create new records

**Commands:**
```bash
cd apps/api
pnpm prisma studio
```

---

### Task 5.3: Verify Type Generation
**Duration:** 5 minutes
**Owner:** Backend

**Description:**
Verify Prisma generates correct TypeScript types.

**Acceptance Criteria:**
- [ ] Types generated in `node_modules/.prisma/client`
- [ ] Can import types: `User`, `Project`, etc.
- [ ] Types include all model fields
- [ ] Enums are correctly typed
- [ ] No TypeScript errors when using types

**Files:**
- Verify generated types in `node_modules/.prisma/client/index.d.ts`

---

## Phase 6: Documentation

### Task 6.1: Create Database Documentation
**Duration:** 15 minutes
**Owner:** Backend/Docs

**Description:**
Document the database schema, migration workflow, and common operations.

**Acceptance Criteria:**
- [ ] ERD diagram created (or described)
- [ ] Migration workflow documented
- [ ] Seed script usage documented
- [ ] Common Prisma operations documented
- [ ] Environment variables documented

**Files:**
- `apps/api/prisma/README.md`

---

## Summary

**Total Estimated Duration:** 2.5-3 hours

**Task Breakdown:**
- Phase 1 (Prisma Setup): 50 minutes
- Phase 2 (Database Client): 15 minutes
- Phase 3 (Migrations): 20 minutes
- Phase 4 (Seed Script): 35 minutes
- Phase 5 (Verification): 20 minutes
- Phase 6 (Documentation): 15 minutes

**Dependencies:**
- Feature 1: Infrastructure Setup must be complete
- PostgreSQL must be running (`docker-compose -f docker-compose.dev.yaml up -d postgres`)

**Risks:**
- DATABASE_URL not configured correctly
- PostgreSQL not running
- Migration conflicts if schema changes after initial migration

**Mitigation:**
- Add DATABASE_URL to .env.example
- Add database health check script
- Use `prisma migrate reset` for development (wipes data)
- Document migration reset warning
