# Cloud Infrastructure Deployment Guide

Comprehensive guide for deploying and managing cloud infrastructure for scalable, reliable, and cost-effective application deployment.

## Overview

This guide covers cloud infrastructure design, implementation, and operations for modern web applications. It emphasizes Infrastructure as Code (IaC), automated deployments, and cloud-native best practices.

## Cloud Platform Selection

### Platform Comparison

#### AWS (Amazon Web Services)
- **Strengths**: Largest ecosystem, extensive services, mature tooling
- **Best For**: Enterprise applications, complex architectures, global scale
- **Key Services**: EC2, S3, Lambda, RDS, ECS, EKS, CloudFormation, CloudWatch

#### Azure (Microsoft Azure)
- **Strengths**: Strong enterprise integration, Microsoft ecosystem, hybrid cloud
- **Best For**: Microsoft-centric organizations, hybrid deployments
- **Key Services**: Virtual Machines, Blob Storage, Functions, Azure Kubernetes Service (AKS), Resource Manager

#### Google Cloud Platform (GCP)
- **Strengths**: Strong data analytics, Kubernetes-native, innovative services
- **Best For**: Data-intensive applications, Kubernetes-first deployments
- **Key Services**: Compute Engine, Cloud Storage, Cloud Functions, GKE, Cloud Build

### Selection Criteria

1. **Application Requirements**: Match platform capabilities to application needs
2. **Team Expertise**: Consider existing team knowledge and training requirements
3. **Cost Structure**: Evaluate pricing models and total cost of ownership
4. **Geographic Presence**: Ensure platform has data centers in required regions
5. **Compliance Needs**: Verify platform meets regulatory requirements
6. **Ecosystem Fit**: Consider integration with existing tools and services

## Infrastructure as Code (IaC)

### IaC Tools Comparison

#### Terraform (Recommended)
- **Pros**: Multi-cloud support, declarative syntax, strong community
- **Cons**: Learning curve, state management complexity
- **Best For**: Multi-cloud deployments, complex infrastructure

#### CloudFormation (AWS)
- **Pros**: AWS-native, integrates with AWS services, no additional cost
- **Cons**: AWS-only, verbose JSON/YAML syntax
- **Best For**: AWS-only deployments, deep AWS integration

#### Pulumi
- **Pros**: Use familiar programming languages, strong typing
- **Cons**: Newer tool, smaller community, additional cost
- **Best For**: Teams preferring programming languages over DSL

#### AWS CDK (AWS)
- **Pros**: Use TypeScript/Python, familiar to developers
- **Cons**: AWS-only, compiles to CloudFormation
- **Best For**: AWS deployments with developer-friendly IaC

### Terraform Best Practices

#### Project Structure
```
infrastructure/
├── terraform/
│   ├── environments/
│   │   ├── dev/
│   │   │   ├── main.tf
│   │   │   ├── variables.tf
│   │   │   └── terraform.tfvars
│   │   ├── staging/
│   │   └── production/
│   ├── modules/
│   │   ├── vpc/
│   │   ├── ecs/
│   │   ├── rds/
│   │   └── s3/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── scripts/
    ├── plan.sh
    └── apply.sh
```

#### State Management
```hcl
# Backend configuration (S3 + DynamoDB for state locking)
terraform {
  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "app/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

#### Module Usage
```hcl
# Reusable VPC module
module "vpc" {
  source = "./modules/vpc"
  
  name                 = var.app_name
  environment          = var.environment
  cidr                 = "10.0.0.0/16"
  availability_zones   = ["us-east-1a", "us-east-1b"]
  enable_nat_gateway   = true
  enable_vpn_gateway   = false
  
