# Feature 3: API Core

## Summary
Implement the core Hono.js API server with middleware infrastructure, including authentication, error handling, CORS, logging, and request validation.

## Problem Statement
Building a production API requires:
- Setting up a web framework with proper routing
- Implementing middleware for authentication, error handling, and CORS
- Creating a consistent API response format
- Logging and monitoring for debugging
- Input validation for security

## Solution
Use Hono.js as the API framework with:
- Built-in middleware (CORS, logger, etc)
- Custom middleware for authentication and error handling
- zValidator for request validation
- Consistent JSON response format
- Structured logging

## Goals
1. **Hono Server** - Main Hono app with proper configuration
2. **Middleware Stack** - Auth, error handling, CORS, logging
3. **Request Validation** - zValidator integration with Zod schemas
4. **Error Handling** - Centralized error handler with proper HTTP status codes
5. **Response Format** - Consistent JSON response structure
6. **Health Check** - /health endpoint for monitoring

## Success Criteria
- [ ] Hono server starts on configured port
- [ ] Health check endpoint returns 200 OK
- [ ] Error handler catches and formats errors properly
- [ ] CORS middleware allows frontend requests
- [ ] Request validation rejects invalid input
- [ ] Authentication middleware protects routes
- [ ] Logging works for all requests

## Out of Scope
- Business logic routes (covered in module-specific features)
- Database operations (Prisma covered in Database Layer)
- Claude API integration (covered in AI Integration feature)

## Dependencies
- Feature 1: Infrastructure Setup (apps/api scaffold exists)
- Feature 2: Database Layer (Prisma client available)

## Timeline
2-3 hours

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Client Request                      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                    Hono App                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Middleware Stack                   │   │
│  │  1. CORS                                        │   │
│  │  2. Logger                                      │   │
│  │  3. Request ID                                  │   │
│  │  4. Authentication (optional)                   │   │
│  │  5. Route Matching                              │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Route Handler                       │   │
│  │  - zValidator (request validation)              │   │
│  │  - Business logic                               │   │
│  │  - Prisma calls                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                          │                              │
│                          ▼                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │           Response / Error Handler               │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2025-01-08T10:00:00Z",
    "requestId": "uuid"
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
    "details": { ... }
  },
  "meta": {
    "timestamp": "2025-01-08T10:00:00Z",
    "requestId": "uuid"
  }
}
```

## Middleware Stack

| Middleware | Purpose | Status |
|------------|---------|--------|
| CORS | Cross-origin requests | Required |
| Logger | Request/response logging | Required |
| Request ID | Unique ID per request | Required |
| Authentication | JWT/session validation | Optional per route |
| Error Handler | Centralized error handling | Global |

## Endpoints

### Health Check
```
GET /health
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2025-01-08T10:00:00Z"
}
```

## File Structure

```
apps/api/src/
├── index.ts                 # Main Hono app entry point
├── lib/
│   ├── prisma.ts           # Prisma client (from Database Layer)
│   └── response.ts         # Response formatters
├── middleware/
│   ├── auth.ts             # Authentication middleware
│   ├── error-handler.ts    # Error handling middleware
│   ├── logger.ts           # Logging middleware
│   └── request-id.ts       # Request ID middleware
├── modules/
│   └── (module routes added in later features)
└── types/
    └── api.ts              # Shared API types
```

## References
- Hono Docs: https://hono.dev
- @hono/zod-validator: https://hono.dev/docs/helpers/zod-validator
