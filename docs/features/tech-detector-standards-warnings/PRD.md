# Tech Detector Standards Warnings - PRD

**Feature Name**: Tech Detector Standards Warnings  
**Type**: Enhancement to Tech Detector Feature (part of `@your-org/core` package)  
**Status**: Planning  
**Priority**: P1 (High)  
**Created**: 2026-01-05  
**Package Architecture**: Core Package Feature Enhancement

## Package Context

Tech Detector Standards Warnings is an **enhancement** to the existing Tech Detector feature within the `@your-org/core` package. The tech detector currently detects technology stacks but doesn't validate against standards or recommend improvements.

This enhancement adds standards validation and interactive warnings with actionable options.

See [Package Architecture Strategy](../../architecture/PACKAGE_ARCHITECTURE.md) for details.

## Overview

Tech Detector Standards Warnings enhances the tech detector to warn users when detected technologies don't meet project standards, providing interactive options to fix issues or update recommendations.

**Usage**:
```bash
# Detect tech stack with standards validation
npx @your-org/core tech-detect detect

# Will automatically warn if:
# - Non-recommended framework/language/tech is used
# - Version is below recommended minimum
```

## Problem Statement

### Current Issues

1. **No Standards Validation**: Tech detector only detects, doesn't validate against standards
2. **No Recommendations**: Users don't know if their tech choices are recommended
3. **No Version Warnings**: Users may be using outdated or unsupported versions
4. **No Actionable Guidance**: Even if issues are detected, no clear path to fix them
5. **Silent Failures**: Projects may use non-recommended tech without awareness

### Pain Points

- **Inconsistent Tech Choices**: Different projects use different frameworks without guidance
- **Outdated Versions**: Projects may use old versions with security/compatibility issues
- **No Guidance**: Developers don't know what's recommended vs. acceptable
- **Manual Checking**: No automated way to validate tech choices against standards

## Solution

Tech Detector Standards Warnings solves these problems by:

1. **Standards Configuration**: Define recommended frameworks, languages, and minimum versions
2. **Automatic Validation**: Check detected tech against standards during detection
3. **Interactive Warnings**: Show warnings with actionable options
4. **User Choices**: Allow users to add recommendations, update tech, or ignore warnings
5. **Persistent Decisions**: Remember user choices to avoid repeated prompts

## Goals

### Primary Goals

1. **Standards Enforcement**: Ensure projects use recommended technologies
2. **Version Compliance**: Ensure projects use minimum recommended versions
3. **Interactive Guidance**: Provide clear, actionable options when standards aren't met
4. **User Flexibility**: Allow users to customize recommendations or ignore warnings
5. **Developer Experience**: Make standards validation seamless and helpful

### Success Metrics

#### Quantitative Metrics

- **Standards Compliance Rate**: Percentage of projects meeting standards (target: 80%+)
- **Warning Resolution Rate**: Percentage of warnings resolved (target: 70%+)
- **Version Update Rate**: Percentage of outdated versions updated (target: 60%+)
- **User Satisfaction**: Developer satisfaction with warnings (target: > 4.0/5.0)

#### Qualitative Metrics

- **Developer Experience**: Helpful, non-intrusive warnings
- **Standards Awareness**: Developers understand recommended tech choices
- **Actionable Guidance**: Clear path to resolve warnings

## Target Users

### Primary Users

- **Developers**: Setting up new projects or reviewing existing ones
  - **Pain Points**: Unclear what tech to use, outdated versions
  - **Goals**: Clear guidance on recommended tech, easy updates
  - **Usage Frequency**: Per project setup/review

- **Team Leads**: Ensuring consistency across team projects
  - **Pain Points**: Inconsistent tech choices, outdated versions
  - **Goals**: Team-wide standards compliance
  - **Usage Frequency**: During project reviews, onboarding

## User Stories

### Story 1: Non-Recommended Framework Warning
**As a** developer  
**I want to** be warned when using a non-recommended framework  
**So that** I can switch to recommended tech or add it to recommendations

