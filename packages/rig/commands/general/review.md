# Project Review Command

Conduct a comprehensive expert review of the current project. The expert reviews relevant parts of the project and creates a detailed review document with strengths, weaknesses, actionable items, and recommendations.

## Usage

Execute this command to review the current project:

```bash
/general/review expert="<expert-name>"
```

### Parameters

#### `expert` (mandatory)
- Name or role of the expert to conduct the review
- **Supported formats**:
  - **Human/Persona name** (e.g., "Arthur Davis", "Sarah Johnson", "Daisy Thompson")
  - Expert role name (e.g., "Security", "Backend", "UI/UX", "Testing")
  - Expert file name (e.g., "security_expert", "backend_expert")
  - Full expert title (e.g., "Security Expert", "Backend Development Expert")
- `expert="rand"`: Select a random expert from available experts
- `expert="relevant"`: Select the most relevant expert based on project type
- **Validation**:
  - If empty: Exit with error code 1 and message "Error: expert parameter is required"
  - If expert not found: Exit with error code 1 and message "Error: Expert '<expert-name>' not found"
- **Expert Selection Logic**:
  1. Search for matching expert file in `.cursor/rules/experts/`
  2. Try exact match: `<input>_expert.mdc`
  3. Try case-insensitive search in filenames
  4. Try searching for `name:` field in expert file frontmatter (e.g., "Arthur Davis" → `architecture_expert.mdc`)
  5. Try searching for keyword in expert titles (line with `# <Title> Expert`)
  6. For `expert="rand"`: Use `/local/expert` command or random selection
  7. For `expert="relevant"`: Analyze project type and select appropriate expert

### Examples

```bash
# Review with expert human/persona name
/general/review expert="Arthur Davis"      # Architecture Expert
/general/review expert="Sarah Johnson"     # Security Expert
/general/review expert="Daisy Thompson"    # UI/UX Expert

# Review with expert role name
/general/review expert="Security"
/general/review expert="Backend"
/general/review expert="UI/UX"

# Review with expert file name
/general/review expert="security_expert"
/general/review expert="backend_expert"

# Review with full expert title
/general/review expert="Security Expert"
/general/review expert="Backend Development Expert"

# Review with random expert
/general/review expert="rand"

# Review with most relevant expert for project type
/general/review expert="relevant"
```

---

## Workflow

### Step 1: Validate Expert Parameter

1. **Check if `expert` parameter is provided**:
   - If empty: Exit with error code 1 and message "Error: expert parameter is required"
   - Continue if provided

2. **Select Expert**:
   - **If `expert="rand"`**:
     - Use `/local/expert` command or randomly select from `.cursor/rules/experts/`
     - Get expert file name and load expertise
   - **If `expert="relevant"`**:
     - Analyze project type and purpose (see Step 2)
     - Match to most relevant expert based on project characteristics
     - **Expert Matching Logic**:
       - Backend projects → `backend_expert.mdc`
       - API projects → `api_design_expert.mdc` or `graphql_expert.mdc`
       - Security-focused → `security_expert.mdc`
       - Database-heavy → `database_expert.mdc`
       - Performance-critical → `performance_expert.mdc`
       - Educational platform → `content_expert.mdc` or `learning_analytics_expert.mdc`
       - Mobile app → `mobile_expert.mdc`
       - Frontend-heavy → `ui_ux_expert.mdc`
       - Documentation projects → `documentation_expert.mdc`
       - Accessibility-critical → `accessibility_expert.mdc`
       - Testing-focused → `testing_expert.mdc`
       - DevOps/CI-CD → `devops_expert.mdc`
       - Cloud infrastructure → `cloud_infrastructure_expert.mdc`
       - Internationalization → `i18n_expert.mdc`
       - SEO optimization → `seo_expert.mdc`
       - Code quality → `code_quality_expert.mdc`
       - Business intelligence → `bi_expert.mdc`
       - Product management → `product_manager_expert.mdc`
       - Architecture design → `architecture_expert.mdc`
       - Compliance/legal → `compliance_expert.mdc`
       - Copywriting → `copywriter_expert.mdc`
   - **If `expert="<name>"`**:
     - **Search Strategy** (try in order until match found):
       1. **Exact file match**: Try `<input>_expert.mdc` (e.g., "security" → "security_expert.mdc")
       2. **Case-insensitive file match**: Try all files in `.cursor/rules/experts/` (e.g., "Security" → "security_expert.mdc")
       3. **Persona name match**: Read `name:` field from frontmatter of each expert file and match (e.g., "Arthur Davis" → "architecture_expert.mdc")
       4. **Keyword search in filenames**: Remove "_expert.mdc" and match keyword (e.g., "ui/ux" → "ui_ux_expert.mdc")
       5. **Search in expert titles**: Read heading line of each expert file (`# <Title> Expert`) and match
     - If not found after all attempts: Exit with error code 1 and message "Error: Expert '<expert-name>' not found. Available experts: <list>"

