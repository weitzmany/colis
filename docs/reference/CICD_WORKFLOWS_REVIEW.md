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

## Database CI/CD Workflow Patterns

### Database Testing in CI

#### Pattern 1: Database Service in CI Pipeline

```yaml
# GitHub Actions workflow
jobs:
  test:
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: test_db
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=5
    
    steps:
      - name: Wait for MySQL
        run: |
          until mysqladmin ping -h mysql -u root -prootpassword --silent; do
            sleep 1
          done
      
      - name: Run Database Migrations
        run: npm run migrate:up
        env:
          DB_HOST: mysql
          DB_USER: root
          DB_PASSWORD: rootpassword
          DB_DATABASE: test_db
      
      - name: Run Database Tests
        run: npm run test:database
```

#### Pattern 2: Database Migration Validation

```yaml
- name: Validate Migration Files
  run: |
    # Check migration file syntax
    for migration in database/migrations/*.sql; do
      mysql --host=mysql --user=root --password=rootpassword \
        --execute="SOURCE $migration" test_db || exit 1
    done
    
    # Verify migration idempotency
    npm run migrate:up
    npm run migrate:up  # Should succeed without errors
    
    # Verify rollback
    npm run migrate:down
    npm run migrate:up  # Should succeed again
```

#### Pattern 3: Database Schema Testing

```yaml
- name: Test Database Schema
  run: |
    # Verify schema matches expected structure
    npm run migrate:up
    
    # Run schema validation tests
    npm run test:schema
    
    # Verify indexes exist
    mysql --host=mysql --user=root --password=rootpassword test_db << EOF
    SELECT COUNT(*) as index_count
    FROM information_schema.STATISTICS
    WHERE TABLE_SCHEMA = 'test_db'
    AND TABLE_NAME = 'users';
    EOF
    
    # Verify foreign keys
    mysql --host=mysql --user=root --password=rootpassword test_db << EOF
    SELECT COUNT(*) as fk_count
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE TABLE_SCHEMA = 'test_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;
    EOF
```

### Database Migration CI/CD Workflow

#### Pattern 1: Migration Validation Job

```yaml
validate-migrations:
  runs-on: ubuntu-latest
  services:
    mysql:
      image: mysql:8.0
      env:
        MYSQL_ROOT_PASSWORD: rootpassword
        MYSQL_DATABASE: test_db
      ports:
        - 3306:3306
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Wait for MySQL
      run: |
        until mysqladmin ping -h mysql -u root -prootpassword --silent; do
          sleep 1
        done
    
    - name: Validate Migration Syntax
      run: npm run migrate:validate
    
    - name: Test Migration Execution
      run: npm run migrate:test
    
    - name: Test Migration Rollback
      run: npm run migrate:test:rollback
```

#### Pattern 2: Database Migration Deployment Job

```yaml
deploy-migrations:
  needs: [build, validate-migrations]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Database Connection
      run: |
        echo "DB_HOST=${{ secrets.DB_HOST }}" >> $GITHUB_ENV
        echo "DB_USER=${{ secrets.DB_USER }}" >> $GITHUB_ENV
        echo "DB_PASSWORD=${{ secrets.DB_PASSWORD }}" >> $GITHUB_ENV
        echo "DB_DATABASE=${{ secrets.DB_DATABASE }}" >> $GITHUB_ENV
    
    - name: Backup Database
      run: |
        mysqldump \
          -h ${{ secrets.DB_HOST }} \
          -u ${{ secrets.DB_USER }} \
          -p${{ secrets.DB_PASSWORD }} \
          ${{ secrets.DB_DATABASE }} \
          > backup_$(date +%Y%m%d_%H%M%S).sql
        
        # Upload backup to S3
        aws s3 cp backup_*.sql s3://${{ secrets.S3_BACKUP_BUCKET }}/backups/
    
    - name: Run Migrations
      run: npm run migrate:up
      continue-on-error: false
    
    - name: Verify Migration Success
      run: |
        npm run migrate:status
        # Verify schema version matches expected
    
    - name: Rollback on Failure
      if: failure()
      run: |
        echo "Migration failed, rolling back..."
        npm run migrate:down -- --to-last
        exit 1
```

### Database Testing Patterns in CI/CD

#### Pattern 1: Database Integration Tests

