# Generic Commands Review

This document lists generic/useful commands found in other projects that could be helpful across multiple projects.

**Last Updated**: 2025-01-05

## Commands Found in Other Projects

### ✅ Generic/Useful Commands (Recommended for Review)

These commands are generic enough to be useful across multiple projects:

#### 1. **commit** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/commit.md`
- **Description**: Simple commit to current branch (with optional message)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - basic git commit workflow
- **Notes**: 
  - Games version: Executes `.cursor/scripts/commit.sh` script
  - Discord-story-bot version: More detailed with review process and commit type detection
  - Both are useful, discord-story-bot version is more comprehensive

#### 2. **push** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/push.md`
- **Description**: Commit changes and push to origin
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - basic git push workflow
- **Notes**: Simple workflow that applies to any git project

#### 3. **update** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/update.md`
- **Description**: Update branch workflow (fetch, rebase, merge, push)
- **Usefulness**: ⭐⭐⭐⭐ Generic concept but workflow-specific
- **Notes**: 
  - Games version: Updates with development branch
  - Discord-story-bot version: Updates with main branch
  - Concept is generic, implementation depends on branch strategy

#### 4. **help** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/commands/help.md`
- **Description**: Display help information for commands (list all or specific command)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - helpful for any project with commands
- **Notes**: Useful meta-command for discovering available commands

### ⚠️ Project-Specific Commands (Skip These)

These commands are too specific to their projects:

#### 1. **dev** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/dev.md`
- **Description**: Merge to development branch (local, no push)
- **Reason to Skip**: ⚠️ Specific to games project's development/main branch workflow

#### 2. **stage** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/stage.md`
- **Description**: Stage/approve workflow - merge to development and push
- **Reason to Skip**: ⚠️ Specific to games project's development branch workflow

#### 3. **main** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/main.md`
- **Description**: Merge current branch to main/master
- **Reason to Skip**: ⚠️ Workflow-specific, depends on branch strategy

#### 4. **prod** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/prod.md`
- **Description**: Push to production workflow
- **Reason to Skip**: ⚠️ Workflow-specific, depends on deployment strategy

#### 5. **feature** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/feature.md`
- **Description**: 
  - Games: Complex feature workflow with TaskMaster integration, PRD generation, expert reviews
  - Discord-story-bot: Create feature branch with version increment
- **Reason to Skip**: ⚠️ Both are very project-specific workflows

#### 6. **task** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/task.md`
- **Description**: Create a manual task in TaskMaster
- **Reason to Skip**: ⚠️ Specific to TaskMaster system integration

#### 7. **release** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/commands/release.md`
- **Description**: Complete a version release with changelog generation
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's version-based workflow

#### 8. **major/minor/hotfix/latest** (discord-story-bot)
- **Location**: Various files in discord-story-bot
- **Description**: Version-based branch creation (release/1.0.0, release/1.1.0, etc.)
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's version-based workflow

#### 9. **backup/restore/upload-db/download-db** (discord-story-bot)
- **Location**: Various files in discord-story-bot
- **Description**: Database backup/restore operations for EC2/S3
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's AWS deployment setup

## Recommended Commands to Consider

Based on the review, here are the most generic and useful commands:

### Top Priority (Highly Generic):
1. ✅ **commit** - Basic git commit workflow (discord-story-bot version is more comprehensive)
   - Review changes before committing
   - Check for sensitive files
   - Determine commit type
   - Generate/provide commit message

2. ✅ **push** - Basic git push workflow
   - Commit changes if any exist
   - Push to origin
   - Simple and generic

3. ✅ **help** - Command help/discovery system
   - List all available commands
   - Show detailed help for specific command
   - Useful meta-command

### Lower Priority (Workflow-Dependent):
4. ✅ **update** - Branch update workflow (needs adaptation)
   - Generic concept: fetch, rebase, merge
   - Implementation depends on branch strategy (development vs main)
   - Can be adapted to any workflow

## Command Patterns Observed

### Common Patterns:
1. **Script-based commands** (games): Commands execute `.cursor/scripts/*.sh` scripts
2. **Direct workflow commands** (discord-story-bot): Commands describe workflow steps
3. **Help system**: Commands have documentation in `.cursor/commands/*.md` files

### Command File Format:
- Commands are markdown files (`.md`) in `.cursor/commands/` directory
- Format: Description, Usage, Workflow/Process, Examples
- Can reference scripts or describe direct workflows

## Database Command Patterns

### Pattern 1: Database Migration Commands

