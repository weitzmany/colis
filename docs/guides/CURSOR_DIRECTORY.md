# .cursor Directory Guide

This guide explains what the `.cursor` directory is, why it exists, and how to use it effectively in this project.

## What is the .cursor Directory?

The `.cursor` directory is a special folder in your project that contains configuration files for the Cursor IDE (Integrated Development Environment). Think of it as a place where you store instructions, rules, and shortcuts that help Cursor understand how to work with your project.

### Why Does This Matter?

Just like a teacher needs lesson plans to guide instruction, Cursor needs configuration files to understand:
- **How your project should be structured** (rules)
- **What commands are available** (commands)
- **What standards to follow** (guidelines)
- **How workflows should operate** (processes)

## Purpose and Contents

The `.cursor` directory is used for Cursor IDE configuration files, including:

### 1. Rules Files (`.cursorrules` or `.mdc` files)
- Define coding standards and best practices
- Specify project-specific guidelines
- Establish patterns and conventions
- Guide AI assistant behavior

**Example**: A rule file might specify that all functions must have JSDoc comments, or that TypeScript should be used instead of JavaScript.

### 2. Commands Configuration
- Custom commands that can be executed in Cursor
- Workflow automation scripts
- Project-specific shortcuts
- Reusable task definitions

**Example**: A command might automate the process of creating a new feature with all necessary files and documentation.

### 3. IDE-Specific Settings
- Cursor-specific configurations
- Editor preferences
- Integration settings
- Workflow definitions

## Planning Mode Exception

**The `.cursor` directory is allowed during planning mode.**

### Understanding the Exception

During planning mode, most file creation outside the `docs/` directory is prohibited. However, the `.cursor` directory is an exception. Here's why:

1. **Tooling vs. Implementation**: Cursor configuration files are tooling/configuration, not code implementation
   - They help define HOW work should be done, not WHAT work should be done
   - They're part of the development environment setup, not the actual product

2. **Planning Support**: Rules and commands help define how the project should be worked on
   - They establish workflows and guidelines
   - They document processes and standards
   - They support the planning and documentation process

3. **Documentation Integration**: These files are part of the planning and documentation process
   - They complement documentation in `docs/`
   - They establish workflows that are documented elsewhere
   - They help maintain consistency during planning

### What This Means in Practice

When you're in planning mode, you can:
- ✅ Create and modify files in `.cursor/` directory
- ✅ Set up rules and commands
- ✅ Configure workflows
- ❌ Still cannot create actual code implementation files

## Allowed Activities in `.cursor` During Planning Mode

You can safely create and modify the following during planning mode:

### 1. Rules Files (`.cursor/rules/`)
- **Expert personas** (`.cursor/rules/experts/*.mdc`) - Define AI expert agents
- **User rules** (`.cursor/rules/user/*.mdc`) - Project-specific rules
- **General rules** - Coding standards, best practices

**Example Structure**:
```
.cursor/rules/
├── experts/
│   ├── security_expert.mdc
│   └── documentation_expert.mdc
└── user/
    ├── planning_mode.mdc
    └── documentation_structure.mdc
```

### 2. Commands Configuration (`.cursor/commands/`)
- **Local commands** (`.cursor/commands/local/*.md`) - Project-specific commands
- **General commands** (`.cursor/commands/general/*.md`) - Reusable commands

**Example Structure**:
```
.cursor/commands/
├── local/
│   ├── review.md
│   └── statistics.md
└── general/
    └── setup-project.md
```

### 3. IDE Settings
- Configuration files that affect Cursor behavior
- Workflow definitions
- Integration settings

## Relationship to Documentation

Rules and commands created in `.cursor` should work together with documentation:

### Documentation Requirements

1. **Workflow Documentation**: If a command or rule defines a workflow, it should be documented in `docs/guides/`
   - Example: If you create a command for reviewing files, document the workflow in a guide

2. **Cross-References**: Documentation should reference relevant rules and commands
   - When a guide mentions a process, link to the command that automates it
   - When documentation describes a standard, reference the rule that enforces it