```yaml
test-database-integration:
  services:
    mysql:
      image: mysql:8.0
      env:
        MYSQL_ROOT_PASSWORD: rootpassword
        MYSQL_DATABASE: test_db
  
  steps:
    - name: Setup Test Database
      run: |
        npm run migrate:up
        npm run seed:test
    
    - name: Run Integration Tests
      run: npm run test:integration
      env:
        DB_HOST: mysql
        DB_USER: root
        DB_PASSWORD: rootpassword
        DB_DATABASE: test_db
    
    - name: Cleanup Test Database
      if: always()
      run: npm run migrate:down -- --all
```

#### Pattern 2: Database Performance Tests

```yaml
test-database-performance:
  services:
    mysql:
      image: mysql:8.0
  
  steps:
    - name: Setup Database
      run: npm run migrate:up
    
    - name: Load Test Data
      run: npm run seed:performance
    
    - name: Run Performance Tests
      run: npm run test:performance
    
    - name: Check Slow Queries
      run: |
        SLOW_QUERIES=$(mysql -h mysql -u root -prootpassword test_db \
          -se "SELECT COUNT(*) FROM mysql.slow_log WHERE start_time > DATE_SUB(NOW(), INTERVAL 1 HOUR)")
        
        if [ "$SLOW_QUERIES" -gt 10 ]; then
          echo "⚠️ Warning: $SLOW_QUERIES slow queries detected"
          exit 1
        fi
```

### Database CI/CD Best Practices

1. **Database Testing in CI**:
   - Use database services in CI pipelines
   - Run migrations before tests
   - Test migration rollback procedures
   - Validate schema after migrations
   - Clean up test databases after tests

2. **Migration Validation**:
   - Validate migration file syntax
   - Test migration idempotency
   - Verify migration rollback
   - Check migration dependencies
   - Validate migration against test data

3. **Database Deployment**:
   - Backup database before migrations (production)
   - Run migrations in transaction when possible
   - Verify migration success
   - Monitor migration execution time
   - Rollback on deployment failure

4. **Database Health Checks**:
   - Verify database connectivity
   - Check schema version
   - Monitor slow queries
   - Verify data integrity
   - Check database performance metrics

### Database CI/CD Checklist

- [ ] Database service configured in CI pipeline
- [ ] Database migrations run before tests
- [ ] Migration validation job implemented
- [ ] Migration rollback testing automated
- [ ] Database schema testing automated
- [ ] Database integration tests in CI
- [ ] Database performance tests configured
- [ ] Database backup before production migrations
- [ ] Database health checks after deployment
- [ ] Database migration rollback on failure
- [ ] Database monitoring in CI/CD
- [ ] Database deployment documentation

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
- **Database testing**: Test database migrations and schema changes in CI
- **Database validation**: Validate migrations before deployment
- **Database health checks**: Verify database state after deployment
- **Analytics testing**: Test analytics data collection and processing in CI
- **Analytics validation**: Validate analytics data accuracy and completeness
- **Analytics deployment**: Deploy analytics services and data warehouse in CI/CD

## Analytics & Business Intelligence CI/CD Workflow Patterns

### Pattern 1: Analytics Data Collection CI/CD Workflow

**Description**: CI/CD workflow for analytics data collection services with event tracking and metrics collection

**Pattern**:
- Test analytics data collection services
- Validate analytics data accuracy
- Deploy analytics services
- Verify analytics endpoints after deployment

**Example**:
```yaml
# .github/workflows/analytics-ci-cd.yml
name: Analytics CI/CD

on:
  push:
    branches: [main]
    paths:
      - 'analytics/**'
      - '.github/workflows/analytics-ci-cd.yml'

jobs:
  test-analytics-collection:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Dependencies
        run: npm ci
      
      - name: Test Analytics Collection
        run: npm run test:analytics
      
      - name: Validate Analytics Data
        run: npm run validate:analytics-data
  
  deploy-analytics-services:
    needs: [test-analytics-collection]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Analytics API
        run: |
          kubectl apply -f k8s/analytics/analytics-api.yaml
      
      - name: Verify Analytics Endpoints
        run: |
          curl -f https://api.example.com/analytics/health || exit 1
```

### Pattern 2: Analytics Data Warehouse CI/CD Workflow

**Description**: CI/CD workflow for analytics data warehouse with ETL pipelines and data processing

