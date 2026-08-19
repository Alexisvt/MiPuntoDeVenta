# Tasks: Focused Point-of-Sale MVP

## Review Workload Forecast

| Field | Value |
|---|---|
| Estimated changed lines | 2,400–3,600 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | PR boundary |
|---|---|---|
| 1 | Angular/Spring foundation and delivery contracts | feature/tracker → `feat/mvp-foundation` |
| 2 | Access and inventory | foundation → `feat/mvp-access-inventory` |
| 3 | Sales and cash | access/inventory → `feat/mvp-sales-cash` |
| 4 | Printing, accessibility and AWS release | sales/cash → `feat/mvp-printing-release` |

## Phase 1: Enterprise Foundation

- [x] 1.1 Confirm Costa Rica, internal non-fiscal receipt, payments, exclusions and Epson TM-T20II/3nstar.
- [x] 1.2 Bootstrap Angular 22 in `frontend/` with strict TypeScript, tests, lint and accessibility baseline.
- [x] 1.3 Bootstrap Spring Boot 4.1 in `backend/` with Maven, Java 25, actuator, validation and JUnit.
- [x] 1.4 Create modular package boundaries for access, inventory, sales, cash and printing.
- [x] 1.5 Add PostgreSQL/Flyway configuration, a local profile and first schema migration.
- [x] 1.6 Define AWS contracts in `infra/`: VPC inputs, RDS, ECS task, ALB, S3/CloudFront, IAM and secrets placeholders.
- [x] 1.7 RED/GREEN: prove a backend health endpoint and an Angular health view.
- [x] 1.8 Document local setup, architecture and non-fiscal receipt boundary in `README.md`.

## Phase 2: Access and Inventory

- [ ] 2.1 RED/GREEN: implement users, roles, authentication and authorization.
- [ ] 2.2 RED/GREEN: implement active products, stock tracking and insufficient-stock rejection.
- [ ] 2.3 Build accessible Angular user/product flows with empty, error and keyboard states.

## Phase 3: Sales and Cash

- [ ] 3.1 RED/GREEN: implement single active cash session and close transitions.
- [ ] 3.2 RED/GREEN: implement a completed sale with the four allowed payment methods.
- [ ] 3.3 Make stock decrement and sale completion transactional.
- [ ] 3.4 Build the two-zone POS and linear opening/close flows with Impeccable.

## Phase 4: Printing and Release

- [ ] 4.1 Define internal-receipt and printer contracts; retain failed print retries.
- [ ] 4.2 Integrate browser/driver printing for the Epson and verify drawer behavior on site.
- [ ] 4.3 Add Playwright/axe journeys and AWS deployment pipeline.
- [ ] 4.4 Pilot with the business and record operational feedback.