  tags = {
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}
```

#### Resource Tagging
```hcl
locals {
  common_tags = {
    Environment = var.environment
    Application = var.app_name
    ManagedBy   = "Terraform"
    Team        = "Platform"
    CostCenter  = "Engineering"
  }
}

resource "aws_instance" "app_server" {
  # ... instance configuration ...
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-app-server-${var.environment}"
    Role = "Application"
  })
}
```

## Cloud Architecture Patterns

### Multi-Tier Architecture

#### Architecture Components
```
┌─────────────────────────────────────────────────┐
│              Internet/Users                      │
└──────────────────┬──────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │   CloudFront/CDN   │
         └─────────┬──────────┘
                   │
         ┌─────────▼──────────┐
         │ Application Load   │
         │   Balancer (ALB)   │
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌───▼───┐    ┌────▼────┐    ┌───▼───┐
│ ECS   │    │  ECS    │    │  ECS  │
│Task 1 │    │ Task 2  │    │Task 3 │
└───┬───┘    └────┬────┘    └───┬───┘
    │             │             │
    └─────────────┼─────────────┘
                  │
         ┌────────▼────────┐
         │   RDS Database  │
         │  (Multi-AZ)     │
         └─────────────────┘
```

#### Implementation Example
```hcl
# VPC with public and private subnets
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  
  name = "${var.app_name}-vpc"
  cidr = "10.0.0.0/16"
  
  azs             = ["us-east-1a", "us-east-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]
  
  enable_nat_gateway = true
  enable_vpn_gateway = false
  
  tags = local.common_tags
}

# Application Load Balancer
resource "aws_lb" "app" {
  name               = "${var.app_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = module.vpc.public_subnets
  
  enable_deletion_protection = var.environment == "production"
  
  tags = local.common_tags
}

# ECS Cluster
resource "aws_ecs_cluster" "app" {
  name = "${var.app_name}-cluster"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
  
  tags = local.common_tags
}

# ECS Service with Auto Scaling
resource "aws_ecs_service" "app" {
  name            = "${var.app_name}-service"
  cluster         = aws_ecs_cluster.app.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"
  
  network_configuration {
    subnets          = module.vpc.private_subnets
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }
  
  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 80
  }
  
  depends_on = [aws_lb_listener.app]
}
```

### Serverless Architecture

#### Architecture Components
```
┌──────────────────────────────────────┐
│      API Gateway                     │
└────────────┬─────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼───┐      ┌──────▼──────┐
│Lambda │      │   Lambda    │
│Function│     │  Function   │
└───┬───┘      └──────┬──────┘
    │                 │
    │          ┌──────▼──────┐
    │          │   DynamoDB  │
    │          └─────────────┘
    │
┌───▼────────┐
│   S3       │
│  (Assets)  │
└────────────┘
```

#### Implementation Example
```hcl
# API Gateway
resource "aws_apigatewayv2_api" "app" {
  name          = "${var.app_name}-api"
  protocol_type = "HTTP"
  
  cors_configuration {
    allow_origins = ["https://${var.domain_name}"]
    allow_methods = ["GET", "POST", "PUT", "DELETE"]
    allow_headers = ["content-type", "authorization"]
  }
  
  tags = local.common_tags
}

# Lambda Function
resource "aws_lambda_function" "api_handler" {
  filename         = "api-handler.zip"
  function_name    = "${var.app_name}-api-handler"
  role            = aws_iam_role.lambda.arn
  handler         = "index.handler"
  source_code_hash = filebase64sha256("api-handler.zip")
  runtime         = "nodejs18.x"
  
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.app.name
      ENVIRONMENT    = var.environment
    }
  }
  
  tags = local.common_tags
}

# DynamoDB Table
resource "aws_dynamodb_table" "app" {
  name           = "${var.app_name}-data"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"
  
  attribute {
    name = "id"
    type = "S"
  }
  
  point_in_time_recovery {
    enabled = var.environment == "production"
  }
  
  tags = local.common_tags
}
```

## Container Orchestration

### ECS (Elastic Container Service)

#### ECS Task Definition
```json
{
  "family": "app-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/app:latest",
      "portMappings": [
        {
          "containerPort": 80,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:80/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      }
    }
  ]
}
```

#### Auto Scaling Configuration
```hcl
# ECS Service Auto Scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 10
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.app.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy" {
  name               = "${var.app_name}-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```

### Kubernetes (EKS)

