# Expert Review Command

Expert-driven file review and creation workflow. Randomly selects or creates experts and files, then has experts review/expand content.

## ⚠️ CRITICAL REQUIREMENT: SUBSTANTIVE FILE IMPROVEMENT

**EXPERTS MUST ACTUALLY IMPROVE FILES, NOT JUST DESCRIBE WHAT SHOULD BE CHANGED.**

- ❌ **FORBIDDEN**: Adding only a review contribution section that describes what "should be added" or "should be fixed"
- ❌ **FORBIDDEN**: Describing changes without actually making them
- ✅ **REQUIRED**: Actually making changes to improve the file:
  - **Adding**: New sections, expanding existing content, including examples, code snippets, best practices, procedures, tools, methodologies, or detailed explanations
  - **Fixing**: Correcting errors, fixing mistakes, improving accuracy
  - **Deleting**: Removing wrong, outdated, or incorrect content
  - **Improving**: Enhancing clarity, structure, organization, or quality
- ✅ **REQUIRED**: The file must be visibly changed before any review contribution section is added
- ✅ **REQUIRED**: The review contribution section should describe what was ACTUALLY CHANGED in the file (added, fixed, deleted, improved), not what should be changed

**This is a critical requirement. Experts should actively improve files by adding, fixing, deleting, or improving content as needed. Failure to make actual changes defeats the purpose of the review workflow.**

## Usage

Execute this command to run the expert review workflow:
1. Select or create an expert (randomly, by name, or create new)
2. Select or create a file (randomly, by name, or create new)
3. Have the expert review/expand the file

### Parameters

#### `expert` (optional)
- `<name>` - Use specific expert by name (assume expert exists, no validation)
- `"new"` - Create a new expert
- Empty/omitted - Use `/local/expert` to randomly select an expert

#### `file` (optional)
- `<name>` - Use specific file by name (no path needed):
  - If file exists: Review the file
  - If file doesn't exist: Create the file (decide best path based on content)
- `"new"` - Create a new file
- Empty/omitted - Use `/local/file` to randomly select a file

### Examples

```bash
# Random expert, random file
/local/review

# Specific expert, random file
/local/review expert="Sarah Johnson"

# Random expert, specific file
/local/review file="README.md"

# Specific expert, specific file
/local/review expert="Arthur Davis" file="API_STRUCTURE_REVIEW.md"

# Create new expert
/local/review expert="new"

# Create new file with random expert
/local/review file="new"

# Specific expert, create new file
/local/review expert="Sarah Johnson" file="new"

# Create new file (file doesn't exist, will be created)
/local/review file="NEW_DOCUMENTATION.md"
```

## Workflow

### Step 1: Select or Create Expert

1. **Check `expert` parameter**:
   - If `expert="new"`: Create new expert → Go to Step 1a
   - If `expert="<name>"`: Use specified expert name → Go to Step 2
   - If `expert` is empty/omitted: Random decision → Go to Step 1b

2. **Step 1a: Create New Expert** (if `expert="new"`)
   - Think of a very specific, narrow field that doesn't have an expert yet
   - Expert should be number one in their narrow field
   - Create expert persona with:
     - Name
     - Expertise (very specific, narrow field)
     - Description of why this expertise is valuable
   - **Update Expert Reviews Tracker**: After expert file creation, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Read the expert file (`.cursor/rules/experts/<expert_name>_expert.mdc`) to extract:
       - Expert name (from `name:` field in frontmatter)
       - Expertise (from `description:` field in frontmatter, or use a shortened version)
     - Find the statistics table (after "## Expert Review Statistics" section)
     - Insert a new row in the table before the "Total:" row with:
       - Expert Name: [Extracted Name]
       - Expertise: [Extracted Expertise]
       - Files Reviewed: 0
       - Total Changes: 0
       - Last Review Date: [Current Date] (YYYY-MM-DD format)
       - Files Created: 0
       - Avg Changes per Review: 0.0
       - Structure Reviewed: 0
       - Files Rearranged: 0
     - Add a new section in "Review Details" section (before "## Statistics Summary"):
       - Section header: `### [Expert Name] ([Short Expertise Description])`
       - Content: `- **Total Reviews**: 0`
     - **Update Statistics and Sort**: After updating tracker:
       - Update files reviewed statistics table (increment review count for the file)
       - Run `/local/statistics` to recalculate statistics
       - Run `/local/sort` to sort the expert statistics table
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
   - **Commit Changes**: Stage all changes and commit with message:
     - Message format: `Expert review: Created expert [Expert Name] ([Expertise])`
     - Stage all modified files (expert file, tracker)
     - Commit with the generated message
   - **Output**: Expert name and expertise
   - **Stop**: End command here

