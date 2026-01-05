# Documentation Index

This directory contains all documentation organized by feature and topic.

## 🎯 Project Purpose

**Main Goal**: Create packages for broad use across all existing and future projects.

Packages can be:
- **Actual tools & features** - Reusable functionality to embed in projects
- **Rules & consistency packages** - Standards, templates, and patterns to maintain consistency

See [Project Purpose](./PROJECT_PURPOSE.md) for complete details.

## ⚠️ PLANNING MODE ACTIVE

**Currently in PLANNING/DOCUMENTATION ONLY mode**

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

Planning mode is controlled by `.PLANNING_MODE` file in `docs/` directory.

See [Planning Mode Workflow](./guides/PLANNING_MODE_WORKFLOW.md) for details.

## 📁 Structure

Documentation structure rules are enforced by `.cursor/rules/user/documentation_structure.mdc`.

**Summary**: All documentation files (except this README.md) must be organized in subdirectories:
- **Features** go in `features/<feature-name>/`
- **Other docs** go in topic-based directories (e.g., `guides/`, `reference/`, `architecture/`)

See [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) for complete details.

## 🎯 Features

All feature documentation is located in the `features/` directory.

_Features will be documented here as they are added._

## 📚 Documentation by Topic

### Project Overview
- [Project Purpose](./PROJECT_PURPOSE.md) - Main goal and purpose of this packages project

### Guides
- [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) - How to organize documentation
- [Planning Mode Workflow](./guides/PLANNING_MODE_WORKFLOW.md) - How to work in planning mode
- [.cursor Directory](./guides/CURSOR_DIRECTORY.md) - Cursor IDE configuration directory
- [Security and Secrets](./guides/SECURITY_AND_SECRETS.md) - Rules for handling passwords, keys, tokens, and secrets

### Reference
- [Projects List](./reference/PROJECTS_LIST.md) - List of all projects in ~/Documents/
- [MCP Configurations](./reference/MCP_CONFIGURATIONS.md) - MCP configurations from other projects
- [Generic Rules Review](./reference/GENERIC_RULES_REVIEW.md) - Generic/useful rules from other projects for review
- [Generic Commands Review](./reference/GENERIC_COMMANDS_REVIEW.md) - Generic/useful commands from other projects for review
- [Generic Experts Review](./reference/GENERIC_EXPERTS_REVIEW.md) - Generic/useful expert personas from other projects for review
- [Generic Features Review](./reference/GENERIC_FEATURES_REVIEW.md) - Generic/reusable features from other projects for review
- [Additional Resources Review](./reference/ADDITIONAL_RESOURCES_TO_REVIEW.md) - Other useful resources and patterns to review
- [Scripts Review](./reference/SCRIPTS_REVIEW.md) - Generic/useful scripts from other projects
- [Project Structure Patterns Review](./reference/PROJECT_STRUCTURE_REVIEW.md) - Project organization patterns
- [CI/CD Workflows Review](./reference/CICD_WORKFLOWS_REVIEW.md) - GitHub Actions CI/CD patterns
- [Configuration Files Review](./reference/CONFIGURATION_FILES_REVIEW.md) - package.json, tsconfig, docker patterns
- [Documentation Patterns Review](./reference/DOCUMENTATION_PATTERNS_REVIEW.md) - Documentation structure and templates
- [Testing Structure Review](./reference/TESTING_STRUCTURE_REVIEW.md) - Test organization patterns
- [Environment Setup Review](./reference/ENVIRONMENT_SETUP_REVIEW.md) - Docker, .env setup patterns
- [API Structure Patterns Review](./reference/API_STRUCTURE_REVIEW.md) - RESTful API organization
- [Component Structure Review](./reference/COMPONENT_STRUCTURE_REVIEW.md) - Component organization patterns
- [Build & Deployment Review](./reference/BUILD_DEPLOYMENT_REVIEW.md) - Build and deployment automation
- [Git Hooks Review](./reference/GIT_HOOKS_REVIEW.md) - Git hooks patterns
- [Database Schemas Review](./reference/DATABASE_SCHEMAS_REVIEW.md) - Database migration patterns

_Additional topic directories will be created as needed._

---

## Creating New Documentation

When creating new documentation:

See [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) for complete details and workflow.

Documentation structure rules are enforced by `.cursor/rules/user/documentation_structure.mdc`.

