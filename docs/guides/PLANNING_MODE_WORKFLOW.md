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

## Documentation Best Practices in Planning Mode

### Structure and Organization

When creating documentation during planning mode, follow these best practices:

1. **Use Appropriate Directories**
   - Feature documentation → `docs/features/<feature-name>/`
   - Guides → `docs/guides/`
   - Reference materials → `docs/reference/`
   - Architecture docs → `docs/architecture/`
   - Never place files directly in `docs/` root (except README.md)

2. **Naming Conventions**
   - Use descriptive, clear file names
   - Follow kebab-case for directories
   - Use UPPERCASE for important guides (e.g., `SETUP_GUIDE.md`)
   - Be consistent across similar document types

3. **File Organization**
   - Group related documentation together
   - Create subdirectories when needed
   - Maintain clear hierarchy
   - Update index files (README.md) when adding new docs

### Documentation Templates

#### PRD Template Structure

```markdown
# [Feature Name] - Product Requirements Document

## Overview
[Brief description of the feature]

## Goals
[What this feature aims to achieve]

## Requirements
### Functional Requirements
- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements
- [Performance, security, etc.]

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Technical Architecture
[High-level technical approach]

## Implementation Phases
### Phase 1: [Name]
- [Tasks]

### Phase 2: [Name]
- [Tasks]

## Success Criteria
[How to measure success]

## Open Questions
[Unresolved questions or decisions needed]
```

#### TASKS.md Template Structure

```markdown
# [Feature Name] - Implementation Tasks

## Phase 1: [Phase Name]
- [ ] Task 1 - [Description]
  - Dependencies: [List dependencies]
  - Notes: [Additional context]
- [ ] Task 2 - [Description]
  - Dependencies: [List dependencies]

## Phase 2: [Phase Name]
- [ ] Task 1 - [Description]

## Status Legend
- [ ] Not started
- [⏳] In progress
- [✅] Completed
- [❌] Blocked
```

### Capturing User Input Effectively

#### Immediate Documentation Checklist

When the user provides input, immediately:

1. **Identify Content Type**
   - [ ] Feature requirement
   - [ ] Project description
   - [ ] Workflow/process
   - [ ] General concept
   - [ ] Task/plan
   - [ ] Decision
   - [ ] Question

2. **Determine Location**
   - [ ] Feature → `docs/features/<name>/`
   - [ ] Guide → `docs/guides/`
   - [ ] Reference → `docs/reference/`
   - [ ] Architecture → `docs/architecture/`

3. **Capture Complete Context**
   - [ ] What was said (exact or paraphrased)
   - [ ] Why it matters (purpose/goal)
   - [ ] When it's needed (timeline/priority)
   - [ ] Who it affects (stakeholders/users)
   - [ ] How it relates (connections to other features/docs)
   - [ ] Constraints or limitations
   - [ ] Open questions

4. **Document Format**
   - [ ] Use appropriate template
   - [ ] Include all relevant sections
   - [ ] Add examples if helpful
   - [ ] Link to related documentation
   - [ ] Update index files

### Quality Standards for Planning Mode Documentation

1. **Completeness**
   - All user input is captured
   - No information is lost
   - Context is preserved
   - Questions are documented

2. **Clarity**
   - Clear, understandable language
   - Well-organized structure
   - Appropriate level of detail
   - Examples when helpful

3. **Consistency**
   - Follow established templates
   - Use consistent formatting
   - Maintain naming conventions
   - Follow directory structure rules

4. **Accessibility**
   - Easy to find (proper location)
   - Easy to navigate (clear structure)
   - Easy to understand (clear language)
   - Easy to update (maintainable format)

### Common Documentation Patterns

#### Feature Documentation Pattern

```
docs/features/<feature-name>/
├── PRD.md          # Product Requirements Document
├── TASKS.md        # Implementation task breakdown
├── ARCHITECTURE.md # Technical architecture (optional)
├── API.md          # API documentation (optional)
└── TESTING.md      # Testing strategy (optional)
```

#### Guide Documentation Pattern

```markdown
# [Guide Title]

## Overview
[What this guide covers]

## Prerequisites
[What you need to know/do first]

## Step-by-Step Instructions
### Step 1: [Action]
[Detailed instructions]

### Step 2: [Action]
[Detailed instructions]

## Examples
[Practical examples]

## Troubleshooting
[Common issues and solutions]

## Related Documentation
[Links to related docs]
```

