# Additional Resources Review

This document lists other useful resources and patterns found in other projects that could be helpful to review.

**Last Updated**: 2025-01-05

## What We've Already Reviewed

✅ **Rules** - `.cursor/rules/` files  
✅ **Commands** - `.cursor/commands/` files  
✅ **Features** - Feature documentation (PRDs, TASKS)  
✅ **Experts** - Expert personas/agents  
✅ **MCP Configurations** - MCP server configurations

## Additional Resources to Consider

### 1. **Scripts** (Generic/Useful)
- **Location**: `.cursor/scripts/` and `scripts/` directories
- **Description**: Shell scripts for automation (git workflows, setup, deployment)
- **Usefulness**: ⭐⭐⭐⭐ Generic patterns for automation
- **Examples Found**:
  - Git workflow scripts (commit.sh, push.sh, update.sh)
  - Setup scripts (setup-git-hooks.sh, setup-env-vars.sh)
  - Testing scripts (test-auth-endpoints.sh, ci-local.sh)
  - Deployment scripts (deploy-to-ec2.sh, upload-db-to-s3.sh)
  - SSL/certificate scripts (generate-cert.sh)
- **Notes**: Scripts can be workflow-specific, but patterns are reusable

### 2. **Project Structure Patterns** (Highly Useful)
- **Location**: Various projects (monorepo structure, directory organization)
- **Description**: How projects are organized (monorepo, packages, frontend/backend split)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - structure patterns apply everywhere
- **Examples Found**:
  - **Monorepo pattern** (sandbox/keel): `packages/rig/`, `packages/layout/`, etc.
  - **Full-stack split** (games): `backend/`, `frontend/`, `docs/`
  - **Next.js app structure** (spoon-me): `app/`, `components/`, `lib/`, `types/`
  - **Library structure** (sandbox/keel): Package-based organization
- **Notes**: Excellent reference for organizing new projects

### 3. **CI/CD Workflows** (Generic Patterns)
- **Location**: `.github/workflows/` directories
- **Description**: GitHub Actions workflows for CI/CD
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - CI/CD patterns are reusable
- **Examples to Look For**:
  - Build and test workflows
  - Deployment workflows
  - Linting/formatting workflows
  - Security scanning workflows
- **Notes**: Common CI/CD patterns apply across projects

### 4. **Configuration Files** (Generic Patterns)
- **Location**: Root directories (package.json, tsconfig.json, docker-compose.yml, etc.)
- **Description**: Configuration file patterns and best practices
- **Usefulness**: ⭐⭐⭐⭐ Generic patterns but tech-specific
- **Examples to Look For**:
  - `package.json` structure and scripts
  - `tsconfig.json` configurations
  - `docker-compose.yml` setups
  - `eslint.config.mjs` configurations
  - `.gitignore` patterns
- **Notes**: Configuration patterns are tech-specific but concepts are reusable

### 5. **Documentation Patterns** (Beyond Features)
- **Location**: `docs/` directories (setup guides, README templates)
- **Description**: Documentation structure beyond feature PRDs
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - documentation patterns are universal
- **Examples to Look For**:
  - README.md templates
  - Setup guides (SETUP_GUIDE.md, DOCKER_GUIDE.md)
  - Deployment documentation (DEPLOYMENT_CHECKLIST.md)
  - Architecture documentation patterns
  - Contributing guidelines (CONTRIBUTING.md)
- **Notes**: Documentation structure and templates are highly reusable

### 6. **Testing Structure** (Generic Patterns)
- **Location**: `tests/`, `e2e/`, `*.spec.ts`, `*.test.ts` files
- **Description**: Testing structure and organization patterns
- **Usefulness**: ⭐⭐⭐⭐ Generic testing concepts, framework-specific
- **Examples to Look For**:
  - Test directory structure
  - Test utilities and helpers
  - E2E test patterns
  - Test configuration files
- **Notes**: Testing concepts are universal, implementations are framework-specific

### 7. **Environment Setup Patterns** (Generic/Useful)
- **Location**: Setup guides, docker-compose files, .env.example files
- **Description**: Development environment setup patterns
- **Usefulness**: ⭐⭐⭐⭐ Generic setup patterns
- **Examples to Look For**:
  - Docker setup patterns
  - Environment variable patterns (.env.example)
  - Local development setup guides
  - Database setup patterns
- **Notes**: Environment setup patterns are reusable

### 8. **Database Schemas / Migrations** (Reference)
- **Location**: Database files, migration scripts, schema files
- **Description**: Database structure and migration patterns
- **Usefulness**: ⭐⭐⭐ Reference for database design
- **Examples to Look For**:
  - Migration file structure
  - Schema design patterns
  - Seed data patterns
- **Notes**: Database patterns depend on database type but concepts are reusable

