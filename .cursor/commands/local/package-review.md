# Package Review Command

Review a specific package implementation against documentation and best practices. Makes actual changes, doesn't just suggest them. Operates at package level (one level higher than feature review).

## ⚠️ CRITICAL REQUIREMENT: SUBSTANTIVE IMPROVEMENTS

**REVIEWS MUST ACTUALLY IMPROVE THE PACKAGE, NOT JUST DESCRIBE WHAT SHOULD BE CHANGED.**

### Core Principle: DO, DON'T SUGGEST

**When reviewing a package, this means CHANGE THE CODE where improvements are needed. Add missing functionality, fix bugs, improve structure. DO NOT suggest what to do - DO IT.**

- ❌ **FORBIDDEN**: Adding only a review section that describes what "should be added" or "should be fixed"
- ❌ **FORBIDDEN**: Describing changes without actually making them
- ❌ **FORBIDDEN**: Suggesting improvements without implementations
- ✅ **REQUIRED**: Actually making changes to improve the package:
  - **Adding**: Missing methods, functionality, tests, documentation
  - **Fixing**: Bugs, errors, incorrect implementations, type issues
  - **Deleting**: Dead code, unused imports, deprecated code
  - **Improving**: Code quality, structure, performance, maintainability
- ✅ **REQUIRED**: Update documentation to reflect changes
- ✅ **REQUIRED**: Document review findings in both package and `/docs`

## Usage

Execute this command to review a specific package:

```bash
/local/package-review package="<package>"
```

### Parameters

#### `package` (mandatory)
- Format: `<package>` (e.g., `core`, `task-manager`, `template-project`)
- **Validation**:
  - If empty: Exit with error code 1 and message "Error: package parameter is required"
  - If wrong format (contains `/`): Exit with error code 1 and message "Error: package parameter must be top-level (no '/' allowed)"
  - If package not found: Exit with error code 1 and message "Error: Package '<package>' not found at 'packages/<package>/'"
- **Package Location**: Packages are located in `packages/<package>/`
- **Examples**:
  - `core` → `packages/core/`
  - `task-manager` → `packages/task-manager/`
  - `template-project` → `packages/template-project/`

#### `expert` (optional)
- If empty or expert not found: Review from your point of view (general review)
- If specified: Ask that expert to review the package
- `expert="all"`: Review with all experts one by one (sequential reviews)
- `expert="rand"`: Select randomly one expert from available experts
- `expert="relevant"`: Select the most relevant expert for this package based on package type and documentation
- **Expert Selection Logic**:
  - For `expert="relevant"`: Analyze package type, read PRD if available, match to expert expertise
  - For `expert="rand"`: Use `/local/expert` command or random selection from `.cursor/rules/experts/`
  - For `expert="all"`: Get all experts from `.cursor/rules/experts/` and review sequentially

#### `docs` (optional, default=false)
- If `true`: Read relevant documentation in `docs/` directory before review
- **Documentation Lookup**:
  - Check `docs/features/<package-name>/PRD.md` (if exists)
  - Check `docs/features/<package-name>/TASKS.md` (if exists)
  - Check `docs/features/<package-name>/ARCHITECTURE.md` (if exists)
  - Check `docs/features/<package-name>/API.md` (if exists)
  - Check `docs/reference/` for related documentation
  - Check `docs/guides/` for related guides
- **Documentation Usage**: Use documentation to understand requirements, architecture, and expected behavior before reviewing code

### Examples

```bash
# Review core package with general review
/local/package-review package="core"

# Review with specific expert
/local/package-review package="core" expert="David Anderson"

# Review with all experts sequentially
/local/package-review package="core" expert="all"

# Review with random expert
/local/package-review package="core" expert="rand"

# Review with most relevant expert
/local/package-review package="core" expert="relevant"

# Review with docs reading enabled
/local/package-review package="core" docs=true

# Review with expert and docs
/local/package-review package="core" expert="Sarah Johnson" docs=true
```

