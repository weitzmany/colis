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

---

**Next Steps**: Review each recommended rule and decide which ones to adopt/adapt for this project.

---

## Review/Contribution

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this generic rules review document by adding comprehensive "Database Rule Patterns" section covering database design rules (normalization rules with 3NF minimum and denormalization guidelines, indexing rules with foreign key and query optimization, naming conventions with table/column/index naming patterns), database query rules (prepared statements requirement, SELECT column optimization, JOIN usage, pagination requirements, N+1 query prevention), database migration rules (idempotency requirements, rollback procedures, testing requirements, version control requirements, logging requirements), database performance rules (slow query monitoring, EXPLAIN optimization, connection pooling, caching, performance metrics monitoring). Enhanced "Notes" section with database-specific rule considerations (best practices enforcement, performance maintenance, safe schema changes). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide practical, production-ready patterns for database rule implementation, ensuring database operations follow best practices for schema design, query optimization, migration management, and performance monitoring.

---