#### Cluster Configuration
```hcl
# EKS Cluster
module "eks" {
  source = "terraform-aws-modules/eks/aws"
  
  cluster_name    = "${var.app_name}-cluster"
  cluster_version = "1.27"
  
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets
  
  eks_managed_node_groups = {
    main = {
      min_size     = 2
      max_size     = 10
      desired_size = 3
      
      instance_types = ["t3.medium"]
      capacity_type  = "ON_DEMAND"
      
      labels = {
        Environment = var.environment
        Application = var.app_name
      }
    }
  }
  
  tags = local.common_tags
}
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  labels:
    app: app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: app
  template:
    metadata:
      labels:
        app: app
    spec:
      containers:
      - name: app
        image: 123456789012.dkr.ecr.us-east-1.amazonaws.com/app:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "250m"
            memory: "512Mi"
          limits:
            cpu: "500m"
            memory: "1Gi"
        livenessProbe:
          httpGet:
            path: /health
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: app-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: app-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Deployment Strategies

### Blue-Green Deployment

#### Strategy Overview
- **Two identical environments**: Blue (current) and Green (new)
- **Instant switch**: Traffic shifts from Blue to Green immediately
- **Zero downtime**: Seamless transition for users
- **Quick rollback**: Switch back to Blue if issues occur

#### Implementation (ECS)
```hcl
# Blue-Green Deployment with CodeDeploy
resource "aws_codedeploy_app" "app" {
  name             = "${var.app_name}-deployment"
  compute_platform = "ECS"
}

resource "aws_codedeploy_deployment_group" "app" {
  app_name              = aws_codedeploy_app.app.name
  deployment_group_name = "${var.app_name}-deployment-group"
  service_role_arn      = aws_iam_role.codedeploy.arn
  
  ecs_service {
    cluster_name = aws_ecs_cluster.app.name
    service_name = aws_ecs_service.app.name
  }
  
  blue_green_deployment_config {
    deployment_ready_option {
      action_on_timeout = "CONTINUE_DEPLOYMENT"
    }
    
    green_fleet_provisioning_option {
      action = "COPY_AUTO_SCALING_GROUP"
    }
    
    terminate_blue_instances_on_deployment_success {
      action                        = "TERMINATE"
      termination_wait_time_in_minutes = 5
    }
  }
  
  auto_rollback_configuration {
    enabled = true
    events  = ["DEPLOYMENT_FAILURE"]
  }
}
```

### Canary Deployment

#### Strategy Overview
- **Gradual rollout**: New version receives increasing traffic percentage
- **Risk mitigation**: Issues affect only small percentage of users
- **Automatic rollback**: Revert if error rates exceed thresholds
- **Traffic shifting**: Gradually increase new version traffic (10% → 50% → 100%)

#### Implementation (Lambda)
```hcl
# Canary Deployment with Lambda Aliases
resource "aws_lambda_alias" "live" {
  name             = "live"
  description      = "Live alias"
  function_name    = aws_lambda_function.app.function_name
  function_version = "$LATEST"
}

resource "aws_lambda_alias" "canary" {
  name             = "canary"
  description      = "Canary alias"
  function_name    = aws_lambda_function.app.function_name
  function_version = aws_lambda_function.app.version
}
```

### Rolling Deployment

#### Strategy Overview
- **Incremental updates**: Replace instances one by one
- **Zero downtime**: Always maintain minimum healthy instances
- **Health checks**: Only replace healthy instances
- **Gradual rollout**: Update percentage controlled (e.g., 25% at a time)

#### Implementation (Kubernetes)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  replicas: 3
  # ... rest of deployment spec ...
```

## Monitoring and Observability

### CloudWatch Metrics

#### Key Metrics to Monitor
- **Application Metrics**: Request count, error rate, latency, throughput
- **Infrastructure Metrics**: CPU utilization, memory usage, network I/O
- **Database Metrics**: Connection count, query performance, storage usage
- **Cost Metrics**: Resource usage, cost per service, budget alerts

