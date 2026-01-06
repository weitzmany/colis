#!/bin/bash
# scan-projects.sh
# Scans other projects in parent directory for new/missed items worth bringing in
#
# Mobile Optimization Notes:
# - Uses multiple find operations (may be slower on mobile storage)
# - Consider caching results for mobile devices
# - Output to stderr for progress, stdout for findings (mobile-terminal friendly)
# - May be resource-intensive on mobile - consider limiting project scan depth

set -e

# Get current project directory
CURRENT_PROJECT="$(basename "$(pwd)")"
PARENT_DIR="$(dirname "$(pwd)")"

echo "🔍 Scanning projects in: $PARENT_DIR" >&2
echo "📦 Current project: $CURRENT_PROJECT" >&2
echo "" >&2

# Check if parent directory exists
if [ ! -d "$PARENT_DIR" ]; then
  echo "❌ Parent directory not found: $PARENT_DIR" >&2
  exit 1
fi

# Find all directories in parent (potential projects)
PROJECTS=$(find "$PARENT_DIR" -maxdepth 1 -type d ! -path "$PARENT_DIR" ! -path "$(pwd)")

FINDINGS=()

# Scan each project
for PROJECT in $PROJECTS; do
  PROJECT_NAME=$(basename "$PROJECT")
  
  # Skip current project
  if [ "$PROJECT_NAME" = "$CURRENT_PROJECT" ]; then
    continue
  fi
  
  echo "📂 Scanning: $PROJECT_NAME" >&2
  
  # Check for Cursor rules
  if [ -d "$PROJECT/.cursor/rules" ]; then
    # Check for expert personas
    if [ -d "$PROJECT/.cursor/rules/experts" ]; then
      EXPERTS=$(find "$PROJECT/.cursor/rules/experts" -name "*.mdc" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$EXPERTS" -gt 0 ]; then
        FINDINGS+=("expert:$PROJECT_NAME:$EXPERTS expert personas found")
      fi
    fi
    
    # Check for user rules
    if [ -d "$PROJECT/.cursor/rules/user" ]; then
      RULES=$(find "$PROJECT/.cursor/rules/user" -name "*.mdc" 2>/dev/null | wc -l | tr -d ' ')
      if [ "$RULES" -gt 0 ]; then
        FINDINGS+=("rule:$PROJECT_NAME:$RULES user rules found")
      fi
    fi
  fi
  
  # Check for Cursor commands
  if [ -d "$PROJECT/.cursor/commands" ]; then
    COMMANDS=$(find "$PROJECT/.cursor/commands" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$COMMANDS" -gt 0 ]; then
      FINDINGS+=("command:$PROJECT_NAME:$COMMANDS commands found")
    fi
  fi
  
  # Check for scripts
  if [ -d "$PROJECT/.cursor/scripts" ] || [ -d "$PROJECT/scripts" ]; then
    SCRIPTS=0
    if [ -d "$PROJECT/.cursor/scripts" ]; then
      SCRIPTS=$((SCRIPTS + $(find "$PROJECT/.cursor/scripts" -type f 2>/dev/null | wc -l | tr -d ' ')))
    fi
    if [ -d "$PROJECT/scripts" ]; then
      SCRIPTS=$((SCRIPTS + $(find "$PROJECT/scripts" -type f 2>/dev/null | wc -l | tr -d ' ')))
    fi
    if [ "$SCRIPTS" -gt 0 ]; then
      FINDINGS+=("script:$PROJECT_NAME:$SCRIPTS scripts found")
    fi
  fi
  
  # Check for documentation patterns
  if [ -d "$PROJECT/docs" ]; then
    DOCS=$(find "$PROJECT/docs" -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
    if [ "$DOCS" -gt 0 ]; then
      FINDINGS+=("doc:$PROJECT_NAME:$DOCS documentation files found")
    fi
  fi
  
  # Check for configuration files
  if [ -f "$PROJECT/package.json" ] || [ -f "$PROJECT/tsconfig.json" ] || [ -f "$PROJECT/docker-compose.yml" ]; then
    CONFIGS=0
    [ -f "$PROJECT/package.json" ] && CONFIGS=$((CONFIGS + 1))
    [ -f "$PROJECT/tsconfig.json" ] && CONFIGS=$((CONFIGS + 1))
    [ -f "$PROJECT/docker-compose.yml" ] && CONFIGS=$((CONFIGS + 1))
    FINDINGS+=("config:$PROJECT_NAME:$CONFIGS configuration files found")
  fi
done

# Output findings (one per line, format: type:project:count:description)
if [ ${#FINDINGS[@]} -eq 0 ]; then
  echo "✅ No new items found in other projects" >&2
  exit 0
fi

# Output findings to stdout (for parsing by command)
for FINDING in "${FINDINGS[@]}"; do
  echo "$FINDING"
done

# Summary to stderr
echo "" >&2
echo "📊 Summary: Found ${#FINDINGS[@]} potential items across projects" >&2

exit 0

