# Mi punto de venta

Punto de venta simple para un negocio pequeño en Costa Rica. El sistema prioriza abrir caja, vender, imprimir un recibo interno y cerrar el día sin módulos innecesarios.

> Los comprobantes del MVP son internos y no fiscales. Las facturas legales se emiten manualmente con el talonario actual.

## Arquitectura

- **Frontend:** Angular 22, desplegado en S3/CloudFront.
- **Backend:** monolito modular Spring Boot 4.1 sobre Java 21, desplegado en ECS Fargate.
- **Datos:** PostgreSQL local mediante Docker Compose y Amazon RDS en AWS.
- **Entrega:** Docker, Terraform y GitHub Actions con tests y gates de seguridad.

## Desarrollo local

Requisitos: Node.js 24 LTS, Java 21 y Docker.

```bash
# Base de datos
docker compose up -d postgres

# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm ci
npm start
```

Backend: `http://localhost:8080/actuator/health`. Frontend: `http://localhost:4200`.

También podés levantar base de datos y backend como contenedores:

```bash
docker compose up --build
```

## Calidad

Cada PR ejecuta lint, tests Maven/JUnit, tests Angular, Playwright + axe, builds reproducibles, validación Terraform, CodeQL, dependency review, Gitleaks y Trivy.

```bash
cd backend && ./mvnw test
cd frontend && npm run lint && npm run test:ci && npm run test:e2e
```

## Despliegue AWS

Terraform define RDS PostgreSQL privado, ECS Fargate, ALB restringido a CloudFront, ECR, S3 privado, IAM, Secrets Manager y CloudWatch. Consultá [`infra/README.md`](infra/README.md) para sus entradas.

El workflow de CD usa GitHub OIDC. El environment `production` necesita el secreto `AWS_DEPLOY_ROLE_ARN` y las variables `AWS_REGION`, `ECR_REPOSITORY`, `ECS_TASK_FAMILY`, `ECS_SERVICE`, `ECS_CLUSTER`, `FRONTEND_BUCKET` y `CLOUDFRONT_DISTRIBUTION_ID`. Si todavía no existe esa configuración, los pushes a `main` no despliegan.

## SDD

La fuente de verdad del MVP está en [`openspec/changes/mvp-pos-simple`](openspec/changes/mvp-pos-simple).
