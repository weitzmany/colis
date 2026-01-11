# Generic Rules Review

This document lists generic/useful rules found in other projects that could be helpful across multiple projects.

**Last Updated**: 2026-01-05

## Rules Found in Other Projects

### ✅ Generic/Useful Rules (Recommended for Review)

These rules are generic enough to be useful across multiple projects:

#### 1. **cursor_rules.mdc** (games, sandbox)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/cursor_rules.mdc`
- **Description**: Guidelines for creating and maintaining Cursor rules (rule structure, formatting, best practices)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - applies to any project using Cursor rules
- **Notes**: Meta-rule about rule creation itself

#### 2. **self_improve.mdc** (games, sandbox)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/self_improve.mdc`
- **Description**: Guidelines for continuously improving Cursor rules based on emerging patterns
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - applies to rule maintenance in any project
- **Notes**: Process for identifying and updating rules based on code patterns

#### 3. **always_use_personas.mdc** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/user/always_use_personas.mdc`
- **Description**: Rule to always use expert personas when providing assistance
- **Usefulness**: ⭐⭐⭐⭐ Generic if using expert personas system
- **Notes**: Requires expert persona system to be useful

#### 4. **conflict_resolution.mdc** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/user/conflict_resolution.mdc`
- **Description**: Product Manager resolves conflicts between expert personas
- **Usefulness**: ⭐⭐⭐⭐ Generic conflict resolution framework
- **Notes**: Useful decision-making framework even without personas

#### 5. **security.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/security.mdc`
- **Description**: Security best practices (OWASP Top 10, authentication, authorization, input validation)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - security applies to all projects
- **Notes**: Comprehensive security guidelines

#### 6. **error-handling.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/error-handling.mdc`
- **Description**: Error handling patterns and standards (error response format, HTTP status codes, NestJS patterns)
- **Usefulness**: ⭐⭐⭐⭐ Generic patterns (some NestJS-specific but concepts are universal)
- **Notes**: Focus on NestJS but concepts apply broadly

#### 7. **testing.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/testing.mdc`
- **Description**: Testing strategies (test pyramid, unit tests, integration tests, E2E tests, Angular/NestJS patterns)
- **Usefulness**: ⭐⭐⭐⭐ Generic testing concepts (Angular/NestJS specific examples but concepts are universal)
- **Notes**: Framework-specific examples but principles apply broadly

#### 8. **api-documentation.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/api-documentation.mdc`
- **Description**: API documentation standards (OpenAPI/Swagger, endpoint documentation)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - applies to any API project
- **Notes**: Comprehensive API documentation guidelines

#### 9. **naming-conventions.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/naming-conventions.mdc`
- **Description**: Naming conventions for files, variables, functions, components (Angular/NestJS patterns)
- **Usefulness**: ⭐⭐⭐⭐ Generic naming conventions (framework-specific examples but concepts apply)
- **Notes**: Framework-specific but naming principles are universal

#### 10. **pre_push_investigation.mdc** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/user/pre_push_investigation.mdc`
- **Description**: Process for investigating and fixing CI/CD failures before pushing
- **Usefulness**: ⭐⭐⭐ Generic workflow (has project-specific CI/CD details but process is useful)
- **Notes**: Process is generic but some details are project-specific

#### 11. **documentation-structure.mdc** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/rules/documentation-structure.mdc`
- **Description**: Documentation structure rule (features in `features/`, PRD.md, TASKS.md pattern)
- **Usefulness**: ⭐⭐⭐⭐ Generic if using similar documentation structure
- **Notes**: Useful if planning to use the same documentation structure pattern

### ⚠️ Project-Specific Rules (Skip These)

These rules are too specific to their projects:

#### 1. **git_workflow.mdc** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/user/git_workflow.mdc`
- **Description**: Very specific git workflow (feature/task/bug branches, development/main branches, TaskMaster integration)
- **Reason to Skip**: ⚠️ Very specific to games project workflow

#### 2. **git-workflow.mdc** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/rules/git-workflow.mdc`
- **Description**: Version-based git workflow (release/1.0.0, release/1.1.0 branches)
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's version-based workflow

