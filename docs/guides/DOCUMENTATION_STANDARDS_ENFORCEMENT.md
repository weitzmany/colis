# Documentation Standards Enforcement Guide

This guide provides comprehensive strategies for ensuring all projects follow the documentation standards defined in this packages repository.

**Last Updated**: 2026-01-05

## Overview

This guide covers multiple enforcement mechanisms to ensure documentation standards are consistently applied across all projects:

1. **Cursor Rules Distribution** - Automatic rule enforcement via Cursor IDE
2. **CI/CD Validation** - Automated checks in continuous integration
3. **Pre-commit Hooks** - Local validation before commits
4. **Documentation Validation Scripts** - Standalone validation tools
5. **Project Templates** - Standardized project structure
6. **Documentation Review Process** - Manual review workflows
7. **Standardization Checklist** - Implementation checklist

## 1. Cursor Rules Distribution

### How It Works

Cursor rules (`.cursor/rules/`) are automatically applied when present in a project. These rules enforce documentation structure, planning mode, and other standards.

### Implementation Strategy

#### Step 1: Create Standard Rules Package

Create a standardized set of rules in this packages repository:

```
packages/
├── .cursor/
│   └── rules/
│       ├── user/
│       │   ├── documentation_structure.mdc
│       │   ├── planning_mode.mdc
│       │   └── security_and_secrets.mdc
│       └── experts/
│           └── [all expert personas]
```

#### Step 2: Distribution Script

Create a script to copy rules to projects:

```bash
#!/bin/bash
# scripts/distribute-rules.sh

# Copy Cursor rules to target project
TARGET_PROJECT="$1"
PACKAGES_DIR="$(cd "$(dirname "$0")/.." && pwd)"

if [ -z "$TARGET_PROJECT" ]; then
    echo "Usage: $0 <target-project-path>"
    exit 1
fi

# Copy user rules
mkdir -p "$TARGET_PROJECT/.cursor/rules/user"
cp -r "$PACKAGES_DIR/.cursor/rules/user/"* "$TARGET_PROJECT/.cursor/rules/user/"

# Copy expert personas (optional)
if [ -d "$PACKAGES_DIR/.cursor/rules/experts" ]; then
    mkdir -p "$TARGET_PROJECT/.cursor/rules/experts"
    cp -r "$PACKAGES_DIR/.cursor/rules/experts/"* "$TARGET_PROJECT/.cursor/rules/experts/"
fi

echo "✅ Rules distributed to $TARGET_PROJECT"
```

#### Step 3: Automated Distribution

For multiple projects, create a batch distribution script:

```bash
#!/bin/bash
# scripts/distribute-rules-to-all-projects.sh

PROJECTS_DIR="$HOME/Documents"
PACKAGES_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# List of projects to update
PROJECTS=(
    "$PROJECTS_DIR/games"
    "$PROJECTS_DIR/sandbox"
    "$PROJECTS_DIR/bots"
    # Add more projects as needed
)

for project in "${PROJECTS[@]}"; do
    if [ -d "$project" ]; then
        echo "Distributing rules to $(basename "$project")..."
        "$PACKAGES_DIR/scripts/distribute-rules.sh" "$project"
    else
        echo "⚠️  Project not found: $project"
    fi
done
```

### Benefits

- ✅ **Automatic Enforcement**: Rules are automatically applied in Cursor IDE
- ✅ **Consistent Standards**: Same rules across all projects
- ✅ **Easy Updates**: Update once, distribute to all projects
- ✅ **No Manual Configuration**: Rules work immediately after copying

### Maintenance

- **Update Rules**: Update rules in packages repository
- **Distribute Updates**: Run distribution script to update all projects
- **Version Control**: Track rule versions in each project's git

## 2. CI/CD Validation

### GitHub Actions Workflow

Create a reusable GitHub Actions workflow for documentation validation:

