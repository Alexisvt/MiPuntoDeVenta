# Thermal Printing Specification

## Purpose
Produce readable internal, non-fiscal paper outputs for completed sales and daily cash closures.

## Requirements
### Requirement: Sale Receipt
The system MUST make a completed sale available as an internal, non-fiscal thermal receipt containing business identity, sale reference, timestamp, operator, items, totals and payment method. The system MUST NOT label it as a fiscal invoice.

#### Scenario: Print completed sale
- GIVEN a completed sale
- WHEN an operator requests its receipt
- THEN the system SHALL invoke or prepare the receipt for the configured Epson POS printing workflow.

### Requirement: Close Receipt
The system MUST make a closed cash session available as a thermal close receipt containing its opening, aggregated sales totals, closing timestamp and responsible user.

#### Scenario: Printer unavailable
- GIVEN a valid receipt and an unavailable printer
- WHEN printing is requested
- THEN the system MUST preserve the receipt and report that printing failed so it can be retried.
