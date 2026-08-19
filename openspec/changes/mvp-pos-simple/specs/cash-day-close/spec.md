# Cash Day Close Specification

## Purpose
Control the daily cash lifecycle and provide a reliable close summary.

## Requirements
### Requirement: Cash Opening
The system MUST require an authorized user to open a cash session before registering sales and MUST record the opening amount, user and timestamp.

#### Scenario: Single active cash session
- GIVEN an active cash session
- WHEN a user attempts to open another session
- THEN the system MUST deny the second opening.

### Requirement: Daily Close
The system MUST let an authorized user close the active cash session and generate a summary of opening amount, sales totals and closing timestamp.

#### Scenario: Close after sales
- GIVEN an active cash session with completed sales
- WHEN the authorized user confirms closure
- THEN the system SHALL mark the session closed and preserve its summary.

#### Scenario: Closed cash cannot sell
- GIVEN a closed cash session
- WHEN an operator attempts a new sale
- THEN the system MUST require a new cash opening.
