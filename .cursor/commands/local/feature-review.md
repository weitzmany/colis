# Feature Review Command

Review a specific feature implementation against documentation and best practices. Makes actual changes, doesn't just suggest them.

## ⚠️ CRITICAL REQUIREMENT: SUBSTANTIVE IMPROVEMENTS

**REVIEWS MUST ACTUALLY IMPROVE THE FEATURE, NOT JUST DESCRIBE WHAT SHOULD BE CHANGED.**

### Core Principle: DO, DON'T SUGGEST

**When reviewing a feature, this means CHANGE THE CODE where improvements are needed. Add missing functionality, fix bugs, improve structure. DO NOT suggest what to do - DO IT.**

- ❌ **FORBIDDEN**: Adding only a review section that describes what "should be added" or "should be fixed"
- ❌ **FORBIDDEN**: Describing changes without actually making them
- ❌ **FORBIDDEN**: Suggesting improvements without implementations
- ✅ **REQUIRED**: Actually making changes to improve the feature:
  - **Adding**: Missing methods, functionality, tests, documentation
  - **Fixing**: Bugs, errors, incorrect implementations, type issues
  - **Deleting**: Dead code, unused imports, deprecated code
  - **Improving**: Code quality, structure, performance, maintainability
- ✅ **REQUIRED**: Update documentation to reflect changes
- ✅ **REQUIRED**: Document review findings in both package and `/docs`

## Usage

Execute this command to review a specific feature:

```bash
/local/feature-review feature="<package>/<feature>"
```

### Parameters

