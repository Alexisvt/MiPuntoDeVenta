output "ecs_cluster_name" { value = aws_ecs_cluster.this.name }
output "ecs_service_name" { value = aws_ecs_service.backend.name }
output "backend_repository_url" { value = aws_ecr_repository.backend.repository_url }
output "frontend_bucket" { value = aws_s3_bucket.frontend.id }
output "cloudfront_distribution_id" { value = aws_cloudfront_distribution.this.id }
output "application_url" { value = "https://${aws_cloudfront_distribution.this.domain_name}" }
output "database_secret_arn" {
  value     = aws_secretsmanager_secret.database.arn
  sensitive = true
}
