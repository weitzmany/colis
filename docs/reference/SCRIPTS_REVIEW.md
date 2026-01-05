# Scripts Review

This document lists generic/useful scripts found in other projects that could be helpful across multiple projects.

**Last Updated**: 2025-01-05

## Scripts Found in Other Projects

### ✅ Generic/Useful Scripts (Recommended for Review)

These scripts are generic enough to be useful across multiple projects:

#### 1. **Git Workflow Scripts** (games/.cursor/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/scripts/`
- **Files**: `commit.sh`, `push.sh`, `update.sh`, `dev.sh`, `stage.sh`, `main.sh`, `prod.sh`
- **Description**: Shell scripts for git workflow automation (commit, push, update, merge workflows)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - git workflow patterns are universal
- **Notes**: 
  - Well-documented with README.md explaining each script
  - Implements git workflow rules from `.cursor/rules/user/git_workflow.mdc`
  - Generic patterns: commit, push, update, branch merging
  - Can be adapted to any project's branch strategy (development/main, etc.)
  - Scripts use `set -e` for error handling
  - Supports commit message as argument or interactive prompt

#### 2. **Git Hooks Setup Script** (games/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/setup-git-hooks.sh`
- **Description**: Script to install git hooks (pre-push, etc.) into `.git/hooks/`
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - git hooks setup pattern
- **Notes**: 
  - Copies hook templates to `.git/hooks/`
  - Makes hooks executable
  - Simple, reusable pattern for any project

#### 3. **Pre-Push Git Hook** (games/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/pre-push`
- **Description**: Comprehensive pre-push hook that runs CI checks before pushing
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - CI check pattern before push
- **Notes**: 
  - Checks GitHub Actions status (via GitHub CLI or API)
  - Runs frontend checks (lint, typecheck, test, build)
  - Runs backend checks (phpcs, phpstan, phpunit)
  - Runs console/network checks (Playwright)
  - Skips checks for non-main/development branches
  - Can be adapted to any tech stack
  - Pattern is highly reusable

#### 4. **Environment Setup Script** (discord-story-bot/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/scripts/setup-env-vars.sh`
- **Description**: Interactive script to set up environment variables on EC2/remote server
- **Usefulness**: ⭐⭐⭐⭐ Generic pattern for remote environment setup
- **Notes**: 
  - Interactive prompts for environment variables
  - Secure input (hidden password prompts)
  - SSH-based remote setup
  - Pattern reusable for any deployment

#### 5. **Testing Scripts** (games/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/test-auth-endpoints.sh`
- **Description**: Script to test API endpoints (authentication flow)
- **Usefulness**: ⭐⭐⭐⭐ Generic API testing pattern
- **Notes**: 
  - Tests complete authentication flow (register, login, refresh, logout)
  - Uses curl for HTTP requests
  - Color-coded output
  - Extracts and uses tokens from responses
  - Pattern applicable to any API testing

### ⚠️ Project-Specific Scripts (Skip These)

#### 6. **AWS Deployment Scripts** (discord-story-bot/scripts/)
- **Files**: `deploy-to-ec2.sh`, `upload-db-to-ec2.sh`, `download-db-from-ec2.sh`, etc.
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's AWS EC2 deployment setup

#### 7. **Task Management Scripts** (discord-story-bot/scripts/)
- **Files**: `work-on-task.mjs`, `mark-subtasks-complete*.mjs`, `create-batch-edit-tasks.mjs`
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's task management workflow

#### 8. **SSL Certificate Scripts** (games/scripts/)
- **Location**: `/Users/yoavweitzman/Documents/games/scripts/ssl/generate-cert.sh`
- **Reason to Skip**: ⚠️ Specific to games project's SSL setup

#### 9. **CloudFront/Network Diagnostics** (games/scripts/)
- **Files**: `diagnose-cloudfront.sh`, `setup-virtual-domain.sh`
- **Reason to Skip**: ⚠️ Specific to games project's AWS CloudFront setup

#### 10. **CI Local Script** (games/scripts/)
- **File**: `ci-local.sh`
- **Reason to Skip**: ⚠️ Specific to games project's CI setup (can be adapted but very project-specific)

## Recommended Scripts to Consider

Based on the review, here are the most generic and useful scripts:

### Top Priority (Highly Generic):

1. ✅ **Git Workflow Scripts** - Commit, push, update, merge workflows
   - Generic git workflow patterns
   - Well-documented with README
   - Can be adapted to any branch strategy
   - Location: `games/.cursor/scripts/`

2. ✅ **Git Hooks Setup Script** - Install git hooks
   - Simple, reusable pattern
   - Location: `games/scripts/setup-git-hooks.sh`

3. ✅ **Pre-Push Hook** - CI checks before push
   - Comprehensive CI check pattern
   - Can be adapted to any tech stack
   - Location: `games/scripts/pre-push`

### Medium Priority (Useful Patterns):

4. ✅ **Environment Setup Script** - Remote environment variable setup
   - Interactive, secure input pattern
   - Location: `discord-story-bot/scripts/setup-env-vars.sh`