3. **Load Expert Persona**:
   - Read expert file from `.cursor/rules/experts/<expert_name>_expert.mdc`
   - Extract expert title from line 1 (e.g., `# Security Expert`)
   - Load expert's expertise areas, responsibilities, and review guidelines
   - Store expert information for use in review

4. **Expert Search Algorithm Details**:
   ```
   function findExpert(input: string): string | null {
     const expertsDir = '.cursor/rules/experts/';
     const expertFiles = listFiles(expertsDir);
     
     // Strategy 1: Exact file match
     const exactMatch = `${input.toLowerCase()}_expert.mdc`;
     if (expertFiles.includes(exactMatch)) {
       return exactMatch;
     }
     
     // Strategy 2: Case-insensitive file match
     const caseInsensitive = expertFiles.find(file => 
       file.toLowerCase() === `${input.toLowerCase()}_expert.mdc`
     );
     if (caseInsensitive) {
       return caseInsensitive;
     }
     
     // Strategy 3: Persona/Human name match in frontmatter
     for (const file of expertFiles) {
       const frontmatter = readFrontmatter(`${expertsDir}${file}`);
       const expertName = frontmatter.name; // e.g., "Arthur Davis"
       if (expertName && expertName.toLowerCase() === input.toLowerCase()) {
         return file;
       }
     }
     
     // Strategy 4: Keyword match in filename (remove _expert.mdc)
     const keyword = input.toLowerCase().replace(/[\s\/]/g, '_');
     const keywordMatch = expertFiles.find(file => 
       file.replace('_expert.mdc', '') === keyword
     );
     if (keywordMatch) {
       return keywordMatch;
     }
     
     // Strategy 5: Search in expert titles (heading line of each file)
     for (const file of expertFiles) {
       const content = readFile(`${expertsDir}${file}`);
       const headingLine = content.split('\n').find(line => 
         line.trim().startsWith('# ') && line.includes('Expert')
       );
       if (headingLine) {
         const title = headingLine.replace('# ', '').toLowerCase();
         if (title.includes(input.toLowerCase())) {
           return file;
         }
       }
     }
     
     // Not found
     return null;
   }
   ```
   
   **Examples**:
   - Input: "Arthur Davis" → Matches: `architecture_expert.mdc` (via frontmatter `name:` field)
   - Input: "Sarah Johnson" → Matches: `security_expert.mdc` (via frontmatter `name:` field)
   - Input: "Security" → Matches: `security_expert.mdc` (via exact file match)
   - Input: "backend" → Matches: `backend_expert.mdc` (via case-insensitive)
   - Input: "UI/UX" → Matches: `ui_ux_expert.mdc` (via keyword search)
   - Input: "Testing & TDD" → Matches: `testing_expert.mdc` (via title search)
   - Input: "GraphQL API" → Matches: `graphql_expert.mdc` (via title search)

---

### Step 2: Identify Current Project

1. **Get Project Context**:
   ```
   - Get current working directory
   - Extract project name from directory structure
   - Identify project type (web app, mobile, backend, package, library, etc.)
   - Determine project tech stack (React, Node.js, Python, etc.)
   ```

2. **Locate Project Documentation**:
   ```
   - Primary docs: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/
   - Check if documentation exists
   - If not found: Use project code and structure for review
   ```

3. **Determine Project ID**:
   ```
   - Extract from directory name or package.json
   - Convert to kebab-case for docs path
   - Example: "learning-games" → docs/projects/learning-games/
   ```

---

### Step 3: Check for Existing Review

**Before conducting a new review, check if this expert has already reviewed this project.**

1. **Check for Existing Review File**:
   ```
   - Review file path: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/<expert-name>.md
   - Check if file exists
   ```

2. **If Existing Review Found**:
   - Read the existing review file completely
   - Extract all identified issues with their:
     - Severity rank
     - Labels
     - Description
     - Location (file paths, components)
     - Recommendations
   - Create a checklist of all issues from previous review

3. **Verify Issue Status**:
   - For each issue in the previous review:
     - Check if the issue still exists in current code
     - Check if the recommendation was implemented
     - Mark issue status:
       - ✅ **Completed**: Issue fixed/implemented as recommended
       - 🔄 **Partially Complete**: Some progress, but not fully resolved
       - ⏳ **In Progress**: Work started but not finished
       - ❌ **Not Started**: No changes made
       - 📝 **Changed**: Different approach taken
       - 🚫 **Won't Fix**: Decided not to address
   - Document completion rate: X out of Y issues resolved

