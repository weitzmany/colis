# Implement Reviews Command

**Trigger**: `/general/implement-reviews` or `/implement-reviews`

**Purpose**: Read review files for the current project, implement review issues in code, and mark completed review items as done.

---

## Command Overview

This command is targeted for **existing projects** that already have expert reviews under:

`/Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/`

Unlike `/general/implement` (which is PRD-first), this command is **review-first**:

1. Read review findings
2. Implement required fixes/enhancements
3. Verify with tests
4. Mark review issues as done in review docs

---

## Usage

```bash
/general/implement-reviews
```

### Optional Parameters

- `project="<project-id>"` - Force a specific project id instead of auto-detection
- `expert="<name|all>"` - Only process selected reviewer file(s); default is `all`
- `priority="P1|P2|P3|P4|all"` - Limit implementation scope by priority group; default is `all`
- `max="<number>"` - Maximum issues to implement in this run; default is unlimited

### Examples

```bash
# Implement all review issues for current project
/general/implement-reviews

# Implement only security expert review items
/general/implement-reviews expert="sarah-johnson"

# Implement only top priority review items
/general/implement-reviews priority="P1"

# Implement at most 5 review issues
/general/implement-reviews max="5"
```

---

## Workflow

### Step 1: Identify Project

1. Detect current project id from working directory, unless `project` is provided
2. Resolve docs path:
   - `/Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/`
3. Resolve reviews path:
   - `/Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/`

If project docs or reviews directory does not exist: stop with clear error.

### Step 2: Collect Review Files

1. Read all `*.md` files in `reviews/`
2. Exclude generated summary files (for example `IMPLEMENTATION_STATUS.md`)
3. If `expert` is provided:
   - match the requested reviewer file
   - if not found, stop with error

If no review files are found: stop with error.

### Step 3: Extract Actionable Issues

From each review file, extract issues from:

- `## Issues to Address`
- Priority sections (Critical/High/Medium/Low/Trivial)
- Priority groups (`P1`, `P2`, `P3`, `P4`) if present

For each issue, capture:

- issue title
- severity
- business impact / priority
- labels
- location
- recommendation
- current status (if already tracked)

Skip issues already marked as:

- `✅ Done`
- `✅ Completed`
- `🚫 Won't Fix`

### Step 4: Build Implementation Queue

Sort queue by:

1. Priority (`P1` -> `P4`)
2. Severity (1 -> 5)
3. Business impact (`high-impact` first)
4. Review order (older reviews first)

Apply command filters:

- `priority`
- `max`

### Step 5: Implement Issues

For each queued issue:

1. Read referenced files and surrounding context
2. Implement code changes (not recommendations-only)
3. Add or update automated tests for bug fixes/regressions
4. Run relevant validation (tests/lint/typecheck when applicable)
5. Record result:
   - `done` if fully implemented and verified
   - `partial` if some work done but criteria not fully met
   - `blocked` if implementation cannot proceed

### Step 6: Mark Review Items as Done

For each issue marked `done`, update its review file entry with status:

`- **Status**: ✅ Done (YYYY-MM-DD)`

If status line exists, update it.  
If status line does not exist, add it under the issue block.

For `partial` or `blocked`, set:

- `- **Status**: 🔄 Partial (YYYY-MM-DD)`
- `- **Status**: ⏳ Blocked (YYYY-MM-DD)` with short reason

### Step 7: Write Implementation Summary

Create or update:

`/Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/IMPLEMENTATION_STATUS.md`

Include:

- total issues discovered
- done / partial / blocked / skipped counts
- per-review file progress
- list of implemented issues and touched files
- remaining high-priority issues

### Step 8: Output

Print concise execution summary:

- project id
- review files processed
- issues implemented this run
- issues marked done
- issues remaining by priority
- path to `IMPLEMENTATION_STATUS.md`

---

## Error Handling

### No Reviews Found

```text
Error: No review files found for project '<project-id>'.
Expected directory: /Users/yoavweitzman/Documents/packages/docs/projects/<project-id>/reviews/
```

### No Actionable Issues

```text
No actionable review issues found.
All issues are already marked done/completed/won't-fix.
```

### Review Parse Failure

```text
Error: Could not parse issues from review file '<file>'.
Ensure the file uses the standard review sections and issue blocks.
```

---

## Key Principles

1. **Review-first implementation** for mature projects
2. **Implement, do not only suggest**
3. **Every bug fix gets an automated test**
4. **Only mark done after verification**
5. **Keep review files as living status documents**

---

## Related Commands

- `/general/review` - create expert review documents
- `/general/implement` - implement from PRDs and project docs

---

## Review/Contribution

**Created**: 2026-02-18  
**Purpose**: Add a dedicated command for existing projects that implements items from review files and marks completed issues as done directly in review documentation.
