# Documentation Structure Guide

This document defines the standard structure for organizing all documentation in this knowledge base.

## ⚠️ PLANNING MODE

**CRITICAL**: This project is currently in **PLANNING/DOCUMENTATION ONLY** mode.

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

If the file `.PLANNING_MODE` exists in the `docs/` directory, planning mode is active.

Only create documentation, PRDs, TASKS.md files, guides, and planning documents.
Implementation will begin only after explicit request to remove `.PLANNING_MODE`.

## Structure Rule

This rule is enforced by `.cursor/rules/user/documentation_structure.mdc`.

**All documentation files (except README.md) must be organized in subdirectories:**

```
docs/
├── README.md                        # Only .md file allowed in root
├── features/                        # All feature documentation
│   ├── <feature-name>/              # Feature directory (kebab-case)
│   │   ├── PRD.md                   # Product Requirements Document
│   │   └── TASKS.md                 # Implementation task list
│   └── <other-feature-name>/        # Another feature
│       ├── PRD.md
│       └── TASKS.md
├── guides/                          # General guides and structure docs
│   └── DOCUMENTATION_STRUCTURE.md   # This file
├── reference/                       # Reference documentation
├── architecture/                    # Architecture documentation
└── <topic>/                         # Other topic directories as needed
```

## Key Rules

1. **No .md files in root** - Only `README.md` is allowed in the main `docs/` directory
2. **Features go in `features/`** - All feature documentation must be in `features/<feature-name>/` directories
3. **Other docs by topic** - Non-feature documentation must be organized by topic in dedicated directories
4. **Directory naming** - Use kebab-case for all directory names

## Directory Naming Convention

- Use **kebab-case** for all directory names
- Feature examples:
  - `features/user-authentication`
  - `features/analytics-dashboard`
  - `features/data-processing`
- Topic examples:
  - `guides/` - General guides
  - `reference/` - Reference documentation
  - `architecture/` - Architecture documentation
  - `patterns/` - Design patterns and best practices

## File Naming Convention

### Required Files in Each Feature Directory

1. **PRD.md** - Product Requirements Document
   - Complete feature specification
   - Requirements and technical architecture
   - Configuration examples
   - Implementation phases overview

2. **TASKS.md** - Implementation Task List
   - Detailed task breakdown by phase
   - Task status tracking
   - Dependencies and notes
   - Progress tracking

### Optional Files

- **ARCHITECTURE.md** - Detailed technical architecture (if PRD is too large)
- **API.md** - API documentation (if feature exposes APIs)
- **TESTING.md** - Testing strategy and test cases
- **DEPLOYMENT.md** - Deployment-specific instructions

## Organizing Non-Feature Documentation

Non-feature documentation must be organized by topic in dedicated directories:

- **General guides** → `guides/` directory
- **Reference materials** → `reference/` directory
- **Architecture docs** → `architecture/` directory
- **Design patterns** → `patterns/` directory (create if needed)
- **Other topics** → Create new topic directory as needed

**Never place .md files directly in the `docs/` root** (except README.md).

## Workflow for New Features

When asked to design a new feature:

1. **Create feature directory** in `docs/features/` using kebab-case naming
2. **Create PRD.md** in the feature directory with complete requirements
3. **Create TASKS.md** in the feature directory with detailed task breakdown
4. **Update README.md** to include the new feature
5. **Follow the same structure** for all future features

## Workflow for Other Documentation

When creating non-feature documentation:

1. **Identify the topic** (guides, reference, architecture, etc.)
2. **Use existing topic directory** if it exists, or create a new one
3. **Place the file** in the appropriate topic directory
4. **Update README.md** to include the new documentation
5. **Never place files** directly in `docs/` root

## Example Structure

```
docs/
├── README.md
├── features/
│   ├── feature-one/
│   │   ├── PRD.md
│   │   └── TASKS.md
│   └── feature-two/
│       ├── PRD.md
│       └── TASKS.md
├── guides/
│   └── DOCUMENTATION_STRUCTURE.md
├── reference/
│   └── example-reference.md
└── architecture/
    └── system-overview.md
```

## Benefits

- **Organization**: Clear separation between features and topics
- **Discoverability**: Easy to find documentation by category
- **Scalability**: Can add more files per feature or topic as needed
- **Consistency**: Same structure for all documentation
- **Maintainability**: No clutter in root directory
- **Clarity**: README.md is the only file in root, making navigation obvious

---

**Last Updated**: 2025-01-05  
**Version**: 1.0

