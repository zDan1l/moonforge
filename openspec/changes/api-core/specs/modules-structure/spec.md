## ADDED Requirements

### Requirement: Modules directory structure
The system SHALL provide a `modules/` directory for organizing API modules.

#### Scenario: Base modules directory exists
- **WHEN** API Core is implemented
- **THEN** `apps/api/src/modules/` directory exists
- **AND** directory is ready for future module creation

### Requirement: Module file naming convention
The system SHALL follow PRD-defined convention for module files.

#### Scenario: Module file pattern
- **WHEN** a new module is created
- **THEN** module has `{module}.routes.ts` file for Hono routes
- **AND** module has `{module}.schema.ts` file for Zod validation schemas
- **AND** module has `{module}.service.ts` file for business logic

#### Scenario: Module folder structure
- **WHEN** a module named "projects" is created
- **THEN** files are in `modules/projects/` directory
- **AND** files are named `projects.routes.ts`, `projects.schema.ts`, `projects.service.ts`

### Requirement: Module registration pattern
The system SHALL establish pattern for registering module routes to main Hono app.

#### Scenario: Route registration in index.ts
- **WHEN** a module is implemented
- **THEN** module routes are registered to main Hono app in `index.ts`
- **AND** routes use path prefix matching module name (e.g., `/api/projects`)
- **AND** module inherits all middleware (logger, CORS, error handler)

### Requirement: Zod validator usage
The system SHALL use `@hono/zod-validator` for request validation in modules.

#### Scenario: Zod validation in routes
- **WHEN** a module route receives request data
- **THEN** route uses `zValidator` middleware from `@hono/zod-validator`
- **AND** validation schema is defined in module's `{module}.schema.ts`
- **AND** validation errors return 400 with `VALIDATION_ERROR` code

### Requirement: Service layer pattern
The system SHALL use service layer for database operations in modules.

#### Scenario: Service functions
- **WHEN** a module needs database access
- **THEN** database operations are in `{module}.service.ts`
- **AND** service functions use Prisma client from `lib/prisma.ts`
- **AND** route handlers call service functions, not Prisma directly
