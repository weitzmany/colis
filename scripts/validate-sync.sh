#!/bin/bash
# validate-sync.sh
#
# Run before marking any keel/hull/docs/storybook task as complete.
# Verifies that keel-mcp and chartroom both build successfully.
#
# Usage: bash scripts/validate-sync.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"
  if [ "$result" -eq 0 ]; then
    echo "  ✅ $label"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $label"
    FAIL=$((FAIL + 1))
  fi
}

echo ""
echo "=== Colis Sync Validation ==="
echo ""

# 1. Verify keel-mcp builds
echo "→ keel-mcp build..."
(cd "$REPO_ROOT/packages/keel-mcp" && npm run build --silent 2>&1) && R=0 || R=1
check "keel-mcp TypeScript build" $R

# 2. Verify chartroom builds
echo "→ chartroom build..."
(cd "$REPO_ROOT/packages/chartroom" && npm run build --silent 2>&1) && R=0 || R=1
check "chartroom Astro build" $R

# 3. Verify docs feature directories exist for all new packages
echo "→ checking docs feature dirs..."
for pkg in keel hull keel-mcp keel-storybook chartroom; do
  if [ -d "$REPO_ROOT/packages/$pkg" ]; then
    if [ -d "$REPO_ROOT/docs/features/$pkg" ]; then
      check "docs/features/$pkg/ exists" 0
    else
      check "docs/features/$pkg/ exists" 1
    fi
  fi
done

# 4. Verify keel-mcp data files all exist
echo "→ checking keel-mcp data files..."
for f in components.ts tokens.ts examples.ts recipes.ts story-links.ts docs-links.ts; do
  if [ -f "$REPO_ROOT/packages/keel-mcp/src/data/$f" ]; then
    check "keel-mcp/src/data/$f" 0
  else
    check "keel-mcp/src/data/$f" 1
  fi
done

# 5. Verify Storybook config files exist
echo "→ checking storybook config..."
for f in .storybook/main.ts .storybook/preview.ts .storybook/preview-head.html; do
  if [ -f "$REPO_ROOT/packages/keel-storybook/$f" ]; then
    check "keel-storybook/$f" 0
  else
    check "keel-storybook/$f" 1
  fi
done

echo ""
echo "=== Results: $PASS passed, $FAIL failed ==="
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo "Fix the failures above before marking your task complete."
  exit 1
fi

echo "All sync checks passed. Safe to mark task complete."