#### `feature` (mandatory)
- Format: `<package>/<feature>` (e.g., `core/port-manager`, `core/commissioning`)
- **Validation**:
  - If empty: Exit with error code 1 and message "Error: feature parameter is required"
  - If wrong format (doesn't match `<package>/<feature>` pattern): Exit with error code 1 and message "Error: feature parameter must be in format '<package>/<feature>'"
  - If feature not found: Exit with error code 1 and message "Error: Feature '<package>/<feature>' not found"
- **Feature Location**: Features are located in `packages/<package>/src/features/<feature>/`
- **Examples**:
  - `core/port-manager` → `packages/core/src/features/port-manager/`
  - `core/commissioning` → `packages/core/src/features/commissioning/`
  - `deck/task-management` → `packages/deck/src/features/task-management/`

#### `expert` (optional)
- If empty or expert not found: Review from your point of view (general review)
- If specified: Ask that expert to review the feature
- `expert="all"`: Review with all experts one by one (sequential reviews)
- `expert="rand"`: Select randomly one expert from available experts
- `expert="relevant"`: Select the most relevant expert for this feature based on feature type and documentation
- **Expert Selection Logic**:
  - For `expert="relevant"`: Analyze feature type, read PRD if available, match to expert expertise
  - For `expert="rand"`: Use `/local/expert` command or random selection from `.cursor/rules/experts/`
  - For `expert="all"`: Get all experts from `.cursor/rules/experts/` and review sequentially

#### `docs` (optional, default=true)
- If `true`: Read relevant documentation in `docs/` directory before review
- **Documentation Lookup**:
  - Check `docs/features/<feature-name>/PRD.md` (if exists)
  - Check `docs/features/<feature-name>/TASKS.md` (if exists)
  - Check `docs/features/<feature-name>/ARCHITECTURE.md` (if exists)
  - Check `docs/features/<feature-name>/API.md` (if exists)
  - Check `docs/reference/` for related documentation
  - Check `docs/guides/` for related guides
- **Documentation Usage**: Use documentation to understand requirements, architecture, and expected behavior before reviewing code

### Examples

```bash
# Review core/port-manager with general review
/local/feature-review feature="core/port-manager"

# Review with specific expert
/local/feature-review feature="core/port-manager" expert="David Anderson"

# Review with all experts sequentially
/local/feature-review feature="core/port-manager" expert="all"

# Review with random expert
/local/feature-review feature="core/port-manager" expert="rand"

# Review with most relevant expert
/local/feature-review feature="core/port-manager" expert="relevant"

# Review with docs reading enabled
/local/feature-review feature="core/port-manager" docs=true

# Review with expert and docs
/local/feature-review feature="core/port-manager" expert="Sarah Johnson" docs=true
```

## Workflow

### Step 1: Validate Feature Parameter

1. **Check if `feature` parameter is provided**:
   - If empty: Exit with error code 1 and message "Error: feature parameter is required"
   - Continue if provided

2. **Validate format**:
   - Check if format matches `<package>/<feature>` pattern (contains exactly one `/`)
   - If wrong format: Exit with error code 1 and message "Error: feature parameter must be in format '<package>/<feature>'"
   - Extract `package` and `feature` from parameter

3. **Check if feature exists**:
   - Construct feature path: `packages/<package>/src/features/<feature>/`
   - Check if directory exists
   - If not found: Exit with error code 1 and message "Error: Feature '<package>/<feature>' not found at 'packages/<package>/src/features/<feature>/'"
   - Continue if found

### Step 2: Read Documentation (if `docs=true`)

1. **Find Feature Documentation**:
   - Check `docs/features/<feature-name>/PRD.md`
   - Check `docs/features/<feature-name>/TASKS.md`
   - Check `docs/features/<feature-name>/ARCHITECTURE.md`
   - Check `docs/features/<feature-name>/API.md`
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
   - For each expert: Perform Step 4-6
   - Continue to Step 7 after all experts reviewed

3. **If `expert="rand"`**:
   - Use `/local/expert` command or randomly select from `.cursor/rules/experts/`
   - Get expert name and expertise
   - Continue to Step 4

4. **If `expert="relevant"`**:
   - Analyze feature type and purpose
   - Read PRD if available to understand feature domain
   - Match feature to most relevant expert based on expertise
   - **Expert Matching Logic**:
     - Database features → Database Expert (David Anderson)
     - API features → RESTful API Expert (Andrew Lee) or GraphQL Expert (Rachel Kim)
     - Security features → Security Expert (Sarah Johnson)
     - Performance features → Performance Expert (James Martinez)
     - Architecture features → Architecture Expert (Arthur Davis)
     - Documentation features → Documentation Expert (Dorothy Clark)
     - Testing features → Testing Expert (Thomas Mitchell)
     - And so on...
   - Continue to Step 4

5. **If `expert="<name>"`**:
   - Use specified expert name
   - Check if expert exists in `.cursor/rules/experts/<expert_name>_expert.mdc`
   - If not found: Fall back to general review (your point of view)
   - Continue to Step 4

### Step 4: Analyze Feature Implementation

1. **Read Feature Code**:
   - Read all TypeScript/JavaScript files in feature directory
   - Read index files, main files, core files, CLI files, etc.
   - Understand feature structure and implementation

2. **Check Feature Structure**:
   - Verify feature follows expected structure (based on PRD if available)
   - Check for missing components (CLI commands, core logic, tests, etc.)
   - Verify exports and public API

3. **Compare with Documentation** (if `docs=true`):
   - Compare implementation with PRD requirements
   - Check if all required features are implemented
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

### Step 5: Review and Improve Feature

1. **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY IMPROVE the feature, not just describe what should be changed

2. **Make Actual Changes**:
   - **Adding**: Add missing methods, functionality, tests, error handling, type definitions
   - **Fixing**: Fix bugs, correct implementations, fix type errors, fix logic errors
   - **Deleting**: Remove dead code, unused imports, deprecated code, duplicate code
   - **Improving**: Improve code quality, structure, performance, maintainability, documentation

3. **Code Improvements**:
   - Fix linter errors
   - Add missing type definitions
   - Improve error handling
   - Add missing tests
   - Improve code structure
   - Add missing documentation (JSDoc, comments)
   - Optimize performance
   - Fix security issues

4. **Feature Completeness**:
   - Ensure all PRD requirements are implemented (if PRD exists)
   - Ensure all documented APIs are implemented
   - Ensure all CLI commands are implemented (if applicable)
   - Ensure all tests are written (if applicable)

5. **Documentation Updates**:
   - Update feature documentation if implementation changed
   - Update API documentation if API changed
   - Update README if needed
   - Add missing documentation

### Step 6: Document Review Findings

1. **Update Feature Documentation** (in package):
   - Create or update `packages/<package>/src/features/<feature>/REVIEW.md` (or similar)
   - Document review findings, changes made, improvements
   - Include expert name, expertise, date, changes made

2. **Update Documentation** (in `/docs`):
   - Update `docs/features/<feature-name>/PRD.md` if needed (add review section)
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

### Step 7: Commit Changes

1. **Stage All Changes**:
   - Stage modified feature files
   - Stage updated documentation files
   - Stage tracker updates

2. **Commit Message**:
   - Format: `Feature review: [Expert Name] reviewed [package]/[feature]`
   - Include summary of changes in commit message
   - Example: `Feature review: David Anderson reviewed core/port-manager - Added missing reservePort method, fixed configure method signature, improved error handling`

3. **Commit**:
   - Execute `git add -A` (or stage specific files)
   - Execute `git commit -m "[commit message]"`

### Step 8: Output Results

1. **Output Summary**:
   ```
   Feature reviewed
   Feature: [package]/[feature]
   Expert: [Expert Name or "General Review"]
   Changes made:
     - [Change 1]
     - [Change 2]
     - ...
   Files modified: [list of files]
   Documentation updated: [yes/no]
   ```

## Implementation Notes

### Feature Path Resolution

- **Feature Parameter Format**: `<package>/<feature>`
- **Feature Directory**: `packages/<package>/src/features/<feature>/`
- **Validation**: Check if directory exists before proceeding

### Expert Selection for `expert="relevant"`

**Feature Type Analysis**:
1. Read feature name and infer type (e.g., `port-manager` → infrastructure/backend)
2. Read PRD if available to understand feature domain
3. Read feature code to understand implementation type
4. Match to expert based on:
   - Database features → Database Expert
   - API features → API Expert (REST or GraphQL)
   - Security features → Security Expert
   - Performance features → Performance Expert
   - Architecture features → Architecture Expert
   - Documentation features → Documentation Expert
   - Testing features → Testing Expert
   - And so on...

**Expert Matching Examples**:
- `core/port-manager` → Database Expert (David Anderson) or Architecture Expert (Arthur Davis)
- `core/commissioning` → Documentation Expert (Dorothy Clark) or Architecture Expert (Arthur Davis)
- `core/auth` → Security Expert (Sarah Johnson)
- `core/database-tools` → Database Expert (David Anderson)

### Documentation Reading (`docs=true`)

**Documentation Lookup Order**:
1. `docs/features/<feature-name>/PRD.md` (primary requirements)
2. `docs/features/<feature-name>/TASKS.md` (implementation tasks)
3. `docs/features/<feature-name>/ARCHITECTURE.md` (architecture design)
4. `docs/features/<feature-name>/API.md` (API documentation)
5. `docs/reference/` files related to feature
6. `docs/guides/` files related to feature

**Feature Name Mapping**:
- Feature directory name may differ from docs directory name
- Try exact match first: `docs/features/<feature-name>/`
- Try variations: `docs/features/<feature-name-dashed>/`, `docs/features/<feature-name-underscored>/`
- Search `docs/features/` for matching PRD files

### Review Process

**Code Review Checklist**:
- [ ] All PRD requirements implemented (if PRD exists)
- [ ] All documented APIs implemented
- [ ] All CLI commands implemented (if applicable)
- [ ] Type definitions complete and correct
- [ ] Error handling implemented
- [ ] Tests written (if applicable)
- [ ] Documentation complete (JSDoc, README, etc.)
- [ ] Code follows project conventions
- [ ] No linter errors
- [ ] No type errors
- [ ] Performance considerations addressed
- [ ] Security considerations addressed

**Documentation Review Checklist**:
- [ ] PRD matches implementation
- [ ] API documentation matches code
- [ ] Architecture documentation matches structure
- [ ] Examples in docs work with current code
- [ ] README is up-to-date

### Error Handling

**Exit Codes**:
- `0`: Success - Feature reviewed and improved
- `1`: Error - Invalid parameters, feature not found, or review failed

**Error Messages**:
- "Error: feature parameter is required" (if feature is empty)
- "Error: feature parameter must be in format '<package>/<feature>'" (if wrong format)
- "Error: Feature '<package>/<feature>' not found at 'packages/<package>/src/features/<feature>/'" (if feature doesn't exist)
- "Error: Expert '<expert>' not found, using general review" (if expert specified but not found - continue with general review)
- "Error: Review failed: [error message]" (if review process fails)

## Expected Outputs

### Scenario 1: General Review
```
Feature reviewed
Feature: core/port-manager
Expert: General Review
Changes made:
  - Added missing detectConflicts method
  - Added missing reservePort method
  - Fixed configure method signature
  - Improved error handling
Files modified:
  - packages/core/src/features/port-manager/port-manager.ts
  - packages/core/src/features/port-manager/core/validator.ts
Documentation updated: yes
```

### Scenario 2: Expert Review
```
Feature reviewed
Feature: core/port-manager
Expert: David Anderson (Database Expert)
Changes made:
  - Added missing reservePort method with database transaction support
  - Improved port repository error handling
  - Added database connection retry logic
Files modified:
  - packages/core/src/features/port-manager/port-manager.ts
  - packages/core/src/features/port-manager/database/port-repository.ts
Documentation updated: yes
```

### Scenario 3: All Experts Review
```
Feature reviewed
Feature: core/port-manager
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

- `/local/review` - General file review command
- `/local/expert` - Select random expert
- `/local/file` - Select random file

---

## Review/Contribution

**Expert**: General Review  
**Expertise**: Feature Implementation Review  
**Date**: 2026-01-05  
**Changes**: Created comprehensive feature review command specification covering feature parameter validation (mandatory, format validation, existence checking), expert selection (empty/general review, specific expert, all experts, random expert, relevant expert with matching logic), documentation reading (docs parameter with lookup order and feature name mapping), feature analysis (code reading, structure checking, comparison with docs, issue identification), review and improvement process (actual changes required, code improvements, feature completeness, documentation updates), review findings documentation (package and docs updates, tracker updates), commit process, and expected outputs. This command enables systematic feature reviews that actually improve code and documentation, not just suggest improvements.