### 9. **API Structure Patterns** (Generic/Useful)
- **Location**: API route directories (`app/api/`, `routes/`, controllers)
- **Description**: API organization and structure patterns
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - API structure applies to all APIs
- **Examples to Look For**:
  - RESTful route organization
  - API versioning patterns
  - Controller/service patterns
  - Request/response patterns
- **Notes**: API structure patterns are highly reusable

### 10. **Component Structure Patterns** (Framework-Specific but Useful)
- **Location**: `components/`, `src/` directories
- **Description**: Component organization and structure
- **Usefulness**: ⭐⭐⭐⭐ Framework-specific but patterns are useful
- **Examples to Look For**:
  - Component file organization
  - Component naming conventions
  - Shared component patterns
  - Component library structure (keel)
- **Notes**: Framework-specific but organizational patterns are reusable

### 11. **Build & Deployment Scripts** (Generic Patterns)
- **Location**: `scripts/`, package.json scripts
- **Description**: Build and deployment automation
- **Usefulness**: ⭐⭐⭐⭐ Generic deployment concepts
- **Examples to Look For**:
  - Build scripts
  - Deployment scripts
  - AWS deployment patterns
  - Docker build patterns
- **Notes**: Deployment patterns depend on platform but concepts are reusable

### 12. **Git Hooks** (Generic/Useful)
- **Location**: `.git/hooks/`, `pre-push`, setup scripts
- **Description**: Git hooks for automation (pre-push, pre-commit)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - git hooks are universal
- **Examples to Look For**:
  - Pre-push hooks (testing, linting)
  - Pre-commit hooks (formatting, checks)
  - Hook setup scripts
- **Notes**: Git hook patterns are highly reusable

## Recommended Additional Resources to Review

### Top Priority (Highly Generic):

1. ✅ **Scripts** - Automation patterns (git workflows, setup, testing)
2. ✅ **Project Structure Patterns** - How to organize projects (monorepo, full-stack, etc.)
3. ✅ **Documentation Patterns** - README templates, setup guides, contributing guidelines
4. ✅ **CI/CD Workflows** - GitHub Actions patterns
5. ✅ **API Structure Patterns** - RESTful organization, versioning
6. ✅ **Git Hooks** - Pre-push, pre-commit automation

### Medium Priority (Useful but Tech-Specific):

7. ✅ **Configuration Files** - package.json, tsconfig.json, docker-compose patterns
8. ✅ **Testing Structure** - Test organization and utilities
9. ✅ **Environment Setup** - Docker, .env patterns, local setup
10. ✅ **Component Structure** - Framework-specific but organizational patterns
11. ✅ **Build & Deployment** - Build scripts, deployment patterns

### Lower Priority (Reference):

12. ✅ **Database Schemas** - Migration patterns, schema design
13. ✅ **Component Library Structure** - If building libraries (keel example)

## Summary

**Already Reviewed**: Rules, Commands, Features, Experts, MCP Configurations

**Additional Resources Reviewed** (Detailed Lists Created):
- ✅ [Scripts Review](./SCRIPTS_REVIEW.md) - Automation patterns
- ✅ [Project Structure Patterns Review](./PROJECT_STRUCTURE_REVIEW.md) - Organization patterns
- ✅ [CI/CD Workflows Review](./CICD_WORKFLOWS_REVIEW.md) - GitHub Actions patterns
- ✅ [Configuration Files Review](./CONFIGURATION_FILES_REVIEW.md) - package.json, tsconfig, docker patterns
- ✅ [Documentation Patterns Review](./DOCUMENTATION_PATTERNS_REVIEW.md) - README templates, guides
- ✅ [Testing Structure Review](./TESTING_STRUCTURE_REVIEW.md) - Test organization patterns
- ✅ [Environment Setup Review](./ENVIRONMENT_SETUP_REVIEW.md) - Docker, .env patterns
- ✅ [API Structure Patterns Review](./API_STRUCTURE_REVIEW.md) - RESTful organization
- ✅ [Component Structure Review](./COMPONENT_STRUCTURE_REVIEW.md) - Framework patterns
- ✅ [Build & Deployment Review](./BUILD_DEPLOYMENT_REVIEW.md) - Automation patterns
- ✅ [Git Hooks Review](./GIT_HOOKS_REVIEW.md) - Pre-push, pre-commit patterns
- ✅ [Database Schemas Review](./DATABASE_SCHEMAS_REVIEW.md) - Migration patterns

---

**All 12 categories have been reviewed and documented.**

## Documentation Best Practices for Resource Reviews

### Structure and Organization

When creating resource review documents, follow these documentation patterns:

1. **Clear Document Purpose**
   - Start with a clear introduction explaining what the document covers
   - Define the scope and intended audience
   - Explain how the document fits into the larger documentation structure

