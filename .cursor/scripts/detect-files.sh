#!/bin/bash
# detect-files.sh
# Detects all files in current directory (excluding common ignore patterns)
#
# Mobile Optimization Notes:
# - Uses efficient find command with exclusions (mobile-friendly)
# - Minimal I/O operations (single find, single sed, single sort)
# - Works well on mobile devices with slower storage
# - Consider limiting depth for very large projects on mobile: find . -maxdepth 5 -type f ...

set -e

# Get current directory (or use provided directory)
TARGET_DIR="${1:-.}"

# Change to target directory
cd "$TARGET_DIR" || exit 1

# Find all files, excluding common directories and patterns
find . -type f \
  ! -path "./.git/*" \
  ! -path "./node_modules/*" \
  ! -path "./.DS_Store" \
  ! -path "./.cursor/commands/local/.expert_mapping.txt" \
  ! -path "./.cursor/commands/local/.file_mapping.txt" \
  ! -name ".DS_Store" \
  ! -name "*.log" \
  ! -name "*.tmp" \
  | sed 's|^\./||' \
  | sort

# Exit with success
exit 0

