# Expert Review Command

Expert-driven file review and creation workflow. Randomly selects or creates experts and files, then has experts review/expand content.

## ⚠️ CRITICAL REQUIREMENT: SUBSTANTIVE CONTENT ADDITION

**EXPERTS MUST ACTUALLY ADD SUBSTANTIVE CONTENT TO FILES, NOT JUST DESCRIBE WHAT SHOULD BE ADDED.**

- ❌ **FORBIDDEN**: Adding only a review contribution section that describes what "should be added"
- ❌ **FORBIDDEN**: Describing changes without actually making them
- ✅ **REQUIRED**: Actually adding new sections, expanding existing content, including examples, code snippets, best practices, procedures, tools, methodologies, or detailed explanations
- ✅ **REQUIRED**: The file must be visibly changed with new substantive content before the review contribution section is added
- ✅ **REQUIRED**: The review contribution section should describe what was ACTUALLY ADDED to the file, not what should be added

**This is a critical requirement. Failure to add substantive content will result in the file not being changed, which defeats the purpose of the review workflow.**

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
   - **Output**: Expert name and expertise
   - **Stop**: End command here

3. **Step 1b: Random Expert Selection** (if `expert` is empty/omitted)
   - **Random Decision**: Generate random number 1-10
     - If 1 (10% chance): Create new expert → Go to Step 1a
     - If 2-10 (90% chance): Select existing expert → Go to Step 2
   - If random = 2-10: Use `/local/expert` command to randomly select an expert
   - Get expert's name from the command output
   - Continue to Step 3

4. **Step 2: Use Specified Expert** (if `expert="<name>"` or from Step 1b)
   - Use the expert name directly (assume expert exists, no validation)
   - Continue to Step 3

### Step 3: Select or Create File

5. **Check `file` parameter** (using expert from Step 2/4):
   - If `file="new"`: Create new file → Go to Step 3a
   - If `file="<name>"`: Check if file exists → Go to Step 3b
   - If `file` is empty/omitted: Random decision → Go to Step 3c

6. **Step 3a: Create New File** (if `file="new"`)
   - Ask the expert (from Step 2/4) to create a new file
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
   - **Output**: Expert name and created file (full path)
   - **Stop**: End command here

