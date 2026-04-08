## ADDED Requirements

### Requirement: Health check endpoint
The system SHALL provide a health check endpoint at `/health` for monitoring.

#### Scenario: Successful health check
- **WHEN** GET request is made to `/health`
- **THEN** system returns 200 OK status
- **AND** response includes `success: true`
- **AND** response includes `status: "healthy"`
- **AND** response includes current timestamp

#### Scenario: Health check does not require authentication
- **WHEN** GET request is made to `/health`
- **THEN** endpoint is accessible without JWT token
- **AND** authentication middleware is skipped for this route

### Requirement: Database connectivity check
The system SHALL verify database connection as part of health check.

#### Scenario: Database connected
- **WHEN** health check runs and database is reachable
- **THEN** response includes `checks.database.status: "healthy"`
- **AND** response includes database connection duration

#### Scenario: Database disconnected
- **WHEN** health check runs and database is unreachable
- **THEN** response includes `checks.database.status: "unhealthy"`
- **AND** HTTP status is 503 Service Unavailable
- **AND** response includes error details

### Requirement: Service information
The system SHALL include service metadata in health check response.

#### Scenario: Service info in response
- **WHEN** health check is requested
- **THEN** response includes service name ("moonforge-api")
- **AND** response includes service version (from package.json)
- **AND** response includes environment (development/production)

### Requirement: Health check performance
The system SHALL respond to health check within 100 milliseconds.

#### Scenario: Fast health check
- **WHEN** health check runs
- **THEN** response time is under 100ms
- **AND** response includes `duration` field in milliseconds

#### Scenario: Slow database warning
- **WHEN** database query in health check takes longer than 50ms
- **THEN** response includes degraded status indicator
- **AND** overall service status remains "healthy" unless query fails
