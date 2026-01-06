# Command vs Script Decision Guide

This guide helps decide whether to create a Cursor command or a standalone script.

**Last Updated**: 2026-01-05

## When to Use a Command

Use a **Cursor Command** (`.cursor/commands/*.md`) when:

### ✅ User-Facing Workflows
- Workflow is initiated by user
- Interactive or requires user input
- Part of development workflow
- Needs to be discoverable via `/command-name`

### ✅ Orchestrates Other Commands
- Calls other Cursor commands
- Coordinates multiple steps
- High-level workflow
- Integrates with Cursor's command system

### ✅ Cursor-Specific Features
- Uses Cursor's AI capabilities
- Requires expert personas
- Needs Cursor's context awareness
- Benefits from Cursor's command discovery

**Examples:**
- `/local/review` - Orchestrates expert review workflow
- `/local/full-review` - Orchestrates multiple reviews
- `/local/commit` - Git commit workflow

## When to Use a Script

Use a **Script** (`.cursor/scripts/*.sh` or `scripts/*.sh`) when:

### ✅ Automation & CI/CD
- Runs in CI/CD pipelines
- Automated execution
- Background processes
- Scheduled tasks

### ✅ File System Operations
- Complex file operations
- Batch processing
- System-level operations
- Cross-platform compatibility needed

### ✅ Standalone Utilities
- Can run independently
- Doesn't need Cursor context
- Reusable across projects
- Command-line tool

**Examples:**
- `validate-documentation.sh` - Validation script
- `setup-project.sh` - Project setup automation
- `calculate-statistics.py` - Data processing

## Hybrid Approach

Many workflows benefit from **both**:

### Command + Scripts Pattern

```
Command (orchestrates)
  ├── Calls other commands
  ├── Calls scripts for file operations
  └── Handles user interaction
```

**Example Structure:**
```
.cursor/
├── commands/
│   └── local/
│       └── full-review.md      # Command (orchestrates)
└── scripts/
    ├── detect-files.sh         # Script (file detection)
    └── scan-projects.sh         # Script (project scanning)
```

## Decision Matrix

| Feature | Command | Script | Hybrid |
|---------|---------|--------|--------|
| User-initiated | ✅ | ❌ | ✅ |
| Orchestrates commands | ✅ | ❌ | ✅ |
| File operations | ⚠️ | ✅ | ✅ |
| CI/CD integration | ❌ | ✅ | ✅ |
| Interactive | ✅ | ⚠️ | ✅ |
| Discoverable | ✅ | ❌ | ✅ |
| Reusable | ⚠️ | ✅ | ✅ |

## For Your Full Review Routine

### Recommended: **Command with Scripts**

**Command** (`/local/full-review`):
- Orchestrates the workflow
- Calls `/local/review` for each file
- Handles expert suggestions
- User-facing and interactive

**Scripts**:
- `detect-files.sh` - Detects all files in ./
- `scan-projects.sh` - Scans ../ for new/missed items

**Why This Approach:**
1. ✅ Command orchestrates high-level workflow
2. ✅ Scripts handle file system operations
3. ✅ Can be called from command line or CI/CD
4. ✅ Maintains Cursor command discoverability
5. ✅ Scripts can be reused independently

### Mobile Considerations for Commands vs Scripts

When deciding between commands and scripts for mobile development:

1. **Mobile Execution Environment**
   - Commands: Better for interactive mobile workflows, mobile terminal compatibility
   - Scripts: May have limitations in mobile terminal environments (some commands may not be available)

2. **Mobile Performance**
   - Commands: Typically lighter weight, better for mobile device constraints
   - Scripts: File system operations may be slower on mobile storage

3. **Mobile Battery Efficiency**
   - Commands: Generally more battery-efficient for user-initiated workflows
   - Scripts: Automated scripts should minimize battery impact on mobile devices

4. **Mobile Development Workflow**
   - Commands: More suitable for mobile development workflows (SSH, mobile terminals)
   - Scripts: Better for CI/CD and automated processes that don't run on mobile

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (Cursor commands, shell scripts, development automation, workflow automation)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive examples and decision trees for content depth

2. **Technical Documentation SEO**
   - Document command and script patterns with clear, searchable descriptions
   - Include code examples demonstrating decision-making patterns
   - Use semantic HTML structure in documentation
   - Add internal links to related command and script documentation

3. **Content Quality for Search**
   - Ensure guide answers common "command vs script" decision queries
   - Include troubleshooting sections for common decision-making issues
   - Provide comprehensive decision framework documentation
   - Maintain documentation freshness with workflow automation updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created guide for deciding between Cursor commands and scripts. This guide covers when to use commands (user-facing workflows, orchestrates other commands, Cursor-specific features), when to use scripts (automation & CI/CD, file system operations, standalone utilities), hybrid approach (command + scripts pattern), decision matrix comparing features, and recommendation for full review routine (command with scripts). This guide helps make informed decisions about command vs script architecture.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for commands vs scripts section covering mobile execution environment (interactive workflows, terminal compatibility, command availability limitations), mobile performance (lightweight commands, slower file system operations), mobile battery efficiency (battery-efficient workflows, minimize automated script impact), and mobile development workflow (SSH/mobile terminals, CI/CD automation). This addition ensures decisions between commands and scripts account for mobile device constraints and mobile development workflows.

---

