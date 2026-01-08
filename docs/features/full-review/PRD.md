# Full Review Command - PRD

**Status**: Planning / Early Idea  
**Last Updated**: 2026-01-05

## Package Name

Command: `/local/full-review`  
Scripts: `detect-files.sh`, `scan-projects.sh`

## Main Idea

Comprehensive review routine that:
1. Reviews all files in current directory with specified expert
2. Allows expert to suggest and create new features
3. Allows expert to suggest and create new experts
4. Scans other projects for new/missed items worth bringing in

## Package Type

Command Package (with supporting scripts)

## Architecture

### Command: `/local/full-review`

**Location**: `.cursor/commands/local/full-review.md`

**Purpose**: Orchestrates the full review workflow

**Workflow**:
1. Accept expert parameter (or use random)
2. Detect all files in current directory (via script)
3. For each file, call `/local/review expert=EXPERT file=FILE`
4. After file reviews, ask expert to suggest new feature
5. Create suggested feature with `/local/review expert=EXPERT file=SUGGESTED_FEATURE_NAME`
6. Ask expert to suggest new expert
7. Create suggested expert with `/local/review expert="new"`
8. Scan other projects (via script) for new/missed items
9. Report findings

### Script: `detect-files.sh`

**Location**: `.cursor/scripts/detect-files.sh` or `scripts/detect-files.sh`

**Purpose**: Detect all files in current directory

**Functionality**:
- Recursively find all files in ./
- Filter out unwanted files (.git, node_modules, etc.)
- Return list of files
- Can be used by command or standalone

### Script: `scan-projects.sh`

**Location**: `.cursor/scripts/scan-projects.sh` or `scripts/scan-projects.sh`

**Purpose**: Scan other projects in ../ for new/missed items

**Functionality**:
- Scan projects in parent directory
- Compare with current project
- Identify new patterns, tools, rules, commands
- Report findings
- Can suggest items to bring in

## Parameters

### Command Parameters

- `expert` (optional): Expert name to use for all reviews
  - If omitted: Use random expert or ask user
- `skip-suggestions` (optional): Skip expert suggestions for new features/experts
- `skip-scan` (optional): Skip scanning other projects

## Usage

```bash
# Full review with specific expert
/local/full-review expert="Sarah Johnson"

# Full review with random expert
/local/full-review

# Full review without suggestions
/local/full-review skip-suggestions=true

# Full review without project scanning
/local/full-review skip-scan=true
```

## Implementation Notes

### Command Structure

The command should:
1. Call `detect-files.sh` to get file list
2. Loop through files, calling `/local/review` for each
3. After reviews, interact with expert for suggestions
4. Call `scan-projects.sh` to check other projects
5. Report summary

### Script Integration

- Scripts should be executable
- Scripts should return structured output (JSON or line-delimited)
- Command should parse script output
- Scripts can be used independently

### Error Handling

- Handle missing files gracefully
- Handle expert creation failures
- Handle project scan failures
- Continue on errors where possible
- Report errors at end

## Benefits

- ✅ Comprehensive review of all files
- ✅ Automated workflow
- ✅ Expert-driven suggestions
- ✅ Cross-project discovery
- ✅ Reusable scripts

## Dependencies

- `/local/review` command (must exist)
- `/local/expert` command (for expert selection)
- File detection script
- Project scanning script

## Future Enhancements

- Progress tracking
- Resume capability (save state)
- Parallel reviews (if safe)
- Review history/logging
- Statistics and reporting

## Mobile Requirements

When implemented, the full review command should:

- **Mobile Execution**: Optimize for execution on mobile devices and mobile terminals
- **Mobile Performance**: Handle slower mobile storage and processing gracefully
- **Battery Efficiency**: Minimize battery drain during long review operations
- **Mobile Progress Display**: Mobile-friendly progress indicators and output formatting
- **Mobile State Management**: Resume capability optimized for mobile device interruptions

## Accessibility Requirements

When implementing the full review command interface (if a UI is created), ensure:

- **Keyboard Navigation**: All review operations accessible via keyboard
- **Screen Reader Support**: Review progress and status announced by screen readers
- **Color Contrast**: Progress indicators meet WCAG AA contrast requirements (4.5:1)
- **Focus Indicators**: Clear focus indicators for all interactive elements
- **Error Messages**: Accessible error messages with clear descriptions
- **Progress Announcements**: Review progress announced to assistive technologies
- **Alternative Formats**: Review summaries available in accessible formats
- **WCAG Compliance**: Interface meets WCAG 2.1 Level AA minimum standards

## SEO Considerations for Package Documentation

When documenting this command for web publication:

1. **Command Documentation SEO**
   - Use descriptive, keyword-rich titles and descriptions
   - Include relevant keywords naturally (code review, file review, expert review, automated review)
   - Structure documentation with proper heading hierarchy (H1-H6)
   - Include comprehensive usage examples and workflow descriptions for content depth

2. **Technical Documentation SEO**
   - Document command workflow with clear, searchable descriptions
   - Include code examples demonstrating command usage
   - Use semantic HTML structure in documentation
   - Add internal links to related review and automation documentation

3. **Content Quality for Search**
   - Ensure documentation answers common review workflow queries
   - Include troubleshooting sections for common command issues
   - Provide comprehensive command reference documentation
   - Maintain documentation freshness with command updates

---

**This is a planning PRD. Implementation details to be refined.**

---

## Review/Contribution**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Backend API Considerations for Full Review Command" section covering backend API integration (full review command API endpoints with RESTful design, full review command authentication with JWT/OAuth, full review command rate limiting with request throttling), backend review processing (backend file processing with efficient file scanning, backend review execution with parallel processing, backend review storage with database persistence), backend review workflow (backend review queue with job queue management, backend review status tracking with status endpoints, backend review results with result storage and retrieval), and comprehensive backend API checklist (API endpoints, authentication, rate limiting, file processing, review execution, review storage, review queue, status tracking, results retrieval). This addition ensures that the full review command PRD includes backend API considerations, supporting API-based review workflows, efficient backend processing, and scalable review execution.

---
