# Implement Command

**Trigger**: `/general/implement` or `/implement`

**Purpose**: Read project documentation from centralized docs location and implement all documented features, filling gaps between documentation and current implementation.

---

## Command Overview

This command reads documentation from `/Users/yoavweitzman/Documents/packages/docs/projects` and ensures the current project matches the documented requirements, features, and architecture.

**CRITICAL**: This command reads documentation but **NEVER modifies docs**. Documentation is the source of truth.

---

## Execution Flow

### Phase 1: Project Identification

1. **Identify Current Project**
   ```
   - Get current working directory
   - Extract project name from directory structure
   - Identify project type (web app, mobile, backend, package, etc.)
   - Verify project exists in docs
   ```

2. **Locate Documentation**
   ```
   - Primary docs: /Users/yoavweitzman/Documents/packages/docs/projects/<project-name>/
   - Shared/General docs: /Users/yoavweitzman/Documents/packages/docs/projects/shared/
   - Guides: /Users/yoavweitzman/Documents/packages/docs/guides/
   ```

3. **Validation**
   ```
   IF documentation not found:
     → STOP with error
     → Message: "No documentation found for project '<project-name>'. Create documentation first."
   
   IF documentation exists:
     → PROCEED to reading phase
   ```

---

### Phase 2: Documentation Reading (Comprehensive)

**Read ALL documentation thoroughly - every file, every section, every detail.**

#### Step 2.1: Read Project-Specific Documentation

**Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/<project-name>/`

1. **Start with INDEX.md**
   ```
   - Read complete INDEX.md
   - Understand documentation structure
   - Identify all linked files
   - Note which features are general vs project-specific
   - Create reading list of all referenced files
   ```

2. **Read Core Project Documents**
   ```
   Read in this order:
   1. PRD_OVERVIEW.md - Main requirements document
      - Executive summary
      - Problem statement
      - Solution overview
      - User personas
      - MVP definition (CRITICAL)
      - Post-MVP features
      - Technical requirements
      - Business requirements
      - Timeline & milestones
      - Success criteria
      - Risks & mitigation
   
   2. ARCHITECTURE.md - Technical architecture
      - System overview
      - Frontend architecture
      - Backend architecture
      - Infrastructure
      - Security architecture
      - Data architecture
      - Integration architecture
   
   3. EXPERTS.md - Expert contributions
      - Expert team roster
      - Expert reviews
      - Sign-off summary
      - Expert recommendations
   ```

3. **Read Subdirectory Documentation**
   ```
   features/ directory:
     - Read ALL feature PRD files
     - For each feature:
       - Feature overview
       - User stories
       - Functional requirements
       - Non-functional requirements
       - UI specifications
       - API specifications
       - Database schema
       - Testing strategy
       - Success metrics
   
   technical/ directory:
     - API design documents
     - Database schema documents
     - Security specifications
     - Performance requirements
     - Integration specifications
   
   business/ directory:
     - Revenue model
     - User personas
     - Success metrics
     - Business requirements
   
   compliance/ directory:
     - Privacy policy requirements
     - Data protection requirements
     - Accessibility requirements
     - Legal compliance
   ```

4. **Create Complete Requirements Inventory**
   ```
   Extract and document:
   - All MVP features (MUST implement first)
   - All post-MVP features (implement later)
   - All technical requirements
   - All API endpoints
   - All database tables/schemas
   - All UI components
   - All business logic
   - All security requirements
   - All performance requirements
   - All compliance requirements
   - All testing requirements
   ```

#### Step 2.2: Read Shared/General Documentation

**Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/shared/`

1. **Read Shared Features Documentation**
   ```
   For each shared feature used by this project:
   - Read complete PRD
   - Read architecture document
   - Understand integration requirements
   - Identify configuration needs
   - Note API/interface contracts
   - Understand customization points
   
   Common shared features:
   - Authentication system
   - Translation/i18n system
   - Staff management
   - Notification system
   - Email system
   - [Other shared features]
   ```

2. **Create Shared Features Inventory**
   ```
   For each shared feature:
   - Feature name
   - Purpose
   - Integration requirements
   - Configuration requirements
   - API endpoints used
   - Database tables/schemas
   - Dependencies
   - Customization needed for this project
   ```

#### Step 2.3: Read Relevant Guides

**Location**: `/Users/yoavweitzman/Documents/packages/docs/guides/`

