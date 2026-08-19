# AWS infrastructure contract

Terraform owns the enterprise deployment boundary:

- Angular artifacts: private S3 origin behind CloudFront.
- Spring Boot image: ECR, ECS Fargate and an Application Load Balancer.
- Data: private PostgreSQL RDS with credentials in Secrets Manager.
- Network: ALB in public subnets; ECS and RDS in private subnets.
- Observability: CloudWatch logs and Actuator health probes.

The foundation creates the deployable contract: security groups, private RDS, ALB, ECS task/service, private S3 origin, CloudFront routing, IAM, logs and generated database credentials. Supply an existing VPC with at least two public and two private subnets. Private subnets need NAT access so Fargate can pull images and publish logs.

Copy `terraform.tfvars.example` to a non-committed `terraform.tfvars` and replace the example identifiers. The backend image must be immutable. No credentials belong in variables or Git; Terraform generates the database password and stores it in Secrets Manager.