4. **Update Review Approach**:
   - Focus on:
     - New issues not in previous review
     - Issues that remain unresolved
     - Changes made that weren't recommended
     - New problems introduced since last review
   - Include "Previous Review Status" section in new review
   - Provide updated priority based on what's been fixed

**If No Existing Review**:
- Proceed with full fresh review
- No status tracking needed

---

### Step 4: Review Documentation Directory & PRDs

**CRITICAL**: The expert must review the documentation directory and PRD files as part of the review process. These documents define what should be implemented next.

1. **Locate Project Documentation**:
   ```
   - Project docs path: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/
   - Check if directory exists
   - List all files and subdirectories
   ```

2. **Review PRD Files** (Priority: HIGH):
   **These PRD files define the next implementation phase - review carefully!**
   
   - **PRD_OVERVIEW.md or PRD.md**:
     - Are requirements clear and complete?
     - Are user stories well-defined?
     - Are acceptance criteria specified?
     - Are technical requirements documented?
     - Are non-functional requirements included?
     - Are success metrics defined?
   
   - **Feature-Specific PRDs** (in subdirectories):
     - Is each feature fully specified?
     - Are dependencies identified?
     - Are edge cases covered?
     - Are examples provided?
   
   - **PRD Quality Assessment**:
     - Completeness (all sections filled)
     - Clarity (unambiguous requirements)
     - Feasibility (technically achievable)
     - Testability (can be verified)
     - Consistency (no contradictions)

3. **Compare PRD vs Implementation**:
   - **What is documented but not implemented?**
     - Features in PRD but missing in code
     - Requirements not met in current implementation
     - Gaps between specification and reality
   - **What is implemented but not documented?**
     - Code features not mentioned in PRD
     - Implementation decisions not documented
     - Undocumented behavior or features
   - **What differs from PRD?**
     - Implementation deviates from specification
     - Different approach taken without documentation
     - Requirements partially implemented

4. **Review General Documentation Quality**:
   - **Completeness**: Are all features documented?
   - **Accuracy**: Does documentation match current implementation?
   - **Organization**: Is documentation well-structured?
   - **Clarity**: Is documentation clear and understandable?
   - **Up-to-date**: Is documentation current (check dates, version info)?
   - **Accessibility**: Is documentation easy to find and navigate?

