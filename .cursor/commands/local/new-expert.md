# New Expert Command

Create and onboard three new expert personas through an approval-driven flow.

## Trigger

`/local/new-expert`

## Purpose

This command suggests exactly **three** new experts:

1. **Development-related expert** (code/design/workflows/compliance/etc.)
2. **Business expert** (**always project-related**)
3. **Potential client persona** (**always project-related**)

The command then asks for approval and creates only the approved experts.  
If one or more are not approved, it must suggest replacements until each slot is approved.

---

## Mandatory Parameter

### `project` (required)

Project identifier. Can be any of:

- project name
- project id
- project slug
- project path

Validation:

- If missing: fail with `Error: project parameter is required`

Examples:

```bash
/local/new-expert project="recipes"
/local/new-expert project="recipes-app"
/local/new-expert project="docs/projects/recipes"
/local/new-expert project="/Users/yoavweitzman/Documents/packages/docs/projects/recipes"
```

---

## Directory Rules

When creating expert files, use these locations:

- **Development experts**: `.cursor/rules/experts/`
- **Business experts**: `.cursor/rules/experts/business/`
- **Client personas**: `.cursor/rules/experts/clients/`

If directories do not exist, create them first:

- `.cursor/rules/experts/business/`
- `.cursor/rules/experts/clients/`

---

## Workflow

### Step 1: Resolve Project Context

1. Parse `project` input (name/id/slug/path)
2. Resolve to canonical project id if possible
3. Read available context from:
   - `docs/projects/<project-id>/`
   - PRD/overview/reviews/reference docs if present
4. If project docs are missing, continue with best-effort context from project name/path

### Step 2: Generate Initial 3 Suggestions

Generate one candidate per required slot:

1. Development expert
2. Business expert (project-specific)
3. Potential client persona (project-specific)

Each suggestion must include:

- proposed expert name
- category (`development`, `business`, `client`)
- expertise title
- short rationale tied to project
- proposed filename + destination folder

### Step 3: Approval Round (Per Expert)

Ask user approval for each of the 3 slots independently.

Allowed outcomes per slot:

- `approved`
- `rejected`
- `needs changes`

User can approve:

- all three at once
- only specific slots (e.g., approve 1 + 3, reject 2)

### Step 4: Re-suggest Until Approved

For every non-approved slot:

1. Generate a new suggestion for that specific slot
2. Keep approved slots locked (do not change them)
3. Repeat approval round for remaining slots only

Loop continues until all 3 slots are approved.

### Step 5: Create Expert Files

After all 3 slots are approved:

1. Create expert files in the correct folders
2. Use project-aware content for business/client experts
3. Include frontmatter and structured sections
4. Include review/contribution block

### Step 6: Output Summary

Return:

- project resolved
- created experts (3)
- created file paths
- which approval rounds were needed

---

## Expert Content Requirements

Each generated expert file must include:

1. `name:` field in frontmatter (persona name)
2. `description` of role and scope
3. clear responsibilities
4. decision/review guidelines
5. project-specific context section (mandatory for business/client)
6. practical checklist
7. review/contribution section with date

---

## Constraints

1. Must always propose exactly 3 experts (one per slot).
2. Slots 2 and 3 must be explicitly project-related.
3. Must not create expert files before approval.
4. Must support per-expert approval and iterative replacement.
5. Must create/use `business` and `clients` expert subfolders.

---

## Error Handling

### Missing project

`Error: project parameter is required`

### Could not create expert folder

`Error: failed to create experts subfolder '<path>'`

### Could not write expert file

`Error: failed to create expert file '<path>'`

---

## Expected Interaction Example

1. Command receives `project="recipes"`
2. Suggests 3 experts (dev/business/client)
3. User approves #1 and #3, rejects #2
4. Command suggests new #2
5. User approves new #2
6. Command creates all three files in:
   - `.cursor/rules/experts/`
   - `.cursor/rules/experts/business/`
   - `.cursor/rules/experts/clients/`

---

## Review/Contribution

**Created**: 2026-02-18  
**Purpose**: Add a project-aware expert creation command with mandatory `project` context, 3 required expert categories, per-expert approval loop, and dedicated business/client expert subfolders.
