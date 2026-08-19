# Point of Sale Specification

## Purpose
Register an auditable sale quickly from the current cash session.

## Requirements
### Requirement: Sale Composition
The system MUST let an authorized operator add active products, adjust permitted quantities and see a running total.

#### Scenario: Complete sale
- GIVEN an open cash session and at least one active product
- WHEN the operator selects products and confirms a supported payment
- THEN the system SHALL record one completed sale and its line items.

#### Scenario: Empty sale
- GIVEN an open cash session
- WHEN the operator attempts to charge with no line items
- THEN the system MUST prevent the charge.

### Requirement: Cash Session Association
The system MUST associate every completed sale with the open cash session and the operator who completed it.

#### Scenario: No open cash session
- GIVEN no open cash session exists
- WHEN an operator attempts to complete a sale
- THEN the system MUST block completion and direct the operator to open cash.