2. **Consistent Section Format**
   - Use consistent headings and subheadings
   - Follow a standard structure for each resource category:
     - Location (where to find examples)
     - Description (what the resource is)
     - Usefulness rating (how generic/reusable it is)
     - Examples found (specific instances)
     - Notes (context and considerations)

3. **Prioritization and Categorization**
   - Group resources by priority (Top Priority, Medium Priority, Lower Priority)
   - Use clear visual indicators (✅, ⭐) for quick scanning
   - Provide rationale for prioritization

4. **Cross-References and Links**
   - Link to detailed review documents when they exist
   - Reference related resources and patterns
   - Maintain a clear navigation structure

### Documentation Templates for Resource Reviews

#### Template for Individual Resource Entry

```markdown
### [Number]. **[Resource Name]** ([Category])
- **Location**: [Where to find examples]
- **Description**: [What the resource is and its purpose]
- **Usefulness**: ⭐⭐⭐⭐⭐ [Rating with brief explanation]
- **Examples Found**:
  - [Specific example 1]
  - [Specific example 2]
- **Notes**: [Context, considerations, limitations]
```

#### Template for Review Document Structure

```markdown
# [Resource Category] Review

[Brief introduction explaining the purpose and scope]

**Last Updated**: [Date]

## Overview
[High-level summary of what was reviewed]

## Resources Reviewed
[Detailed entries using the template above]

## Patterns Identified
[Common patterns and best practices found]

## Recommendations
[Actionable recommendations based on findings]

## Related Resources
[Links to related review documents]

## Summary
[Summary of findings and next steps]
```

### Maintaining Review Documents

1. **Version Control**
   - Update "Last Updated" date when making changes
   - Track significant changes in version history
   - Use clear commit messages when updating

2. **Regular Review Cycles**
   - Schedule periodic reviews of review documents
   - Update examples as projects evolve
   - Remove outdated or no longer relevant resources

3. **Completeness Checks**
   - Verify all links are working
   - Ensure all referenced documents exist
   - Check that examples are still current

4. **Status Tracking**
   - Use clear status indicators (✅ for completed, ⏳ for in progress)
   - Track review completion status
   - Maintain a summary of what's been reviewed

### Documentation Workflow for Resource Reviews

#### Phase 1: Discovery
1. Identify resource categories to review
2. Locate examples across projects
3. Document findings in initial list format

#### Phase 2: Analysis
1. Analyze patterns and commonalities
2. Categorize by usefulness and priority
3. Identify best practices and recommendations

#### Phase 3: Documentation
1. Create detailed review documents
2. Use consistent templates and structure
3. Add cross-references and links

#### Phase 4: Maintenance
1. Update documents as projects evolve
2. Add new resources as they're discovered
3. Remove outdated information

### Best Practices for Documenting Patterns

1. **Be Specific**
   - Include actual file paths and locations
   - Provide concrete examples, not just descriptions
   - Show real code snippets or configurations when helpful

2. **Provide Context**
   - Explain why a pattern is useful
   - Describe when to use each pattern
   - Note limitations and trade-offs

3. **Use Visual Indicators**
   - Star ratings for usefulness (⭐⭐⭐⭐⭐)
   - Checkmarks for completion status (✅)
   - Clear section dividers and hierarchy

4. **Make It Actionable**
   - Include recommendations for implementation
   - Provide templates and examples
   - Link to detailed documentation

### Discoverability and Navigation

1. **Table of Contents**
   - For longer documents, include a TOC
   - Use clear, descriptive headings
   - Enable easy navigation to specific sections

2. **Index Documents**
   - Maintain master index (like this document)
   - Link to all review documents
   - Provide quick reference for finding resources

3. **Search-Friendly Structure**
   - Use descriptive headings and keywords
   - Include relevant terms in descriptions
   - Structure content for easy scanning

4. **Cross-Reference System**
   - Link related review documents
   - Reference patterns across documents
   - Maintain a clear documentation graph

### Quality Standards for Review Documents

1. **Completeness**
   - All listed resources should have corresponding review documents
   - Review documents should cover all identified patterns
   - Examples should be current and relevant

2. **Accuracy**
   - File paths and locations should be correct
   - Examples should be verified
   - Links should be working

3. **Clarity**
   - Use clear, concise language
   - Avoid unnecessary jargon
   - Explain technical terms when needed

4. **Consistency**
   - Follow established templates
   - Use consistent formatting
   - Maintain uniform structure across documents

### Documentation Metrics and Tracking

Track the following metrics for review documentation:

1. **Coverage**
   - Number of resource categories identified
   - Number of categories with detailed reviews
   - Percentage of coverage

2. **Completeness**
   - Number of examples documented per category
   - Number of patterns identified
   - Number of recommendations provided