## Workflow

### Step 1: Validate Package Parameter

1. **Check if `package` parameter is provided**:
   - If empty: Exit with error code 1 and message "Error: package parameter is required"
   - Continue if provided

2. **Validate format**:
   - Check if format contains `/` (must be top-level only)
   - If contains `/`: Exit with error code 1 and message "Error: package parameter must be top-level (no '/' allowed)"
   - Continue if valid format

3. **Check if package exists**:
   - Construct package path: `packages/<package>/`
   - Check if directory exists
   - If not found: Exit with error code 1 and message "Error: Package '<package>' not found at 'packages/<package>/'"
   - Continue if found

### Step 2: Read Documentation (if `docs=true`)

1. **Find Package Documentation**:
   - Check `docs/features/<package-name>/PRD.md`
   - Check `docs/features/<package-name>/TASKS.md`
   - Check `docs/features/<package-name>/ARCHITECTURE.md`
   - Check `docs/features/<package-name>/API.md`
   - Check `docs/reference/` for related files
   - Check `docs/guides/` for related guides

2. **Read Documentation**:
   - Read all found documentation files
   - Extract requirements, architecture, API specifications
   - Understand expected behavior and implementation details
   - Note any discrepancies between docs and code

3. **Documentation Analysis**:
   - Compare documentation requirements with actual implementation
   - Identify missing features, incorrect implementations, gaps
   - Note any documentation that needs updating

### Step 3: Select Expert (if `expert` parameter provided)

1. **If `expert` is empty or not found**:
   - Use general review (your point of view)
   - Continue to Step 4

2. **If `expert="all"`**:
   - Get all expert files from `.cursor/rules/experts/*.mdc`
   - Review with each expert sequentially (one after another)
   - For each expert: Perform Step 4-7
   - Continue to Step 8 after all experts reviewed

3. **If `expert="rand"`**:
   - Use `/local/expert` command or randomly select from `.cursor/rules/experts/`
   - Get expert name and expertise
   - Continue to Step 4

4. **If `expert="relevant"`**:
   - Analyze package type and purpose
   - Read PRD if available to understand package domain
   - Match package to most relevant expert based on expertise
   - **Expert Matching Logic**:
     - Database packages → Database Expert (David Anderson)
     - API packages → RESTful API Expert (Andrew Lee) or GraphQL Expert (Rachel Kim)
     - Security packages → Security Expert (Sarah Johnson)
     - Performance packages → Performance Expert (James Martinez)
     - Architecture packages → Architecture Expert (Arthur Davis)
     - Documentation packages → Documentation Expert (Dorothy Clark)
     - Testing packages → Testing Expert (Thomas Mitchell)
     - And so on...
   - Continue to Step 4

5. **If `expert="<name>"`**:
   - Use specified expert name
   - Check if expert exists in `.cursor/rules/experts/<expert_name>_expert.mdc`
   - If not found: Fall back to general review (your point of view)
   - Continue to Step 4

### Step 4: Check for Relevant New Features to Implement

1. **Scan `docs/features/` Directory**:
   - Look for feature PRDs in `docs/features/` that are relevant to this package
   - Check if any features are planned but not yet implemented
   - Match features to package based on:
     - Feature name matching package name or purpose
     - Feature description matching package functionality
     - Feature requirements matching package capabilities

2. **If Relevant Feature Found**:
   - **Implement the Feature**:
     - Read the feature PRD and TASKS
     - Implement the feature in `packages/<package>/src/features/<feature-name>/`
     - Follow the same implementation process as feature review
     - Make actual changes (add code, fix issues, improve structure)
   - **Exit with Success**:
     - Output: "Feature implemented: [feature-name] in package [package]"
     - Exit with code 0
     - **DO NOT** continue to package review