#### Reference Documentation Pattern

```markdown
# [Reference Title]

## Purpose
[What this reference covers]

## [Topic 1]
[Detailed information]

## [Topic 2]
[Detailed information]

## Quick Reference
[Summary or quick lookup table]

## See Also
[Links to related documentation]
```

### Workflow Examples

#### Example 1: User Requests a New Feature

1. **Immediate Action**: Create feature directory
   ```
   docs/features/user-authentication/
   ```

2. **Create PRD.md**: Document requirements
   - Capture all user requirements
   - Include context and background
   - Document decisions made
   - Note open questions

3. **Create TASKS.md**: Break down implementation
   - Organize by phases
   - List dependencies
   - Estimate complexity
   - Note prerequisites

4. **Update README.md**: Add feature to index
   - Link to feature documentation
   - Update features list

#### Example 2: User Describes a Workflow

1. **Identify Type**: Workflow/process documentation

2. **Determine Location**: `docs/guides/` or `docs/workflows/`

3. **Create Guide**: Document the workflow
   - Step-by-step instructions
   - Decision points
   - Examples
   - Troubleshooting

4. **Update Index**: Add to appropriate section in README.md

#### Example 3: User Makes a Decision

1. **Capture Decision**: Document in appropriate location
   - Feature decision → Feature PRD
   - Process decision → Workflow guide
   - General decision → Reference doc

2. **Include Context**:
   - What was decided
   - Why it was decided
   - Alternatives considered
   - Impact of decision

3. **Update Related Docs**: If decision affects other documentation

### Maintaining Documentation Quality

1. **Regular Review**
   - Check for outdated information
   - Verify links are working
   - Ensure consistency
   - Update as needed

2. **Version Control**
   - Track changes in git
   - Use clear commit messages
   - Document significant changes
   - Maintain change history

3. **Cross-References**
   - Link related documentation
   - Maintain documentation graph
   - Update links when files move
   - Keep references current

4. **Completeness Checks**
   - Verify all user input is captured
   - Check for missing information
   - Identify gaps in documentation
   - Fill in incomplete sections

### Troubleshooting Common Issues

#### Issue: Unsure Where to Place Documentation

**Solution**: Follow the documentation structure rules:
- Features → `docs/features/<name>/`
- Guides → `docs/guides/`
- Reference → `docs/reference/`
- Architecture → `docs/architecture/`
- If none fit, create appropriate topic directory

#### Issue: User Input is Vague or Incomplete

**Solution**: 
- Document what was said
- Note what's unclear
- List questions that need answers
- Mark sections as "TBD" (To Be Determined)
- Follow up to clarify

#### Issue: Multiple Related Pieces of Information

**Solution**:
- Group related information together
- Use cross-references
- Create index or summary
- Maintain clear relationships

#### Issue: Documentation Becomes Too Large

**Solution**:
- Break into multiple files
- Use subdirectories
- Create summary/index
- Link to detailed sections

### Planning Mode Checklist

Before considering planning mode complete, verify:

- [ ] All user requests are documented
- [ ] All decisions are recorded
- [ ] All workflows are written down
- [ ] All features have PRDs
- [ ] All features have TASKS.md files
- [ ] All guides are complete
- [ ] All reference materials are documented
- [ ] README.md is up to date
- [ ] Documentation follows structure rules
- [ ] All links are working
- [ ] Documentation is clear and complete
- [ ] Nothing is lost or forgotten

---

**Last Updated**: 2025-01-05  
**Status**: ACTIVE  
**Version**: 1.1

---

## Review/Contribution

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Expanded this planning mode workflow guide with comprehensive documentation best practices, including: documentation structure and organization guidelines (appropriate directories, naming conventions, file organization), documentation templates (PRD template structure, TASKS.md template structure with status tracking), effective user input capture techniques (immediate documentation checklist, content type identification, location determination, context capture), quality standards for planning mode documentation (completeness, clarity, consistency, accessibility), common documentation patterns (feature documentation pattern, guide documentation pattern, reference documentation pattern), detailed workflow examples (user requests new feature, user describes workflow, user makes decision), documentation maintenance practices (regular review, version control, cross-references, completeness checks), troubleshooting guide for common documentation issues, and a comprehensive planning mode checklist. These additions provide practical, actionable guidance for creating and maintaining high-quality documentation during planning mode, ensuring nothing is lost and all information is properly organized and accessible.

