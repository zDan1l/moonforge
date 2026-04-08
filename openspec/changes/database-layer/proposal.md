# Feature 2: Database Layer

## Summary
Implement the complete database layer using Prisma ORM with PostgreSQL, including schema definition, migrations, seed script, and type generation for the MoonForge application.

## Problem Statement
Building a database layer from scratch requires:
- Designing a comprehensive schema with proper relationships
- Writing raw SQL migrations that are error-prone
- Setting up type-safe database access
- Creating seed data for development
- Managing schema changes over time

## Solution
Use Prisma ORM with PostgreSQL for:
- Declarative schema definition with automatic migrations
- Type-safe database access with generated TypeScript types
- Seed scripts for development data
- Migration management for schema evolution

## Goals
1. **Prisma Schema** - Complete schema with 5 models: users, projects, project_versions, project_files, chat_messages
2. **Type Safety** - Auto-generated TypeScript types from schema
3. **Migrations** - Initial migration and migration management workflow
4. **Seed Script** - Development seed data for testing
5. **Client Setup** - Prisma client singleton for database access

## Success Criteria
- [ ] Prisma schema defined with all 5 models and relationships
- [ ] `prisma migrate dev` creates all tables successfully
- [ ] `prisma generate` creates TypeScript types
- [ ] `prisma db seed` populates database with test data
- [ ] Database connection works from API app
- [ ] Foreign keys and constraints are properly defined

## Out of Scope
- API routes (covered in API Core feature)
- API services that use Prisma (covered in individual module features)
- Advanced Prisma features (preview features, raw SQL queries)

## Dependencies
- Feature 1: Infrastructure Setup (PostgreSQL running, apps/api scaffold)

## Timeline
2-3 hours

---

## Database Schema

### Entities

```
┌─────────────┐       ┌──────────────────┐       ┌─────────────────────┐
│    User     │───1:N─│     Project      │───1:N─│  ProjectVersion     │
│             │       │                  │       │                     │
│ - id        │       │ - id             │       │ - id                │
│ - email     │       │ - userId         │       │ - projectId         │
│ - name      │       │ - name           │       │ - versionNumber     │
│             │       │ - description    │       │ - label             │
└─────────────┘       │ - status         │       └─────────────────────┘
                      └──────────────────┘                   │
                              │                             │
                              │                             │
                              │                   ┌─────────┴─────────┐
                              │                   │                   │
                      ┌───────┴────────┐  ┌────────▼──────┐  ┌───────▼──────┐
                      │ ProjectFile   │  │ ChatMessage   │  │ (more)       │
                      │               │  │               │  │              │
                      │ - id          │  │ - id          │  │              │
                      │ - projectId   │  │ - projectId   │  │              │
                      │ - versionId   │  │ - versionId   │  │              │
                      │ - path        │  │ - role        │  │              │
                      │ - content     │  │ - content     │  │              │
                      │ - fileSource  │  │ - fileChanges │  │              │
                      └───────────────┘  └───────────────┘  └──────────────┘
```

### Models Detail

**User**
- Authentication and user profile
- One user has many projects
- One user has many chat messages

**Project**
- Main entity for generated projects
- Belongs to a user
- Has many versions
- Has many files
- Has many chat messages
- Status: DRAFT | GENERATED | REFINED

**ProjectVersion**
- Version history for projects
- Belongs to a project
- Has many files
- Has many chat messages
- Unique constraint: (projectId, versionNumber)

**ProjectFile**
- File content for each version
- Belongs to a project and version
- Tracks file source: TEMPLATE | AI_GENERATED | MODIFIED
- Unique constraint: (versionId, path)

**ChatMessage**
- Chat history for refinement
- Belongs to a project and version
- Role: USER | ASSISTANT
- Stores file changes metadata

## API Endpoints (for Database Layer only)

These are internal API helpers, not HTTP endpoints:

```typescript
// apps/api/src/lib/prisma.ts
export const prisma: PrismaClient
```

## Prisma Commands

```bash
# Development workflow
cd apps/api
pnpm prisma migrate dev --name init    # Create & apply migration
pnpm prisma generate                   # Generate types
pnpm prisma db seed                    # Seed database
pnpm prisma studio                     # Open Prisma Studio

# Production workflow
pnpm prisma migrate deploy             # Apply migrations
pnpm prisma generate                   # Generate types
```

## References
- Prisma Docs: https://www.prisma.io/docs
- PostgreSQL 15: https://www.postgresql.org/docs/15/
