# CI/CD Workflows Review

This document lists generic/useful CI/CD workflow patterns found in other projects.

**Last Updated**: 2026-01-05

## CI/CD Workflows Found

### ✅ Comprehensive CI/CD Pipeline (games)

- **Location**: `/Users/yoavweitzman/Documents/games/.github/workflows/ci-cd.yml`
- **Description**: Full CI/CD pipeline with frontend/backend checks, Docker builds, AWS deployment
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for full-stack CI/CD
- **Structure**:
  - **Frontend CI**: Lint, typecheck, unit tests, build, E2E tests
  - **Backend CI**: PHP CodeSniffer, PHPStan, PHPUnit tests
  - **Docker Build**: Build and push to ECR
  - **E2E Tests**: Separate job with backend running
  - **Deployment**: S3 frontend deployment, ECS backend deployment
- **Key Features**:
  - Multi-job workflow with dependencies
  - Caching for npm and Composer dependencies
  - Matrix builds support (multiple Node/PHP versions)
  - Database services (MySQL) for testing
  - Artifact upload/download between jobs
  - Environment-specific deployment (staging/production)
  - Database migrations as deployment step
  - CloudFront cache invalidation
  - ECR image building and ECS service updates
- **Notes**: 
  - Very comprehensive pattern
  - Can be adapted to any full-stack project
  - Good examples of: caching, artifacts, services, deployment
  - Environment-specific deployment patterns
  - Database migration patterns

## Recommended CI/CD Patterns

### Essential Jobs:

1. ✅ **Lint Job**
   - Run linters (ESLint, PHPCS, etc.)
   - Fail fast on code style issues
   - Can use `continue-on-error: true` for warnings

2. ✅ **Type Check Job**
   - TypeScript type checking
   - Static analysis (PHPStan, etc.)
   - Catches type errors early

3. ✅ **Unit Tests Job**
   - Run unit tests
   - Generate test coverage reports
   - Upload test results as artifacts

4. ✅ **Build Job**
   - Build application (npm run build, etc.)
   - Upload build artifacts
   - Verify build succeeds

5. ✅ **E2E Tests Job**
   - Run end-to-end tests
   - Requires backend/services running
   - Separate job with dependencies

6. ✅ **Docker Build Job**
   - Build Docker images
   - Push to container registry (ECR, Docker Hub, etc.)
   - Tag with commit SHA and 'latest'

7. ✅ **Deploy Job**
   - Deploy to staging/production
   - Run database migrations
   - Invalidate CDN cache
   - Environment-specific configuration

### CI/CD Best Practices Observed:

1. **Caching**:
   - Cache dependencies (npm, Composer, etc.)
   - Use hash of lock files for cache keys
   - Restore keys for fallback

2. **Services**:
   - Use services for databases (MySQL, PostgreSQL, etc.)
   - Health checks for services
   - Wait for services to be ready

3. **Artifacts**:
   - Upload build artifacts
   - Download artifacts in dependent jobs
   - Set retention days appropriately

4. **Environment Variables**:
   - Use GitHub secrets for sensitive data
   - Environment-specific configuration
   - Separate staging/production environments

5. **Job Dependencies**:
   - Use `needs:` for job dependencies
   - Conditional job execution (`if:`)
   - Parallel jobs where possible

6. **Error Handling**:
   - `continue-on-error: true` for non-critical checks
   - `if: always()` for cleanup steps
   - Proper error messages

7. **Deployment**:
   - Separate staging and production jobs
   - Database migrations as deployment step
   - CDN cache invalidation
   - Health checks after deployment

## Workflow Patterns

### Pattern 1: Simple CI (Lint, Test, Build)
```yaml
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build
```

### Pattern 2: Full-Stack CI/CD
```yaml
jobs:
  frontend-ci:
    # Lint, typecheck, test, build
  backend-ci:
    # Lint, test with database service
  build-docker:
    needs: [backend-ci]
    # Build and push Docker image
  deploy:
    needs: [frontend-ci, build-docker]
    # Deploy to staging/production
```

### Pattern 3: Matrix Builds
```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

### Pattern 4: Environment-Specific Deployment
```yaml
deploy-staging:
  if: github.ref == 'refs/heads/development'
  environment: staging