3. **Maintenance**
   - Last update date for each document
   - Frequency of updates
   - Number of outdated references

4. **Usage**
   - Document access patterns (if available)
   - Most referenced review documents
   - Common search terms

### Example: Complete Resource Review Document Structure

```markdown
# [Resource Category] Review

[Introduction with purpose and scope]

**Last Updated**: [Date]

## Overview
[Summary of what was reviewed and key findings]

## Resources Reviewed

### 1. [Resource Name]
[Detailed entry using template]

### 2. [Resource Name]
[Detailed entry using template]

## Patterns Identified

### Pattern 1: [Pattern Name]
- **Description**: [What the pattern is]
- **Use Cases**: [When to use it]
- **Examples**: [Where it's found]
- **Best Practices**: [Recommendations]

### Pattern 2: [Pattern Name]
[Same structure]

## Recommendations

1. [Recommendation 1]
2. [Recommendation 2]

## Implementation Guide

[Step-by-step guide for using these patterns]

## Related Resources

- [Link to related review]
- [Link to related documentation]

## Summary

[Summary of findings and next steps]

---

## Review/Contribution

[Expert signature block]
```

### Documentation Checklist for Resource Reviews

When creating or updating a resource review document, ensure:

- [ ] Clear introduction and purpose statement
- [ ] Consistent structure and formatting
- [ ] All examples are current and verified
- [ ] Links are working and correct
- [ ] Patterns are clearly identified and explained
- [ ] Recommendations are actionable
- [ ] Cross-references to related documents
- [ ] Last updated date is current
- [ ] Document follows established templates
- [ ] Content is clear and accessible
- [ ] Visual indicators (stars, checkmarks) are used appropriately
- [ ] Summary section provides quick overview

## Observability Considerations for Resource Reviews

### Observability Patterns in Resource Categories

When reviewing resources, consider observability implications and patterns:

#### 1. Scripts - Observability Integration

**Monitoring and Logging in Scripts**:
- **Structured Logging**: Scripts should use structured logging (JSON format) for automation scripts
- **Execution Metrics**: Track script execution time, success/failure rates, and resource usage
- **Error Tracking**: Log errors with context (correlation IDs, timestamps, input parameters)
- **Alerting Integration**: Script failures should trigger alerts for critical operations
- **Observability Examples**:
  - Git workflow scripts: Log commit hashes, branch names, execution duration
  - Deployment scripts: Track deployment duration, success rates, rollback events
  - Testing scripts: Log test execution metrics, failure rates, test coverage
  - Setup scripts: Track setup completion time, error rates, configuration validation

**Script Observability Checklist**:
- [ ] Structured logging implemented (JSON format)
- [ ] Execution metrics tracked (duration, success/failure)
- [ ] Error context captured (correlation IDs, stack traces)
- [ ] Alerting configured for critical failures
- [ ] Log aggregation configured (centralized logging)
- [ ] Script performance baselines established

#### 2. CI/CD Workflows - Observability Integration

**Monitoring CI/CD Pipelines**:
- **Pipeline Metrics**: Track build duration, success rates, failure rates, queue times
- **Job-Level Observability**: Monitor individual job execution, resource usage, dependencies
- **Deployment Observability**: Track deployment frequency, success rates, rollback rates
- **Test Observability**: Monitor test execution time, failure rates, flaky test detection
- **Observability Tools**: Integrate with monitoring tools (Prometheus, Grafana, Datadog)
- **Observability Examples**:
  - Build workflows: Track build duration, artifact sizes, cache hit rates
  - Test workflows: Monitor test execution time, coverage metrics, failure patterns
  - Deployment workflows: Track deployment duration, success rates, rollback events
  - Security scanning: Monitor scan duration, vulnerability detection rates

**CI/CD Observability Checklist**:
- [ ] Pipeline metrics collected (duration, success/failure rates)
- [ ] Job-level monitoring implemented
- [ ] Deployment metrics tracked
- [ ] Test observability configured
- [ ] Alerting for pipeline failures
- [ ] Dashboard for CI/CD metrics
- [ ] Integration with observability tools

#### 3. Configuration Files - Observability Configuration

**Observability in Configuration**:
- **Logging Configuration**: Log levels, log formats, log destinations
- **Metrics Configuration**: Metrics collection endpoints, sampling rates, retention policies
- **Tracing Configuration**: Trace sampling rates, trace backends, trace context propagation
- **Monitoring Configuration**: Alert thresholds, alert destinations, SLO definitions
- **Observability Examples**:
  - `package.json`: Scripts for observability setup, metrics collection
  - `docker-compose.yml`: Logging drivers, metrics endpoints, tracing configuration
  - `tsconfig.json`: Source maps for error tracking, debugging configuration
  - `.env.example`: Observability service endpoints, API keys, configuration

