# Feature: CLI Command Reference

## Overview

**Description**: Complete, searchable documentation for all CLI tools in the workspace (task-master, cursor-init, logbook, etc.)

**User Benefit**: Developers find CLI command syntax and examples quickly without digging through READMEs

**Business Value**: Reduces command lookup time, improves CLI tool adoption

**Priority**: P1 (Must-have for MVP)

---

## Key Features

1. **CLI Tool List**: All CLI tools with descriptions
2. **Command Explorer**: Browse commands by tool or category
3. **Command Details**: Syntax, options, examples with copy buttons
4. **Interactive Examples**: Command builder with validation (post-MVP)
5. **Command Search**: Search by keyword, option, or use case

---

## User Stories

- As a developer, I want to see all CLI commands so I can find the right command quickly
- As a developer, I want to search for commands by functionality so I don't have to remember exact names
- As a developer, I want to copy command examples so I can use them immediately
- As a new team member, I want to learn CLI tools so I can be productive quickly

---

## Data Model

```typescript
interface Command {
  id: string;
  tool: string;                  // E.g., 'task-master'
  command: string;               // E.g., 'list'
  fullCommand: string;           // E.g., 'task-master list'
  description: string;
  usage: string;
  options: {
    flag: string;
    description: string;
    required: boolean;
    default?: string;
  }[];
  examples: {
    command: string;
    description: string;
  }[];
  relatedCommands: string[];
  category: string;
}
```

---

## Success Metrics

- **Adoption**: 80%+ of developers use CLI reference weekly
- **Time Saved**: Command lookup time <15 seconds
- **Copy Usage**: 60%+ copy commands rather than typing
- **Satisfaction**: 4.5+ / 5.0 usefulness rating

---

**See [PRD_OVERVIEW.md](../PRD_OVERVIEW.md) for complete requirements**