3. **Step 1b: Random Expert Selection** (if `expert` is empty/omitted)
   - **Random Decision**: Generate random number 1-10
     - If 1 (10% chance): Create new expert → Go to Step 1a
     - If 2-10 (90% chance): Select existing expert → Go to Step 2
   - If random = 2-10: Use `/local/expert` command to randomly select an expert
   - Get expert's name from the command output
   - **Update Tracker**: Immediately update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Find the line containing "**Last Updated**:"
     - Add or update the next line: `**Current reviewer**: [Expert Name]`
     - If "Last reviewer" exists, replace it with "Current reviewer"
   - Continue to Step 3

4. **Step 2: Use Specified Expert** (if `expert="<name>"` or from Step 1b)
   - Use the expert name directly (assume expert exists, no validation)
   - **Update Tracker**: Immediately update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Find the line containing "**Last Updated**:"
     - Add or update the next line: `**Current reviewer**: [Expert Name]`
     - If "Last reviewer" exists, replace it with "Current reviewer"
   - Continue to Step 3

### Step 3: Select or Create File

5. **Check `file` parameter** (using expert from Step 2/4):
   - If `file="new"`: Create new file → Go to Step 3a
   - If `file="<name>"`: Check if file exists → Go to Step 3b
   - If `file` is empty/omitted: Random decision → Go to Step 3c