**Acceptance Criteria**:
- Warning shown when non-recommended framework detected
- Options: Add recommendation, Install/init recommended tech, Ignore
- Choice is remembered for future detections

### Story 2: Outdated Version Warning
**As a** developer  
**I want to** be warned when using outdated versions  
**So that** I can update to recommended versions

**Acceptance Criteria**:
- Warning shown when version below recommended minimum
- Options: Change recommendation, Update version, Ignore
- Update option provides clear upgrade path

## Core Features

### Feature 1: Standards Configuration

**Description**: Define recommended frameworks, languages, technologies, and minimum versions.

**Configuration File**: `.core-tech-standards.json` (in core package or project)

**Structure**:
```json
{
  "newProjectDefaults": {
    "framework": "angular",
    "language": "typescript",
    "buildTool": "webpack",
    "packageManager": "npm",
    "runtime": "node",
    "versions": {
      "angular": "latest",
      "typescript": "latest",
      "webpack": "latest",
      "npm": "latest",
      "node": "20.0.0"
    },
    "backendDefaults": {
      "framework": "slim",
      "language": "php",
      "packageManager": "composer",
      "runtime": "php",
      "versions": {
        "slim": "4.0.0",
        "php": "8.3.0",
        "composer": "latest"
      }
    }
  },
  "frameworks": {
    "recommended": ["nextjs", "angular", "react", "express", "laravel", "django", "flask", "fastapi", "symfony", "spring-boot", "slim", "laminas"],
    "minimumVersions": {
      "nextjs": "14.0.0",
      "angular": "17.0.0",
      "react": "18.0.0",
      "express": "4.18.0",
      "laravel": "10.0.0",
      "django": "4.2.0",
      "flask": "2.3.0",
      "fastapi": "0.100.0",
      "symfony": "6.3.0",
      "spring-boot": "3.1.0",
      "slim": "4.0.0",
      "laminas": "3.0.0"
    }
  },
  "languages": {
    "recommended": ["typescript", "javascript", "php", "python", "java", "go", "rust"],
    "minimumVersions": {
      "typescript": "5.0.0",
      "node": "18.0.0",
      "php": "8.1.0",
      "python": "3.10.0",
      "java": "17.0.0",
      "go": "1.21.0",
      "rust": "1.70.0"
    }
  },
  "buildTools": {
    "recommended": ["vite", "webpack", "esbuild", "maven", "gradle", "cargo"],
    "minimumVersions": {
      "vite": "5.0.0",
      "webpack": "5.0.0",
      "maven": "3.9.0",
      "gradle": "8.0.0",
      "cargo": "1.70.0"
    }
  },
  "packageManagers": {
    "recommended": ["npm", "pnpm", "yarn", "composer", "pip", "poetry", "maven", "gradle", "go", "cargo"],
    "minimumVersions": {
      "npm": "9.0.0",
      "pnpm": "8.0.0",
      "yarn": "3.0.0",
      "composer": "2.6.0",
      "pip": "23.0.0",
      "poetry": "1.5.0",
      "maven": "3.9.0",
      "gradle": "8.0.0",
      "go": "1.21.0",
      "cargo": "1.70.0"
    }
  },
  "runtimes": {
    "recommended": ["node", "php", "python", "java", "go"],
    "minimumVersions": {
      "node": "18.0.0",
      "php": "8.1.0",
      "python": "3.10.0",
      "java": "17.0.0",
      "go": "1.21.0"
    }
  }
}
```

**Implementation**:
- Default standards in core package
- Project-specific overrides in `.core-tech-standards.json`
- Merge project overrides with defaults

**New Project Defaults**:
The `newProjectDefaults` section specifies recommended defaults for new projects. These are the "go-to" choices when starting a fresh project:

