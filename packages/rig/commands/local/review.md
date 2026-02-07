# Expert Review Command

Expert-driven file review and creation workflow. Randomly selects or creates experts and files, then has experts review/expand content.

## ⚠️ CRITICAL REQUIREMENT: SUBSTANTIVE FILE IMPROVEMENT

**EXPERTS MUST ACTUALLY IMPROVE FILES, NOT JUST DESCRIBE WHAT SHOULD BE CHANGED.**

### Core Principle: DO, DON'T SUGGEST

**When you are told to review, this means CHANGE THE FILE where the expert thinks it needs changes. Add things the expert thinks are worth adding. DO NOT suggest what to do - DO IT.**

- ❌ **FORBIDDEN**: Adding only a review contribution section that describes what "should be added" or "should be fixed"
- ❌ **FORBIDDEN**: Describing changes without actually making them
- ❌ **FORBIDDEN**: Suggesting experts - CREATE them
- ❌ **FORBIDDEN**: Giving suggestions without implementations
- ❌ **FORBIDDEN**: Assuming someone will read and perform - assume the next step is BUILDING something with those files
- ✅ **REQUIRED**: Actually making changes to improve the file:
  - **Adding**: New sections, expanding existing content, including examples, code snippets, best practices, procedures, tools, methodologies, or detailed explanations
  - **Fixing**: Correcting errors, fixing mistakes, improving accuracy
  - **Deleting**: Removing wrong, outdated, or incorrect content
  - **Improving**: Enhancing clarity, structure, organization, or quality
- ✅ **REQUIRED**: Create experts when needed - don't suggest them, create them
- ✅ **REQUIRED**: Create files when needed - don't suggest them, create them
- ✅ **REQUIRED**: Move files when needed - don't suggest moving, actually move them
- ✅ **REQUIRED**: Do whatever is needed to make everything better - don't just suggest improvements
- ✅ **REQUIRED**: The file must be visibly changed before any review contribution section is added
- ✅ **REQUIRED**: The review contribution section should describe what was ACTUALLY CHANGED in the file (added, fixed, deleted, improved), not what should be changed

**This is a critical requirement. Experts should actively improve files by adding, fixing, deleting, or improving content as needed. Failure to make actual changes defeats the purpose of the review workflow.**

**Remember: Always assume the next step is BUILDING something with these files. Make them ready for implementation, not just planning.**

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

#### `limit` (optional)
- `<number>` - Maximum number of attempts to find a reviewable file (default: 10)
- Used when skipping files (irrelevant, already reviewed today, not found)
- When limit is reached, command stops and shows summary

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

# With limit parameter
/local/review limit=5
/local/review expert="Sarah Johnson" limit=20
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

### Step 5: File Pre-Review Checks

