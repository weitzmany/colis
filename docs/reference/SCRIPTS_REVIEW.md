# Scripts Review

This document lists generic/useful scripts found in other projects that could be helpful across multiple projects.

**Last Updated**: 2026-01-05

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

### Advanced Database Script Patterns

1. **Database Health Check Scripts**:
   - Connection health verification
   - Database size monitoring
   - Index fragmentation checks
   - Query performance monitoring
   - Lock detection and resolution
   - Replication lag monitoring
   - Example:
     ```bash
     #!/bin/bash
     # Database health check script
     DB_HOST="${DB_HOST:-localhost}"
     DB_NAME="${DB_NAME:-app_db}"
     
     # Check connection
     if ! mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" "$DB_NAME" > /dev/null 2>&1; then
       echo "❌ Database connection failed"
       exit 1
     fi
     
     # Check database size
     SIZE=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -N -e \
       "SELECT ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'DB Size in MB' \
        FROM information_schema.tables WHERE table_schema='$DB_NAME'")
     echo "✅ Database size: ${SIZE}MB"
     
     # Check for long-running queries
     LONG_QUERIES=$(mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -N -e \
       "SELECT COUNT(*) FROM information_schema.processlist \
        WHERE db='$DB_NAME' AND time > 30")
     if [ "$LONG_QUERIES" -gt 0 ]; then
       echo "⚠️ Warning: $LONG_QUERIES long-running queries detected"
     fi
     ```

2. **Database Maintenance Scripts**:
   - Index optimization (ANALYZE, OPTIMIZE TABLE)
   - Table maintenance (REPAIR, CHECK)
   - Vacuum operations (PostgreSQL)
   - Statistics updates
   - Log rotation
   - Example:
     ```bash
     #!/bin/bash
     # Database maintenance script
     set -e
     
     DB_NAME="${DB_NAME:-app_db}"
     TABLES=$(mysql -u "$DB_USER" -p"$DB_PASS" -N -e \
       "SELECT table_name FROM information_schema.tables \
        WHERE table_schema='$DB_NAME'")
     
     for table in $TABLES; do
       echo "Optimizing table: $table"
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "OPTIMIZE TABLE $table"
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "ANALYZE TABLE $table"
     done
     ```

3. **Database Migration Management Scripts**:
   - Migration runner with state tracking
   - Rollback script with dependency handling
   - Migration validation
   - Migration testing in isolated environments
   - Example:
     ```bash
     #!/bin/bash
     # Advanced migration runner
     set -e
     
     MIGRATIONS_DIR="migrations"
     STATE_FILE=".migration_state"
     
     # Track applied migrations
     get_applied_migrations() {
       [ -f "$STATE_FILE" ] && cat "$STATE_FILE" || echo ""
     }
     
     apply_migration() {
       local migration_file="$1"
       local migration_name=$(basename "$migration_file" .sql)
       
       echo "Applying migration: $migration_name"
       
       # Start transaction
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       START TRANSACTION;
       SOURCE $migration_file;
       COMMIT;
       EOF
       
       # Record applied migration
       echo "$migration_name" >> "$STATE_FILE"
       echo "✅ Migration applied: $migration_name"
     }
     
     # Run pending migrations
     for migration in "$MIGRATIONS_DIR"/*.sql; do
       migration_name=$(basename "$migration" .sql)
       if ! grep -q "$migration_name" "$STATE_FILE" 2>/dev/null; then
         apply_migration "$migration"
       fi
     done
     ```

4. **Database Performance Monitoring Scripts**:
   - Slow query log analysis
   - Index usage statistics
   - Table statistics collection
   - Query plan analysis
   - Performance baseline tracking
   - Example:
     ```bash
     #!/bin/bash
     # Database performance monitoring
     
     # Analyze slow queries
     analyze_slow_queries() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT 
         sql_text,
         exec_count,
         avg_timer_wait/1000000000000 as avg_time_sec,
         sum_timer_wait/1000000000000 as total_time_sec
       FROM performance_schema.events_statements_summary_by_digest
       ORDER BY sum_timer_wait DESC
       LIMIT 10;
       EOF
     }
     
     # Check index usage
     check_index_usage() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT 
         table_name,
         index_name,
         seq_in_index,
         column_name,
         cardinality
       FROM information_schema.statistics
       WHERE table_schema = '$DB_NAME'
       ORDER BY table_name, index_name, seq_in_index;
       EOF
     }
     ```

5. **Database Data Validation Scripts**:
   - Referential integrity checks
   - Data quality validation
   - Constraint verification
   - Orphaned record detection
   - Data consistency checks
   - Example:
     ```bash
     #!/bin/bash
     # Database data validation script
     
     # Check referential integrity
     check_foreign_keys() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT 
         TABLE_NAME,
         CONSTRAINT_NAME,
         COLUMN_NAME,
         REFERENCED_TABLE_NAME,
         REFERENCED_COLUMN_NAME
       FROM information_schema.KEY_COLUMN_USAGE
       WHERE TABLE_SCHEMA = '$DB_NAME'
         AND REFERENCED_TABLE_NAME IS NOT NULL;
       EOF
     }
     
     # Find orphaned records
     find_orphaned_records() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT o.id, o.user_id
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE u.id IS NULL;
       EOF
     }
     ```

