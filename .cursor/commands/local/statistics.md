# Calculate Statistics for Expert Reviews Tracker

Calculate and update statistics rows (Total and Benford's Law MAD scores) in the expert review statistics table.

## Usage

Execute this command to calculate and update statistics:
```bash
/local/statistics
```

No parameters required.

## Workflow

1. **Locate Table**: Dynamically find the table in `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
   - Find the "## Expert Review Statistics" section
   - Find the header row (starts with "| Expert Name")
   - Find the separator row (next line after header, starts with "|-------------")
   - Find all data rows (lines starting with "|" that are not "Total:" or "Benford:")
   - Data rows end when we hit "| Total:", "| Benford:", or a section header ("##" or "###")
2. **Parse Data**: Extract all data rows (exclude Total and Benford rows)
3. **Calculate Total Row**:
   - Sum numeric columns (Files Reviewed, Total Changes, Files Created, Substantive Reviews, Acknowledgment Only)
   - Calculate overall average for "Avg Changes per Review" (Total Changes / Files Reviewed)
   - Find most recent date in "Last Review Date" column
4. **Calculate Benford Row**:
   - Calculate MAD (Mean Absolute Deviation) scores for Benford's Law for numeric columns
   - Skip date columns and average columns
5. **Update Table**: Insert/update Total and Benford rows after the data rows (before Review Details section)
6. **Output**: Display confirmation message

## Statistics Calculations

### Total Row

The "Total:" row provides summary statistics:

- **Expert Name**: "Total:"
- **Expertise**: "" (empty)
- **Files Reviewed**: Sum of all values
- **Total Changes**: Sum of all values
- **Last Review Date**: Most recent date (or "-" if no dates)
- **Files Created**: Sum of all values
- **Avg Changes per Review**: Overall average = Total Changes / Files Reviewed
- **Substantive Reviews**: Sum of all values
- **Acknowledgment Only**: Sum of all values

### Benford's Law MAD Scores

Benford's Law states that in many naturally occurring collections of numbers, the leading digit is likely to be small. The MAD (Mean Absolute Deviation) score measures how well data conforms to Benford's Law.

**Benford's Law Expected Distribution**:
- Digit 1: 30.1%
- Digit 2: 17.6%
- Digit 3: 12.5%
- Digit 4: 9.7%
- Digit 5: 7.9%
- Digit 6: 6.7%
- Digit 7: 5.8%
- Digit 8: 5.1%
- Digit 9: 4.6%

**MAD Calculation**:
1. Extract leading digits from all values in the column (ignore 0)
2. Count frequency of each leading digit (1-9)
3. Calculate observed percentage for each digit
4. Calculate absolute deviation from expected percentage for each digit
5. Calculate mean of absolute deviations (MAD)
6. **Apply MAD Factor**:
   - Find MAX: the largest leading digit that appears in the data
   - Calculate FACTOR = 10 - MAX
   - Final MAD = MAD / FACTOR

**MAD Interpretation**:
- MAD < 0.006: Close conformity (excellent) ✅
- 0.006 ≤ MAD < 0.012: Acceptable conformity (good) ✓
- 0.012 ≤ MAD < 0.015: Marginally acceptable (fair) ⚠️
- MAD ≥ 0.015: Nonconformity (poor) ❌

**Benford Row**:
- **Expert Name**: "Benford:"
- **Expertise**: "" (empty)
- **Files Reviewed**: MAD score with emoji (formatted to 4 decimal places)
- **Total Changes**: MAD score with emoji
- **Last Review Date**: "" (skip - not numeric)
- **Files Created**: MAD score with emoji
- **Avg Changes per Review**: "" (skip - average column)
- **Substantive Reviews**: MAD score with emoji
- **Acknowledgment Only**: MAD score with emoji

**Emoji Mapping**:
- ✅ for MAD < 0.006 (excellent)
- ✓ for 0.006 ≤ MAD < 0.012 (good)
- ⚠️ for 0.012 ≤ MAD < 0.015 (fair)
- ❌ for MAD ≥ 0.015 (poor)

## Implementation Notes

### Table Structure (Dynamic Location)
- **Section Header**: "## Expert Review Statistics" (locate dynamically)
- **Header Row**: First line starting with "| Expert Name" (after section header)
- **Separator Row**: Next line after header (starts with "|-------------")
- **Data Rows**: All lines starting with "|" that are NOT "Total:" or "Benford:" (until we hit statistics rows or next section)
- **Statistics Rows**: Lines starting with "| Total:" and "| Benford:" (located dynamically)
- **Next Section**: First line starting with "##" or "###" after the table (usually "## Review Details" or "### [Expert Name]")

### Column Index Mapping
0. Expert Name (string)
1. Expertise (string)
2. Files Reviewed (numeric)
3. Total Changes (numeric)
4. Last Review Date (date)
5. Files Created (numeric)
6. Avg Changes per Review (average - numeric)
7. Substantive Reviews (numeric)
8. Acknowledgment Only (numeric)

### Data Parsing
- Parse markdown table format: `| Column1 | Column2 | ... |`
- Extract numeric values (handle "-" as 0)
- Extract dates (format: YYYY-MM-DD or "-")
- Handle empty values appropriately

### Leading Digit Extraction
- For each numeric value in a column:
  - Convert to string
  - Remove decimal point and any non-digit characters
  - Extract first non-zero digit
  - If value is 0, skip it
- Example: 2.5 → "25" → "2", 0.5 → "5", 0 → skip

### MAD Calculation Algorithm
```python
def calculate_benford_mad(values):
    # Expected Benford distribution
    expected = {
        1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097,
        5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
    }
    
    # Extract leading digits (skip 0)
    leading_digits = []
    for value in values:
        if value > 0:
            digit = int(str(abs(value)).replace('.', '').lstrip('0')[0])
            if 1 <= digit <= 9:
                leading_digits.append(digit)
    
    if len(leading_digits) == 0:
        return None  # No valid data
    
    # Count frequency
    counts = {i: 0 for i in range(1, 10)}
    for digit in leading_digits:
        counts[digit] += 1
    
    # Calculate observed percentages
    total = len(leading_digits)
    observed = {i: counts[i] / total for i in range(1, 10)}
    
    # Calculate absolute deviations
    deviations = [abs(observed[i] - expected[i]) for i in range(1, 10)]
    
    # Calculate MAD
    mad = sum(deviations) / 9
    
    # Apply MAD Factor
    # Find MAX: the largest leading digit that appears in the data
    max_digit = max(leading_digits)
    # Calculate FACTOR = 10 - MAX
    factor = 10 - max_digit
    # Final MAD = MAD / FACTOR
    final_mad = mad / factor
    
    return final_mad
```

### Date Handling
- Parse dates in format YYYY-MM-DD
- Handle "-" as no date (skip in "most recent" calculation)
- Compare dates to find most recent
- Format result as YYYY-MM-DD or "-" if no dates found

### Average Calculation
- Overall Average = Sum(Total Changes) / Sum(Files Reviewed)
- Handle division by zero (return 0.0 or "-")
- Format to 1 decimal place

## Expected Output

```
Statistics calculated
Total row updated
Benford row updated
```

## Error Handling

- If file doesn't exist: Error message
- If table structure is invalid: Error message
- If no numeric data: Skip Benford calculation (show "-")
- If division by zero: Handle gracefully (show "0.0" or "-")
- If calculation fails: Preserve existing statistics rows

## Notes

- The command modifies the file in place
- Statistics rows are inserted after data rows (before Review Details section)
- If statistics rows already exist, they are updated
- MAD scores are formatted to 4 decimal places
- Only numeric columns (excluding dates and averages) get Benford scores
- Leading digit extraction skips zero values