```yaml
# .github/workflows/validate-documentation.yml

name: Validate Documentation

on:
  pull_request:
    paths:
      - 'docs/**'
      - '.cursor/rules/**'
  push:
    branches: [main, develop]
    paths:
      - 'docs/**'

jobs:
  validate-documentation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Documentation Structure
        run: |
          # Check that no .md files exist in docs/ root (except README.md)
          find docs -maxdepth 1 -name "*.md" ! -name "README.md" && exit 1 || true
          
          # Check that features are in features/ subdirectories
          if [ -d "docs/features" ]; then
            for feature_dir in docs/features/*/; do
              if [ ! -f "$feature_dir/PRD.md" ]; then
                echo "❌ Missing PRD.md in $feature_dir"
                exit 1
              fi
              if [ ! -f "$feature_dir/TASKS.md" ]; then
                echo "❌ Missing TASKS.md in $feature_dir"
                exit 1
              fi
            done
          fi
          
          # Check directory naming (kebab-case)
          find docs -type d -name "*[A-Z]*" && echo "❌ Directories must use kebab-case" && exit 1 || true
          
          echo "✅ Documentation structure validated"
      
      - name: Validate Links
        run: |
          # Check for broken internal links
          # Requires markdown-link-check or similar tool
          npx markdown-link-check docs/**/*.md || true
      
      - name: Validate Markdown Syntax
        run: |
          # Check markdown syntax
          npx markdownlint docs/**/*.md || true
```

### Validation Script

Create a standalone validation script:

```bash
#!/bin/bash
# scripts/validate-documentation.sh

set -e

ERRORS=0

echo "🔍 Validating documentation structure..."

# Check 1: No .md files in docs/ root (except README.md)
echo "Checking docs/ root for .md files..."
ROOT_MD_FILES=$(find docs -maxdepth 1 -name "*.md" ! -name "README.md" 2>/dev/null || true)
if [ -n "$ROOT_MD_FILES" ]; then
    echo "❌ ERROR: Found .md files in docs/ root (only README.md allowed):"
    echo "$ROOT_MD_FILES"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Features have required files
echo "Checking feature documentation..."
if [ -d "docs/features" ]; then
    for feature_dir in docs/features/*/; do
        if [ -d "$feature_dir" ]; then
            feature_name=$(basename "$feature_dir")
            if [ ! -f "$feature_dir/PRD.md" ]; then
                echo "❌ ERROR: Missing PRD.md in docs/features/$feature_name/"
                ERRORS=$((ERRORS + 1))
            fi
            if [ ! -f "$feature_dir/TASKS.md" ]; then
                echo "❌ ERROR: Missing TASKS.md in docs/features/$feature_name/"
                ERRORS=$((ERRORS + 1))
            fi
        fi
    done
fi

# Check 3: Directory naming (kebab-case)
echo "Checking directory naming (kebab-case)..."
UPPERCASE_DIRS=$(find docs -type d -name "*[A-Z]*" 2>/dev/null || true)
if [ -n "$UPPERCASE_DIRS" ]; then
    echo "❌ ERROR: Directories must use kebab-case (no uppercase letters):"
    echo "$UPPERCASE_DIRS"
    ERRORS=$((ERRORS + 1))
fi

# Check 4: File naming (kebab-case)
echo "Checking file naming (kebab-case)..."
UPPERCASE_FILES=$(find docs -type f -name "*[A-Z]*.md" ! -name "README.md" 2>/dev/null || true)
if [ -n "$UPPERCASE_FILES" ]; then
    echo "❌ ERROR: Files must use kebab-case (no uppercase letters, except README.md):"
    echo "$UPPERCASE_FILES"
    ERRORS=$((ERRORS + 1))
fi

# Summary
if [ $ERRORS -eq 0 ]; then
    echo "✅ All documentation structure checks passed!"
    exit 0
else
    echo "❌ Found $ERRORS error(s). Please fix before committing."
    exit 1
fi
```

### Integration

1. **Add to CI/CD**: Include validation in GitHub Actions, GitLab CI, or Jenkins
2. **Fail on Errors**: Set workflow to fail if validation fails
3. **PR Checks**: Require validation to pass before merging PRs
4. **Status Badges**: Add status badges to README showing validation status

## 3. Pre-commit Hooks

### Git Pre-commit Hook

Create a pre-commit hook that validates documentation before commits:

```bash
#!/bin/bash
# .git/hooks/pre-commit

# Run documentation validation
SCRIPT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
if [ -f "$SCRIPT_DIR/scripts/validate-documentation.sh" ]; then
    "$SCRIPT_DIR/scripts/validate-documentation.sh"
    if [ $? -ne 0 ]; then
        echo "❌ Documentation validation failed. Commit aborted."
        exit 1
    fi
fi

exit 0
```

### Pre-commit Framework Integration

Use the pre-commit framework for better hook management:

