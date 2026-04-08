## ADDED Requirements

### Requirement: File structure creation
The system SHALL generate MoonForge monorepo folder structure.

#### Scenario: Create full structure
- **WHEN** `buildProjectStructure(projectName)` is called
- **THEN** system creates folder structure with apps/, packages/, root files
- **AND** folder structure matches PRD specification

### Requirement: Folder hierarchy generation
The system SHALL create nested folder hierarchy for generated files.

#### Scenario: Create nested path
- **WHEN** adding file at `apps/api/src/modules/users/users.routes.ts`
- **THEN** system creates intermediate directories: `apps/api/src/modules/users/`
- **AND** creates the file if it doesn't exist

### Requirement: Project root configuration
The system SHALL generate root-level configuration files.

#### Scenario: Root package.json
- **WHEN** generating project structure
- **THEN** system generates root `package.json` with Moon workspace configuration
- **AND** includes proper `scripts` (dev, lint, etc.)

#### Scenario: pnpm-workspace.yaml
- **WHEN** generating project structure
- **THEN** system generates `pnpm-workspace.yaml` with package references

#### Scenario: Moon configuration files
- **WHEN** generating project structure
- **THEN** system copies `.moon/` directory with `workspace.yml` and `tasks.yml`

### Requirement: Apps directory structure
The system SHALL generate apps/ directory with api, web, and admin subdirectories.

#### Scenario: Apps structure creation
- **WHEN** building project structure
- **THEN** system creates `apps/api/`, `apps/web/`, `apps/admin/`
- **AND** each app has proper subdirectories (src/, etc.)

### Requirement: Packages directory structure
The system SHALL generate packages/types/ directory for shared types.

#### Scenario: Types package structure
- **WHEN** building project structure
- **THEN** system creates `packages/types/src/` directory
- **AND** creates `packages/types/src/index.ts` placeholder

### Requirement: Path validation
The system SHALL validate file paths to prevent directory traversal attacks.

#### Scenario: Invalid path characters
- **WHEN** path contains `..` or absolute paths
- **THEN** system throws `InvalidPathError`
- **AND** prevents file creation

#### Scenario: Path normalization
- **WHEN** creating files
- **THEN** system normalizes paths (remove duplicate slashes, resolve `.`)
- **AND** ensures consistent path format

### Requirement: File overwrite prevention
The system SHALL prevent accidental overwrite during generation.

#### Scenario: File already exists
- **WHEN** generating file that already exists
- **THEN** system throws `FileExistsError`
- **AND** error includes file path
