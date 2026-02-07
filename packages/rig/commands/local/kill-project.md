# Kill Project Command

Select the least valuable project and remove it **only after explicit user approval**.

## Workflow

1. Read criteria in `docs/reference/PROJECT_SELECTION_CRITERIA.md`.
2. Identify the least valuable project candidate using the Kill Project criteria.
3. Present the candidate and ask for explicit approval:
   - “Confirm removal of `<project-name>` from the list and `docs/projects/`?”
4. **If approved**:
   - Remove the project entry from `docs/reference/PROJECTS_LIST.md`.
   - Delete the project directory from `docs/projects/`.
   - Update counts and summary sections.
5. **If not approved**:
   - Mark the project as **immune**.
   - Immediately suggest another candidate unless all projects are immune.
   - If all are immune, announce a happy message like: “All projects are safe — nothing to delete right now.”

## Constraints

- Planning mode only (docs/.PLANNING_MODE is active)
- Deletion requires explicit user approval
- Always keep project list consistent with `docs/projects/`