**Generic Commands**:
- `migrate` - Run pending database migrations
- `migrate:rollback` - Rollback last migration
- `migrate:status` - Show migration status
- `migrate:create <name>` - Create new migration file
- `migrate:validate` - Validate migration files

**Pattern**:
```bash
# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:rollback

# Show migration status
npm run migrate:status

# Create new migration
npm run migrate:create add_user_profile_table
```

### Pattern 2: Database Query Commands

**Generic Commands**:
- `db:query <sql>` - Execute SQL query
- `db:explain <sql>` - Explain query execution plan
- `db:indexes` - List all indexes
- `db:slow-queries` - Show slow queries

**Pattern**:
```bash
# Execute query
npm run db:query "SELECT * FROM users LIMIT 10"

# Explain query
npm run db:explain "SELECT * FROM users WHERE email = 'test@example.com'"

# List indexes
npm run db:indexes

# Show slow queries
npm run db:slow-queries
```

### Pattern 3: Database Backup Commands

**Generic Commands**:
- `db:backup` - Create database backup
- `db:restore <file>` - Restore database from backup
- `db:backup:list` - List available backups

**Pattern**:
```bash
# Create backup
npm run db:backup

# Restore backup
npm run db:restore backup_20260105_120000.sql

# List backups
npm run db:backup:list
```

### Pattern 4: Database Performance Commands

**Generic Commands**:
- `db:analyze` - Analyze table statistics
- `db:optimize` - Optimize tables
- `db:health` - Check database health

**Pattern**:
```bash
# Analyze tables
npm run db:analyze

# Optimize tables
npm run db:optimize

# Check database health
npm run db:health
```

## Notes

- Commands marked with ⭐⭐⭐⭐⭐ are highly generic and recommended
- Workflow-specific commands (dev, stage, main, prod) should be skipped or heavily adapted
- Script-based commands require corresponding shell scripts
- Direct workflow commands are self-contained in the markdown file
- Some commands may need adaptation for this project's workflow
- Database commands should support multiple database types
- Database migration commands should include rollback support
- Database backup commands should support cloud storage
- Database performance commands should provide actionable insights
- Analytics commands should support data collection, processing, and reporting
- Analytics commands should ensure data accuracy and privacy compliance
- Analytics commands should optimize for performance with large datasets

## Analytics & Business Intelligence Command Patterns

### Pattern 1: Analytics Data Collection Commands

**Generic Commands**:
- `analytics:track <event>` - Track analytics event
- `analytics:batch` - Process batched events
- `analytics:validate` - Validate analytics data
- `analytics:anonymize` - Anonymize user identifiers

**Pattern**:
```bash
# Track event
npm run analytics:track "page_view" -- --page="/dashboard" --userId="user123"

# Process batched events
npm run analytics:batch

# Validate analytics data
npm run analytics:validate

# Anonymize user identifiers
npm run analytics:anonymize
```

### Pattern 2: Analytics Metrics Commands

**Generic Commands**:
- `analytics:metrics` - Show analytics metrics
- `analytics:metrics:calculate` - Calculate metrics
- `analytics:metrics:aggregate` - Aggregate metrics
- `analytics:metrics:export` - Export metrics

**Pattern**:
```bash
# Show metrics
npm run analytics:metrics -- --timeRange="30d" --category="spending"

# Calculate metrics
npm run analytics:metrics:calculate -- --type="savings-rate" --month="2026-01"

# Aggregate metrics
npm run analytics:metrics:aggregate -- --period="daily" --start="2026-01-01"

# Export metrics
npm run analytics:metrics:export -- --format="csv" --output="./metrics.csv"
```

### Pattern 3: Analytics Dashboard Commands

**Generic Commands**:
- `analytics:dashboard:generate` - Generate dashboard data
- `analytics:dashboard:cache` - Cache dashboard data
- `analytics:dashboard:export` - Export dashboard

**Pattern**:
```bash
# Generate dashboard data
npm run analytics:dashboard:generate -- --timeRange="30d" --filters="category=food"

# Cache dashboard data
npm run analytics:dashboard:cache -- --ttl=3600

# Export dashboard
npm run analytics:dashboard:export -- --format="png" --output="./dashboard.png"
```

### Pattern 4: Analytics Report Commands

**Generic Commands**:
- `analytics:report:generate` - Generate analytics report
- `analytics:report:schedule` - Schedule report generation
- `analytics:report:export` - Export report