1. **Identify Relevant Guides**
   ```
   Based on project type and requirements, read:
   
   IF project uses cloud infrastructure:
     → Read CLOUD_INFRASTRUCTURE_DEPLOYMENT.md
   
   IF project has commands/scripts:
     → Read COMMAND_VS_SCRIPT.md
   
   IF project uses Port Manager:
     → Read port-manager guide (if exists)
   
   IF project uses specific packages:
     → Read relevant package guides
   
   Read all guides in /guides/ directory and evaluate relevance
   ```

2. **Extract Applicable Patterns**
   ```
   For each relevant guide:
   - Identify patterns that apply to this project
   - Note best practices to follow
   - Identify standards to maintain
   - Document integration requirements
   ```

---

### Phase 3: Current Implementation Analysis (Thorough)

**Examine EVERY aspect of the current project implementation.**

#### Step 3.1: Project Structure Analysis

1. **Directory Structure**
   ```
   - List all directories
   - Identify framework/structure (Angular, React, Vue, PHP, etc.)
   - Locate source code directories
   - Locate configuration files
   - Locate test directories
   - Locate documentation (local to project)
   ```

2. **Configuration Files**
   ```
   Read and analyze:
   - package.json (if Node.js project)
   - composer.json (if PHP project)
   - tsconfig.json / angular.json (if TypeScript/Angular)
   - webpack.config.js / vite.config.js
   - .env.example / environment configs
   - Database configuration
   - API configuration
   - Build configuration
   - Deployment configuration
   ```

#### Step 3.2: Code Inventory (Complete)

1. **Frontend Code Analysis** (if applicable)
   ```
   Analyze all:
   - Components/views
   - Services
   - Models/interfaces
   - State management
   - Routing
   - API integration
   - Forms
   - Styling
   - Assets
   - Utilities
   - Guards/middleware
   ```

2. **Backend Code Analysis** (if applicable)
   ```
   Analyze all:
   - API endpoints/controllers
   - Business logic/services
   - Database models/entities
   - Middleware
   - Authentication/authorization
   - Validation
   - Error handling
   - Database migrations
   - Seeders
   - Utilities
   ```

3. **Database Analysis**
   ```
   Analyze:
   - Database schema
   - Tables/collections
   - Relationships
   - Indexes
   - Constraints
   - Migrations
   - Seeders
   ```

4. **API Analysis**
   ```
   Analyze:
   - All endpoints
   - HTTP methods
   - Request/response formats
   - Authentication
   - Authorization
   - Validation
   - Error handling
   - API documentation (Swagger/OpenAPI)
   ```

5. **Testing Analysis**
   ```
   Analyze:
   - Unit tests
   - Integration tests
   - E2E tests
   - Test coverage
   - Testing strategy
   ```

#### Step 3.3: Feature Implementation Status

For EVERY feature documented, check:

1. **MVP Features** (Priority 1)
   ```
   For each MVP feature:
   - Is it implemented? (Yes/No/Partial)
   - If implemented: Does it match documentation? (Yes/No/Differences)
   - If not implemented: Why not? (Missing, in progress, blocked)
   - If partial: What's missing? (Specific gaps)
   ```

2. **Post-MVP Features** (Priority 2+)
   ```
   For each post-MVP feature:
   - Is it implemented? (Yes/No/Partial)
   - Should it be? (Based on current phase)
   - If implemented early: Why? (User request, dependency, etc.)
   ```

3. **Shared Features Integration**
   ```
   For each shared feature:
   - Is it integrated? (Yes/No/Partial)
   - Is integration correct? (Matches documentation)
   - Is configuration correct?
   - Are APIs used correctly?
   ```

---

### Phase 4: Gap Analysis (Detailed)

**Identify EVERY gap between documentation and implementation.**

#### Step 4.1: Feature Gaps

1. **Missing Features**
   ```
   List all features that are:
   - Documented but not implemented
   - Required for MVP but missing
   - Required for current phase but missing
   
   For each missing feature:
   - Feature name
   - Documented location
   - Priority (MVP, Phase 2, Phase 3, etc.)
   - Dependencies
   - Estimated effort
   ```

2. **Partial Features**
   ```
   List all features that are:
   - Partially implemented
   - Implementation doesn't match docs
   - Missing some requirements
   
   For each partial feature:
   - Feature name
   - What's implemented
   - What's missing
   - What differs from docs
   - Priority
   ```

3. **Incorrect Implementations**
   ```
   List all features that are:
   - Implemented differently than documented
   - Using different patterns than documented
   - Not following documented architecture
   
   For each incorrect implementation:
   - Feature name
   - Current implementation approach
   - Documented approach
   - Why it differs
   - Should it be changed?
   ```

#### Step 4.2: Technical Gaps

