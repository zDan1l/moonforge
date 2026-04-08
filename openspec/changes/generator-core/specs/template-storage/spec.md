## ADDED Requirements

### Requirement: Template file storage
The system SHALL store template files in `packages/generator/src/templates/` directory.

#### Scenario: Template directory exists
- **WHEN** Generator Core package is initialized
- **THEN** `packages/generator/src/templates/` directory contains template files
- **AND** directory structure matches MoonForge monorepo structure

### Requirement: Template file loading
The system SHALL provide functions to load template files from filesystem.

#### Scenario: Load all template files
- **WHEN** `loadTemplateFiles()` function is called
- **THEN** system reads all files from templates directory
- **AND** returns array of objects with `{ path, content, source: 'template' }`
- **AND** paths are relative to project root

#### Scenario: Load specific template component
- **WHEN** `loadTemplateComponent('backend')` is called
- **THEN** system returns only backend template files
- **AND** paths are relative to `apps/api/`

### Requirement: Template path mapping
The system SHALL map template storage paths to output paths.

#### Scenario: Backend template mapping
- **WHEN** loading backend template files
- **THEN** output paths start with `apps/api/`
- **AND** preserves internal structure (e.g., `src/generated/prisma/*` → `apps/api/src/generated/prisma/*`)

#### Scenario: Frontend template mapping
- **WHEN** loading frontend template files
- **THEN** output paths start with `apps/web/`
- **AND** preserves internal structure

### Requirement: Root template files
The system SHALL include root-level template files (package.json, pnpm-workspace.yaml, etc).

#### Scenario: Root template loading
- **WHEN** loading root template
- **THEN** system includes files like: `package.json`, `pnpm-workspace.yaml`, `tsconfig.json`, `.moon/`, etc.
- **AND** files are placed at project root (not in apps/ or packages/)

### Requirement: Template validation
The system SHALL validate template files exist before loading.

#### Scenario: Missing template component
- **WHEN** requested template component doesn't exist
- **THEN** system throws `TemplateNotFoundError`
- **AND** error includes missing component name

#### Scenario: Invalid template path
- **WHEN** template path doesn't exist in filesystem
- **THEN** system throws `TemplatePathError`