6. **Database Replication Scripts**:
   - Replication status monitoring
   - Replication lag detection
   - Master-slave synchronization
   - Replication failover procedures
   - Example:
     ```bash
     #!/bin/bash
     # Replication status check
     
     check_replication_status() {
       mysql -u "$DB_USER" -p"$DB_PASS" -h "$SLAVE_HOST" <<EOF
       SHOW SLAVE STATUS\G
       EOF
     }
     
     # Check replication lag
     check_replication_lag() {
       mysql -u "$DB_USER" -p"$DB_PASS" -h "$SLAVE_HOST" <<EOF
       SELECT 
         TIMESTAMPDIFF(SECOND, 
           (SELECT MAX(ts) FROM replication_log), 
           NOW()) as lag_seconds;
       EOF
     }
     ```

### Database Script Testing Patterns

1. **Test Database Setup Scripts**:
   - Isolated test database creation
   - Test data seeding
   - Test environment cleanup
   - Database snapshot/restore for tests
   - Example:
     ```bash
     #!/bin/bash
     # Test database setup
     
     TEST_DB="app_test_db"
     
     # Create test database
     mysql -u root -p <<EOF
     DROP DATABASE IF EXISTS $TEST_DB;
     CREATE DATABASE $TEST_DB;
     USE $TEST_DB;
     SOURCE schema.sql;
     SOURCE seed_test_data.sql;
     EOF
     ```

2. **Database Script Unit Testing**:
   - Test migration scripts
   - Test data transformation scripts
   - Test backup/restore procedures
   - Test rollback scenarios
   - Example:
     ```bash
     #!/bin/bash
     # Test migration script
     
     test_migration() {
       local migration_file="$1"
       
       # Create test database
       mysql -u root -p <<EOF
       CREATE DATABASE test_migration_db;
       USE test_migration_db;
       SOURCE $migration_file;
       EOF
       
       # Verify migration
       if [ $? -eq 0 ]; then
         echo "✅ Migration test passed"
         mysql -u root -p -e "DROP DATABASE test_migration_db"
       else
         echo "❌ Migration test failed"
         exit 1
       fi
     }
     ```

### Database Script Performance Optimization

1. **Bulk Operation Scripts**:
   - Batch insert optimization
   - Bulk update strategies
   - Chunked processing for large datasets
   - Parallel processing where safe
   - Example:
     ```bash
     #!/bin/bash
     # Bulk insert with batching
     
     BATCH_SIZE=1000
     TOTAL_RECORDS=10000
     
     for ((i=0; i<$TOTAL_RECORDS; i+=$BATCH_SIZE)); do
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       INSERT INTO users (name, email) VALUES
       $(for ((j=0; j<$BATCH_SIZE; j++)); do
         echo "('User $((i+j))', 'user$((i+j))@example.com'),"
       done | sed 's/,$//')
       EOF
     done
     ```

2. **Query Optimization Scripts**:
   - EXPLAIN plan analysis
   - Index recommendation
   - Query rewriting suggestions
   - Statistics collection
   - Example:
     ```bash
     #!/bin/bash
     # Query optimization analysis
     
     analyze_query() {
       local query="$1"
       
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       EXPLAIN $query;
       EOF
     }
     
     # Suggest indexes
     suggest_indexes() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT 
         table_name,
         column_name,
         cardinality
       FROM information_schema.statistics
       WHERE table_schema = '$DB_NAME'
         AND cardinality < 100
       ORDER BY cardinality;
       EOF
     }
     ```

### Database Script Checklist

When creating database scripts, ensure:

- [ ] **Connection Management**: Proper connection handling, pooling, cleanup
- [ ] **Security**: Credentials from environment, parameterized queries, least privilege
- [ ] **Error Handling**: Transaction rollback, error detection, logging
- [ ] **Data Integrity**: Transaction boundaries, constraint validation, consistency checks
- [ ] **Performance**: Query optimization, batch operations, index awareness
- [ ] **Testing**: Test scripts in isolated environments, validate results
- [ ] **Documentation**: Document script purpose, parameters, dependencies
- [ ] **Idempotency**: Scripts can be run multiple times safely
- [ ] **Rollback**: Ability to undo changes when possible
- [ ] **Monitoring**: Logging, alerting, performance tracking

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

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Further enhanced this scripts review document by adding advanced database script patterns and implementation guidance including: advanced database script patterns (database health check scripts with connection verification, size monitoring, and performance checks, database maintenance scripts with index optimization and table maintenance, database migration management scripts with state tracking and rollback capabilities, database performance monitoring scripts with slow query analysis and index usage statistics, database data validation scripts with referential integrity checks and orphaned record detection, database replication scripts with replication status monitoring and lag detection), database script testing patterns (test database setup scripts with isolated test environments, database script unit testing with migration testing and rollback scenarios), database script performance optimization (bulk operation scripts with batch insert optimization and chunked processing, query optimization scripts with EXPLAIN plan analysis and index recommendations), and a comprehensive database script checklist covering connection management, security, error handling, data integrity, performance, testing, documentation, idempotency, rollback, and monitoring. Also fixed the date from 2025-01-05 to 2026-01-05. This addition provides advanced, production-ready database script patterns with complete code examples for health checks, maintenance, migration management, performance monitoring, data validation, replication, testing, and optimization, ensuring database scripts are robust, secure, and performant.

---
