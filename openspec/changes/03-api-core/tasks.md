# Tasks: API Core

## Phase 1: Hono Setup

### Task 1.1: Install Hono Dependencies
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Install Hono framework and required dependencies.

**Acceptance Criteria:**
- [ ] `hono` installed in apps/api
- [ ] `@hono/zod-validator` installed for request validation
- [ ] `@hono/node-server` installed (if using Node.js runtime)
- [ ] `zod` is already installed (from Database Layer)

**Commands:**
```bash
cd apps/api
pnpm add hono @hono/zod-validator
pnpm add -D @hono/node-server  # Only if using Node.js
```

**Files:**
- `apps/api/package.json`

---

### Task 1.2: Create Type Definitions
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Create TypeScript type definitions for the API.

**Acceptance Criteria:**
- [ ] `apps/api/src/types/api.ts` created
- [ ] `Variables` type defined for Hono context
- [ ] `ApiSuccess` and `ApiError` response types defined
- [ ] `PaginationParams` and `PaginatedResponse` types defined

**Files:**
- `apps/api/src/types/api.ts`

---

### Task 1.3: Create Response Helpers
**Duration:** 15 minutes
**Owner:** Backend

**Description:**
Create helper functions for consistent API responses.

**Acceptance Criteria:**
- [ ] `apps/api/src/lib/response.ts` created
- [ ] `success()` function for success responses
- [ ] `errorResponse()` function for error responses
- [ ] Both functions include requestId and timestamp in meta

**Files:**
- `apps/api/src/lib/response.ts`

---

## Phase 2: Middleware

### Task 2.1: Create Request ID Middleware
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Create middleware that adds a unique request ID to each request.

**Acceptance Criteria:**
- [ ] `apps/api/src/middleware/request-id.ts` created
- [ ] Generates UUID for each request
- [ ] Stores requestId in Hono context
- [ ] Adds X-Request-ID header to response

**Files:**
- `apps/api/src/middleware/request-id.ts`

---

### Task 2.2: Create Error Handler Middleware
**Duration:** 30 minutes
**Owner:** Backend

**Description:**
Create centralized error handling middleware.

**Acceptance Criteria:**
- [ ] `apps/api/src/middleware/error-handler.ts` created
- [ ] Handles HTTPException from Hono
- [ ] Handles ZodError from validation
- [ ] Handles Prisma errors
- [ ] Returns consistent error response format
- [ ] Logs unknown errors

**Files:**
- `apps/api/src/middleware/error-handler.ts`

---

### Task 2.3: Create Authentication Middleware
**Duration:** 20 minutes
**Owner:** Backend

**Description:**
Create authentication middleware (placeholder structure).

**Acceptance Criteria:**
- [ ] `apps/api/src/middleware/auth.ts` created
- [ ] Checks for Authorization header
- [ ] Returns 401 if header missing
- [ ] Includes placeholder for JWT validation
- [ ] Exports `getUser()` helper function

**Files:**
- `apps/api/src/middleware/auth.ts`

---

## Phase 3: Main App

### Task 3.1: Create Main Hono App
**Duration:** 20 minutes
**Owner:** Backend

**Description:**
Create the main Hono application with middleware stack and health check.

**Acceptance Criteria:**
- [ ] `apps/api/src/index.ts` created
- [ ] Hono app initialized with proper types
- [ ] Middleware stack configured (requestId, logger, cors, errorHandler)
- [ ] Health check endpoint at /health
- [ ] Health check endpoint at /api/health
- [ ] 404 handler for unmatched routes
- [ ] Server starts on configured port

**Files:**
- `apps/api/src/index.ts`

---

### Task 3.2: Configure CORS
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Configure CORS middleware for cross-origin requests.

**Acceptance Criteria:**
- [ ] CORS middleware added to main app
- [ ] Development: allows all origins
- [ ] Production: restricts to specific origins
- [ ] Credentials enabled for cookies
- [ ] Proper max-age configured

**Files:**
- Update `apps/api/src/index.ts`

---

## Phase 4: Configuration

