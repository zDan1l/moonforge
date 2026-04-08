## Why

MoonForge requires a persistent database layer to store user projects, file generations, and chat history. Currently the Prisma schema is empty - no models are defined. Without proper database schema, the application cannot persist any data.

## What Changes

- **Add complete Prisma schema** with all MoonForge database models
- **Define relationships** between users, projects, versions, files, and chat messages
- **Add indexes** for frequently queried fields (email, project_id, user_id)
- **Configure datasource provider** to `postgresql` (URL via prisma.config.ts from .env)
- **Create Prisma client singleton** at `apps/api/src/lib/prisma.ts`

## Capabilities

### New Capabilities

- `user-management`: Store and manage user accounts (id, email, name, timestamps)
- `project-management`: Store user projects with metadata (name, description, status)
- `versioning`: Track project versions for diff view and history
- `file-storage`: Store generated project files with source tracking (template vs AI vs modified)
- `chat-history`: Persist conversation history per project with file change tracking

### Modified Capabilities

None - this is the initial database setup.

## Impact

**Affected Code:**
- `apps/api/prisma/schema.prisma` - Add all models (currently empty)
- `apps/api/src/generated/prisma/*` - Prisma client output (auto-generated)
- `apps/api/src/lib/prisma.ts` - Prisma client singleton (new file)
- `apps/api/src/lib/` - New directory to create

**Dependencies:**
- PostgreSQL already running via `docker-compose.dev.yaml` on port 5445
- DATABASE_URL already configured in `.env`
- Prisma dependencies already installed
- Requires running `pnpm prisma migrate dev` after schema changes
- Requires running `pnpm prisma generate` to regenerate client

**API Implications:**
- All future API modules will depend on these models
- Zod schemas will be derived from Prisma types
- Service layer will use Prisma client for database operations
