# Expert Review Command

Expert-driven file review and creation workflow. Randomly selects or creates experts and files, then has experts review/expand content.

## Usage

Execute this command to run the expert review workflow:
1. Randomly select or create an expert
2. Randomly select or create a file
3. Have the expert review/expand the file

## Workflow

### Step 1: Select or Create Expert

1. **Random Decision**: Generate random number 1-10
   - If 1 (10% chance): Create new expert → Go to Step 1a
   - If 2-10 (90% chance): Select existing expert → Go to Step 2

2. **Step 1a: Create New Expert** (if random = 1)
   - Think of a very specific, narrow field that doesn't have an expert yet
   - Expert should be number one in their narrow field
   - Create expert persona with:
     - Name
     - Expertise (very specific, narrow field)
     - Description of why this expertise is valuable
   - **Output**: Expert name and expertise
   - **Stop**: End command here

3. **Step 2: Select Existing Expert** (if random = 2-10)
   - Use `/local/expert` command to randomly select an expert
   - Get expert's name from the command output
   - Continue to Step 3

### Step 3: Select or Create File

4. **Random Decision**: Generate random number 1-5
   - If 1 (20% chance): Create new file → Go to Step 3a
   - If 2-5 (80% chance): Select existing file → Go to Step 4

5. **Step 3a: Create New File** (if random = 1)
   - Ask the expert (from Step 2) to create a new file
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
   - **Output**: Expert name and created file (full path)
   - **Stop**: End command here

6. **Step 4: Select Existing File** (if random = 2-5)
   - Use `/local/file` command to randomly select a file
   - Get file path from the command output
   - Continue to Step 5

### Step 5: Expert Review

7. **Expert Review** (using expert from Step 2 and file from Step 4)
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
     - Expert should expand the file according to their professional opinion
     - If expert has no professional connection to the content:
       - Expert should directly admit they have nothing to contribute
       - Still add a brief note at the end
     - Expert should add a brief description of changes at the end of the document with:
       - Description of changes made
       - Expert's name
       - Expertise
       - Date
     - **Output**: Expert name and file name (full path)

## Implementation Notes

### Random Number Generation
- Use `$((RANDOM % 10 + 1))` for 1-10 range (expert selection)
- Use `$((RANDOM % 5 + 1))` for 1-5 range (file selection)

### Command Execution
- Execute `/local/expert` command to get expert name
- Execute `/local/file` command to get file path

### Expert File Creation
- Check existing experts in `.cursor/rules/experts/*.mdc`
- Identify gaps in expertise coverage
- Create very specific, narrow field expert
- Save as `.cursor/rules/experts/<expert_name>_expert.mdc`

### File Creation
- **File Type Restrictions**:
  - ✅ Can create: Documentation files in `docs/`, command files in `.cursor/commands/general/`, rule files in `.cursor/rules/experts/`
  - ❌ Cannot create: Expert persona files (expert personas are created separately in Step 1a, not through file creation)
- Check existing files to ensure new file doesn't exist
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
  - Have expert review and expand according to expertise
  - Append changes description with signature block
  - Format: Markdown section at end of file

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