3. **If No Relevant Feature Found**:
   - **Suggest New Feature**:
     - Analyze package functionality and identify gaps
     - Propose a new feature that would enhance the package
     - Prompt user: "Would you like to plan a new feature '[feature-name]' for package '[package]'? (yes/no)"
   
4. **If User Agrees to New Feature**:
   - **Plan Feature into PRD**:
     - Create `docs/features/<feature-name>/PRD.md`
     - Create `docs/features/<feature-name>/TASKS.md`
     - Plan the feature with requirements, architecture, tasks
     - Follow PRD creation best practices
   - **Exit with Success**:
     - Output: "Feature planned: [feature-name] for package [package]"
     - Exit with code 0
     - **DO NOT** continue to package review

5. **If User Declines New Feature**:
   - Continue to Step 5 (Review Package)

### Step 5: Analyze Package Implementation

1. **Read Package Code**:
   - Read all TypeScript/JavaScript files in package directory
   - **IGNORE** `packages/<package>/src/features/` directory (do not drill down into features)
   - Read package-level files:
     - `package.json`
     - `README.md`
     - `index.ts` or `index.js`
     - Core package files (outside features directory)
     - Configuration files
     - Test files (package-level tests)
   - Understand package structure and implementation

2. **Check Package Structure**:
   - Verify package follows expected structure (based on PRD if available)
   - Check for missing components (exports, main entry point, tests, etc.)
   - Verify package.json configuration
   - Verify exports and public API

3. **Compare with Documentation** (if `docs=true`):
   - Compare implementation with PRD requirements
   - Check if all required package-level features are implemented
   - Verify API matches documentation
   - Check if architecture matches design docs

4. **Identify Issues**:
   - Missing functionality
   - Incorrect implementations
   - Bugs or errors
   - Code quality issues
   - Missing tests
   - Missing documentation
   - Type errors
   - Performance issues
   - Security issues
   - Package configuration issues

### Step 6: Review and Improve Package

1. **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY IMPROVE the package, not just describe what should be changed

2. **Make Actual Changes**:
   - **Adding**: Add missing methods, functionality, tests, error handling, type definitions
   - **Fixing**: Fix bugs, correct implementations, fix type errors, fix logic errors
   - **Deleting**: Remove dead code, unused imports, deprecated code, duplicate code
   - **Improving**: Improve code quality, structure, performance, maintainability, documentation
   - **⚠️ IMPORTANT**: Do NOT modify files in `packages/<package>/src/features/` directory (ignore features dir)

3. **Code Improvements**:
   - Fix linter errors
   - Add missing type definitions
   - Improve error handling
   - Add missing tests (package-level tests)
   - Improve code structure
   - Add missing documentation (JSDoc, comments)
   - Optimize performance
   - Fix security issues
   - Fix package.json configuration
   - Fix exports and public API

4. **Package Completeness**:
   - Ensure all PRD requirements are implemented (if PRD exists)
   - Ensure all documented APIs are implemented
   - Ensure all CLI commands are implemented (if applicable)
   - Ensure all tests are written (if applicable)
   - Ensure package.json is properly configured
   - Ensure README is complete

5. **Documentation Updates**:
   - Update package documentation if implementation changed
   - Update API documentation if API changed
   - Update README if needed
   - Add missing documentation

### Step 7: Document Review Findings

1. **Update Package Documentation** (in package):
   - Create or update `packages/<package>/REVIEW.md` (or similar)
   - Document review findings, changes made, improvements
   - Include expert name, expertise, date, changes made

2. **Update Documentation** (in `/docs`):
   - Update `docs/features/<package-name>/PRD.md` if needed (add review section)
   - Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Increment "Files Reviewed" count for expert (or "General Review" if no expert)
     - Increment "Total Changes" count
     - Update "Last Review Date"
     - Add entry to "Review Details" section
     - Update file review statistics

3. **Review Contribution Format**:
   ```markdown
   ---
   
   ## Review/Contribution
   
   **Expert**: [Expert Name or "General Review"]
   **Expertise**: [Expert's Field or "General"]
   **Date**: [Current Date]
   **Changes**: [Detailed description of changes made - what was added, fixed, deleted, improved]
   
   ---
   ```