1. **Architecture Gaps**
   ```
   Compare documented architecture vs current:
   - System structure
   - Component organization
   - Data flow
   - Integration points
   - Security implementation
   - Performance optimizations
   ```

2. **API Gaps**
   ```
   Compare documented APIs vs current:
   - Missing endpoints
   - Incorrect endpoints
   - Missing request/response fields
   - Incorrect HTTP methods
   - Missing validation
   - Missing error handling
   - Missing authentication/authorization
   ```

3. **Database Gaps**
   ```
   Compare documented schema vs current:
   - Missing tables/collections
   - Missing fields/columns
   - Missing relationships
   - Missing indexes
   - Missing constraints
   - Incorrect data types
   ```

4. **Testing Gaps**
   ```
   Compare documented testing vs current:
   - Missing test types (unit, integration, E2E)
   - Insufficient coverage
   - Missing critical test cases
   - Missing test automation
   ```

#### Step 4.3: Business/Compliance Gaps

1. **Business Logic Gaps**
   ```
   Compare documented business logic vs current:
   - Missing rules
   - Incorrect implementations
   - Missing validations
   - Missing workflows
   ```

2. **Compliance Gaps**
   ```
   Compare documented compliance vs current:
   - Missing privacy features
   - Missing accessibility features
   - Missing security features
   - Missing legal requirements
   ```

---

### Phase 5: Gap Prioritization

**Prioritize gaps based on MVP, phase, and criticality.**

#### Priority 1: MVP Gaps (MUST FIX IMMEDIATELY)

```
All gaps related to MVP features:
- Missing MVP features
- Partial MVP features
- Incorrect MVP implementations
- Security/compliance issues in MVP
```

#### Priority 2: Current Phase Gaps (FIX SOON)

```
All gaps related to current development phase:
- Missing features for current phase
- Partial features for current phase
- Technical debt affecting current phase
```

#### Priority 3: Future Phase Gaps (FIX LATER)

```
All gaps related to future phases:
- Post-MVP features
- Nice-to-have features
- Optimizations
- Enhancements
```

#### Priority 4: Optional Gaps (CONSIDER)

```
All gaps that are optional:
- Features not in roadmap but implemented differently
- Alternative implementations that work
- Non-critical improvements
```

---

### Phase 6: Implementation Plan

**Create detailed plan to fill all gaps.**

#### Step 6.1: Create Implementation Tasks

For each gap (starting with Priority 1):

```markdown
## Task: [Feature/Gap Name]

**Priority**: [P1/P2/P3/P4]
**Type**: [Missing/Partial/Incorrect]
**Phase**: [MVP/Phase 2/Phase 3]

### Documentation Reference
- File: [Path to documentation]
- Section: [Specific section]
- Requirements: [List all requirements]

### Current State
- Status: [Not implemented/Partial/Incorrect]
- What exists: [Current implementation if any]
- What's missing: [Specific gaps]

### Implementation Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]
[...detailed steps...]

### Files to Create/Modify
- [File 1]: [What to add/change]
- [File 2]: [What to add/change]

### Dependencies
- [Dependency 1]
- [Dependency 2]

### Testing Requirements
- [Test 1]
- [Test 2]

### Success Criteria
- [Criterion 1]
- [Criterion 2]
```

#### Step 6.2: Implementation Order

```
Order tasks by:
1. Priority (P1 → P4)
2. Dependencies (prerequisites first)
3. Logical grouping (related features together)
4. Complexity (simple first when possible)
```

---

### Phase 7: Implementation Execution

**Implement ALL gaps, starting with highest priority.**

#### For Each Task:

1. **Review Documentation Again**
   ```
   - Re-read relevant documentation section
   - Confirm understanding
   - Note any edge cases
   - Identify success criteria
   ```

2. **Implement Feature/Fix**
   ```
   - Create/modify required files
   - Follow documented architecture
   - Use documented patterns
   - Implement all requirements
   - Add error handling
   - Add validation
   - Add logging (if documented)
   ```

3. **Test Implementation**
   ```
   - Unit tests
   - Integration tests
   - Manual testing
   - Verify against documentation
   - Verify success criteria
   ```

4. **Update Local Project Docs** (if project has local docs)
   ```
   - Update README if needed
   - Update local technical docs
   - Add code comments
   - Update API docs
   - NOTE: Do NOT update central docs
   ```

5. **Verify Completion**
   ```
   - All requirements implemented
   - All tests passing
   - No regressions
   - Matches documentation
   - Ready for next task
   ```

---

### Phase 8: Final Verification

**Verify EVERYTHING is implemented correctly.**

