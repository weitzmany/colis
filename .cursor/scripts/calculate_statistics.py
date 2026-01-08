#!/usr/bin/env python3
"""
Calculate statistics for Expert Reviews Tracker.
Updates Total, Benford, and Acceptance rows.

Mobile Optimization Notes:
- CPU-intensive statistical calculations (Benford's Law, binomial p-values)
- For large tables, calculations may be slower on mobile processors
- Memory usage is reasonable for typical table sizes
- Consider optimizing calculations or caching results for mobile devices
"""

import re
import sys
from pathlib import Path
from math import comb, pow

def parse_table(lines):
    """Parse markdown table and extract data rows."""
    header = None
    separator = None
    data_rows = []
    stats_rows = {'total': None, 'benford': None, 'acceptance': None}
    
    in_table = False
    for i, line in enumerate(lines):
        if line.startswith('## Expert Review Statistics'):
            in_table = True
            continue
        
        # Stop if we hit a new section (after starting the table)
        if in_table and line.startswith('##') and not line.startswith('## Expert Review Statistics'):
            break
        
        if in_table and line.startswith('| Expert Name'):
            header = line.strip()
            continue
        
        if header and line.startswith('|-------------'):
            separator = line.strip()
            continue
        
        if separator and line.startswith('|'):
            # Stop if we hit a new section
            if line.startswith('##') or line.startswith('###'):
                break
            if line.startswith('| Total:'):
                stats_rows['total'] = (i, line.strip())
            elif line.startswith('| Benford:'):
                stats_rows['benford'] = (i, line.strip())
            elif line.startswith('| Acceptance:'):
                stats_rows['acceptance'] = (i, line.strip())
            elif not any(line.startswith(f'| {stat}:') for stat in ['Total', 'Benford', 'Acceptance']):
                if not line.startswith('##') and not line.startswith('###'):
                    data_rows.append((i, line.strip()))
    
    return header, separator, data_rows, stats_rows

def parse_row(row_str):
    """Parse a table row into columns."""
    parts = [p.strip() for p in row_str.split('|')[1:-1]]
    return parts

def extract_numeric(value_str):
    """Extract numeric value from string, handling emojis and formatting."""
    # Remove emojis and extract number
    value_str = re.sub(r'[✅✓⚠️🔶❌]', '', value_str).strip()
    if not value_str or value_str == '-':
        return 0
    try:
        # Extract first number (before any space or %)
        match = re.search(r'[\d.]+', value_str)
        if match:
            return float(match.group())
        return 0
    except:
        return 0

def calculate_total_row(data_rows):
    """Calculate Total row from data rows."""
    if not data_rows:
        return None
    
    columns = [parse_row(row[1]) for row in data_rows]
    num_cols = len(columns[0])
    
    result = ['Total:', '']
    
    # Files Reviewed (col 2), Total Changes (col 3), Files Created (col 5), Structure Reviewed (col 7), Files Rearranged (col 8)
    numeric_cols = [2, 3, 5, 7, 8]
    date_col = 4
    avg_col = 6
    
    files_reviewed_sum = 0
    total_changes_sum = 0
    
    for col_data in columns:
        if len(col_data) > 2:
            files_reviewed_sum += extract_numeric(col_data[2])
        if len(col_data) > 3:
            total_changes_sum += extract_numeric(col_data[3])
    
    # Calculate averages and sums
    # Start with ['Total:', ''] for columns 0 and 1, then add columns 2-8
    for col_idx in range(2, num_cols):
        if col_idx == date_col:  # Last Review Date
            # Find most recent date
            dates = [parse_row(row[1])[date_col] for row in data_rows if len(parse_row(row[1])) > date_col]
            valid_dates = [d for d in dates if d and d != '-']
            result.append(valid_dates[-1] if valid_dates else '-')
        elif col_idx == avg_col:  # Avg Changes per Review
            avg = total_changes_sum / files_reviewed_sum if files_reviewed_sum > 0 else 0.0
            result.append(f'{avg:.2f}')
        elif col_idx in numeric_cols:
            col_sum = sum(extract_numeric(parse_row(row[1])[col_idx]) for row in data_rows if len(parse_row(row[1])) > col_idx)
            result.append(str(int(col_sum)))
        else:
            result.append('')
    
    # Join with standard markdown table format: | col1 | col2 | col3 |
    # Use single space around pipes to match data row format
    row_str = ' | '.join(result)
    # Fix double spaces that occur when empty strings are between separators
    import re
    row_str = re.sub(r' \|  \| ', ' | | ', row_str)
    return '| ' + row_str + ' |'

