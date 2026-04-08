## 1. Dependencies & Setup

- [x] 1.1 Install `@hono/cors` package for CORS middleware
- [x] 1.2 Install `@hono/zod-validator` package for request validation
- [x] 1.3 Create `apps/api/src/middleware/` directory
- [x] 1.4 Create `apps/api/src/modules/` placeholder directory

## 2. Error Handling

- [x] 2.1 Create `middleware/error-handler.ts` with custom error classes (AppError, ValidationError, NotFoundError)
- [x] 2.2 Implement global error handler with Hono's `onError` hook
- [x] 2.3 Add environment-specific error detail logic (stack traces in dev only)
- [x] 2.4 Create `lib/response.ts` with success/error response utility functions

## 3. CORS & Logging

- [x] 3.1 Create `middleware/cors.ts` with environment-based origin whitelist
- [x] 3.2 Create `middleware/logger.ts` with request ID generation and timing
- [x] 3.3 Implement structured JSON logging format
- [x] 3.4 Add environment-based log level configuration

## 4. Hono App Restructure

- [x] 4.1 Update `index.ts` with new middleware pipeline (logger → CORS → error handler)
- [x] 4.2 Create `/health` endpoint with database connectivity check
- [x] 4.3 Add service metadata (name, version, environment) to health check
- [x] 4.4 Add module route registration pattern (placeholder for future modules)

## 5. Validation

- [x] 5.1 Test error response format with different error types
- [x] 5.2 Test CORS preflight requests from allowed origins
- [x] 5.3 Test health check endpoint returns correct status
- [x] 5.4 Test request logging includes all required fields

## Out of Scope (Separate Specs)

- Authentication (deferred to auth module spec)
- Anthropic/Claude SDK client (deferred to AI Integration spec)
- Project CRUD endpoints (deferred to Projects Module spec)
- Chat endpoints (deferred to Chat Module spec)
- File serving/download (deferred to Files Module spec)