#### Step 8.1: Complete Feature Verification

```
For EVERY documented feature:
- ✓ Feature implemented
- ✓ Matches documentation
- ✓ All requirements met
- ✓ Tests passing
- ✓ No gaps remaining
```

#### Step 8.2: Architecture Verification

```
Verify system architecture:
- ✓ Follows documented structure
- ✓ All components implemented
- ✓ All integrations working
- ✓ Data flow correct
- ✓ Security implemented
```

#### Step 8.3: API Verification

```
Verify all APIs:
- ✓ All endpoints implemented
- ✓ Correct HTTP methods
- ✓ Correct request/response formats
- ✓ Authentication working
- ✓ Authorization working
- ✓ Validation working
- ✓ Error handling working
```

#### Step 8.4: Database Verification

```
Verify database:
- ✓ All tables/collections exist
- ✓ All fields/columns correct
- ✓ All relationships correct
- ✓ All indexes created
- ✓ All constraints enforced
```

#### Step 8.5: Testing Verification

```
Verify testing:
- ✓ All required tests implemented
- ✓ Coverage meets requirements
- ✓ All tests passing
- ✓ Critical paths covered
```

---

## Output Format

### Implementation Report

```markdown
# Implementation Report: <Project Name>

**Date**: [Date]
**Project**: [Project Name]
**Documentation Location**: /Users/yoavweitzman/Documents/packages/docs/projects/<project-name>/

---

## Documentation Read (Complete)

### Project Documentation
- ✓ INDEX.md
- ✓ PRD_OVERVIEW.md (lines: XXX)
- ✓ ARCHITECTURE.md (lines: XXX)
- ✓ EXPERTS.md
- ✓ features/ (X files)
- ✓ technical/ (X files)
- ✓ business/ (X files)
- ✓ compliance/ (X files)

**Total Documentation Read**: [X files, X lines]

### Shared Documentation
- ✓ Authentication System (PRD + Architecture)
- ✓ Translation System (PRD + Architecture)
- ✓ [Other shared features]

**Total Shared Features**: [X features, X files]

### Guides Read
- ✓ [Guide 1]
- ✓ [Guide 2]
- ✓ [Guide 3]

**Total Guides**: [X guides]

---

## Gap Analysis Summary

### Priority 1: MVP Gaps (MUST FIX)
**Count**: [X gaps]

1. **[Gap Name]**: [Brief description]
   - Status: Missing/Partial/Incorrect
   - Impact: High/Critical
   - Effort: [Duration]

[Continue for all P1 gaps...]

### Priority 2: Current Phase Gaps (FIX SOON)
**Count**: [X gaps]

[List all P2 gaps...]

### Priority 3: Future Phase Gaps (FIX LATER)
**Count**: [X gaps]

[List all P3 gaps...]

### Priority 4: Optional Gaps (CONSIDER)
**Count**: [X gaps]

[List all P4 gaps...]

**Total Gaps Found**: [X gaps across all priorities]

---

## Implementation Summary

### Features Implemented
**Total**: [X features]

#### MVP Features (Priority 1)
- ✓ [Feature 1]: Fully implemented, tested, verified
- ✓ [Feature 2]: Fully implemented, tested, verified
- ✓ [Feature 3]: Fully implemented, tested, verified
[Continue for all MVP features...]

#### Post-MVP Features (Implemented)
- ✓ [Feature 1]: Fully implemented
- ✓ [Feature 2]: Fully implemented
[Continue...]

### Shared Features Integrated
- ✓ Authentication System: Integrated and configured
- ✓ Translation System: Integrated and configured
- ✓ [Other shared features]

### API Endpoints Implemented
**Total**: [X endpoints]
- ✓ GET /api/endpoint1
- ✓ POST /api/endpoint2
- ✓ PUT /api/endpoint3
[Continue for all endpoints...]

### Database Schema Implemented
**Total**: [X tables]
- ✓ Table: users (X columns, X relationships)
- ✓ Table: table2 (X columns, X relationships)
[Continue for all tables...]

### Tests Implemented
- Unit Tests: [X tests, XX% coverage]
- Integration Tests: [X tests]
- E2E Tests: [X tests]
- **Total Tests**: [X tests]

---

## Verification Results

### Feature Verification
- ✓ All MVP features: 100% implemented and verified
- ✓ All current phase features: 100% implemented and verified
- ✓ All documented requirements: Met

### Architecture Verification
- ✓ System structure: Matches documentation
- ✓ Component organization: Correct
- ✓ Data flow: Verified
- ✓ Security: Implemented per docs

### API Verification
- ✓ All endpoints: Implemented and tested
- ✓ Authentication: Working
- ✓ Authorization: Working
- ✓ Validation: Working
- ✓ Error handling: Implemented

### Database Verification
- ✓ Schema: Matches documentation
- ✓ Relationships: Correct
- ✓ Indexes: Created
- ✓ Constraints: Enforced

### Testing Verification
- ✓ Coverage: Meets requirements (XX%)
- ✓ All tests: Passing
- ✓ Critical paths: Covered

---

## Files Created/Modified

### Created Files ([X files])
- [path/to/file1.ts]: [Purpose]
- [path/to/file2.ts]: [Purpose]
[Continue for all created files...]

### Modified Files ([X files])
- [path/to/file1.ts]: [Changes made]
- [path/to/file2.ts]: [Changes made]
[Continue for all modified files...]

**Total Changes**: [X files created, X files modified]

---

## Remaining Work (If Any)

### Priority 1 (Urgent)
[None if all MVP complete, otherwise list remaining P1 items]

### Priority 2 (Important)
[List remaining P2 items if any]

### Priority 3 (Future)
[List remaining P3 items]

### Priority 4 (Optional)
[List remaining P4 items]

---

## Project Status

**MVP Implementation**: [X% complete]
**Current Phase Implementation**: [X% complete]
**Overall Documentation Alignment**: [X% complete]

**Status**: [Ready for Testing/In Progress/Needs Work]

---

## Next Steps

1. [Next step 1]
2. [Next step 2]
3. [Next step 3]

---

## Notes

- Documentation location: /Users/yoavweitzman/Documents/packages/docs/projects/<project-name>/
- Documentation was NOT modified (as required)
- All implementations follow documented patterns
- All gaps identified and addressed per priority
- Verification complete
```