5. **Documentation Issues to Identify**:
   - Missing documentation for features
   - Outdated documentation (doesn't match code)
   - Unclear or confusing documentation
   - Poor organization (hard to find information)
   - Missing examples or code samples
   - Broken links or references
   - Inconsistent formatting or style
   - Missing diagrams or visuals where helpful
   - **PRD gaps** (missing requirements, unclear specs)
   - **PRD-code misalignment** (implementation doesn't match PRD)

### Step 5: Read Project Documentation

**If documentation exists**, read comprehensively:

1. **Read INDEX.md** (if exists):
   - Understand documentation structure
   - Identify all linked files
   - Create reading list

2. **Read Core Documents**:
   ```
   In order of priority:
   1. PRD_OVERVIEW.md or PRD.md - Requirements
   2. ARCHITECTURE.md - Technical architecture
   3. EXPERTS.md - Expert reviews (to understand previous feedback)
   4. README.md - Project overview
   5. Any feature-specific PRDs in subdirectories
   ```

3. **Read Feature Documentation**:
   - All files in `features/` subdirectory
   - Any feature-specific PRDs, TASKS.md, or ARCHITECTURE.md files

4. **Read Reference Documentation**:
   - API documentation
   - Database schemas
   - Configuration guides
   - Deployment docs

**If documentation doesn't exist**:
- Note lack of documentation as a critical weakness (Rank 1-2 issue)
- Rely on code structure and files for review
- Recommend documentation creation as high priority

---

### Step 6: Analyze Project Code & Structure

1. **Read Project Files**:
   ```
   - package.json (or equivalent) - Dependencies, scripts, metadata
   - README.md - Project overview
   - Main source files (src/, lib/, app/, etc.)
   - Configuration files (.eslintrc, tsconfig.json, etc.)
   - Test files (if exist)
   - Build/deployment files (Dockerfile, CI/CD configs)
   ```

2. **Analyze Project Structure**:
   - Directory organization
   - File naming conventions
   - Module organization
   - Code architecture patterns

3. **Identify Review Scope Based on Expert**:
   - **Backend Expert**: Focus on APIs, database, server logic, performance
   - **Frontend Expert**: Focus on UI components, state management, UX
   - **Security Expert**: Focus on auth, data protection, vulnerabilities
   - **Accessibility Expert**: Focus on WCAG compliance, screen readers, keyboard navigation
   - **Performance Expert**: Focus on load times, bundle size, optimization
   - **Database Expert**: Focus on schemas, queries, migrations, optimization
   - **Architecture Expert**: Focus on system design, scalability, patterns
   - **Testing Expert**: Focus on test coverage, test quality, TDD practices
   - **Documentation Expert**: Focus on code docs, API docs, user guides
   - **DevOps Expert**: Focus on CI/CD, deployment, infrastructure, monitoring
   - **And so on for each expert type...**

---

### Step 7: Conduct Expert Review

**The expert reviews the project based on their expertise, following these guidelines:**

#### Review Focus Areas

1. **Strengths**:
   - What is done well?
   - What follows best practices?
   - What demonstrates good design/implementation?
   - What shows attention to quality?

2. **Weaknesses**:
   - What needs improvement?
   - What violates best practices?
   - What creates technical debt?
   - What creates risks?
   - What is missing?

3. **Things to Change** (with severity ranking):
   - **Rank 1 (Critical)**: Security vulnerabilities, data loss risks, compliance violations, production-breaking issues
   - **Rank 2 (High)**: Major bugs, significant performance issues, accessibility violations (WCAG AA), major technical debt
   - **Rank 3 (Medium)**: Moderate bugs, code quality issues, missing features, usability problems
   - **Rank 4 (Low)**: Minor improvements, code style issues, nice-to-have features, minor optimizations
   - **Rank 5 (Trivial)**: Cosmetic changes, personal preferences, very minor improvements

4. **Item Labels**:
   - `bug` - Existing functionality that doesn't work correctly
   - `security` - Security vulnerability or risk
   - `performance` - Performance issue or optimization
   - `accessibility` - Accessibility issue (a11y)
   - `improvement` - Enhancement to existing functionality
   - `new-feature` - New functionality to add
   - `refactor` - Code restructuring without behavior change
   - `documentation` - Documentation missing or needs update
   - `testing` - Test coverage or quality issue
   - `tech-debt` - Technical debt that should be addressed
   - `compliance` - Legal/regulatory compliance issue
   - `ux` - User experience issue
   - `design` - Design or visual issue
   - `dependency` - Dependency update or issue
   - `configuration` - Configuration issue
   - `deployment` - Deployment or infrastructure issue
   - `i18n` - Internationalization or localization issue
   - `mobile` - Mobile-specific issue or optimization
   - `api` - API design or implementation issue
   - `database` - Database schema or query issue
   - `architecture` - Architecture or system design issue
   - `devops` - DevOps, CI/CD, or infrastructure issue

5. **Business Impact Assessment**:
   Each issue should also include business impact evaluation:
   - `high-impact` - Affects revenue, user acquisition, or critical functionality
   - `medium-impact` - Affects user experience, engagement, or secondary features
   - `low-impact` - Minor effects on business metrics or non-critical areas

#### Review Structure

The expert should organize findings into these sections:

1. **Executive Summary**:
   - Overall assessment (1-2 paragraphs)
   - Key findings summary
   - Overall project health rating (1-10)

2. **Strengths**:
   - List of things done well
   - Positive patterns observed
   - Best practices followed

3. **Weaknesses**:
   - List of areas needing improvement
   - Anti-patterns observed
   - Missing best practices

4. **Critical Issues** (Rank 1):
   - Items requiring immediate attention
   - Security, compliance, or production risks

5. **High Priority Issues** (Rank 2):
   - Items requiring attention soon
   - Major bugs or significant problems

6. **Medium Priority Issues** (Rank 3):
   - Items to address in near future
   - Moderate improvements needed

7. **Low Priority Issues** (Rank 4):
   - Items to consider when time permits
   - Minor improvements

8. **Trivial Issues** (Rank 5):
   - Optional improvements
   - Nice-to-have changes

9. **Recommendations**:
   - Strategic recommendations
   - Architecture improvements
   - Process improvements
   - Learning resources

10. **Next Steps**:
    - Suggested priority order for addressing issues
    - Quick wins vs long-term improvements
    - Dependencies between items

---

### Step 8: Create Review Document

1. **Determine Review Document Path**:
   ```
   - Path: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/<expert-name>.md
   - Create directories if they don't exist
   - Format expert name as kebab-case (e.g., "sarah-johnson.md")
   ```

2. **Write Review Document**:
   - Use the template below
   - Include all findings
   - Provide specific examples and code references
   - Include actionable recommendations

3. **Review Document Template**:

```markdown
# Project Review: <Project Name>

**Reviewer**: <Expert Name>  
**Expertise**: <Expert's Field>  
**Review Date**: <Current Date>  
**Project Version**: <Version from package.json if available>  
**Review Type**: <Initial Review / Follow-up Review>  
**Previous Review Date**: <Date of previous review, if exists>

---

## Previous Review Status

**[Include this section ONLY if a previous review exists]**

**Previous Review Date**: <Date>  
**Issues Identified in Previous Review**: <Number>  
**Issues Resolved**: <Number>  
**Resolution Rate**: <Percentage>%

### Resolved Issues ✅

[List all issues from previous review that have been fixed/implemented]

#### <Issue Title> (Previously Rank X)
- **Status**: ✅ Completed
- **Original Issue**: [Brief description]
- **Resolution**: [How it was fixed]
- **Verification**: [How you confirmed it's fixed]

### Partially Resolved Issues 🔄

[List all issues that have some progress but aren't fully resolved]

#### <Issue Title> (Previously Rank X)
- **Status**: 🔄 Partially Complete
- **Original Issue**: [Brief description]
- **Progress Made**: [What has been done]
- **Remaining Work**: [What still needs to be done]
- **Current Rank**: [Updated severity rank]

### Unresolved Issues ❌

[List all issues that have not been addressed]

#### <Issue Title> (Previously Rank X)
- **Status**: ❌ Not Started
- **Original Issue**: [Brief description]
- **Why Still an Issue**: [Why it wasn't addressed]
- **Current Rank**: [Updated severity rank if changed]

### New Issues Since Last Review 🆕

[Issues that were introduced or discovered since the previous review]

---

## Executive Summary

[1-2 paragraph overview of the project review]

**Overall Project Health**: [1-10 rating] / 10

**Key Findings**:
- [Finding 1]
- [Finding 2]
- [Finding 3]

---

## Strengths

[List of positive aspects]

### [Category 1]
- **[Strength 1]**: [Description and examples]
- **[Strength 2]**: [Description and examples]

### [Category 2]
- **[Strength 1]**: [Description and examples]

---

## Weaknesses

[List of areas needing improvement]

### [Category 1]
- **[Weakness 1]**: [Description and impact]
- **[Weakness 2]**: [Description and impact]

### [Category 2]
- **[Weakness 1]**: [Description and impact]

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### [Issue Title]
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact` / `medium-impact` / `low-impact`
- **Priority Score**: [Severity × Business Impact] (see Priority Matrix below)
- **Labels**: `security`, `bug`, etc.
- **Description**: [What is the issue?]
- **Impact**: [What are the consequences?]
- **Business Impact Details**: [How does this affect revenue, users, or business goals?]
- **Location**: [File path, line numbers, or component]
- **Recommendation**: [How to fix it]
- **Estimated Effort**: [Small / Medium / Large]

[Additional Rank 1 issues...]

---

### High Priority Issues (Rank 2) 🔴

#### [Issue Title]
- **Severity**: 2 (High)
- **Business Impact**: `high-impact` / `medium-impact` / `low-impact`
- **Priority Score**: [Severity × Business Impact]
- **Labels**: `bug`, `performance`, etc.
- **Description**: [What is the issue?]
- **Impact**: [What are the consequences?]
- **Business Impact Details**: [How does this affect revenue, users, or business goals?]
- **Location**: [File path, line numbers, or component]
- **Recommendation**: [How to fix it]
- **Estimated Effort**: [Small / Medium / Large]

[Additional Rank 2 issues...]

---

### Medium Priority Issues (Rank 3) 🟡

#### [Issue Title]
- **Severity**: 3 (Medium)
- **Business Impact**: `high-impact` / `medium-impact` / `low-impact`
- **Priority Score**: [Severity × Business Impact]
- **Labels**: `improvement`, `tech-debt`, etc.
- **Description**: [What is the issue?]
- **Impact**: [What are the consequences?]
- **Business Impact Details**: [How does this affect revenue, users, or business goals?]
- **Location**: [File path, line numbers, or component]
- **Recommendation**: [How to fix it]
- **Estimated Effort**: [Small / Medium / Large]

[Additional Rank 3 issues...]

---

### Low Priority Issues (Rank 4) 🟢

#### [Issue Title]
- **Severity**: 4 (Low)
- **Business Impact**: `high-impact` / `medium-impact` / `low-impact`
- **Priority Score**: [Severity × Business Impact]
- **Labels**: `improvement`, `refactor`, etc.
- **Description**: [What is the issue?]
- **Impact**: [What are the consequences?]
- **Business Impact Details**: [How does this affect revenue, users, or business goals?]
- **Location**: [File path, line numbers, or component]
- **Recommendation**: [How to fix it]
- **Estimated Effort**: [Small / Medium / Large]

[Additional Rank 4 issues...]

---

### Trivial Issues (Rank 5) ⚪

#### [Issue Title]
- **Severity**: 5 (Trivial)
- **Business Impact**: `high-impact` / `medium-impact` / `low-impact`
- **Priority Score**: [Severity × Business Impact]
- **Labels**: `improvement`, `design`, etc.
- **Description**: [What is the issue?]
- **Impact**: [What are the consequences?]
- **Business Impact Details**: [How does this affect revenue, users, or business goals?]
- **Location**: [File path, line numbers, or component]
- **Recommendation**: [How to fix it]
- **Estimated Effort**: [Small / Medium / Large]

[Additional Rank 5 issues...]

---

## Priority Matrix

This matrix helps prioritize issues by combining severity with business impact.

| Severity / Business Impact | High Impact | Medium Impact | Low Impact |
|----------------------------|-------------|---------------|------------|
| **Rank 1 (Critical)**      | P1 (Do Now) | P1 (Do Now)   | P2 (Do Soon) |
| **Rank 2 (High)**          | P1 (Do Now) | P2 (Do Soon)  | P3 (Do Later) |
| **Rank 3 (Medium)**        | P2 (Do Soon) | P3 (Do Later) | P4 (Backlog) |
| **Rank 4 (Low)**           | P3 (Do Later) | P4 (Backlog) | P4 (Backlog) |
| **Rank 5 (Trivial)**       | P4 (Backlog) | P4 (Backlog) | P4 (Backlog) |

**Priority Definitions**:
- **P1 (Do Now)**: Immediate action required - highest priority
- **P2 (Do Soon)**: Address in next sprint/iteration
- **P3 (Do Later)**: Schedule for future sprint
- **P4 (Backlog)**: Add to backlog, address when time permits

**Business Impact Guidelines**:
- **High Impact**: Affects revenue, user acquisition, retention, or critical user flows
- **Medium Impact**: Affects user experience, engagement, or secondary features
- **Low Impact**: Minor effects on business metrics or non-critical areas

### Issues by Priority

#### P1 Issues (Do Now)
[List all P1 issues with their severity rank and business impact]

#### P2 Issues (Do Soon)
[List all P2 issues with their severity rank and business impact]

#### P3 Issues (Do Later)
[List all P3 issues with their severity rank and business impact]

#### P4 Issues (Backlog)
[List all P4 issues with their severity rank and business impact]

---

## PRD Review

**[CRITICAL SECTION - PRDs define next implementation]**

### PRD Quality Assessment

**Overall PRD Quality**: [1-10 rating] / 10

#### PRD Completeness
- **Requirements Coverage**: [Complete / Partial / Missing]
- **User Stories**: [Well-defined / Need improvement / Missing]
- **Acceptance Criteria**: [Specified / Vague / Missing]
- **Technical Requirements**: [Documented / Incomplete / Missing]
- **Success Metrics**: [Defined / Need improvement / Missing]

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented**:
[List all features/requirements documented in PRD but missing in code]

**Features Implemented but Not in PRD**:
[List all features in code that aren't documented in PRD]

**Implementation Deviations from PRD**:
[List where implementation differs from PRD specification]

#### PRD Issues

[List PRD-specific issues with severity and priority]

##### <PRD Issue Title>
- **Severity**: [1-5]
- **Business Impact**: [high/medium/low]
- **Priority Score**: [P1-P4]
- **Labels**: `documentation`, `prd`, etc.
- **Issue**: [What's wrong with the PRD?]
- **Impact**: [How does this affect development?]
- **Recommendation**: [How to improve the PRD?]

### PRD Recommendations

**Strategic Recommendations**:
- [High-level recommendations for PRD improvements]
- [Areas that need better specification]

**Immediate PRD Updates Needed**:
- [Critical PRD updates before next implementation]
- [Missing requirements that must be documented]

---

## Documentation Review

### Documentation Strengths
- [What documentation exists and is well done?]
- [What is clearly documented?]

### Documentation Weaknesses
- [What documentation is missing?]
- [What documentation is outdated?]
- [What documentation is unclear?]

### Documentation Issues
[List documentation-specific issues with severity and priority]

---

## Recommendations

### Strategic Recommendations
- [High-level strategic advice]
- [Architecture improvements]
- [Process improvements]

### Technical Recommendations
- [Technical improvements]
- [Tool suggestions]
- [Library recommendations]

### Learning Resources
- [Documentation links]
- [Best practice guides]
- [Tutorial recommendations]

---

## Next Steps

### Immediate Actions (This Week)
1. [Action 1 - Rank 1 issues]
2. [Action 2 - Rank 1 issues]

### Short-term Actions (This Month)
1. [Action 1 - Rank 2 issues]
2. [Action 2 - Rank 2 issues]

### Medium-term Actions (This Quarter)
1. [Action 1 - Rank 3 issues]
2. [Action 2 - Rank 3 issues]

### Long-term Actions (Backlog)
1. [Action 1 - Rank 4-5 issues]
2. [Action 2 - Rank 4-5 issues]

---

## Summary Statistics

### Current Review
- **Total Issues Identified**: [Number]
- **Critical (Rank 1)**: [Number]
- **High Priority (Rank 2)**: [Number]
- **Medium Priority (Rank 3)**: [Number]
- **Low Priority (Rank 4)**: [Number]
- **Trivial (Rank 5)**: [Number]

### Previous Review Comparison (If Applicable)
- **Previous Total Issues**: [Number]
- **Issues Resolved**: [Number] (✅ Completed)
- **Issues Partially Resolved**: [Number] (🔄 Partially Complete)
- **Issues Unresolved**: [Number] (❌ Not Started)
- **New Issues Identified**: [Number] (🆕 New)
- **Resolution Rate**: [Percentage]%
- **Net Change**: [+/- Number] (Current - Previous + Resolved)

**Issue Distribution by Label**:
- Bug: [Number]
- Security: [Number]
- Performance: [Number]
- Accessibility: [Number]
- Improvement: [Number]
- New Feature: [Number]
- Refactor: [Number]
- Documentation: [Number]
- Testing: [Number]
- Tech Debt: [Number]
- Compliance: [Number]
- UX: [Number]
- Design: [Number]
- Dependency: [Number]
- Configuration: [Number]
- Deployment: [Number]
- i18n: [Number]
- Mobile: [Number]
- API: [Number]
- Database: [Number]
- Architecture: [Number]
- DevOps: [Number]

**Issue Distribution by Priority**:
- P1 (Do Now): [Number]
- P2 (Do Soon): [Number]
- P3 (Do Later): [Number]
- P4 (Backlog): [Number]

**Issue Distribution by Business Impact**:
- High Impact: [Number]
- Medium Impact: [Number]
- Low Impact: [Number]

---

## Review Methodology

[Brief description of how the review was conducted, what was analyzed, and any limitations or scope boundaries]

---

*This review was conducted by [Expert Name] on [Date]. For questions or clarifications, refer to the expert's persona at `.cursor/rules/experts/<expert_name>_expert.mdc`.*
```

---

### Step 9: Output Results

1. **Output Summary**:
   ```
   Project reviewed
   Project: <project-name>
   Expert: <Expert Name> (<Expertise>)
   Review Type: <Initial / Follow-up>
   Review document: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/<expert-name>.md
   
   Summary:
     Overall Health: [X]/10
     Total Issues: [N]
     Critical: [N]
     High Priority: [N]
     Medium Priority: [N]
     Low Priority: [N]
     Trivial: [N]
   
   [If Follow-up Review]:
   Previous Review Progress:
     Previous Issues: [N]
     Resolved: [N] (✅)
     Partially Resolved: [N] (🔄)
     Unresolved: [N] (❌)
     New Issues: [N] (🆕)
     Resolution Rate: [X]%
   
   Top 3 Priorities:
     1. [Issue 1 - Rank 1] [New/Unresolved]
     2. [Issue 2 - Rank 1] [New/Unresolved]
     3. [Issue 3 - Rank 2] [New/Partially Resolved]
   ```

2. **Display Key Findings**:
   - Show top 3-5 critical/high priority issues
   - Provide quick summary of expert's assessment
   - Link to full review document

---

## Expert-Specific Review Guidelines

### Security Expert Review Focus
- Authentication & authorization
- Data protection & encryption
- Input validation & sanitization
- STRIDE threat modeling
- OWASP Top 10 compliance
- Secrets management
- API security

### Accessibility Expert Review Focus
- WCAG 2.1 AA compliance
- Screen reader compatibility
- Keyboard navigation
- Color contrast (4.5:1 minimum)
- Touch target sizes (44x44px)
- ARIA attributes
- Alternative text for images

### Performance Expert Review Focus
- Page load times
- Bundle size & code splitting
- Database query optimization
- Caching strategies
- Lazy loading
- Core Web Vitals
- Memory leaks

### Backend Expert Review Focus
- API design & RESTful principles
- Database schema design
- Error handling
- Logging & monitoring
- Scalability
- Code organization
- Security best practices

### Frontend Expert Review Focus
- Component architecture
- State management
- Code splitting
- Accessibility
- Performance
- Browser compatibility
- CSS organization

### Database Expert Review Focus
- Schema design & normalization
- Query optimization
- Indexing strategy
- Migration management
- Data integrity
- Backup/recovery
- Connection pooling

### UI/UX Expert Review Focus
- User flow & navigation
- Visual hierarchy
- Consistency
- Responsive design
- Mobile experience
- Error states
- Loading states

### Testing Expert Review Focus
- Test coverage
- Test quality
- TDD practices
- Integration tests
- E2E tests
- CI/CD integration
- Test maintainability

### Documentation Expert Review Focus
- **Code documentation** (JSDoc, comments)
- **API documentation** (completeness, accuracy, examples)
- **README completeness** (overview, installation, usage, configuration)
- **Setup instructions** (clear, accurate, tested)
- **Architecture docs** (diagrams, design decisions, patterns)
- **User guides** (tutorials, how-tos, troubleshooting)
- **Changelog** (maintained, semantic versioning)
- **Documentation in docs/ directory**:
  - PRD accuracy vs implementation
  - Feature documentation completeness
  - Documentation organization and findability
  - Outdated documentation identification
  - Missing documentation identification
  - Documentation clarity and examples
  - Broken links or references
  - Consistent formatting and style

### DevOps Expert Review Focus
- CI/CD pipeline
- Deployment process
- Infrastructure as Code
- Monitoring & alerting
- Logging
- Environment configuration
- Backup & disaster recovery

---

## Implementation Notes

### Expert Selection for `expert="relevant"`

**Project Type Analysis**:
1. Analyze project structure and files
2. Check package.json for dependencies
3. Determine primary tech stack
4. Match to expert:
   - React/Vue/Angular → UI/UX Expert
   - Express/FastAPI/Django → Backend Expert
   - PostgreSQL/MongoDB → Database Expert
   - AWS/Docker/K8s → DevOps Expert
   - Educational platform → Educational Content Expert
   - Mobile (React Native/Flutter) → Mobile Expert
   - API-heavy → API Expert

### Review Scope

**The review should be thorough but focused on the expert's domain:**
- Expert should NOT review areas outside their expertise
- Focus on providing actionable, specific feedback
- Include examples and code references
- Prioritize by severity and impact

### Tracking Previous Reviews

**When a previous review exists:**
1. Read the entire previous review document
2. Extract all issues with their details
3. For each issue, verify current status:
   - Check if code/docs have changed
   - Check if issue still exists
   - Check if recommendation was followed
4. Categorize each issue:
   - ✅ **Completed**: Issue fully resolved
   - 🔄 **Partially Complete**: Some progress made
   - ⏳ **In Progress**: Work started but not done
   - ❌ **Not Started**: No changes detected
   - 📝 **Changed**: Different solution implemented
   - 🚫 **Won't Fix**: Explicitly decided not to fix
5. Calculate resolution rate
6. Update "Previous Review Status" section
7. Focus new review on:
   - Unresolved issues (why still present?)
   - New issues since last review
   - Issues introduced by fixes
   - Changes not in previous review

**Verification Methods**:
- Code search for file paths mentioned in previous review
- Check if recommended code patterns are present
- Verify documented issues are no longer present
- Check git history for changes to mentioned files (if accessible)
- Compare current code structure with previous review notes

### Error Handling

**Exit Codes**:
- `0`: Success - Review completed and document created
- `1`: Error - Invalid parameters, expert not found, or review failed

**Error Messages**:
- "Error: expert parameter is required" (if expert is empty)
- "Error: Expert '<expert-name>' not found" (if expert doesn't exist)
- "Error: Cannot determine project context" (if project can't be identified)
- "Error: Review failed: [error message]" (if review process fails)

---

## Best Practices

### For Expert Reviewers

1. **Be Specific**: Provide exact file paths, line numbers, and examples
2. **Be Actionable**: Give clear recommendations, not just criticisms
3. **Prioritize Correctly**: Use severity rankings appropriately
4. **Consider Context**: Understand project constraints and goals
5. **Be Constructive**: Frame feedback positively when possible
6. **Provide Resources**: Link to documentation, best practices, examples
7. **Estimate Effort**: Help team plan by estimating fix complexity

### For Review Quality

1. **Thorough Analysis**: Review comprehensively within expert domain
2. **Evidence-Based**: Base findings on code/docs, not assumptions
3. **Balanced View**: Include both strengths and weaknesses
4. **Forward-Looking**: Provide strategic recommendations
5. **Practical Focus**: Prioritize issues that matter most
6. **Clear Communication**: Write clearly and concisely
7. **Respect Scope**: Stay within the expert's expertise area

---

## Related Commands

- `/general/implement` - Implement features from documentation
- `/general/implement-reviews` - Implement issues from existing review files and mark them done
- `/local/feature-review` - Review specific feature implementation
- `/local/expert` - Select random expert
- `/local/file` - Select random file

---

## Review/Contribution

**Created**: 2026-01-24  
**Purpose**: Enable comprehensive expert reviews of projects with detailed, actionable feedback organized by severity and type. Creates structured review documents that serve as roadmaps for project improvement.
