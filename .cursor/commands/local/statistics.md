# Calculate Statistics for Expert Reviews Tracker

Calculate and update statistics rows (Total, Benford's Law MAD scores, and Acceptance p-values) in the expert review statistics table, and update the total row in the files reviewed statistics table.

## Usage

Execute this command to calculate and update statistics:
```bash
/local/statistics
```

No parameters required.

## Workflow

1. **Locate Expert Review Statistics Table**: Dynamically find the table in `docs/reference/EXPERT_REVIEWS_TRACKER.md`:
   - Find the "## Expert Review Statistics" section
   - Find the header row (starts with "| Expert Name")
   - Find the separator row (next line after header, starts with "|-------------")
   - Find all data rows (lines starting with "|" that are not "Total:", "Benford:", or "Acceptance:")
   - Data rows end when we hit "| Total:", "| Benford:", "| Acceptance:", or a section header ("##" or "###")
2. **Parse Expert Data**: Extract all data rows (exclude Total and Benford rows)
3. **Calculate Expert Total Row**:
   - Sum numeric columns (Files Reviewed, Total Changes, Files Created, Structure Reviewed, Files Rearranged)
   - Calculate overall average for "Avg Changes per Review" (Total Changes / Files Reviewed)
   - Find most recent date in "Last Review Date" column
4. **Calculate Expert Benford Row**:
   - Calculate MAD (Mean Absolute Deviation) scores for Benford's Law for numeric columns
   - Skip date columns and average columns
5. **Calculate Expert Acceptance Row**:
   - For each numeric column (excluding dates and averages):
     - K = number of experts (number of rows)
     - N = sum of column values
     - x = minimum value in that column
     - p = P(X ≤ x) where X ~ Binomial(N, 1/K)
   - Format p-values as percentages with emojis based on breakpoints
6. **Update Expert Table**: Insert/update Total, Benford, and Acceptance rows after the data rows (before next section)
7. **Locate Files Reviewed Statistics Table**: Dynamically find the "## Files Reviewed Statistics" section:
   - Find the "## Files Reviewed Statistics" section
   - Find the header row (starts with "| File Path")
   - Find the separator row (next line after header, starts with "|-----------")
   - Find all data rows (lines starting with "|" that are not "**Total**")
   - Data rows end when we hit "| **Total**" or a section header ("##" or "###")
8. **Parse Files Data**: Extract all data rows (exclude Total row)
9. **Calculate Files Total Row**:
   - Sum the "Reviews" column (column index 1)
   - Update or insert "| **Total** | **[sum]** |" row after all data rows
10. **Output**: Display confirmation message

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
- **Structure Reviewed**: Sum of all values
- **Files Rearranged**: Sum of all values

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
- **Structure Reviewed**: MAD score with emoji
- **Files Rearranged**: MAD score with emoji

**Emoji Mapping**:
- ✅ for MAD < 0.006 (excellent)
- ✓ for 0.006 ≤ MAD < 0.012 (good)
- ⚠️ for 0.012 ≤ MAD < 0.015 (fair)
- ❌ for MAD ≥ 0.015 (poor)

### Acceptance Row (Binomial P-Values)

For each numeric column (excluding dates and averages), calculate a binomial p-value to assess how evenly distributed the values are across experts.

**Calculation**:
- **K** = number of experts (number of data rows)
- **N** = sum of all values in the column
- **x** = minimum value in the column
- **p** = P(X ≤ x) where X ~ Binomial(N, 1/K)

This tests the null hypothesis that values are evenly distributed across experts. Lower p-values indicate more uneven distribution.

**Acceptance Row**:
- **Expert Name**: "Acceptance:"
- **Expertise**: "" (empty)
- **Files Reviewed**: p-value with emoji (formatted as percentage)
- **Total Changes**: p-value with emoji
- **Last Review Date**: "" (skip - not numeric)
- **Files Created**: p-value with emoji
- **Avg Changes per Review**: "" (skip - average column)
- **Structure Reviewed**: p-value with emoji
- **Files Rearranged**: p-value with emoji

**Emoji Mapping** (higher p-value is better):
- ✅ for p ≥ 10% (excellent - very even distribution)
- ✓ for 5% ≤ p < 10% (good - reasonably even)
- ⚠️ for 2% ≤ p < 5% (fair - somewhat uneven)
- 🔶 for 1% ≤ p < 2% (poor - uneven distribution)
- ❌ for p < 1% (very poor - highly uneven)

## Implementation Notes

### Table Structure (Dynamic Location)
- **Section Header**: "## Expert Review Statistics" (locate dynamically)
- **Header Row**: First line starting with "| Expert Name" (after section header)
- **Separator Row**: Next line after header (starts with "|-------------")
- **Data Rows**: All lines starting with "|" that are NOT "Total:" or "Benford:" (until we hit statistics rows or next section)
- **Statistics Rows**: Lines starting with "| Total:", "| Benford:", and "| Acceptance:" (located dynamically)
- **Next Section**: First line starting with "##" or "###" after the table (usually "## Review Details" or "### [Expert Name]")

### Column Index Mapping
0. Expert Name (string)
1. Expertise (string)
2. Files Reviewed (numeric)
3. Total Changes (numeric)
4. Last Review Date (date)
5. Files Created (numeric)
6. Avg Changes per Review (average - numeric)
7. Structure Reviewed (numeric)
8. Files Rearranged (numeric)

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
Expert Review Statistics:
  Total row updated
  Benford row updated
  Acceptance row updated
Files Reviewed Statistics:
  Total row updated
```

## Error Handling

- If file doesn't exist: Error message
- If table structure is invalid: Error message
- If no numeric data: Skip Benford calculation (show "-")
- If division by zero: Handle gracefully (show "0.0" or "-")
- If calculation fails: Preserve existing statistics rows

## Notes

- The command modifies the file in place
- Statistics rows are inserted after data rows (before next section)
- If statistics rows already exist, they are updated
- MAD scores are formatted to 4 decimal places
- Only numeric columns (excluding dates and averages) get Benford scores
- Leading digit extraction skips zero values
- Acceptance p-values are calculated using binomial distribution (scipy.stats.binom or equivalent)
- P-values are formatted as percentages with 2 decimal places
- Only numeric columns (excluding dates and averages) get Acceptance p-values
- Files Reviewed Statistics table total is calculated by summing the "Reviews" column
- Files Reviewed Statistics total row format: `| **Total** | **[sum]** |`

### Mobile Optimization Considerations

When executing this command on mobile devices:

1. **Computational Performance**
   - Statistical calculations (Benford's Law, binomial p-values) require CPU processing
   - For large tables, calculations may be slower on mobile processors
   - Consider caching results or optimizing calculation algorithms for mobile

2. **Memory Efficiency**
   - Table data must be loaded into memory for calculations
   - Statistical calculations require additional memory for intermediate values
   - For very large tables, consider streaming or chunked processing

3. **Battery Impact**
   - CPU-intensive statistical calculations drain battery faster
   - Minimize calculation frequency when possible
   - Consider background processing or deferral for mobile devices

4. **Mobile Terminal Compatibility**
   - Works with mobile SSH clients and terminal apps
   - Output format is mobile-terminal friendly
   - Python scripts should work on mobile Python installations

### SEO Considerations for Statistics Command

When this command is used to generate statistics that will be published or made web-accessible:

1. **Statistics Content SEO**
   - Statistics outputs should be SEO-friendly if published
   - Use descriptive, keyword-rich language in statistics summaries
   - Ensure statistics tables maintain proper SEO structure (headings, semantic HTML)
   - Consider search engine discoverability when presenting statistical data

2. **Data Presentation for Search**
   - Statistics should be presented in a way that's valuable for search queries
   - Use clear, descriptive headings and labels for statistical data
   - Ensure statistics contribute to content depth and authority
   - Consider how statistics enhance content value for search engines

3. **Content Quality for SEO**
   - Statistics should demonstrate content quality and depth
   - Ensure statistics answer user search queries about project metrics
   - Verify statistics contribute to topic clusters and content authority
   - Consider keyword optimization in statistics descriptions and labels

---

## Review/Contribution

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile optimization considerations section covering computational performance (CPU processing requirements, mobile processor limitations, optimization opportunities), memory efficiency (in-memory processing, intermediate value storage, streaming considerations), battery impact (CPU-intensive operations, calculation frequency, background processing), and mobile terminal compatibility (mobile SSH clients, output format, Python script compatibility). This addition ensures the command is optimized for execution on mobile devices, considering mobile constraints like battery life, memory limitations, and processing power for statistical calculations.