**Configuration Observability Checklist**:
- [ ] Logging configuration documented
- [ ] Metrics configuration specified
- [ ] Tracing configuration included
- [ ] Monitoring configuration defined
- [ ] Observability service endpoints configured
- [ ] Environment variables for observability documented

#### 4. Documentation Patterns - Observability Documentation

**Observability in Documentation**:
- **Runbooks**: Document common issues, resolution steps, escalation procedures
- **SLO Documentation**: Document service level objectives, error budgets, alerting policies
- [ ] **Dashboard Documentation**: Document key metrics, dashboard purposes, alert thresholds
- **Troubleshooting Guides**: Document observability workflows, correlation strategies
- **Observability Examples**:
  - README.md: Observability setup instructions, metrics endpoints, dashboard links
  - Setup guides: Observability tool installation, configuration steps
  - Architecture docs: Observability architecture, data flow, tool integration
  - Contributing guides: Observability standards, logging conventions, metrics naming

**Documentation Observability Checklist**:
- [ ] Runbooks documented for common issues
- [ ] SLO documentation included
- [ ] Dashboard documentation provided
- [ ] Troubleshooting guides with observability workflows
- [ ] Observability setup instructions
- [ ] Metrics and logging conventions documented

#### 5. Testing Structure - Observability in Tests

**Observability in Testing**:
- **Test Metrics**: Track test execution time, test coverage, flaky test detection
- **Test Logging**: Structured logging in tests, test correlation IDs, test context
- **Performance Testing**: Track performance metrics, baseline comparisons, regression detection
- **Test Observability**: Monitor test infrastructure, test execution patterns, test failures
- **Observability Examples**:
  - Test utilities: Observability helpers, metrics collection, logging utilities
  - E2E tests: Request tracing, performance metrics, error tracking
  - Integration tests: Service dependency tracking, latency measurement
  - Performance tests: Metrics collection, baseline comparison, regression detection

**Testing Observability Checklist**:
- [ ] Test metrics collected (execution time, coverage)
- [ ] Structured logging in tests
- [ ] Performance test metrics tracked
- [ ] Test observability infrastructure configured
- [ ] Flaky test detection implemented
- [ ] Test correlation IDs for debugging

#### 6. Environment Setup - Observability Setup

**Observability in Environment Setup**:
- **Observability Tools Setup**: Install and configure monitoring, logging, tracing tools
- **Metrics Collection Setup**: Configure metrics endpoints, sampling rates, retention
- **Logging Setup**: Configure log aggregation, log retention, log indexing
- **Tracing Setup**: Configure trace backends, sampling rates, trace context propagation
- **Observability Examples**:
  - Docker setup: Logging drivers, metrics endpoints, tracing configuration
  - Environment variables: Observability service endpoints, API keys, configuration
  - Local development: Local observability tools, development dashboards, test data
  - Database setup: Database metrics, query logging, performance monitoring

**Environment Observability Checklist**:
- [ ] Observability tools installed and configured
- [ ] Metrics collection configured
- [ ] Logging setup completed
- [ ] Tracing configured
- [ ] Environment variables documented
- [ ] Local development observability setup

#### 7. API Structure Patterns - Observability in APIs

**Observability in API Design**:
- **Request Tracing**: Correlation IDs, trace context propagation, distributed tracing
- **API Metrics**: Request rates, error rates, latency metrics, throughput metrics
- **API Logging**: Structured logging, request/response logging, error logging
- **API Monitoring**: Health checks, dependency monitoring, performance monitoring
- **Observability Examples**:
  - RESTful APIs: Correlation IDs in headers, metrics endpoints, health check endpoints
  - API versioning: Metrics per version, version-specific dashboards, deprecation tracking
  - Controller patterns: Request tracing, error tracking, performance metrics
  - Request/response patterns: Structured logging, metrics collection, trace context

**API Observability Checklist**:
- [ ] Correlation IDs implemented
- [ ] API metrics collected (rates, latency, errors)
- [ ] Structured logging in APIs
- [ ] Health check endpoints configured
- [ ] Distributed tracing implemented
- [ ] API monitoring dashboards created

#### 8. Build & Deployment Scripts - Observability in Deployment

**Observability in Deployment**:
- **Deployment Metrics**: Track deployment duration, success rates, rollback rates
- **Deployment Logging**: Log deployment events, configuration changes, rollback events
- **Deployment Tracing**: Trace deployment processes, dependency tracking, failure analysis
- **Deployment Monitoring**: Monitor deployment health, post-deployment metrics, alerting
- **Observability Examples**:
  - Build scripts: Build duration, artifact sizes, build success rates
  - Deployment scripts: Deployment duration, success rates, rollback events
  - AWS deployment: CloudWatch integration, deployment metrics, error tracking
  - Docker builds: Build metrics, image sizes, build cache hit rates

