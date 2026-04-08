# Design: API Core

## Hono App Configuration

**File:** `apps/api/src/index.ts`

```typescript
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from './middleware/request-id';
import { errorHandler } from './middleware/error-handler';
import { authMiddleware } from './middleware/auth';

// Create Hono app
const app = new Hono<{ Variables: Variables }>();

// Global middleware
app.use('*', requestId());              // Add unique request ID
app.use('*', logger());                 // Request/response logging
app.use('*', cors());                   // Enable CORS

// Error handler (must be after routes, but we define it here)
app.onError(errorHandler);

// Health check (no auth required)
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (c) => {
  return c.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API routes (added in later features)
// app.route('/api/projects', projectsRouter);
// app.route('/api/generate', generatorRouter);
// app.route('/api/chat', chatRouter);

// 404 handler
app.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  }, 404);
});

// Start server
const port = parseInt(process.env.API_PORT || '3000');

Bun.serve({
  fetch: app.fetch,
  port,
});

console.log(`🚀 API server running on http://localhost:${port}`);
```

## Middleware Design

### 1. Request ID Middleware

**File:** `apps/api/src/middleware/request-id.ts`

```typescript
import { MiddlewareHandler } from 'hono';

export const requestId = (): MiddlewareHandler => {
  return async (c, next) => {
    const id = crypto.randomUUID();
    c.set('requestId', id);
    c.header('X-Request-ID', id);
    await next();
  };
};
```

**Design Rationale:**
- Unique ID for each request
- Added to response headers for tracing
- Stored in context for logging

### 2. Logger Middleware

Using Hono's built-in logger:

```typescript
import { logger } from 'hono/logger';

app.use('*', logger());
```

**Custom logger option:**
```typescript
app.use('*', logger((message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
}));
```

### 3. CORS Middleware

**File:** `apps/api/src/middleware/cors.ts`

```typescript
import { cors } from 'hono/cors';

// Development - allow all origins
app.use('*', cors());

// Production - restrict origins
app.use('*', cors({
  origin: ['http://localhost:3001', 'https://moonforge.dev'],
  credentials: true,
  maxAge: 86400,
}));
```

### 4. Authentication Middleware

**File:** `apps/api/src/middleware/auth.ts`

```typescript
import { MiddlewareHandler } from 'hono';

export const authMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    // Get authorization header
    const authHeader = c.req.header('Authorization');

    if (!authHeader) {
      return c.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Missing authorization header',
        },
      }, 401);
    }

    // TODO: Validate JWT or session
    // For now, skip actual validation (implement in Auth feature)
    // const token = authHeader.replace('Bearer ', '');
    // const user = await validateToken(token);

    await next();
  };
};

// Optional: Helper to get user from context
export const getUser = (c: Context) => {
  return c.get('user');
};
```

**Note:** Full authentication implementation is deferred to a dedicated Auth feature. This is a placeholder structure.

### 5. Error Handler

**File:** `apps/api/src/middleware/error-handler.ts`

```typescript
import type { ErrorHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { ZodError } from 'zod';

export const errorHandler: ErrorHandler = (err, c) => {
  const requestId = c.get('requestId') || 'unknown';

  // HTTP exceptions (thrown by Hono)
  if (err instanceof HTTPException) {
    return c.json({
      success: false,
      error: {
        code: err.name,
        message: err.message,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    }, err.status);
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return c.json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: err.errors,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }

  // Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as any;
    return c.json({
      success: false,
      error: {
        code: 'DATABASE_ERROR',
        message: getPrismaErrorMessage(prismaErr.code),
        details: process.env.NODE_ENV === 'development' ? prismaErr.meta : undefined,
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    }, 400);
  }

  // Unknown errors
  console.error('Unhandled error:', err);

  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    },
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
    },
  }, 500);
};

function getPrismaErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    P2002: 'A record with this value already exists',
    P2025: 'Record not found',
    P2003: 'Foreign key constraint failed',
  };
  return messages[code] || 'Database operation failed';
}
```

**Error Codes:**
- `UNAUTHORIZED` - 401
- `FORBIDDEN` - 403
- `NOT_FOUND` - 404
- `VALIDATION_ERROR` - 400
- `DATABASE_ERROR` - 400/404
- `INTERNAL_SERVER_ERROR` - 500

### 6. Request Validation with zValidator

**Example route with validation:**

```typescript
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

// Define schema
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

// Use in route
app.post('/api/projects',
  zValidator('json', createProjectSchema),
  async (c) => {
    const data = c.req.valid('json');
    // data is typed as { name: string, description?: string }
    // ... business logic
  }
);
```

## Response Helpers

**File:** `apps/api/src/lib/response.ts`

```typescript
import type { Context } from 'hono';

export const success = <T>(c: Context, data: T, status = 200) => {
  return c.json({
    success: true,
    data,
    meta: {
      requestId: c.get('requestId'),
      timestamp: new Date().toISOString(),
    },
  }, status);
};

export const errorResponse = (
  c: Context,
  code: string,
  message: string,
  status = 400,
  details?: unknown
) => {
  return c.json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    meta: {
      requestId: c.get('requestId'),
      timestamp: new Date().toISOString(),
    },
  }, status);
};
```

## Type Definitions

**File:** `apps/api/src/types/api.ts`

```typescript
import type { Context } from 'hono';

// Hono context variables
export type Variables = {
  requestId: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
};

// API response types
export interface ApiSuccess<T> {
  success: true;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
  };
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    requestId: string;
    timestamp: string;
  };
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Environment Variables

**Add to `apps/api/.env`:**
```env
DATABASE_URL="postgresql://moonforge:moonforge@localhost:5432/moonforge"
API_PORT=3000
NODE_ENV="development"
```

## Package Dependencies

**Add to `apps/api/package.json`:**
```json
{
  "dependencies": {
    "hono": "^4.0.0",
    "@hono/zod-validator": "^0.2.0",
    "zod": "^3.22.0"
  }
}
```

## Server Runtime

**Option 1: Bun (Recommended for Hono)**
```typescript
// apps/api/src/index.ts
Bun.serve({
  fetch: app.fetch,
  port: parseInt(process.env.API_PORT || '3000'),
});
```

**Option 2: Node.js**
```typescript
// apps/api/src/index.ts
import { serve } from '@hono/node-server';

serve({
  fetch: app.fetch,
  port: parseInt(process.env.API_PORT || '3000'),
});
```

## Development Workflow

```bash
# Start dev server with hot reload
cd apps/api
bun run dev  # or node --watch src/index.ts

# Test health endpoint
curl http://localhost:3000/health
curl http://localhost:3000/api/health

# Test with validation
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -d '{"name":"","description":""}'
# Should return 400 with validation errors
```

## Route Organization Pattern

For future module features, follow this pattern:

```
apps/api/src/modules/{module}/
├── {module}.routes.ts    # Hono router with endpoints
├── {module}.schema.ts    # Zod validation schemas
├── {module}.service.ts   # Business logic with Prisma
└── {module}.types.ts     # Module-specific types
```

**Example:**
```typescript
// apps/api/src/modules/projects/projects.routes.ts
import { Hono } from 'hono';
import * as projectService from './projects.service';
import { createProjectSchema, updateProjectSchema } from './projects.schema';

const router = new Hono();

router.get('/', async (c) => {
  const projects = await projectService.list();
  return c.json({ success: true, data: projects });
});

router.post('/', zValidator('json', createProjectSchema), async (c) => {
  const data = c.req.valid('json');
  const project = await projectService.create(data);
  return c.json({ success: true, data: project }, 201);
});

export default router;
```
