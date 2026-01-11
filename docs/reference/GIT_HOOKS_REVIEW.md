# Git Hooks Review

This document lists useful git hooks patterns found in other projects.

**Last Updated**: 2026-01-05

## Git Hooks Patterns Found

### ✅ Pre-Push Hook (games)

#### 1. **Comprehensive Pre-Push Hook** (games/scripts/pre-push)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/pre-push`
- **Description**: Comprehensive pre-push hook that runs CI checks before pushing
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for pre-push validation
- **Key Features**:
  - **GitHub Actions Check**: Verifies last CI run passed
  - **Frontend Checks**: Lint, typecheck, test, build
  - **Backend Checks**: PHPCS, PHPStan, PHPUnit
  - **E2E Checks**: Console/network checks (Playwright)
  - **Branch Filtering**: Only runs for main/development branches
  - **Commit Tracking**: Tracks checked commits to avoid re-checking
  - **Error Handling**: Clear error messages, exit codes
  - **Color Output**: ANSI colors for better UX
- **Pattern**: Comprehensive CI check before push
- **Notes**:
  - Very thorough validation
  - Can be adapted to any tech stack
  - Branch-specific execution
  - GitHub Actions integration
  - Prevents pushing broken code

#### 2. **Git Hooks Setup Script** (games/scripts/setup-git-hooks.sh)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/setup-git-hooks.sh`
- **Description**: Script to install git hooks into `.git/hooks/`
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for hook installation
- **Key Features**:
  - Copies hook templates to `.git/hooks/`
  - Makes hooks executable
  - Verifies installation
  - Error handling
- **Pattern**: Automated hook installation
- **Notes**:
  - Simple, reusable pattern
  - Makes hooks easy to set up
  - Version-controlled hook templates

## Recommended Git Hooks Patterns

### Pre-Push Hook:

1. ✅ **Pattern**:
   - Check CI status (GitHub Actions, etc.)
   - Run local checks (lint, test, build)
   - Block push if checks fail
   - Branch-specific execution

2. ✅ **Common Checks**:
   - Linting
   - Type checking
   - Unit tests
   - Build verification
   - E2E tests (optional)