**Deployment Observability Checklist**:
- [ ] Deployment metrics tracked
- [ ] Deployment logging configured
- [ ] Deployment tracing implemented
- [ ] Post-deployment monitoring configured
- [ ] Rollback observability configured
- [ ] Deployment dashboards created

#### 9. Git Hooks - Observability in Automation

**Observability in Git Hooks**:
- **Hook Execution Metrics**: Track hook execution time, success/failure rates
- **Hook Logging**: Log hook events, validation results, error context
- **Hook Monitoring**: Monitor hook performance, failure patterns, alerting
- **Observability Examples**:
  - Pre-push hooks: Execution time, validation results, failure rates
  - Pre-commit hooks: Hook duration, validation metrics, error tracking
  - Hook setup scripts: Setup metrics, configuration validation, error logging

**Git Hooks Observability Checklist**:
- [ ] Hook execution metrics tracked
- [ ] Hook logging configured
- [ ] Hook monitoring implemented
- [ ] Hook performance baselines established
- [ ] Hook failure alerting configured

### Observability Integration Patterns

**Common Observability Patterns Across Resources**:

1. **Structured Logging Pattern**:
   - Use JSON format for all logs
   - Include correlation IDs for request tracing
   - Include contextual information (timestamps, user IDs, action types)
   - Sanitize sensitive data before logging

2. **Metrics Collection Pattern**:
   - Collect execution metrics (duration, success/failure)
   - Track resource usage (CPU, memory, disk, network)
   - Monitor business metrics (user actions, feature usage)
   - Use appropriate metric types (counters, gauges, histograms)

3. **Distributed Tracing Pattern**:
   - Generate correlation IDs at entry points
   - Propagate trace context across services
   - Create spans for significant operations
   - Sample traces appropriately for high-volume systems

4. **Alerting Pattern**:
   - Alert on symptoms, not causes
   - Set appropriate thresholds
   - Avoid alert fatigue
   - Group related alerts
   - Escalate appropriately

5. **Dashboard Pattern**:
   - Create dashboards for key metrics
   - Organize dashboards by service/component
   - Include trend analysis
   - Provide drill-down capabilities

### Observability Best Practices for Resource Reviews

1. **Identify Observability Gaps**:
   - Review resources for missing observability instrumentation
   - Identify areas where observability can be improved
   - Document observability requirements for each resource category

2. **Document Observability Patterns**:
   - Document common observability patterns found in resources
   - Provide examples of observability integration
   - Include observability best practices

3. **Recommend Observability Tools**:
   - Suggest appropriate observability tools for each resource category
   - Document tool integration patterns
   - Provide tool configuration examples

4. **Establish Observability Standards**:
   - Define logging standards (format, levels, context)
   - Define metrics standards (naming, types, collection)
   - Define tracing standards (sampling, context propagation)
   - Define alerting standards (thresholds, escalation)

5. **Create Observability Checklists**:
   - Include observability checklists in resource review documents
   - Ensure observability is considered in all resource categories
   - Track observability implementation status

### Observability Metrics for Resource Reviews

Track the following observability metrics for resource reviews:

1. **Observability Coverage**:
   - Number of resource categories with observability considerations
   - Number of resources with observability instrumentation
   - Percentage of observability coverage

2. **Observability Implementation**:
   - Number of resources with structured logging
   - Number of resources with metrics collection
   - Number of resources with distributed tracing
   - Number of resources with alerting configured

3. **Observability Quality**:
   - Logging quality (structured format, context, correlation)
   - Metrics quality (appropriate types, naming, collection)
   - Tracing quality (sampling, context propagation, visualization)
   - Alerting quality (thresholds, grouping, escalation)

4. **Observability Maintenance**:
   - Last observability review date
   - Frequency of observability updates
   - Number of observability improvements made
   - Observability tool integration status

## Business Intelligence & Analytics Considerations for Resource Reviews

### Analytics Resources and Tools to Review

When reviewing resources, consider Business Intelligence and Analytics tools, patterns, and integrations:

#### 1. Analytics Tools and Libraries

**Analytics Tool Integration**:
- **Event Tracking Libraries**: Google Analytics, Mixpanel, Amplitude, Segment, PostHog
- **Data Visualization Libraries**: D3.js, Chart.js, Recharts, Plotly, Apache ECharts
- **BI Platforms**: Tableau, Power BI, Looker, Metabase, Superset
- **Analytics SDKs**: Client-side tracking SDKs, server-side tracking APIs
- **Data Collection Tools**: Event collectors, data pipelines, ETL tools

