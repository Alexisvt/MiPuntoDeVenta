# MiPuntoDeVenta

A focused point-of-sale system for a small business in Costa Rica. The product prioritizes opening the register, completing sales, printing internal receipts, and closing the business day without exposing unnecessary modules.

> MVP receipts are internal, non-fiscal documents. Legal invoices remain outside the system and are issued manually from the business's existing invoice book.

## Architecture

| Layer | Technology | Runtime |
|---|---|---|
| Frontend | Angular 22 | Amazon S3 and CloudFront |
| Backend | Spring Boot 4.1 modular monolith on Java 21 | Amazon ECS Fargate |
| Data | PostgreSQL | Docker Compose locally and Amazon RDS in AWS |
| Delivery | Docker, Terraform, and GitHub Actions | Automated test and security gates |

## Local development

### Prerequisites

- Node.js 24 LTS
- Java 21
- Docker

### Quick start

```bash
# Database
docker compose up -d postgres

# Backend
cd backend
./mvnw spring-boot:run

# Frontend (run from another terminal)
cd frontend
npm ci
npm start
```

- Backend health: `http://localhost:8080/actuator/health`
- Frontend: `http://localhost:4200`

To run the database and backend as containers:

```bash
docker compose up --build
```

## Quality checks

Every pull request runs linting, Maven/JUnit tests, Angular tests, Playwright with axe, reproducible builds, Terraform validation, CodeQL, dependency review, Gitleaks, and Trivy.

```bash
cd backend && ./mvnw test
cd frontend && npm run lint && npm run test:ci && npm run test:e2e
```

## AWS deployment

Terraform defines private Amazon RDS for PostgreSQL, ECS Fargate, an ALB restricted to CloudFront, ECR, private S3, IAM, Secrets Manager, and CloudWatch. See [`infra/README.md`](infra/README.md) for inputs and deployment details.

The CD workflow uses GitHub OIDC. The `production` environment requires the `AWS_DEPLOY_ROLE_ARN` secret and these variables: `AWS_REGION`, `ECR_REPOSITORY`, `ECS_TASK_FAMILY`, `ECS_SERVICE`, `ECS_CLUSTER`, `FRONTEND_BUCKET`, and `CLOUDFRONT_DISTRIBUTION_ID`. Pushes to `main` do not deploy until this configuration exists.

## Product specifications

The source of truth for the MVP is [`openspec/changes/mvp-pos-simple`](openspec/changes/mvp-pos-simple).
