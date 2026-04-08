## ADDED Requirements

### Requirement: Project version tracking
The system SHALL maintain sequential version history for each project.

#### Scenario: Create initial version
- **WHEN** project is first generated
- **THEN** version record is created with version_number = 1
- **AND** version is linked to project via project_id

#### Scenario: Increment version number
- **WHEN** project is refined
- **THEN** new version record is created
- **AND** version_number increments from previous max
- **AND** version_number is unique per project

#### Scenario: Optional version label
- **WHEN** creating a version
- **THEN** label can be set to describe the version (e.g., "Initial setup", "Add products")
- **AND** label is optional (nullable)

### Requirement: Version timestamp
The system SHALL record when each version was created.

#### Scenario: Version creation time
- **WHEN** version record is created
- **THEN** created_at is set automatically
- **AND** versions are ordered chronologically

### Requirement: Version cascade deletion
The system SHALL delete all version-associated data when version is deleted.

#### Scenario: Delete version cascade
- **WHEN** version is deleted
- **THEN** all associated files are deleted
- **AND** all associated chat messages are deleted

### Requirement: Unique version constraint
The system SHALL enforce uniqueness of (project_id, version_number) pairs.

#### Scenario: Prevent duplicate version numbers
- **WHEN** attempting to create version with duplicate (project_id, version_number)
- **THEN** database returns unique constraint violation
- **AND** duplicate version is not created

### Requirement: Efficient version queries
The system SHALL provide indexed access to versions by project_id.

#### Scenario: Query project versions
- **WHEN** fetching all versions for a project
- **THEN** database uses index on project_id
- **AND** versions are returned in creation order
