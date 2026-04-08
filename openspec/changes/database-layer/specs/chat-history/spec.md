## ADDED Requirements

### Requirement: Message role classification
The system SHALL classify each chat message as either 'user' or 'assistant'.

#### Scenario: User message
- **WHEN** user sends a message in chat
- **THEN** message is stored with role = 'user'
- **AND** content contains user's input

#### Scenario: Assistant message
- **WHEN** AI assistant responds
- **THEN** message is stored with role = 'assistant'
- **AND** content contains AI's response

### Requirement: Message content storage
The system SHALL store complete message content as TEXT.

#### Scenario: Store long messages
- **WHEN** message contains long-form content (descriptions, explanations)
- **THEN** full content is stored in TEXT column
- **AND** content is retrieved exactly as stored

### Requirement: File change tracking
The system SHALL optionally track which files were changed by each message.

#### Scenario: Message with file changes
- **WHEN** assistant response modifies project files
- **THEN** file_changes column contains JSON array of affected file paths
- **AND** enables correlation between messages and file modifications

#### Scenario: Message without file changes
- **WHEN** message is conversational (no file changes)
- **THEN** file_changes is null
- **AND** message still stored for history

### Requirement: Message timestamp
The system SHALL record when each message was created.

#### Scenario: Message creation time
- **WHEN** message is sent
- **THEN** created_at is set automatically
- **AND** messages are ordered chronologically

### Requirement: Message-version association
The system SHALL associate each message with a specific project version.

#### Scenario: Message in version context
- **WHEN** message is sent during project generation/refinement
- **THEN** message is linked to current version_id
- **AND** provides context for state of project at that time

### Requirement: Message cascade deletion
The system SHALL delete messages when project or version is deleted.

#### Scenario: Delete project removes messages
- **WHEN** project is deleted
- **THEN** all messages across all versions are deleted

#### Scenario: Delete version removes messages
- **WHEN** version is deleted
- **THEN** only messages for that version are deleted

### Requirement: Efficient message queries
The system SHALL provide indexed access to messages by project_id and version_id.

#### Scenario: Query project chat history
- **WHEN** fetching all messages for a project
- **THEN** database uses index on project_id

#### Scenario: Query version messages
- **WHEN** fetching messages for specific version
- **THEN** database uses index on version_id
- **AND** provides context for state at version creation time