**Frontend Defaults**:
- **Framework**: Angular (comprehensive frontend framework)
- **Language**: TypeScript (type-safe JavaScript, required by Angular)
- **Build Tool**: Webpack (Angular's default build tool)
- **Package Manager**: npm (standard Node.js package manager)
- **Runtime**: Node.js 20.0.0+ (LTS version)

**Backend Defaults** (optional `backendDefaults` section):
- **Framework**: Slim (lightweight PHP micro-framework)
- **Language**: PHP 8.3.0+ (latest stable PHP version)
- **Package Manager**: Composer (PHP dependency manager)
- **Runtime**: PHP 8.3.0+

These defaults can be overridden per-project in `.core-tech-standards.json` if different defaults are preferred for specific project types.

### Feature 2: Non-Recommended Tech Warning

**Description**: Warn when detected framework/language/tech is not in recommended list.

**Warning Flow**:
1. Detect technology (framework, language, build tool, etc.)
2. Check if it's in recommended list
3. If not recommended:
   - Show warning with detected tech
   - Show recommended alternatives
   - Offer options:
     - **Add Recommendation**: Add detected tech to recommendations (updates standards)
     - **Install/Init Recommended**: Help install/initialize recommended tech
     - **Ignore for Now**: Skip warning (remember choice)

**Example Warning**:
```
⚠️  Warning: Non-recommended framework detected

Detected: Vue.js 3.5.0
Recommended: Next.js, Angular, React, Express

What would you like to do?
  ❯ Add Vue.js to recommendations
    Install/init recommended framework (Next.js)
    Ignore for now
```

**Implementation**:
- Check detected tech against recommended list
- Use inquirer for interactive prompts
- Store user choices in `.core-tech-choices.json`
- Respect stored choices to avoid repeated prompts

### Feature 3: Version Warning

**Description**: Warn when detected version is below recommended minimum.

**Warning Flow**:
1. Detect technology version
2. Check against minimum recommended version
3. If version is below minimum:
   - Show warning with current and recommended versions
   - Show upgrade path if available
   - Offer options:
     - **Change Recommendation**: Update minimum version requirement
     - **Update**: Help update to recommended version
     - **Ignore**: Skip warning (remember choice)

**Example Warning**:
```
⚠️  Warning: Version below recommended minimum

Detected: Next.js 13.5.0
Recommended Minimum: 14.0.0

What would you like to do?
  ❯ Update to Next.js 14.0.0
    Change recommendation to 13.5.0
    Ignore for now
```

**Implementation**:
- Compare detected version with minimum version (semver comparison)
- Use inquirer for interactive prompts
- Store user choices in `.core-tech-choices.json`
- Provide upgrade commands when update option is chosen

### Feature 4: User Choice Storage

**Description**: Remember user choices to avoid repeated prompts.

**Storage File**: `.core-tech-choices.json` (in project root)

**Structure**:
```json
{
  "ignoredWarnings": {
    "frameworks": {
      "vue": {
        "reason": "user_choice",
        "timestamp": "2026-01-05T12:00:00Z"
      }
    },
    "versions": {
      "nextjs": {
        "current": "13.5.0",
        "recommended": "14.0.0",
        "reason": "user_choice",
        "timestamp": "2026-01-05T12:00:00Z"
      }
    }
  },
  "customRecommendations": {
    "frameworks": ["vue"],
    "minimumVersions": {
      "nextjs": "13.5.0"
    }
  }
}
```

**Implementation**:
- Store ignored warnings with timestamp
- Store custom recommendations
- Load choices before showing warnings
- Respect stored choices (skip warnings for ignored items)

### Feature 5: Interactive Actions

**Description**: Execute user-chosen actions (add recommendation, install tech, update version).

**Actions**:

1. **Add Recommendation**:
   - Update `.core-tech-standards.json` (project-specific)
   - Add detected tech to recommended list
   - Confirm update

2. **Install/Init Recommended Tech**:
   - Detect which recommended tech to install
   - Run appropriate install/init command:
     - `npx create-next-app@latest` for Next.js
     - `ng new` for Angular
     - `npm create vite@latest` for Vite
   - Guide user through installation

3. **Update Version**:
   - Detect current version and recommended version
   - Provide upgrade command:
     - `npm install next@14.0.0` for Next.js
     - `npm install -g typescript@5.0.0` for TypeScript
   - Optionally run upgrade automatically

4. **Change Recommendation**:
   - Update `.core-tech-standards.json` (project-specific)
   - Change minimum version to current version
   - Confirm update

5. **Ignore**:
   - Store choice in `.core-tech-choices.json`
   - Skip warning for this tech/version combination
   - Show warning again after 30 days (optional)

## Technical Architecture

### Standards Configuration

**Default Standards** (in core package):
- Location: `packages/core/src/features/tech-detector/standards/default-standards.json`
- Defines recommended tech and minimum versions
- Can be updated with core package updates

**Project-Specific Standards** (optional):
- Location: `.core-tech-standards.json` (project root)
- Overrides default standards
- Merged with defaults (project takes precedence)

### Warning System

**Warning Detector**:
- Checks detected tech against standards
- Compares versions using semver
- Generates warning objects with context

**Interactive Prompter**:
- Uses inquirer for interactive prompts
- Shows clear options with descriptions
- Handles user input and executes actions

**Choice Storage**:
- Saves user choices to `.core-tech-choices.json`
- Loads choices before showing warnings
- Respects stored choices

### Integration Points

**Tech Detector Integration**:
- Add warning checks after detection
- Show warnings before saving results
- Store warnings in tech stack result

**CLI Integration**:
- Add `--check-standards` flag (default: true)
- Add `--skip-warnings` flag to skip all warnings
- Add `--interactive` flag (default: true) for prompts

### CI/CD Usage Guidance (DevOps Review)

**Current Behavior (as implemented)**:
- Standards checking is best-effort and does **not** fail the command on warnings.
- `--skip-warnings` disables warning prompts entirely (useful for non-interactive CI steps).
- `--no-interactive` (CLI shorthand for `--interactive=false`) still performs checks but skips prompts.
- Warnings are currently printed but not emitted as machine-readable artifacts.

**Planned Enhancements**:
- `--fail-on-warning` to exit non-zero when warnings are detected (CI gate).
- `--report <path>` to emit warnings as JSON for pipeline artifacts.
- CI-friendly summary output with counts by category (framework, language, build tool, etc.).

## Usage Examples

### Basic Usage with Warnings

```bash
npx @your-org/core tech-detect detect

# Output:
🔍 Detecting technology stack...
⚠️  Warning: Non-recommended framework detected

Detected: Vue.js 3.5.0
Recommended: Next.js, Angular, React, Express

What would you like to do?
  ❯ Add Vue.js to recommendations
    Install/init recommended framework (Next.js)
    Ignore for now

# User selects "Add Vue.js to recommendations"
✓ Added Vue.js to recommendations
✓ Updated .core-tech-standards.json
```

### Version Warning

```bash
npx @your-org/core tech-detect detect

# Output:
🔍 Detecting technology stack...
⚠️  Warning: Version below recommended minimum

Detected: Next.js 13.5.0
Recommended Minimum: 14.0.0

What would you like to do?
  ❯ Update to Next.js 14.0.0
    Change recommendation to 13.5.0
    Ignore for now

# User selects "Update to Next.js 14.0.0"
✓ Upgrade command: npm install next@14.0.0 react@latest react-dom@latest
Run this command? (Y/n)
```

### Skip Warnings

```bash
# Skip all warnings
npx @your-org/core tech-detect detect --skip-warnings

# Non-interactive mode (no prompts)
npx @your-org/core tech-detect detect --no-interactive
```

## Implementation Plan

### Phase 1: Standards Configuration
1. Create default standards JSON file
2. Implement standards loader (defaults + project overrides)
3. Add standards validation logic

### Phase 2: Warning Detection
1. Add non-recommended tech detection
2. Add version comparison logic
3. Generate warning objects

### Phase 3: Interactive Prompts
1. Integrate inquirer for prompts
2. Implement action handlers
3. Add choice storage

### Phase 4: Actions Implementation
1. Implement "Add Recommendation" action
2. Implement "Install/Init" action
3. Implement "Update Version" action
4. Implement "Change Recommendation" action
5. Implement "Ignore" action

### Phase 5: Integration
1. Integrate warnings into tech detector
2. Update CLI command
3. Add tests

## Dependencies

- **inquirer**: Already in dependencies (for interactive prompts)
- **semver**: Need to add for version comparison
- **fs-extra**: Already in dependencies (for file operations)

## Testing Strategy

### Unit Tests
- Test standards loading (defaults + overrides)
- Test warning detection logic
- Test version comparison
- Test choice storage/loading

### Integration Tests
- Test full warning flow
- Test interactive prompts
- Test action execution
- Test choice persistence

### E2E Tests
- Test with real projects
- Test with different tech stacks
- Test user choices and persistence

## Documentation

### User Documentation
- Standards configuration guide
- Warning system guide
- Action options guide
- Troubleshooting guide

### Developer Documentation
- Standards file format
- Warning system architecture
- Action implementation guide
- Extending standards

## Success Criteria

### Must Have
- ✅ Standards configuration (defaults + project overrides)
- ✅ Non-recommended tech warnings with options
- ✅ Version warnings with options
- ✅ Interactive prompts for user choices
- ✅ Choice storage and persistence

### Should Have
- ⏳ Automatic upgrade commands
- ⏳ Install/init helpers for recommended tech
- ⏳ Warning expiration (re-show after time)
- ⏳ Standards validation in CI/CD

### Nice to Have
- ⏳ Custom warning messages
- ⏳ Warning severity levels
- ⏳ Team-wide standards enforcement
- ⏳ Standards migration tools

## Business Intelligence & Analytics Considerations

### Analytics Metrics and KPIs

**Tech Stack Detection Analytics**:
- **Detection Patterns**: Track which technologies are most commonly detected across projects
- **Framework Adoption Rates**: Monitor adoption of recommended vs. non-recommended frameworks
- **Version Distribution**: Analyze version usage patterns (outdated vs. current vs. latest)
- **Tech Stack Combinations**: Identify common tech stack patterns and combinations
- **Standards Compliance Trends**: Track compliance rates over time

**Warning Analytics**:
- **Warning Frequency**: Track how often warnings are triggered (by type: non-recommended tech, outdated version)
- **Warning Resolution Rates**: Monitor which actions users take (add recommendation, update, ignore)
- **Resolution Time**: Track time from warning to resolution
- **User Choice Patterns**: Analyze which options users prefer (add vs. update vs. ignore)
- **Warning Effectiveness**: Measure impact of warnings on standards compliance

**Standards Analytics**:
- **Standards Adoption**: Track adoption of recommended technologies over time
- **Custom Recommendations**: Monitor how often users add custom recommendations
- **Standards Override Patterns**: Analyze project-specific standard overrides
- **Version Update Rates**: Track how often users update to recommended versions
- **Standards Compliance Score**: Calculate overall compliance score per project/team

### Data Collection Strategy

**Event Tracking**:
- **Tech Detection Events**: Track each tech detection with detected tech, version, and project context
- **Warning Events**: Track warning triggers (type, detected tech, recommended alternatives)
- **User Action Events**: Track user choices (add recommendation, update, ignore, change recommendation)
- **Standards Update Events**: Track when standards are updated (defaults or project-specific)
- **Compliance Events**: Track compliance status changes (compliant → non-compliant, etc.)

**Data Points to Collect**:
- Detected technology name and version
- Recommended alternatives shown
- User action taken (add, update, ignore, change)
- Project context (project type, team, repository)
- Timestamp of detection and resolution
- Standards configuration (defaults vs. overrides)

### Reporting & Dashboards

**Tech Stack Analytics Dashboard**:
- **Tech Adoption Overview**: Visualize adoption rates of recommended vs. non-recommended technologies
- **Version Distribution Charts**: Show distribution of versions (outdated, current, latest)
- **Framework Popularity**: Display most commonly detected frameworks
- **Tech Stack Combinations**: Show common tech stack patterns
- **Standards Compliance Trends**: Line chart showing compliance rates over time

**Warning Analytics Dashboard**:
- **Warning Frequency**: Bar chart showing warning types and frequencies
- **Resolution Rates**: Pie chart showing distribution of user actions (add, update, ignore)
- **Resolution Time Analysis**: Histogram showing time to resolution
- **Warning Effectiveness**: Impact analysis of warnings on compliance
- **User Choice Patterns**: Analysis of preferred user actions

**Standards Compliance Dashboard**:
- **Compliance Score**: Overall compliance score per project/team
- **Standards Adoption Rate**: Percentage of projects using recommended technologies
- **Version Update Rate**: Percentage of projects updated to recommended versions
- **Custom Recommendations**: List of most commonly added custom recommendations
- **Standards Override Analysis**: Analysis of project-specific standard overrides

### Analytics Architecture

**Data Collection**:
- **Event Tracking**: Integrate analytics SDK for event tracking (e.g., PostHog, Mixpanel, Segment)
- **Anonymous Data Collection**: Collect anonymous usage data (no sensitive project information)
- **Opt-in Analytics**: Allow users to opt-in to analytics data collection
- **Data Privacy**: Ensure GDPR compliance, data anonymization, consent management

**Data Processing**:
- **Data Aggregation**: Aggregate detection and warning events
- **Compliance Calculations**: Calculate compliance scores and adoption rates
- **Trend Analysis**: Analyze trends over time (adoption, compliance, warnings)
- **Pattern Recognition**: Identify common tech stack patterns and user behavior patterns

**Data Storage**:
- **Analytics Database**: Store analytics events in time-series database
- **Aggregated Metrics**: Pre-calculate aggregated metrics for dashboard performance
- **Data Retention**: Define data retention policies (e.g., 1 year for events, 5 years for aggregated metrics)

### Analytics Implementation Phases

**Phase 1: Basic Analytics (MVP)**:
- Track tech detection events (technology, version, project context)
- Track warning events (type, detected tech, recommended alternatives)
- Track user action events (add, update, ignore)
- Basic compliance score calculation
- Simple analytics dashboard (tech adoption, warning frequency, compliance score)

**Phase 2: Advanced Analytics**:
- Trend analysis (adoption rates over time, compliance trends)
- Pattern recognition (common tech stack combinations, user behavior patterns)
- Advanced dashboards (interactive charts, drill-down capabilities)
- Predictive analytics (predict compliance issues, recommend standards updates)
- Team/org-level analytics (aggregate metrics across teams)

**Phase 3: AI-Powered Insights**:
- AI-powered recommendations (suggest standards updates based on usage patterns)
- Anomaly detection (identify unusual tech stack patterns)
- Predictive compliance (predict which projects will have compliance issues)
- Automated standards optimization (suggest optimal standards based on analytics)

### Analytics Tools Integration

**Recommended Analytics Tools**:
- **Event Tracking**: PostHog, Mixpanel, Amplitude, Segment
- **Data Visualization**: Chart.js, D3.js, Recharts, Plotly
- **BI Platforms**: Metabase, Superset, Looker (for advanced analytics)
- **Data Warehousing**: PostgreSQL (for analytics events), ClickHouse (for time-series data)

**Analytics Integration Points**:
- **Tech Detector**: Emit events when technologies are detected
- **Warning System**: Emit events when warnings are triggered
- **User Actions**: Emit events when users take actions (add, update, ignore)
- **Standards Updates**: Emit events when standards are updated
- **CLI Commands**: Emit events for CLI usage (detect, check-standards, etc.)

### Analytics Best Practices

**Data Privacy**:
- **Opt-in Analytics**: Require explicit user consent for analytics data collection
- **Data Anonymization**: Anonymize project and user data before collection
- **GDPR Compliance**: Ensure GDPR compliance (right to access, right to deletion)
- **Data Minimization**: Collect only necessary data for analytics

**Analytics Quality**:
- **Data Validation**: Validate analytics events before sending
- **Error Handling**: Handle analytics errors gracefully (don't break core functionality)
- **Performance**: Ensure analytics collection doesn't impact performance
- **Reliability**: Use reliable analytics infrastructure (retry logic, offline support)

**Analytics Value**:
- **Actionable Insights**: Provide actionable insights, not just data
- **User Benefits**: Show users how analytics benefits them (better recommendations, compliance insights)
- **Privacy Transparency**: Be transparent about what data is collected and why
- **Continuous Improvement**: Use analytics to continuously improve standards and recommendations

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive PRD for Tech Detector Standards Warnings feature that adds standards validation and interactive warnings to the tech detector. This enhancement warns users when non-recommended technologies are used or versions are below recommended minimums, providing actionable options to add recommendations, install recommended tech, update versions, change recommendations, or ignore warnings. The feature includes standards configuration (defaults and project-specific overrides), warning detection, interactive prompts, user choice storage, and action execution. This addition ensures projects use recommended technologies and versions, providing clear guidance and actionable options for developers.

**Expert**: Daniel Kim  
**Expertise**: Business Intelligence and Analytics  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Business Intelligence & Analytics Considerations" section covering analytics metrics and KPIs (tech stack detection analytics with detection patterns, framework adoption rates, version distribution, tech stack combinations, standards compliance trends; warning analytics with warning frequency, resolution rates, resolution time, user choice patterns, warning effectiveness; standards analytics with standards adoption, custom recommendations, standards override patterns, version update rates, compliance scores), data collection strategy (event tracking for tech detection, warnings, user actions, standards updates, compliance; data points including detected technology, recommended alternatives, user actions, project context, timestamps, standards configuration), reporting and dashboards (tech stack analytics dashboard with adoption overview, version distribution, framework popularity, tech stack combinations, compliance trends; warning analytics dashboard with warning frequency, resolution rates, resolution time, effectiveness, user choice patterns; standards compliance dashboard with compliance scores, adoption rates, update rates, custom recommendations, override analysis), analytics architecture (data collection with event tracking, anonymous data, opt-in analytics, data privacy; data processing with aggregation, compliance calculations, trend analysis, pattern recognition; data storage with analytics database, aggregated metrics, data retention), analytics implementation phases (Phase 1: basic analytics with MVP tracking and dashboards; Phase 2: advanced analytics with trends, patterns, predictive analytics, team-level metrics; Phase 3: AI-powered insights with recommendations, anomaly detection, predictive compliance, automated optimization), analytics tools integration (recommended tools for event tracking, visualization, BI platforms, data warehousing; integration points for tech detector, warning system, user actions, standards updates, CLI commands), and analytics best practices (data privacy with opt-in, anonymization, GDPR compliance, data minimization; analytics quality with validation, error handling, performance, reliability; analytics value with actionable insights, user benefits, privacy transparency, continuous improvement). This addition ensures that the Tech Detector Standards Warnings feature includes comprehensive analytics capabilities for tracking tech adoption, warning effectiveness, standards compliance, and user behavior, enabling data-driven decision making and continuous improvement of standards and recommendations.

**Expert**: Devin Patel  
**Expertise**: DevOps, CI/CD, and Deployment  
**Date**: 2026-01-20  
**Changes**: Documented the DevOps review requested via `/local/feature-review feature=core/tech-detector expert=rand docs=true`, capturing CI/CD usage guidance and current operational constraints (non-interactive usage and best-effort checks), plus a short backlog of CI-focused enhancements (fail-on-warning and JSON reports). Implementation changes are deferred due to planning mode restrictions.

---