```yaml
# .pre-commit-config.yaml

repos:
  - repo: local
    hooks:
      - id: validate-documentation
        name: Validate Documentation Structure
        entry: scripts/validate-documentation.sh
        language: system
        files: ^docs/
        pass_filenames: false
      
      - id: markdown-lint
        name: Markdown Lint
        entry: npx markdownlint
        language: system
        files: \.md$
        args: ['--fix']
      
      - id: markdown-link-check
        name: Check Markdown Links
        entry: npx markdown-link-check
        language: system
        files: \.md$
        args: ['--config', '.markdown-link-check.json']
```

### Installation

```bash
# Install pre-commit framework
pip install pre-commit

# Install hooks
pre-commit install

# Test hooks
pre-commit run --all-files
```

### Benefits

- ✅ **Local Validation**: Catch issues before committing
- ✅ **Consistent Checks**: Same validation as CI/CD
- ✅ **Fast Feedback**: Immediate validation results
- ✅ **Prevent Bad Commits**: Block commits that violate standards

## 4. Documentation Validation Scripts

### Comprehensive Validation Script

Create a comprehensive validation script with multiple checks:

```bash
#!/bin/bash
# scripts/validate-documentation-comprehensive.sh

set -e

ERRORS=0
WARNINGS=0

echo "🔍 Comprehensive Documentation Validation"
echo "=========================================="

# Function to report errors
report_error() {
    echo "❌ ERROR: $1"
    ERRORS=$((ERRORS + 1))
}

# Function to report warnings
report_warning() {
    echo "⚠️  WARNING: $1"
    WARNINGS=$((WARNINGS + 1))
}

# Check 1: Documentation structure
echo ""
echo "1. Checking documentation structure..."
if [ ! -d "docs" ]; then
    report_error "docs/ directory not found"
else
    # Check root .md files
    ROOT_MD=$(find docs -maxdepth 1 -name "*.md" ! -name "README.md" 2>/dev/null || true)
    if [ -n "$ROOT_MD" ]; then
        report_error "Found .md files in docs/ root (only README.md allowed): $ROOT_MD"
    fi
    
    # Check feature structure
    if [ -d "docs/features" ]; then
        for feature in docs/features/*/; do
            if [ -d "$feature" ]; then
                if [ ! -f "$feature/PRD.md" ]; then
                    report_error "Missing PRD.md in $feature"
                fi
                if [ ! -f "$feature/TASKS.md" ]; then
                    report_error "Missing TASKS.md in $feature"
                fi
            fi
        done
    fi
fi

# Check 2: Naming conventions
echo ""
echo "2. Checking naming conventions..."
# Directory naming (kebab-case)
UPPERCASE_DIRS=$(find docs -type d -name "*[A-Z]*" 2>/dev/null || true)
if [ -n "$UPPERCASE_DIRS" ]; then
    report_error "Directories must use kebab-case: $UPPERCASE_DIRS"
fi

# File naming (kebab-case, except README.md)
UPPERCASE_FILES=$(find docs -type f -name "*[A-Z]*.md" ! -name "README.md" 2>/dev/null || true)
if [ -n "$UPPERCASE_FILES" ]; then
    report_error "Files must use kebab-case: $UPPERCASE_FILES"
fi

# Check 3: Required documentation files
echo ""
echo "3. Checking required documentation files..."
if [ ! -f "docs/README.md" ]; then
    report_warning "docs/README.md not found (recommended)"
fi

# Check 4: Link validation (if markdown-link-check is available)
echo ""
echo "4. Checking internal links..."
if command -v markdown-link-check &> /dev/null; then
    find docs -name "*.md" -exec markdown-link-check {} \; || true
else
    report_warning "markdown-link-check not installed (optional)"
fi

# Check 5: Markdown syntax (if markdownlint is available)
echo ""
echo "5. Checking markdown syntax..."
if command -v markdownlint &> /dev/null; then
    markdownlint docs/**/*.md || true
else
    report_warning "markdownlint not installed (optional)"
fi

# Summary
echo ""
echo "=========================================="
echo "Validation Summary:"
echo "  Errors: $ERRORS"
echo "  Warnings: $WARNINGS"

if [ $ERRORS -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        echo "✅ All checks passed!"
        exit 0
    else
        echo "⚠️  Validation passed with warnings"
        exit 0
    fi
else
    echo "❌ Validation failed with $ERRORS error(s)"
    exit 1
fi
```

### Usage

```bash
# Run validation
./scripts/validate-documentation-comprehensive.sh

# Run in CI/CD
# Add to GitHub Actions, GitLab CI, etc.
```

