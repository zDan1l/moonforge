## ADDED Requirements

### Requirement: Consistent error response format
The system SHALL return all errors in a consistent JSON format with `success`, `error`, and `meta` fields.

#### Scenario: Error response structure
- **WHEN** any endpoint returns an error
- **THEN** response includes `success: false`
- **AND** response includes `error` object with `code`, `message`, and optional `details`
- **AND** response includes `meta` object with `timestamp`

#### Scenario: Error response codes
- **WHEN** an error occurs
- **THEN** HTTP status code reflects error type (400, 404, 500, etc.)
- **AND** error.code is machine-readable identifier (e.g., "VALIDATION_ERROR")

### Requirement: Global error handler middleware
The system SHALL provide a global error handler that catches all unhandled errors in the request pipeline.

#### Scenario: Catch unhandled errors
- **WHEN** a route handler throws an unhandled error
- **THEN** global error handler catches the error
- **AND** returns appropriate error response to client
- **AND** logs the error for debugging

#### Scenario: Custom error types
- **WHEN** a custom AppError is thrown
- **THEN** error handler uses the error's status code
- **AND** returns the error's message in the response

### Requirement: Validation error handling
The system SHALL provide ValidationError for invalid input data.

#### Scenario: Validation error response
- **WHEN** request validation fails
- **THEN** system throws ValidationError with status code 400
- **AND** error response includes field-level validation details
- **AND** error.code is "VALIDATION_ERROR"

### Requirement: Not found error handling
The system SHALL provide NotFoundError for missing resources.

#### Scenario: Not found response
- **WHEN** a requested resource does not exist
- **THEN** system throws NotFoundError with status code 404
- **AND** error.message describes what was not found
- **AND** error.code is "NOT_FOUND"

### Requirement: Environment-specific error detail
The system SHALL include detailed error information in development only.

#### Scenario: Development error details
- **WHEN** NODE_ENV is "development"
- **THEN** error responses include stack trace
- **AND** error responses include internal error details

#### Scenario: Production error safety
- **WHEN** NODE_ENV is "production"
- **THEN** error responses exclude stack traces
- **AND** error responses exclude internal implementation details
