#!/usr/bin/env python3
"""
Update Expert Reviews Tracker

Scans all files in the project, reads review contributions from each file,
and updates the docs/reference/EXPERT_REVIEWS_TRACKER.md file with accurate
statistics, expert summaries, and file statistics tables.
"""

import os
import re
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Paths
TRACKER_PATH = "docs/reference/EXPERT_REVIEWS_TRACKER.md"
PROJECT_ROOT = Path(".")

# Exclude directories
EXCLUDE_DIRS = {'node_modules', '.git', '__pycache__', '__pycache__', '.venv', 'venv', 'dist', 'build'}

# File extensions to scan
SCAN_EXTENSIONS = {'.md', '.mdc', '.sh', '.py'}


def find_all_files():
    """Find all files to scan for review contributions."""
    files = []
    for root, dirs, filenames in os.walk(PROJECT_ROOT):
        # Filter out excluded directories
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        
        for filename in filenames:
            file_path = Path(root) / filename
            if file_path.suffix in SCAN_EXTENSIONS:
                # Get relative path
                rel_path = file_path.relative_to(PROJECT_ROOT)
                files.append(str(rel_path))
    
    return sorted(files)


def extract_review_contributions(file_path):
    """Extract review contributions from a file."""
    reviews = []
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception:
        return reviews
    
    # Get file extension
    file_ext = Path(file_path).suffix
    
    # Pattern for markdown review sections
    # Matches: ## Review/Contribution followed by expert info
    pattern = r'##\s+Review/Contribution\s*\n\s*\n\*\*Expert\*\*:\s*([^\n]+)\s*\n\*\*Expertise\*\*:\s*([^\n]+)\s*\n\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})\s*\n\*\*Changes\*\*:\s*([^\n]+(?:\n(?!\*\*|##|---)[^\n]+)*)'
    
    matches = re.finditer(pattern, content, re.MULTILINE | re.DOTALL)
    
    for match in matches:
        expert_name = match.group(1).strip()
        expertise = match.group(2).strip()
        date = match.group(3).strip()
        changes = match.group(4).strip()
        
        reviews.append({
            'expert': expert_name,
            'expertise': expertise,
            'date': date,
            'changes': changes,
            'file': str(file_path)
        })
    
    # Also check for comment-style reviews in scripts
    if file_ext in {'.sh', '.py'}:
        comment_pattern = r'#\s*Review/Contribution\s*\n#\s*Expert:\s*([^\n]+)\s*\n#\s*Date:\s*(\d{4}-\d{2}-\d{2})\s*\n#\s*Changes:\s*([^\n]+(?:\n#(?!\s*Expert|\s*Date|\s*Changes)[^\n]+)*)'
        comment_matches = re.finditer(comment_pattern, content, re.MULTILINE)
        
        for match in comment_matches:
            expert_name = match.group(1).strip()
            date = match.group(2).strip()
            changes = match.group(3).strip()
            
            reviews.append({
                'expert': expert_name,
                'expertise': 'Unknown',  # Scripts may not have expertise
                'date': date,
                'changes': changes,
                'file': str(file_path)
            })
    
    return reviews


def build_expert_statistics(all_reviews):
    """Build expert statistics from all reviews."""
    expert_stats = defaultdict(lambda: {
        'files_reviewed': set(),
        'total_changes': 0,
        'files_created': set(),
        'files_rearranged': set(),
        'structure_reviewed': 0,
        'last_review_date': None,
        'reviews': []
    })
    
    for review in all_reviews:
        expert = review['expert']
        file_path = review['file']
        date = review['date']
        
        expert_stats[expert]['files_reviewed'].add(file_path)
        expert_stats[expert]['total_changes'] += 1
        expert_stats[expert]['reviews'].append(review)
        
        # Update last review date
        if expert_stats[expert]['last_review_date'] is None or date > expert_stats[expert]['last_review_date']:
            expert_stats[expert]['last_review_date'] = date
        
        # Detect file creation (heuristic: if changes mention "Created" or "created")
        if 'created' in review['changes'].lower() and 'file' in review['changes'].lower():
            expert_stats[expert]['files_created'].add(file_path)
        
        # Detect structure review
        if 'structure' in review['changes'].lower() or 'reorganization' in review['changes'].lower():
            expert_stats[expert]['structure_reviewed'] += 1
        
        # Detect file rearrangement
        if 'rearranged' in review['changes'].lower() or 'moved' in review['changes'].lower():
            expert_stats[expert]['files_rearranged'].add(file_path)
    
    return expert_stats


def build_file_statistics(all_reviews):
    """Build file review count statistics."""
    file_counts = defaultdict(int)
    
    for review in all_reviews:
        file_path = review['file']
        file_counts[file_path] += 1
    
    return file_counts