#### 3. **git_commit_persona.mdc** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/user/git_commit_persona.mdc`
- **Description**: Set git config user.name to expert persona name before commits
- **Reason to Skip**: ⚠️ Specific to games project's expert persona system

#### 4. **general.mdc** (sandbox)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/.cursor/rules/user/general.mdc`
- **Description**: General rules including "Keel Component Usage Requirement"
- **Reason to Skip**: ⚠️ Has project-specific Keel component requirement

#### 5. **Expert Personas** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/experts/*.mdc`
- **Description**: 24 expert persona files (accessibility_expert, angular_expert, etc.)
- **Reason to Skip**: ⚠️ Specific to games project's expert persona system

#### 6. **TaskMaster Rules** (games, sandbox)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/rules/taskmaster/*.mdc`
- **Description**: TaskMaster workflow rules
- **Reason to Skip**: ⚠️ Specific to TaskMaster system integration

## Recommended Rules to Consider

Based on the review, here are the most generic and useful rules:

### Top Priority (Highly Generic):
1. ✅ **cursor_rules.mdc** - Rule structure guidelines
2. ✅ **self_improve.mdc** - Rule improvement process
3. ✅ **security.mdc** - Security best practices
4. ✅ **api-documentation.mdc** - API documentation standards

### Medium Priority (Generic with framework examples):
5. ✅ **error-handling.mdc** - Error handling patterns (NestJS examples but concepts are universal)
6. ✅ **testing.mdc** - Testing strategies (Angular/NestJS examples but concepts are universal)
7. ✅ **naming-conventions.mdc** - Naming conventions (framework-specific but principles are universal)

### Lower Priority (Useful if using similar systems):
8. ✅ **always_use_personas.mdc** - If using expert personas system
9. ✅ **conflict_resolution.mdc** - Useful decision-making framework
10. ✅ **documentation-structure.mdc** - If using similar documentation structure
11. ✅ **pre_push_investigation.mdc** - Generic CI/CD investigation process (needs cleanup)

## Database Rule Patterns

### Pattern 1: Database Design Rules

**Generic Rules**:
- Normalization rules (3NF minimum)
- Indexing rules (index foreign keys, frequently queried columns)
- Naming conventions (table names, column names)
- Data type selection rules
- Constraint rules (primary keys, foreign keys, unique constraints)

**Pattern**:
```markdown
# Database Design Rules

## Normalization
- Use 3NF (Third Normal Form) as minimum
- Denormalize only when performance requires it
- Document denormalization decisions

## Indexing
- Index all foreign keys
- Index frequently filtered columns
- Use composite indexes for multi-column queries
- Monitor index usage and remove unused indexes

## Naming Conventions
- Table names: plural, snake_case (users, user_profiles)
- Column names: snake_case (user_id, created_at)
- Index names: idx_<column> (idx_email, idx_user_id)
```

### Pattern 2: Database Query Rules

**Generic Rules**:
- Always use prepared statements
- Select only needed columns (no SELECT *)
- Use appropriate JOINs
- Implement pagination for large result sets
- Avoid N+1 query problems

**Pattern**:
```markdown
# Database Query Rules

## Query Optimization
- ✅ DO: SELECT id, name, email FROM users
- ❌ DON'T: SELECT * FROM users
- ✅ DO: Use JOINs instead of multiple queries
- ❌ DON'T: N+1 query patterns
- ✅ DO: Use LIMIT for pagination
- ❌ DON'T: Fetch all rows without pagination
```

### Pattern 3: Database Migration Rules

**Generic Rules**:
- Migrations must be idempotent
- Migrations must have rollback procedures
- Migrations must be tested before deployment
- Migration files must be version controlled

**Pattern**:
```markdown
# Database Migration Rules

## Migration Requirements
- All migrations must be idempotent (use IF NOT EXISTS)
- All migrations must have rollback procedures
- Migrations must be tested in staging before production
- Migration files must be version controlled
- Migration execution must be logged
```

### Pattern 4: Database Performance Rules

**Generic Rules**:
- Monitor slow queries
- Optimize queries with EXPLAIN
- Use connection pooling
- Cache frequently accessed data
- Monitor database performance metrics

**Pattern**:
```markdown
# Database Performance Rules

## Performance Requirements
- Queries must complete within timeout limits
- Slow queries must be logged and optimized
- Connection pooling must be configured
- Query performance must be monitored
- Database indexes must be optimized
```