deploy-production:
  if: github.ref == 'refs/heads/main'
  environment: production
```

## Cloud Infrastructure Deployment Patterns

### AWS Deployment Patterns

1. **ECS/Fargate Deployment**:
   - Update ECS service with new task definition
   - Use blue-green deployment for zero downtime
   - Health checks and rollback on failure
   - CloudWatch integration for monitoring

2. **Lambda Serverless Deployment**:
   - Package and deploy Lambda functions
   - Version management and aliases
   - Environment-specific configurations
   - CloudWatch Logs integration

3. **S3 Static Site Deployment**:
   - Build and upload to S3 bucket
   - CloudFront cache invalidation
   - Versioned deployments
   - Error page configuration

4. **EC2 Auto Scaling Deployment**:
   - Launch new instances with updated AMI
   - Health checks and instance replacement
   - Auto Scaling Group updates
   - ELB target group registration

### Azure Deployment Patterns

1. **Azure App Service Deployment**:
   - Deploy to App Service slots (staging/production)
   - Swap slots for zero-downtime deployment
   - Application Insights integration
   - Azure Key Vault for secrets

2. **Azure Container Instances**:
   - Build and push to Azure Container Registry
   - Deploy containers to ACI
   - Health probe configuration
   - Log Analytics integration

3. **Azure Functions Deployment**:
   - Package and deploy function apps
   - Slot-based deployments
   - Application Insights monitoring
   - Key Vault integration

### Google Cloud Platform Deployment Patterns

1. **Cloud Run Deployment**:
   - Build and push container images
   - Deploy to Cloud Run with traffic splitting
   - Revision management
   - Cloud Monitoring integration

2. **GKE (Kubernetes) Deployment**:
   - Build and push to Container Registry
   - Deploy to GKE cluster
   - Rolling updates with health checks
   - Stackdriver monitoring

3. **Cloud Functions Deployment**:
   - Deploy functions with environment variables
   - Version management
   - Cloud Logging integration
   - IAM configuration

## Infrastructure as Code (IaC) in CI/CD

### Terraform Integration

1. **Terraform Plan Job**:
   - Run `terraform plan` to preview changes
   - Generate plan artifacts
   - Validate infrastructure changes
   - Security scanning (Checkov, tfsec)

2. **Terraform Apply Job**:
   - Apply infrastructure changes
   - State management and locking
   - Environment-specific workspaces
   - Rollback procedures

3. **Terraform Destroy Job** (optional):
   - Clean up infrastructure
   - Environment teardown
   - Cost optimization

### CloudFormation Integration

1. **CloudFormation Validate**:
   - Validate template syntax
   - Check for errors
   - Template linting

2. **CloudFormation Deploy**:
   - Create/update stacks
   - Change sets for review
   - Stack rollback on failure
   - Stack outputs for downstream jobs

### Multi-Cloud IaC Pattern

```yaml
jobs:
  terraform-plan:
    # Plan infrastructure changes
  terraform-apply-staging:
    needs: [terraform-plan]
    # Apply to staging environment
  terraform-apply-production:
    needs: [terraform-apply-staging]
    if: github.ref == 'refs/heads/main'
    # Apply to production environment
```

## Cloud Deployment Strategies

### Blue-Green Deployment

```yaml
deploy-blue-green:
  steps:
    - name: Deploy to Green Environment
      run: |
        # Deploy new version to green environment
        # Run health checks
        # Switch traffic from blue to green
        # Monitor for errors
        # Rollback to blue if issues detected
```

### Canary Deployment

```yaml
deploy-canary:
  steps:
    - name: Deploy Canary (10% traffic)
      run: |
        # Deploy to canary environment
        # Route 10% traffic to canary
        # Monitor metrics
        # Gradually increase traffic
        # Full rollout or rollback based on metrics
```

### Rolling Deployment

```yaml
deploy-rolling:
  steps:
    - name: Rolling Update
      run: |
        # Update instances incrementally
        # Health checks between updates
        # Continue until all instances updated
        # Rollback if health checks fail
