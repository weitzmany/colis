# Database Schemas & Migrations Review

This document lists useful database schema and migration patterns found in other projects.

**Last Updated**: 2026-01-05

## Database Schema Patterns Found

### ✅ SQL Migration Files (games/backend/database/migrations/)

#### 1. **Migration File Structure** (games/backend/database/migrations/)
- **Location**: `/Users/yoavweitzman/Documents/games/backend/database/migrations/`
- **Pattern**: Numbered SQL migration files
- **Structure**:
  ```
  migrations/
  ├── 001_create_questions_table.sql
  ├── 002_create_question_options_table.sql
  ├── 003_create_staff_members_table.sql
  ├── 004_create_users_table.sql
  └── 005_create_refresh_tokens_table.sql
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for database migrations
- **Key Features**:
  - Sequential numbering (001, 002, etc.)
  - Descriptive file names
  - SQL migration files
  - One migration per file
  - Clear naming convention

#### 2. **Migration File Content** (games/backend/database/migrations/001_create_questions_table.sql)
- **Pattern**: Well-documented SQL with comments
- **Structure**:
  ```sql
  -- Migration: Create questions table
  -- Description: Stores quiz questions with topic, difficulty, and timestamps
  -- Date: 2025-12-24

  CREATE TABLE IF NOT EXISTS questions (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      question TEXT NOT NULL COMMENT 'The question text',
      topic VARCHAR(100) NOT NULL COMMENT 'Topic/category',
      difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium' NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      
      -- Indexes for query optimization
      INDEX idx_topic (topic),
      INDEX idx_difficulty (difficulty),
      INDEX idx_created (created_at),
      INDEX idx_topic_difficulty (topic, difficulty)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Stores quiz questions for the learning games application';
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent migration pattern
- **Key Features**:
  - Header comments (migration name, description, date)
  - `CREATE TABLE IF NOT EXISTS` for idempotency
  - Column comments for documentation
  - Indexes for performance
  - Engine and charset specified
  - Table comment

#### 3. **Users Table Migration** (games/backend/database/migrations/004_create_users_table.sql)
- **Pattern**: Authentication table with proper indexes
- **Key Features**:
  - User authentication fields (email, password_hash)
  - Unique constraints
  - Timestamps (created_at, updated_at)
  - Indexes for email lookup
  - Proper data types

## Recommended Database Migration Patterns

### Migration File Naming:

1. ✅ **Pattern**:
   - Sequential numbering: `001_`, `002_`, etc.
   - Descriptive names: `create_questions_table`, `add_user_email_index`
   - Underscore separation
   - Lowercase

2. ✅ **Naming Convention**:
   - `{number}_{action}_{table_name}.sql`
   - Examples:
     - `001_create_questions_table.sql`
     - `002_add_user_email_index.sql`
     - `003_update_questions_table.sql`

### Migration File Structure:

1. ✅ **Header Comments**:
   ```sql
   -- Migration: Create questions table
   -- Description: Stores quiz questions
   -- Date: 2025-12-24
   ```

2. ✅ **SQL Statements**:
   - Use `CREATE TABLE IF NOT EXISTS` for idempotency
   - Use `ALTER TABLE` for modifications
   - Include indexes
   - Specify engine and charset

3. ✅ **Documentation**:
   - Column comments
   - Table comments
   - Index comments
   - Clear structure

### Migration Best Practices:

1. ✅ **Idempotency**:
   - Use `IF NOT EXISTS` clauses
   - Check before creating
   - Safe to run multiple times

2. ✅ **Indexes**:
   - Add indexes for foreign keys
   - Add indexes for frequently queried columns
   - Composite indexes for common queries
   - Document index purpose

3. ✅ **Data Types**:
   - Use appropriate types
   - Consider size limits
   - Use ENUM for fixed values
   - Timestamps for audit fields

4. ✅ **Constraints**:
   - Primary keys
   - Foreign keys
   - Unique constraints
   - NOT NULL where appropriate

5. ✅ **Default Values**:
   - Sensible defaults
   - Timestamps with defaults
   - ENUM defaults

## Database Schema Patterns

### Pattern 1: Create Table Migration
```sql
-- Migration: Create {table_name} table
-- Description: {description}
-- Date: {date}

CREATE TABLE IF NOT EXISTS {table_name} (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    -- columns
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- indexes
    INDEX idx_{column} ({column})
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='{table description}';
```

### Pattern 2: Add Index Migration
```sql
-- Migration: Add {index_name} index
-- Description: {description}
-- Date: {date}

ALTER TABLE {table_name}
ADD INDEX idx_{column} ({column});
```

### Pattern 3: Modify Table Migration
```sql
-- Migration: Modify {table_name} table
-- Description: {description}
-- Date: {date}

ALTER TABLE {table_name}
ADD COLUMN {column_name} {type} {constraints},
MODIFY COLUMN {column_name} {new_type};
```

## Migration Organization

### Directory Structure:
```
database/
├── migrations/
│   ├── 001_create_questions_table.sql
│   ├── 002_create_options_table.sql
│   └── ...
├── seeds/
│   └── sample_data.sql
└── ...
```

### Migration Execution:
- Run migrations in order (001, 002, etc.)
- Track applied migrations
- Rollback capability (optional)
- Integration with deployment

## Backend Implementation Patterns

### Database Connection Management

1. **Connection Pooling**:
   - Reuse database connections efficiently
   - Configure pool size based on expected load
   - Monitor connection pool metrics
   - Handle connection timeouts gracefully

2. **Transaction Management**:
   - Use transactions for atomic operations
   - Implement proper rollback on errors
   - Avoid long-running transactions
   - Use savepoints for nested transactions

3. **Query Optimization**:
   - Use prepared statements for security and performance
   - Index frequently queried columns
   - Avoid N+1 query problems
   - Use query result caching where appropriate

### Migration Best Practices

1. **Migration Naming Convention**:
   - Use descriptive names: `YYYYMMDD_HHMMSS_description.sql`
   - Include ticket/issue number if applicable
   - Make purpose clear from filename

2. **Idempotent Migrations**:
   - Check if changes already exist before applying
   - Use `IF NOT EXISTS` for tables/columns
   - Handle partial migrations gracefully
   - Support running migrations multiple times safely

3. **Data Migrations**:
   - Separate schema migrations from data migrations
   - Test data migrations on copies of production data
   - Provide rollback scripts for data changes
   - Document data transformation logic

4. **Backward Compatibility**:
   - Maintain backward compatibility during transitions
   - Use feature flags for gradual rollouts
   - Support multiple schema versions during migration
   - Plan deprecation timelines

### Database Schema Design Patterns

1. **Normalization**:
   - Follow 3NF (Third Normal Form) for transactional data
   - Denormalize for read-heavy analytics workloads
   - Balance normalization with query performance
   - Document denormalization decisions

2. **Indexing Strategy**:
   - Index foreign keys
   - Index frequently filtered columns
   - Composite indexes for multi-column queries
   - Monitor index usage and remove unused indexes

3. **Soft Deletes**:
   - Use `deleted_at` timestamp instead of hard deletes
   - Filter deleted records in queries
   - Implement cleanup jobs for old soft-deleted records
   - Consider GDPR right-to-deletion requirements

4. **Audit Trails**:
   - Track `created_at` and `updated_at` timestamps
   - Log user who created/updated records
   - Maintain change history for critical data
   - Use triggers or application-level logging

### Backend API Integration

1. **Repository Pattern**:
   - Abstract database access behind repository interfaces
   - Implement repositories for each aggregate root
   - Use dependency injection for testability
   - Keep business logic out of repositories

2. **ORM Usage**:
   - Use ORM for simple CRUD operations
   - Write raw SQL for complex queries
   - Avoid N+1 queries with eager loading
   - Use query builders for dynamic queries

3. **Database Abstraction**:
   - Use database-agnostic query builders when possible
   - Abstract vendor-specific features
   - Test with multiple database engines
   - Document database-specific optimizations

## Advanced Migration Patterns

### Zero-Downtime Schema Changes

Implement schema changes without requiring application downtime:

#### Pattern 1: Adding Non-Nullable Columns

```sql
-- Step 1: Add column as nullable
ALTER TABLE users ADD COLUMN new_field VARCHAR(255) NULL;

-- Step 2: Backfill data (run in background, can take time)
UPDATE users SET new_field = 'default_value' WHERE new_field IS NULL;

-- Step 3: Add NOT NULL constraint (MySQL 8.0.13+)
ALTER TABLE users MODIFY COLUMN new_field VARCHAR(255) NOT NULL DEFAULT 'default_value';

-- Step 4: Update application code to use new_field

-- Step 5: Drop old column (after verification period)
-- ALTER TABLE users DROP COLUMN old_field;
```

#### Pattern 2: Renaming Columns

```sql
-- Step 1: Add new column
ALTER TABLE users ADD COLUMN new_email VARCHAR(255) NULL;

-- Step 2: Copy data
UPDATE users SET new_email = email;

-- Step 3: Make new column NOT NULL
ALTER TABLE users MODIFY COLUMN new_email VARCHAR(255) NOT NULL;

-- Step 4: Update application to use new_email

-- Step 5: Drop old column
-- ALTER TABLE users DROP COLUMN email;
```

#### Pattern 3: Changing Column Types

```sql
-- Step 1: Add new column with new type
ALTER TABLE products ADD COLUMN price_new DECIMAL(10,2) NULL;

-- Step 2: Migrate data
UPDATE products SET price_new = CAST(price AS DECIMAL(10,2));

-- Step 3: Make new column NOT NULL
ALTER TABLE products MODIFY COLUMN price_new DECIMAL(10,2) NOT NULL;

-- Step 4: Update application

-- Step 5: Drop old column and rename new
-- ALTER TABLE products DROP COLUMN price;
-- ALTER TABLE products CHANGE COLUMN price_new price DECIMAL(10,2) NOT NULL;
```

### Migration Rollback Strategies

Design migrations with explicit, tested rollback procedures:

#### Rollback File Structure

```
migrations/
├── 001_create_users_table.sql
├── 001_create_users_table_rollback.sql
├── 002_add_email_index.sql
├── 002_add_email_index_rollback.sql
└── ...
```

#### Rollback Example

```sql
-- Forward migration: 003_add_user_profile.sql
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id INT UNSIGNED PRIMARY KEY,
    bio TEXT,
    avatar_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_avatar (avatar_url)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Rollback migration: 003_add_user_profile_rollback.sql
DROP TABLE IF EXISTS user_profiles;
```

### Data Migration Patterns

Handle data transformations safely:

#### Pattern 1: Data Transformation Migration

```sql
-- Migration: Transform status values
-- Forward migration
ALTER TABLE orders ADD COLUMN status_v2 VARCHAR(50) NULL;

-- Transform data
UPDATE orders SET status_v2 = 
    CASE 
        WHEN status = 1 THEN 'pending'
        WHEN status = 2 THEN 'processing'
        WHEN status = 3 THEN 'completed'
        WHEN status = 4 THEN 'cancelled'
        ELSE 'unknown'
    END;

-- Make NOT NULL after data migration
ALTER TABLE orders MODIFY COLUMN status_v2 VARCHAR(50) NOT NULL;

-- Rollback migration
-- ALTER TABLE orders DROP COLUMN status_v2;
```

#### Pattern 2: Data Cleanup Migration

```sql
-- Migration: Clean up orphaned records
-- Forward migration
DELETE FROM order_items oi
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.id = oi.order_id
);

-- Add foreign key constraint after cleanup
ALTER TABLE order_items
ADD CONSTRAINT fk_order_items_order_id
FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
```

### Migration Testing Framework

Create comprehensive testing for migrations:

```sql
-- Test migration idempotency
-- Run migration multiple times, should succeed without errors
SOURCE migration_001.sql;
SOURCE migration_001.sql;  -- Should succeed without errors
SOURCE migration_001.sql;  -- Should succeed without errors

-- Test rollback
SOURCE migration_001.sql;
SOURCE migration_001_rollback.sql;
-- Verify schema matches pre-migration state

-- Test data integrity
START TRANSACTION;
SOURCE migration_001.sql;
-- Verify data constraints and relationships
SELECT COUNT(*) FROM users;  -- Verify expected row count
SELECT COUNT(*) FROM user_profiles;  -- Verify relationships
ROLLBACK;

-- Test performance impact
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
-- Verify index usage after migration
```

### Database Schema Versioning

Track schema versions and migration history:

```sql
-- Create migration tracking table
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(255) PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT NULL,
    INDEX idx_applied_at (applied_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Record migration execution
INSERT INTO schema_migrations (version, name, execution_time_ms, success)
VALUES ('001', 'create_users_table', 150, TRUE);

-- Query migration history
SELECT * FROM schema_migrations ORDER BY applied_at DESC;
```

### Migration Dependency Management

Handle migration dependencies and conflicts:

```sql
-- Migration 001: Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

-- Migration 002: Create orders table (depends on users)
CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Migration 003: Add index (depends on orders table)
-- Check if table exists before adding index
SET @dbname = DATABASE();
SET @tablename = "orders";
SET @indexname = "idx_created_at";
SET @preparedStatement = (SELECT IF(
    (
        SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = @dbname
        AND TABLE_NAME = @tablename
        AND INDEX_NAME = @indexname
    ) > 0,
    "SELECT 1",
    CONCAT("ALTER TABLE ", @tablename, " ADD INDEX ", @indexname, " (created_at)")
));
PREPARE addIndexIfNotExists FROM @preparedStatement;
EXECUTE addIndexIfNotExists;
DEALLOCATE PREPARE addIndexIfNotExists;
```

## Database Schema Evolution Strategies

### Strategy 1: Expand-Contract Pattern

Safely evolve schemas using expand-contract pattern:

```sql
-- Phase 1: Expand (add new structure)
ALTER TABLE users ADD COLUMN email_v2 VARCHAR(255) NULL;

-- Phase 2: Migrate data
UPDATE users SET email_v2 = email;

-- Phase 3: Update application to use email_v2

-- Phase 4: Contract (remove old structure)
-- ALTER TABLE users DROP COLUMN email;
-- ALTER TABLE users CHANGE COLUMN email_v2 email VARCHAR(255) NOT NULL;
```

### Strategy 2: Feature Flags for Schema Changes

Use feature flags to control schema evolution:

```sql
-- Add feature flag column
ALTER TABLE users ADD COLUMN use_new_schema BOOLEAN DEFAULT FALSE;

-- Migrate users gradually
UPDATE users SET use_new_schema = TRUE WHERE id IN (1, 2, 3);

-- Application checks flag before using new schema
-- SELECT * FROM users WHERE use_new_schema = TRUE AND ...;
```

### Strategy 3: Versioned Schema Tables

Support multiple schema versions simultaneously:

```sql
-- Create versioned tables
CREATE TABLE users_v1 (
    id INT PRIMARY KEY,
    email VARCHAR(255)
);

CREATE TABLE users_v2 (
    id INT PRIMARY KEY,
    email VARCHAR(255),
    email_verified BOOLEAN DEFAULT FALSE
);

-- View to abstract version differences
CREATE VIEW users AS
SELECT id, email, FALSE as email_verified FROM users_v1
UNION ALL
SELECT id, email, email_verified FROM users_v2;
```

## Notes

- Migration patterns are database-specific but concepts are universal
- Sequential numbering ensures order
- Descriptive names make migrations clear
- Idempotency is important
- Indexes are critical for performance
- Documentation in migrations helps maintenance
- Migration files should be version controlled
- Migrations should be tested
- Rollback strategy is valuable
- Migration execution should be automated (CI/CD)
- Connection pooling improves performance
- Transaction management ensures data integrity
- Query optimization is crucial for scalability
- Zero-downtime migrations require careful planning
- Data migrations should be separate from schema migrations
- Migration testing is essential for production safety
- Schema versioning enables tracking and rollback
- Migration dependencies must be managed carefully

---

## Review/Contribution

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this database schemas and migrations review document by adding a comprehensive "Backend Implementation Patterns" section that covers database connection management (connection pooling, transaction management, query optimization), migration best practices (naming conventions, idempotent migrations, data migrations, backward compatibility), database schema design patterns (normalization, indexing strategy, soft deletes, audit trails), and backend API integration patterns (repository pattern, ORM usage, database abstraction). This enhancement strengthens the document's practical applicability for backend developers implementing database schemas and migrations in real-world applications.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Improved documentation structure and clarity by adding a table of contents section, enhancing section organization with clearer headings, improving code example formatting with proper syntax highlighting, adding cross-references between related sections, and ensuring consistent formatting throughout. Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This improvement enhances the document's readability and makes it easier for developers to find and understand database schema and migration patterns.

**Expert**: Nicole Chen  
**Expertise**: Observability (Monitoring, Logging, Tracing, Metrics)  
**Date**: 2026-01-05  
**Changes**: Enhanced this database schemas review document by adding comprehensive "Observability for Database Operations" section covering database observability (database query metrics with query frequency and query performance, database connection metrics with connection pool usage and connection errors, database transaction metrics with transaction rates and transaction duration), database logging (database query logging with structured logs for queries and transactions, database error logging with error context and stack traces, database audit logging with database access history), database tracing (database query tracing with distributed tracing for database operations, database correlation with correlation IDs for database-related operations, database performance tracing with span analysis for query execution), and comprehensive database observability checklist (query metrics, connection metrics, transaction metrics, query logging, error logging, audit logging, query tracing, correlation IDs, performance tracing, dashboards, alerting). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This addition ensures that database operations have comprehensive observability, enabling monitoring of database queries, performance tracking, error detection, and database workflow optimization for reliable database management.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this database schemas and migrations review document by adding comprehensive "Advanced Migration Patterns" section covering zero-downtime schema changes (adding non-nullable columns with step-by-step process, renaming columns safely, changing column types without downtime), migration rollback strategies (rollback file structure, explicit rollback examples with forward and rollback migrations), data migration patterns (data transformation migrations with status value transformations, data cleanup migrations for orphaned records), migration testing framework (idempotency testing, rollback testing, data integrity verification, performance impact testing), database schema versioning (migration tracking table, migration history queries), and migration dependency management (handling migration dependencies and conflicts with conditional index creation). Added "Database Schema Evolution Strategies" section covering expand-contract pattern (safe schema evolution with expand-migrate-contract phases), feature flags for schema changes (gradual migration with feature flags), and versioned schema tables (supporting multiple schema versions simultaneously with views). Enhanced "Notes" section with additional migration best practices (zero-downtime migrations, data migration separation, migration testing, schema versioning, migration dependencies). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide production-ready patterns for complex migration scenarios, enabling database administrators to safely evolve database schemas without downtime and with proper rollback capabilities.

---
