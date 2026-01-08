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
   - Include ALL scanned files (with `.md`, `.mdc`, `.sh`, `.py` extensions), not just files with reviews
   - Files with 0 reviews are included in the table
   - Sort by review count (descending), then by file path
   - Include total row (showing total reviews, not total files)

7. **Update Expert Summary Sections**:
   - For each expert, update or create summary section
   - **Summary section**: Start with numbers only (Total Reviews, Files Reviewed, Files Created, Files Rearranged)
   - **Lists**: Show file names only (no descriptions, no dates)
   - Lists include: Files Created, Files Rearranged, Files Reviewed
   - All lists show only file paths, no additional details

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

### File Reading Errors
- **If file cannot be read**: Skip and continue (log warning with file path)
- **If file encoding is invalid**: Attempt UTF-8 decoding, skip if fails (log warning)
- **If file is locked or inaccessible**: Skip and continue (log error with file path)
- **If directory traversal error**: Log error and continue with remaining files

### Review Format Validation
- **If review format is invalid**: Log warning with file path and continue
- **If required fields are missing**: Log warning with missing field names and continue
- **If date format is invalid**: Use current date as fallback (log warning)
- **If expert name is empty**: Skip review entry (log warning)

### Tracker Update Errors
- **If tracker file cannot be written**: Display error message and exit with non-zero code
- **If tracker file is locked**: Retry with exponential backoff (max 3 attempts), then exit
- **If tracker file path is invalid**: Validate path exists, create parent directories if needed
- **If tracker file permissions are insufficient**: Display clear error message with permission requirements

### Data Validation Errors
- **If no reviews found**: Update tracker with empty state (preserve existing structure)
- **If expert statistics are inconsistent**: Recalculate from scratch and log warning
- **If file counts mismatch**: Use tracker counts as source of truth and log information
- **If date parsing fails**: Use current date as fallback (log warning)

## Notes

- This command reads actual file contents, not just the tracker
- It rebuilds the tracker from source of truth (file review sections)
- It ensures tracker accuracy by scanning all files
- It handles missing or malformed review sections gracefully
- It preserves existing tracker structure and formatting

## Code Quality Considerations

### Validation and Error Handling
- **Input Validation**: Validate file paths and extensions before processing
- **Data Integrity**: Verify extracted data matches expected format before updating tracker
- **Error Recovery**: Continue processing remaining files even if individual files fail
- **Logging**: Provide clear, actionable error messages with file paths and error details

### Performance Optimization
- **File Scanning**: Use efficient directory traversal (avoid duplicate scans)
- **Memory Management**: Process files in batches for large projects (not currently implemented)
- **Caching**: Consider caching file modification times to skip unchanged files (future enhancement)
- **Parallel Processing**: For very large projects, consider parallel file reading (future enhancement)

### Code Quality Standards
- **Maintainability**: Code should be readable and well-documented
- **Consistency**: Follow project coding standards and conventions
- **Testing**: Unit tests should cover file scanning, review extraction, and tracker updates
- **Error Handling**: All error paths should be tested and handled gracefully

### Best Practices
- **Idempotency**: Running the command multiple times should produce consistent results
- **Atomicity**: Tracker updates should be atomic (write to temp file, then rename)
- **Backup**: Consider creating backup of tracker before major updates (future enhancement)
- **Validation**: Validate tracker file structure after updates

## Testing Considerations

### Unit Tests
- Test file scanning with various directory structures
- Test review extraction with valid and invalid formats
- Test statistics calculation with edge cases (empty data, single expert, etc.)
- Test tracker file updates and formatting

### Integration Tests
- Test end-to-end workflow with sample files
- Test error handling with inaccessible files
- Test tracker file updates and validation
- Test consistency across multiple runs

### Edge Cases
- Empty project (no files)
- Project with no reviews
- Files with special characters in paths
- Very large projects (1000+ files)
- Concurrent access to tracker file

## Code Quality Checklist

When implementing or maintaining this command, ensure:

- [ ] **File Reading**: All file read operations have error handling
- [ ] **Data Validation**: All extracted data is validated before use
- [ ] **Error Logging**: All errors include file paths and clear descriptions
- [ ] **Performance**: Command completes in reasonable time for large projects
- [ ] **Consistency**: Multiple runs produce identical results (idempotency)
- [ ] **Formatting**: Tracker file formatting is preserved and consistent
- [ ] **Statistics**: All calculations are accurate and validated
- [ ] **Edge Cases**: Empty files, missing fields, and invalid data are handled

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created update-tracker command for scanning all files and updating the expert reviews tracker with accurate statistics, expert summaries, and file statistics tables.

**Expert**: Jennifer Park  
**Expertise**: Code Quality and Code Review  
**Date**: 2026-01-05  
**Changes**: Enhanced error handling section with comprehensive error scenarios including file reading errors (encoding issues, locked files, directory traversal), review format validation (missing fields, invalid dates, empty expert names), tracker update errors (file locking, permission issues, path validation), and data validation errors (inconsistent statistics, count mismatches). Added "Code Quality Considerations" section covering validation and error handling best practices, performance optimization strategies (batching, caching, parallel processing), code quality standards (maintainability, consistency, testing), and best practices (idempotency, atomicity, backup, validation). Added "Testing Considerations" section with unit test recommendations (file scanning, review extraction, statistics calculation), integration test scenarios (end-to-end workflow, error handling), and edge case coverage (empty projects, special characters, large projects, concurrent access). Added "Code Quality Checklist" section providing actionable checklist for implementation and maintenance. These additions improve the command's reliability, maintainability, and code quality by providing comprehensive error handling, quality standards, and testing guidance.