**Pattern**:
```bash
# Generate report
npm run analytics:report:generate -- --type="monthly" --month="2026-01"

# Schedule report
npm run analytics:report:schedule -- --type="weekly" --day="monday" --time="09:00"

# Export report
npm run analytics:report:export -- --report="monthly_2026-01" --format="pdf"
```

### Pattern 5: Analytics Data Warehouse Commands

**Generic Commands**:
- `analytics:warehouse:migrate` - Run analytics migrations
- `analytics:warehouse:aggregate` - Aggregate data warehouse data
- `analytics:warehouse:maintain` - Maintain data warehouse
- `analytics:warehouse:health` - Check data warehouse health

**Pattern**:
```bash
# Run analytics migrations
npm run analytics:warehouse:migrate

# Aggregate data warehouse data
npm run analytics:warehouse:aggregate -- --period="daily" --date="2026-01-05"

# Maintain data warehouse
npm run analytics:warehouse:maintain -- --retention-days=90

# Check data warehouse health
npm run analytics:warehouse:health
```

### Analytics Command Best Practices

1. **Data Collection Commands**:
   - Support batch processing
   - Validate data before processing
   - Handle errors gracefully
   - Anonymize user identifiers

2. **Metrics Commands**:
   - Support time range filtering
   - Support dimension filtering
   - Optimize for performance
   - Cache frequently accessed metrics

3. **Dashboard Commands**:
   - Support filtering and drill-down
   - Cache dashboard data
   - Support multiple export formats
   - Optimize for large datasets

4. **Report Commands**:
   - Support scheduled generation
   - Support multiple report types
   - Support multiple export formats
   - Handle report generation errors

---

**Next Steps**: Review each recommended command and decide which ones to adopt/adapt for this project, and whether to use script-based or direct workflow approach.

---

## Review/Contribution

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this generic commands review document by adding comprehensive "Database Command Patterns" section covering database migration commands (migrate, migrate:rollback, migrate:status, migrate:create, migrate:validate with usage examples), database query commands (db:query, db:explain, db:indexes, db:slow-queries with SQL execution and analysis examples), database backup commands (db:backup, db:restore, db:backup:list with backup/restore workflow examples), database performance commands (db:analyze, db:optimize, db:health with table analysis and optimization examples). Enhanced "Notes" section with database-specific command considerations (multi-database support, rollback support, cloud storage support, actionable insights). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide practical, production-ready patterns for database command implementation, ensuring database operations can be performed efficiently through command-line interfaces with proper migration, query, backup, and performance management capabilities.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Enhanced this generic commands review document by adding comprehensive "Analytics & Business Intelligence Command Patterns" section covering analytics data collection commands (analytics:track for tracking analytics events, analytics:batch for processing batched events, analytics:validate for validating analytics data, analytics:anonymize for anonymizing user identifiers with usage examples), analytics metrics commands (analytics:metrics for showing analytics metrics with time range and category filtering, analytics:metrics:calculate for calculating metrics with type and month parameters, analytics:metrics:aggregate for aggregating metrics with period and start date, analytics:metrics:export for exporting metrics with format and output options with usage examples), analytics dashboard commands (analytics:dashboard:generate for generating dashboard data with time range and filters, analytics:dashboard:cache for caching dashboard data with TTL, analytics:dashboard:export for exporting dashboard with format and output options with usage examples), analytics report commands (analytics:report:generate for generating analytics reports with type and month parameters, analytics:report:schedule for scheduling report generation with type, day, and time parameters, analytics:report:export for exporting reports with report ID and format options with usage examples), analytics data warehouse commands (analytics:warehouse:migrate for running analytics migrations, analytics:warehouse:aggregate for aggregating data warehouse data with period and date parameters, analytics:warehouse:maintain for maintaining data warehouse with retention days, analytics:warehouse:health for checking data warehouse health with usage examples), and analytics command best practices (data collection commands with batch processing, data validation, error handling, user identifier anonymization, metrics commands with time range and dimension filtering, performance optimization, metric caching, dashboard commands with filtering and drill-down, dashboard data caching, multiple export formats, large dataset optimization, report commands with scheduled generation, multiple report types, multiple export formats, report generation error handling). Enhanced "Notes" section with analytics-specific command considerations (analytics commands should support data collection, processing, and reporting, analytics commands should ensure data accuracy and privacy compliance, analytics commands should optimize for performance with large datasets). This addition provides essential BI/Analytics perspective on generic commands, ensuring analytics operations can be performed efficiently through command-line interfaces with proper data collection, metrics calculation, dashboard generation, report generation, and data warehouse management capabilities.

---