### Step 8: Commit Changes

1. **Stage All Changes**:
   - Stage modified package files
   - Stage updated documentation files
   - Stage tracker updates

2. **Commit Message**:
   - Format: `Package review: [Expert Name] reviewed [package]`
   - Include summary of changes in commit message
   - Example: `Package review: David Anderson reviewed core - Added missing exports, fixed package.json configuration, improved error handling`

3. **Commit**:
   - Execute `git add -A` (or stage specific files)
   - Execute `git commit -m "[commit message]"`

### Step 9: Output Results

1. **Output Summary**:
   ```
   Package reviewed
   Package: [package]
   Expert: [Expert Name or "General Review"]
   Changes made:
     - [Change 1]
     - [Change 2]
     - ...
   Files modified: [list of files]
   Documentation updated: [yes/no]
   ```

## Implementation Notes

### Package Path Resolution

- **Package Parameter Format**: `<package>` (top-level only, no `/`)
- **Package Directory**: `packages/<package>/`
- **Validation**: Check if directory exists before proceeding
- **Features Directory**: `packages/<package>/src/features/` (IGNORED during package review)

### Expert Selection for `expert="relevant"`

**Package Type Analysis**:
1. Read package name and infer type (e.g., `core` → core infrastructure)
2. Read PRD if available to understand package domain
3. Read package code to understand implementation type
4. Match to expert based on:
   - Database packages → Database Expert
   - API packages → API Expert (REST or GraphQL)
   - Security packages → Security Expert
   - Performance packages → Performance Expert
   - Architecture packages → Architecture Expert
   - Documentation packages → Documentation Expert
   - Testing packages → Testing Expert
   - And so on...

**Expert Matching Examples**:
- `core` → Architecture Expert (Arthur Davis) or General Review
- `task-manager` → Database Expert (David Anderson) or General Review
- `template-project` → Documentation Expert (Dorothy Clark) or Architecture Expert (Arthur Davis)

### Documentation Reading (`docs=true`)

**Documentation Lookup Order**:
1. `docs/features/<package-name>/PRD.md` (primary requirements)
2. `docs/features/<package-name>/TASKS.md` (implementation tasks)
3. `docs/features/<package-name>/ARCHITECTURE.md` (architecture design)
4. `docs/features/<package-name>/API.md` (API documentation)
5. `docs/reference/` files related to package
6. `docs/guides/` files related to package

**Package Name Mapping**:
- Package directory name may differ from docs directory name
- Try exact match first: `docs/features/<package-name>/`
- Try variations: `docs/features/<package-name-dashed>/`, `docs/features/<package-name-underscored>/`
- Search `docs/features/` for matching PRD files

### Feature Detection Logic (Step 4)

**Relevance Matching**:
1. **Name Matching**: Feature name contains package name or vice versa
2. **Description Matching**: Feature description mentions package or related functionality
3. **Requirement Matching**: Feature requirements align with package capabilities
4. **Status Matching**: Feature PRD exists but feature not implemented in package

**Feature Implementation Process** (if feature found):
1. Read feature PRD and TASKS
2. Create feature directory: `packages/<package>/src/features/<feature-name>/`
3. Implement feature following feature review process
4. Make actual changes (add code, fix issues, improve structure)
5. Exit with success (do not continue to package review)

**Feature Planning Process** (if user agrees to new feature):
1. Analyze package gaps and propose feature
2. Create `docs/features/<feature-name>/PRD.md` with requirements
3. Create `docs/features/<feature-name>/TASKS.md` with implementation tasks
4. Plan feature architecture and API
5. Exit with success (do not continue to package review)

### Review Process

