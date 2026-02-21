#!/bin/bash
# publish-all.sh
#
# Publishes only changed @colis packages in dependency order.
#
# Change detection uses two signals:
#   1. Git diff  — looks for a version tag (e.g. @colis/rig@1.2.3 or v1.2.3)
#                  and checks if the package directory changed since then.
#   2. Registry  — falls back to comparing local package.json version against
#                  the version currently live in the npm registry.
#
# A package is considered "changed" if:
#   - No version tag exists AND local version differs from the registry, OR
#   - A version tag exists AND files in the package dir changed since that tag, OR
#   - There are uncommitted changes in the package directory.
#
# Usage: bash scripts/publish-all.sh [patch|minor|major] [--dry-run]
#
# Publish order (dependency graph):
#   1. logbook   — no @colis dependencies
#   2. rig        — depends on logbook
#   3. embark     — depends on rig
#   4. deck       — standalone tooling
#   5. shipyard   — standalone tooling
#   6. keel       — no @colis dependencies
#   7. hull       — peer dep on keel
#   8. keel-mcp   — peer dep on keel

RELEASE_TYPE="${1:-patch}"
DRY_RUN=false
for arg in "$@"; do
  if [ "$arg" = "--dry-run" ]; then DRY_RUN=true; fi
done

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACKAGES_DIR="$REPO_ROOT/packages"

if [[ "$RELEASE_TYPE" != "patch" && "$RELEASE_TYPE" != "minor" && "$RELEASE_TYPE" != "major" ]]; then
  echo "Usage: bash scripts/publish-all.sh [patch|minor|major] [--dry-run]"
  exit 1
fi

# ─── Git tag lookup ───────────────────────────────────────────────────────────

# Find the most specific git tag for a given package.
# Tries @colis/name@version, name@version, v version in that order,
# then falls back to the most recent versioned tag for the package.
get_last_tag() {
  local pkg_name="$1"   # e.g. @colis/rig
  local dir_name="$2"   # e.g. rig
  local version="$3"    # current version

  local candidates=(
    "${pkg_name}@${version}"
    "${dir_name}@${version}"
    "v${version}"
    "${version}"
  )

  for tag in "${candidates[@]}"; do
    if git -C "$REPO_ROOT" rev-parse "$tag" &>/dev/null 2>&1; then
      echo "$tag"; return
    fi
  done

  # Try the most recent tag that looks like it belongs to this package
  local latest
  for pattern in "${dir_name}@*" "${pkg_name}@*"; do
    latest=$(git -C "$REPO_ROOT" tag --list "$pattern" --sort=-version:refname 2>/dev/null | head -1)
    if [ -n "$latest" ]; then echo "$latest"; return; fi
  done

  echo ""
}

# ─── Registry version check ───────────────────────────────────────────────────

# Returns the version currently published in the npm registry, or "" if unknown.
registry_version() {
  local pkg_name="$1"
  npm view "$pkg_name" version 2>/dev/null || echo ""
}

# ─── Change detection ─────────────────────────────────────────────────────────

# Outputs a human-readable reason and returns 0 if changed, 1 if up-to-date.
has_changes() {
  local name="$1"
  local dir="$PACKAGES_DIR/$name"

  local pkg_name version
  pkg_name=$(node -e "process.stdout.write(require('$dir/package.json').name)")
  version=$(node -e "process.stdout.write(require('$dir/package.json').version)")

  # Signal 1: uncommitted working-tree changes
  local dirty
  dirty=$(git -C "$REPO_ROOT" status --porcelain "packages/$name/" 2>/dev/null)
  if [ -n "$dirty" ]; then
    echo "uncommitted changes"
    return 0
  fi

  # Signal 2: git tag diff
  local last_tag
  last_tag=$(get_last_tag "$pkg_name" "$name" "$version")

  if [ -n "$last_tag" ]; then
    local changed_files
    changed_files=$(git -C "$REPO_ROOT" diff --name-only "$last_tag" -- "packages/$name/" 2>/dev/null)
    if [ -n "$changed_files" ]; then
      echo "committed changes since $last_tag"
      return 0
    else
      # Tag exists, no git changes → already published at this version
      return 1
    fi
  fi

  # Signal 3: no git tag found — compare against the npm registry
  local reg_ver
  reg_ver=$(registry_version "$pkg_name")

  if [ -z "$reg_ver" ]; then
    echo "not in registry (new package)"
    return 0
  fi

  if [ "$version" != "$reg_ver" ]; then
    echo "local $version ≠ registry $reg_ver"
    return 0
  fi

  # Same version in registry, no uncommitted changes, no tag → assume up to date
  return 1
}

