# .cursor Directory

This document describes the `.cursor` directory and its purpose in this project.

## Purpose

The `.cursor` directory is used for Cursor IDE configuration files, including:
- Rules files (`.cursorrules`)
- Commands configuration
- IDE-specific settings and configurations

## Planning Mode Exception

**The `.cursor` directory is allowed during planning mode.**

This is an exception to the "no file creation outside `docs/` directory" rule because:
- Cursor configuration files are tooling/configuration, not code implementation
- Rules and commands help define how the project should be worked on
- These files are part of the planning and documentation process
- They establish workflows and guidelines for development

## Allowed Activities in `.cursor` During Planning Mode

- Creating `.cursorrules` files
- Creating commands configuration
- Documenting IDE rules and guidelines
- Setting up workflow configurations

## Relationship to Documentation

Rules and commands created in `.cursor` should be:
- Documented in `docs/guides/` if they define workflows or processes
- Referenced in relevant documentation when they affect how work is done
- Kept in sync with documented workflows and processes

---

**Created**: 2025-01-05  
**Status**: ACTIVE