def calculate_benford_mad(values):
    """Calculate Benford's Law MAD score."""
    expected = {
        1: 0.301, 2: 0.176, 3: 0.125, 4: 0.097,
        5: 0.079, 6: 0.067, 7: 0.058, 8: 0.051, 9: 0.046
    }
    
    leading_digits = []
    for value in values:
        if value > 0:
            digit_str = str(abs(value)).replace('.', '').lstrip('0')
            if digit_str:
                digit = int(digit_str[0])
                if 1 <= digit <= 9:
                    leading_digits.append(digit)
    
    if len(leading_digits) == 0:
        return None
    
    counts = {i: 0 for i in range(1, 10)}
    for digit in leading_digits:
        counts[digit] += 1
    
    total = len(leading_digits)
    observed = {i: counts[i] / total for i in range(1, 10)}
    
    deviations = [abs(observed[i] - expected[i]) for i in range(1, 10)]
    mad = sum(deviations) / 9
    
    max_digit = max(leading_digits)
    factor = 10 - max_digit
    final_mad = mad / factor
    
    return final_mad

def get_mad_emoji(mad):
    """Get emoji for MAD score."""
    if mad is None:
        return '❌'
    if mad < 0.006:
        return '✅'
    elif mad < 0.012:
        return '✓'
    elif mad < 0.015:
        return '⚠️'
    else:
        return '❌'

def calculate_benford_row(data_rows):
    """Calculate Benford row from data rows."""
    if not data_rows:
        return None
    
    columns = [parse_row(row[1]) for row in data_rows]
    num_cols = len(columns[0])
    
    result = ['Benford:', '']
    
    numeric_cols = [2, 3, 5, 7, 8]  # Files Reviewed, Total Changes, Files Created, Structure Reviewed, Files Rearranged
    date_col = 4
    avg_col = 6
    
    # Start with ['Benford:', ''] for columns 0 and 1, then add columns 2-8
    for col_idx in range(2, num_cols):
        if col_idx == date_col or col_idx == avg_col:
            result.append('')
        elif col_idx in numeric_cols:
            values = [extract_numeric(col[col_idx]) for col in columns if len(col) > col_idx]
            mad = calculate_benford_mad(values)
            if mad is not None:
                emoji = get_mad_emoji(mad)
                result.append(f'{emoji} {mad:.4f}')
            else:
                result.append('❌ -')
        else:
            result.append('')
    
    # Join with standard markdown table format: | col1 | col2 | col3 |
    # Use single space around pipes to match data row format
    row_str = ' | '.join(result)
    # Fix double spaces that occur when empty strings are between separators
    import re
    row_str = re.sub(r' \|  \| ', ' | | ', row_str)
    return '| ' + row_str + ' |'

def binomial_cdf(x, n, p):
    """Calculate binomial CDF: P(X ≤ x) where X ~ Binomial(n, p)."""
    if n < 0 or x < 0 or p < 0 or p > 1:
        return None
    
    n_int = int(n)
    x_int = int(x)
    
    cdf = 0.0
    for i in range(x_int + 1):
        try:
            # C(n,i) * p^i * (1-p)^(n-i)
            if i <= n_int:
                cdf += comb(n_int, i) * pow(p, i) * pow(1 - p, n_int - i)
        except (ValueError, OverflowError):
            # Handle edge cases
            if i == 0:
                cdf += pow(1 - p, n_int)
            elif i == n_int:
                cdf += pow(p, n_int)
    
    return cdf

def calculate_acceptance_pvalue(values, k):
    """Calculate binomial p-value for acceptance test."""
    if not values or k <= 0:
        return None
    
    n = sum(values)
    if n == 0:
        return None
    
    x = min(values)
    
    # P(X ≤ x) where X ~ Binomial(N, 1/K)
    p = 1.0 / k
    p_value = binomial_cdf(x, n, p)
    
    return p_value

def get_acceptance_emoji(p_value):
    """Get emoji for acceptance p-value (higher is better)."""
    if p_value is None:
        return '❌'
    p_percent = p_value * 100
    if p_percent >= 10:
        return '✅'
    elif p_percent >= 5:
        return '✓'
    elif p_percent >= 2:
        return '⚠️'
    elif p_percent >= 1:
        return '🔶'
    else:
        return '❌'