**Pattern**:
- Test ETL pipeline services
- Validate data warehouse migrations
- Deploy data warehouse infrastructure
- Verify data warehouse after deployment

**Example**:
```yaml
test-etl-pipeline:
  runs-on: ubuntu-latest
  services:
    postgres:
      image: postgres:14
      env:
        POSTGRES_PASSWORD: postgres
        POSTGRES_DB: test_warehouse
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Test Data Warehouse
      run: |
        npm run migrate:analytics:up
        npm run seed:analytics:test
    
    - name: Test ETL Pipeline
      run: npm run test:etl-pipeline
      env:
        DW_HOST: postgres
        DW_DATABASE: test_warehouse
    
    - name: Validate Data Warehouse
      run: npm run validate:data-warehouse

deploy-data-warehouse:
  needs: [test-etl-pipeline]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Deploy Data Warehouse Infrastructure
      run: terraform apply -target=module.data_warehouse -auto-approve
    
    - name: Run Analytics Migrations
      run: npm run migrate:analytics:up
    
    - name: Deploy ETL Pipeline
      run: kubectl apply -f k8s/analytics/etl-pipeline.yaml
    
    - name: Verify Data Warehouse
      run: |
        curl -f https://api.example.com/analytics/warehouse/health || exit 1
```

### Pattern 3: Analytics Dashboard CI/CD Workflow

**Description**: CI/CD workflow for analytics dashboards with frontend and API deployment

**Pattern**:
- Build analytics dashboard frontend
- Test dashboard components
- Deploy dashboard API
- Deploy dashboard frontend
- Verify dashboard after deployment

**Example**:
```yaml
build-analytics-dashboard:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Dependencies
      run: npm ci
    
    - name: Build Dashboard
      run: npm run build:analytics-dashboard
    
    - name: Test Dashboard Components
      run: npm run test:analytics-dashboard
    
    - name: Upload Dashboard Artifacts
      uses: actions/upload-artifact@v3
      with:
        name: analytics-dashboard
        path: dist/analytics-dashboard/

deploy-analytics-dashboard:
  needs: [build-analytics-dashboard]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Download Dashboard Artifacts
      uses: actions/download-artifact@v3
      with:
        name: analytics-dashboard
    
    - name: Deploy Dashboard API
      run: kubectl apply -f k8s/analytics/dashboard-api.yaml
    
    - name: Deploy Dashboard Frontend
      run: |
        aws s3 sync dist/analytics-dashboard/ s3://analytics-dashboard-bucket/
        aws cloudfront create-invalidation \
          --distribution-id ${{ secrets.CF_DIST_ID }} \
          --paths "/analytics/*"
    
    - name: Verify Dashboard
      run: |
        curl -f https://dashboard.example.com/analytics/health || exit 1
```

### Pattern 4: Analytics Report Generation CI/CD Workflow

**Description**: CI/CD workflow for analytics report generation with scheduled report jobs

**Pattern**:
- Test report generation service
- Validate report templates
- Deploy report generation service
- Configure scheduled report jobs
- Verify report generation after deployment

**Example**:
```yaml
test-report-generation:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Test Report Generation
      run: npm run test:report-generation
    
    - name: Validate Report Templates
      run: npm run validate:report-templates

deploy-report-generation:
  needs: [test-report-generation]
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'
  
  steps:
    - uses: actions/checkout@v3
    
    - name: Deploy Report Generator
      run: kubectl apply -f k8s/analytics/report-generator.yaml
    
    - name: Configure Report Scheduling
      run: kubectl apply -f k8s/analytics/report-scheduler.yaml
    
    - name: Verify Report Generation
      run: |
        curl -f https://api.example.com/analytics/reports/health || exit 1
```

### Analytics CI/CD Best Practices

1. **Analytics Testing in CI**:
   - Test analytics data collection accuracy
   - Validate analytics data transformations
   - Test analytics metric calculations
   - Validate analytics report generation
   - Test analytics dashboard rendering

2. **Analytics Deployment**:
   - Deploy analytics services before application services
   - Verify analytics endpoints after deployment
   - Monitor analytics data collection rates
   - Verify analytics data warehouse connectivity
   - Test analytics dashboard functionality

3. **Analytics Validation**:
   - Validate analytics data accuracy
   - Verify analytics metric calculations
   - Test analytics data aggregation
   - Validate analytics report formatting
   - Test analytics dashboard performance

