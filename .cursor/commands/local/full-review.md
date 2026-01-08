# Full Review Command

Comprehensive review routine that reviews all files in the current directory with a specified expert, allows expert suggestions for new features and experts, and scans other projects for new/missed items.

## Usage

Execute this command to run a comprehensive review workflow:
1. Review all files in current directory with specified expert
2. Allow expert to suggest and create new features
3. Allow expert to suggest and create new experts
4. Scan other projects for new/missed items worth bringing in

### Parameters

#### `expert` (optional)
- `<name>` - Use specific expert by name for all reviews
- Empty/omitted - Use `/local/expert` to randomly select an expert

#### `skip-suggestions` (optional)
- `true` - Skip expert suggestions for new features and experts
- Empty/omitted - Allow expert suggestions (default)

#### `skip-scan` (optional)
- `true` - Skip scanning other projects
- Empty/omitted - Scan other projects (default)

#### `limit` (optional)
- `<number>` - Number of times to call `/local/review` command (default: 10)
- Each call may review a different file or skip files
- Total files reviewed may be less than limit (due to skips, irrelevant files, etc.)

### Examples

```bash
# Full review with specific expert
/local/full-review expert="Sarah Johnson"

# Full review with random expert
/local/full-review

# Full review without suggestions
/local/full-review skip-suggestions=true

# Full review without project scanning
/local/full-review skip-scan=true

# Full review with all options
/local/full-review expert="Arthur Davis" skip-suggestions=false skip-scan=false

# Full review with limit
/local/full-review expert="Sarah Johnson" limit=20
/local/full-review limit=5
```

## Workflow

### Step 1: Select Expert

1. **Check `expert` parameter**:
   - If `expert="<name>"`: Use specified expert → Go to Step 2
   - If `expert` is empty/omitted: Use `/local/expert` to randomly select an expert → Go to Step 2

2. **Update Tracker**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
   - Find the line containing "**Last Updated**:"
   - Add or update the next line: `**Current reviewer**: [Expert Name]`
   - If "Last reviewer" exists, replace it with "Current reviewer"

### Step 2: Detect Files

3. **Detect All Files**:
   - Execute `.cursor/scripts/detect-files.sh` to get list of all files in current directory
   - Parse output to get file list
   - Filter out files that shouldn't be reviewed (if needed):
     - `.git/` directory
     - `node_modules/` directory
     - Binary files (if detectable)
     - Very large files (optional, configurable)

### Step 3: Review Files (with Limit)