# ─── Scan ─────────────────────────────────────────────────────────────────────

ALL_PACKAGES=(logbook rig embark deck shipyard keel hull keel-mcp)
TO_PUBLISH=()
SKIP_REASONS=()

echo ""
echo "========================================"
if $DRY_RUN; then
  echo " Colis Publish All — DRY RUN (release:$RELEASE_TYPE)"
else
  echo " Colis Publish All — release:$RELEASE_TYPE"
fi
echo " Scanning for changes..."
echo "========================================"
echo ""

for name in "${ALL_PACKAGES[@]}"; do
  dir="$PACKAGES_DIR/$name"

  if [ ! -f "$dir/package.json" ]; then
    SKIP_REASONS+=("$name")
    printf "  ⚪ %-12s — no package.json\n" "$name"
    continue
  fi

  if grep -q '"private": true' "$dir/package.json"; then
    SKIP_REASONS+=("$name")
    printf "  ⚪ %-12s — private\n" "$name"
    continue
  fi

  if ! grep -q "\"release:$RELEASE_TYPE\"" "$dir/package.json"; then
    SKIP_REASONS+=("$name")
    printf "  ⚪ %-12s — no release:$RELEASE_TYPE script\n" "$name"
    continue
  fi

  reason=$(has_changes "$name" 2>&1)
  if [ $? -eq 0 ]; then
    TO_PUBLISH+=("$name")
    printf "  🔄 %-12s — %s\n" "$name" "$reason"
  else
    SKIP_REASONS+=("$name")
    printf "  ✅ %-12s — up to date\n" "$name"
  fi
done

echo ""

if [ ${#TO_PUBLISH[@]} -eq 0 ]; then
  echo "✨ All packages are up to date. Nothing to publish."
  echo ""
  exit 0
fi

version_label="$RELEASE_TYPE bump"
echo "Will publish (${#TO_PUBLISH[@]} packages, $version_label):"
for name in "${TO_PUBLISH[@]}"; do
  echo "  • $name"
done
echo ""

if $DRY_RUN; then
  echo "Dry run — no packages were published."
  exit 0
fi

# ─── Interactive confirmation ─────────────────────────────────────────────────

if [ -t 0 ]; then
  read -r -p "Proceed? [y/N] " confirm
  if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 0
  fi
  echo ""
fi

# ─── Publish ──────────────────────────────────────────────────────────────────

PASS=0
FAIL=0

for name in "${TO_PUBLISH[@]}"; do
  dir="$PACKAGES_DIR/$name"
  echo "📦 Publishing $name ($RELEASE_TYPE)..."
  if (cd "$dir" && npm run "release:$RELEASE_TYPE"); then
    echo "  ✅ $name published"
    PASS=$((PASS + 1))
  else
    echo "  ❌ $name FAILED"
    FAIL=$((FAIL + 1))
    echo ""
    echo "Publish failed for $name. Remaining packages were NOT published:"
    found=false
    for remaining in "${TO_PUBLISH[@]}"; do
      if $found; then echo "  - $remaining (skipped)"; fi
      if [ "$remaining" = "$name" ]; then found=true; fi
    done
    echo ""
    echo "Fix and re-run, or publish manually:"
    echo "  cd packages/$name && npm run release:$RELEASE_TYPE"
    exit 1
  fi
  echo ""
done

echo "========================================"
echo " Done: $PASS published, ${#SKIP_REASONS[@]} skipped, $FAIL failed"
echo "========================================"
echo ""

# ─── Git commit & push ───────────────────────────────────────────────────────

if [ $PASS -gt 0 ]; then
  echo "Committing release changes..."

  # Stage everything release-related so the repo is clean after publish.
  # (Ignores apply via .gitignore.)
  git -C "$REPO_ROOT" add -A

  # Build a commit message listing every published package + new version
  COMMIT_MSG="chore: release $(IFS=', '; echo "${TO_PUBLISH[*]}")"$'\n\n'
  for name in "${TO_PUBLISH[@]}"; do
    version=$(node -e "process.stdout.write(require('$PACKAGES_DIR/$name/package.json').version)")
    COMMIT_MSG+="  - $name@$version"$'\n'
  done

  if git -C "$REPO_ROOT" diff --cached --quiet; then
    echo "ℹ️  Nothing to commit."
  else
    git -C "$REPO_ROOT" commit -m "$COMMIT_MSG"
    git -C "$REPO_ROOT" push --follow-tags
    echo ""
    echo "✅ Changes committed and pushed."
  fi
fi
