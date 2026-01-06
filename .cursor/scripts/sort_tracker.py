#!/usr/bin/env python3
"""
Sort Expert Reviews Tracker table by specified column.
"""

import re
import sys
from pathlib import Path
from datetime import datetime

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
        
        if in_table and line.startswith('| Expert Name'):
            header = line.strip()
            continue
        
        if header and line.startswith('|-------------'):
            separator = line.strip()
            continue
        
        if separator and line.startswith('|'):
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

def get_column_index(header, column_name):
    """Find column index by name (case-insensitive)."""
    columns = parse_row(header)
    for i, col in enumerate(columns):
        if col.lower() == column_name.lower():
            return i
    return None

def extract_value(value_str, col_type):
    """Extract and convert value based on type."""
    value_str = re.sub(r'[✅✓⚠️🔶❌]', '', value_str).strip()
    
    if col_type == 'numeric':
        if not value_str or value_str == '-':
            return 0
        match = re.search(r'[\d.]+', value_str)
        if match:
            return float(match.group())
        return 0
    elif col_type == 'date':
        if not value_str or value_str == '-':
            return None
        try:
            return datetime.strptime(value_str, '%Y-%m-%d')
        except:
            return None
    else:  # string
        return value_str

def get_column_type(column_name):
    """Determine column type for sorting."""
    numeric_desc = ['Files Reviewed', 'Total Changes', 'Files Created', 'Structure Reviewed', 'Files Rearranged']
    numeric_asc = ['Avg Changes per Review']
    date_desc = ['Last Review Date']
    
    if column_name in numeric_desc:
        return ('numeric', 'desc')
    elif column_name in numeric_asc:
        return ('numeric', 'asc')
    elif column_name in date_desc:
        return ('date', 'desc')
    else:
        return ('string', 'asc')

def sort_data_rows(data_rows, column_idx, col_type, sort_order):
    """Sort data rows by specified column."""
    def sort_key(row):
        cols = parse_row(row[1])
        if len(cols) <= column_idx:
            if col_type == 'numeric':
                return 0 if sort_order == 'desc' else float('inf')
            elif col_type == 'date':
                return datetime.min if sort_order == 'desc' else datetime.max
            else:
                return '' if sort_order == 'asc' else 'zzz'
        
        value = extract_value(cols[column_idx], col_type)
        
        if col_type == 'date' and value is None:
            return datetime.min if sort_order == 'desc' else datetime.max
        if col_type == 'numeric' and value == 0 and sort_order == 'desc':
            return -1
        
        return value
    
    sorted_rows = sorted(data_rows, key=sort_key, reverse=(sort_order == 'desc'))
    return sorted_rows

def main():
    # Get sort column from command line (default: "Files Reviewed")
    sort_by = sys.argv[1] if len(sys.argv) > 1 else "Files Reviewed"
    
    tracker_path = Path('docs/reference/EXPERT_REVIEWS_TRACKER.md')
    
    if not tracker_path.exists():
        print('Error: EXPERT_REVIEWS_TRACKER.md not found', file=sys.stderr)
        sys.exit(1)
    
    with open(tracker_path, 'r') as f:
        lines = f.readlines()
    
    header, separator, data_rows, stats_rows = parse_table(lines)
    
    if not header:
        print('Error: Could not locate expert review statistics table', file=sys.stderr)
        sys.exit(1)
    
    if not data_rows:
        print('Error: No data rows found', file=sys.stderr)
        sys.exit(1)
    
    # Find column index
    column_idx = get_column_index(header, sort_by)
    if column_idx is None:
        # Default to "Files Reviewed"
        column_idx = get_column_index(header, "Files Reviewed")
        if column_idx is None:
            print('Error: Could not find column', file=sys.stderr)
            sys.exit(1)
        sort_by = "Files Reviewed"
    
    # Get column type and sort order
    col_type, sort_order = get_column_type(sort_by)
    
    # Sort data rows
    sorted_rows = sort_data_rows(data_rows, column_idx, col_type, sort_order)
    
    # Rebuild file with sorted rows
    new_lines = lines[:]
    
    # Replace data rows with sorted rows
    for i, (orig_idx, _) in enumerate(data_rows):
        new_lines[orig_idx] = sorted_rows[i][1] + '\n'
    
    # Write back
    with open(tracker_path, 'w') as f:
        f.writelines(new_lines)
    
    print('Table sorted')
    print(f'Column: {sort_by}')
    print(f'Rows sorted: {len(sorted_rows)}')

if __name__ == '__main__':
    main()