4. **Review Files with Limit**:
   - Get `limit` parameter (default: 10 if not specified)
   - **Execute `/local/review` Command LIMIT Times**:
     - For i = 1 to LIMIT:
       - Execute `/local/review expert=[EXPERT] limit=[LIMIT]`
       - Wait for review to complete
       - Each call may:
         - Review a file (if file is relevant and not reviewed today)
         - Skip a file (if irrelevant, already reviewed today, or not found)
         - Mark a file as irrelevant (if expert determines it's not relevant)
       - **Note**: The `/local/review` command handles its own tracker updates internally
       - Track progress: Show "Review attempt [i]/[LIMIT]" (optional: show progress indicator)
   - **Summary After All Attempts**:
     - Collect summaries from each `/local/review` call
     - Aggregate results:
       - Total files reviewed
       - Total files skipped (with reasons)
       - Total files marked as irrelevant
       - Total attempts made
   
   **⚠️ IMPORTANT**: 
   - Each `/local/review` call updates the tracker internally (no need to update here)
   - The `/local/review` command handles file selection, relevance checking, and skipping
   - This step simply calls `/local/review` LIMIT times and aggregates results

### Step 4: Expert Suggestions

5. **Check `skip-suggestions` parameter**:
   - If `skip-suggestions=true`: Skip to Step 6
   - If `skip-suggestions` is empty/omitted: Continue to Step 5a

6. **Step 5a: Suggest New Feature**:
   - Ask the expert to suggest a new feature that should be created
   - Expert should provide:
     - Feature name
     - Brief description
     - Why it's valuable
   - If expert suggests a feature:
     - Execute `/local/review expert=[EXPERT] file=[SUGGESTED_FEATURE_NAME]`
     - Expert should create the feature (PRD, etc.)

7. **Step 5b: Suggest New Expert**:
   - Ask the expert to suggest a new expert persona that should be created
   - Expert should provide:
     - Expert name
     - Expertise field
     - Why this expertise is valuable
   - If expert suggests a new expert:
     - Execute `/local/review expert="new"`
     - Follow the expert creation workflow

### Step 5: Scan Other Projects

8. **Check `skip-scan` parameter**:
   - If `skip-scan=true`: Skip to Step 7
   - If `skip-scan` is empty/omitted: Continue to Step 6a

9. **Step 6a: Scan Projects**:
   - Execute `.cursor/scripts/scan-projects.sh` to scan other projects in `../`
   - Script should:
     - Find all projects in parent directory
     - Compare with current project
     - Identify new patterns, tools, rules, commands, experts, features
     - Report findings

10. **Step 6b: Review Findings**:
    - Present findings to user/expert
    - Ask if any items should be brought into current project
    - If yes, create appropriate PRDs or bring in items

### Step 6: Summary

11. **Generate Summary**:
    - Report total files reviewed
    - Report new features created (if any)
    - Report new experts created (if any)
    - Report items found in other projects (if any)
    - Update tracker with final status

12. **Update Tracker Status**: Update `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
    - Replace "Current reviewer" with "Last reviewer"
    - Add summary of full review session
    - **Note**: Individual file reviews should have already been tracked in Step 4
    - This final update is for the overall session summary only

## Implementation Notes

### File Detection

- Use `.cursor/scripts/detect-files.sh` script
- Script returns file paths (one per line)
- Filter files as needed (gitignore patterns, etc.)
- Handle errors gracefully (missing script, etc.)

### Review Execution

- Call `/local/review` command for each file
- Wait for each review to complete before proceeding
- Handle errors gracefully (continue on error or stop)
- Track which files were reviewed successfully

### Expert Suggestions

- Expert suggestions are interactive
- Expert should provide clear, actionable suggestions
- Validate suggestions before creating (check if already exists, etc.)
- Handle creation failures gracefully

### Project Scanning

- Use `.cursor/scripts/scan-projects.sh` script
- Script should return structured findings
- Parse and present findings clearly
- Allow user/expert to decide what to bring in

### Error Handling

- Continue on individual file review errors
- Report errors at end of workflow
- Don't fail entire workflow on single errors
- Provide clear error messages

### Progress Tracking

- Optional: Show progress (X of Y files reviewed)
- Optional: Estimate time remaining
- Optional: Save state for resume capability

### Mobile Considerations for Full Review Workflow

When reviewing files with mobile optimization in mind, consider:

1. **Review Performance on Mobile Devices**
   - Review process should be efficient even on slower mobile networks
   - Progress tracking should be lightweight and mobile-friendly
   - Output formatting should be readable on small screens

2. **Mobile-Friendly Progress Display**
   - Use concise progress indicators (e.g., "5/80" instead of verbose messages)
   - Ensure progress updates don't overwhelm mobile interfaces
   - Consider mobile-friendly emoji/status indicators

3. **Mobile-Optimized Output**
   - Summary reports should be scannable on mobile devices
   - Use bullet points and short paragraphs
   - Ensure file paths are readable on small screens (consider truncation)

4. **Battery Efficiency**
   - Long-running reviews should minimize resource usage
   - Consider pausing/resuming capability for mobile devices
   - Optimize file processing to avoid excessive CPU usage

## Expected Output

### During Execution

```
🚀 Starting full review with expert: [Expert Name]
📋 Detected 42 files to review
📝 Reviewing file 1/42: docs/README.md
✅ File reviewed
📝 Reviewing file 2/42: docs/guides/DOCUMENTATION_STRUCTURE.md
✅ File reviewed
...
📝 Reviewing file 42/42: .cursor/commands/local/review.md
✅ File reviewed

💡 Expert suggests new feature: [Feature Name]
📦 Creating feature...
✅ Feature created

👥 Expert suggests new expert: [Expert Name]
📦 Creating expert...
✅ Expert created

🔍 Scanning other projects...
📊 Found 3 new items worth bringing in:
  - [Item 1]
  - [Item 2]
  - [Item 3]
```

### Final Summary

```
✅ Full review complete!

📊 Summary:
  - Files reviewed: 42
  - New features created: 1
  - New experts created: 1
  - Items found in other projects: 3
```

## Dependencies

- `/local/review` command (must exist)
- `/local/expert` command (for expert selection)
- `.cursor/scripts/detect-files.sh` script
- `.cursor/scripts/scan-projects.sh` script

## Notes

- This is a long-running command (may take significant time)
- Can be interrupted and resumed (if resume capability implemented)
- Progress can be tracked in tracker file
- Expert suggestions are optional and interactive

### SEO Considerations for Full Review Workflow

When this command is used to review files that will be published or made web-accessible:

1. **Review Output SEO**
   - Review summaries and findings should be SEO-friendly if published
   - Use descriptive, keyword-rich language in review outputs
   - Ensure review documentation follows SEO best practices (headings, structure, metadata)
   - Consider search engine discoverability when generating review reports

2. **File Selection for SEO**
   - Prioritize reviewing files that impact web visibility (documentation, guides, content)
   - Review files for SEO compliance (meta tags, headings, content structure)
   - Ensure reviewed files follow SEO best practices before publication
   - Consider internal linking opportunities when reviewing related files

3. **Content Quality for Search**
   - Review process should ensure content quality and depth (important for SEO)
   - Verify that reviewed content answers user search queries
   - Ensure reviewed files contribute to topic clusters and content authority
   - Review for keyword optimization and natural language usage

4. **Documentation SEO**
   - When reviewing documentation files, ensure proper SEO structure
   - Verify heading hierarchy, meta descriptions, and semantic HTML
   - Check for internal linking opportunities and related content connections
   - Ensure documentation is comprehensive and valuable for search engines

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive full review command that orchestrates review of all files, expert suggestions, and project scanning. This command provides a complete workflow for comprehensive project review and improvement.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for full review workflow section covering review performance on mobile devices (efficient processing on slower networks, lightweight progress tracking, mobile-friendly output formatting), mobile-friendly progress display (concise indicators, readable updates, mobile-optimized status indicators), mobile-optimized output (scannable summaries, bullet points, readable file paths), and battery efficiency considerations (resource minimization, pause/resume capability, CPU optimization). This addition ensures that the full review workflow is optimized for execution on mobile devices, considering mobile constraints like network speed, battery life, and screen size when displaying progress and results.

---