6. **Step 3a: Create New File** (if `file="new"`)
   - Ask the expert (from Step 2/4) to create a new file
   - **Update Tracker**: When file path is determined, immediately update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Find the line containing "**Last Updated**:"
     - Add or update the line after "Current reviewer" (or after "Last Updated" if no reviewer line): `**Current file**: [File Name]`
     - If "Last file" exists, replace it with "Current file"
   - **File Types Allowed**:
     - ✅ Any file in `docs/` directory (documentation)
     - ✅ Command file (in `.cursor/commands/general/` - for use outside this scope)
     - ✅ Rule file (in `.cursor/rules/experts/` - note: `.cursor/rules/user/` is for user's own rules, other directories may be created by outside packages)
     - ❌ **CANNOT** be an expert persona file (`.cursor/rules/experts/` contains expert personas, not general rules)
   - File should not already exist in the workspace
   - **Path Decision**: Based on content, decide appropriate path and create new directories as needed in allowed top-level directories:
     - `docs/` - Can create new subdirectories (e.g., `docs/guides/new-topic/`, `docs/reference/new-section/`)
     - `.cursor/commands/general/` - Commands go here (for use outside this scope in future or existing projects)
     - `.cursor/rules/experts/` - Rules go here (note: `.cursor/rules/user/` is for user's own rules, other directories may be created by outside packages like taskmaster)
   - Expert should expand the content as much as possible
   - Expert should sign the document at the end with:
     - Name
     - Expertise
     - Date
   - **Update Expert Reviews Tracker**: After file creation, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Increment "Files Created" count for the expert
     - Add entry to "Review Details" section with file path and date
     - Update statistics summary
   - **Update Statistics and Sort**: After updating tracker:
     - Run `/local/statistics` command to calculate and update statistics rows
     - Run `/local/sort sort-by="Files Created"` command to sort table by Files Created
   - **Update Tracker Status**: Before ending, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Replace "Current reviewer" with "Last reviewer"
     - Replace "Current file" with "Last file"
   - **Commit Changes**: Stage all changes and commit with message:
     - Message format: `Expert review: [Expert Name] created [File Path]`
     - Stage all modified files (new file, tracker)
     - Commit with the generated message
   - **Output**: Expert name and created file (full path)
   - **Stop**: End command here

7. **Step 3b: Handle Specified File** (if `file="<name>"`)
   - Search for file by name in workspace (no path needed, search recursively)
   - If file exists:
     - Use the found file path
     - **Update Tracker**: Immediately update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Find the line containing "**Last Updated**:"
       - Add or update the line after "Current reviewer" (or after "Last Updated" if no reviewer line): `**Current file**: [File Name]`
       - If "Last file" exists, replace it with "Current file"
     - Continue to Step 5
   - If file doesn't exist:
     - Create the file (decide best path based on content type)
     - **Path Decision**: Based on content, decide appropriate path:
       - Documentation → `docs/` subdirectory (can create new subdirectories)
       - Commands → `.cursor/commands/general/`
       - Rules → `.cursor/rules/experts/`
     - Expert should create comprehensive content
     - Expert should sign the document at the end
     - **Update Expert Reviews Tracker**: After file creation, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Increment "Files Created" count for the expert
       - Add entry to "Review Details" section with file path and date
       - Update statistics summary
     - **Update Statistics and Sort**: After updating tracker:
       - Update files reviewed statistics table (increment review count for the file)
       - Run `/local/statistics` to recalculate statistics
       - Run `/local/sort` to sort the expert statistics table
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort sort-by="Files Created"` command to sort table by Files Created
     - **Update Tracker Status**: Before ending, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Replace "Current reviewer" with "Last reviewer"
       - Replace "Current file" with "Last file"
     - **Commit Changes**: Stage all changes and commit with message:
       - Message format: `Expert review: [Expert Name] created [File Path]`
       - Stage all modified files (new file, tracker)
       - Commit with the generated message
     - **Output**: Expert name and created file (full path)
     - **Stop**: End command here

8. **Step 3c: Random File Selection** (if `file` is empty/omitted)
   - **Random Decision**: Generate random number 1-5
     - If 1 (20% chance): Create new file → Go to Step 3a
     - If 2-5 (80% chance): Select existing file → Go to Step 4
   - If random = 2-5: Use `/local/file` command to randomly select a file
   - Get file path from the command output
   - Continue to Step 5

9. **Step 4: Use Randomly Selected File** (from Step 3c)
   - Use the file path from `/local/file` command
   - **Update Tracker**: Immediately update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
     - Find the line containing "**Last Updated**:"
     - Add or update the line after "Current reviewer" (or after "Last Updated" if no reviewer line): `**Current file**: [File Name]`
     - If "Last file" exists, replace it with "Current file"
   - Continue to Step 5 (Expert Review)

### Step 5: Expert Review

10. **Expert Review** (using expert from Step 2/4 and file from Step 3b/4/9)
   - **Standard Review** (always performed):
     - Ask the expert to review the selected file
     - **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY IMPROVE the file, not just describe what should be changed
     - **⚠️ THE FILE MUST BE VISIBLY CHANGED**: The file must be improved before any review contribution section is added
     - **⚠️ FORBIDDEN**: Do NOT add only a review contribution section that describes what "should be added" or "should be fixed" - this is not acceptable
     - **⚠️ FORBIDDEN**: Do NOT describe changes without actually making them to the file
     - Expert MUST improve the file according to their professional opinion by:
       - **Adding**: New sections with actual content, expanding existing sections, including examples, code snippets, best practices, procedures, tools, methodologies, or detailed explanations (actual content, not descriptions)
       - **Fixing**: Correcting errors, fixing mistakes, improving accuracy, correcting typos, fixing broken links, correcting factual errors
       - **Deleting**: Removing wrong, outdated, incorrect, or redundant content
       - **Improving**: Enhancing clarity, improving structure, better organization, improving formatting, refining language
     - **⚠️ VERIFICATION**: Before adding the review contribution section, verify that the file has been visibly changed (added, fixed, deleted, or improved)
     - The review contribution section should describe what was ACTUALLY CHANGED in the file (added, fixed, deleted, improved), not what should be changed
     - If expert has no professional connection to the content:
       - Expert should directly admit they have nothing to contribute
       - Still add a brief note at the end
     - Expert should add a brief description of changes at the end of the document with:
       - Description of changes made (what was actually added, fixed, deleted, or improved in the file)
       - Expert's name
       - Expertise
       - Date
     - **Update Expert Reviews Tracker**: After review, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Increment "Files Reviewed" count for the expert
       - Increment "Total Changes" count
       - Update "Last Review Date"
       - Add entry to "Review Details" section with file path and date
       - If expert reviewed documentation structure (Documentation Expert, Architecture Expert, etc.): Increment "Structure Reviewed" count
       - If expert rearranged files: Increment "Files Rearranged" count
       - Update statistics summary
     - **Update Statistics and Sort**: After updating tracker:
       - Update files reviewed statistics table (increment review count for the file)
       - Run `/local/statistics` to recalculate statistics
       - Run `/local/sort` to sort the expert statistics table
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
     - **Update Tracker Status**: Before ending, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Replace "Current reviewer" with "Last reviewer"
       - Replace "Current file" with "Last file"
   - **File Rearrangement** (if expert's expertise is appropriate):
     - If the expert's expertise is appropriate (e.g., Documentation Expert, Architecture Expert, or any expert whose expertise relates to file organization/structure):
       - Expert MUST also review and evaluate documentation structure in addition to the regular review
       - **Documentation Structure Review**:
         - Review existing documentation structure rules (e.g., `docs/guides/DOCUMENTATION_STRUCTURE.md`)
         - Evaluate if current rules are adequate, clear, and complete
         - Determine if new rules or clarifications are needed based on current documentation state
         - If new rules are needed, propose and document them (update structure documentation or create new guidance)
         - Expert should not just follow existing rules blindly, but actively evaluate and improve them
       - **File Reorganization**:
         - Search for the first file that needs to be rearranged according to documentation structure rules (existing or newly determined)
       - Once found, expert should rearrange that file (move it to the correct location)
       - Expert should stop after rearranging the first file (do not continue searching for more files)
       - Expert should document the rearrangement in one designated file (e.g., `docs/guides/FILE_REORGANIZATION.md` or similar)
       - Documentation should include:
         - List of files moved/reorganized
         - Reason for reorganization
         - New structure/organization
           - Any new rules or clarifications determined
         - Expert's name, expertise, and date
         - **Update Expert Reviews Tracker**: After structure review and/or file reorganization:
           - If expert reviewed documentation structure: Increment "Structure Reviewed" count for the expert
           - If expert rearranged files: Increment "Files Rearranged" count for the expert
   - **Commit Changes**: Stage all changes and commit with message:
     - Message format: `Expert review: [Expert Name] reviewed [File Path]`
     - Stage all modified files (reviewed file, tracker, reorganization documentation if applicable, any other files modified)
     - Commit with the generated message
   - **Output**: Expert name and file name (full path)

## Implementation Notes

### Random Number Generation
- Use `$((RANDOM % 10 + 1))` for 1-10 range (expert selection)
- Use `$((RANDOM % 5 + 1))` for 1-5 range (file selection)
- **Note**: `$RANDOM` is a bash built-in variable that generates random integers between 0 and 32767
- The modulo operation (`%`) ensures the result falls within the desired range
- Adding 1 shifts the range from 0-9 to 1-10, or from 0-4 to 1-5

### Command Execution
- Execute `/local/expert` command to get expert name (if `expert` parameter is empty)
- Execute `/local/file` command to get file path (if `file` parameter is empty)
- Use `expert` parameter value directly if provided (assume expert exists)
- Search for file by name if `file` parameter is provided (use `find` or similar to locate file)
- **Validation Considerations**:
  - Expert name validation: While the command assumes expert exists when provided, in practice, verify expert file exists at `.cursor/rules/experts/<expert_name>_expert.mdc` before proceeding
  - File existence validation: Always verify file exists before attempting to read or modify
  - Error handling: Implement graceful failure when expert or file cannot be found or accessed
- **Tracker Status Updates** (Dynamic Location):
  - When expert is selected: Find the line containing "**Last Updated**:" and add/update the next line with `**Current reviewer**: [Expert Name]`
  - When file is selected: Find the line containing "**Last Updated**:" and add/update the line after "Current reviewer" (or after "Last Updated" if no reviewer line) with `**Current file**: [File Name]`
  - When review/creation is complete: Replace "Current" with "Last" in both lines (find dynamically by searching for "Current reviewer" and "Current file")
- After updating Expert Reviews Tracker:
  - Execute `/local/statistics` command to calculate and update statistics rows
  - Execute `/local/sort` command:
    - If file was created: Use `sort-by="Files Created"`
    - If file was reviewed: Use default (sort-by="Files Reviewed")
- **Commit Changes**: At the end of each workflow path, before output and stop:
  - Stage all changes using `git add -A` (or stage specific files)
  - Generate commit message based on action:
    - Expert created: `Expert review: Created expert [Expert Name] ([Expertise])`
    - File created: `Expert review: [Expert Name] created [File Path]`
    - File reviewed: `Expert review: [Expert Name] reviewed [File Path]`
  - Commit using `git commit -m "[commit message]"`
  - Commit should include all changes made during the workflow (expert file, reviewed/created file, tracker, any other modified files)

### Expert File Creation
- Check existing experts in `.cursor/rules/experts/*.mdc`
- Identify gaps in expertise coverage
- Create very specific, narrow field expert
- Save as `.cursor/rules/experts/<expert_name>_expert.mdc`
- **Expert Naming Convention**:
  - Convert expert name to lowercase
  - Replace spaces with underscores
  - Append `_expert.mdc` suffix
  - Example: "Dr. Robert Chen" → `dr_robert_chen_expert.mdc` or use last name: `chen_expert.mdc`
- **Expertise Validation**:
  - Ensure expertise is specific and narrow (not too broad)
  - Verify no duplicate expertise exists
  - Check that expertise field clearly describes the expert's domain
- **After creating expert file**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
  - Read expert file to extract name (from `name:` field) and expertise (from `description:` field)
  - Extract expertise from description: Use the description text, or create a shortened version if description is too long
  - Insert new row in statistics table (before "Total:" row) with all zeros and current date
  - Add new section in "Review Details" section with expert name and "Total Reviews: 0"
  - Run `/local/statistics` to update totals
  - Run `/local/sort` to sort table by "Files Reviewed"

### File Creation
- **File Type Restrictions**:
  - ✅ Can create: Documentation files in `docs/`, command files in `.cursor/commands/general/`, rule files in `.cursor/rules/experts/`
  - ❌ Cannot create: Expert persona files (expert personas are created separately in Step 1a, not through file creation)
- Check existing files to ensure new file doesn't exist (when `file="new"`)
- **File Naming and Path Validation**:
  - Use descriptive, kebab-case filenames (e.g., `expert-review-workflow.md`)
  - Ensure file path follows project structure conventions
  - Verify parent directories exist before creating files (create if needed)
  - Check for file name conflicts (case-insensitive on some systems)
- **File Search** (when `file="<name>"`):
  - Search workspace recursively for file by name (no path needed)
  - Use `find . -name "<name>" -type f` or similar
  - If multiple matches found, use the first match or most appropriate one
  - If file not found, create it (see Path Decision below)
- **Path Decision**: Based on content type, determine appropriate location:
  - Documentation → `docs/` subdirectory (can create new subdirectories like `docs/guides/new-topic/`, `docs/reference/new-section/`)
  - Commands → `.cursor/commands/general/` (for use outside this scope in future or existing projects)
  - Rules → `.cursor/rules/experts/` (note: `.cursor/rules/user/` is for user's own rules, other directories may be created by outside packages like taskmaster)
- Create new directories as needed in allowed top-level directories
- Create comprehensive content from expert's perspective
- Add signature block at end

### File Review
- **Standard Review** (always performed):
  - Read existing file content
  - **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY IMPROVE the file, not just describe what should be changed
  - **⚠️ THE FILE MUST BE VISIBLY CHANGED**: The file must be improved before any review contribution section is added
  - **⚠️ FORBIDDEN**: Do NOT add only a review contribution section that describes what "should be added" or "should be fixed" - this is not acceptable
  - **⚠️ FORBIDDEN**: Do NOT describe changes without actually making them to the file
  - Have expert review and improve according to expertise by:
    - **Adding**: New sections with actual content, expanding existing sections, including examples, code snippets, best practices, procedures (actual content, not descriptions)
    - **Fixing**: Correcting errors, fixing mistakes, improving accuracy, correcting typos, fixing broken links, correcting factual errors
    - **Deleting**: Removing wrong, outdated, incorrect, or redundant content
    - **Improving**: Enhancing clarity, improving structure, better organization, improving formatting, refining language
  - **⚠️ VERIFICATION**: Before adding the review contribution section, verify that the file has been visibly changed (added, fixed, deleted, or improved)
  - The review contribution section describes what was ACTUALLY CHANGED (added, fixed, deleted, improved), not what should be changed
  - Append changes description with signature block
  - Format: Markdown section at end of file
  - **Update Expert Reviews Tracker**: After review, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
    - Increment "Files Reviewed" count for the expert
    - Increment "Total Changes" count
    - Update "Last Review Date"
    - Add entry to "Review Details" section with file path, date, and summary of changes
    - If expert reviewed documentation structure (Documentation Expert, Architecture Expert, etc.): Increment "Structure Reviewed" count
    - If expert rearranged files: Increment "Files Rearranged" count
    - Recalculate "Avg Changes per Review" (Total Changes / Files Reviewed)
    - Update statistics summary (total reviews, total files, etc.)
  - **Update Statistics and Sort**: After updating tracker:
    - Run `/local/statistics` command to calculate and update statistics rows
    - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
- **File Rearrangement** (if expert's expertise is appropriate):
  - If expert's expertise is appropriate (e.g., Documentation Expert, Architecture Expert, or any expert whose expertise relates to file organization/structure):
    - Expert MUST also review and evaluate documentation structure in addition to the regular review
    - **Documentation Structure Review**: Review existing documentation structure rules, evaluate if current rules are adequate/clear/complete, determine if new rules or clarifications are needed, and if so, propose and document them. Expert should not just follow existing rules blindly, but actively evaluate and improve them.
    - **File Reorganization**: Search for the first file that needs to be rearranged according to documentation structure rules (existing or newly determined), rearrange that file, stop after rearranging the first file, and document the rearrangement in `docs/guides/FILE_REORGANIZATION.md` including: list of files moved/reorganized, reason for reorganization, new structure/organization, any new rules or clarifications determined, expert's name/expertise/date

## Validation and Verification Framework

### Expert Review Validation
- **Pre-Review Checks**:
  - Verify expert has appropriate expertise for the file type
  - Confirm file is readable and writable
  - Check file encoding and format compatibility
- **During Review**:
  - Ensure all changes are traceable and documented
  - Validate that improvements align with expert's declared expertise
  - Verify no unintended content deletion or corruption
- **Post-Review Verification**:
  - Confirm file has been visibly modified (diff check)
  - Validate signature block accurately describes changes
  - Verify tracker updates match actual changes made

### Quality Assurance
- **Accuracy Verification**: All facts, examples, and code snippets should be verified for correctness
- **Completeness Check**: Ensure expert contributions are complete and not truncated
- **Consistency Validation**: Check that new content matches existing style and conventions
- **Educational Value Assessment**: Evaluate whether changes improve understanding and usability

## ⚠️ REMINDER: SUBSTANTIVE IMPROVEMENTS FIRST

**Before adding the signature block, ensure that the file has been ACTUALLY IMPROVED (content added, fixed, deleted, or improved). The signature block should describe what was changed, not what should be changed.**

**Academic Rigor**: All changes should be:
- Factually accurate and verifiable
- Logically sound and well-reasoned
- Clearly documented and traceable
- Educationally valuable and appropriate

## Signature Block Format

At the end of documents, add:

```markdown
---

## Review/Contribution

**Expert**: [Expert Name]  
**Expertise**: [Expert's Field]  
**Date**: [Current Date]  
**Changes**: [Brief description of changes/contributions made]

---
```

## Expected Outputs

### Scenario 1: New Expert Created
```
Expert created
Expert: [Name]
Expertise: [Very Specific Field]
```

### Scenario 2: New File Created
```
File created
Expert: [Name]
File: [full/path/to/file.md]
```

### Scenario 3: File Reviewed (Standard)
```
File reviewed
Expert: [Name]
File: [full/path/to/file.md]
```

### Scenario 4: Files Rearranged (Exception)
```
File reviewed
Expert: [Name]
File: [full/path/to/reorganization-documentation.md]
```

### Mobile Optimization Considerations

When executing this command on mobile devices:

1. **Command Execution Performance**
   - File operations (read/write) should be optimized for mobile storage speeds
   - Expert selection and file selection processes should minimize I/O operations
   - Git operations (status, diff, commit) may be slower on mobile - consider async/background processing

2. **Mobile Terminal Workflow**
   - Output format is mobile-terminal friendly (concise, readable)
   - Progress indicators should work well on small mobile screens
   - Error messages should be clear and actionable in mobile terminals

3. **Battery Efficiency**
   - Long-running reviews should minimize battery drain
   - Consider chunking large file operations
   - Optimize git operations for mobile device constraints

4. **Mobile File System Considerations**
   - Handle slower file system operations gracefully
   - Consider caching file lists and expert mappings
   - Account for mobile storage limitations

---

## Review/Contribution

**Expert**: Dr. Robert Chen  
**Expertise**: Subject Matter (Physics, Math, CS, Academic Fields)  
**Date**: 2026-01-05  
**Changes**: Enhanced this expert review command specification with academic rigor and validation considerations. Added detailed explanation of random number generation algorithm (modulo operation, range shifting). Added validation considerations section covering expert name validation, file existence validation, and error handling practices. Enhanced expert file creation section with expert naming convention guidelines and expertise validation requirements (specificity, uniqueness, clarity). Added file naming and path validation guidelines including kebab-case conventions, path structure compliance, and conflict checking. Added comprehensive "Validation and Verification Framework" section covering pre-review checks (expert expertise verification, file accessibility), during-review validation (traceability, alignment verification), and post-review verification (diff checking, signature block validation, tracker consistency). Added "Quality Assurance" section with accuracy verification, completeness checks, consistency validation, and educational value assessment. Added academic rigor reminder emphasizing factual accuracy, logical soundness, clear documentation, and educational value for all changes. These additions strengthen the command's reliability, traceability, and adherence to academic standards for accuracy and validation.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile optimization considerations section covering command execution performance (optimized file operations, minimized I/O, git operation considerations), mobile terminal workflow (mobile-friendly output format, progress indicators, clear error messages), battery efficiency (minimize battery drain, chunk large operations, optimize git operations), and mobile file system considerations (handle slower operations, caching opportunities, storage limitations). This addition ensures the review command is optimized for execution on mobile devices, considering mobile constraints like battery life, storage speed, and processing power.

**Expert**: Steven Taylor  
**Expertise**: SEO (Search Engine Optimization)  
**Date**: 2026-01-05  
**Changes**: Added SEO considerations for review workflow section covering review content SEO (SEO best practices in review outputs, descriptive keyword-rich language, proper SEO structure in reviewed content, search engine discoverability), file creation SEO (SEO-friendly file names and paths, proper heading hierarchy and semantic markup, natural keyword usage, internal linking opportunities), content quality for search (content quality and depth verification, user search query answers, topic clusters and content authority, keyword optimization), and documentation SEO (proper SEO structure in documentation, heading hierarchy and meta descriptions, internal linking opportunities, comprehensive valuable documentation). This addition ensures that the review workflow considers SEO best practices when reviewing and creating files for web publication, maximizing search engine visibility and discoverability.

---
