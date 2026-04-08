## Why

The current API (`apps/api/src/index.ts`) is a basic Hono "Hello World" with no structure, middleware, or error handling. All future modules (Projects, Chat, Files, Generator) need a solid foundation with proper error handling, CORS, and request/response structure.

**Note:** Authentication is deferred to a separate spec. MVP focus is on core infrastructure.

## Capabilities

### New Capabilities

- `error-handling`: Centralized error handling with consistent error response format
- `request-logging`: Request/response logging for debugging and monitoring
- `health-check`: Health check endpoint for service monitoring
- `cors-setup`: CORS configuration for frontend-backend communication
- `modules-structure`: Base folder structure for future modules (projects, chat, files)

### Modified Capabilities

None - this is the foundational API setup.

## Impact

**Affected Code:**
- `apps/api/src/index.ts` - Restructure with middleware and proper app setup
- `apps/api/src/middleware/` - New directory for error-handler.ts, logger.ts, cors.ts
- `apps/api/src/modules/` - New directory for future modules (projects, chat, etc.)
- `apps/api/src/lib/` - Add response utilities
- `apps/api/package.json` - May need new dependencies (@hono/cors, @hono/zod-validator)

**New Structure:**
```
apps/api/src/
├── index.ts              # Hono app entry with middleware setup
├── middleware/
│   ├── error-handler.ts  # Global error handler
│   ├── logger.ts         # Request logging
│   └── cors.ts           # CORS configuration
├── lib/
│   ├── prisma.ts         # Already exists
│   └── response.ts       # Consistent response utilities
└── modules/              # Placeholder for future modules
    ├── projects/         # To be created in separate spec
    ├── chat/             # To be created in separate spec
    └── files/            # To be created in separate spec
```

**API Implications:**
- All future endpoints will inherit error handling and logging
- Consistent response format: `{ success, data, error, meta }`
- Modules follow convention: `{module}.routes.ts`, `{module}.schema.ts`, `{module}.service.ts`

**Out of Scope (separate specs):**
- Authentication (deferred to auth module)
- Anthropic/Claude SDK client (deferred to AI Integration spec)