```

## Cloud Monitoring and Observability in CI/CD

### Pre-Deployment Checks

1. **Infrastructure Health Checks**:
   - Verify all services are healthy
   - Check resource availability
   - Validate network connectivity
   - Confirm database connectivity

2. **Cost Estimation**:
   - Estimate deployment costs
   - Compare with previous deployments
   - Alert on cost anomalies
   - Budget compliance checks

### Post-Deployment Monitoring

1. **Deployment Verification**:
   - Health check endpoints
   - Smoke tests
   - Performance benchmarks
   - Error rate monitoring

2. **Rollback Triggers**:
   - Error rate thresholds
   - Response time thresholds
   - Availability thresholds
   - Custom metric thresholds

### CloudWatch/Azure Monitor/Stackdriver Integration

```yaml
verify-deployment:
  steps:
    - name: Wait for Deployment
      run: sleep 60
    - name: Check CloudWatch Metrics
      run: |
        # Check error rates
        # Check response times
        # Check availability
        # Fail if thresholds exceeded
```

## Cost Optimization in CI/CD

### Resource Right-Sizing

1. **Build Job Optimization**:
   - Use appropriate runner sizes
   - Cache dependencies aggressively
   - Parallelize builds
   - Clean up unused resources

2. **Deployment Optimization**:
   - Use spot instances for non-critical jobs
   - Right-size deployment environments
   - Implement auto-scaling
   - Schedule non-critical deployments

### Cost Monitoring

```yaml
cost-check:
  steps:
    - name: Check Deployment Cost
      run: |
        # Query cloud cost APIs
        # Compare with budget
        # Alert if over budget
        # Log cost metrics
```

## Serverless Deployment Patterns

### AWS Lambda Deployment

```yaml
deploy-lambda:
  steps:
    - name: Package Lambda
      run: |
        # Package function code
        # Create deployment package
    - name: Deploy Lambda
      run: |
        # Update function code
        # Update environment variables
        # Publish new version
        # Update alias
```

### Azure Functions Deployment

```yaml
deploy-azure-function:
  steps:
    - name: Build Function
      run: npm run build
    - name: Deploy Function
      run: |
        # Deploy to function app
        # Update app settings
        # Verify deployment
```

## Container Orchestration Deployment

### Kubernetes Deployment

```yaml
deploy-k8s:
  steps:
    - name: Build Container Image
      run: docker build -t app:${{ github.sha }} .
    - name: Push to Registry
      run: docker push app:${{ github.sha }}
    - name: Deploy to Kubernetes
      run: |
        # Update deployment manifest
        # Apply to cluster
        # Wait for rollout
        # Verify pods are healthy
```

### ECS Deployment

```yaml
deploy-ecs:
  steps:
    - name: Build and Push Image
      run: |
        # Build Docker image
        # Push to ECR
    - name: Update ECS Service
      run: |
        # Create new task definition
        # Update ECS service
        # Wait for service stability
        # Verify deployment
```

## Multi-Region Deployment

```yaml
deploy-multi-region:
  strategy:
    matrix:
      region: [us-east-1, us-west-2, eu-west-1]
  steps:
    - name: Deploy to ${{ matrix.region }}
      run: |
        # Deploy to specific region
        # Health checks
        # Monitor deployment
```

## Cloud Security in CI/CD

### Secrets Management

1. **AWS Secrets Manager Integration**:
   - Retrieve secrets during deployment
   - Rotate secrets automatically
   - Audit secret access

2. **Azure Key Vault Integration**:
   - Retrieve secrets from Key Vault
   - Managed identities
   - Access policies

3. **GCP Secret Manager Integration**:
   - Access secrets securely
   - IAM-based access control
   - Audit logging

### Security Scanning

```yaml
security-scan:
  steps:
    - name: Scan Container Image
      run: |
        # Scan for vulnerabilities
        # Check for compliance
        # Fail on critical issues
    - name: Scan Infrastructure Code
      run: |
        # Scan Terraform/CloudFormation
        # Check security policies
        # Validate configurations