## Notes

- Rules marked with ⭐⭐⭐⭐⭐ are highly generic and recommended
- Rules with framework-specific examples (Angular/NestJS) can still be useful for concepts
- Project-specific rules should be skipped or heavily adapted
- Some rules may need adaptation for this project's context
- Database rules should enforce best practices for schema design, queries, and migrations
- Database performance rules help maintain system performance
- Database migration rules ensure safe schema changes
- Analytics rules should enforce data collection, processing, and reporting best practices
- Analytics rules should ensure data accuracy and privacy compliance
- Analytics rules should optimize for performance with large datasets

## Analytics & Business Intelligence Rule Patterns

### Pattern 1: Analytics Data Collection Rules

**Generic Rules**:
- Always anonymize user identifiers
- Validate data before collection
- Batch events for efficiency
- Handle errors gracefully
- Comply with privacy regulations

**Pattern**:
```markdown
# Analytics Data Collection Rules

## Event Tracking
- ✅ DO: Anonymize user identifiers before tracking
- ❌ DON'T: Track personally identifiable information
- ✅ DO: Batch events for efficiency
- ❌ DON'T: Send individual events synchronously
- ✅ DO: Validate event data structure
- ❌ DON'T: Track invalid or malformed events

## Privacy Compliance
- All user identifiers must be anonymized
- PII must be removed before collection
- Data retention policies must be enforced
- User consent must be obtained for tracking
```

### Pattern 2: Analytics Metrics Rules

**Generic Rules**:
- Calculate metrics accurately
- Cache frequently accessed metrics
- Optimize metric queries
- Validate metric calculations
- Document metric definitions

**Pattern**:
```markdown
# Analytics Metrics Rules

## Metric Calculation
- ✅ DO: Calculate metrics from source data
- ❌ DON'T: Use cached metrics for critical calculations
- ✅ DO: Validate metric calculations
- ❌ DON'T: Use unvalidated metric values
- ✅ DO: Cache frequently accessed metrics
- ❌ DON'T: Recalculate metrics on every request

## Metric Definition
- All metrics must be clearly defined
- Metric formulas must be documented
- Metric units must be specified
- Metric calculation methods must be consistent
```

### Pattern 3: Analytics Dashboard Rules

**Generic Rules**:
- Optimize dashboard queries
- Cache dashboard data
- Support filtering and drill-down
- Ensure mobile responsiveness
- Support accessibility requirements

**Pattern**:
```markdown
# Analytics Dashboard Rules

## Dashboard Performance
- ✅ DO: Cache dashboard data
- ❌ DON'T: Query raw data on every request
- ✅ DO: Optimize dashboard queries
- ❌ DON'T: Use inefficient queries
- ✅ DO: Support pagination for large datasets
- ❌ DON'T: Load all data at once

## Dashboard Design
- Dashboards must be mobile-responsive
- Dashboards must support accessibility
- Dashboards must have clear visualizations
- Dashboards must support filtering
- Dashboards must support drill-down
```

### Pattern 4: Analytics Report Rules

**Generic Rules**:
- Generate reports accurately
- Support multiple export formats
- Schedule reports appropriately
- Handle report generation errors
- Validate report data

**Pattern**:
```markdown
# Analytics Report Rules

## Report Generation
- ✅ DO: Validate report data before generation
- ❌ DON'T: Generate reports with invalid data
- ✅ DO: Support multiple export formats
- ❌ DON'T: Limit to single export format
- ✅ DO: Handle report generation errors
- ❌ DON'T: Fail silently on errors

## Report Scheduling
- Reports must be scheduled appropriately
- Report generation must be monitored
- Report failures must be alerted
- Report data must be validated
- Report templates must be version controlled
```

### Pattern 5: Analytics Data Warehouse Rules

**Generic Rules**:
- Optimize ETL pipelines
- Maintain data warehouse health
- Archive old data appropriately
- Optimize data warehouse queries
- Monitor data warehouse performance