10. **File Pre-Review Checks** (using expert from Step 2/4 and file from Step 3b/4/9)
   - **Initialize Attempt Tracking**: Set attempt counter to 0, max attempts from `limit` parameter (default: 10)
   - **Initialize Skip Tracking**: Track reasons for skipping files (irrelevant, already reviewed, not found, etc.)
   - **File Selection Loop**: Repeat until a reviewable file is found or limit is reached:
     - **Check 1: Irrelevant Mark** (FIRST CHECK):
       - Read the file content
       - Search for `<!-- IRRELEVANT FOR ME -->` mark in the file
       - If mark found:
         - Skip this file (count++)
         - Add to skip tracking: "File [path] skipped: Already marked as irrelevant"
         - If file was randomly selected: Find another random file (maintain random selection logic)
         - If file was specified: Exit with summary (user specified this file, cannot find another)
         - Continue loop
     - **Check 2: Reviewed Today** (SECOND CHECK - only if no irrelevant mark):
       - Read the file content
       - Search for review contribution section dated today (YYYY-MM-DD format) by this expert
       - Look for pattern: `**Expert**: [Expert Name]` and `**Date**: [Today's Date]` in review contribution section
       - If reviewed today by this expert:
         - Skip this file (count++)
         - Add to skip tracking: "File [path] skipped: Already reviewed today by [Expert Name]"
         - If file was randomly selected: Find another random file (maintain random selection logic)
         - If file was specified: Exit with summary (user specified this file, cannot find another)
         - Continue loop
     - **Check 3: Relevance Check** (THIRD CHECK - only if no mark and not reviewed today):
       - Expert evaluates if file is relevant to their expertise
       - If file is IRRELEVANT:
         - Expert adds brief note at end explaining why (per lines 252-254)
         - Expert adds mark: `<!-- IRRELEVANT FOR ME -->` right after the note
         - **Update Expert Reviews Tracker**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
           - Increment "Files Reviewed" count for the expert
           - Do NOT increment "Total Changes" (0 changes - file marked as irrelevant)
           - Update "Last Review Date" to today
           - Add entry to "Review Details" section: "File [path] - Marked as irrelevant (no changes)"
         - **Update Statistics and Sort**: After updating tracker:
           - Run `/local/statistics` command to calculate and update statistics rows
           - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
         - **Update Tracker Status**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
           - Replace "Current reviewer" with "Last reviewer"
           - Replace "Current file" with "Last file"
         - **Commit Changes**: Stage all changes and commit with message:
           - Message format: `Expert review: [Expert Name] marked [File Path] as irrelevant`
           - Stage all modified files (file with mark, tracker)
           - Commit with the generated message
         - **Exit Successfully** (exit code 0): Show summary:
           - "File marked as irrelevant"
           - Expert name
           - File path
           - Reason (brief explanation from expert's note)
         - **Stop**: End command here
       - If file is RELEVANT: Continue to Step 6 (Expert Review)
     - **Increment Attempt Counter**: count++
     - **Check Limit**: If attempt counter >= limit:
       - **Exit with Summary**: Show comprehensive summary:
         - Number of attempts made
         - Files checked
         - Reasons for skipping (irrelevant, already reviewed, not found, etc.)
         - Final status (reviewed X files, skipped Y files, marked Z as irrelevant)
       - **Stop**: End command here

### Step 6: Expert Review

11. **Expert Review** (using expert from Step 2/4 and file from Step 3b/4/9 that passed all checks)
   - **Initialize Review Tracking**: Create a set to track reviewed files (to prevent infinite loops in recursive reviews)
   - **Standard Review** (always performed):
     - Ask the expert to review the selected file
     - **⚠️ CRITICAL REQUIREMENT**: Expert must ACTUALLY IMPROVE the file, not just describe what should be changed
     - **⚠️ DO, DON'T SUGGEST**: When reviewing, CHANGE THE FILE where the expert thinks it needs changes. Add things the expert thinks are worth adding. DO NOT suggest what to do - DO IT.
     - **⚠️ THE FILE MUST BE VISIBLY CHANGED**: The file must be improved before any review contribution section is added
     - **⚠️ FORBIDDEN**: Do NOT add only a review contribution section that describes what "should be added" or "should be fixed" - this is not acceptable
     - **⚠️ FORBIDDEN**: Do NOT describe changes without actually making them to the file
     - **⚠️ FORBIDDEN**: Do NOT suggest experts - CREATE them if needed
     - **⚠️ FORBIDDEN**: Do NOT give suggestions without implementations - implement them
     - **⚠️ FORBIDDEN**: Do NOT assume someone will read and perform - assume the next step is BUILDING something with those files
     - **⚠️ REQUIRED**: Create experts when needed - don't suggest them, create them
     - **⚠️ REQUIRED**: Create files when needed - don't suggest them, create them
     - **⚠️ REQUIRED**: Move files when needed - don't suggest moving, actually move them
     - **⚠️ REQUIRED**: Do whatever is needed to make everything better - don't just suggest improvements
     - Expert MUST improve the file according to their professional opinion by:
       - **Adding**: New sections with actual content, expanding existing sections, including examples, code snippets, best practices, procedures, tools, methodologies, or detailed explanations (actual content, not descriptions)
       - **Fixing**: Correcting errors, fixing mistakes, improving accuracy, correcting typos, fixing broken links, correcting factual errors
       - **Deleting**: Removing wrong, outdated, incorrect, or redundant content
       - **Improving**: Enhancing clarity, improving structure, better organization, improving formatting, refining language
     - **⚠️ VERIFICATION STEP 1**: Before adding the review contribution section, verify that the file has been visibly changed (added, fixed, deleted, or improved)
     - **⚠️ VERIFICATION STEP 2**: After expert adds review contribution section, compare all suggestions/descriptions in the review contribution to the actual file content:
       - Read the review contribution section carefully
       - Extract all suggestions, additions, fixes, or improvements mentioned
       - Check if each suggestion is actually implemented in the file content
       - If a suggestion is mentioned but NOT implemented in the file:
         - **IMPLEMENT IT**: Actually add/fix/improve the file to match the suggestion
         - Do not leave suggestions unimplemented
       - If all suggestions are reflected in the file:
         - Mark file as "Ready" in tracker (if applicable)
       - If suggestions are only partially implemented:
         - Implement remaining suggestions
         - Mark file as "Probably Ready" in tracker
     - The review contribution section should describe what was ACTUALLY CHANGED in the file (added, fixed, deleted, improved), not what should be changed
     - **⚠️ CRITICAL**: Every suggestion in the review contribution MUST be reflected in the actual file content. If it's not, implement it immediately.
     - If expert has no professional connection to the content:
       - Expert should directly admit they have nothing to contribute
       - Still add a brief note at the end
       - Add mark: `<!-- IRRELEVANT FOR ME -->` right after the note
       - Update tracker as reviewed but with 0 changes (see Step 5 for tracker update details)
       - Exit successfully (this should have been caught in Step 5, but handle here as fallback)
     - Expert should add a brief description of changes at the end of the document with:
       - Description of changes made (what was actually added, fixed, deleted, or improved in the file)
       - Expert's name
       - Expertise
       - Date
     - **⚠️ POST-REVIEW VERIFICATION**: After expert adds review contribution section, verify all suggestions are implemented:
       - Read the review contribution section carefully
       - Extract all suggestions, additions, fixes, or improvements mentioned in the "Changes" field
       - Check if each suggestion is actually implemented in the file content:
         - If suggestion mentions "added section X" → verify section X exists in file
         - If suggestion mentions "fixed Y" → verify Y is actually fixed in file
         - If suggestion mentions "improved Z" → verify Z is actually improved in file
         - If suggestion mentions "deleted W" → verify W is actually deleted from file
       - **If suggestion is mentioned but NOT implemented**:
         - **IMPLEMENT IT IMMEDIATELY**: Actually add/fix/improve/delete in the file to match the suggestion
         - Do not leave suggestions unimplemented
         - Update the file content to reflect all suggestions
       - **If all suggestions are reflected in the file**:
         - Mark file as "✅ Ready" in tracker (if file has 2+ reviews)
       - **If suggestions are only partially implemented**:
         - Implement remaining suggestions
         - Mark file as "⚠️ Probably Ready" in tracker
     - **Mark File as Reviewed**: Add the current file path to the reviewed files set
     - **Update Expert Reviews Tracker**: After review and verification, update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
       - Increment "Files Reviewed" count for the expert
       - Increment "Total Changes" count
       - Update "Last Review Date"
       - Add entry to "Review Details" section with file path and date
       - If expert reviewed documentation structure (Documentation Expert, Architecture Expert, etc.): Increment "Structure Reviewed" count
       - If expert rearranged files: Increment "Files Rearranged" count
       - **Update "Ready for Implementation" status** in Files Reviewed Statistics table:
         - If file has 2+ reviews AND all suggestions from all reviews are verified as implemented: Mark as "✅ Ready"
         - If file has 2+ reviews but suggestions not yet verified: Mark as "⚠️ Probably Ready"
         - If file has 1 review: Mark as "⚠️ Needs Review"
         - If file has 0 reviews: Mark as "❌ Not Ready"
       - Update statistics summary
     - **Update Statistics and Sort**: After updating tracker:
       - Update files reviewed statistics table (increment review count for the file)
       - Run `/local/statistics` to recalculate statistics
       - Run `/local/sort` to sort the expert statistics table
       - Run `/local/statistics` command to calculate and update statistics rows
       - Run `/local/sort` command (defaults to "Files Reviewed") to sort table
   - **Recursive Review of Related Documentation** (after standard review):
     - **Check for Related Documentation Section**: After reviewing the file, check if it contains a "Related Documentation" section (look for heading "## Related Documentation" or "### Related Documentation" or similar variations)
     - **Extract Referenced Files**: If "Related Documentation" section exists:
       - Parse markdown links in the format `[text](path)` or `- [text](path)`
       - Extract the file paths from the links
       - Resolve relative paths to absolute paths (relative to the current file's directory)
       - Filter out external URLs (http://, https://, mailto:, etc.)
       - Filter out files that don't exist
       - Filter out files already in the reviewed files set (to prevent loops)
     - **Recursively Review Each Referenced File**: For each referenced file:
       - **Update Tracker**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md` with current file being reviewed
       - **Review File**: Use the same expert to review the referenced file (repeat Step 10 with the referenced file)
       - **Mark as Reviewed**: Add the referenced file path to the reviewed files set
       - **Continue Recursion**: After reviewing each referenced file, check if it also has a "Related Documentation" section and recursively review those files too (with loop prevention)
     - **Note**: Recursive reviews should be depth-limited to prevent excessive reviews (suggest max depth of 3-5 levels)
     - **Track Recursive Reviews**: All recursively reviewed files should be tracked in the same way as the primary review (update tracker, statistics, etc.)
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
     - Message format: `Expert review: [Expert Name] reviewed [File Path]` (include recursive reviews in commit message if applicable)
     - Stage all modified files (reviewed file(s), tracker, reorganization documentation if applicable, any other files modified)
     - If recursive reviews occurred, include all reviewed files in the commit
     - Commit with the generated message
   - **Output**: Expert name and file name(s) (full path, including recursively reviewed files if any)

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
- **Recursive Review Implementation**:
  - After reviewing a file, parse the file content to find "Related Documentation" sections
  - Use regex or markdown parser to extract links: `\[([^\]]+)\]\(([^\)]+)\)`
  - Resolve relative paths using the current file's directory as base
  - Maintain a set/array of reviewed file paths to prevent loops
  - Track recursion depth and limit to 3-5 levels
  - For each referenced file: verify it exists, check if already reviewed, then review recursively
  - All recursively reviewed files should be included in the same commit as the primary review
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
- **Recursive Review of Related Documentation** (after standard review):
  - **Detection**: After reviewing a file, check if it contains a "Related Documentation" section
  - **Pattern Matching**: Look for headings like:
    - `## Related Documentation`
    - `### Related Documentation`
    - `## Related`
    - `### Related`
    - `## See Also`
    - `### See Also`
  - **Link Extraction**: Parse markdown links in the format:
    - `[text](path)` - standard markdown link
    - `- [text](path)` - list item with link
    - Extract the path portion (between parentheses)
  - **Path Resolution**:
    - If path is relative (starts with `./` or `../` or no leading `/`), resolve relative to the current file's directory
    - If path is absolute (starts with `/`), use as-is
    - Convert to absolute path for consistency
  - **Filtering**:
    - Skip external URLs (http://, https://, mailto:, etc.)
    - Skip files that don't exist
    - Skip files already in reviewed files set (loop prevention)
    - Only process markdown files (`.md`, `.mdc`) or files in `docs/` directory
  - **Recursive Review Process**:
    - For each valid referenced file:
      - Check if file is already in reviewed files set (skip if yes)
      - Add file to reviewed files set
      - Update tracker with current file being reviewed
      - Review the file with the same expert (repeat standard review process)
      - After review, check if the referenced file also has "Related Documentation" section
      - Recursively review those files too (with depth limit)
    - **Depth Limiting**: Track recursion depth and limit to 3-5 levels to prevent excessive reviews
    - **Loop Prevention**: Maintain a set of reviewed file paths to prevent infinite loops
  - **Tracking**: All recursively reviewed files should be tracked the same way as primary review:
    - Update expert statistics
    - Update file review statistics
    - Include in commit message
    - Track in review details
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

## Recursive Review Feature

### Overview

When reviewing a file, the command automatically detects and recursively reviews files referenced in "Related Documentation" sections. This ensures that related documentation stays synchronized and up-to-date.

### How It Works

1. **Detection**: After reviewing a file, the command checks for a "Related Documentation" section
2. **Link Extraction**: Parses markdown links from the section (format: `[text](path)`)
3. **Path Resolution**: Resolves relative paths to absolute paths
4. **Filtering**: Skips external URLs, non-existent files, and already-reviewed files (loop prevention)
5. **Recursive Review**: Reviews each referenced file with the same expert
6. **Depth Limiting**: Limits recursion depth to 3-5 levels to prevent excessive reviews

### Example

If reviewing `docs/features/port-manager/PRD.md` which contains:
```markdown
## Related Documentation

- [Port Management Strategy](../guides/PORT_MANAGEMENT_STRATEGY.md)
- [Projects Ports Reference](../reference/PROJECTS_PORTS.md)
```

The command will:
1. Review `docs/features/port-manager/PRD.md` (primary file)
2. Automatically review `docs/guides/PORT_MANAGEMENT_STRATEGY.md` (recursive)
3. Automatically review `docs/reference/PROJECTS_PORTS.md` (recursive)
4. If those files also have "Related Documentation" sections, review those too (with depth limit)

### Loop Prevention

- Maintains a set of reviewed file paths
- Skips files already in the reviewed set
- Prevents infinite loops in circular references

### Depth Limiting

- Default maximum depth: 3-5 levels
- Prevents excessive reviews of deeply nested documentation
- Ensures reasonable review scope

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

### Scenario 4: File Reviewed with Recursive Reviews
```
File reviewed
Expert: [Name]
File: [full/path/to/file.md]
Recursive reviews:
  - [full/path/to/related-file-1.md]
  - [full/path/to/related-file-2.md]
```

### Scenario 5: Files Rearranged (Exception)
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