```

## Cloud Infrastructure CI/CD Checklist

- [ ] Cloud platform selected (AWS/Azure/GCP)
- [ ] Infrastructure as Code implemented
- [ ] Deployment strategy chosen (blue-green/canary/rolling)
- [ ] Health checks configured
- [ ] Monitoring and alerting set up
- [ ] Rollback procedures defined
- [ ] Secrets management configured
- [ ] Cost monitoring enabled
- [ ] Multi-region deployment planned (if needed)
- [ ] Security scanning integrated
- [ ] Auto-scaling configured
- [ ] Backup and disaster recovery planned

## DevOps Best Practices for CI/CD Workflows

### Pipeline Efficiency and Optimization

1. **Build Time Optimization**:
   - **Dependency Caching**: Cache npm, Composer, pip, and other package manager dependencies
   - **Layer Caching**: Cache Docker image layers to speed up container builds
   - **Incremental Builds**: Only rebuild changed components, not entire application
   - **Parallel Job Execution**: Run independent jobs in parallel to reduce total pipeline time
   - **Conditional Job Execution**: Skip jobs when no relevant files changed (path filters)
   - **Build Matrix Optimization**: Use build matrices efficiently, avoid unnecessary combinations

2. **Resource Management**:
   - **Right-Size Runners**: Use appropriate runner sizes (small for lint, large for builds)
   - **Spot/Preemptible Instances**: Use cheaper compute for non-critical jobs
   - **Resource Cleanup**: Clean up temporary files, containers, and artifacts after jobs
   - **Job Timeout Configuration**: Set appropriate timeouts to prevent hanging jobs
   - **Concurrent Job Limits**: Limit concurrent jobs to prevent resource exhaustion

3. **Artifact Management**:
   - **Selective Artifact Upload**: Only upload necessary artifacts, not entire directories
   - **Artifact Compression**: Compress artifacts to reduce upload/download time
   - **Artifact Retention**: Set appropriate retention periods to manage storage costs
   - **Artifact Expiration**: Automatically expire old artifacts to free storage

### Pipeline Reliability and Resilience

1. **Error Handling and Recovery**:
   - **Retry Mechanisms**: Implement retry logic for flaky tests or network operations
   - **Graceful Degradation**: Continue pipeline execution when non-critical steps fail
   - **Failure Notifications**: Send alerts on pipeline failures with context
   - **Failure Analysis**: Track failure patterns to identify systemic issues
   - **Automatic Rollback**: Trigger rollback on deployment failures

2. **Health Checks and Validation**:
   - **Pre-Deployment Validation**: Validate configuration, secrets, and dependencies before deployment
   - **Post-Deployment Verification**: Run smoke tests and health checks after deployment
   - **Service Health Monitoring**: Monitor service health during and after deployment
   - **Database Migration Validation**: Validate migrations before applying to production
   - **Configuration Validation**: Validate environment variables and configuration files

3. **Pipeline Security**:
   - **Secrets Management**: Never hardcode secrets, use secret management systems
   - **Least Privilege Access**: Grant minimal required permissions to pipeline jobs
   - **Security Scanning**: Scan code, dependencies, and containers for vulnerabilities
   - **Audit Logging**: Log all pipeline actions for security auditing
   - **Branch Protection**: Require approvals for production deployments

### Deployment Automation and Strategies

1. **Automated Deployment Workflows**:
   - **Environment Promotion**: Automatically promote from dev → staging → production
   - **Deployment Gates**: Require manual approval for production deployments
   - **Automated Rollback**: Automatically rollback on health check failures
   - **Deployment Notifications**: Notify teams of deployment status and changes
   - **Deployment Metrics**: Track deployment success rates and durations

2. **Deployment Strategy Implementation**:
   - **Blue-Green Deployment**: Implement zero-downtime deployments with instant rollback
   - **Canary Deployment**: Gradually roll out changes with traffic splitting
   - **Rolling Deployment**: Incrementally update instances with health checks
   - **Feature Flags**: Use feature flags for gradual feature rollout
   - **Database Migration Strategies**: Implement backward-compatible schema changes

3. **Multi-Environment Management**:
   - **Environment Parity**: Maintain consistency across dev, staging, and production
   - **Environment-Specific Configuration**: Manage environment variables and secrets per environment
   - **Environment Provisioning**: Automate environment creation and teardown
   - **Environment Testing**: Test deployments in staging before production
   - **Environment Monitoring**: Monitor all environments for issues

### CI/CD Pipeline Monitoring and Observability

1. **Pipeline Metrics**:
   - **Build Duration Tracking**: Monitor build times and identify slow builds
   - **Success Rate Monitoring**: Track pipeline success rates over time
   - **Resource Utilization**: Monitor CPU, memory, and network usage during builds
   - **Cost Tracking**: Track CI/CD costs and optimize spending
   - **Queue Time Monitoring**: Monitor job queue times and optimize scheduling

2. **Deployment Monitoring**:
   - **Deployment Duration**: Track time from commit to production deployment
   - **Deployment Frequency**: Monitor deployment frequency and lead time
   - **Mean Time to Recovery (MTTR)**: Track time to recover from failures
   - **Change Failure Rate**: Monitor percentage of deployments causing failures
   - **Deployment Success Rate**: Track successful vs. failed deployments

3. **Observability Integration**:
   - **Pipeline Logging**: Centralize pipeline logs for analysis
   - **Distributed Tracing**: Trace requests across services during deployment
   - **Metrics Dashboards**: Create dashboards for pipeline and deployment metrics
   - **Alerting**: Set up alerts for pipeline failures and anomalies
   - **Incident Response**: Integrate with incident management systems

### DevOps Tools and Platform Integration

1. **CI/CD Platform Selection**:
   - **GitHub Actions**: Best for GitHub-hosted projects with integrated workflows
   - **GitLab CI**: Comprehensive DevOps platform with built-in CI/CD
   - **Jenkins**: Flexible self-hosted CI/CD with extensive plugin ecosystem
   - **CircleCI**: Cloud-native CI/CD with excellent Docker support
   - **Azure DevOps**: Integrated DevOps platform for Azure-hosted projects
   - **AWS CodePipeline**: Native AWS CI/CD integration with CodeBuild/CodeDeploy

2. **Container and Orchestration Integration**:
   - **Docker Build Integration**: Build and push containers as part of CI/CD
   - **Kubernetes Deployment**: Deploy to Kubernetes clusters via CI/CD
   - **Container Registry Integration**: Push to ECR, GCR, ACR, Docker Hub
   - **Container Scanning**: Integrate vulnerability scanning into container builds
   - **Helm Chart Deployment**: Deploy Kubernetes applications using Helm

3. **Infrastructure as Code Integration**:
   - **Terraform CI/CD**: Plan, validate, and apply infrastructure changes
   - **CloudFormation CI/CD**: Deploy AWS infrastructure via CloudFormation
   - **Ansible Integration**: Run Ansible playbooks as part of deployment
   - **Pulumi CI/CD**: Deploy infrastructure using Pulumi
   - **Infrastructure Testing**: Test infrastructure changes before applying

### DevOps Workflow Best Practices

1. **Git Workflow Integration**:
   - **Branch Strategy**: Implement Git Flow, GitHub Flow, or GitLab Flow
   - **Pull Request Workflows**: Require PR reviews and CI checks before merge
   - **Commit Message Standards**: Enforce conventional commits for better automation
   - **Tag Management**: Use semantic versioning tags for releases
   - **Release Automation**: Automate release creation and changelog generation

2. **Testing Strategy in CI/CD**:
   - **Test Pyramid**: Implement unit tests, integration tests, and E2E tests
   - **Test Parallelization**: Run tests in parallel to reduce execution time
   - **Test Coverage**: Enforce minimum test coverage thresholds
   - **Flaky Test Management**: Identify and fix or quarantine flaky tests
   - **Performance Testing**: Run performance tests before production deployment

3. **Documentation and Knowledge Sharing**:
   - **Pipeline Documentation**: Document pipeline structure and job purposes
   - **Deployment Runbooks**: Create runbooks for manual deployment procedures
   - **Incident Post-Mortems**: Document incidents and learnings
   - **Best Practices Sharing**: Share CI/CD best practices across teams
   - **Onboarding Documentation**: Help new team members understand CI/CD workflows

## Notes

- CI/CD patterns are highly reusable
- Start with simple CI, add CD as needed
- Use caching for faster builds
- Separate jobs for better parallelization
- Use services for databases/containers
- Environment-specific deployment is key
- Database migrations should be part of deployment
- Artifacts enable sharing between jobs
- **Cloud infrastructure considerations**: Design for scalability, reliability, and cost-effectiveness
- **Infrastructure as Code**: Version control all infrastructure changes
- **Multi-cloud support**: Consider multi-cloud strategies for redundancy
- **Cost optimization**: Monitor and optimize cloud costs continuously
- **Security first**: Implement security scanning and secrets management
- **Observability**: Integrate cloud monitoring into CI/CD pipelines
- **DevOps best practices**: Focus on pipeline efficiency, reliability, and automation
- **Deployment strategies**: Choose appropriate deployment strategy based on application needs
- **Monitoring and metrics**: Track pipeline and deployment metrics for continuous improvement
- **Tool selection**: Choose CI/CD platform based on project requirements and team expertise

---

## Review/Contribution

**Expert**: James Wilson  
**Expertise**: Cloud Infrastructure (Cloud Platform Architecture, Deployment, Operations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this CI/CD workflows review document by adding comprehensive cloud infrastructure deployment patterns covering AWS deployment patterns (ECS/Fargate deployment with blue-green strategies, Lambda serverless deployment with version management, S3 static site deployment with CloudFront integration, EC2 Auto Scaling deployment with health checks), Azure deployment patterns (Azure App Service deployment with slot-based zero-downtime deployments, Azure Container Instances with health probes, Azure Functions deployment with Application Insights), Google Cloud Platform deployment patterns (Cloud Run deployment with traffic splitting, GKE Kubernetes deployment with rolling updates, Cloud Functions deployment with IAM configuration), Infrastructure as Code (IaC) integration in CI/CD (Terraform integration with plan/apply/destroy jobs, CloudFormation integration with stack management, multi-cloud IaC patterns), cloud deployment strategies (blue-green deployment with traffic switching, canary deployment with gradual rollout, rolling deployment with incremental updates), cloud monitoring and observability in CI/CD (pre-deployment infrastructure health checks and cost estimation, post-deployment verification with rollback triggers, CloudWatch/Azure Monitor/Stackdriver integration), cost optimization in CI/CD (resource right-sizing for build jobs and deployments, cost monitoring with budget compliance), serverless deployment patterns (AWS Lambda and Azure Functions deployment workflows), container orchestration deployment (Kubernetes and ECS deployment patterns), multi-region deployment strategies, cloud security in CI/CD (secrets management with AWS Secrets Manager/Azure Key Vault/GCP Secret Manager, security scanning for container images and infrastructure code), and comprehensive cloud infrastructure CI/CD checklist covering cloud platform selection, IaC implementation, deployment strategies, health checks, monitoring, rollback procedures, secrets management, cost monitoring, multi-region deployment, security scanning, auto-scaling, and disaster recovery. This addition ensures that CI/CD workflows incorporate cloud infrastructure best practices, enabling scalable, reliable, and cost-effective cloud deployments with proper monitoring, security, and observability integration.

**Expert**: Devin Patel  
**Expertise**: DevOps, CI/CD, and Deployment  
**Date**: 2026-01-05  
**Changes**: Enhanced this CI/CD workflows review document by adding comprehensive "DevOps Best Practices for CI/CD Workflows" section covering pipeline efficiency and optimization (build time optimization with dependency caching and incremental builds, resource management with right-sizing and cleanup, artifact management with selective upload and compression), pipeline reliability and resilience (error handling and recovery with retry mechanisms and graceful degradation, health checks and validation with pre/post-deployment verification, pipeline security with secrets management and security scanning), deployment automation and strategies (automated deployment workflows with environment promotion and rollback, deployment strategy implementation with blue-green/canary/rolling deployments, multi-environment management with environment parity and provisioning), CI/CD pipeline monitoring and observability (pipeline metrics with build duration and success rate tracking, deployment monitoring with MTTR and change failure rate, observability integration with logging and distributed tracing), DevOps tools and platform integration (CI/CD platform selection criteria, container and orchestration integration, Infrastructure as Code integration), and DevOps workflow best practices (Git workflow integration with branch strategies and PR workflows, testing strategy in CI/CD with test pyramid and parallelization, documentation and knowledge sharing). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This addition provides essential DevOps perspective on CI/CD workflows, ensuring that pipelines are efficient, reliable, secure, and well-monitored, with proper deployment automation and best practices for continuous improvement.