**Pattern**:
```markdown
# Analytics Data Warehouse Rules

## ETL Pipeline
- ✅ DO: Optimize ETL pipeline performance
- ❌ DON'T: Process data inefficiently
- ✅ DO: Handle ETL errors gracefully
- ❌ DON'T: Fail silently on errors
- ✅ DO: Monitor ETL pipeline performance
- ❌ DON'T: Ignore pipeline performance issues

## Data Warehouse Maintenance
- Old data must be archived before deletion
- Indexes must be optimized regularly
- Data warehouse size must be monitored
- Data integrity must be verified
- Performance must be monitored
```

### Analytics Rule Best Practices

1. **Data Collection Rules**:
   - Enforce privacy compliance
   - Require data validation
   - Support batch processing
   - Handle errors gracefully

2. **Metrics Rules**:
   - Ensure metric accuracy
   - Require metric documentation
   - Support metric caching
   - Validate metric calculations

3. **Dashboard Rules**:
   - Optimize for performance
   - Support interactivity
   - Ensure accessibility
   - Support mobile devices

4. **Report Rules**:
   - Ensure report accuracy
   - Support multiple formats
   - Handle errors appropriately
   - Schedule reports appropriately

---

**Next Steps**: Review each recommended rule and decide which ones to adopt/adapt for this project.

---

## Review/Contribution

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this generic rules review document by adding comprehensive "Database Rule Patterns" section covering database design rules (normalization rules with 3NF minimum and denormalization guidelines, indexing rules with foreign key and query optimization, naming conventions with table/column/index naming patterns), database query rules (prepared statements requirement, SELECT column optimization, JOIN usage, pagination requirements, N+1 query prevention), database migration rules (idempotency requirements, rollback procedures, testing requirements, version control requirements, logging requirements), database performance rules (slow query monitoring, EXPLAIN optimization, connection pooling, caching, performance metrics monitoring). Enhanced "Notes" section with database-specific rule considerations (best practices enforcement, performance maintenance, safe schema changes). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide practical, production-ready patterns for database rule implementation, ensuring database operations follow best practices for schema design, query optimization, migration management, and performance monitoring.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Enhanced this generic rules review document by adding comprehensive "Analytics & Business Intelligence Rule Patterns" section covering analytics data collection rules (always anonymize user identifiers, validate data before collection, batch events for efficiency, handle errors gracefully, comply with privacy regulations with event tracking rules for anonymization, batching, validation, privacy compliance rules for PII removal, data retention, user consent), analytics metrics rules (calculate metrics accurately, cache frequently accessed metrics, optimize metric queries, validate metric calculations, document metric definitions with metric calculation rules for source data usage, validation, caching, metric definition rules for clear definitions, documented formulas, specified units, consistent calculation methods), analytics dashboard rules (optimize dashboard queries, cache dashboard data, support filtering and drill-down, ensure mobile responsiveness, support accessibility requirements with dashboard performance rules for caching, query optimization, pagination, dashboard design rules for mobile responsiveness, accessibility, clear visualizations, filtering, drill-down), analytics report rules (generate reports accurately, support multiple export formats, schedule reports appropriately, handle report generation errors, validate report data with report generation rules for data validation, multiple export formats, error handling, report scheduling rules for appropriate scheduling, monitoring, alerting, data validation, template version control), analytics data warehouse rules (optimize ETL pipelines, maintain data warehouse health, archive old data appropriately, optimize data warehouse queries, monitor data warehouse performance with ETL pipeline rules for performance optimization, error handling, performance monitoring, data warehouse maintenance rules for data archiving, index optimization, size monitoring, data integrity verification, performance monitoring), and analytics rule best practices (data collection rules with privacy compliance enforcement, data validation requirements, batch processing support, graceful error handling, metrics rules with metric accuracy, documentation requirements, caching support, calculation validation, dashboard rules with performance optimization, interactivity support, accessibility, mobile device support, report rules with report accuracy, multiple format support, appropriate error handling, appropriate scheduling). Enhanced "Notes" section with analytics-specific rule considerations (analytics rules should enforce data collection, processing, and reporting best practices, analytics rules should ensure data accuracy and privacy compliance, analytics rules should optimize for performance with large datasets). This addition provides essential BI/Analytics perspective on generic rules, ensuring analytics operations follow best practices for data collection, metrics calculation, dashboard design, report generation, and data warehouse management through enforceable rules and standards.

---
