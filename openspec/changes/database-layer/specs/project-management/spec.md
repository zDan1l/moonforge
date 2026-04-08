## ADDED Requirements

### Requirement: Project ownership
The system SHALL associate each project with exactly one user through foreign key relationship.

#### Scenario: User creates project
- **WHEN** user creates a new project
- **THEN** project record is created with user_id referencing the user
- **AND** project cannot exist without a valid user owner

#### Scenario: Cascade delete user
- **WHEN** user is deleted
- **THEN** all associated projects are deleted automatically

### Requirement: Project metadata
The system SHALL store project name, description, and status for each project.

#### Scenario: Project with required fields
- **WHEN** creating a project
- **THEN** name must be provided (VARCHAR)
- **AND** description must be provided (TEXT type for long descriptions)
- **AND** status defaults to 'draft'

#### Scenario: Project status transitions
- **WHEN** project moves through lifecycle
- **THEN** status can be: draft → generated → refined
- **AND** status changes are persisted to database

### Requirement: Project timestamp tracking
The system SHALL track when projects are created and last modified.

#### Scenario: Project creation timestamp
- **WHEN** project is created
- **THEN** created_at is set automatically
- **AND** never changes afterwards

#### Scenario: Project modification timestamp
- **WHEN** project metadata is updated
- **THEN** updated_at reflects last modification time

### Requirement: User project query efficiency
The system SHALL provide indexed access to projects by user_id.

#### Scenario: Query user's projects
- **WHEN** fetching all projects for a specific user
- **THEN** database uses index on user_id column
- **AND** query remains efficient with large number of projects