def calculate_acceptance_row(data_rows):
    """Calculate Acceptance row from data rows."""
    if not data_rows:
        return None
    
    k = len(data_rows)  # Number of experts
    columns = [parse_row(row[1]) for row in data_rows]
    num_cols = len(columns[0])
    
    result = ['Acceptance:', '']
    
    numeric_cols = [2, 3, 5, 7, 8]  # Files Reviewed, Total Changes, Files Created, Structure Reviewed, Files Rearranged
    date_col = 4
    avg_col = 6
    
    # Start with ['Acceptance:', ''] for columns 0 and 1, then add columns 2-8
    for col_idx in range(2, num_cols):
        if col_idx == date_col or col_idx == avg_col:
            result.append('')
        elif col_idx in numeric_cols:
            values = [extract_numeric(col[col_idx]) for col in columns if len(col) > col_idx]
            p_value = calculate_acceptance_pvalue(values, k)
            if p_value is not None:
                emoji = get_acceptance_emoji(p_value)
                p_percent = p_value * 100
                result.append(f'{emoji} {p_percent:.2f}%')
            else:
                result.append('❌ -')
        else:
            result.append('')
    
    # Join with standard markdown table format: | col1 | col2 | col3 |
    # Use single space around pipes to match data row format
    row_str = ' | '.join(result)
    # Fix double spaces that occur when empty strings are between separators
    import re
    row_str = re.sub(r' \|  \| ', ' | | ', row_str)
    return '| ' + row_str + ' |'

