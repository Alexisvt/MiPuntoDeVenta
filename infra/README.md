# AWS infrastructure contract

Terraform owns the enterprise deployment boundary:

- Next.js static export: `frontend/out/` in a private S3 origin behind CloudFront.
- Spring Boot image: ECR, ECS Fargate and an Application Load Balancer.
- Data: private PostgreSQL RDS with credentials in Secrets Manager.
- Network: ALB in public subnets; ECS and RDS in private subnets.
- Observability: CloudWatch logs and Actuator health probes.

The foundation creates the deployable contract: security groups, private RDS, ALB, ECS task/service, private S3 origin, CloudFront routing, IAM, logs and generated database credentials. Supply an existing VPC with at least two public and two private subnets. Private subnets need NAT access so Fargate can pull images and publish logs.

CloudFront rewrites only frontend extensionless paths to their route-specific `index.html`. `/api/*` routes directly to Spring with caching disabled and no HTML error fallback. `/_next/static/*` uses immutable caching while HTML remains uncached. The frontend ECS runtime is deferred until a separately approved server-rendering requirement justifies its compute, observability and cost.

To roll back the frontend independently, rerun CD from the last known-good Git reference so its `out/` artifact replaces S3, then restore the matching frontend-only rewrite and cache configuration through Terraform. Do not roll back Spring or PostgreSQL for a frontend-only delivery failure.

Copy `terraform.tfvars.example` to a non-committed `terraform.tfvars` and replace the example identifiers. The backend image must be immutable. No credentials belong in variables or Git; Terraform generates the database password and stores it in Secrets Manager.
