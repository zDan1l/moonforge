## ADDED Requirements

### Requirement: Zip file creation from project files
The system SHALL create downloadable .zip file from generated project files.

#### Scenario: Create project zip
- **WHEN** `createProjectZip(files)` function is called
- **THEN** system creates .zip buffer
- **AND** buffer contains all project files with proper folder structure
- **AND** buffer can be written to response for download

### Requirement: Folder structure preservation
The system SHALL maintain folder hierarchy in zip file.

#### Scenario: Nested directories in zip
- **WHEN** creating zip from files with paths like `apps/api/src/lib/prisma.ts`
- **THEN** zip maintains directory structure: `apps/api/src/lib/`
- **AND** files are placed in correct folders

#### Scenario: Root level files
- **WHEN** files have no parent directory (e.g., `package.json`, `pnpm-workspace.yaml`)
- **THEN** these files are placed at zip root level
- **AND** not in any subdirectory

### Requirement: Zip metadata
The system SHALL include metadata in the zip file.

#### Scenario: Add metadata file
- **WHEN** creating project zip
- **THEN** system includes `project.json` with metadata
- **AND** metadata includes: project name, generated timestamp, version info

### Requirement: File content integrity
The system SHALL ensure all file contents are preserved in zip.

#### Scenario: Large files
- **WHEN** files contain large content (big JSON, images, etc.)
- **THEN** content is compressed in zip
- **AND** decompressed content matches original exactly

### Requirement: Zip optimization
The system SHALL optimize zip for reasonable creation time.

#### Scenario: Compression level
- **WHEN** creating zip
- **THEN** system uses standard compression level
- **AND** balances compression ratio vs speed

### Requirement: Download-ready output
The system SHALL produce buffer ready for HTTP response.

#### Scenario: HTTP response
- **WHEN** zip buffer is ready
- **THEN** buffer can be sent directly as response body
- **AND** Content-Type header is `application/zip`
- **AND** Content-Disposition header includes filename

### Requirement: Error handling for zip creation
The system SHALL handle errors during zip creation gracefully.

#### Scenario: Missing template file
- **WHEN** required template file doesn't exist
- **THEN** system throws `TemplateNotFoundError`
- **AND** error includes missing file path

#### Scenario: Invalid file path
- **WHEN** file path contains invalid characters
- **THEN** system throws `InvalidPathError`
