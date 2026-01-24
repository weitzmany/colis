# Project Commands - New Project & Kill Project

**Status**: Planning / Specification  
**Last Updated**: 2026-01-05

## Overview

This document defines two user commands for project management:

1. **New Project** – behave exactly like the current "suggest new project" workflow.
2. **Kill Project** – select the least valuable project and remove it (requires explicit user approval before deletion).

These commands use shared selection criteria defined in:
- [Project Selection Criteria](../reference/PROJECT_SELECTION_CRITERIA.md)

## Command: New Project

### Intent

Generate a new **customer-facing** project idea using the same process currently used when the user asks: “suggest new project”.

### Required Behavior

- Follow the existing project selection criteria.
- Create a new PRD in `docs/projects/<project-name>/PRD.md`.
- Add the project to `docs/reference/PROJECTS_LIST.md` with consistent metadata.
- Update counts and summary sections to keep lists accurate.

### Output Format

- Brief description of the new project
- Why it is high value for customers
- PRD location and confirmation

## Command: Kill Project

### Intent

Select the **least valuable/least necessary** project and remove it from:

- `docs/reference/PROJECTS_LIST.md`
- `docs/projects/` directory (remove its PRD folder)

### Required Behavior

- Use the **Kill Project Criteria** in the shared criteria doc.
- Present the candidate project and **ask for explicit approval**.
- **Do not remove anything without user approval.**
- After approval:
  - Remove the project entry from `docs/reference/PROJECTS_LIST.md`
  - Remove the project’s directory from `docs/projects/`
  - Update counts and summary sections

### Approval Gate

Before deletion, ask:

> “Confirm removal of `<project-name>` from the list and `docs/projects/`?”

## Notes

- These commands only apply in **Planning Mode**.
- Deletions always require explicit user approval.
- These commands must follow the criteria defined in the reference document.

---

## Review/Contribution

_This document will be reviewed and refined before implementation._