def main():
    tracker_path = Path('docs/reference/EXPERT_REVIEWS_TRACKER.md')
    
    if not tracker_path.exists():
        print('Error: EXPERT_REVIEWS_TRACKER.md not found', file=sys.stderr)
        sys.exit(1)
    
    with open(tracker_path, 'r') as f:
        lines = f.readlines()
    
    header, separator, data_rows, stats_rows = parse_table(lines)
    
    if not data_rows:
        print('Error: No data rows found', file=sys.stderr)
        sys.exit(1)
    
    # Calculate statistics rows
    total_row = calculate_total_row(data_rows)
    benford_row = calculate_benford_row(data_rows)
    acceptance_row = calculate_acceptance_row(data_rows)
    
    # Update or insert statistics rows
    new_lines = lines[:]
    
    # Remove existing statistics rows (from anywhere in the file)
    indices_to_remove = []
    for stat_type, stat_data in stats_rows.items():
        if stat_data:
            indices_to_remove.append(stat_data[0])
    
    # Also search for statistics rows that might be in wrong location
    for i, line in enumerate(new_lines):
        if line.strip().startswith('| Total:') or line.strip().startswith('| Benford:') or line.strip().startswith('| Acceptance:'):
            if i not in indices_to_remove:
                indices_to_remove.append(i)
    
    # Remove statistics rows (in reverse order to maintain indices)
    for idx in sorted(indices_to_remove, reverse=True):
        if idx < len(new_lines):
            new_lines.pop(idx)
    
    # Find the correct insertion point: after last data row
    # Use the original last_data_idx from data_rows, but adjust for removed lines
    last_data_idx = data_rows[-1][0] if data_rows else None
    
    # Adjust for removed lines (count how many lines were removed before last_data_idx)
    removed_before = sum(1 for idx in indices_to_remove if idx < last_data_idx)
    last_data_idx = last_data_idx - removed_before if last_data_idx is not None else None
    
    # If we still can't find it, search for it in new_lines
    if last_data_idx is None or last_data_idx >= len(new_lines):
        # Find last data row by searching from Expert Review Statistics section
        for i, line in enumerate(new_lines):
            if line.strip().startswith('## Expert Review Statistics'):
                # Found section start, now find last data row
                last_found = None
                for j in range(i + 1, min(len(new_lines), i + 100)):
                    if new_lines[j].strip().startswith('|') and not new_lines[j].strip().startswith('|-------------'):
                        # Check if it's a data row (not a section header, not Total/Benford/Acceptance)
                        line_stripped = new_lines[j].strip()
                        if (not line_stripped.startswith('##') and 
                            not line_stripped.startswith('###') and
                            not line_stripped.startswith('| Total:') and
                            not line_stripped.startswith('| Benford:') and
                            not line_stripped.startswith('| Acceptance:') and
                            not line_stripped.startswith('| Expert Name')):
                            last_found = j
                            # Check if next non-blank line is a section header
                            for k in range(j + 1, min(len(new_lines), j + 10)):
                                next_line_stripped = new_lines[k].strip()
                                if next_line_stripped:
                                    if next_line_stripped.startswith('##') or next_line_stripped.startswith('###'):
                                        last_data_idx = j
                                        break
                                    # If we hit another data row, this isn't the last one
                                    if next_line_stripped.startswith('|') and not next_line_stripped.startswith('|-------------'):
                                        break
                            if last_data_idx is not None:
                                break
                # If we found a data row but didn't find a section header after it, use the last found
                if last_data_idx is None and last_found is not None:
                    last_data_idx = last_found
                break
    
    # Fallback: if we still can't find it, search for "## Files Reviewed Statistics" and work backwards
    if last_data_idx is None:
        for i, line in enumerate(new_lines):
            if line.strip().startswith('## Files Reviewed Statistics'):
                # Work backwards to find last data row
                for j in range(i - 1, max(0, i - 50), -1):
                    if new_lines[j].strip().startswith('|') and not new_lines[j].strip().startswith('|-------------'):
                        line_stripped = new_lines[j].strip()
                        if (not line_stripped.startswith('##') and 
                            not line_stripped.startswith('###') and
                            not line_stripped.startswith('| Total:') and
                            not line_stripped.startswith('| Benford:') and
                            not line_stripped.startswith('| Acceptance:') and
                            not line_stripped.startswith('| Expert Name')):
                            last_data_idx = j
                            break
                break
    
    # If we found the last data row, insert after it
    if last_data_idx is not None:
        insert_idx = last_data_idx + 1
        
        # Skip blank lines after last data row - statistics should be directly connected to table
        while insert_idx < len(new_lines) and not new_lines[insert_idx].strip():
            # Remove blank lines - we want statistics directly after data rows
            new_lines.pop(insert_idx)
            # Don't increment insert_idx since we removed a line
        
        # Insert statistics rows directly after last data row (no blank line)
        if total_row:
            new_lines.insert(insert_idx, total_row + '\n')
            insert_idx += 1
        if benford_row:
            new_lines.insert(insert_idx, benford_row + '\n')
            insert_idx += 1
        if acceptance_row:
            new_lines.insert(insert_idx, acceptance_row + '\n')
            insert_idx += 1
        
        # Add blank line after stats (before next section)
        if insert_idx < len(new_lines) and new_lines[insert_idx].strip() and not new_lines[insert_idx].startswith('##'):
            new_lines.insert(insert_idx, '\n')
        elif insert_idx < len(new_lines) and new_lines[insert_idx].startswith('##'):
            # Add blank line before section header
            new_lines.insert(insert_idx, '\n')
    
    # Update Files Reviewed Statistics table total
    files_total_updated = False
    for i, line in enumerate(new_lines):
        if line.strip().startswith('| **Total**'):
            # Extract current total if present
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) >= 2:
                # Find the Files Reviewed Statistics section
                files_section_start = None
                for j in range(i, max(0, i-100), -1):
                    if new_lines[j].strip().startswith('## Files Reviewed Statistics'):
                        files_section_start = j
                        break
                
                if files_section_start is not None:
                    # Find all data rows in Files Reviewed Statistics table
                    files_total = 0
                    for j in range(files_section_start, min(len(new_lines), files_section_start + 200)):
                        if new_lines[j].strip().startswith('| `') and not new_lines[j].strip().startswith('| **Total**'):
                            # Extract review count (second column)
                            parts = [p.strip() for p in new_lines[j].split('|')[1:-1]]
                            if len(parts) >= 2:
                                try:
                                    count = int(parts[1])
                                    files_total += count
                                except ValueError:
                                    pass
                    
                    # Update the total row
                    new_lines[i] = f'| **Total** | **{files_total}** |\n'
                    files_total_updated = True
                    break
    
    # Write back
    with open(tracker_path, 'w') as f:
        f.writelines(new_lines)
    
    print('Statistics calculated')
    print('Expert Review Statistics:')
    print('  Total row updated')
    print('  Benford row updated')
    print('  Acceptance row updated')
    if files_total_updated:
        print('Files Reviewed Statistics:')
        print('  Total row updated')
    else:
        print('Files Reviewed Statistics:')
        print('  Total row not found or already updated')

if __name__ == '__main__':
    main()

