## 1. Prisma Schema Setup

- [x] 1.1 Update datasource db provider to `postgresql` (url comes from env via prisma.config.ts)
- [x] 1.2 Define users model with id, email, name, created_at, updated_at
- [x] 1.3 Define projects model with relations to users and status enum
- [x] 1.4 Define project_versions model with unique constraint on (project_id, version_number)
- [x] 1.5 Define project_files model with file_source enum and unique constraint on (version_id, path)
- [x] 1.6 Define chat_messages model with role enum and JSONB file_changes column
- [x] 1.7 Add indexes: projects(user_id), project_versions(project_id), project_files(project_id, version_id), chat_messages(project_id, version_id)
- [x] 1.8 Verify all cascade delete relationships are configured correctly

## 2. Directory Structure & Prisma Client

- [x] 2.1 Create `apps/api/src/lib/` directory
- [x] 2.2 Create `apps/api/src/lib/prisma.ts` with singleton Prisma client instance
- [x] 2.3 Verify Prisma client output location is `../src/generated/prisma` (already configured in generator block)

## 3. Database Migration

- [x] 3.1 Start PostgreSQL database: `docker-compose -f docker-compose.dev.yaml up -d`
- [x] 3.2 Run migration from apps/api: `pnpm prisma migrate dev --name init_database_layer`
- [x] 3.3 Verify migration SQL file is generated in `apps/api/prisma/migrations/`
- [x] 3.4 Run `pnpm prisma generate` to generate Prisma client types
- [x] 3.5 Verify generated types are in `apps/api/src/generated/prisma/` directory
- [x] 3.6 Test database connection and ensure schema is applied

## 4. Validation

- [x] 4.1 Verify all enums are defined (project_status, file_source, message_role)
- [x] 4.2 Test unique constraints (email, project+version number, version+file path)
- [x] 4.3 Test cascade delete behavior manually or with test queries
- [x] 4.4 Verify all relationships work correctly in Prisma Client queries