## 5. Project Templates

### Standard Project Template

Create a project template with standard documentation structure:

```
project-template/
├── .cursor/
│   └── rules/
│       └── user/
│           ├── documentation_structure.mdc
│           └── planning_mode.mdc
├── docs/
│   ├── README.md
│   ├── .PLANNING_MODE
│   ├── features/
│   ├── guides/
│   ├── reference/
│   └── architecture/
├── scripts/
│   ├── validate-documentation.sh
│   └── setup-project.sh
└── .github/
    └── workflows/
        └── validate-documentation.yml
```

### Template Setup Script

```bash
#!/bin/bash
# scripts/setup-project-template.sh

PROJECT_NAME="$1"
PROJECT_PATH="$2"

if [ -z "$PROJECT_NAME" ] || [ -z "$PROJECT_PATH" ]; then
    echo "Usage: $0 <project-name> <project-path>"
    exit 1
fi

# Create project structure
mkdir -p "$PROJECT_PATH"
cd "$PROJECT_PATH"

# Initialize git
git init

# Create documentation structure
mkdir -p docs/{features,guides,reference,architecture}
touch docs/README.md
touch docs/.PLANNING_MODE

# Copy Cursor rules
mkdir -p .cursor/rules/user
cp -r "$PACKAGES_DIR/.cursor/rules/user/"* .cursor/rules/user/

# Copy validation scripts
mkdir -p scripts
cp "$PACKAGES_DIR/scripts/validate-documentation.sh" scripts/

# Copy CI/CD workflows
mkdir -p .github/workflows
cp "$PACKAGES_DIR/.github/workflows/validate-documentation.yml" .github/workflows/

# Create initial README
cat > docs/README.md << EOF
# $PROJECT_NAME Documentation

## Overview

[Project description]

## Structure

- \`features/\` - Feature documentation (PRDs, TASKS)
- \`guides/\` - General guides and how-tos
- \`reference/\` - Reference documentation
- \`architecture/\` - Architecture documentation

## Getting Started

[Getting started instructions]
EOF

echo "✅ Project template created at $PROJECT_PATH"
```

## 6. Documentation Review Process

### Review Checklist

Create a standard review checklist for documentation:

```markdown
# Documentation Review Checklist

## Structure
- [ ] Documentation follows standard structure (features/, guides/, reference/, architecture/)
- [ ] No .md files in docs/ root (except README.md)
- [ ] Features have PRD.md and TASKS.md
- [ ] Directory and file names use kebab-case

## Content
- [ ] Clear introduction and overview
- [ ] Step-by-step instructions (when applicable)
- [ ] Code examples provided and tested
- [ ] All parameters documented
- [ ] Error cases explained
- [ ] Related documentation linked

## Quality
- [ ] Grammar and spelling checked
- [ ] Formatting is consistent
- [ ] Links are valid
- [ ] Examples are up-to-date
- [ ] Documentation is complete

## Standards
- [ ] Follows documentation structure rules
- [ ] Follows security and secrets rules
- [ ] Follows planning mode rules (if applicable)
- [ ] Expert review completed (if applicable)
```

### Review Workflow

1. **Create Documentation**: Follow standard structure
2. **Self-Review**: Use checklist before submitting
3. **Automated Validation**: Run validation scripts
4. **Peer Review**: Request review from team
5. **Expert Review**: Use expert review workflow (`/local/review`)
6. **Merge**: Merge after all checks pass

## 7. Standardization Checklist

### Implementation Checklist

Use this checklist when setting up standards enforcement for a project:

- [ ] **Cursor Rules**: Copy rules from packages repository
- [ ] **Validation Scripts**: Add documentation validation scripts
- [ ] **Pre-commit Hooks**: Set up pre-commit hooks
- [ ] **CI/CD Integration**: Add validation to CI/CD pipeline
- [ ] **Project Structure**: Create standard docs/ structure
- [ ] **Documentation Template**: Set up documentation templates
- [ ] **Review Process**: Establish documentation review process
- [ ] **Team Training**: Train team on documentation standards
- [ ] **Monitoring**: Set up monitoring for standards compliance
- [ ] **Documentation**: Document the enforcement process

### Maintenance Checklist

Regular maintenance tasks:

- [ ] **Update Rules**: Keep rules synchronized across projects
- [ ] **Update Scripts**: Update validation scripts as needed
- [ ] **Review Standards**: Periodically review and update standards
- [ ] **Monitor Compliance**: Check compliance across projects
- [ ] **Gather Feedback**: Collect feedback on standards
- [ ] **Improve Process**: Continuously improve enforcement process

