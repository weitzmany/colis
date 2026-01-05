# Project Purpose

This document defines the main goal and purpose of this packages project.

**Last Updated**: 2025-01-05

## Main Goal

**The primary goal of this project is to create packages for broad use across all existing and future projects.**

## Package Types

This project will create two types of packages:

### 1. **Actual Tools & Features**
Packages that provide actual functionality to embed in projects:
- **Reusable features** - Complete features that can be integrated into projects
- **Tools & utilities** - Scripts, automation tools, helper libraries
- **Components & libraries** - UI components, service modules, shared code
- **Templates & starters** - Project templates, boilerplate code

**Examples:**
- Authentication system package
- Database migration tools
- API client libraries
- UI component libraries
- Build and deployment scripts
- Testing utilities

### 2. **Rules & Consistency Packages**
Packages that maintain consistency across projects:
- **Cursor rules** - Coding standards, best practices, project rules
- **Commands** - Standardized commands for common tasks
- **Expert personas** - Reusable AI agent definitions
- **Configuration templates** - Standard configs (package.json, tsconfig, docker-compose, etc.)
- **Documentation templates** - PRD templates, README templates, setup guides
- **Workflow definitions** - Git workflows, CI/CD templates, deployment patterns

**Examples:**
- Standard git workflow rules
- TypeScript configuration standards
- Documentation structure rules
- CI/CD workflow templates
- Security and secrets handling rules
- Testing standards

## Package Usage Model

### For Tools & Features:
- Install as dependencies in projects
- Import and use in code
- Embed as features/modules
- Run as standalone tools

### For Rules & Consistency:
- Copy rules to `.cursor/rules/` in projects
- Copy commands to `.cursor/commands/` in projects
- Copy experts to `.cursor/rules/experts/` or `.cursor/rules/agents/`
- Copy configuration templates
- Reference documentation templates

## Project Structure

This knowledge base documents:
1. **Review documents** - Analysis of existing projects to identify reusable patterns
2. **Package definitions** - Specifications for packages to create
3. **Package implementations** - Actual package code (when implementation begins)
4. **Usage guides** - How to use packages in projects

## Current Status

**Planning Phase**: We are currently documenting and reviewing existing projects to identify:
- Reusable rules, commands, experts, and features
- Configuration patterns
- Structure patterns
- Scripts and automation
- Documentation patterns
- Testing patterns
- And other reusable assets

This planning phase will help us identify what packages to create and how to organize them.

## Benefits

By creating these packages, we aim to:
- **Save time** - Reuse existing solutions instead of recreating
- **Maintain consistency** - Use same rules, patterns, and tools across projects
- **Improve quality** - Share best practices and tested solutions
- **Reduce duplication** - Write once, use everywhere
- **Enable rapid development** - Start new projects with proven patterns

## Next Steps

1. ✅ Complete review of existing projects (in progress)
2. ⏳ Identify specific packages to create
3. ⏳ Design package structure and organization
4. ⏳ Create package specifications (PRDs)
5. ⏳ Implement packages (when planning mode ends)

---

**Note**: This project is currently in **PLANNING MODE**. See [Planning Mode Workflow](../guides/PLANNING_MODE_WORKFLOW.md) for details.

