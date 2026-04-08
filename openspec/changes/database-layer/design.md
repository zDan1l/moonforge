# Design: Database Layer

## Schema Design

### Complete Prisma Schema

**File:** `apps/api/prisma/schema.prisma`

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
  @@index([email])
}

// ========== Projects ==========
model Project {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  name        String
  description String
  status      ProjectStatus @default(DRAFT)

  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt

  versions      ProjectVersion[]
  files         ProjectFile[]
  chatMessages  ChatMessage[]

  @@map("projects")
  @@index([userId])
  @@index([status])
}

enum ProjectStatus {
  DRAFT
  GENERATED
  REFINED
}

// ========== Project Versions ==========
model ProjectVersion {
  id            String   @id @default(cuid())
  projectId     String
  project       Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)

  versionNumber Int
  label         String?
  createdAt     DateTime @default(now())

  files        ProjectFile[]
  chatMessages ChatMessage[]

  @@unique([projectId, versionNumber])
  @@map("project_versions")
  @@index([projectId])
}

// ========== Project Files ==========
model ProjectFile {
  id         String       @id @default(cuid())
  projectId  String
  project    Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)

  versionId  String
  version    ProjectVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)

  path       String       // relative path e.g., "apps/api/src/index.ts"
  content    String       @db.Text
  fileSource FileSource   @default(AI_GENERATED)

  updatedAt  DateTime     @updatedAt

  @@unique([versionId, path])
  @@map("project_files")
  @@index([versionId])
  @@index([projectId])
}

enum FileSource {
  TEMPLATE
  AI_GENERATED
  MODIFIED
}

// ========== Chat Messages ==========
model ChatMessage {
  id          String       @id @default(cuid())
  projectId   String
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)

  versionId   String
  version     ProjectVersion @relation(fields: [versionId], references: [id], onDelete: Cascade)

  role        MessageRole
  content     String       @db.Text
  fileChanges Json?        // { "modifiedPaths": ["path1", "path2"] }

  createdAt   DateTime     @default(now())

  @@map("chat_messages")
  @@index([projectId])
  @@index([versionId])
}

enum MessageRole {
  USER
  ASSISTANT
}
```

## Design Decisions

### 1. CUID vs UUID

**Decision:** Use CUID (Collision-resistant Unique Identifier)

**Why:**
- Faster generation than UUID v4
- URL-safe (no special characters to encode)
- Sorted by generation time (roughly)
- Better for indexing
- Default in Prisma

### 2. Cascade Deletion

**Decision:** Use `onDelete: Cascade` for all foreign keys

**Why:**
- When a user is deleted, all their projects should be deleted
- When a project is deleted, all versions/files/messages should be deleted
- Simplifies cleanup logic
- No orphaned records

**Trade-off:** Destructive - consider soft deletes for production

### 3. Text vs Varchar for Content

**Decision:** Use `@db.Text` for file content and message content

**Why:**
- File content can be very large (entire source files)
- PostgreSQL Text has no practical size limit (1GB)
- Varchar would require arbitrary size limits

### 4. JSON for File Changes

**Decision:** Store file changes as JSON in ChatMessage

**Why:**
- Flexible structure for different change types
- Easy to query with PostgreSQL JSON operators
- No need for separate table
- Schema: `{ "modifiedPaths": ["path1", "path2"], "addedPaths": [], "deletedPaths": [] }`

### 5. Indexes

**Decision:** Add indexes on foreign keys and frequently queried fields

**Indexes:**
- `users.email` - For login/lookup
- `projects.userId` - For user's projects list
- `projects.status` - For filtering by status
- `project_versions.projectId` - For version history
- `project_files.versionId` - For file listing
- `project_files.projectId` - For project file search
- `chat_messages.projectId` - For chat history
- `chat_messages.versionId` - For version-specific messages

### 6. Unique Constraints

**Decision:**
- `project_versions(projectId, versionNumber)` - Prevent duplicate versions
- `project_files(versionId, path)` - One file per path per version

### 7. Table Names

**Decision:** Use `@@map` to define explicit table names

**Why:**
- Consistent naming (plural, snake_case)
- Avoid Prisma's default naming (camelCase)
- Matches PostgreSQL conventions

## Prisma Client Setup

**File:** `apps/api/src/lib/prisma.ts`

```typescript
import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development
// to prevent exhausting database connections due to hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**Design Rationale:**
- Singleton pattern to prevent connection exhaustion
- Development logging for debugging
- Global caching for hot-reload in development

