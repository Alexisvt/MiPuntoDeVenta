# Design: MVP de punto de venta simple

## Technical Approach
Un monolito modular desplegable como un solo servicio Spring Boot 4.1. Angular 22 consume una API REST versionada. PostgreSQL reside en Amazon RDS; el backend se empaqueta como contenedor para ECS Fargate detrás de un ALB. El frontend se publica como sitio estático en S3/CloudFront.

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Forma | Monolito modular | Un negocio y un MVP no justifican microservicios; los módulos preservan límites para extraerlos después si hiciera falta. |
| Backend | Spring Boot 4.1, Java, REST | Ecosistema enterprise, pruebas maduras y excelente integración con seguridad, observabilidad y JPA. |
| Frontend | Angular 22 por features | UI empresarial consistente, tipado y formularios robustos. Impeccable se aplicará al diseñar cada flujo visual. |
| Datos | PostgreSQL en RDS | Transacciones ACID para stock, venta y caja; operación administrada. |
| Infraestructura | ECS Fargate + ALB | Contenedor sin administrar hosts; health checks y despliegues reproducibles. |
| Recibo | Documento interno no fiscal | No integra Hacienda; la factura legal se emite fuera del sistema, en talonario. |
| Impresión | Adaptador del navegador/driver Epson | El MVP reutiliza el flujo instalado para Epson TM-T20II y gaveta 3nstar; ESC/POS directo queda aislado para después. |

## Module Boundaries

    frontend/ Angular
       ↓ REST /api/v1
    backend/ Spring Boot
    ├── access       users, roles, authentication
    ├── inventory    products, stock
    ├── sales        sale composition and payment
    ├── cash         opening, active session, daily close
    └── printing     receipt documents and print status
       ↓
    PostgreSQL / Amazon RDS

A sale is committed only when its cash session, actor, lines, payment and stock update succeed transactionally. A printing failure MUST create a retryable receipt status and MUST NOT reverse the sale.

## Backend Structure

| Path | Responsibility |
|---|---|
| `backend/src/main/java/.../shared/` | domain primitives, errors, security contracts |
| `backend/src/main/java/.../{module}/domain/` | entities and business rules |
| `backend/src/main/java/.../{module}/application/` | use cases and transactions |
| `backend/src/main/java/.../{module}/infrastructure/` | JPA, REST adapters and external services |
| `backend/src/test/java/` | unit and integration tests |
| `frontend/src/app/features/` | Angular features by business module |
| `infra/` | ECS, RDS, network, IAM and deployment definitions |

## Frontend Direction
Impeccable governs frontend design. The primary scene is a cashier under bright counter lighting and time pressure: light theme, warm neutrals, high contrast, one primary action per screen, keyboard-first operation and WCAG 2.2 AA. The POS keeps catalog/search and current ticket visible simultaneously; it never mirrors the overloaded legacy menu.

## Testing Strategy

| Layer | Scope |
|---|---|
| JUnit | domain rules: permissions, stock, totals and cash transitions |
| Spring integration | JPA transactions, REST authorization and receipt status |
| Angular | feature/component behavior and accessibility states |
| Playwright + axe | opening → sale → receipt → close, keyboard and WCAG checks |

## Delivery
PR #1 creates the Angular/Spring foundation, test runners, module skeleton and AWS infrastructure contracts. Later PRs target the immediately preceding feature branch.

## Open Questions
- Confirm the physical interface and Windows/driver setup of the Epson/3nstar station before production printing.
- Define AWS account, region, domain, secrets strategy and budget before provisioned deployment.