**Analytics Tool Review Checklist**:
- [ ] Event tracking libraries identified and documented
- [ ] Data visualization libraries reviewed
- [ ] BI platform integrations documented
- [ ] Analytics SDK usage patterns identified
- [ ] Data collection tools reviewed

#### 2. Analytics Data Patterns

**Data Collection Patterns**:
- **Event Tracking**: User actions, feature usage, conversion events
- **User Properties**: User demographics, segmentation, cohort analysis
- **Data Layers**: Data layer structure, event schemas, data contracts
- **Data Validation**: Event validation, data quality checks, schema validation
- **Data Privacy**: GDPR compliance, data anonymization, consent management

**Analytics Data Pattern Review Checklist**:
- [ ] Event tracking patterns documented
- [ ] User property collection patterns identified
- [ ] Data layer structures reviewed
- [ ] Data validation patterns documented
- [ ] Data privacy considerations included

#### 3. Reporting and Dashboard Resources

**Reporting Resources**:
- **Dashboard Templates**: Pre-built dashboard layouts, KPI displays, widget patterns
- **Report Templates**: Report generation templates, data export formats, scheduled reports
- **Visualization Components**: Chart components, data table components, filter components
- **Analytics APIs**: Reporting APIs, data aggregation APIs, visualization APIs

**Reporting Resource Review Checklist**:
- [ ] Dashboard templates identified
- [ ] Report templates documented
- [ ] Visualization components reviewed
- [ ] Analytics APIs documented
- [ ] Reporting patterns identified

#### 4. Analytics Infrastructure Resources

**Analytics Infrastructure**:
- **Data Warehouses**: Data warehouse schemas, ETL pipelines, data models
- **Data Lakes**: Data lake structures, data ingestion patterns, data processing
- **Analytics Databases**: Time-series databases, columnar databases, analytics-optimized databases
- **Streaming Analytics**: Real-time data processing, event streaming, stream processing

**Analytics Infrastructure Review Checklist**:
- [ ] Data warehouse patterns documented
- [ ] Data lake structures reviewed
- [ ] Analytics database patterns identified
- [ ] Streaming analytics patterns documented
- [ ] Infrastructure patterns reviewed

#### 5. Analytics Testing Resources

**Analytics Testing**:
- **Event Testing**: Event tracking tests, data validation tests, schema validation tests
- **Dashboard Testing**: Dashboard rendering tests, data accuracy tests, UI interaction tests
- **Report Testing**: Report generation tests, data export tests, scheduled report tests
- **Analytics Integration Tests**: End-to-end analytics flow tests, data pipeline tests

**Analytics Testing Resource Review Checklist**:
- [ ] Event testing patterns documented
- [ ] Dashboard testing patterns identified
- [ ] Report testing patterns reviewed
- [ ] Analytics integration test patterns documented
- [ ] Testing utilities reviewed

#### 6. Analytics Documentation Resources

**Analytics Documentation**:
- **Analytics Guides**: Event tracking guides, dashboard creation guides, report generation guides
- **Analytics APIs**: API documentation, data schema documentation, integration guides
- **Analytics Best Practices**: Event naming conventions, data collection best practices, dashboard design guidelines
- **Analytics Metrics**: KPI definitions, metric calculation guides, business metric documentation

**Analytics Documentation Review Checklist**:
- [ ] Analytics guides documented
- [ ] Analytics API documentation reviewed
- [ ] Analytics best practices identified
- [ ] Analytics metrics documented
- [ ] Documentation patterns reviewed

### Analytics Integration Patterns Across Resources

**Common Analytics Patterns**:

1. **Event Tracking Pattern**:
   - Implement event tracking in user-facing applications
   - Track user actions, feature usage, conversion events
   - Use consistent event naming conventions
   - Validate event data before sending

2. **Data Visualization Pattern**:
   - Use appropriate chart types for different data types
   - Implement interactive dashboards with drill-down capabilities
   - Provide data export functionality
   - Ensure accessibility in visualizations

3. **Reporting Pattern**:
   - Generate scheduled reports for stakeholders
   - Provide customizable report templates
   - Implement data aggregation and filtering
   - Support multiple export formats

4. **Analytics API Pattern**:
   - Design APIs for analytics data access
   - Implement data aggregation endpoints
   - Provide filtering and pagination
   - Ensure API security and rate limiting

5. **Data Pipeline Pattern**:
   - Implement ETL pipelines for data processing
   - Validate data quality at each stage
   - Monitor pipeline performance and errors
   - Implement data retention policies

### Analytics Best Practices for Resource Reviews

1. **Identify Analytics Opportunities**:
   - Review resources for analytics integration points
   - Identify user actions worth tracking
   - Determine key metrics and KPIs
   - Document analytics requirements

2. **Document Analytics Patterns**:
   - Document common analytics patterns found in resources
   - Provide examples of analytics integration
   - Include analytics best practices
   - Reference analytics tools and libraries

