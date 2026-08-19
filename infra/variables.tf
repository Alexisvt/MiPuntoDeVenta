variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "vpc_id" {
  type        = string
  description = "VPC hosting ALB, ECS and RDS."
}

variable "public_subnet_ids" {
  type        = list(string)
  description = "At least two public subnets for the ALB."
}

variable "private_subnet_ids" {
  type        = list(string)
  description = "At least two private subnets with NAT access for ECS and RDS."
}

variable "backend_image" {
  type        = string
  description = "Immutable ECR image URI, including its tag or digest."
}

variable "database_name" {
  type    = string
  default = "mipuntodeventa"
}

variable "database_username" {
  type      = string
  default   = "mipuntodeventa"
  sensitive = true
}

variable "database_instance_class" {
  type    = string
  default = "db.t4g.micro"
}

variable "backend_desired_count" {
  type    = number
  default = 1
}
