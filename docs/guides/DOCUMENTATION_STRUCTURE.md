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

## Internationalization (i18n) Considerations for Documentation Structure

When planning for multilingual documentation, the structure must support multiple languages while maintaining organization and discoverability.

### Multilingual Documentation Structure Patterns

#### Pattern 1: Language-Specific Directories (Recommended for Large Documentation)

```
docs/
├── README.md                        # Main index (language selector)
├── en/                              # English documentation
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── PRD.md
│   │       └── TASKS.md
│   ├── guides/
│   │   └── DOCUMENTATION_STRUCTURE.md
│   └── reference/
├── es/                              # Spanish documentation
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── PRD.md
│   │       └── TASKS.md
│   ├── guides/
│   └── reference/
└── assets/                          # Shared assets (images, diagrams)
    └── images/
```

**Advantages**:
- Clear language separation
- Easy to maintain per-language structure
- Simple to add new languages
- Language-specific navigation

**Considerations**:
- Requires maintaining structure across all languages
- More complex linking between languages
- Larger directory tree

#### Pattern 2: Language Suffix in Filenames

```
docs/
├── README.md
├── features/
│   └── <feature-name>/
│       ├── PRD.en.md
│       ├── PRD.es.md
│       ├── TASKS.en.md
│       └── TASKS.es.md
├── guides/
│   ├── DOCUMENTATION_STRUCTURE.en.md
│   └── DOCUMENTATION_STRUCTURE.es.md
└── reference/
```

**Advantages**:
- Single directory structure
- Easy to see all language versions together
- Simpler file management

**Considerations**:
- Can become cluttered with many languages
- Harder to navigate per-language
- More complex file naming

#### Pattern 3: Hybrid Approach (Language Directories with Shared Structure)

```
docs/
├── README.md
├── en/
│   ├── features/
│   ├── guides/
│   └── reference/
├── es/
│   ├── features/
│   ├── guides/
│   └── reference/
└── shared/                          # Language-agnostic content
    ├── code-examples/               # Code examples (usually language-agnostic)
    ├── diagrams/                    # Diagrams and images
    └── templates/                   # Documentation templates
```

**Advantages**:
- Best of both worlds
- Shared assets don't need translation
- Clear language separation for translatable content

### Documentation Structure Rules for i18n

1. **Consistent Structure Across Languages**:
   - Maintain the same directory structure in all language directories
   - Use identical file names (only language differs)
   - Keep the same navigation hierarchy

2. **Language Identification**:
   - Use ISO 639-1 language codes (en, es, fr, de, etc.)
   - Be consistent with language code usage
   - Document language codes in README

3. **Shared vs. Translated Content**:
   - **Shared**: Code examples, diagrams, configuration files, API schemas
   - **Translated**: User-facing text, guides, descriptions, explanations
   - **Partially Translated**: Code comments (may need translation), error messages

4. **File Naming for i18n**:
   - If using language directories: Keep same filenames
   - If using language suffixes: Use consistent format (`.en.md`, `.es.md`)
   - Document naming convention clearly

### Translation Workflow Integration

#### Documentation Structure for Translation Management

```
docs/
├── README.md
├── source/                          # Source language (usually English)
│   ├── features/
│   ├── guides/
│   └── reference/
├── translations/                    # Translated versions
│   ├── es/
│   ├── fr/
│   └── de/
└── translation-files/              # Translation keys (if using key-based approach)
    ├── en.json
    ├── es.json
    └── fr.json
```

#### Translation Status Tracking

Consider adding translation status indicators to documentation:

```markdown
## Translation Status

- **English (en)**: ✅ Complete
- **Spanish (es)**: ⏳ In Progress (80% complete)
- **French (fr)**: ❌ Not Started
- **German (de)**: ✅ Complete
```

### Best Practices for i18n Documentation Structure

1. **Plan for i18n from the Start**:
   - Design structure with multilingual support in mind
   - Use language-agnostic file names where possible
   - Keep code examples separate from translatable content

2. **Maintain Structure Consistency**:
   - Same directory structure across all languages
   - Same file organization
   - Same navigation patterns

3. **Handle Language-Specific Content**:
   - Date/time formats (document locale-specific formatting)
   - Number formats (document locale-specific formatting)
   - Cultural adaptations (not just translation)

4. **Link Between Languages**:
   - Provide language switcher
   - Link to same document in other languages
   - Maintain cross-language navigation

5. **Version Control for Translations**:
   - Track translation completeness
   - Identify outdated translations
   - Maintain translation status

### Example: Multilingual Feature Documentation

```
docs/
├── README.md                        # Language selector + overview
├── en/
│   └── features/
│       └── user-authentication/
│           ├── PRD.md              # English PRD
│           └── TASKS.md            # English tasks
├── es/
│   └── features/
│       └── user-authentication/
│           ├── PRD.md              # Spanish PRD (translated)
│           └── TASKS.md            # Spanish tasks (translated)
└── shared/
    └── features/
        └── user-authentication/
            ├── api-schema.json     # Language-agnostic API schema
            └── diagrams/           # Diagrams (language-agnostic)
```

### Documentation Structure Checklist for i18n

When setting up documentation structure for internationalization:

- [ ] Choose i18n structure pattern (language directories, filename suffixes, or hybrid)
- [ ] Document language code conventions (ISO 639-1)
- [ ] Plan for shared vs. translated content
- [ ] Establish translation workflow
- [ ] Set up translation status tracking
- [ ] Create language switcher/navigation
- [ ] Plan for cross-language linking
- [ ] Document translation guidelines
- [ ] Set up version control for translations
- [ ] Plan for RTL language support if needed

### RTL (Right-to-Left) Language Considerations

For languages like Arabic, Hebrew, or Urdu:

1. **Directory Structure**: Same structure (RTL doesn't affect file organization)
2. **Content Formatting**: May need RTL-specific formatting in rendered docs
3. **Navigation**: Navigation menus may need RTL layout
4. **Images and Diagrams**: May need mirrored versions for RTL languages

### Tools and Technologies for i18n Documentation

1. **Static Site Generators with i18n**:
   - Docusaurus (built-in i18n support)
   - GitBook (multilingual support)
   - MkDocs with i18n plugins
   - VuePress with i18n

2. **Translation Management**:
   - Crowdin for documentation
   - Transifex for technical docs
   - Lokalise for developer docs
   - Custom translation workflows

3. **Content Management**:
   - Markdown with frontmatter for language metadata
   - YAML for structured multilingual content
   - JSON for translation keys
   - Database-driven content with language fields

---

**Last Updated**: 2026-01-05  
**Version**: 1.1

---

## Review/Contribution

**Expert**: Lisa Garcia  
**Expertise**: Internationalization (i18n) and Localization  
**Date**: 2026-01-05  
**Changes**: Enhanced this documentation structure guide by adding a comprehensive "Internationalization (i18n) Considerations for Documentation Structure" section covering multilingual documentation structure patterns (language-specific directories, language suffix in filenames, hybrid approach with shared assets), documentation structure rules for i18n (consistent structure across languages, language identification using ISO 639-1 codes, shared vs. translated content classification, file naming conventions), translation workflow integration (documentation structure for translation management, translation status tracking), best practices for i18n documentation structure (planning from start, maintaining consistency, handling language-specific content, linking between languages, version control), example multilingual feature documentation structure, documentation structure checklist for i18n, RTL (right-to-left) language considerations, and tools and technologies for i18n documentation. Also fixed the date from 2025-01-05 to 2026-01-05. This addition provides practical guidance for organizing documentation to support multiple languages while maintaining clear structure and discoverability.

