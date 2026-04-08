## ADDED Requirements

### Requirement: Anthropic SDK client setup
The system SHALL provide configured Anthropic client instance for API calls.

#### Scenario: Client initialization
- **WHEN** `createClaudeClient()` is called
- **THEN** system initializes Anthropic client with API key from environment
- **AND** client is properly configured with timeout and retries

#### Scenario: Missing API key
- **WHEN** `ANTHROPIC_API_KEY` is not configured
- **THEN** system throws `ClaudeClientError`
- **AND** error includes guidance for setting up API key

#### Scenario: Client configuration options
- **WHEN** creating Claude client
- **THEN** system sets appropriate configuration options:
  - `timeout`: 60 seconds
  - `maxRetries`: 3
  - `baseURL`: configurable via environment variable

### Requirement: Client singleton pattern
The system SHALL provide singleton Claude client instance.

#### Scenario: Single instance reuse
- **WHEN** `createClaudeClient()` is called multiple times
- **THEN** system returns same client instance (cached)
- **AND** connection is reused across requests

#### Scenario: Environment-based configuration
- **WHEN** client is used in different environments
- **THEN** system respects environment variables
- **AND** applies different settings for development vs production

### Requirement: Client reconfiguration
The system SHALL not cache client permanently across hot reload in development.

#### Scenario: Hot reload friendly
- **WHEN** code is reloaded in development
- **THEN** system can reinitialize client
- **AND** old connection state is properly cleaned up