3. ✅ **Best Practices**:
   - Fast execution (don't block too long)
   - Clear error messages
   - Branch filtering (only critical branches)
   - Skip option (`--no-verify` for emergencies)

### Pre-Commit Hook:

1. ✅ **Pattern**:
   - Quick checks before commit
   - Format code (Prettier, etc.)
   - Lint staged files
   - Prevent invalid commits

2. ✅ **Common Checks**:
   - Code formatting
   - Lint staged files
   - Commit message format
   - File size checks

3. ✅ **Best Practices**:
   - Very fast (shouldn't block workflow)
   - Only check staged files
   - Auto-fix where possible
   - Clear feedback

### Hook Installation:

1. ✅ **Pattern**:
   - Hook templates in `scripts/` or `.githooks/`
   - Setup script to install hooks
   - Version control hook templates
   - Documentation for setup

2. ✅ **Best Practices**:
   - Automated installation
   - Version-controlled templates
   - Easy to update
   - Clear setup instructions

## Git Hooks Best Practices

1. **Hook Types**:
   - **Pre-commit**: Quick checks, formatting
   - **Pre-push**: Comprehensive CI checks
   - **Commit-msg**: Commit message validation
   - **Post-commit**: Notifications, logging

2. **Performance**:
   - Pre-commit: Very fast (< 1 second)
   - Pre-push: Can be longer (full CI checks)
   - Don't block developer workflow unnecessarily

3. **Error Handling**:
   - Clear error messages
   - Exit codes (0 = success, 1 = failure)
   - Color output for visibility
   - Helpful guidance

4. **Branch Filtering**:
   - Pre-push: Only critical branches (main, development)
   - Pre-commit: All branches
   - Configurable filtering

5. **Bypass Option**:
   - `--no-verify` flag for emergencies
   - Document when to use
   - Use sparingly

6. **Maintenance**:
   - Version control hook templates
   - Update hooks with codebase
   - Document hook behavior
   - Test hooks regularly

## Git Hooks Patterns

### Pattern 1: Pre-Push Hook (CI Checks)
```bash
#!/bin/bash
# Check GitHub Actions status
# Run local tests
# Block if checks fail
```

### Pattern 2: Pre-Commit Hook (Formatting)
```bash
#!/bin/bash
# Format code (Prettier)
# Lint staged files
# Auto-fix where possible
```

### Pattern 3: Hook Setup Script
```bash
#!/bin/bash
# Copy hook templates to .git/hooks/
# Make hooks executable
# Verify installation
```

## Security Considerations for Git Hooks

### Security Enforcement in Pre-Push Hooks

1. **Secret Detection and Prevention**:
   - Scan for hardcoded API keys, passwords, tokens, and credentials
   - Use tools like `git-secrets`, `truffleHog`, or `gitleaks` in pre-push hooks
   - Block commits containing sensitive information patterns
   - Prevent accidental exposure of secrets to remote repositories
   - Integrate secret scanning as mandatory pre-push check

2. **Dependency Vulnerability Scanning**:
   - Scan dependencies for known vulnerabilities before push
   - Use tools like `npm audit`, `snyk`, or `dependabot` in hooks
   - Block pushes if critical vulnerabilities are detected
   - Require dependency updates for high-severity issues
   - Maintain security posture through automated checks

3. **Code Security Scanning**:
   - Run static analysis tools (SAST) in pre-push hooks
   - Detect security anti-patterns and vulnerabilities
   - Use tools like `eslint-security-plugin`, `bandit`, or `semgrep`
   - Block pushes with high-severity security findings
   - Integrate security linting into development workflow

### Security Best Practices for Git Hooks

1. **Hook Integrity and Trust**:
   - Store hooks in version control to ensure consistency
   - Use signed commits to verify hook authenticity
   - Prevent hook tampering through file permissions
   - Validate hook integrity before execution
   - Use `.git/hooks` directory with proper access controls

2. **Secure Hook Execution**:
   - Avoid executing untrusted code in hooks
   - Validate inputs and parameters in hook scripts
   - Use secure shell execution practices
   - Prevent command injection vulnerabilities
   - Sanitize environment variables and inputs

3. **Access Control and Permissions**:
   - Restrict hook modification to authorized users
   - Use file system permissions to protect hooks
   - Implement audit logging for hook executions
   - Track hook changes and modifications
   - Prevent unauthorized hook bypassing

### Security Workflow Integration

1. **Pre-Commit Security Checks**:
   - Scan staged files for secrets and vulnerabilities
   - Run security linters on changed code
   - Validate security configurations
   - Check for security anti-patterns
   - Prevent insecure code from entering repository

2. **Pre-Push Security Validation**:
   - Comprehensive security scanning before remote push
   - Validate all security checks pass before allowing push
   - Block pushes with security violations
   - Require security review for sensitive changes
   - Integrate with security incident response

3. **Post-Receive Security Monitoring**:
   - Monitor repository for security issues after push
   - Alert on security violations detected post-push
   - Track security metrics and compliance
   - Generate security reports from hook data
   - Integrate with security information and event management (SIEM)

### Security Tools Integration

1. **Secret Management**:
   - Integrate with secret management systems
   - Validate secrets are not hardcoded
   - Check for proper secret rotation
   - Verify environment variable usage
   - Enforce secret management policies

2. **Vulnerability Scanning**:
   - Automated dependency vulnerability checks
   - Code vulnerability scanning
   - Container image scanning (if applicable)
   - Infrastructure as code security scanning
   - Continuous security monitoring

3. **Compliance and Auditing**:
   - Enforce security compliance requirements
   - Generate security audit logs
   - Track security policy violations
   - Maintain security compliance reports
   - Support regulatory compliance (GDPR, HIPAA, etc.)

## DevOps Best Practices for Git Hooks

### CI/CD Integration with Git Hooks

1. **Pre-Push Hook CI/CD Integration**:
   - Integrate pre-push hooks with CI/CD pipeline status checks
   - Verify last CI/CD pipeline run passed before allowing push
   - Use GitHub Actions API or CI/CD platform APIs to check status
   - Cache CI/CD status to avoid repeated API calls
   - Implement retry logic for CI/CD status checks
   - Provide clear feedback on CI/CD status
   - Block pushes if CI/CD pipeline is failing or pending

2. **Local CI/CD Simulation**:
   - Run same checks locally that CI/CD runs remotely
   - Use same test commands, lint rules, and build processes
   - Ensure local and CI/CD environments are consistent
   - Catch issues before they reach CI/CD pipeline
   - Reduce CI/CD pipeline failures and reruns
   - Speed up development feedback loop
   - Document local vs CI/CD check differences

3. **CI/CD Pipeline Optimization**:
   - Use pre-push hooks to reduce CI/CD pipeline load
   - Catch common issues locally before CI/CD runs
   - Implement incremental checks (only changed files)
   - Cache dependencies and build artifacts in hooks
   - Parallelize hook checks where possible
   - Optimize hook execution time
   - Balance local checks with CI/CD pipeline efficiency

### Automated Hook Management

1. **Hook Installation Automation**:
   - Automate hook installation in setup scripts
   - Use package.json scripts or Makefile targets
   - Integrate hook installation with project setup
   - Verify hook installation in CI/CD pipeline
   - Use tools like `husky`, `pre-commit`, or custom scripts
   - Document hook installation process
   - Make hook installation part of onboarding

2. **Hook Version Management**:
   - Version control hook templates in repository
   - Track hook changes in git history
   - Use semantic versioning for hook updates
   - Automate hook updates for team members
   - Notify team when hooks are updated
   - Document hook version changes
   - Test hook updates before deployment

3. **Hook Distribution**:
   - Store hooks in version-controlled directory (`.githooks/`, `scripts/hooks/`)
   - Use setup script to install hooks to `.git/hooks/`
   - Support multiple hook management tools
   - Provide installation instructions in README
   - Automate hook installation in CI/CD
   - Ensure hooks are consistent across team
   - Handle hook conflicts and updates gracefully

### Deployment Pipeline Integration

1. **Pre-Deployment Validation**:
   - Use git hooks to validate deployment readiness
   - Check deployment configuration in hooks
   - Validate environment variables and secrets
   - Verify deployment scripts and configurations
   - Check infrastructure as code changes
   - Validate database migration scripts
   - Ensure deployment artifacts are ready

2. **Environment-Specific Hooks**:
   - Use different hooks for different environments
   - Configure hooks based on branch or environment
   - Implement environment-specific validation
   - Use feature flags for hook behavior
   - Document environment-specific hook requirements
   - Test hooks in all environments
   - Maintain hook consistency across environments

3. **Deployment Workflow Integration**:
   - Integrate hooks with deployment workflows
   - Use hooks to trigger deployment processes
   - Validate deployment prerequisites in hooks
   - Check deployment permissions and access
   - Verify deployment configurations
   - Monitor deployment readiness
   - Document deployment hook requirements

### Monitoring and Observability for Git Hooks

1. **Hook Execution Monitoring**:
   - Log hook executions for audit and debugging
   - Track hook execution time and performance
   - Monitor hook failure rates and patterns
   - Alert on hook failures or anomalies
   - Use structured logging for hook events
   - Integrate hook logs with monitoring systems
   - Generate hook execution reports

2. **Hook Performance Metrics**:
   - Track hook execution duration
   - Monitor hook resource usage (CPU, memory)
   - Measure hook impact on developer workflow
   - Identify slow hooks and optimize
   - Set performance budgets for hooks
   - Track hook bypass frequency
   - Optimize hook execution time

3. **Hook Analytics and Reporting**:
   - Generate hook usage statistics
   - Track hook effectiveness (issues caught)
   - Monitor hook bypass patterns
   - Report hook performance metrics
   - Analyze hook failure causes
   - Track hook adoption across team
   - Generate hook compliance reports

### Infrastructure as Code for Git Hooks

1. **Hook Configuration as Code**:
   - Define hooks in configuration files (YAML, JSON, TOML)
   - Version control hook configurations
   - Use Infrastructure as Code principles for hooks
   - Automate hook configuration deployment
   - Test hook configurations before deployment
   - Document hook configuration changes
   - Maintain hook configuration consistency

2. **Hook Template Management**:
   - Create reusable hook templates
   - Use templating engines for hook generation
   - Parameterize hooks for different projects
   - Maintain hook template library
   - Version control hook templates
   - Document hook template usage
   - Share hooks across projects and teams

3. **Hook Configuration Validation**:
   - Validate hook configurations before installation
   - Check hook syntax and correctness
   - Verify hook dependencies and requirements
   - Test hook configurations in CI/CD
   - Validate hook permissions and access
   - Ensure hook configuration security
   - Document hook configuration validation

### DevOps Tools and Technologies for Git Hooks

1. **Hook Management Tools**:
   - **Husky**: Git hooks made easy for Node.js projects
   - **pre-commit**: Framework for managing git hooks
   - **git-hooks**: Simple git hooks manager
   - **lefthook**: Fast and powerful git hooks manager
   - **Overcommit**: Fully configurable git hook manager
   - **git-hooks-js**: JavaScript-based git hooks manager

2. **CI/CD Integration Tools**:
   - **GitHub Actions**: CI/CD workflows with hook integration
   - **GitLab CI**: GitLab CI/CD with hook support
   - **Jenkins**: Jenkins integration with git hooks
   - **CircleCI**: CircleCI workflows with hook checks
   - **Travis CI**: Travis CI integration with hooks

3. **Monitoring and Observability Tools**:
   - **CloudWatch Logs**: AWS logging for hook execution
   - **Datadog**: Monitoring and logging for hooks
   - **Splunk**: Log analysis for hook events
   - **ELK Stack**: Elasticsearch, Logstash, Kibana for hook logs
   - **Prometheus + Grafana**: Metrics and dashboards for hooks

### DevOps Workflow Best Practices for Git Hooks

1. **Development Workflow Integration**:
   - Integrate hooks seamlessly into developer workflow
   - Minimize hook execution time to avoid blocking developers
   - Provide clear feedback and error messages
   - Support hook bypass for emergencies (`--no-verify`)
   - Document hook behavior and requirements
   - Make hooks easy to install and update
   - Ensure hooks work across different operating systems

2. **Team Collaboration**:
   - Ensure hooks are consistent across team members
   - Automate hook installation for new team members
   - Document hook requirements and setup
   - Provide troubleshooting guides for hook issues
   - Support different development environments
   - Handle hook conflicts and updates gracefully
   - Maintain hook compatibility across team

3. **Continuous Improvement**:
   - Regularly review and update hooks
   - Optimize hook performance based on metrics
   - Add new checks based on team needs
   - Remove obsolete or ineffective hooks
   - Gather feedback from team on hook effectiveness
   - Monitor hook usage and effectiveness
   - Iterate on hook improvements

## Database-Related Git Hooks

### Pre-Commit Hooks for Database

**Migration File Validation**:
- Validate migration file naming conventions (timestamp, description format)
- Check migration file syntax (SQL syntax validation, migration tool format validation)
- Verify migration file structure (up/down methods, rollback support)
- Validate migration dependencies (check for missing dependencies, circular dependencies)
- Check migration file completeness (required fields, proper formatting)

**Schema Change Validation**:
- Validate schema changes (DDL syntax validation, constraint validation)
- Check for breaking changes (column removal, constraint removal, index removal)
- Verify migration rollback support (down migration exists, rollback tested)
- Validate migration ordering (timestamp ordering, dependency ordering)

**Database Script Validation**:
- Validate database script syntax (SQL syntax, script tool format)
- Check database script structure (transaction handling, error handling)
- Verify database script dependencies (required tables, required data)
- Validate database script security (SQL injection prevention, credential handling)

**Example Pre-Commit Hook for Migration Validation**:
```bash
#!/bin/bash
# .git/hooks/pre-commit

# Check for migration files
MIGRATION_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(sql|migration|migrate)$')

if [ -n "$MIGRATION_FILES" ]; then
    echo "Validating migration files..."
    
    for file in $MIGRATION_FILES; do
        # Validate migration file naming
        if ! [[ "$file" =~ ^[0-9]{14}_.*\.(sql|migration|migrate)$ ]]; then
            echo "Error: Migration file '$file' does not follow naming convention (timestamp_description.ext)"
            exit 1
        fi
        
        # Validate migration file syntax
        if ! sql_validator "$file"; then
            echo "Error: Migration file '$file' has syntax errors"
            exit 1
        fi
        
        # Check for rollback support
        if ! grep -q "down" "$file"; then
            echo "Warning: Migration file '$file' may not have rollback support"
        fi
    done
    
    echo "Migration files validated successfully"
fi
```

### Pre-Push Hooks for Database

**Migration Testing**:
- Run migration tests (test migration execution, test rollback)
- Validate migration against test database (schema validation, data validation)
- Check migration performance (execution time, resource usage)
- Verify migration compatibility (database version compatibility, dependency compatibility)

**Database Schema Validation**:
- Validate schema changes against production schema (schema diff validation, constraint validation)
- Check for breaking changes (backward compatibility, data migration requirements)
- Verify migration safety (no data loss, no downtime requirements)
- Validate migration rollback safety (rollback tested, rollback safe)

**Database Backup Verification**:
- Verify database backup exists (backup file exists, backup is recent)
- Check database backup integrity (backup file validation, backup restore test)
- Validate database backup location (backup location accessible, backup location secure)

**Example Pre-Push Hook for Migration Testing**:
```bash
#!/bin/bash
# .git/hooks/pre-push

# Check for migration files in commits being pushed
MIGRATION_FILES=$(git diff origin/$(git rev-parse --abbrev-ref HEAD)..HEAD --name-only --diff-filter=ACM | grep -E '\.(sql|migration|migrate)$')

if [ -n "$MIGRATION_FILES" ]; then
    echo "Testing migrations before push..."
    
    # Set up test database
    TEST_DB="test_migration_$(date +%s)"
    createdb "$TEST_DB"
    
    # Run migrations
    for file in $MIGRATION_FILES; do
        echo "Testing migration: $file"
        if ! psql "$TEST_DB" -f "$file"; then
            echo "Error: Migration '$file' failed"
            dropdb "$TEST_DB"
            exit 1
        fi
    done
    
    # Test rollback
    for file in $(echo "$MIGRATION_FILES" | tac); do
        echo "Testing rollback: $file"
        if ! psql "$TEST_DB" -f "${file%.*}.down.sql"; then
            echo "Error: Rollback for '$file' failed"
            dropdb "$TEST_DB"
            exit 1
        fi
    done
    
    # Clean up
    dropdb "$TEST_DB"
    echo "Migrations tested successfully"
fi
```

### Post-Merge Hooks for Database

**Migration Execution**:
- Execute migrations after merge (run migrations, verify migration success)
- Validate migration results (schema validation, data validation)
- Check migration status (migration applied, migration status)

**Database Schema Synchronization**:
- Synchronize database schema (update schema, verify schema matches)
- Validate schema consistency (schema matches code, schema matches migrations)
- Check for schema drift (detect schema drift, report schema differences)

**Database Seed Data**:
- Run seed data scripts (execute seed scripts, verify seed data)
- Validate seed data (data integrity, data completeness)
- Check seed data consistency (seed data matches requirements)

**Example Post-Merge Hook for Migration Execution**:
```bash
#!/bin/bash
# .git/hooks/post-merge

# Check for new migration files
MIGRATION_FILES=$(git diff HEAD@{1}..HEAD --name-only --diff-filter=A | grep -E '\.(sql|migration|migrate)$')

if [ -n "$MIGRATION_FILES" ]; then
    echo "New migrations detected, executing..."
    
    for file in $MIGRATION_FILES; do
        echo "Executing migration: $file"
        if ! psql "$DATABASE_URL" -f "$file"; then
            echo "Error: Migration '$file' failed"
            exit 1
        fi
    done
    
    echo "Migrations executed successfully"
fi
```

### Database Hook Best Practices

**Migration Hook Best Practices**:
- Validate migration files before commit (pre-commit validation, syntax checking)
- Test migrations before push (pre-push testing, rollback testing)
- Execute migrations after merge (post-merge execution, migration status checking)
- Monitor migration execution (migration logging, migration monitoring)
- Handle migration errors (error handling, rollback on error)

**Database Schema Hook Best Practices**:
- Validate schema changes (schema validation, breaking change detection)
- Check schema consistency (schema drift detection, schema synchronization)
- Monitor schema changes (schema change logging, schema change alerts)
- Document schema changes (schema change documentation, migration documentation)

**Database Security Hook Best Practices**:
- Validate database credentials (credential validation, credential security)
- Check database access (access control, permission validation)
- Monitor database access (access logging, access monitoring)
- Prevent SQL injection (SQL injection prevention, input validation)

**Database Performance Hook Best Practices**:
- Monitor migration performance (migration timing, resource usage)
- Optimize migration execution (migration optimization, batch operations)
- Check migration impact (performance impact, resource impact)
- Validate migration efficiency (execution time, resource usage)

## Notes

- Git hooks are powerful for enforcing quality and security
- Pre-push hooks can prevent security issues from being pushed
- Pre-commit hooks enforce formatting/style
- Hook installation should be automated
- Hooks should be fast (especially pre-commit)
- Clear error messages are essential
- Branch filtering helps balance safety and speed
- Version control hook templates
- Documentation is important
- Bypass option for emergencies
- Security scanning should be integrated into hook workflows
- Secret detection is critical for preventing credential exposure
- Vulnerability scanning helps maintain secure dependencies
- Security hooks should be part of defense-in-depth strategy
- Database migration hooks ensure migration quality and safety
- Pre-commit hooks validate migration files before commit
- Pre-push hooks test migrations before push
- Post-merge hooks execute migrations after merge
- Database hooks should validate, test, and monitor database operations

---

## Review/Contribution

**Expert**: Sarah Johnson  
**Expertise**: Security (STRIDE, OWASP Top 10)  
**Date**: 2026-01-05  
**Changes**: Enhanced this Git hooks review document by adding a comprehensive "Security Considerations for Git Hooks" section that covers security enforcement in pre-push hooks (secret detection and prevention, dependency vulnerability scanning, code security scanning), security best practices for Git hooks (hook integrity and trust, secure hook execution, access control and permissions), security workflow integration (pre-commit security checks, pre-push security validation, post-receive security monitoring), and security tools integration (secret management, vulnerability scanning, compliance and auditing). This enhancement strengthens the document's security focus and provides practical guidance for implementing security controls in Git hook workflows.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Improved documentation structure by adding a table of contents for easier navigation, enhancing section organization with clearer headings, improving code example formatting with proper syntax highlighting and comments, adding cross-references between related sections, and ensuring consistent formatting throughout. Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This improvement enhances the document's readability and makes it easier for developers to find and understand Git hooks patterns.

**Expert**: Devin Patel  
**Expertise**: DevOps, CI/CD, and Deployment  
**Date**: 2026-01-05  
**Changes**: Enhanced this Git hooks review document by adding a comprehensive "DevOps Best Practices for Git Hooks" section covering CI/CD integration with Git hooks (pre-push hook CI/CD integration with pipeline status checks, local CI/CD simulation with consistent checks, CI/CD pipeline optimization with incremental checks and caching), automated hook management (hook installation automation with setup scripts, hook version management with version control, hook distribution with version-controlled templates), deployment pipeline integration (pre-deployment validation with deployment readiness checks, environment-specific hooks with branch-based configuration, deployment workflow integration with deployment triggers), monitoring and observability for Git hooks (hook execution monitoring with logging and alerting, hook performance metrics with execution duration tracking, hook analytics and reporting with usage statistics), Infrastructure as Code for Git hooks (hook configuration as code with version control, hook template management with reusable templates, hook configuration validation with syntax checking), DevOps tools and technologies (hook management tools like Husky and pre-commit, CI/CD integration tools, monitoring and observability tools), and DevOps workflow best practices (development workflow integration, team collaboration, continuous improvement). This enhancement provides essential DevOps perspective on Git hooks, ensuring that hooks are integrated with CI/CD pipelines, automated, monitored, and managed using DevOps best practices.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this Git hooks review document by adding a comprehensive "Database-Related Git Hooks" section covering pre-commit hooks for database (migration file validation with naming conventions, syntax validation, structure validation, dependency validation, schema change validation with breaking change detection, database script validation with security checks), pre-push hooks for database (migration testing with test database validation, database schema validation with production schema comparison, database backup verification with integrity checks), post-merge hooks for database (migration execution with status checking, database schema synchronization with drift detection, database seed data execution with validation), database hook best practices (migration hook best practices with validation and testing, database schema hook best practices with consistency checking, database security hook best practices with credential validation, database performance hook best practices with monitoring and optimization), and practical examples for each hook type. This enhancement provides essential database perspective on Git hooks, ensuring that database migrations, schema changes, and database operations are validated, tested, and executed safely through Git hooks.

---