def update_tracker_file(expert_stats, file_counts):
    """Update the tracker file with new statistics."""
    # Read current tracker
    try:
        with open(TRACKER_PATH, 'r', encoding='utf-8') as f:
            tracker_content = f.read()
    except Exception as e:
        print(f"Error reading tracker: {e}")
        return False
    
    # Also read file counts from tracker (source of truth)
    # Extract all file paths from tracker expert sections
    file_pattern = r'^\s+\d+\.\s+`([^`]+)`'
    file_matches = re.findall(file_pattern, tracker_content, re.MULTILINE)
    
    # Count reviews per file from tracker
    tracker_file_counts = defaultdict(int)
    for file_path in file_matches:
        normalized = file_path.lstrip('./')
        tracker_file_counts[normalized] += 1
    
    # Merge: use tracker counts (source of truth) but also include any new reviews found in files
    for file_path, count in file_counts.items():
        if file_path not in tracker_file_counts:
            tracker_file_counts[file_path] = count
        else:
            # Use the higher count (tracker is source of truth)
            tracker_file_counts[file_path] = max(tracker_file_counts[file_path], count)
    
    print(f"Found {len(expert_stats)} experts with reviews in files")
    print(f"Found {len(tracker_file_counts)} files with reviews (from tracker)")
    print(f"Total reviews from files: {sum(len(stats['reviews']) for stats in expert_stats.values())}")
    print(f"Total reviews from tracker: {sum(tracker_file_counts.values())}")
    
    # Update files table using tracker counts (source of truth)
    update_files_table(tracker_content, tracker_file_counts)
    
    return True


def update_files_table(tracker_content, file_counts):
    """Update the Files Reviewed Statistics table in the tracker."""
    # Find the files table section
    files_table_start = tracker_content.find("## Files Reviewed Statistics")
    if files_table_start == -1:
        print("Files Reviewed Statistics section not found")
        return
    
    # Find the end of the files table (next ## section or end of file)
    files_table_end = tracker_content.find("\n## ", files_table_start + 1)
    if files_table_end == -1:
        files_table_end = len(tracker_content)
    
    # Sort files by review count (descending), then alphabetically
    sorted_files = sorted(file_counts.items(), key=lambda x: (-x[1], x[0]))
    
    # Generate new table
    table_lines = ["## Files Reviewed Statistics", ""]
    table_lines.append("| File Path | Reviews |")
    table_lines.append("|-----------|---------|")
    
    for file_path, count in sorted_files:
        path_escaped = file_path.replace('|', '\\|')
        table_lines.append(f"| `{file_path}` | {count} |")
    
    total_reviews = sum(file_counts.values())
    table_lines.append(f"| **Total** | **{total_reviews}** |")
    
    # Replace the table section
    new_table = "\n".join(table_lines) + "\n\n"
    
    # Find the exact boundaries
    table_content_start = tracker_content.find("| File Path | Reviews |", files_table_start)
    if table_content_start == -1:
        return
    
    # Find where the table ends (before next section or end)
    table_end_marker = tracker_content.find("\n\n### ", files_table_end)
    if table_end_marker == -1:
        table_end_marker = tracker_content.find("\n## ", files_table_start + 1)
    if table_end_marker == -1:
        table_end_marker = len(tracker_content)
    
    # Replace
    new_content = (
        tracker_content[:files_table_start] +
        new_table +
        tracker_content[table_end_marker:]
    )
    
    # Write back
    try:
        with open(TRACKER_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated Files Reviewed Statistics table with {len(file_counts)} files")
    except Exception as e:
        print(f"Error writing tracker: {e}")


def read_file_counts_from_tracker():
    """Read file review counts from the tracker (source of truth)."""
    file_counts = defaultdict(int)
    
    try:
        with open(TRACKER_PATH, 'r', encoding='utf-8') as f:
            tracker_content = f.read()
    except Exception as e:
        print(f"Error reading tracker: {e}")
        return file_counts
    
    # Extract all file paths from tracker expert sections
    # Pattern matches: "  1. `file/path.md` (2026-01-05)"
    # Pattern: requires at least one space before number, then number, period, space, backtick, path, backtick
    file_pattern = r'^\s+(\d+)\.\s+`([^`]+)`'
    file_matches = re.findall(file_pattern, tracker_content, re.MULTILINE)
    
    for num, file_path in file_matches:
        # Normalize path: remove leading ./ if present
        # For .cursor files, ensure they start with .cursor (not cursor)
        if file_path.startswith('./'):
            normalized = file_path[2:]  # Remove './'
        elif file_path.startswith('cursor/'):
            # Convert cursor/ to .cursor/
            normalized = '.' + file_path
        else:
            normalized = file_path  # Keep as-is (including leading . for .cursor)
        file_counts[normalized] += 1
    
    print(f"  Extracted {len(file_matches)} file entries from tracker")
    print(f"  Unique files: {len(file_counts)}")
    
    return file_counts


def main():
    """Main function to scan files and update tracker."""
    print("Scanning files for review contributions...")
    
    # Find all files
    all_files = find_all_files()
    print(f"Found {len(all_files)} files to scan")
    
    # Extract reviews from all files
    all_reviews = []
    for file_path in all_files:
        reviews = extract_review_contributions(file_path)
        all_reviews.extend(reviews)
    
    print(f"Found {len(all_reviews)} review contributions in files")
    
    # Build statistics from files
    expert_stats = build_expert_statistics(all_reviews)
    file_counts_from_files = build_file_statistics(all_reviews)
    
    # Read file counts from tracker (source of truth)
    file_counts_from_tracker = read_file_counts_from_tracker()
    print(f"Found {len(file_counts_from_tracker)} files with reviews in tracker")
    
    # Use tracker counts as source of truth
    file_counts = file_counts_from_tracker
    
    # Update tracker
    if update_tracker_file(expert_stats, file_counts):
        print("✅ Tracker updated successfully")
    else:
        print("❌ Failed to update tracker")


if __name__ == "__main__":
    main()