## Seed Script

**File:** `apps/api/prisma/seed.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { cuid } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: 'test@moonforge.dev' },
    update: {},
    create: {
      email: 'test@moonforge.dev',
      name: 'Test User',
    },
  });

  console.log('✅ Created user:', user.email);

  // Create test project
  const project = await prisma.project.create({
    data: {
      userId: user.id,
      name: 'My First Project',
      description: 'A test project for MoonForge',
      status: 'DRAFT',
      versions: {
        create: {
          versionNumber: 1,
          label: 'Initial Version',
        },
      },
    },
  });

  console.log('✅ Created project:', project.name);

  // Create test files
  const version = project.versions[0];
  await prisma.projectFile.createMany({
    data: [
      {
        projectId: project.id,
        versionId: version.id,
        path: 'README.md',
        content: '# My First Project\n\nGenerated by MoonForge',
        fileSource: 'AI_GENERATED',
      },
      {
        projectId: project.id,
        versionId: version.id,
        path: '.gitignore',
        content: 'node_modules\ndist\n.env',
        fileSource: 'TEMPLATE',
      },
    ],
  });

  console.log('✅ Created test files');

  // Create test chat messages
  await prisma.chatMessage.createMany({
    data: [
      {
        projectId: project.id,
        versionId: version.id,
        role: 'USER',
        content: 'Create a simple CRUD API for users',
      },
      {
        projectId: project.id,
        versionId: version.id,
        role: 'ASSISTANT',
        content: 'I\'ve created the users module with full CRUD operations...',
        fileChanges: {
          modifiedPaths: ['apps/api/src/modules/users/users.routes.ts'],
        },
      },
    ],
  });

  console.log('✅ Created chat messages');
  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## Migration Strategy

### Initial Migration

```bash
cd apps/api
pnpm prisma migrate dev --name init
```

This will:
1. Create `prisma/migrations/{timestamp}_init/migration.sql`
2. Apply the migration to the database
3. Run `prisma generate` automatically

### Migration File Structure

```
apps/api/prisma/
├── schema.prisma           # Schema definition
├── seed.ts                 # Seed script
├── migrations/
│   └── 20250108000000_init/
│       └── migration.sql   # Auto-generated from schema
└── (future migrations...)
```

### Adding Migrations Later

```bash
# 1. Modify schema.prisma
# 2. Create migration
pnpm prisma migrate dev --name add_user_roles

# 3. This creates:
#    - New migration folder
#    - SQL file
#    - Applies to database
```

## Environment Configuration

**Add to `apps/api/.env`:**
```env
DATABASE_URL="postgresql://moonforge:moonforge@localhost:5432/moonforge"
```

**Add to `apps/api/package.json`:**
```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Type Generation

After each migration, Prisma generates TypeScript types:

```typescript
// Auto-generated types
import type { User, Project, ProjectVersion, ProjectFile, ChatMessage, ProjectStatus } from '@prisma/client';

// Usage
const user: User = await prisma.user.findUnique({ where: { id } });
const projects: Project[] = await prisma.project.findMany({ where: { userId } });
```

## Connection Pooling

For production, consider using connection pooling:

```typescript
// With connection pooling (PgBouncer, etc)
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
```

## Error Handling

```typescript
// Common errors to handle
import { Prisma } from '@prisma/client';

try {
  const user = await prisma.user.create({ data: { email: 'test@test.com' } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      // Unique constraint violation
      console.log('Email already exists');
    }
  }
}
```

**Common Prisma Error Codes:**
- `P2002` - Unique constraint violation
- `P2025` - Record not found
- `P2003` - Foreign key constraint violation