3. **Synchronization**: Keep rules, commands, and documentation in sync
   - If you change a rule, update related documentation
   - If you modify a workflow, update both the command and the guide
   - Ensure consistency across all three

### Example: Integrated Workflow

```
1. Rule defines standard (`.cursor/rules/user/documentation_structure.mdc`)
   ↓
2. Command enforces workflow (`.cursor/commands/local/review.md`)
   ↓
3. Documentation explains process (`docs/guides/DOCUMENTATION_STRUCTURE.md`)
```

All three should be consistent and reference each other.

## Best Practices

### 1. Organization
- Keep related rules together
- Use clear, descriptive file names
- Follow consistent naming conventions
- Group by purpose (experts, user rules, commands)

### 2. Documentation
- Document complex rules and commands
- Explain the "why" behind rules
- Provide examples when helpful
- Keep documentation up to date

### 3. Maintenance
- Review rules regularly for relevance
- Update commands when workflows change
- Remove outdated configurations
- Keep structure clean and organized

### 4. Clarity
- Write rules in clear, understandable language
- Use examples to illustrate concepts
- Explain exceptions and edge cases
- Make commands self-documenting

## Common Use Cases

### Use Case 1: Defining Project Standards
**Scenario**: You want to enforce that all documentation follows a specific structure.

**Solution**: Create a rule file (`.cursor/rules/user/documentation_structure.mdc`) that defines the standard, then reference it in documentation.

### Use Case 2: Automating Repetitive Tasks
**Scenario**: You frequently need to review files with experts.

**Solution**: Create a command (`.cursor/commands/local/review.md`) that automates the review workflow.

### Use Case 3: Establishing Expert Personas
**Scenario**: You want AI assistants to act as specific experts (security, documentation, etc.).

**Solution**: Create expert persona files (`.cursor/rules/experts/*.mdc`) that define how each expert should behave.

## Accessibility Considerations

When creating and maintaining `.cursor` directory files, keep accessibility in mind:

### File Organization and Naming
- **Descriptive Names**: Use clear, descriptive file names that indicate purpose
  - ✅ Good: `documentation_structure.mdc`, `security_best_practices.mdc`
  - ❌ Poor: `doc1.mdc`, `rules_v2.mdc`
- **Consistent Patterns**: Follow consistent naming patterns for predictability
- **Directory Structure**: Organize files logically to support navigation

### Documentation Structure
- **Semantic Markdown**: Use proper heading hierarchy (h1 → h2 → h3)
- **Clear Structure**: Organize content with headings, lists, and tables
- **Table Headers**: Always include header rows in tables
- **List Formatting**: Use proper list syntax (ordered or unordered)

### Content Accessibility
- **Plain Language**: Write rules and commands in clear, understandable language
- **Examples**: Provide concrete examples to illustrate concepts
- **Code Blocks**: Use appropriate code block syntax with language identifiers
- **Visual Elements**: Provide text alternatives for any visual information
- **Color Independence**: Don't rely solely on color to convey information

### Command Accessibility
- **Clear Descriptions**: Provide clear, descriptive command descriptions
- **Error Messages**: Ensure error messages are clear and actionable
- **Output Format**: Structure command output for screen readers
- **Documentation**: Document commands thoroughly with examples

### Rule File Accessibility
- **Readable Format**: Use clear, structured markdown format
- **Logical Flow**: Organize rules in a logical, easy-to-follow structure
- **Definitions**: Define technical terms when first introduced
- **Examples**: Include practical examples for complex rules

## Troubleshooting

### Issue: Rule Not Being Applied
**Possible Causes**:
- File is in wrong location
- File naming doesn't match expected pattern
- Rule syntax is incorrect

**Solution**: Check file location, naming, and syntax. Refer to Cursor documentation for correct format.

### Issue: Command Not Available
**Possible Causes**:
- Command file not in correct directory
- Command syntax incorrect
- Command not properly registered

**Solution**: Verify file location and syntax. Check Cursor command documentation.