---

## Key Principles

1. **Documentation is Source of Truth**: Always trust docs over current implementation
2. **Read Everything**: Never assume, read every file, every section
3. **Never Modify Docs**: This command only reads docs, never writes
4. **Thorough Gap Analysis**: Identify every gap, no matter how small
5. **Prioritize by MVP**: MVP gaps always come first
6. **Verify Everything**: Test and verify all implementations
7. **Follow Documented Patterns**: Use architecture and patterns from docs
8. **Complete Implementation**: Fill ALL gaps, not just some
9. **Document Changes**: Track all files created/modified
10. **Final Verification**: Verify complete alignment with documentation

---

## Error Handling

### Project Not Found
```
❌ Error: Project documentation not found

Searched locations:
- /Users/yoavweitzman/Documents/packages/docs/projects/<project-name>/
- /Users/yoavweitzman/Documents/packages/docs/reference/PROJECTS_LIST.md

Action required:
1. Create project documentation first
2. Or use correct project name
3. Or create project in docs
```

### Documentation Incomplete
```
⚠️ Warning: Incomplete documentation

Missing documentation:
- [Missing doc 1]
- [Missing doc 2]

Recommendation:
1. Complete project documentation first
2. Or implement based on available docs
3. Note missing documentation in report
```

### Shared Feature Not Found
```
⚠️ Warning: Shared feature documentation not found

Project references shared feature: [feature-name]
But documentation not found at: /Users/yoavweitzman/Documents/packages/docs/projects/shared/[feature-name]/

Action:
1. Create shared feature documentation
2. Or mark as project-specific
3. Or remove reference from project INDEX.md
```

---

## Best Practices

1. **Read First, Code Second**: Fully understand docs before implementing
2. **Start with MVP**: Always implement MVP features first
3. **One Feature at a Time**: Complete each feature before moving to next
4. **Test as You Go**: Test each implementation immediately
5. **Verify Against Docs**: Constantly compare implementation to docs
6. **Ask When Unclear**: If documentation is unclear, ask before implementing
7. **Document Decisions**: Note any implementation decisions in code comments
8. **Keep It Simple**: Follow documented approach, don't over-engineer
9. **Maintain Patterns**: Use consistent patterns from documentation
10. **Complete Before Moving On**: Finish all gaps before considering complete

---

## Success Criteria

Implementation is complete when:
- ✓ All documentation has been read (project + shared + guides)
- ✓ All gaps have been identified
- ✓ All Priority 1 (MVP) gaps are filled
- ✓ All Priority 2 (current phase) gaps are filled
- ✓ All implementations match documentation
- ✓ All tests are passing
- ✓ Complete verification has been done
- ✓ Implementation report is generated
- ✓ Project aligns 100% with documented MVP
- ✓ Ready for next development phase

---

**End of Command Definition**
