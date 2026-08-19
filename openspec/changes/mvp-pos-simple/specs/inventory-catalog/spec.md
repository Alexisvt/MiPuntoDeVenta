# Inventory Catalog Specification

## Purpose
Maintain products and their available stock for sales.

## Requirements
### Requirement: Product Management
Authorized users MUST create, edit and deactivate products with a name, sale price and stock tracking status.

#### Scenario: Active product available for sale
- GIVEN an active product with a sale price
- WHEN an operator searches it in the POS
- THEN the system SHALL make it selectable.

#### Scenario: Deactivated product
- GIVEN a deactivated product
- WHEN an operator searches it in the POS
- THEN the system MUST NOT offer it for a new sale.

### Requirement: Stock Visibility
The system MUST display the current available quantity for stock-tracked products and SHALL update it after a completed sale.

#### Scenario: Insufficient stock
- GIVEN a stock-tracked product whose available quantity is lower than requested
- WHEN an operator adds the quantity to a sale
- THEN the system MUST block confirmation and explain the shortage.
