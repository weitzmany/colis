# Sort Expert Reviews Tracker Table

Sort the expert review statistics table in `docs/reference/EXPERT_REVIEWS_TRACKER.md` by a specified column.

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
  - `Substantive Reviews`
  - `Acknowledgment Only`

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
- `Substantive Reviews`
- `Acknowledgment Only`

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

## Expected Output

```
Table sorted
Column: Files Reviewed
Rows sorted: 21
```

Or if column not found:
```
Table sorted
Column: Files Reviewed (default - column "InvalidColumn" not found)
Rows sorted: 21
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
8. Substantive Reviews (7)
9. Acknowledgment Only (8)

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

## Notes

- The command modifies the file in place
- Table location is found dynamically (not hardcoded line numbers)
- Header and separator rows are preserved
- Statistics rows (Total and Benford) are preserved and not sorted
- Only data rows are sorted
- Table formatting is preserved
- Case-insensitive column name matching
- Default sort direction: Descending for counts, Ascending for names/averages

