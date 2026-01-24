# Project Selection Criteria

**Status**: Planning / Final  
**Last Updated**: 2026-01-05

## Purpose

Defines the initial criteria for:

1. **Selecting a new project idea**
2. **Selecting the least valuable project to remove**

These criteria are the first draft and will be reviewed and refined by the user.

## New Project Criteria

### Primary Requirements

- **Customer-Facing**: Preferable (end users, not developer tooling)
- **High Value**: Clear, tangible benefit (saves money, time, or reduces risk)
- **Practical & Frequent Use**: Ongoing use, not one-time utility
- **Full-Stack Scope**: Includes frontend, backend, and mobile
- **Distinct from Existing Projects**: Not a duplicate or minor variation
- **Low Coupling**: Avoids centralized infrastructure risks

### Value Signals (OR-Based)

At least **one** of the following must be true:

- **Fun for the customer**
- **Helps the customer learn something**
- **Makes money for the owner**
- **Saves money for the owner**
- **Makes money for the customer**
- **Saves money for the customer**

### Preferred Signals

 - **Measurable outcomes** (savings, reminders, compliance, safety)
 - **Strong retention potential** (recurring value)
 - **Integrates cleanly** with existing projects without coupling
 - **Clear business model** potential (subscription, tiered)
 - **Simple onboarding** (value in first session)
 - **Clear primary user** (single, obvious target audience)

### Exclusions

- Centralized infrastructure that creates single points of failure
- Developer-only tooling projects
- Projects already in `docs/projects/`
 - Ideas on the avoid list in `docs/reference/PROJECT_IDEAS_AVOID.md`
- Example: Developer CLI suite belongs as a package or feature, not a project

### Scoring Heuristic (Quick Triage)

Use a simple 1–5 score for each category:

1. **Customer Value** (saves money/time, reduces risk)
2. **Retention Potential** (weekly/monthly use)
3. **Clarity** (clear target user + core workflow)
4. **Differentiation** (not redundant)
5. **Feasibility** (reasonable scope for v1)

**Target score**: 18+ to qualify.

### Tie‑Breakers

If multiple ideas qualify, prefer:

1. **Higher measurable savings**
2. **Broader target audience**
3. **Simpler MVP**
4. **Cleaner integration** with existing projects

### Required Checks Before Suggesting

- Confirm the idea is **not** in `PROJECT_IDEAS_AVOID.md`
- Confirm it does **not** duplicate an existing project in `docs/projects/`
- Confirm it is **customer‑facing** and **full‑stack**

## Kill Project Criteria

### Primary Signals (Least Wanted)

- **Low customer value** compared to other projects
- **One-off utility** without recurring usage
- **Weak differentiation** or unclear target audience
- **Low synergy** with existing portfolio
- **Low engagement potential** (unlikely to be used frequently)
- **Better as integration than standalone** (could be a feature in another project)

### Important Clarifications

**Competitors Are OK**:
- Having competitors does NOT disqualify a project
- Goal is to eventually provide full experience across categories
- Competitive markets validate demand

**Feature vs Standalone**:
- Some projects work better as **features** in larger apps
- Can be **integrations** in related projects (shopping, events, budgeting, etc.)
- When removed, save to **integration ideas list** for future reference
- Example: Price tracking works better as part of shopping/budgeting apps

### Disqualifiers (Do Not Remove)

- Projects with explicit user priority
- Projects tied to core business value or flagship goals
- Projects with unique portfolio value
- Projects explicitly requested as "must keep"

### Approval Rule

- **Must get explicit user approval before deletion**
- Only remove **after** approval

### After Removal

When a project is removed:

1. **Save to integration ideas** - Add to `docs/reference/PROJECT_INTEGRATION_IDEAS.md`
2. **Document potential integrations** - List which projects could benefit from this as a feature
3. **Keep as reference** - May become standalone later if context changes

### Immune List Behavior

If a proposed deletion is rejected **for reasons OTHER than integration**:

- Mark that project as **immune forever** (never suggest it again for deletion)
- Immediately suggest another candidate unless all projects are immune
- If all projects are immune, stop and announce a happy "no projects to delete" message

**Note**: If rejected because "it should be an integration", proceed with removal and add to integration ideas list

### Scoring Heuristic (Kill Candidate)

Use a 1–5 score per category (lower is worse):

1. **Customer Value**
2. **Differentiation**
3. **Retention Potential**
4. **Portfolio Fit**

**Lowest total score** is the default candidate (unless disqualified).

## Notes

- This document is a starting point and will be refined by the user.
- Criteria should remain aligned with the “projects are for customers” principle.
- These criteria are used by both the **New Project** and **Kill Project** commands.

---

## Review/Contribution

_This document will be reviewed and refined before implementation._
