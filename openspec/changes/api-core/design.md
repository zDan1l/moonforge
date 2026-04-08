## Context

**Current State:**
- `apps/api/src/index.ts` contains a basic Hono app with a single "Hello World" route
- No middleware, no error handling, no structure
- Prisma client already exists at `lib/prisma.ts`
- Database schema is complete (from database-layer change)

**Constraints:**
- Hono.js as the web framework (already in dependencies)
- TypeScript for type safety
- Zod for validation (to be used in modules)
- Frontend will run on different port (need CORS)
- MVP scope: focus on infrastructure, defer authentication to later

## Goals / Non-Goals

**Goals:**
- Establish proper Hono app structure with middleware pipeline
- Consistent error response format across all endpoints
- Request logging for debugging
- Health check endpoint for monitoring
- CORS support for frontend-backend communication
- Base folder structure for future modules

**Non-Goals:**
- Authentication (deferred to separate auth module spec)
- Anthropic/Claude SDK client (deferred to AI Integration spec)
- User registration/login endpoints
- Rate limiting (can be added later)
- API documentation/OpenAPI spec (future enhancement)

## Decisions

### 1. Error Response Format

**Decision:** Use consistent JSON response format with `success`, `data`, `error`, and `meta` fields.

**Rationale:**
- Frontend can handle responses uniformly
- Easy to distinguish success vs error
- `meta` field for pagination, timestamps, etc.

**Format:**
```typescript
// Success response
{ success: true, data: {...}, meta: {...} }

// Error response
{ success: false, error: { code, message, details }, meta: {...} }
```

### 2. Middleware Order

**Decision:** Middleware pipeline order: Logger → CORS → Error Handler.

**Rationale:**
1. **Logger first** - captures all incoming requests
2. **CORS** - handles preflight requests early
3. **Error Handler** - catches any errors from route handlers

**Note:** Auth middleware will be added later when auth module is implemented.

### 3. Error Handling Approach

**Decision:** Use Hono's built-in error handling with custom error types.

**Rationale:**
- Hono provides `onError` hook for global error handling
- Custom error classes for different error types (ValidationError, NotFoundError, etc.)
- Clean separation between business logic errors and HTTP errors

**Implementation:**
```typescript
// Custom error classes
class AppError extends Error { statusCode = 500 }
class ValidationError extends AppError { statusCode = 400 }
class NotFoundError extends AppError { statusCode = 404 }

// Global error handler in Hono
app.onError((err, c) => {
  if (err instanceof AppError) {
    return c.json({ success: false, error: {...} }, err.statusCode)
  }
  // Handle unexpected errors
})
```

### 4. CORS Configuration

**Decision:** Use `@hono/cors` middleware with environment-based origin whitelist.

**Rationale:**
- Development: allow localhost ports
- Production: restrict to known frontend domain
- Simple setup without credentials for MVP (auth adds cookies later)

### 5. Module Structure Convention

**Decision:** Establish folder structure for future modules following PRD convention.

**Rationale:**
- PRD defines clear structure: `{module}.routes.ts`, `{module}.schema.ts`, `{module}.service.ts`
- Create base `modules/` directory now
- Each module will be self-contained with routes, validation, and business logic

**Structure:**
```
modules/
  projects/
    ├── projects.routes.ts    # Hono routes with zValidator
    ├── projects.schema.ts    # Zod validation schemas
    └── projects.service.ts   # Business logic with Prisma
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "meta": {
    "timestamp": "2026-04-08T15:11:26.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { /* additional error context */ }
  },
  "meta": {
    "timestamp": "2026-04-08T15:11:26.000Z"
  }
}
```

## File Structure

```
apps/api/src/
├── index.ts                 # Hono app entry, middleware setup
├── middleware/
│   ├── error-handler.ts    # Custom error classes + handler
│   ├── logger.ts           # Request/response logging
│   └── cors.ts             # CORS configuration
├── lib/
│   ├── prisma.ts           # Already exists
│   └── response.ts         # Response utility functions
└── modules/                # Created as placeholder
    ├── projects/           # To be created in separate spec
    ├── chat/               # To be created in separate spec
    └── files/              # To be created in separate spec
```

## Dependencies

| Package | Purpose | Required |
|---------|---------|----------|
| `@hono/zod-validator` | Zod integration with Hono | Yes |
| `@hono/cors` | CORS middleware | Yes |
| `zod` | Validation schemas | Already in Prisma |

**Removed (deferred):**
- `jsonwebtoken` → Will add in auth module
- `@anthropic-ai/sdk` → Will add in AI Integration spec

## Risks / Trade-offs

### Risk: No Authentication in MVP

**Risk:** Endpoints are publicly accessible during MVP.

**Mitigation:**
- Deploy in private network for hackathon demo
- Add simple API key header check if needed (quick hack)
- Proper auth implemented in next phase

### Trade-off: Error Message Detail

**Decision:** Include error details in development, generic messages in production.

**Rationale:** Prevent information leakage while maintaining debuggability.

### Trade-off: Module Structure vs Time

**Decision:** Create `modules/` folder structure but don't implement any modules yet.

**Rationale:** Establishes pattern for future specs without over-engineering this one.

## Migration Plan

1. **Development:**
   - Create `middleware/` directory and files
   - Create `modules/` placeholder directory
   - Update `index.ts` with middleware pipeline
   - Test with health check endpoint

2. **No Breaking Changes:**
   - Existing "Hello World" route can remain temporarily
   - Error handler catches errors gracefully

3. **Rollback:**
   - Keep old `index.ts` in git history
   - Simple `git revert` if issues arise

## Open Questions

None - design is straightforward for infrastructure-only scope.
