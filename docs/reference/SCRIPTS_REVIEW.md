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

## Script Architecture and Infrastructure Patterns

### Script Architecture Principles

1. **Modularity and Reusability**
   - Design scripts as composable modules
   - Separate concerns (validation, execution, reporting)
   - Create reusable utility functions
   - Follow DRY (Don't Repeat Yourself) principles
   - Example:
     ```bash
     #!/bin/bash
     # Modular script architecture
     
     # Utility functions (can be sourced from separate file)
     source "$(dirname "$0")/lib/utils.sh"
     source "$(dirname "$0")/lib/logging.sh"
     source "$(dirname "$0")/lib/validation.sh"
     
     # Main script logic
     main() {
       validate_environment
       execute_operation
       report_results
     }
     
     main "$@"
     ```

2. **Layered Architecture for Scripts**
   - **Presentation Layer**: User interaction, output formatting
   - **Business Logic Layer**: Core operations, validation
   - **Data Access Layer**: Database, file system, API interactions
   - **Infrastructure Layer**: Logging, error handling, configuration
   - Example:
     ```bash
     #!/bin/bash
     # Layered script architecture
     
     # Infrastructure layer
     log_info() { echo "[INFO] $*" >&2; }
     log_error() { echo "[ERROR] $*" >&2; }
     
     # Data access layer
     db_query() {
       local query="$1"
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$query"
     }
     
     # Business logic layer
     validate_user() {
       local user_id="$1"
       local count=$(db_query "SELECT COUNT(*) FROM users WHERE id=$user_id")
       [ "$count" -eq 1 ]
     }
     
     # Presentation layer
     display_user_info() {
       local user_id="$1"
       if validate_user "$user_id"; then
         log_info "User $user_id is valid"
         db_query "SELECT * FROM users WHERE id=$user_id"
       else
         log_error "User $user_id not found"
         return 1
       fi
     }
     ```

3. **Service-Oriented Script Architecture**
   - Organize scripts as independent services
   - Define clear interfaces between scripts
   - Use message passing or shared state
   - Enable script composition and orchestration
   - Example:
     ```bash
     #!/bin/bash
     # Service-oriented script architecture
     
     # Script service interface
     SCRIPT_SERVICES_DIR="${SCRIPT_SERVICES_DIR:-./services}"
     
     # Service discovery
     list_services() {
       find "$SCRIPT_SERVICES_DIR" -name "*.sh" -type f | sort
     }
     
     # Service execution
     execute_service() {
       local service_name="$1"
       shift
       local service_script="$SCRIPT_SERVICES_DIR/${service_name}.sh"
       
       if [ -f "$service_script" ]; then
         bash "$service_script" "$@"
       else
         echo "Service not found: $service_name" >&2
         return 1
       fi
     }
     
     # Service orchestration
     deploy_application() {
       execute_service "validate_environment"
       execute_service "run_tests"
       execute_service "build_application"
       execute_service "deploy_to_staging"
       execute_service "run_integration_tests"
       execute_service "deploy_to_production"
     }
     ```

### Script Infrastructure Architecture

1. **Script Execution Environment**
   - **Containerization**: Run scripts in containers for consistency
   - **Virtual Environments**: Isolate script dependencies
   - **Execution Context**: Define runtime environment clearly
   - **Resource Limits**: Set CPU, memory, disk limits
   - Example:
     ```bash
     #!/bin/bash
     # Script execution environment setup
     
     # Container-based execution
     run_in_container() {
       local script="$1"
       shift
       docker run --rm \
         -v "$(pwd):/workspace" \
         -w /workspace \
         -e DB_HOST \
         -e DB_USER \
         -e DB_PASS \
         script-runner:latest \
         bash "$script" "$@"
     }
     
     # Resource-limited execution
     run_with_limits() {
       local script="$1"
       shift
       ulimit -t 300  # CPU time limit (5 minutes)
       ulimit -v 1048576  # Memory limit (1GB)
       bash "$script" "$@"
     }
     ```

2. **Script Configuration Management**
   - **Environment-Based Configuration**: Different configs per environment
   - **Configuration Files**: Centralized configuration management
   - **Secret Management**: Secure credential storage
   - **Configuration Validation**: Verify configuration before execution
   - Example:
     ```bash
     #!/bin/bash
     # Script configuration management
     
     # Load configuration
     load_config() {
       local env="${ENVIRONMENT:-development}"
       local config_file="config/${env}.sh"
       
       if [ -f "$config_file" ]; then
         source "$config_file"
       else
         echo "Configuration file not found: $config_file" >&2
         exit 1
       fi
     }
     
     # Validate configuration
     validate_config() {
       local required_vars=("DB_HOST" "DB_USER" "DB_PASS" "DB_NAME")
       
       for var in "${required_vars[@]}"; do
         if [ -z "${!var}" ]; then
           echo "Required configuration missing: $var" >&2
           exit 1
         fi
       done
     }
     
     # Load and validate
     load_config
     validate_config
     ```

3. **Script Dependency Management**
   - **Dependency Declaration**: Document script dependencies
   - **Dependency Resolution**: Check and install dependencies
   - **Version Management**: Pin dependency versions
   - **Dependency Isolation**: Isolate script dependencies
   - Example:
     ```bash
     #!/bin/bash
     # Script dependency management
     
     # Dependency declaration
     declare -A SCRIPT_DEPS=(
       ["jq"]="1.6"
       ["curl"]="7.0"
       ["mysql"]="8.0"
     )
     
     # Check dependencies
     check_dependencies() {
       local missing_deps=()
       
       for dep in "${!SCRIPT_DEPS[@]}"; do
         if ! command -v "$dep" &> /dev/null; then
           missing_deps+=("$dep")
         fi
       done
       
       if [ ${#missing_deps[@]} -gt 0 ]; then
         echo "Missing dependencies: ${missing_deps[*]}" >&2
         return 1
       fi
     }
     
     # Install dependencies (if possible)
     install_dependencies() {
       if command -v brew &> /dev/null; then
         brew install "${!SCRIPT_DEPS[@]}"
       elif command -v apt-get &> /dev/null; then
         sudo apt-get install -y "${!SCRIPT_DEPS[@]}"
       else
         echo "Package manager not found" >&2
         return 1
       fi
     }
     ```

### Script Scalability Architecture

1. **Horizontal Scaling for Scripts**
   - **Parallel Execution**: Run scripts in parallel when safe
   - **Distributed Execution**: Execute scripts across multiple machines
   - **Load Distribution**: Distribute script execution load
   - **Fault Tolerance**: Handle script failures gracefully
   - Example:
     ```bash
     #!/bin/bash
     # Parallel script execution
     
     # Parallel execution with job control
     run_parallel() {
       local max_jobs="${MAX_PARALLEL_JOBS:-4}"
       local pids=()
       
       for script in "$@"; do
         while [ ${#pids[@]} -ge "$max_jobs" ]; do
           for pid in "${pids[@]}"; do
             if ! kill -0 "$pid" 2>/dev/null; then
               pids=("${pids[@]/$pid}")
             fi
           done
           sleep 0.1
         done
         
         bash "$script" &
         pids+=($!)
       done
       
       # Wait for all jobs
       wait
     }
     ```

2. **Script Caching and State Management**
   - **Result Caching**: Cache script execution results
   - **State Persistence**: Save script state between runs
   - **Incremental Execution**: Only process changed data
   - **Cache Invalidation**: Clear cache when needed
   - Example:
     ```bash
     #!/bin/bash
     # Script caching and state management
     
     CACHE_DIR="${CACHE_DIR:-.cache}"
     mkdir -p "$CACHE_DIR"
     
     # Cache key generation
     cache_key() {
       echo "$1" | sha256sum | cut -d' ' -f1
     }
     
     # Check cache
     check_cache() {
       local key=$(cache_key "$1")
       local cache_file="$CACHE_DIR/$key"
       
       if [ -f "$cache_file" ]; then
         cat "$cache_file"
         return 0
       fi
       return 1
     }
     
     # Store in cache
     store_cache() {
       local key=$(cache_key "$1")
       local value="$2"
       echo "$value" > "$CACHE_DIR/$key"
     }
     
     # Cached execution
     cached_execution() {
       local command="$1"
       local result
       
       if result=$(check_cache "$command"); then
         echo "Cache hit: $command"
         echo "$result"
       else
         echo "Cache miss: $command"
         result=$(eval "$command")
         store_cache "$command" "$result"
         echo "$result"
       fi
     }
     ```

3. **Script Queue and Job Management**
   - **Job Queue**: Queue script execution jobs
   - **Priority Management**: Prioritize important scripts
   - **Retry Logic**: Retry failed scripts
   - **Job Scheduling**: Schedule script execution
   - Example:
     ```bash
     #!/bin/bash
     # Script job queue management
     
     QUEUE_DIR="${QUEUE_DIR:-.queue}"
     mkdir -p "$QUEUE_DIR"
     
     # Enqueue job
     enqueue_job() {
       local script="$1"
       local priority="${2:-5}"
       local job_id=$(date +%s%N)
       
       echo "$priority|$script" > "$QUEUE_DIR/$job_id"
     }
     
     # Process queue
     process_queue() {
       local jobs=($(ls -t "$QUEUE_DIR" | sort -t'|' -k1 -n))
       
       for job_file in "${jobs[@]}"; do
         IFS='|' read -r priority script < "$QUEUE_DIR/$job_file"
         echo "Executing: $script (priority: $priority)"
         bash "$script"
         rm "$QUEUE_DIR/$job_file"
       done
     }
     ```

### Script Deployment Architecture

1. **Script Deployment Patterns**
   - **Blue-Green Deployment**: Deploy scripts without downtime
   - **Canary Deployment**: Gradual script rollout
   - **Rolling Deployment**: Update scripts incrementally
   - **Version Management**: Track script versions
   - Example:
     ```bash
     #!/bin/bash
     # Script version management
     
     SCRIPT_VERSION="${SCRIPT_VERSION:-1.0.0}"
     SCRIPT_DIR="${SCRIPT_DIR:-./scripts}"
     
     # Versioned script execution
     execute_versioned_script() {
       local script_name="$1"
       local version="${2:-latest}"
       local script_path="$SCRIPT_DIR/$script_name/$version.sh"
       
       if [ -f "$script_path" ]; then
         bash "$script_path"
       else
         echo "Script version not found: $script_name/$version" >&2
         return 1
       fi
     }
     
     # Rollback to previous version
     rollback_script() {
       local script_name="$1"
       local current_version=$(get_current_version "$script_name")
       local previous_version=$(get_previous_version "$script_name")
       
       if [ -n "$previous_version" ]; then
         execute_versioned_script "$script_name" "$previous_version"
       else
         echo "No previous version found" >&2
         return 1
       fi
     }
     ```

2. **Script Monitoring and Observability**
   - **Execution Logging**: Log script execution details
   - **Performance Metrics**: Track script performance
   - **Error Tracking**: Monitor script errors
   - **Health Checks**: Verify script health
   - Example:
     ```bash
     #!/bin/bash
     # Script monitoring and observability
     
     # Execution logging
     log_execution() {
       local script_name="$1"
       local start_time="$2"
       local end_time="$3"
       local exit_code="$4"
       local duration=$((end_time - start_time))
       
       echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | $script_name | $duration | $exit_code" >> execution.log
     }
     
     # Performance metrics
     track_performance() {
       local script_name="$1"
       local start_time=$(date +%s)
       
       # Execute script
       "$@"
       local exit_code=$?
       
       local end_time=$(date +%s)
       log_execution "$script_name" "$start_time" "$end_time" "$exit_code"
       
       return $exit_code
     }
     
     # Health check
     health_check() {
       local script_name="$1"
       local last_execution=$(tail -1 execution.log | cut -d'|' -f1)
       local current_time=$(date +%s)
       local time_since_execution=$((current_time - last_execution))
       
       if [ "$time_since_execution" -gt 3600 ]; then
         echo "Health check failed: Script not executed in last hour"
         return 1
       fi
       
       return 0
     }
     ```

### Script Security Architecture

1. **Script Access Control**
   - **Authentication**: Verify script execution permissions
   - **Authorization**: Control script access levels
   - **Audit Logging**: Log script access attempts
   - **Role-Based Access**: Assign roles to scripts
   - Example:
     ```bash
     #!/bin/bash
     # Script access control
     
     # Check execution permissions
     check_permissions() {
       local script="$1"
       local user=$(whoami)
       
       # Check if user has permission to execute
       if ! grep -q "$user" "$SCRIPT_PERMISSIONS_FILE" 2>/dev/null; then
         echo "Permission denied: $user cannot execute $script" >&2
         return 1
       fi
       
       return 0
     }
     
     # Audit logging
     audit_log() {
       local script="$1"
       local user=$(whoami)
       local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
       
       echo "$timestamp | $user | $script | $*" >> audit.log
     }
     ```

2. **Script Input Validation Architecture**
   - **Input Sanitization**: Clean script inputs
   - **Input Validation**: Validate script parameters
   - **Boundary Checking**: Check input boundaries
   - **Type Validation**: Verify input types
   - Example:
     ```bash
     #!/bin/bash
     # Script input validation architecture
     
     # Input sanitization
     sanitize_input() {
       local input="$1"
       # Remove dangerous characters
       echo "$input" | sed 's/[;&|`$()]//g'
     }
     
     # Input validation
     validate_input() {
       local input="$1"
       local pattern="$2"
       
       if [[ ! "$input" =~ $pattern ]]; then
         echo "Invalid input: $input" >&2
         return 1
       fi
       
       return 0
     }
     
     # Validate script parameters
     validate_script_params() {
       local user_id="$1"
       
       # Sanitize
       user_id=$(sanitize_input "$user_id")
       
       # Validate (numeric ID)
       if ! validate_input "$user_id" '^[0-9]+$'; then
         return 1
       fi
       
       # Boundary check
       if [ "$user_id" -lt 1 ] || [ "$user_id" -gt 1000000 ]; then
         echo "User ID out of range: $user_id" >&2
         return 1
       fi
       
       return 0
     }
     ```

### Script Integration Architecture

1. **Script API Architecture**
   - **RESTful Script Interface**: Expose scripts via REST API
   - **Script Orchestration**: Coordinate multiple scripts
   - **Event-Driven Scripts**: Trigger scripts on events
   - **Message Queue Integration**: Integrate with message queues
   - Example:
     ```bash
     #!/bin/bash
     # Script API architecture
     
     # RESTful script endpoint
     script_api() {
       local method="$1"
       local endpoint="$2"
       shift 2
       
       case "$method" in
         GET)
           case "$endpoint" in
             /scripts)
               list_scripts
               ;;
             /scripts/*)
               get_script_status "${endpoint#/scripts/}"
               ;;
             *)
               echo "404 Not Found" >&2
               return 1
               ;;
           esac
           ;;
         POST)
           case "$endpoint" in
             /scripts/execute)
               execute_script "$@"
               ;;
             *)
               echo "404 Not Found" >&2
               return 1
               ;;
           esac
           ;;
         *)
           echo "405 Method Not Allowed" >&2
           return 1
           ;;
       esac
     }
     ```

2. **Script Event Architecture**
   - **Event Listeners**: Listen for events
   - **Event Handlers**: Handle events with scripts
   - **Event Publishing**: Publish script events
   - **Event Routing**: Route events to scripts
   - Example:
     ```bash
     #!/bin/bash
     # Script event architecture
     
     # Event listener
     listen_for_events() {
       local event_type="$1"
       local script="$2"
       
       while read -r event; do
         if echo "$event" | grep -q "$event_type"; then
           bash "$script" "$event"
         fi
       done
     }
     
     # Event handler
     handle_event() {
       local event="$1"
       local event_type=$(echo "$event" | jq -r '.type')
       local handler_script="handlers/${event_type}.sh"
       
       if [ -f "$handler_script" ]; then
         bash "$handler_script" "$event"
       else
         echo "No handler for event type: $event_type" >&2
       fi
     }
     ```

### Script Architecture Best Practices

1. **Separation of Concerns**
   - Separate configuration from logic
   - Separate validation from execution
   - Separate logging from business logic
   - Use functions for reusable operations

2. **Error Handling Architecture**
   - Implement comprehensive error handling
   - Use exit codes consistently
   - Log errors appropriately
   - Provide meaningful error messages

3. **Testing Architecture**
   - Unit test script functions
   - Integration test script workflows
   - Test error scenarios
   - Test edge cases

4. **Documentation Architecture**
   - Document script purpose and usage
   - Document parameters and options
   - Document dependencies
   - Document examples

5. **Version Control Architecture**
   - Version control all scripts
   - Tag script versions
   - Document changes in changelog
   - Use semantic versioning

### Script Architecture Checklist

When designing script architecture, ensure:

- [ ] **Modularity**: Scripts are modular and reusable
- [ ] **Scalability**: Scripts can scale horizontally
- [ ] **Security**: Scripts implement security best practices
- [ ] **Monitoring**: Scripts are observable and monitorable
- [ ] **Testing**: Scripts are testable
- [ ] **Documentation**: Scripts are well-documented
- [ ] **Deployment**: Scripts have deployment strategy
- [ ] **Error Handling**: Scripts handle errors gracefully
- [ ] **Configuration**: Scripts use external configuration
- [ ] **Dependencies**: Script dependencies are managed

## Database-Specific Script Execution Considerations

### Database Connection Management in Scripts

When executing database operations in scripts, proper connection management is critical for performance, reliability, and resource efficiency.

#### Connection Pooling Patterns

1. **Persistent Connection Management**:
   - Reuse database connections across script operations
   - Implement connection pooling for high-volume scripts
   - Monitor connection pool usage and limits
   - Example:
     ```bash
     #!/bin/bash
     # Database connection pooling in scripts
     
     # Connection pool configuration
     MAX_CONNECTIONS="${MAX_CONNECTIONS:-10}"
     CONNECTION_TIMEOUT="${CONNECTION_TIMEOUT:-30}"
     
     # Connection pool management
     get_connection() {
       local pool_file=".db_connection_pool"
       local available_connections=$(cat "$pool_file" 2>/dev/null | wc -l)
       
       if [ "$available_connections" -lt "$MAX_CONNECTIONS" ]; then
         # Create new connection
         local conn_id=$(date +%s%N)
         echo "$conn_id" >> "$pool_file"
         echo "$conn_id"
       else
         # Wait for available connection
         while [ "$(cat "$pool_file" 2>/dev/null | wc -l)" -ge "$MAX_CONNECTIONS" ]; do
           sleep 0.1
         done
         get_connection
       fi
     }
     
     release_connection() {
       local conn_id="$1"
       local pool_file=".db_connection_pool"
       sed -i "/^$conn_id$/d" "$pool_file"
     }
     ```

2. **Connection Lifecycle Management**:
   - Establish connections at script start
   - Reuse connections for multiple operations
   - Close connections at script end
   - Handle connection failures gracefully
   - Example:
     ```bash
     #!/bin/bash
     # Connection lifecycle management
     
     # Initialize database connection
     init_db_connection() {
       export DB_CONNECTION_STRING="mysql://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}"
       export DB_CONNECTION_ACTIVE=1
       
       # Test connection
       if ! mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" "$DB_NAME" > /dev/null 2>&1; then
         echo "Failed to establish database connection" >&2
         export DB_CONNECTION_ACTIVE=0
         return 1
       fi
       
       echo "Database connection established"
     }
     
     # Cleanup database connection
     cleanup_db_connection() {
       if [ "${DB_CONNECTION_ACTIVE:-0}" -eq 1 ]; then
         # Close any open connections
         unset DB_CONNECTION_STRING
         export DB_CONNECTION_ACTIVE=0
         echo "Database connection closed"
       fi
     }
     
     # Trap to ensure cleanup on script exit
     trap cleanup_db_connection EXIT
     
     # Initialize at start
     init_db_connection
     ```

3. **Connection Retry Logic**:
   - Implement exponential backoff for connection retries
   - Handle transient connection failures
   - Set maximum retry attempts
   - Log retry attempts for monitoring
   - Example:
     ```bash
     #!/bin/bash
     # Connection retry logic
     
     connect_with_retry() {
       local max_attempts="${MAX_RETRY_ATTEMPTS:-5}"
       local base_delay="${BASE_RETRY_DELAY:-1}"
       local attempt=1
       
       while [ $attempt -le $max_attempts ]; do
         if mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASS" -e "SELECT 1" "$DB_NAME" > /dev/null 2>&1; then
           echo "Database connection successful (attempt $attempt)"
           return 0
         fi
         
         if [ $attempt -lt $max_attempts ]; then
           local delay=$((base_delay * (2 ** (attempt - 1))))
           echo "Connection failed (attempt $attempt/$max_attempts), retrying in ${delay}s..."
           sleep $delay
         fi
         
         attempt=$((attempt + 1))
       done
       
       echo "Failed to connect after $max_attempts attempts" >&2
       return 1
     }
     ```

#### Transaction Management Patterns

1. **Explicit Transaction Control**:
   - Use explicit BEGIN/COMMIT/ROLLBACK for critical operations
   - Wrap related operations in single transactions
   - Implement savepoints for partial rollbacks
   - Example:
     ```bash
     #!/bin/bash
     # Explicit transaction management
     
     execute_transaction() {
       local operations_file="$1"
       
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       START TRANSACTION;
       
       -- Execute operations from file
       SOURCE $operations_file;
       
       -- Commit if successful
       COMMIT;
       EOF
       
       if [ $? -ne 0 ]; then
         echo "Transaction failed, rolling back..." >&2
         mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "ROLLBACK;"
         return 1
       fi
       
       return 0
     }
     ```

2. **Nested Transaction Support**:
   - Use savepoints for nested transaction-like behavior
   - Implement transaction nesting levels
   - Handle savepoint rollbacks
   - Example:
     ```bash
     #!/bin/bash
     # Nested transaction support with savepoints
     
     TRANSACTION_LEVEL=0
     
     begin_transaction() {
       TRANSACTION_LEVEL=$((TRANSACTION_LEVEL + 1))
       local savepoint_name="sp_${TRANSACTION_LEVEL}"
       
       if [ $TRANSACTION_LEVEL -eq 1 ]; then
         mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "START TRANSACTION;"
       else
         mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "SAVEPOINT $savepoint_name;"
       fi
       
       echo "$savepoint_name"
     }
     
     rollback_to_savepoint() {
       local savepoint_name="$1"
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "ROLLBACK TO SAVEPOINT $savepoint_name;"
     }
     
     commit_transaction() {
       if [ $TRANSACTION_LEVEL -eq 1 ]; then
         mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "COMMIT;"
       fi
       TRANSACTION_LEVEL=$((TRANSACTION_LEVEL - 1))
     }
     ```

3. **Long-Running Transaction Management**:
   - Monitor transaction duration
   - Implement transaction timeouts
   - Handle lock timeouts gracefully
   - Break large transactions into smaller chunks
   - Example:
     ```bash
     #!/bin/bash
     # Long-running transaction management
     
     TRANSACTION_TIMEOUT="${TRANSACTION_TIMEOUT:-300}"  # 5 minutes
     
     execute_with_timeout() {
       local query="$1"
       local start_time=$(date +%s)
       
       # Set transaction timeout
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SET SESSION innodb_lock_wait_timeout = $TRANSACTION_TIMEOUT;
       SET SESSION max_execution_time = $((TRANSACTION_TIMEOUT * 1000));
       
       START TRANSACTION;
       $query
       COMMIT;
       EOF
       
       local end_time=$(date +%s)
       local duration=$((end_time - start_time))
       
       if [ $duration -gt $TRANSACTION_TIMEOUT ]; then
         echo "Warning: Transaction exceeded timeout threshold" >&2
       fi
       
       return $?
     }
     ```

### Database Performance Monitoring in Scripts

#### Query Performance Tracking

1. **Slow Query Detection**:
   - Monitor query execution time
   - Log slow queries for analysis
   - Set performance thresholds
   - Example:
     ```bash
     #!/bin/bash
     # Slow query detection
     
     SLOW_QUERY_THRESHOLD="${SLOW_QUERY_THRESHOLD:-1.0}"  # seconds
     
     execute_with_timing() {
       local query="$1"
       local start_time=$(date +%s.%N)
       
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$query" > /dev/null
       local exit_code=$?
       
       local end_time=$(date +%s.%N)
       local duration=$(echo "$end_time - $start_time" | bc)
       
       if (( $(echo "$duration > $SLOW_QUERY_THRESHOLD" | bc -l) )); then
         echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | SLOW QUERY | ${duration}s | $query" >> slow_queries.log
       fi
       
       return $exit_code
     }
     ```

2. **Query Plan Analysis**:
   - Analyze query execution plans
   - Detect full table scans
   - Identify missing indexes
   - Example:
     ```bash
     #!/bin/bash
     # Query plan analysis
     
     analyze_query_plan() {
       local query="$1"
       
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "EXPLAIN $query" | while read -r line; do
         if echo "$line" | grep -q "ALL\|Full table scan"; then
           echo "WARNING: Full table scan detected in query plan" >&2
           echo "Query: $query" >&2
         fi
       done
     }
     ```

#### Database Resource Monitoring

1. **Connection Pool Monitoring**:
   - Track active connections
   - Monitor connection pool usage
   - Alert on connection pool exhaustion
   - Example:
     ```bash
     #!/bin/bash
     # Connection pool monitoring
     
     monitor_connections() {
       local max_connections=$(mysql -u "$DB_USER" -p"$DB_PASS" -N -e \
         "SHOW VARIABLES LIKE 'max_connections'" | awk '{print $2}')
       local current_connections=$(mysql -u "$DB_USER" -p"$DB_PASS" -N -e \
         "SHOW STATUS LIKE 'Threads_connected'" | awk '{print $2}')
       local connection_usage=$(echo "scale=2; $current_connections * 100 / $max_connections" | bc)
       
       echo "Connection pool usage: ${connection_usage}% ($current_connections/$max_connections)"
       
       if (( $(echo "$connection_usage > 80" | bc -l) )); then
         echo "WARNING: Connection pool usage exceeds 80%" >&2
       fi
     }
     ```

2. **Database Lock Monitoring**:
   - Detect and report database locks
   - Identify long-running transactions holding locks
   - Monitor lock wait times
   - Example:
     ```bash
     #!/bin/bash
     # Database lock monitoring
     
     check_locks() {
       mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<EOF
       SELECT 
         r.trx_id waiting_trx_id,
         r.trx_mysql_thread_id waiting_thread,
         r.trx_query waiting_query,
         b.trx_id blocking_trx_id,
         b.trx_mysql_thread_id blocking_thread,
         b.trx_query blocking_query
       FROM information_schema.innodb_lock_waits w
       INNER JOIN information_schema.innodb_trx b ON b.trx_id = w.blocking_trx_id
       INNER JOIN information_schema.innodb_trx r ON r.trx_id = w.requesting_trx_id;
       EOF
     }
     ```

### Database Script Error Recovery Patterns

#### Automatic Error Recovery

1. **Transient Error Handling**:
   - Identify transient database errors
   - Implement automatic retry for transient errors
   - Use exponential backoff for retries
   - Example:
     ```bash
     #!/bin/bash
     # Transient error recovery
     
     is_transient_error() {
       local error="$1"
       # Common transient errors: connection lost, lock wait timeout, deadlock
       echo "$error" | grep -qiE "connection lost|lock wait timeout|deadlock|temporary failure"
     }
     
     execute_with_retry() {
       local query="$1"
       local max_retries="${MAX_RETRIES:-3}"
       local attempt=1
       
       while [ $attempt -le $max_retries ]; do
         local result=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$query" 2>&1)
         local exit_code=$?
         
         if [ $exit_code -eq 0 ]; then
           echo "$result"
           return 0
         fi
         
         if is_transient_error "$result" && [ $attempt -lt $max_retries ]; then
           local delay=$((2 ** (attempt - 1)))
           echo "Transient error detected, retrying in ${delay}s (attempt $attempt/$max_retries)..." >&2
           sleep $delay
           attempt=$((attempt + 1))
         else
           echo "Error: $result" >&2
           return $exit_code
         fi
       done
       
       return 1
     }
     ```

2. **Deadlock Detection and Recovery**:
   - Detect deadlock errors
   - Automatically retry on deadlock
   - Log deadlock occurrences
   - Example:
     ```bash
     #!/bin/bash
     # Deadlock detection and recovery
     
     handle_deadlock() {
       local query="$1"
       local max_deadlock_retries="${MAX_DEADLOCK_RETRIES:-5}"
       local attempt=1
       
       while [ $attempt -le $max_deadlock_retries ]; do
         local result=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$query" 2>&1)
         local exit_code=$?
         
         if [ $exit_code -eq 0 ]; then
           return 0
         fi
         
         if echo "$result" | grep -qi "deadlock"; then
           echo "Deadlock detected (attempt $attempt/$max_deadlock_retries), retrying..." >&2
           echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) | DEADLOCK | $query" >> deadlocks.log
           sleep $((RANDOM % 3 + 1))  # Random delay to avoid retry collision
           attempt=$((attempt + 1))
         else
           echo "Error: $result" >&2
           return $exit_code
         fi
       done
       
       echo "Failed after $max_deadlock_retries deadlock retries" >&2
       return 1
     }
     ```

### Database Script Security Enhancements

#### Credential Rotation Support

1. **Dynamic Credential Loading**:
   - Load credentials from secure storage
   - Support credential rotation without script changes
   - Cache credentials with expiration
   - Example:
     ```bash
     #!/bin/bash
     # Dynamic credential loading
     
     CREDENTIAL_CACHE_FILE=".db_credentials_cache"
     CREDENTIAL_CACHE_TTL="${CREDENTIAL_CACHE_TTL:-3600}"  # 1 hour
     
     load_credentials() {
       # Check cache
       if [ -f "$CREDENTIAL_CACHE_FILE" ]; then
         local cache_time=$(stat -f %m "$CREDENTIAL_CACHE_FILE" 2>/dev/null || stat -c %Y "$CREDENTIAL_CACHE_FILE" 2>/dev/null)
         local current_time=$(date +%s)
         local age=$((current_time - cache_time))
         
         if [ $age -lt $CREDENTIAL_CACHE_TTL ]; then
           source "$CREDENTIAL_CACHE_FILE"
           return 0
         fi
       fi
       
       # Load from secure storage (AWS Secrets Manager, HashiCorp Vault, etc.)
       if command -v aws &> /dev/null; then
         local secret=$(aws secretsmanager get-secret-value --secret-id db-credentials --query SecretString --output text)
         DB_USER=$(echo "$secret" | jq -r '.username')
         DB_PASS=$(echo "$secret" | jq -r '.password')
         
         # Cache credentials
         echo "export DB_USER='$DB_USER'" > "$CREDENTIAL_CACHE_FILE"
         echo "export DB_PASS='$DB_PASS'" >> "$CREDENTIAL_CACHE_FILE"
       else
         echo "Credential loading mechanism not available" >&2
         return 1
       fi
     }
     ```

#### Query Result Sanitization

1. **Sensitive Data Filtering**:
   - Filter sensitive data from query results
   - Sanitize output for logging
   - Implement data masking
   - Example:
     ```bash
     #!/bin/bash
     # Query result sanitization
     
     sanitize_output() {
       local output="$1"
       # Mask sensitive fields (email, SSN, credit card, etc.)
       echo "$output" | sed -E 's/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/***@***.***/g' \
                        | sed -E 's/\b[0-9]{3}-[0-9]{2}-[0-9]{4}\b/***-**-****/g' \
                        | sed -E 's/\b[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}[ -]?[0-9]{4}\b/****-****-****-****/g'
     }
     
     execute_sanitized_query() {
       local query="$1"
       local result=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "$query")
       sanitize_output "$result"
     }
     ```

### Database Script Checklist - Enhanced

When creating database scripts, ensure:

- [ ] **Connection Management**: Proper connection handling, pooling, cleanup, retry logic
- [ ] **Transaction Management**: Explicit transaction control, savepoints, timeout handling
- [ ] **Security**: Credentials from environment, parameterized queries, least privilege, credential rotation
- [ ] **Error Handling**: Transaction rollback, error detection, logging, transient error recovery, deadlock handling
- [ ] **Data Integrity**: Transaction boundaries, constraint validation, consistency checks
- [ ] **Performance**: Query optimization, batch operations, index awareness, slow query detection
- [ ] **Monitoring**: Connection pool monitoring, lock monitoring, query performance tracking
- [ ] **Testing**: Test scripts in isolated environments, validate results
- [ ] **Documentation**: Document script purpose, parameters, dependencies
- [ ] **Idempotency**: Scripts can be run multiple times safely
- [ ] **Rollback**: Ability to undo changes when possible
- [ ] **Observability**: Logging, alerting, performance tracking, error reporting

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

**Expert**: Arthur Davis  
**Expertise**: Architecture (System Design, Scalability)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Script Architecture and Infrastructure Patterns" section covering script architecture principles (modularity and reusability with composable modules and utility functions, layered architecture with presentation/business logic/data access/infrastructure layers, service-oriented script architecture with service discovery and orchestration), script infrastructure architecture (script execution environment with containerization and resource limits, script configuration management with environment-based configuration and validation, script dependency management with dependency declaration and resolution), script scalability architecture (horizontal scaling with parallel and distributed execution, script caching and state management with result caching and incremental execution, script queue and job management with priority management and retry logic), script deployment architecture (script deployment patterns with blue-green and canary deployment, script monitoring and observability with execution logging and performance metrics), script security architecture (script access control with authentication and audit logging, script input validation architecture with sanitization and boundary checking), script integration architecture (script API architecture with RESTful interfaces and orchestration, script event architecture with event listeners and handlers), script architecture best practices (separation of concerns, error handling architecture, testing architecture, documentation architecture, version control architecture), and comprehensive script architecture checklist covering modularity, scalability, security, monitoring, testing, documentation, deployment, error handling, configuration, and dependencies. This addition provides architectural guidance for designing scalable, maintainable, secure, and observable script infrastructure, ensuring scripts follow architectural best practices and can scale to meet production requirements.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Database-Specific Script Execution Considerations" section covering database connection management in scripts (connection pooling patterns with persistent connection management and connection pool configuration, connection lifecycle management with initialization and cleanup, connection retry logic with exponential backoff and transient failure handling), transaction management patterns (explicit transaction control with BEGIN/COMMIT/ROLLBACK, nested transaction support with savepoints, long-running transaction management with timeout handling and lock timeout management), database performance monitoring in scripts (query performance tracking with slow query detection and query plan analysis, database resource monitoring with connection pool monitoring and database lock monitoring), database script error recovery patterns (automatic error recovery with transient error handling and deadlock detection and recovery), database script security enhancements (credential rotation support with dynamic credential loading, query result sanitization with sensitive data filtering and data masking), and enhanced database script checklist covering connection management with retry logic, transaction management with timeout handling, security with credential rotation, error handling with transient error recovery and deadlock handling, performance with slow query detection, monitoring with connection pool and lock monitoring, and observability with logging and alerting. This addition provides production-ready database script patterns for connection management, transaction handling, performance monitoring, error recovery, and security, ensuring database scripts are robust, performant, and secure in production environments.

---