3. **Recommend Analytics Tools**:
   - Suggest appropriate analytics tools for each resource category
   - Document tool integration patterns
   - Provide tool configuration examples
   - Include analytics tool comparison

4. **Establish Analytics Standards**:
   - Define event naming conventions
   - Define data schema standards
   - Define dashboard design guidelines
   - Define reporting standards

5. **Create Analytics Checklists**:
   - Include analytics checklists in resource review documents
   - Ensure analytics is considered in all resource categories
   - Track analytics implementation status
   - Document analytics metrics and KPIs

### Analytics Metrics for Resource Reviews

Track the following analytics metrics for resource reviews:

1. **Analytics Coverage**:
   - Number of resource categories with analytics considerations
   - Number of resources with analytics instrumentation
   - Percentage of analytics coverage

2. **Analytics Implementation**:
   - Number of resources with event tracking
   - Number of resources with data visualization
   - Number of resources with reporting capabilities
   - Number of resources with analytics APIs

3. **Analytics Quality**:
   - Event tracking quality (naming conventions, data validation)
   - Dashboard quality (design, interactivity, accessibility)
   - Report quality (accuracy, formatting, scheduling)
   - API quality (performance, security, documentation)

4. **Analytics Maintenance**:
   - Last analytics review date
   - Frequency of analytics updates
   - Number of analytics improvements made
   - Analytics tool integration status

---

## Review/Contribution

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Expanded this resource review document with comprehensive documentation best practices, including: documentation templates for resource reviews (individual resource entry template, review document structure template), maintaining review documents (version control, regular review cycles, completeness checks, status tracking), documentation workflow for resource reviews (discovery, analysis, documentation, maintenance phases), best practices for documenting patterns (being specific, providing context, using visual indicators, making it actionable), discoverability and navigation strategies (table of contents, index documents, search-friendly structure, cross-reference system), quality standards for review documents (completeness, accuracy, clarity, consistency), documentation metrics and tracking (coverage, completeness, maintenance, usage), a complete example resource review document structure, and a documentation checklist for resource reviews. These additions provide practical guidance for creating, maintaining, and improving resource review documentation following professional documentation standards.

**Expert**: Nicole Chen  
**Expertise**: Observability (Monitoring, Logging, Tracing, Metrics)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Observability Considerations for Resource Reviews" section covering observability patterns in resource categories (scripts with structured logging and execution metrics, CI/CD workflows with pipeline metrics and job-level observability, configuration files with observability configuration, documentation patterns with runbooks and SLO documentation, testing structure with test metrics and performance testing, environment setup with observability tools setup, API structure patterns with request tracing and API metrics, build and deployment scripts with deployment metrics and monitoring, git hooks with execution metrics and monitoring), observability integration patterns (structured logging pattern with JSON format and correlation IDs, metrics collection pattern with execution and resource metrics, distributed tracing pattern with correlation IDs and trace context propagation, alerting pattern with symptom-based alerting and threshold management, dashboard pattern with key metrics and trend analysis), observability best practices for resource reviews (identify observability gaps, document observability patterns, recommend observability tools, establish observability standards, create observability checklists), and observability metrics for resource reviews (observability coverage, observability implementation, observability quality, observability maintenance). Each resource category includes detailed observability checklists covering structured logging, metrics collection, distributed tracing, alerting configuration, and monitoring setup. This addition ensures that observability is considered across all resource categories, providing comprehensive visibility into system operations, performance, and reliability.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Business Intelligence & Analytics Considerations for Resource Reviews" section covering analytics resources and tools to review (analytics tools and libraries including event tracking libraries, data visualization libraries, BI platforms, analytics SDKs, data collection tools with review checklists), analytics data patterns (event tracking, user properties, data layers, data validation, data privacy with review checklists), reporting and dashboard resources (dashboard templates, report templates, visualization components, analytics APIs with review checklists), analytics infrastructure resources (data warehouses, data lakes, analytics databases, streaming analytics with review checklists), analytics testing resources (event testing, dashboard testing, report testing, analytics integration tests with review checklists), analytics documentation resources (analytics guides, analytics APIs, analytics best practices, analytics metrics with review checklists), analytics integration patterns across resources (event tracking pattern, data visualization pattern, reporting pattern, analytics API pattern, data pipeline pattern), analytics best practices for resource reviews (identify analytics opportunities, document analytics patterns, recommend analytics tools, establish analytics standards, create analytics checklists), and analytics metrics for resource reviews (analytics coverage, analytics implementation, analytics quality, analytics maintenance). This addition ensures that Business Intelligence and Analytics considerations are integrated into resource review processes, enabling data-driven decision making, user behavior tracking, and comprehensive business insights across all resource categories.
