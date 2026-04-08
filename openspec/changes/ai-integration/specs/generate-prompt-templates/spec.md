## ADDED Requirements

### Requirement: Generate phase prompt templates
The system SHALL provide prompt templates untuk generate phase (Fase 1).

#### Scenario: Generate phase prompt
- **WHEN** `getGeneratePrompt()` is called
- **THEN** system returns structured prompt for Claude
- **AND** prompt includes:
  - Context: MoonForge template structure
  - Task: Generate monorepo from description
  - Output format: JSON with file paths and content
  - Constraints: Moon structure must be maintained

#### Scenario: Prisma schema generation prompt
- **WHEN** `getPrismaSchemaPrompt(description)` is called
- **THEN** system returns specific prompt for schema generation
- **AND** prompt includes:
  - Task: Generate Prisma schema based on user description
  - Output format: Prisma schema syntax with models, enums, relations
  - Constraints: Must follow MoonForge database schema patterns

#### Scenario: Module generation prompt
- **WHEN** `getModulePrompt(moduleName, description)` is called
-**THEN** system returns specific prompt for module generation
- **AND** prompt includes:
  - Task: Generate module (routes, schema, service) for {module}
  - Output format: TypeScript code with Hono routes, Zod schemas, Prisma services
  - Constraints: Follow module structure convention

#### Scenario: Shared types generation prompt
- **WHEN** `getSharedTypesPrompt()` is called
-**THEN** system returns prompt for types extraction from Prisma schema
- **AND** prompt includes:
  - Task: Extract types from Prisma models
  - Output format: TypeScript type definitions and re-exports

### Requirement: System prompt context
The system SHALL include MoonForge context in all prompts.

#### Scenario: Context inclusion
- **WHEN** generating prompts
- **THEN** system includes MoonForge architecture overview
- **AND** system includes relevant file structure information
- **AND** system includes MoonForge database schema patterns

### Requirement: Response parsing
The system SHALL provide utilities to parse Claude API responses.

#### Scenario: Parse Prisma schema
- **WHEN** `parsePrismaSchemaResponse()` is called
- **THEN** system parses JSON code blocks from Claude response
- **AND** extracts model definitions, enums, and relations
- **AND** returns structured Prisma schema

#### Scenario: Parse module files
- **WHEN** `parseModuleFilesResponse()` is called
- **THEN** system parses TypeScript code blocks from Claude response
-**AND** extracts routes, schemas, and services
- **AND** returns array of generated files with proper paths

### Requirement: Prompt versioning
The system SHALL maintain versioned prompt templates.

#### Scenario: Prompt update
- **WHEN** Claude SDK updates their API
- **THEN** prompts can be updated separately from code
- **AND** old prompts remain accessible via version parameter
