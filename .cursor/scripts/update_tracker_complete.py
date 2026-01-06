#!/usr/bin/env python3
"""
Complete Update Expert Reviews Tracker

Scans all files in the project, reads review contributions from each file,
and completely rebuilds the docs/reference/EXPERT_REVIEWS_TRACKER.md file with
accurate statistics, expert summaries, and file statistics tables.
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
EXCLUDE_DIRS = {'node_modules', '.git', '__pycache__', '.venv', 'venv', 'dist', 'build'}

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
    
    # Check if file has "## Review/Contribution" section
    if '## Review/Contribution' not in content:
        return reviews
    
    # Find all expert entries in review sections
    # Pattern: **Expert**: name, optional **Expertise**:, **Date**:, **Changes**: (multi-line)
    # Match changes until next **Expert** or end of section (--- or ##)
    expert_pattern = r'\*\*Expert\*\*:\s*([^\n]+)\s*\n(?:\*\*Expertise\*\*:\s*([^\n]+)\s*\n)?\*\*Date\*\*:\s*(\d{4}-\d{2}-\d{2})\s*\n\*\*Changes\*\*:\s*((?:[^\n]+(?:\n(?!\*\*Expert\*\*:|---|##))?)+)'
    
    expert_matches = re.finditer(expert_pattern, content, re.MULTILINE | re.DOTALL)
    
    for expert_match in expert_matches:
        expert_name = expert_match.group(1).strip()
        expertise = expert_match.group(2).strip() if expert_match.group(2) else "Unknown"
        date = expert_match.group(3).strip()
        changes = expert_match.group(4).strip()
        
        # Only include if this is within a Review/Contribution section
        # Check if there's a "## Review/Contribution" before this match
        match_start = expert_match.start()
        section_start = content.rfind('## Review/Contribution', 0, match_start)
        if section_start == -1:
            continue
        
        # Check if there's a section end (--- or ##) between section start and match
        section_end = content.find('\n---', section_start)
        if section_end == -1:
            section_end = content.find('\n##', section_start + 25)  # Skip the current ##
        if section_end == -1:
            section_end = len(content)
        
        if match_start < section_end:
            reviews.append({
                'expert': expert_name,
                'expertise': expertise,
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
        'expertise': None,
        'reviews': []
    })
    
    for review in all_reviews:
        expert = review['expert']
        file_path = review['file']
        date = review['date']
        expertise = review['expertise']
        
        # Set expertise (use first one found)
        if expert_stats[expert]['expertise'] is None:
            expert_stats[expert]['expertise'] = expertise
        
        expert_stats[expert]['files_reviewed'].add(file_path)
        expert_stats[expert]['total_changes'] += 1
        expert_stats[expert]['reviews'].append(review)
        
        # Update last review date
        if expert_stats[expert]['last_review_date'] is None or date > expert_stats[expert]['last_review_date']:
            expert_stats[expert]['last_review_date'] = date
        
        # Detect file creation (heuristic: if changes mention "Created" or "created")
        changes_lower = review['changes'].lower()
        if ('created' in changes_lower and 'file' in changes_lower) or 'created prd' in changes_lower:
            expert_stats[expert]['files_created'].add(file_path)
        
        # Detect structure review
        if 'structure' in changes_lower or 'reorganization' in changes_lower or 'documentation structure' in changes_lower:
            expert_stats[expert]['structure_reviewed'] += 1
        
        # Detect file rearrangement
        if 'rearranged' in changes_lower or 'moved' in changes_lower or 'reorganized' in changes_lower:
            expert_stats[expert]['files_rearranged'].add(file_path)
    
    return expert_stats


def build_file_statistics(all_reviews):
    """Build file review count statistics."""
    file_counts = defaultdict(int)
    
    for review in all_reviews:
        file_path = review['file']
        file_counts[file_path] += 1
    
    return file_counts


def format_expert_table_row(expert_name, stats):
    """Format a single expert row for the statistics table."""
    files_reviewed = len(stats['files_reviewed'])
    total_changes = stats['total_changes']
    last_date = stats['last_review_date'] or '-'
    files_created = len(stats['files_created'])
    avg_changes = round(total_changes / files_reviewed, 1) if files_reviewed > 0 else 0.0
    structure_reviewed = stats['structure_reviewed']
    files_rearranged = len(stats['files_rearranged'])
    expertise = stats['expertise'] or 'Unknown'
    
    return f"| {expert_name} | {expertise} | {files_reviewed} | {total_changes} | {last_date} | {files_created} | {avg_changes} | {structure_reviewed} | {files_rearranged} |"


def generate_expert_summary(expert_name, stats):
    """Generate expert summary section."""
    lines = []
    lines.append(f"### {expert_name} ({stats['expertise'] or 'Unknown'})")
    lines.append("")
    lines.append(f"- **Total Reviews**: {stats['total_changes']}")
    lines.append(f"- **Files Reviewed**: {len(stats['files_reviewed'])}")
    if stats['files_created']:
        lines.append(f"- **Files Created**: {len(stats['files_created'])}")
        for file_path in sorted(stats['files_created']):
            lines.append(f"  - `{file_path}`")
    if stats['files_rearranged']:
        lines.append(f"- **Files Rearranged**: {len(stats['files_rearranged'])}")
        for file_path in sorted(stats['files_rearranged']):
            lines.append(f"  - `{file_path}`")
    lines.append("")
    lines.append("**Files Reviewed:**")
    for i, review in enumerate(sorted(stats['reviews'], key=lambda x: (x['file'], x['date'])), 1):
        lines.append(f"  {i}. `{review['file']}` ({review['date']})")
        # Add brief description if available
        changes_preview = review['changes'][:100] + "..." if len(review['changes']) > 100 else review['changes']
        lines.append(f"     - {changes_preview}")
    lines.append("")
    return "\n".join(lines)


def update_tracker_file(expert_stats, file_counts):
    """Update the tracker file with complete statistics."""
    # Read current tracker to preserve header and other sections
    try:
        with open(TRACKER_PATH, 'r', encoding='utf-8') as f:
            tracker_content = f.read()
    except Exception as e:
        print(f"Error reading tracker: {e}")
        return False
    
    # Sort experts by files reviewed (descending)
    sorted_experts = sorted(
        expert_stats.items(),
        key=lambda x: (-len(x[1]['files_reviewed']), x[0])
    )
    
    # Generate expert statistics table
    table_lines = []
    table_lines.append("## Expert Review Statistics")
    table_lines.append("")
    table_lines.append("| Expert Name | Expertise | Files Reviewed | Total Changes | Last Review Date | Files Created | Avg Changes per Review | Structure Reviewed | Files Rearranged |")
    table_lines.append("|-------------|-----------|----------------|---------------|------------------|--------------|------------------------|-------------------|-----------------|")
    
    for expert_name, stats in sorted_experts:
        table_lines.append(format_expert_table_row(expert_name, stats))
    
    # Add Total row (will be calculated by /local/statistics)
    table_lines.append("| Total: | | 0 | 0 | - | 0 | 0.0 | 0 | 0 |")
    table_lines.append("| Benford: | | - | - | | - | | - | - |")
    table_lines.append("| Acceptance: | | - | - | | - | | - | - |")
    table_lines.append("")
    
    # Generate files reviewed statistics table
    sorted_files = sorted(file_counts.items(), key=lambda x: (-x[1], x[0]))
    files_table_lines = []
    files_table_lines.append("## Files Reviewed Statistics")
    files_table_lines.append("")
    files_table_lines.append("| File Path | Reviews |")
    files_table_lines.append("|-----------|---------|")
    
    for file_path, count in sorted_files:
        path_escaped = file_path.replace('|', '\\|')
        files_table_lines.append(f"| `{file_path}` | {count} |")
    
    total_reviews = sum(file_counts.values())
    files_table_lines.append(f"| **Total** | **{total_reviews}** |")
    files_table_lines.append("")
    files_table_lines.append("")
    
    # Generate expert summaries
    summary_lines = []
    summary_lines.append("## Expert Review Details")
    summary_lines.append("")
    for expert_name, stats in sorted_experts:
        summary_lines.append(generate_expert_summary(expert_name, stats))
    
    # Generate statistics summary
    stats_summary_lines = []
    stats_summary_lines.append("## Statistics Summary")
    stats_summary_lines.append("")
    stats_summary_lines.append(f"- **Total Experts**: {len(expert_stats)}")
    stats_summary_lines.append(f"- **Total Reviews**: {sum(stats['total_changes'] for stats in expert_stats.values())}")
    stats_summary_lines.append(f"- **Total Files Reviewed**: {len(file_counts)}")
    stats_summary_lines.append(f"- **Total Files Created**: {sum(len(stats['files_created']) for stats in expert_stats.values())}")
    stats_summary_lines.append(f"- **Experts with Reviews**: {len(expert_stats)}")
    stats_summary_lines.append(f"- **Experts without Reviews**: 0")
    
    # Find most active expert
    if expert_stats:
        most_active = max(expert_stats.items(), key=lambda x: len(x[1]['files_reviewed']))
        stats_summary_lines.append(f"- **Most Active Expert**: {most_active[0]} ({len(most_active[1]['files_reviewed'])} reviews)")
    
    # Find most reviewed file
    if file_counts:
        most_reviewed = max(file_counts.items(), key=lambda x: x[1])
        stats_summary_lines.append(f"- **Most Reviewed File**: {most_reviewed[0]} ({most_reviewed[1]} reviews)")
    
    stats_summary_lines.append("")
    
    # Find where to insert new content
    # Preserve header section (before "## Expert Review Statistics")
    header_end = tracker_content.find("## Expert Review Statistics")
    if header_end == -1:
        header_end = tracker_content.find("## ")
        if header_end == -1:
            header_end = 0
    
    # Find end of document (before final "---" and review contribution)
    footer_start = tracker_content.rfind("---")
    if footer_start == -1:
        footer_start = len(tracker_content)
    
    # Check if there's a review contribution section at the end
    review_section = tracker_content.find("## Review/Contribution", footer_start - 200)
    if review_section != -1:
        footer_start = review_section
    
    # Build new content
    header = tracker_content[:header_end].rstrip()
    footer = tracker_content[footer_start:].rstrip()
    
    new_content = "\n".join([
        header,
        "",
        "\n".join(table_lines),
        "\n".join(files_table_lines),
        "\n".join(summary_lines),
        "\n".join(stats_summary_lines),
        footer
    ])
    
    # Write back
    try:
        with open(TRACKER_PATH, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Updated Expert Review Statistics table with {len(expert_stats)} experts")
        print(f"✅ Updated Files Reviewed Statistics table with {len(file_counts)} files")
        print(f"✅ Updated expert summaries for {len(expert_stats)} experts")
        print(f"✅ Updated statistics summary")
        return True
    except Exception as e:
        print(f"Error writing tracker: {e}")
        return False


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
        if reviews:
            print(f"  Found {len(reviews)} review(s) in {file_path}")
    
    print(f"\nFound {len(all_reviews)} total review contributions")
    
    # Build statistics
    expert_stats = build_expert_statistics(all_reviews)
    file_counts = build_file_statistics(all_reviews)
    
    print(f"Found {len(expert_stats)} experts with reviews")
    print(f"Found {len(file_counts)} files with reviews")
    
    # Update tracker
    if update_tracker_file(expert_stats, file_counts):
        print("\n✅ Tracker updated successfully")
    else:
        print("\n❌ Failed to update tracker")


if __name__ == "__main__":
    main()