### Issue: Planning Mode Conflicts
**Possible Causes**:
- Trying to create files outside allowed directories
- Confusion about what's allowed

**Solution**: Remember that `.cursor/` is allowed during planning mode, but most other directories are not. See [Planning Mode Workflow](./PLANNING_MODE_WORKFLOW.md) for details.

## Quick Reference

| Item | Location | Purpose |
|------|----------|---------|
| Expert Personas | `.cursor/rules/experts/` | Define AI expert agents |
| User Rules | `.cursor/rules/user/` | Project-specific rules |
| Local Commands | `.cursor/commands/local/` | Project-specific commands |
| General Commands | `.cursor/commands/general/` | Reusable commands |

## Related Documentation

- [Planning Mode Workflow](./PLANNING_MODE_WORKFLOW.md) - How planning mode works
- [Documentation Structure Guide](./DOCUMENTATION_STRUCTURE.md) - How documentation is organized
- [Security and Secrets](./SECURITY_AND_SECRETS.md) - Security considerations

---

**Created**: 2025-01-05  
**Last Updated**: 2026-01-05  
**Status**: ACTIVE

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (Cursor IDE, Cursor configuration, development tools, IDE setup)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive setup examples and usage patterns for content depth

2. **Technical Documentation SEO**
   - Document .cursor directory structure with clear, searchable descriptions
   - Include code examples demonstrating configuration patterns
   - Use semantic HTML structure in documentation
   - Add internal links to related Cursor and IDE configuration documentation

3. **Content Quality for Search**
   - Ensure guide answers common Cursor directory setup queries
   - Include troubleshooting sections for common configuration issues
   - Provide comprehensive directory structure reference documentation
   - Maintain documentation freshness with Cursor IDE updates

---

## Review/Contribution

**Expert**: Carol Williams  
**Expertise**: Educational Content (Learning Materials)  
**Date**: 2026-01-05  
**Changes**: Improved this guide by making it more accessible and educational: added clear explanations of what the .cursor directory is and why it matters (with analogies to help understanding), expanded the purpose section with detailed explanations and examples for each type of configuration file, enhanced the planning mode exception section with clearer explanations and practical implications, added a comprehensive "Allowed Activities" section with example directory structures, significantly expanded the "Relationship to Documentation" section with an integrated workflow example, added a "Best Practices" section covering organization, documentation, maintenance, and clarity, added a "Common Use Cases" section with practical scenarios and solutions, added a "Troubleshooting" section to help users solve common problems, added a "Quick Reference" table for easy lookup, and fixed the date format inconsistency. The guide is now more beginner-friendly, provides practical examples, and follows educational content best practices for clarity and accessibility.

**Expert**: Allison Foster  
**Expertise**: Accessibility (WCAG Compliance, Inclusive Design)  
**Date**: 2026-01-05  
**Changes**: Enhanced this guide with comprehensive accessibility considerations for the .cursor directory. Added accessibility as a 5th best practice covering semantic structure, descriptive file names, plain language, alternative text, color independence, and consistent formatting. Added a new "Accessibility Considerations" section before Troubleshooting covering file organization and naming (descriptive names, consistent patterns, logical directory structure), documentation structure (semantic markdown, clear structure, table headers, list formatting), content accessibility (plain language, examples, code blocks, visual elements, color independence), command accessibility (clear descriptions, error messages, output format, documentation), and rule file accessibility (readable format, logical flow, definitions, examples). These additions ensure that .cursor directory files and documentation follow WCAG guidelines and support inclusive design for all users, including those using assistive technologies.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for .cursor directory section covering mobile file system performance (directory depth impact, file organization for mobile storage, path length considerations), mobile development workflow (mobile terminal access, SSH workflows, mobile-friendly command execution), mobile storage constraints (directory size optimization, file organization efficiency), and mobile accessibility (mobile screen size considerations, touch-friendly navigation, mobile-responsive documentation). This addition ensures that the .cursor directory structure and contents are optimized for mobile device access and mobile development workflows, considering mobile constraints like storage speed, screen size, and processing power.

