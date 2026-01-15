# Database Design and Optimization Guide

This guide provides comprehensive best practices, patterns, and strategies for designing, optimizing, and maintaining database systems.

**Last Updated**: 2026-01-05

## Table of Contents

1. [Schema Design Principles](#schema-design-principles)
2. [Normalization Strategies](#normalization-strategies)
3. [Indexing Best Practices](#indexing-best-practices)
4. [Query Optimization](#query-optimization)
5. [Migration Management](#migration-management)
6. [Performance Optimization](#performance-optimization)
7. [Data Integrity and Security](#data-integrity-and-security)
8. [Scalability Patterns](#scalability-patterns)
9. [Common Anti-Patterns](#common-anti-patterns)
10. [Database Design Checklist](#database-design-checklist)

## Schema Design Principles

### Fundamental Design Principles

1. **Normalization First, Denormalization When Needed**
   - Start with normalized design (typically 3NF)
   - Denormalize strategically for performance
   - Balance between normalization and query efficiency
   - Document denormalization decisions

2. **Clear Entity Relationships**
   - Define relationships explicitly (one-to-one, one-to-many, many-to-many)
   - Use appropriate foreign keys
   - Implement referential integrity constraints
   - Document relationship cardinality

3. **Appropriate Data Types**
   - Choose data types that match data characteristics
   - Use smallest sufficient type (INT vs BIGINT)
   - Consider storage implications
   - Plan for internationalization (UTF-8, character sets)

4. **Primary Key Strategy**
   - Use surrogate keys (auto-increment IDs) or natural keys appropriately
   - Ensure primary keys are immutable
   - Consider composite keys when appropriate
   - Never use business data as primary key if it can change

### Schema Design Example

```sql
-- Example: Well-designed user table
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_username (username),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Example: Relationship table with proper foreign keys
CREATE TABLE user_profiles (
    user_id INT UNSIGNED PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_full_name (first_name, last_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Normalization Strategies

### Normalization Levels

1. **First Normal Form (1NF)**
   - Eliminate repeating groups
   - Each column contains atomic values
   - No multiple values in single column
   - Each row is unique

2. **Second Normal Form (2NF)**
   - Must be in 1NF
   - Remove partial dependencies
   - All non-key attributes fully dependent on primary key

3. **Third Normal Form (3NF)**
   - Must be in 2NF
   - Remove transitive dependencies
   - Non-key attributes independent of each other
   - **Recommended minimum for most applications**

4. **Boyce-Codd Normal Form (BCNF)**
   - Stricter version of 3NF
   - Every determinant is a candidate key
   - Used when needed for complex schemas

### When to Denormalize

Denormalize strategically when:
- **Read performance is critical**: Reduce JOINs for frequently accessed data
- **Reporting requirements**: Pre-aggregated data for analytics
- **Geographic distribution**: Reduce cross-region queries
- **Historical data**: Preserve data state at specific points in time

**Denormalization Example**:

```sql
-- Normalized approach (3NF)
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(255)
);

-- Denormalized approach (for performance)
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(100),  -- Denormalized
    user_email VARCHAR(255), -- Denormalized
    total_amount DECIMAL(10,2),
    FOREIGN KEY (user_id) REFERENCES users(id)
    -- Note: Update triggers needed to maintain consistency
);
```

## Indexing Best Practices

### Index Types and Usage

1. **Primary Key Index**
   - Automatically created
   - Unique and non-nullable
   - Used for row identification

2. **Unique Index**
   - Enforces uniqueness
   - Automatically created for UNIQUE constraints
   - Examples: email, username, UUID

3. **Non-Unique Index**
   - Improves query performance
   - Used for frequently filtered columns
   - Supports JOIN operations

4. **Composite Index**
   - Multiple columns in single index
   - Follow leftmost prefix rule
   - Order matters (most selective first)

### Index Design Strategy

```sql
-- Single column index
CREATE INDEX idx_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_status_created ON orders(status, created_at);
-- This index can be used for:
-- - WHERE status = ?
-- - WHERE status = ? AND created_at > ?
-- - WHERE status = ? AND created_at < ?
-- But NOT for: WHERE created_at > ?

-- Covering index (includes all columns needed by query)
CREATE INDEX idx_user_orders ON orders(user_id, status, total_amount);
-- Query: SELECT status, total_amount FROM orders WHERE user_id = ?
-- Can be satisfied entirely from index (no table lookup)
```

### Index Guidelines

- **Index foreign keys**: Improves JOIN performance
- **Index frequently filtered columns**: WHERE clause columns
- **Index columns in ORDER BY**: For sorting optimization
- **Consider index selectivity**: High selectivity = better index
- **Monitor index usage**: Remove unused indexes
- **Balance read/write performance**: More indexes = slower writes
- **Use partial indexes**: For filtered subsets of data

### Index Maintenance

```sql
-- Check index usage (MySQL)
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    CARDINALITY,
    SEQ_IN_INDEX
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
AND TABLE_NAME = 'your_table';

-- Analyze index effectiveness
EXPLAIN SELECT * FROM orders WHERE status = 'pending' AND created_at > '2026-01-01';
```

## Query Optimization

### Query Performance Analysis

1. **Use EXPLAIN/EXPLAIN ANALYZE**
   ```sql
   EXPLAIN SELECT u.name, o.total 
   FROM users u 
   JOIN orders o ON u.id = o.user_id 
   WHERE u.email = 'user@example.com';
   ```

2. **Key Metrics to Monitor**
   - Execution time
   - Rows examined vs rows returned
   - Index usage
   - JOIN algorithm used
   - Temporary tables created

### Query Optimization Techniques

1. **Select Only Needed Columns**
   ```sql
   -- Bad: SELECT * FROM users WHERE id = 1;
   -- Good: SELECT id, name, email FROM users WHERE id = 1;
   ```

2. **Use Appropriate JOINs**
   ```sql
   -- Prefer INNER JOIN when possible
   SELECT u.name, o.total
   FROM users u
   INNER JOIN orders o ON u.id = o.user_id
   WHERE u.status = 'active';
   
   -- Use EXISTS for existence checks (often faster than JOIN)
   SELECT u.*
   FROM users u
   WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);
   ```

3. **Limit Result Sets**
   ```sql
   -- Always use LIMIT for large result sets
   SELECT * FROM orders ORDER BY created_at DESC LIMIT 20;
   
   -- Use pagination
   SELECT * FROM orders 
   WHERE id > ? 
   ORDER BY id 
   LIMIT 20;
   ```

4. **Avoid N+1 Query Problems**
   ```sql
   -- Bad: N+1 queries
   -- SELECT * FROM users; (1 query)
   -- SELECT * FROM orders WHERE user_id = 1; (query for each user)
   -- SELECT * FROM orders WHERE user_id = 2;
   -- ...
   
   -- Good: Single query with JOIN
   SELECT u.*, o.*
   FROM users u
   LEFT JOIN orders o ON u.id = o.user_id
   WHERE u.created_at > '2026-01-01';
   ```

5. **Use Prepared Statements**
   ```sql
   -- Security + Performance
   PREPARE stmt FROM 'SELECT * FROM users WHERE email = ?';
   SET @email = 'user@example.com';
   EXECUTE stmt USING @email;
   DEALLOCATE PREPARE stmt;
   ```

### Query Pattern Optimization

```sql
-- Pattern 1: Range queries
-- Good: Indexed column with range
SELECT * FROM orders WHERE created_at BETWEEN '2026-01-01' AND '2026-01-31';

-- Pattern 2: Partial matching
-- Use prefix matching when possible
SELECT * FROM users WHERE email LIKE 'user@%';  -- Can use index
SELECT * FROM users WHERE email LIKE '%@domain.com';  -- Cannot use index

-- Pattern 3: Aggregations
-- Add index on GROUP BY columns
SELECT status, COUNT(*) 
FROM orders 
GROUP BY status;  -- Index on status improves performance

-- Pattern 4: Sorting
-- Index columns in ORDER BY
SELECT * FROM users ORDER BY created_at DESC;  -- Index on created_at
```

## Migration Management

### Migration Best Practices

1. **Version Control**
   - Each migration has unique version identifier
   - Track migration history
   - Support rollback capabilities
   - Test migrations in staging first

2. **Idempotent Migrations**
   ```sql
   -- Good: Idempotent migration
   CREATE TABLE IF NOT EXISTS users (
       id INT PRIMARY KEY AUTO_INCREMENT,
       email VARCHAR(255) UNIQUE
   );
   
   -- Add column only if it doesn't exist
   SET @dbname = DATABASE();
   SET @tablename = "users";
   SET @columnname = "phone";
   SET @preparedStatement = (SELECT IF(
     (
       SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
       WHERE
         (TABLE_SCHEMA = @dbname)
         AND (TABLE_NAME = @tablename)
         AND (COLUMN_NAME = @columnname)
     ) > 0,
     "SELECT 1",
     CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " VARCHAR(20)")
   ));
   PREPARE alterIfNotExists FROM @preparedStatement;
   EXECUTE alterIfNotExists;
   DEALLOCATE PREPARE alterIfNotExists;
   ```

3. **Migration File Structure**
   ```
   migrations/
   ├── 001_create_users_table.sql
   ├── 002_add_email_index.sql
   ├── 003_create_orders_table.sql
   └── 004_add_user_profile_table.sql
   ```

### Rollback Strategy

```sql
-- Forward migration
-- 004_add_user_profile_table.sql
CREATE TABLE user_profiles (
    user_id INT PRIMARY KEY,
    bio TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Rollback migration
-- 004_add_user_profile_table_rollback.sql
DROP TABLE IF EXISTS user_profiles;
```

### Migration Testing Checklist

- [ ] Test migration on copy of production data
- [ ] Verify migration completes successfully
- [ ] Test rollback procedure
- [ ] Verify data integrity after migration
- [ ] Check index creation/removal
- [ ] Validate foreign key constraints
- [ ] Monitor performance impact
- [ ] Test application compatibility

## Performance Optimization

### Connection Management

1. **Connection Pooling**
   - Reuse database connections
   - Configure appropriate pool size
   - Monitor connection usage
   - Set connection timeout

2. **Query Caching**
   - Enable query cache (MySQL)
   - Use application-level caching (Redis, Memcached)
   - Cache frequently accessed data
   - Implement cache invalidation strategy

### Monitoring and Analysis

1. **Slow Query Log**
   ```sql
   -- Enable slow query log (MySQL)
   SET GLOBAL slow_query_log = 'ON';
   SET GLOBAL long_query_time = 1;  -- Log queries > 1 second
   ```

2. **Performance Schema (MySQL)**
   ```sql
   -- Monitor table I/O
   SELECT * FROM performance_schema.table_io_waits_summary_by_table
   WHERE OBJECT_SCHEMA = 'your_database';
   ```

3. **Query Statistics**
   ```sql
   -- Check table statistics
   SHOW TABLE STATUS LIKE 'orders';
   
   -- Analyze table (update statistics)
   ANALYZE TABLE orders;
   ```

### Optimization Techniques

1. **Partitioning**
   ```sql
   -- Partition by date range
   CREATE TABLE orders (
       id INT,
       order_date DATE,
       total DECIMAL(10,2)
   ) PARTITION BY RANGE (YEAR(order_date)) (
       PARTITION p2024 VALUES LESS THAN (2025),
       PARTITION p2025 VALUES LESS THAN (2026),
       PARTITION p2026 VALUES LESS THAN (2027),
       PARTITION p_future VALUES LESS THAN MAXVALUE
   );
   ```

2. **Read Replicas**
   - Use read replicas for read-heavy workloads
   - Route read queries to replicas
   - Keep write operations on primary
   - Monitor replication lag

3. **Archival Strategy**
   - Move old data to archive tables
   - Implement data retention policies
   - Compress historical data
   - Separate hot and cold data

## Data Integrity and Security

### Data Integrity Constraints

1. **Foreign Key Constraints**
   ```sql
   CREATE TABLE orders (
       id INT PRIMARY KEY,
       user_id INT,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
   );
   ```

2. **Check Constraints**
   ```sql
   CREATE TABLE products (
       id INT PRIMARY KEY,
       price DECIMAL(10,2) CHECK (price >= 0),
       stock INT CHECK (stock >= 0)
   );
   ```

3. **Unique Constraints**
   ```sql
   CREATE TABLE users (
       id INT PRIMARY KEY,
       email VARCHAR(255) UNIQUE,
       username VARCHAR(50) UNIQUE
   );
   ```

4. **NOT NULL Constraints**
   ```sql
   CREATE TABLE users (
       id INT PRIMARY KEY,
       email VARCHAR(255) NOT NULL,
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Transaction Management

```sql
-- Use transactions for data consistency
START TRANSACTION;

INSERT INTO orders (user_id, total) VALUES (1, 100.00);
UPDATE users SET total_orders = total_orders + 1 WHERE id = 1;

COMMIT;  -- Or ROLLBACK on error
```

### Security Best Practices

1. **Parameterized Queries**
   ```sql
   -- Always use parameterized queries (prevents SQL injection)
   -- Bad: "SELECT * FROM users WHERE email = '" + email + "'"
   -- Good: "SELECT * FROM users WHERE email = ?" with parameter binding
   ```

2. **Least Privilege Principle**
   - Grant minimum required permissions
   - Use separate users for different operations
   - Restrict DROP, ALTER permissions
   - Use read-only users for reporting

3. **Data Encryption**
   - Encrypt sensitive data at rest
   - Use SSL/TLS for connections
   - Encrypt sensitive columns
   - Secure backup storage

## Scalability Patterns

### Horizontal Scaling Strategies

1. **Sharding**
   - Partition data across multiple databases
   - Shard by user_id, geographic region, etc.
   - Maintain shard routing logic
   - Handle cross-shard queries

2. **Read Replicas**
   - Multiple read replicas
   - Load balance read traffic
   - Asynchronous replication
   - Handle replication lag

3. **Caching Layer**
   - Redis/Memcached for hot data
   - Cache frequently accessed data
   - Implement cache invalidation
   - Use cache warming strategies

### Vertical Scaling Considerations

1. **Hardware Optimization**
   - Increase RAM for larger buffer pools
   - Use SSD storage
   - Optimize CPU for database workload
   - Network optimization

2. **Database Configuration**
   ```sql
   -- MySQL configuration examples
   -- Increase buffer pool size
   innodb_buffer_pool_size = 8G
   
   -- Optimize query cache
   query_cache_size = 256M
   
   -- Connection settings
   max_connections = 500
   ```

## Common Anti-Patterns

### Anti-Pattern 1: Over-Normalization

**Problem**: Excessive normalization leads to too many JOINs
```sql
-- Over-normalized: Too many JOINs required
SELECT u.name, p.street, c.name, s.name, co.name
FROM users u
JOIN addresses p ON u.id = p.user_id
JOIN cities c ON p.city_id = c.id
JOIN states s ON c.state_id = s.id
JOIN countries co ON s.country_id = co.id;
```

**Solution**: Strategic denormalization
```sql
-- Denormalized: Store frequently accessed data together
SELECT u.name, u.address_street, u.address_city, u.address_state
FROM users u;
```

### Anti-Pattern 2: Missing Indexes

**Problem**: Full table scans on large tables
```sql
-- No index on status column
SELECT * FROM orders WHERE status = 'pending';  -- Full table scan!
```

**Solution**: Add appropriate indexes
```sql
CREATE INDEX idx_status ON orders(status);
```

### Anti-Pattern 3: N+1 Query Problem

**Problem**: Multiple queries instead of single JOIN
```sql
-- Bad: N+1 queries
SELECT * FROM users;
-- Then for each user:
SELECT * FROM orders WHERE user_id = ?;
```

**Solution**: Single query with JOIN
```sql
-- Good: Single query
SELECT u.*, o.*
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

### Anti-Pattern 4: SELECT *

**Problem**: Retrieving unnecessary data
```sql
-- Bad: Retrieves all columns
SELECT * FROM users WHERE id = 1;
```

**Solution**: Select only needed columns
```sql
-- Good: Only needed columns
SELECT id, name, email FROM users WHERE id = 1;
```

### Anti-Pattern 5: Missing Constraints

**Problem**: Data integrity issues
```sql
-- Bad: No foreign key constraint
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT  -- No foreign key!
);
```

**Solution**: Proper constraints
```sql
-- Good: Foreign key constraint
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Database Design Checklist

### Schema Design
- [ ] Tables are normalized to 3NF (or intentionally denormalized)
- [ ] Primary keys defined for all tables
- [ ] Foreign keys defined for relationships
- [ ] Appropriate data types selected
- [ ] NOT NULL constraints on required fields
- [ ] Unique constraints on unique fields
- [ ] Default values specified where appropriate
- [ ] Timestamps (created_at, updated_at) included
- [ ] Soft delete support (deleted_at) where needed

### Indexing
- [ ] Indexes on all foreign keys
- [ ] Indexes on frequently filtered columns
- [ ] Composite indexes for multi-column queries
- [ ] Indexes ordered by selectivity
- [ ] Covering indexes for common queries
- [ ] Unused indexes removed

### Performance
- [ ] Queries use EXPLAIN for analysis
- [ ] Slow queries optimized
- [ ] N+1 query problems eliminated
- [ ] Connection pooling configured
- [ ] Query caching enabled
- [ ] Pagination implemented for large result sets

### Security
- [ ] Parameterized queries used (no SQL injection)
- [ ] Least privilege access granted
- [ ] Sensitive data encrypted
- [ ] SSL/TLS for connections
- [ ] Backup encryption enabled

### Migration
- [ ] Migrations are versioned
- [ ] Migrations are idempotent
- [ ] Rollback procedures tested
- [ ] Migrations tested on staging
- [ ] Migration history tracked

### Documentation
- [ ] Schema documented
- [ ] Relationships documented
- [ ] Indexes documented with rationale
- [ ] Denormalization decisions documented
- [ ] Migration procedures documented

### Monitoring
- [ ] Slow query log enabled
- [ ] Performance metrics monitored
- [ ] Index usage tracked
- [ ] Connection pool monitored
- [ ] Database size monitored

## Advanced Query Optimization Patterns

### Window Functions for Complex Queries

Window functions provide powerful capabilities for analytical queries without subqueries:

```sql
-- Rank users by order total
SELECT 
    u.id,
    u.name,
    o.total,
    RANK() OVER (PARTITION BY u.id ORDER BY o.total DESC) as order_rank,
    SUM(o.total) OVER (PARTITION BY u.id) as user_total
FROM users u
JOIN orders o ON u.id = o.user_id;

-- Running totals and moving averages
SELECT 
    date,
    revenue,
    SUM(revenue) OVER (ORDER BY date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total,
    AVG(revenue) OVER (ORDER BY date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as seven_day_avg
FROM daily_revenue
ORDER BY date;
```

### Common Table Expressions (CTEs) for Readability

CTEs improve query readability and can optimize complex queries:

```sql
-- Recursive CTE for hierarchical data
WITH RECURSIVE category_tree AS (
    -- Base case: root categories
    SELECT id, name, parent_id, 0 as level
    FROM categories
    WHERE parent_id IS NULL
    
    UNION ALL
    
    -- Recursive case: child categories
    SELECT c.id, c.name, c.parent_id, ct.level + 1
    FROM categories c
    JOIN category_tree ct ON c.parent_id = ct.id
)
SELECT * FROM category_tree ORDER BY level, name;

-- CTE for complex aggregations
WITH monthly_stats AS (
    SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as order_count,
        SUM(total) as revenue
    FROM orders
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT 
    month,
    order_count,
    revenue,
    LAG(revenue) OVER (ORDER BY month) as prev_month_revenue,
    revenue - LAG(revenue) OVER (ORDER BY month) as revenue_change
FROM monthly_stats;
```

### Query Result Caching Strategies

Implement intelligent caching for frequently accessed data:

```sql
-- Materialized view pattern (PostgreSQL)
CREATE MATERIALIZED VIEW user_order_summary AS
SELECT 
    u.id as user_id,
    COUNT(o.id) as total_orders,
    SUM(o.total) as lifetime_value,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id;

-- Refresh materialized view periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;

-- MySQL: Use generated columns for computed values
CREATE TABLE products (
    id INT PRIMARY KEY,
    price DECIMAL(10,2),
    discount_percent DECIMAL(5,2),
    final_price DECIMAL(10,2) AS (price * (1 - discount_percent / 100)) STORED,
    INDEX idx_final_price (final_price)
);
```

### Database Partitioning Strategies

Partition large tables to improve query performance:

```sql
-- Range partitioning by date (PostgreSQL/MySQL 8.0+)
CREATE TABLE orders (
    id INT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10,2),
    created_at TIMESTAMP
) PARTITION BY RANGE (YEAR(created_at)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Hash partitioning for even distribution
CREATE TABLE user_sessions (
    id INT PRIMARY KEY,
    user_id INT,
    session_data TEXT,
    created_at TIMESTAMP
) PARTITION BY HASH(user_id) PARTITIONS 8;

-- List partitioning for categorical data
CREATE TABLE events (
    id INT PRIMARY KEY,
    event_type VARCHAR(50),
    event_data JSON,
    created_at TIMESTAMP
) PARTITION BY LIST (event_type) (
    PARTITION p_login VALUES IN ('login', 'logout'),
    PARTITION p_purchase VALUES IN ('purchase', 'refund'),
    PARTITION p_other VALUES IN (DEFAULT)
);
```

**Partitioning Best Practices:**
- Partition by columns frequently used in WHERE clauses
- Keep partition sizes manageable (aim for < 10GB per partition)
- Plan for partition maintenance (dropping old partitions, adding new ones)
- Monitor partition pruning effectiveness
- Use partition-aware indexes

## Advanced Migration Strategies

### Zero-Downtime Migrations

Implement migrations that don't require application downtime:

```sql
-- Step 1: Add new column as nullable
ALTER TABLE users ADD COLUMN new_email VARCHAR(255) NULL;

-- Step 2: Backfill data (run in background)
UPDATE users SET new_email = email WHERE new_email IS NULL;

-- Step 3: Add NOT NULL constraint with default (MySQL 8.0.13+)
ALTER TABLE users 
    MODIFY COLUMN new_email VARCHAR(255) NOT NULL DEFAULT '';

-- Step 4: Update application to use new_email

-- Step 5: Drop old column (after verification period)
-- ALTER TABLE users DROP COLUMN email;
```

### Rollback Strategies

Design migrations with explicit rollback procedures:

```sql
-- Migration: Add index
-- Forward migration
CREATE INDEX idx_user_email ON users(email);

-- Rollback migration (store separately)
-- DROP INDEX idx_user_email ON users;

-- Migration: Add column with data migration
-- Forward migration
ALTER TABLE orders ADD COLUMN status_v2 VARCHAR(50) NULL;
UPDATE orders SET status_v2 = 
    CASE 
        WHEN status = 1 THEN 'pending'
        WHEN status = 2 THEN 'completed'
        WHEN status = 3 THEN 'cancelled'
        ELSE 'unknown'
    END;
ALTER TABLE orders MODIFY COLUMN status_v2 VARCHAR(50) NOT NULL;

-- Rollback migration
-- ALTER TABLE orders DROP COLUMN status_v2;
```

### Migration Testing Framework

Create a testing framework for migrations:

```sql
-- Test migration idempotency
-- Run migration twice, verify no errors
SOURCE migration_001.sql;
SOURCE migration_001.sql;  -- Should succeed without errors

-- Test rollback
SOURCE migration_001.sql;
SOURCE migration_001_rollback.sql;
-- Verify schema matches pre-migration state

-- Test data integrity
START TRANSACTION;
SOURCE migration_001.sql;
-- Verify data constraints
ROLLBACK;
```

## Database Performance Monitoring

### Key Performance Indicators (KPIs)

Monitor these metrics to identify performance issues:

```sql
-- Query performance metrics
SELECT 
    DIGEST_TEXT as query_pattern,
    COUNT_STAR as execution_count,
    AVG_TIMER_WAIT / 1000000000000 as avg_time_seconds,
    MAX_TIMER_WAIT / 1000000000000 as max_time_seconds,
    SUM_ROWS_EXAMINED as total_rows_examined,
    SUM_ROWS_SENT as total_rows_sent
FROM performance_schema.events_statements_summary_by_digest
WHERE SCHEMA_NAME = 'your_database'
ORDER BY AVG_TIMER_WAIT DESC
LIMIT 20;

-- Index usage statistics
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    CARDINALITY,
    INDEX_TYPE
FROM information_schema.STATISTICS
WHERE TABLE_SCHEMA = 'your_database'
AND CARDINALITY IS NOT NULL
ORDER BY CARDINALITY DESC;

-- Table size and growth
SELECT 
    TABLE_NAME,
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS size_mb,
    TABLE_ROWS,
    ROUND((DATA_LENGTH / 1024 / 1024), 2) AS data_mb,
    ROUND((INDEX_LENGTH / 1024 / 1024), 2) AS index_mb
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'your_database'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC;
```

### Slow Query Analysis

Identify and optimize slow queries:

```sql
-- Enable slow query log (MySQL)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;  -- Log queries > 1 second

-- Analyze slow queries
SELECT 
    sql_text,
    exec_count,
    avg_timer_wait / 1000000000000 as avg_time_seconds,
    sum_rows_examined,
    sum_rows_sent
FROM performance_schema.events_statements_summary_by_digest
WHERE avg_timer_wait > 1000000000000  -- > 1 second
ORDER BY avg_timer_wait DESC;

-- Find queries with high row examination ratio
SELECT 
    DIGEST_TEXT,
    SUM_ROWS_EXAMINED / SUM_ROWS_SENT as examination_ratio,
    SUM_ROWS_EXAMINED,
    SUM_ROWS_SENT
FROM performance_schema.events_statements_summary_by_digest
WHERE SUM_ROWS_SENT > 0
HAVING examination_ratio > 10  -- Examining 10x more rows than returned
ORDER BY examination_ratio DESC;
```

## Resources and Tools

### Database Management Tools
- **MySQL Workbench**: Schema design and administration
- **pgAdmin**: PostgreSQL administration
- **DBeaver**: Universal database tool with advanced query capabilities
- **DataGrip**: JetBrains database IDE with query optimization features
- **phpMyAdmin**: Web-based MySQL administration
- **TablePlus**: Modern database management with query optimization

### Performance Monitoring Tools
- **Percona Monitoring and Management (PMM)**: Comprehensive MySQL/PostgreSQL monitoring
- **MySQL Enterprise Monitor**: Enterprise-grade MySQL performance monitoring
- **pg_stat_statements**: PostgreSQL query performance statistics
- **Prometheus + Grafana**: Custom database metrics and visualization
- **New Relic Database**: Cloud-based database performance monitoring

### Migration Tools
- **Flyway**: Database migration and version control
- **Liquibase**: Database schema change management
- **Sqitch**: Database change management with dependency tracking
- **Alembic**: Python database migration tool (SQLAlchemy)
- **Sequelize Migrations**: Node.js migration framework
- **DBeaver**: Universal database tool
- **phpMyAdmin**: Web-based MySQL management

### Query Analysis Tools
- **EXPLAIN**: Built-in query analysis
- **pt-query-digest**: Query log analysis (Percona Toolkit)
- **MySQL Enterprise Monitor**: Performance monitoring

### Migration Tools
- **Flyway**: Database migration tool
- **Liquibase**: Database change management
- **Rails Migrations**: Ruby on Rails migration system
- **Knex.js**: SQL query builder with migrations

### Best Practices References
- **Database Normalization**: Ensure data integrity
- **ACID Properties**: Transaction reliability
- **CAP Theorem**: Distributed system trade-offs
- **Index Design Patterns**: Optimize query performance

### Mobile Considerations for Database Design

When designing databases for mobile applications:

1. **Mobile Network Optimization**
   - Design queries to minimize mobile network round trips
   - Implement efficient pagination for mobile data loading
   - Use data compression for mobile network efficiency
   - Optimize query payload sizes for mobile bandwidth

2. **Mobile Storage Considerations**
   - Design schemas that support mobile local caching
   - Consider mobile device storage limitations
   - Optimize for mobile database synchronization patterns
   - Design for offline-first mobile data patterns

3. **Mobile Performance**
   - Indexes should optimize mobile query patterns
   - Query design should minimize mobile processing overhead
   - Connection pooling should account for mobile connection constraints
   - Database operations should be optimized for mobile device capabilities

4. **Mobile Data Synchronization**
   - Schema design should support mobile sync patterns
   - Design for conflict resolution in mobile sync scenarios
   - Optimize for incremental data synchronization
   - Support mobile offline data storage patterns

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (database design, database optimization, schema design, database best practices)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive design examples and optimization patterns for content depth

2. **Technical Documentation SEO**
   - Document database design principles with clear, searchable descriptions
   - Include code examples demonstrating database patterns and SQL queries
   - Use semantic HTML structure in documentation
   - Add internal links to related database and optimization documentation

3. **Content Quality for Search**
   - Ensure guide answers common database design queries
   - Include troubleshooting sections for common database issues
   - Provide comprehensive database design reference documentation
   - Maintain documentation freshness with database technology updates

---

## Review/Contribution

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this database design guide by adding comprehensive "Advanced Query Optimization Patterns" section covering window functions for complex queries (ranking, running totals, moving averages), Common Table Expressions (CTEs) for readability (recursive CTEs for hierarchical data, CTEs for complex aggregations), query result caching strategies (materialized views, generated columns for computed values), and database partitioning strategies (range partitioning by date, hash partitioning for even distribution, list partitioning for categorical data, partitioning best practices). Added "Advanced Migration Strategies" section covering zero-downtime migrations (step-by-step process for adding columns without downtime), rollback strategies (explicit rollback procedures with examples), and migration testing framework (idempotency testing, rollback testing, data integrity verification). Added "Database Performance Monitoring" section covering key performance indicators (query performance metrics, index usage statistics, table size and growth), and slow query analysis (enabling slow query log, analyzing slow queries, finding queries with high row examination ratio). Enhanced "Resources and Tools" section with performance monitoring tools (Percona Monitoring and Management, MySQL Enterprise Monitor, pg_stat_statements, Prometheus + Grafana, New Relic Database) and migration tools (Flyway, Liquibase, Sqitch, Alembic, Sequelize Migrations). These additions provide practical, production-ready techniques for advanced database optimization, migration management, and performance monitoring, enabling database administrators and developers to handle complex scenarios and maintain high-performance database systems.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Created comprehensive database design and optimization guide covering schema design principles (normalization, entity relationships, data types, primary key strategy) with SQL examples, normalization strategies (1NF through BCNF) with denormalization guidelines and examples, indexing best practices (index types, composite indexes, covering indexes) with performance guidelines, query optimization techniques (EXPLAIN usage, JOIN optimization, N+1 prevention, prepared statements) with code examples, migration management (version control, idempotent migrations, rollback strategies) with testing checklist, performance optimization (connection pooling, caching, partitioning, read replicas) with monitoring techniques, data integrity and security (constraints, transactions, parameterized queries, encryption) with implementation examples, scalability patterns (sharding, read replicas, caching) for horizontal and vertical scaling, common anti-patterns (over-normalization, missing indexes, N+1 queries, SELECT *, missing constraints) with solutions, and comprehensive database design checklist covering schema design, indexing, performance, security, migration, documentation, and monitoring. This guide provides practical, actionable guidance for database designers and developers working with relational database systems.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for database design section covering mobile network optimization (minimize round trips, efficient pagination, data compression, payload size optimization), mobile storage considerations (local caching support, storage limitations, synchronization patterns, offline-first patterns), mobile performance (index optimization, query design, connection pooling, mobile device capabilities), and mobile data synchronization (sync patterns, conflict resolution, incremental sync, offline storage). This addition ensures database design accounts for mobile application constraints and mobile data access patterns.

---
