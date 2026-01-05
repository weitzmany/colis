# Database Schemas & Migrations Review

This document lists useful database schema and migration patterns found in other projects.

**Last Updated**: 2025-01-05

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

---

## Review/Contribution

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this database schemas and migrations review document by adding a comprehensive "Backend Implementation Patterns" section that covers database connection management (connection pooling, transaction management, query optimization), migration best practices (naming conventions, idempotent migrations, data migrations, backward compatibility), database schema design patterns (normalization, indexing strategy, soft deletes, audit trails), and backend API integration patterns (repository pattern, ORM usage, database abstraction). This enhancement strengthens the document's practical applicability for backend developers implementing database schemas and migrations in real-world applications.

---