#### CloudWatch Alarm Configuration
```hcl
# CPU Utilization Alarm
resource "aws_cloudwatch_metric_alarm" "high_cpu" {
  alarm_name          = "${var.app_name}-high-cpu"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "2"
  metric_name         = "CPUUtilization"
  namespace           = "AWS/ECS"
  period              = "300"
  statistic           = "Average"
  threshold           = "80"
  alarm_description   = "This metric monitors ecs cpu utilization"
  
  dimensions = {
    ClusterName = aws_ecs_cluster.app.name
    ServiceName = aws_ecs_service.app.name
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}

# Error Rate Alarm
resource "aws_cloudwatch_metric_alarm" "high_error_rate" {
  alarm_name          = "${var.app_name}-high-error-rate"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = "1"
  metric_name         = "HTTPCode_Target_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = "60"
  statistic           = "Sum"
  threshold           = "10"
  alarm_description   = "This metric monitors error rate"
  
  dimensions = {
    LoadBalancer = aws_lb.app.arn_suffix
  }
  
  alarm_actions = [aws_sns_topic.alerts.arn]
}
```

### Logging Strategy

#### Centralized Logging
```hcl
# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.app_name}"
  retention_in_days = 30
  
  tags = local.common_tags
}

# Log Retention Policy
resource "aws_cloudwatch_log_resource_policy" "app" {
  policy_name = "${var.app_name}-log-policy"
  
  policy_document = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = "logs.amazonaws.com"
        }
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "${aws_cloudwatch_log_group.app.arn}:*"
      }
    ]
  })
}
```

## Security Best Practices

### Network Security

#### Security Groups
```hcl
# Application Load Balancer Security Group
resource "aws_security_group" "alb" {
  name        = "${var.app_name}-alb-sg"
  description = "Security group for Application Load Balancer"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-alb-sg"
  })
}

# ECS Task Security Group
resource "aws_security_group" "ecs" {
  name        = "${var.app_name}-ecs-sg"
  description = "Security group for ECS tasks"
  vpc_id      = module.vpc.vpc_id
  
  ingress {
    description     = "Allow traffic from ALB"
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  tags = merge(local.common_tags, {
    Name = "${var.app_name}-ecs-sg"
  })
}
```

### IAM Roles and Policies

#### Least Privilege Principle
```hcl
# ECS Task Execution Role
resource "aws_iam_role" "ecs_execution" {
  name = "${var.app_name}-ecs-execution-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.common_tags
}

# ECS Task Execution Role Policy
resource "aws_iam_role_policy" "ecs_execution" {
  name = "${var.app_name}-ecs-execution-policy"
  role = aws_iam_role.ecs_execution.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

# ECS Task Role (for application code)
resource "aws_iam_role" "ecs_task" {
  name = "${var.app_name}-ecs-task-role"
  
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
  
  tags = local.common_tags
}

# ECS Task Role Policy (minimal permissions)
resource "aws_iam_role_policy" "ecs_task" {
  name = "${var.app_name}-ecs-task-policy"
  role = aws_iam_role.ecs_task.id
  
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "${aws_s3_bucket.app.arn}/*"
      }
    ]
  })
}
```

### Encryption

#### Data Encryption at Rest
```hcl
# S3 Bucket with Encryption
resource "aws_s3_bucket" "app" {
  bucket = "${var.app_name}-storage-${var.environment}"
  
  tags = local.common_tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "app" {
  bucket = aws_s3_bucket.app.id
  
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
    bucket_key_enabled = true
  }
}

# RDS with Encryption
resource "aws_db_instance" "app" {
  identifier     = "${var.app_name}-db"
  engine         = "postgres"
  engine_version = "14.5"
  instance_class = "db.t3.medium"
  
  allocated_storage     = 100
  max_allocated_storage = 1000
  storage_encrypted     = true
  
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password
  
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.app.name
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  maintenance_window     = "mon:04:00-mon:05:00"
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  
  tags = local.common_tags
}
```

