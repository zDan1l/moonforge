## ADDED Requirements

### Requirement: Template and AI content merger
The system SHALL merge template base files with AI-generated content.

#### Scenario: AI content overrides template
- **WHEN** AI generates file with same path as template
- **THEN** AI content replaces template content
- **AND** file source is marked as `ai_generated`

#### Scenario: Template without AI override
- **WHEN** no AI content exists for a template file
- **THEN** template file is used as-is
- **AND** file source is marked as `template`

### Requirement: Merge result structure
The system SHALL produce array of files ready for zip creation.

#### Scenario: Complete merge output
- **WHEN** `mergeTemplateWithAI()` is called with template and AI files
- **THEN** returns array of `GeneratedFile` objects
- **AND** each object has `{ path, content, source }` properties
- **AND** paths are relative to project root

### Requirement: Content type handling
The system SHALL handle different content types appropriately.

#### Scenario: Binary files from template
- **WHEN** template includes binary files (images, fonts, etc.)
- **THEN** binary content is preserved byte-for-byte
- **AND** marked with `source: 'template'`

#### Scenario: Text files with AI override
- **WHEN** AI generates text file (routes, schemas, etc.)
- **THEN** AI content replaces template content
- **AND** marked with `source: 'ai_generated'`

### Requirement: Merge conflict resolution
The system SHALL resolve conflicts by priority.

#### Scenario: AI takes precedence
- **WHEN** both template and AI have the same file path
- **THEN** AI content always wins
- **AND** template content is discarded (still exists in template storage)

### Requirement: Unique file tracking
The system SHALL track which files come from template vs AI.

#### Scenario: Source attribution
- **WHEN** iterating through merged files
- **THEN** each file carries `source` attribute
- **AND** `source` indicates: 'template' or 'ai_generated'
- **AND** this is used for UI labeling ([T] vs [AI])
