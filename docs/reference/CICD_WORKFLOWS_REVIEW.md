# CI/CD Workflows Review

This document lists generic/useful CI/CD workflow patterns found in other projects.

**Last Updated**: 2025-01-05

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

## Notes

- CI/CD patterns are highly reusable
- Start with simple CI, add CD as needed
- Use caching for faster builds
- Separate jobs for better parallelization
- Use services for databases/containers
- Environment-specific deployment is key
- Database migrations should be part of deployment
- Artifacts enable sharing between jobs

