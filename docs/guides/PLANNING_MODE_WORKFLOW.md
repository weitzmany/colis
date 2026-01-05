# Planning Mode Workflow

This guide defines how to work in PLANNING MODE.

## Planning Mode Rule

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

**Everything said by the user must be documented while in planning mode.**

This means:
- All user requests, ideas, and requirements must be captured in documentation
- All decisions and discussions should be recorded
- All project descriptions, workflows, and plans must be written down
- Nothing should be lost or forgotten

## Planning Mode Status

Planning mode is **ACTIVE** when the file `.PLANNING_MODE` exists in the `docs/` directory.

To check if planning mode is active, verify the existence of `docs/.PLANNING_MODE`.

## Rules While Planning Mode is Active

These rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

### ✅ Allowed Activities

1. **Creating Documentation**
   - Feature PRDs (Product Requirements Documents)
   - TASKS.md files with implementation plans
   - Architecture documentation
   - Guides and reference materials
   - Project descriptions
   - Workflow documentation
   - Any markdown files in the `docs/` directory

4. **Cursor Configuration**
   - Creating rules files in `.cursor/` directory
   - Creating commands configuration in `.cursor/` directory
   - Setting up IDE workflow configurations

2. **Planning Activities**
   - Describing projects
   - Planning features
   - Creating workflows
   - Documenting decisions
   - Capturing requirements
   - Creating task breakdowns

3. **Documenting Everything**
   - All user requests must be documented
   - All ideas and concepts must be captured
   - All decisions must be recorded
   - All workflows must be written down

### ❌ Prohibited Activities

1. **Code Changes**
   - No code modifications
   - No file creation outside `docs/` and `.cursor/` directories
   - No implementation
   - No testing code
   - No configuration files (except `.cursor/` directory)

2. **Implementation**
   - No actual coding
   - No file system changes outside documentation and `.cursor/` directory
   - No dependency management
   - No build configuration
   - No deployment setup

## Workflow

When in planning mode:

1. **User makes a request or shares an idea**
2. **Document it immediately** in the appropriate location:
   - Features → `docs/features/<feature-name>/PRD.md` or `TASKS.md`
   - General concepts → `docs/guides/` or `docs/reference/`
   - Projects → `docs/projects/` or appropriate topic directory
   - Workflows → `docs/guides/` or `docs/workflows/`

3. **Update index files** (like `docs/README.md`) to include new documentation

4. **Ensure nothing is lost** - capture all context and details

## Documenting User Input

When the user says something that needs to be documented:

1. **Identify the type of content**:
   - Feature requirement → Feature PRD
   - Project description → Project documentation
   - Workflow/process → Workflow guide
   - General concept → Reference or guide
   - Task/plan → TASKS.md

2. **Create or update the appropriate documentation file**

3. **Capture all relevant details**:
   - What was said
   - Context and background
   - Requirements and constraints
   - Decisions made
   - Questions or considerations

## Exceptions

### `.cursor/` Directory

The `.cursor/` directory is **allowed** during planning mode for:
- Creating `.cursorrules` files
- Creating commands configuration
- Setting up IDE workflow configurations

This is allowed because Cursor configuration files are tooling/configuration rather than code implementation. See [.cursor Directory](./CURSOR_DIRECTORY.md) for details.

## Exit Planning Mode

To exit planning mode:

1. User must **explicitly request** removal of `.PLANNING_MODE` file
2. Only then may code changes and implementation begin
3. Documentation created during planning mode serves as the foundation for implementation

---

**Last Updated**: 2025-01-05  
**Status**: ACTIVE  
**Version**: 1.1

