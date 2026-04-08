## ADDED Requirements

### Requirement: Mock AI content generation
The system SHALL generate mock AI content for testing generator flow.

#### Scenario: Generate mock Prisma schema
- **WHEN** `generateMockPrismaSchema(description)` is called
- **THEN** system generates basic Prisma schema based on description
- **AND** includes 2-3 models with common fields (id, timestamps, etc.)
- **AND** follows Prisma schema conventions

#### Scenario: Generate mock modules
- **WHEN** `generateMockModules(modules)` is called
- **THEN** system generates skeleton modules for each requested module
- **AND** each module has routes.ts, schema.ts, service.ts
- **AND** routes.ts has basic Hono route structure
- **AND** schema.ts has Zod schema definitions
- **AND** service.ts has Prisma service class stub

#### Scenario: Generate mock shared types
- **WHEN** `generateMockTypes()` is called
- **THEN** system generates `packages/types/src/index.ts`
- **AND** re-exports Prisma types
- **AND** includes utility types (Pagination, etc.)

### Requirement: Mock content realism
The system SHALL generate realistic mock content that matches PRD structure.

#### Scenario: Realistic Prisma schema
- **WHEN** generating mock schema
- **THEN** uses proper Prisma conventions (UUID primary keys, timestamps)
- **AND** includes proper indexes and relations
- **AND** follows MoonForge database schema pattern

#### Scenario: Realistic module structure
- **WHEN** generating mock modules
- **THEN** follows convention: {module}.routes.ts, {module}.schema.ts, {module}.service.ts
- **AND** includes proper imports and exports
- **AND** uses Zod for validation

### Requirement: Placeholder for AI Integration
The system SHALL provide interface that can be replaced with real AI Integration.

#### Scenario: AI generator interface
- **WHEN** AI Integration spec is implemented
- **THEN** `generateMockPrismaSchema()` can be replaced with `generatePrismaSchema()`
- **AND** function signatures remain compatible
- **AND** mock generator serves as reference implementation

### Requirement: Configurable mock content
The system SHALL allow customization of mock content patterns.

#### Scenario: Custom mock patterns
- **WHEN** different mock content is needed
- **THEN** system allows custom mock templates
- **AND** templates can be overridden per project type
- **AND** default mock patterns are provided

### Requirement: Mock AI response simulation
The system SHALL simulate AI response structure.

#### Scenario: Response format compatibility
- **WHEN** mock generator produces content
- **THEN** output format matches expected AI Integration spec
- **AND** can be swapped with real AI calls without changing consumer code
- **AND** response includes generated files with proper paths