#### Data Encryption in Transit
```hcl
# SSL/TLS Certificate (ACM)
resource "aws_acm_certificate" "app" {
  domain_name       = var.domain_name
  validation_method = "DNS"
  
  subject_alternative_names = [
    "*.${var.domain_name}"
  ]
  
  lifecycle {
    create_before_destroy = true
  }
  
  tags = local.common_tags
}

# HTTPS Listener
resource "aws_lb_listener" "app_https" {
  load_balancer_arn = aws_lb.app.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = aws_acm_certificate.app.arn
  
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}

# HTTP to HTTPS Redirect
resource "aws_lb_listener" "app_http" {
  load_balancer_arn = aws_lb.app.arn
  port              = "80"
  protocol          = "HTTP"
  
  default_action {
    type = "redirect"
    
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}
```

## Cost Optimization

### Resource Right-Sizing

#### Instance Selection
- **CPU-Optimized**: For compute-intensive workloads (C5, C6i)
- **Memory-Optimized**: For memory-intensive workloads (R5, R6i)
- **General Purpose**: For balanced workloads (T3, T4g, M5, M6i)
- **Storage-Optimized**: For high I/O workloads (I3, I4i)
- **GPU Instances**: For ML/AI workloads (P3, P4, G4)

#### Cost Optimization Strategies
```hcl
# Spot Instances for Non-Critical Workloads
resource "aws_ecs_capacity_provider" "spot" {
  name = "${var.app_name}-spot"
  
  auto_scaling_group_provider {
    auto_scaling_group_arn = aws_autoscaling_group.spot.arn
    
    managed_scaling {
      maximum_scaling_step_size = 10
      minimum_scaling_step_size = 1
      status                    = "ENABLED"
      target_capacity           = 70
    }
    
    managed_termination_protection = "DISABLED"
  }
}

# Reserved Instances (via Savings Plans)
# Recommended: Use AWS Cost Explorer to analyze usage and purchase Savings Plans

# Auto Scaling for Cost Optimization
resource "aws_appautoscaling_policy" "cost_optimized" {
  name               = "${var.app_name}-cost-optimized"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    customized_metric_specification {
      metric_name = "ApproximateNumberOfMessagesVisible"
      namespace   = "AWS/SQS"
      statistic   = "Average"
      
      dimensions = {
        QueueName = aws_sqs_queue.app.name
      }
    }
    target_value = 100.0
  }
}
```

### Cost Monitoring

#### Budget Alerts
```hcl
# Cost Budget
resource "aws_budgets_budget" "app" {
  name              = "${var.app_name}-budget"
  budget_type       = "COST"
  limit_amount      = "1000"
  limit_unit        = "USD"
  time_period_start = "2026-01-01_00:00"
  time_unit         = "MONTHLY"
  
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 80
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }
  
  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = 100
    threshold_type            = "PERCENTAGE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alert_email]
  }
}
```

## Disaster Recovery

### Backup Strategy

#### Database Backups
```hcl
# RDS Automated Backups
resource "aws_db_instance" "app" {
  # ... other configuration ...
  
  backup_retention_period = 7
  backup_window          = "03:00-04:00"
  
  copy_tags_to_snapshot = true
  
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}

# Manual Snapshot
resource "aws_db_snapshot" "app" {
  db_instance_identifier = aws_db_instance.app.id
  db_snapshot_identifier = "${var.app_name}-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  tags = merge(local.common_tags, {
    Name        = "${var.app_name}-snapshot"
    BackupType  = "Manual"
  })
}
```

### Multi-Region Deployment

#### Cross-Region Replication
```hcl
# S3 Cross-Region Replication
resource "aws_s3_bucket_replication_configuration" "app" {
  role   = aws_iam_role.replication.arn
  bucket = aws_s3_bucket.app.id
  
  rule {
    id     = "replicate-to-backup-region"
    status = "Enabled"
    
    destination {
      bucket        = aws_s3_bucket.backup.arn
      storage_class = "STANDARD_IA"
    }
  }
}
```

## Infrastructure Testing

### Terraform Testing

#### Validation Script
```bash
#!/bin/bash
# validate-infrastructure.sh

set -e

echo "Validating Terraform configuration..."
terraform fmt -check
terraform validate

echo "Running Terraform plan..."
terraform plan -out=tfplan

echo "Infrastructure validation complete"
```