5. ✅ **API Testing Scripts** - Endpoint testing automation
   - Generic API testing pattern
   - Location: `games/scripts/test-auth-endpoints.sh`

## Script Patterns Observed

### Common Patterns:
1. **Bash shebang**: `#!/bin/bash`
2. **Error handling**: `set -e` for immediate exit on error
3. **Colors for output**: ANSI color codes for better UX
4. **Interactive prompts**: `read -p` for user input
5. **Documentation**: Inline comments and README files
6. **Error messages**: Clear, actionable error messages

### Script Organization:
- Git workflow scripts in `.cursor/scripts/` (IDE-integrated)
- Project scripts in `scripts/` directory
- Git hooks in `scripts/` (installed via setup script)
- README files documenting script usage

## Database Operations in Scripts

### Database Script Patterns

1. **Migration Scripts**:
   - SQL migration files for schema changes
   - Version-controlled migration scripts
   - Up and down migration support
   - Transaction-wrapped migrations
   - Rollback capabilities for failed migrations
   - Migration state tracking

2. **Seed Scripts**:
   - Database seeding for test/development data
   - Idempotent seed operations
   - Conditional seeding based on environment
   - Data validation before insertion
   - Foreign key relationship handling
   - Bulk insert optimization

3. **Backup and Restore Scripts**:
   - Automated database backup scripts
   - Point-in-time recovery support
   - Backup rotation and retention
   - Restore verification procedures
   - Backup encryption for sensitive data
   - Scheduled backup automation

### Database Script Best Practices

1. **Connection Management**:
   - Connection pooling in scripts
   - Proper connection cleanup
   - Transaction management
   - Error handling for connection failures
   - Timeout configuration
   - Connection retry logic

2. **Query Optimization**:
   - Use prepared statements (security and performance)
   - Batch operations for multiple records
   - Index-aware queries
   - Query timeout configuration
   - Explain plans for complex queries
   - Avoid N+1 query patterns

3. **Data Integrity**:
   - Transaction boundaries for atomicity
   - Foreign key constraint validation
   - Data type validation
   - Constraint checking before operations
   - Rollback on error
   - Data consistency verification

### Database Script Security

1. **Credential Management**:
   - Environment variables for database credentials
   - Never hardcode passwords in scripts
   - Use secure credential storage (AWS Secrets Manager, etc.)
   - Credential rotation support
   - Least privilege database users
   - Separate credentials per environment

2. **SQL Injection Prevention**:
   - Use parameterized queries exclusively
   - Avoid string concatenation for SQL
   - Input validation and sanitization
   - Use ORM/prepared statements
   - Validate user inputs
   - Escape special characters when necessary

3. **Access Control**:
   - Script-specific database users
   - Minimal required permissions
   - Read-only users for reporting scripts
   - Audit logging for sensitive operations
   - Role-based access in scripts
   - Principle of least privilege

### Database Script Patterns

1. **Schema Management Scripts**:
   ```bash
   # Migration script pattern
   #!/bin/bash
   # Run migrations in order
   for migration in migrations/*.sql; do
     mysql -u user -p database < "$migration"
   done
   ```

2. **Data Seeding Scripts**:
   ```bash
   # Seed script pattern
   #!/bin/bash
   # Seed database with test data
   mysql -u user -p database < seed.sql
   ```

3. **Backup Scripts**:
   ```bash
   # Backup script pattern
   #!/bin/bash
   # Create database backup
   mysqldump -u user -p database > backup_$(date +%Y%m%d).sql
   ```

### Database Script Error Handling

1. **Error Detection**:
   - Check exit codes from database commands
   - Validate query results
   - Monitor for constraint violations
   - Detect connection failures
   - Track migration failures
   - Log database errors

2. **Error Recovery**:
   - Transaction rollback on errors
   - Retry logic for transient errors
   - Graceful degradation
   - Error notification and alerting
   - Partial operation recovery
   - Cleanup on failure

3. **Error Reporting**:
   - Detailed error messages
   - Error logging to files
   - Database error tracking
   - Alerting for critical failures
   - Error summary reports
   - Debugging information

## Notes

- Scripts use modern bash features (should work on macOS/Linux)
- Error handling patterns are consistent (`set -e`)
- Scripts are well-documented with comments
- Most scripts can be adapted to different projects with minimal changes
- Git workflow scripts are particularly well-structured and reusable
- Database scripts require special security considerations
- Connection management is critical for database scripts
- Transaction handling ensures data integrity
- Prepared statements prevent SQL injection vulnerabilities

---

## Review/Contribution

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this scripts review document by adding a comprehensive "Database Operations in Scripts" section that covers database script patterns (migration scripts, seed scripts, backup and restore scripts), database script best practices (connection management, query optimization, data integrity), database script security (credential management, SQL injection prevention, access control), database script patterns (schema management, data seeding, backup), and database script error handling (error detection, error recovery, error reporting). This enhancement provides practical guidance for implementing secure and efficient database operations in automation scripts.

---
