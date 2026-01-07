# Update Expert Reviews Tracker

Scan all files in the project, read review contributions from each file, and update the `docs/reference/EXPERT_REVIEWS_TRACKER.md` file with accurate statistics and summaries.

## Usage

Execute this command to scan all files and update the tracker:
```bash
/local/update-tracker
```

No parameters required.

## Workflow

1. **Scan All Files**: 
   - Find all files in the project (`.md`, `.mdc`, `.sh`, `.py` files)
   - Exclude `node_modules/`, `.git/`, `__pycache__/` directories
   - Build comprehensive file list

2. **Read Review Contributions**:
   - For each file, search for "Review/Contribution" sections
   - Extract expert name, date, and changes description
   - Parse review entries to identify which expert reviewed which file

3. **Build Expert Statistics**:
   - Count reviews per expert
   - Count files reviewed per expert
   - Count files created per expert
   - Calculate average changes per review
   - Track structure reviews and file rearrangements
   - Find most recent review date per expert

4. **Build File Statistics**:
   - Count reviews per file
   - Sort files by review count (descending), then alphabetically

5. **Update Expert Review Statistics Table**:
   - Update or create expert rows in the statistics table
   - Recalculate Total, Benford, and Acceptance rows
   - Sort table by "Files Reviewed" (descending)

6. **Update Files Reviewed Statistics Table**:
   - Update or create the files table
   - Sort by review count (descending), then by file path
   - Include total row

7. **Update Expert Summary Sections**:
   - For each expert, update or create summary section
   - List all files reviewed with dates and change descriptions
   - Update "Total Reviews" count
   - List files created (if any)
   - List files rearranged (if any)

8. **Update Statistics Summary**:
   - Calculate total experts
   - Calculate total reviews
   - Calculate total files reviewed
   - Calculate total files created
   - Identify most active experts
   - Update file type and location statistics

## Review Contribution Detection

The command searches for review contributions in files using these patterns:

### Markdown Files (.md, .mdc)

Look for "Review/Contribution" section with format:
```markdown
## Review/Contribution

**Expert**: [Expert Name]
**Expertise**: [Expertise Area]
**Date**: YYYY-MM-DD
**Changes**: [Description of changes]
```

### Script Files (.sh, .py)

Look for review comments in docstrings or comments:
```bash
# Review/Contribution
# Expert: [Expert Name]
# Date: YYYY-MM-DD
# Changes: [Description]
```

## Output

The command will:
- Display progress as files are scanned
- Show summary of reviews found
- Update the tracker file
- Display confirmation message

## Examples

```bash
# Update tracker by scanning all files
/local/update-tracker
```

**Output**:
```
Scanning files...
Found 95 files to scan
Reading review contributions...
Found 124 reviews across 25 experts
Updating expert statistics table...
Updating files statistics table...
Updating expert summaries...
Updating statistics summary...
✅ Tracker updated successfully
```

## Integration with Other Commands

This command can be used:
- After running `/local/full-review` to ensure tracker is accurate
- After manual file reviews to sync tracker
- Periodically to maintain tracker accuracy
- Before generating reports or statistics

## Error Handling

- If file cannot be read: Skip and continue
- If review format is invalid: Log warning and continue
- If tracker file cannot be written: Display error and exit
- If no reviews found: Update tracker with empty state

## Notes

- This command reads actual file contents, not just the tracker
- It rebuilds the tracker from source of truth (file review sections)
- It ensures tracker accuracy by scanning all files
- It handles missing or malformed review sections gracefully
- It preserves existing tracker structure and formatting

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created update-tracker command for scanning all files and updating the expert reviews tracker with accurate statistics, expert summaries, and file statistics tables.

