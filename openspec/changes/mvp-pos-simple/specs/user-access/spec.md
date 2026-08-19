# User Access Specification

## Purpose
Control access to the sales system according to each person’s responsibility.

## Requirements
### Requirement: Authenticated Access
The system MUST require authenticated access for operational and administrative functions.

#### Scenario: Valid sign-in
- GIVEN an active registered user
- WHEN the user submits valid credentials
- THEN the system SHALL start that user’s session
- AND show only permitted actions.

#### Scenario: Invalid sign-in
- GIVEN invalid credentials
- WHEN sign-in is attempted
- THEN the system MUST deny access without exposing account details.

### Requirement: Role-Based Permissions
The system MUST assign each user at least one role and MUST restrict actions by role.

#### Scenario: Operator restriction
- GIVEN a user without administrative permission
- WHEN the user attempts to manage users
- THEN the system MUST deny the action.
