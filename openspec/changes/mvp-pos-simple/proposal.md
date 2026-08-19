# Proposal: Focused Point-of-Sale MVP

## Intent

Replace the small business's daily use of its current system with a substantially simpler sales tool. The value is not the number of modules; it is completing a sales day without friction.

## Scope

### In scope

- Authentication and basic role-based user administration.
- Product catalog and inventory.
- Point of sale: find and add products, collect payment, and issue a receipt.
- Cash management: opening, daily close, and printable summary.
- Internal non-fiscal sales receipts and cash-close reports on a thermal POS printer.

### Out of scope

- Reproducing the legacy menu or unused modules.
- Accounting, CRM, payroll, complex purchasing, advanced analytics, and multiple locations.
- Costa Rican electronic invoicing or Hacienda integration, fiscal invoices, returns, and discounts.
- Selecting a printing provider or deployment approach without validating the operating environment.

## Capabilities

### New capabilities

- `user-access`: access and roles for operators and administrators.
- `inventory-catalog`: products and stock available for sale.
- `point-of-sale`: sale registration and payment.
- `cash-day-close`: cash opening, closing, and session summary.
- `thermal-printing`: POS-formatted internal non-fiscal receipts and close reports.

### Modified capabilities

None — no baseline specifications exist.

## Approach

Build a modular monolith with navigation limited to the workflows the business actually uses. Define technology-independent domain rules and contracts first, then implement the selected stack and a printing adapter compatible with the validated hardware.

## Affected areas

| Area | Impact | Description |
|---|---|---|
| `openspec/changes/mvp-pos-simple/specs/` | New | Specifications for the five capabilities. |
| Application | New | Angular frontend and Spring Boot backend implemented in reviewable slices. |
| POS printer | External dependency | Epson TM-T20II and 3nstar cash-drawer behavior require on-site validation. |

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Internal receipt is mistaken for a fiscal invoice | High | Mark the document as non-fiscal; requested legal invoices remain manual. |
| Hardware workflow is incompatible | Medium | Test the physical station and isolate printing behind an adapter. |
| Scope grows to resemble the legacy system | High | Keep unused modules out of scope and validate every increment with the business. |

## Rollback plan

This proposal establishes product scope. If invalidated, archive the `mvp-pos-simple` change without changing production behavior.

## Dependencies

- Business-owner validation of workflows, roles, and operating rules.
- Epson TM-T20II, 3nstar cash drawer, and validation of the installed interface and driver.

## Success criteria

- [ ] An operator can complete opening → sale → close without using unrelated modules.
- [ ] Roles restrict the defined administrative actions.
- [ ] Sales and cash closing produce output suitable for the confirmed POS printer.
- [ ] MVP scope is approved before feature implementation begins.