#### Automated Testing
```yaml
# GitHub Actions Workflow
name: Infrastructure Validation

on:
  pull_request:
    paths:
      - 'infrastructure/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v2
        with:
          terraform_version: 1.5.0
      
      - name: Terraform Init
        working-directory: ./infrastructure/terraform
        run: terraform init
      
      - name: Terraform Validate
        working-directory: ./infrastructure/terraform
        run: terraform validate
      
      - name: Terraform Format Check
        working-directory: ./infrastructure/terraform
        run: terraform fmt -check
      
      - name: Terraform Plan
        working-directory: ./infrastructure/terraform
        run: terraform plan -no-color
```

## Checklist

### Pre-Deployment Checklist
- [ ] Cloud platform selected and configured
- [ ] Infrastructure as Code implemented (Terraform/CloudFormation)
- [ ] Network architecture designed (VPC, subnets, security groups)
- [ ] Load balancing configured
- [ ] Auto-scaling configured
- [ ] Monitoring and alerting set up
- [ ] Logging configured (CloudWatch Logs)
- [ ] Security groups and IAM roles configured
- [ ] SSL/TLS certificates provisioned
- [ ] Database configured with backups
- [ ] Secrets management implemented
- [ ] Cost monitoring and budgets configured
- [ ] Disaster recovery plan documented
- [ ] Infrastructure testing automated

### Deployment Checklist
- [ ] All infrastructure validated
- [ ] Terraform state backend configured
- [ ] Environment-specific variables set
- [ ] CI/CD pipeline configured
- [ ] Deployment strategy selected (blue-green, canary, rolling)
- [ ] Rollback procedure documented
- [ ] Health checks configured
- [ ] Monitoring dashboards created
- [ ] Alert thresholds configured
- [ ] Documentation updated

### Post-Deployment Checklist
- [ ] Infrastructure deployed successfully
- [ ] All health checks passing
- [ ] Monitoring showing expected metrics
- [ ] Cost alerts configured
- [ ] Backup verification completed
- [ ] Disaster recovery tested
- [ ] Documentation reviewed and updated
- [ ] Team trained on infrastructure management

## Related Documentation

- [Configuration Files Review](../reference/CONFIGURATION_FILES_REVIEW.md) - Infrastructure configuration patterns
- [Build and Deployment Review](../reference/BUILD_DEPLOYMENT_REVIEW.md) - Deployment strategies and automation
- [DevOps Expert Rules](../../.cursor/rules/experts/devops_expert.mdc) - DevOps and CI/CD guidance

---

## Review/Contribution

**Expert**: James Wilson  
**Expertise**: Cloud Infrastructure (Cloud Platform Architecture, Deployment, Operations)  
**Date**: 2026-01-05  
**Changes**: Created comprehensive cloud infrastructure deployment guide covering cloud platform selection (AWS, Azure, GCP comparison and selection criteria), Infrastructure as Code best practices (Terraform project structure, state management, module usage, resource tagging), cloud architecture patterns (multi-tier architecture with VPC, ALB, ECS implementation examples, serverless architecture with API Gateway, Lambda, DynamoDB), container orchestration (ECS task definitions, auto-scaling configuration, Kubernetes EKS cluster setup, HPA configuration), deployment strategies (blue-green deployment with CodeDeploy, canary deployment with Lambda aliases, rolling deployment with Kubernetes), monitoring and observability (CloudWatch metrics, alarms, centralized logging), security best practices (network security groups, IAM roles with least privilege, encryption at rest and in transit with SSL/TLS), cost optimization (resource right-sizing, spot instances, reserved instances, auto-scaling, cost monitoring with budgets), disaster recovery (backup strategies, multi-region deployment, cross-region replication), infrastructure testing (Terraform validation, automated testing with CI/CD), and comprehensive checklists for pre-deployment, deployment, and post-deployment phases. This guide provides practical, production-ready examples and patterns for deploying scalable, reliable, and cost-effective cloud infrastructure.