7. **Step 3b: Handle Specified File** (if `file="<name>"`)
   - Search for file by name in workspace (no path needed, search recursively)
   - If file exists:
     - Use the found file path
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
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort sort-by="Files Created"` command to sort table by Files Created
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
   - Continue to Step 5 (Expert Review)

### Step 5: Expert Review

10. **Expert Review** (using expert from Step 2/4 and file from Step 3b/4/9)
   - **Exception - File Rearrangement**: If the expert's expertise is appropriate (e.g., Documentation Expert, Architecture Expert, or any expert whose expertise relates to file organization/structure):
     - Expert can rearrange files in `docs/` directory instead of reviewing the selected file
     - Expert should reorganize files according to documentation structure rules, or change the rules if they think there is a better way
     - Expert should document all changes in one designated file (e.g., `docs/guides/FILE_REORGANIZATION.md` or similar)
     - Documentation should include:
       - List of files moved/reorganized
       - Reason for reorganization
       - New structure/organization
       - Expert's name, expertise, and date
     - **Output**: Expert name and the designated documentation file (full path)
     - **Stop**: End command here
   - **Standard Review** (if exception doesn't apply):
     - Ask the expert to review the selected file
     - **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY ADD substantive content to the file, not just describe what should be added
     - **⚠️ THE FILE MUST BE VISIBLY CHANGED**: The file content must be expanded with new substantive material before any review contribution section is added
     - **⚠️ FORBIDDEN**: Do NOT add only a review contribution section that describes what "should be added" - this is not acceptable
     - **⚠️ FORBIDDEN**: Do NOT describe changes without actually making them to the file
     - Expert MUST expand the file according to their professional opinion by:
       - **REQUIRED**: Adding new sections with actual content (not just section headers or descriptions)
       - **REQUIRED**: Expanding existing sections with detailed information (actual content, not descriptions)
       - **REQUIRED**: Adding examples, code snippets, best practices, or detailed explanations (actual examples, not descriptions of examples)
       - **REQUIRED**: Including practical guidance, tools, procedures, or methodologies (actual guidance, not descriptions of guidance)
     - **⚠️ VERIFICATION**: Before adding the review contribution section, verify that the file has been visibly changed with new substantive content
     - The review contribution section should describe what was ACTUALLY ADDED to the file, not what should be added
     - If expert has no professional connection to the content:
       - Expert should directly admit they have nothing to contribute
       - Still add a brief note at the end
     - Expert should add a brief description of changes at the end of the document with:
       - Description of changes made (what was actually added to the file)
       - Expert's name
       - Expertise
       - Date
     - **Update Expert Reviews Tracker**: After review, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Increment "Files Reviewed" count for the expert
       - Increment "Total Changes" count
       - Update "Last Review Date"
       - Add entry to "Review Details" section with file path and date
       - Update statistics summary
     - **Update Statistics and Sort**: After updating tracker:
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
     - **Output**: Expert name and file name (full path)

## Implementation Notes

### Random Number Generation
- Use `$((RANDOM % 10 + 1))` for 1-10 range (expert selection)
- Use `$((RANDOM % 5 + 1))` for 1-5 range (file selection)

### Command Execution
- Execute `/local/expert` command to get expert name (if `expert` parameter is empty)
- Execute `/local/file` command to get file path (if `file` parameter is empty)
- Use `expert` parameter value directly if provided (assume expert exists)
- Search for file by name if `file` parameter is provided (use `find` or similar to locate file)
- After updating Expert Reviews Tracker:
  - Execute `/local/statistics` command to calculate and update statistics rows
  - Execute `/local/sort` command:
    - If file was created: Use `sort-by="Files Created"`
    - If file was reviewed: Use default (sort-by="Files Reviewed")

### Expert File Creation
- Check existing experts in `.cursor/rules/experts/*.mdc`
- Identify gaps in expertise coverage
- Create very specific, narrow field expert
- Save as `.cursor/rules/experts/<expert_name>_expert.mdc`

### File Creation
- **File Type Restrictions**:
  - ✅ Can create: Documentation files in `docs/`, command files in `.cursor/commands/general/`, rule files in `.cursor/rules/experts/`
  - ❌ Cannot create: Expert persona files (expert personas are created separately in Step 1a, not through file creation)
- Check existing files to ensure new file doesn't exist (when `file="new"`)
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
- **Exception - File Rearrangement**:
  - If expert's expertise is appropriate (e.g., Documentation Expert, Architecture Expert, or any expert whose expertise relates to file organization/structure):
    - Expert can rearrange files in `docs/` directory instead of reviewing the selected file
    - Expert should reorganize files according to documentation structure rules, or change the rules if they think there is a better way
    - Expert should document all changes in one designated file (e.g., `docs/guides/FILE_REORGANIZATION.md` or similar)
    - Documentation should include: list of files moved/reorganized, reason for reorganization, new structure/organization, expert's name/expertise/date
- **Standard Review** (if exception doesn't apply):
  - Read existing file content
  - **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY ADD substantive content to the file, not just describe what should be added
  - **⚠️ THE FILE MUST BE VISIBLY CHANGED**: The file content must be expanded with new substantive material before any review contribution section is added
  - **⚠️ FORBIDDEN**: Do NOT add only a review contribution section that describes what "should be added" - this is not acceptable
  - **⚠️ FORBIDDEN**: Do NOT describe changes without actually making them to the file
  - Have expert review and expand according to expertise by:
    - **REQUIRED**: Adding new sections with actual content (not just section headers or descriptions)
    - **REQUIRED**: Expanding existing sections with detailed information (actual content, not descriptions)
    - **REQUIRED**: Including examples, code snippets, best practices, procedures (actual examples, not descriptions of examples)
    - **REQUIRED**: Adding practical guidance, tools, methodologies, or detailed explanations (actual guidance, not descriptions of guidance)
  - **⚠️ VERIFICATION**: Before adding the review contribution section, verify that the file has been visibly changed with new substantive content
  - The review contribution section describes what was ACTUALLY ADDED, not what should be added
  - Append changes description with signature block
  - Format: Markdown section at end of file
  - **Update Expert Reviews Tracker**: After review, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
    - Increment "Files Reviewed" count for the expert
    - Increment "Total Changes" count
    - Update "Last Review Date"
    - Add entry to "Review Details" section with file path, date, and summary of changes
    - Recalculate "Avg Changes per Review" (Total Changes / Files Reviewed)
    - Update statistics summary (total reviews, total files, etc.)
  - **Update Statistics and Sort**: After updating tracker:
    - Run `/local/statistics` command to calculate and update statistics rows
    - Run `/local/sort` command (defaults to "Files Reviewed") to sort table

## ⚠️ REMINDER: SUBSTANTIVE CONTENT FIRST

**Before adding the signature block, ensure that substantive content has been ACTUALLY ADDED to the file. The signature block should describe what was added, not what should be added.**

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

