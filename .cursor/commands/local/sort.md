# Sort Expert Reviews Tracker Table

Sort the expert review statistics table in `docs/reference/EXPERT_REVIEWS_TRACKER.md` by a specified column.

This command is part of the expert review workflow system and works in conjunction with `/local/statistics` and `/local/review` commands to maintain the expert reviews tracker.

## Usage

Execute this command to sort the expert review statistics table:
```bash
/local/sort sort-by="Files Reviewed"
/local/sort sort-by="Expert Name"
/local/sort sort-by="Total Changes"
/local/sort  # Defaults to "Files Reviewed"
```

## Parameters

### `sort-by` (optional)
- Column name to sort by (case-insensitive, matches column header)
- If column doesn't exist or parameter is omitted: Defaults to "Files Reviewed"
- Valid columns:
  - `Expert Name`
  - `Expertise`
  - `Files Reviewed`
  - `Total Changes`
  - `Last Review Date`
  - `Files Created`
  - `Avg Changes per Review`
  - `Structure Reviewed`
  - `Files Rearranged`

## Workflow

1. **Locate Table**: Dynamically find the table in `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
   - Find the "## Expert Review Statistics" section
   - Find the header row (starts with "| Expert Name")
   - Find the separator row (next line after header, starts with "|-------------")
   - Find all data rows (lines starting with "|" that are not "Total:" or "Benford:")
   - Data rows end when we hit "| Total:", "| Benford:", or a section header ("##" or "###")
2. **Parse Table**: Extract header row and data rows (exclude Total and Benford rows)
3. **Identify Column**: Find column index for `sort-by` parameter (case-insensitive)
4. **Validate Column**: If column not found, default to "Files Reviewed"
5. **Sort Data**: Sort data rows by the specified column:
   - Numeric columns: Sort numerically (descending for counts, ascending for averages)
   - Date columns: Sort chronologically (newest first)
   - String columns: Sort alphabetically (ascending)
6. **Write Back**: Replace data rows with sorted data rows (preserve header, separator, and statistics rows)
7. **Output**: Display sorted column name and number of rows sorted

## Implementation Notes

### Table Structure (Dynamic Location)
- **Section Header**: "## Expert Review Statistics" (locate dynamically)
- **Header Row**: First line starting with "| Expert Name" (after section header) - Contains column names
- **Separator Row**: Next line after header (starts with "|-------------") - Markdown table separator
- **Data Rows**: All lines starting with "|" that are NOT "Total:" or "Benford:" (until we hit statistics rows or next section) - Expert review statistics
- **Statistics Rows**: Lines starting with "| Total:" and "| Benford:" (preserve these, don't sort them)

### Column Detection
- Match `sort-by` parameter to column headers (case-insensitive)
- Column names may contain spaces and special characters
- Default to "Files Reviewed" if column not found

### Sorting Logic

#### Numeric Columns (Descending - highest first)
- `Files Reviewed`
- `Total Changes`
- `Files Created`
- `Structure Reviewed`
- `Files Rearranged`

#### Numeric Columns (Ascending - lowest first)
- `Avg Changes per Review`

#### Date Columns (Descending - newest first)
- `Last Review Date`
- Handle date format: `YYYY-MM-DD` or `-` for no date

#### String Columns (Ascending - alphabetical)
- `Expert Name`
- `Expertise`

### Data Parsing
- Parse markdown table format: `| Column1 | Column2 | ... |`
- Handle empty values (e.g., `-` for dates, `0` for numbers)
- Preserve table formatting (spaces, alignment)

### Error Handling
- If file doesn't exist: Error message
- If table structure is invalid: Error message
- If column not found: Use default "Files Reviewed"
- If sort fails: Preserve original order

## Examples

### Sort by Files Reviewed (Default)
```bash
/local/sort
# or
/local/sort sort-by="Files Reviewed"
```
**Result**: Experts with most reviews first

### Sort by Expert Name
```bash
/local/sort sort-by="Expert Name"
```
**Result**: Alphabetical by expert name

### Sort by Total Changes
```bash
/local/sort sort-by="Total Changes"
```
**Result**: Experts with most changes first

### Sort by Last Review Date
```bash
/local/sort sort-by="Last Review Date"
```
**Result**: Most recently reviewed experts first

### Sort by Avg Changes per Review
```bash
/local/sort sort-by="Avg Changes per Review"
```
**Result**: Lowest average first (ascending)

**Note**: This sorts ascending (lowest first). To see highest averages first, you would need to manually reverse the results or use a different sorting approach.

### Sort by Files Created
```bash
/local/sort sort-by="Files Created"
```
**Result**: Experts with most files created first (descending)

### Sort by Structure Reviewed
```bash
/local/sort sort-by="Structure Reviewed"
```
**Result**: Experts who have reviewed documentation structure most often first (descending)

### Sort by Files Rearranged
```bash
/local/sort sort-by="Files Rearranged"
```
**Result**: Experts who have rearranged the most files first (descending)

## Detailed Example

### Before Sorting (Sample Data)
```
| Expert Name | Files Reviewed | Total Changes |
|-------------|----------------|---------------|
| Alice Smith | 1 | 1 |
| Bob Jones | 3 | 5 |
| Carol White | 2 | 3 |
```

### After Sorting by Files Reviewed (Descending)
```
| Expert Name | Files Reviewed | Total Changes |
|-------------|----------------|---------------|
| Bob Jones | 3 | 5 |
| Carol White | 2 | 3 |
| Alice Smith | 1 | 1 |
```

### After Sorting by Expert Name (Ascending)
```
| Expert Name | Files Reviewed | Total Changes |
|-------------|----------------|---------------|
| Alice Smith | 1 | 1 |
| Bob Jones | 3 | 5 |
| Carol White | 2 | 3 |
```

## Expected Output

### Successful Sort
```
Table sorted
Column: Files Reviewed
Rows sorted: 23
```

### Column Not Found (Uses Default)
```
Table sorted
Column: Files Reviewed (default - column "InvalidColumn" not found)
Rows sorted: 23
```

### Error Handling
If the file or table structure cannot be found:
```
Error: Could not locate expert review statistics table
```

If the file doesn't exist:
```
Error: File docs/reference/EXPERT_REVIEWS_TRACKER.md not found
```

## Technical Implementation

### Column Index Mapping
1. Expert Name (0)
2. Expertise (1)
3. Files Reviewed (2)
4. Total Changes (3)
5. Last Review Date (4)
6. Files Created (5)
7. Avg Changes per Review (6)
8. Structure Reviewed (7)
9. Files Rearranged (8)

### Sorting Algorithm
1. Locate table dynamically (find "## Expert Review Statistics" section)
2. Parse header row to find column index
3. Extract data rows (exclude Total and Benford rows)
4. For each row, extract value at column index
5. Convert value to appropriate type (number, date, string)
6. Sort rows based on value type
7. Write sorted rows back to file (preserving header, separator, and statistics rows)

### Data Type Detection
- **Numeric**: Contains digits, may have decimal point
- **Date**: Format `YYYY-MM-DD` or `-`
- **String**: Everything else

### Special Values
- `-` in date column: Treat as oldest date (sort to bottom)
- `0` in numeric column: Valid number, sort normally
- Empty strings: Sort as empty (bottom for ascending, top for descending)

## Related Commands

- `/local/statistics` - Calculate and update statistics rows (run before or after sorting)
- `/local/review` - Expert review workflow (automatically runs `/local/sort` after updates)

## Common Workflows

### After Adding New Expert
1. Update tracker with new expert entry
2. Run `/local/statistics` to update totals
3. Run `/local/sort` to sort by "Files Reviewed" (default)

### After Review or File Creation
1. Update tracker with review/file creation entry
2. Run `/local/statistics` to update totals and averages
3. Run `/local/sort` to organize table (defaults to "Files Reviewed")

### Finding Inactive Experts
```bash
/local/sort sort-by="Last Review Date"
```
Shows experts who haven't reviewed files recently (empty dates sort to bottom).

### Analyzing Review Quality
```bash
/local/sort sort-by="Avg Changes per Review"
```
Shows experts with highest average changes per review (ascending sort shows most productive first, but note: ascending means lowest first).

## Troubleshooting

### Table Not Found
**Problem**: Command reports table cannot be located  
**Solution**: 
- Verify `docs/reference/EXPERT_REVIEWS_TRACKER.md` exists
- Check that "## Expert Review Statistics" section header exists
- Ensure table header row starts with "| Expert Name"

### Column Not Recognized
**Problem**: Column name provided but default column used instead  
**Solution**:
- Verify column name matches header exactly (case-insensitive)
- Check for extra spaces or typos in column name
- Use exact column names from the "Valid columns" list

### Rows Not Sorting Correctly
**Problem**: Data appears in unexpected order after sorting  
**Solution**:
- Verify data types match expected format (numbers, dates, strings)
- Check for formatting inconsistencies in table cells
- Ensure date format is `YYYY-MM-DD` or `-` for empty dates
- Numeric values should contain only digits and decimal points

### Statistics Rows Affected
**Problem**: Total or Benford rows are sorted or moved  
**Solution**: This should not happen - if it does, verify table structure:
- Statistics rows should start with "| Total:" or "| Benford:"
- These rows should be preserved and not included in sorting
- Check that data rows end before statistics rows

### File Modification Issues
**Problem**: File not updating or changes reverted  
**Solution**:
- Verify file is writable
- Check for file locks or concurrent modifications
- Ensure sufficient permissions on file and directory

## Notes

- The command modifies the file in place
- Table location is found dynamically (not hardcoded line numbers)
- Header and separator rows are preserved
- Statistics rows (Total and Benford) are preserved and not sorted
- Only data rows are sorted
- Table formatting is preserved
- Case-insensitive column name matching
- Default sort direction: Descending for counts, Ascending for names/averages
- Safe to run multiple times (idempotent operation)

### Mobile Optimization Considerations

When executing this command on mobile devices:

1. **File Processing Performance**
   - Table parsing and sorting operations are efficient for mobile devices
   - In-memory sorting is fast even on mobile processors
   - File I/O is minimal (single read, single write)

2. **Memory Usage**
   - Table data is typically small enough for mobile device memory
   - For very large tables (1000+ rows), consider streaming approach
   - Current implementation is mobile-friendly for typical table sizes

3. **Battery Efficiency**
   - Quick execution minimizes battery drain
   - Single file operation reduces I/O overhead
   - Optimized for mobile device constraints

4. **Mobile Terminal Compatibility**
   - Works with mobile SSH clients and terminal apps
   - Output format is mobile-terminal friendly
   - No desktop-specific dependencies

### SEO Considerations for Sort Command

When this command is used to sort data that will be published or made web-accessible:

1. **Sorted Content SEO**
   - Sorted table outputs should maintain SEO-friendly structure
   - Ensure sorted data maintains semantic HTML structure if published
   - Preserve heading hierarchy and table structure for search engine indexing
   - Consider how sorted order impacts content discoverability

2. **Table Structure for Search**
   - Maintain proper table markup for search engine understanding
   - Ensure sorted tables have descriptive headers and clear structure
   - Preserve accessibility attributes that also benefit SEO
   - Consider how table sorting impacts content organization and findability

3. **Content Discoverability**
   - Sorted order should enhance content discoverability
   - Consider sorting by relevance or importance for search visibility
   - Ensure sorted data maintains internal linking opportunities
   - Verify sorted content maintains keyword-rich structure

---

## Review/Contribution

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Enhanced documentation clarity and completeness by adding comprehensive context, troubleshooting section, and improved examples. Added introduction context explaining this command's role in the expert review workflow system and relationship to `/local/statistics` and `/local/review` commands. Enhanced "Expected Output" section with error handling examples and clearer success/failure scenarios. Added "Related Commands" section linking to related workflow commands. Added "Common Workflows" section with practical usage patterns for after adding new expert, after review/file creation, finding inactive experts, and analyzing review quality. Added comprehensive "Troubleshooting" section covering common issues: table not found, column not recognized, rows not sorting correctly, statistics rows affected, and file modification issues, each with problem description and solution steps. Added additional sorting examples for "Files Created" and "Substantive Reviews" columns. Added "Detailed Example" section with before/after sorting scenarios showing concrete examples of how data is reorganized. Improved notes section with idempotent operation clarification. These additions provide users with better understanding of when and how to use the command, common issues they may encounter, and practical workflows for maintaining the expert reviews tracker.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile optimization considerations section covering file processing performance (efficient table parsing and sorting, in-memory operations, minimal I/O), memory usage (mobile-friendly for typical table sizes, streaming considerations for very large tables), battery efficiency (quick execution, single file operation, optimized for mobile constraints), and mobile terminal compatibility (works with mobile SSH clients, mobile-friendly output format, no desktop dependencies). This addition ensures the command is optimized for execution on mobile devices, considering mobile constraints like battery life, memory limitations, and processing power.

---