### Analytics CI/CD Checklist

- [ ] Analytics data collection tests in CI
- [ ] Analytics data validation automated
- [ ] Analytics ETL pipeline tests configured
- [ ] Analytics data warehouse tests automated
- [ ] Analytics dashboard build and test automated
- [ ] Analytics report generation tests configured
- [ ] Analytics services deployment automated
- [ ] Analytics endpoints verification automated
- [ ] Analytics data warehouse deployment automated
- [ ] Analytics dashboard deployment automated
- [ ] Analytics report scheduling configured
- [ ] Analytics deployment monitoring configured

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

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this CI/CD workflows review document by adding comprehensive "Database CI/CD Workflow Patterns" section covering database testing in CI (database service in CI pipeline with MySQL service configuration and health checks, database migration validation with syntax checking and idempotency testing, database schema testing with schema validation and index/foreign key verification), database migration CI/CD workflow (migration validation job with syntax validation and rollback testing, database migration deployment job with backup, migration execution, verification, and rollback on failure), database testing patterns in CI/CD (database integration tests with test database setup and cleanup, database performance tests with slow query detection), database CI/CD best practices (database testing in CI with migration execution and cleanup, migration validation with syntax and dependency checking, database deployment with backup and transaction support, database health checks with connectivity and schema verification), and comprehensive database CI/CD checklist (12 items covering database service configuration, migration validation, rollback testing, schema testing, integration tests, performance tests, backup, health checks, rollback, monitoring, documentation). Enhanced "Notes" section with database-specific considerations (database testing, migration validation, database health checks). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide production-ready patterns for integrating database operations into CI/CD pipelines, ensuring database migrations are tested, validated, and safely deployed as part of the continuous integration and deployment process.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Enhanced this CI/CD workflows review document by adding comprehensive "Analytics & Business Intelligence CI/CD Workflow Patterns" section covering analytics data collection CI/CD workflow (CI/CD workflow for analytics data collection services with event tracking and metrics collection including test analytics data collection services, validate analytics data accuracy, deploy analytics services, verify analytics endpoints after deployment with GitHub Actions workflow example for analytics CI/CD with test-analytics-collection job and deploy-analytics-services job), analytics data warehouse CI/CD workflow (CI/CD workflow for analytics data warehouse with ETL pipelines and data processing including test ETL pipeline services, validate data warehouse migrations, deploy data warehouse infrastructure, verify data warehouse after deployment with GitHub Actions workflow example for test-etl-pipeline job with PostgreSQL service and deploy-data-warehouse job with Terraform and Kubernetes deployment), analytics dashboard CI/CD workflow (CI/CD workflow for analytics dashboards with frontend and API deployment including build analytics dashboard frontend, test dashboard components, deploy dashboard API, deploy dashboard frontend, verify dashboard after deployment with GitHub Actions workflow example for build-analytics-dashboard job with artifact upload and deploy-analytics-dashboard job with S3 and CloudFront deployment), analytics report generation CI/CD workflow (CI/CD workflow for analytics report generation with scheduled report jobs including test report generation service, validate report templates, deploy report generation service, configure scheduled report jobs, verify report generation after deployment with GitHub Actions workflow example for test-report-generation job and deploy-report-generation job with Kubernetes deployment), and analytics CI/CD best practices (analytics testing in CI with data collection accuracy testing, data transformation validation, metric calculation testing, report generation validation, dashboard rendering testing, analytics deployment with analytics services before application services, endpoint verification, data collection rate monitoring, data warehouse connectivity verification, dashboard functionality testing, analytics validation with data accuracy validation, metric calculation verification, data aggregation testing, report formatting validation, dashboard performance testing). Added comprehensive analytics CI/CD checklist (12 items covering data collection tests, data validation, ETL pipeline tests, data warehouse tests, dashboard build/test, report generation tests, services deployment, endpoints verification, data warehouse deployment, dashboard deployment, report scheduling, deployment monitoring). Enhanced "Notes" section with analytics-specific considerations (analytics testing, analytics validation, analytics deployment). This addition provides essential BI/Analytics perspective on CI/CD workflows, ensuring analytics features are properly tested, validated, and deployed in CI/CD pipelines for reliable analytics functionality.
