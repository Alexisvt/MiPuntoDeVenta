# Design: Focused Point-of-Sale MVP

## Technical approach

Deploy a modular monolith as one Spring Boot 4.1 service. A React 19.2 and Next.js 16.3 App Router client consumes the versioned REST API through TanStack Query v5. PostgreSQL runs on Amazon RDS; the backend is packaged for ECS Fargate behind an ALB. The frontend is a static export published through S3 and CloudFront.

## Architecture decisions

| Decision | Choice | Rationale |
|---|---|---|
| Application shape | Modular monolith | One business and an MVP do not justify microservices; module boundaries preserve a future extraction path. |
| Backend | Spring Boot 4.1, Java 25, REST | Current LTS baseline, enterprise ecosystem, mature testing, and strong security, observability, and JPA integration. |
| Frontend | React 19.2 and Next.js 16.3 organized by feature | Static delivery, strict typing and selective server-state synchronization. Impeccable guides every visual workflow. |
| Data | PostgreSQL on RDS | ACID transactions for stock, sales, and cash with managed operations. |
| Infrastructure | ECS Fargate and ALB | Reproducible container deployment without managing hosts. |
| Receipt | Internal non-fiscal document | The MVP does not integrate with Hacienda; legal invoices are issued manually outside the system. |
| Printing | Browser and installed Epson driver adapter | Reuse the installed Epson TM-T20II and 3nstar drawer workflow; isolate direct ESC/POS support for later. |

## Module boundaries

```text
frontend/ Next.js static App Router
   ↓ REST /api/v1
backend/ Spring Boot
├── access       users, roles, authentication
├── inventory    products, stock
├── sales        sale composition and payment
├── cash         opening, active session, daily close
└── printing     receipt documents and print status
   ↓
PostgreSQL / Amazon RDS
```

A sale is committed only when its cash session, actor, lines, payment, and stock update succeed transactionally. A printing failure MUST create a retryable receipt status and MUST NOT reverse the sale.

## Backend structure

| Path | Responsibility |
|---|---|
| `backend/src/main/java/.../shared/` | Domain primitives, errors, and security contracts |
| `backend/src/main/java/.../{module}/domain/` | Entities and business rules |
| `backend/src/main/java/.../{module}/application/` | Use cases and transactions |
| `backend/src/main/java/.../{module}/infrastructure/` | JPA, REST adapters, and external services |
| `backend/src/test/java/` | Unit and integration tests |
| `frontend/features/` | Client features organized by business module |
| `infra/` | ECS, RDS, network, IAM, and deployment definitions |

## Frontend direction

Impeccable governs frontend design. The primary scene is a cashier under bright counter lighting and time pressure: light theme, warm neutrals, high contrast, one primary action per screen, keyboard-first operation, and WCAG 2.2 AA. The POS keeps product search and the current ticket visible simultaneously; it never mirrors the overloaded legacy menu.

End-user-facing interface labels and messages are localized in Spanish for Costa Rica. Source code, comments, tests, and technical documentation remain in English.

## Testing strategy

| Layer | Scope |
|---|---|
| JUnit | Domain rules: permissions, stock, totals, and cash transitions |
| Spring integration | JPA transactions, REST authorization, and receipt status |
| Vitest and React Testing Library | Feature, query and component behavior plus accessibility states |
| Playwright and axe | Opening → sale → receipt → close, keyboard behavior, and WCAG checks |

## Delivery

The foundation chain creates the Next.js static client, Spring service, test runners, module skeleton and AWS contracts. `migrate-frontend-to-nextjs` is a prerequisite for access and inventory; subsequent PRs target the immediately preceding feature branch. The frontend ECS runtime remains deferred until a separately approved runtime-only requirement exists.

## Open questions

- Confirm the physical interface and Windows driver configuration of the Epson and 3nstar station before production printing.
- Define the AWS account, region, domain, secrets strategy, and budget before provisioning production.