**Code Review Checklist** (Package-Level Only):
- [ ] All PRD requirements implemented (if PRD exists)
- [ ] All documented APIs implemented
- [ ] All CLI commands implemented (if applicable)
- [ ] Type definitions complete and correct
- [ ] Error handling implemented
- [ ] Tests written (package-level tests)
- [ ] Documentation complete (JSDoc, README, etc.)
- [ ] Code follows project conventions
- [ ] No linter errors
- [ ] No type errors
- [ ] Performance considerations addressed
- [ ] Security considerations addressed
- [ ] Package.json properly configured
- [ ] Exports and public API correct
- [ ] **Features directory ignored** (not reviewed at package level)

**Documentation Review Checklist**:
- [ ] PRD matches implementation
- [ ] API documentation matches code
- [ ] Architecture documentation matches structure
- [ ] Examples in docs work with current code
- [ ] README is up-to-date

### Error Handling

**Exit Codes**:
- `0`: Success - Package reviewed and improved, or feature implemented/planned
- `1`: Error - Invalid parameters, package not found, or review failed

**Error Messages**:
- "Error: package parameter is required" (if package is empty)
- "Error: package parameter must be top-level (no '/' allowed)" (if contains `/`)
- "Error: Package '<package>' not found at 'packages/<package>/'" (if package doesn't exist)
- "Error: Expert '<expert>' not found, using general review" (if expert specified but not found - continue with general review)
- "Error: Review failed: [error message]" (if review process fails)

## Expected Outputs

### Scenario 1: Feature Found and Implemented
```
Feature implemented: port-manager in package core
Feature: port-manager
Package: core
Expert: General Review
Changes made:
  - Implemented port-manager feature from PRD
  - Added port detection and reservation logic
  - Added port conflict detection
Files modified:
  - packages/core/src/features/port-manager/port-manager.ts
  - packages/core/src/features/port-manager/core/validator.ts
Documentation updated: yes
```

### Scenario 2: Feature Planned (User Agreed)
```
Feature planned: database-migration-tool for package core
Feature: database-migration-tool
Package: core
Expert: General Review
Planning:
  - Created docs/features/database-migration-tool/PRD.md
  - Created docs/features/database-migration-tool/TASKS.md
  - Planned feature architecture and requirements
Documentation created: yes
```

### Scenario 3: Package Review (No Feature Found or User Declined)
```
Package reviewed
Package: core
Expert: David Anderson (Database Expert)
Changes made:
  - Added missing package exports
  - Fixed package.json configuration
  - Improved error handling
Files modified:
  - packages/core/index.ts
  - packages/core/package.json
Documentation updated: yes
```

### Scenario 4: All Experts Review
```
Package reviewed
Package: core
Experts: 3 experts reviewed sequentially
  - David Anderson (Database Expert)
  - Sarah Johnson (Security Expert)
  - Arthur Davis (Architecture Expert)
Changes made:
  - [Combined changes from all experts]
Files modified: [list of all modified files]
Documentation updated: yes
```

## Related Commands

- `/local/feature-review` - Feature-level review command (one level lower)
- `/local/review` - General file review command
- `/local/expert` - Select random expert
- `/local/file` - Select random file

---

## Review/Contribution

**Expert**: General Review  
**Expertise**: Package Implementation Review  
**Date**: 2026-01-05  
**Changes**: Created comprehensive package review command specification covering package parameter validation (mandatory, top-level format validation, existence checking), expert selection (empty/general review, specific expert, all experts, random expert, relevant expert with matching logic), documentation reading (docs parameter with lookup order and package name mapping), feature detection and implementation (checking docs/features for relevant features, implementing found features, planning new features with user agreement), package analysis (code reading excluding features directory, structure checking, comparison with docs, issue identification), review and improvement process (actual changes required, code improvements, package completeness, documentation updates), review findings documentation (package and docs updates, tracker updates), commit process, and expected outputs. This command enables systematic package reviews that actually improve code and documentation, with the ability to implement or plan features when relevant, operating at a higher level than feature review.
