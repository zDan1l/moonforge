## ADDED Requirements

### Requirement: User account storage
The system SHALL store user accounts with unique email identifiers and optional display names.

#### Scenario: Create new user
- **WHEN** a new user registers
- **THEN** system creates a user record with unique UUID
- **AND** email is stored as unique identifier
- **AND** created_at timestamp is set automatically

#### Scenario: User with optional name
- **WHEN** user provides only email (no name)
- **THEN** system creates user with name field as null
- **AND** user can later update their name

### Requirement: User timestamp tracking
The system SHALL automatically track creation and update timestamps for all user records.

#### Scenario: Automatic created_at
- **WHEN** user record is created
- **THEN** created_at is set to current timestamp automatically
- **AND** created_at is never modified afterwards

#### Scenario: Automatic updated_at
- **WHEN** user record is modified
- **THEN** updated_at is updated to current timestamp automatically

### Requirement: Unique email constraint
The system SHALL enforce email uniqueness across all users.

#### Scenario: Duplicate email rejected
- **WHEN** attempting to create user with existing email
- **THEN** database returns unique constraint violation
- **AND** no duplicate record is created