### Task 4.1: Update Moon Tasks
**Duration:** 10 minutes
**Owner:** Backend

**Description:**
Update Moon configuration for the API app with new tasks.

**Acceptance Criteria:**
- [ ] `apps/api/moon.yml` updated
- [ ] `dev` task runs server with hot reload
- [ ] `build` task compiles TypeScript
- [ ] `start` task runs compiled server

**Files:**
- `apps/api/moon.yml`

---

### Task 4.2: Update TypeScript Config
**Duration:** 5 minutes
**Owner:** Backend

**Description:**
Update TypeScript configuration for the API app.

**Acceptance Criteria:**
- [ ] `apps/api/tsconfig.json` extends root config
- [ ] Proper path aliases configured (if needed)
- [ ] Compilation target set correctly

**Files:**
- `apps/api/tsconfig.json`

---

## Phase 5: Verification

### Task 5.1: Test Server Startup
**Duration:** 10 minutes
**Owner:** QA/Backend

**Description:**
Verify the API server starts correctly.

**Acceptance Criteria:**
- [ ] `moon run :dev` in apps/api starts server
- [ ] Server listens on configured port (default 3000)
- [ ] Console shows startup message
- [ ] No errors on startup

**Commands:**
```bash
cd apps/api
moon run :dev
# or
bun run dev
```

---

### Task 5.2: Test Health Endpoints
**Duration:** 10 minutes
**Owner:** QA

**Description:**
Test health check endpoints return correct responses.

**Acceptance Criteria:**
- [ ] GET /health returns 200
- [ ] GET /api/health returns 200
- [ ] Response includes status, version, timestamp
- [ ] Response includes X-Request-ID header

**Commands:**
```bash
curl http://localhost:3000/health
curl -i http://localhost:3000/api/health  # -i to see headers
```

---

### Task 5.3: Test Error Handling
**Duration:** 15 minutes
**Owner:** QA/Backend

**Description:**
Test error handling with various error scenarios.

**Acceptance Criteria:**
- [ ] 404 response for invalid routes
- [ ] Error response includes success: false
- [ ] Error response includes error code and message
- [ ] Error response includes requestId in meta
- [ ] Unknown errors return 500 with generic message

**Commands:**
```bash
curl http://localhost:3000/nonexistent
curl http://localhost:3000/api/nonexistent
```

---

### Task 5.4: Test CORS
**Duration:** 10 minutes
**Owner:** QA

**Description:**
Verify CORS headers are properly set.

**Acceptance Criteria:**
- [ ] CORS headers present in response
- [ ] OPTIONS request handled correctly
- [ ] Allowed origins configured correctly

**Commands:**
```bash
curl -i -X OPTIONS http://localhost:3000/health \
  -H "Origin: http://localhost:3001"
```

---

## Phase 6: Documentation

### Task 6.1: Create API README
**Duration:** 15 minutes
**Owner:** Backend/Docs

**Description:**
Create documentation for the API core setup.

**Acceptance Criteria:**
- [ ] `apps/api/README.md` created
- [ ] Server startup instructions
- [ ] Middleware documentation
- [ ] Error response format documented
- [ ] Development workflow explained

**Files:**
- `apps/api/README.md`

---

## Summary

**Total Estimated Duration:** 2.5-3 hours

**Task Breakdown:**
- Phase 1 (Hono Setup): 35 minutes
- Phase 2 (Middleware): 60 minutes
- Phase 3 (Main App): 30 minutes
- Phase 4 (Configuration): 15 minutes
- Phase 5 (Verification): 45 minutes
- Phase 6 (Documentation): 15 minutes

**Dependencies:**
- Feature 1: Infrastructure Setup must be complete
- Feature 2: Database Layer must be complete

**Risks:**
- Port 3000 already in use
- CORS misconfiguration blocking frontend
- Hono types not working correctly

**Mitigation:**
- Make API_PORT configurable via .env
- Document CORS configuration clearly
- Use Hono's built-in type inference

**Post-MVP Tasks:**
- Implement full JWT authentication
- Add rate limiting middleware
- Add request body size limits
- Add API versioning (v1, v2)