## Best Practices

### 1. Start Early

- Set up standards enforcement from project start
- Use project templates for new projects
- Establish standards before code is written

### 2. Automate Everything

- Use CI/CD for automated validation
- Use pre-commit hooks for local validation
- Automate rule distribution

### 3. Make It Easy

- Provide clear documentation
- Create setup scripts
- Offer templates and examples

### 4. Enforce Consistently

- Apply same standards to all projects
- Don't allow exceptions without justification
- Review and update standards regularly

### 5. Monitor and Improve

- Track compliance metrics
- Gather feedback from team
- Continuously improve standards

## Tools and Resources

### Validation Tools

- **markdownlint**: Markdown linting
- **markdown-link-check**: Link validation
- **pre-commit**: Git hook framework
- **GitHub Actions**: CI/CD automation
- **GitLab CI**: CI/CD automation

### Documentation Tools

- **Docusaurus**: Documentation site generator
- **MkDocs**: Markdown documentation generator
- **GitBook**: Documentation platform
- **VuePress**: Vue-powered static site generator

### Distribution Tools

- **Git Submodules**: Share rules across projects
- **NPM Packages**: Package rules as npm package
- **Scripts**: Custom distribution scripts

## Troubleshooting

### Common Issues

1. **Rules Not Applied**: Check that rules are in `.cursor/rules/` directory
2. **Validation Fails**: Run validation script locally to debug
3. **CI/CD Fails**: Check CI/CD logs for specific errors
4. **Pre-commit Hooks Not Working**: Verify hooks are executable

### Getting Help

- Check documentation in `docs/guides/`
- Review validation script output
- Check CI/CD logs
- Review project templates

### Mobile Considerations for Documentation Standards Enforcement

When enforcing documentation standards with mobile development in mind:

1. **Mobile Validation**
   - Validation scripts should work on mobile terminals and devices
   - CI/CD validation should account for mobile build environments
   - Pre-commit hooks should be efficient on mobile file systems

2. **Mobile Distribution**
   - Documentation standards distribution should work on mobile development environments
   - Template copying should handle mobile storage constraints
   - Mobile-friendly validation feedback and error messages

3. **Mobile Development Workflow**
   - Standards enforcement should support mobile SSH/terminal workflows
   - Validation should be optimized for mobile processing constraints
   - Mobile-friendly documentation review tools and processes

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (documentation standards, documentation enforcement, CI/CD validation, documentation validation)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive enforcement examples and implementation guides for content depth

2. **Technical Documentation SEO**
   - Document enforcement mechanisms with clear, searchable descriptions
   - Include code examples demonstrating validation and enforcement patterns
   - Use semantic HTML structure in documentation
   - Add internal links to related documentation standards and validation documentation

3. **Content Quality for Search**
   - Ensure guide answers common documentation enforcement queries
   - Include troubleshooting sections for common enforcement issues
   - Provide comprehensive enforcement strategy reference documentation
   - Maintain documentation freshness with documentation tooling updates

---

## Review/Contribution

**Expert**: System Architect  
**Date**: 2026-01-05  
**Changes**: Created comprehensive guide for enforcing documentation standards across all projects. This guide covers Cursor rules distribution (automatic rule enforcement, distribution scripts, automated distribution), CI/CD validation (GitHub Actions workflow, validation script, integration), pre-commit hooks (Git pre-commit hook, pre-commit framework integration, installation), documentation validation scripts (comprehensive validation script with multiple checks), project templates (standard project template, template setup script), documentation review process (review checklist, review workflow), standardization checklist (implementation checklist, maintenance checklist), best practices (start early, automate everything, make it easy, enforce consistently, monitor and improve), tools and resources (validation tools, documentation tools, distribution tools), and troubleshooting (common issues, getting help). This guide provides practical, actionable strategies for ensuring all projects follow documentation standards consistently.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile considerations for documentation standards enforcement section covering mobile validation (mobile terminal compatibility, mobile build environments, efficient pre-commit hooks), mobile distribution (mobile development environments, mobile storage constraints, mobile-friendly feedback), and mobile development workflow (SSH/terminal workflows, mobile processing constraints, mobile-friendly review tools). This addition ensures documentation standards enforcement works well on mobile devices and mobile development workflows.

---

