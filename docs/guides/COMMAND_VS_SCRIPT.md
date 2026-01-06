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

## RESTful Design Principles for Commands and Scripts

Applying RESTful API design principles to command and script architecture can improve consistency, maintainability, and developer experience.

### Resource-Based Command Design

Commands should follow resource-based thinking similar to RESTful APIs:

**✅ DO: Resource-Oriented Commands**
- `/local/review` - Operates on review resources
- `/local/expert` - Retrieves expert resources
- `/local/file` - Operates on file resources

**❌ DON'T: Action-Oriented Commands**
- `/local/do-review` - Verb-based naming
- `/local/get-expert` - Unnecessary verb
- `/local/select-file` - Action-oriented

### HTTP Method Equivalents in Commands

Map HTTP methods to command patterns:

| HTTP Method | Command Pattern | Script Pattern | Use Case |
|-------------|----------------|----------------|----------|
| GET | `/local/resource` | `get-resource.sh` | Retrieve/read data |
| POST | `/local/resource` with params | `create-resource.sh` | Create new resources |
| PUT | `/local/resource` with update params | `update-resource.sh` | Full resource update |
| PATCH | `/local/resource` with partial params | `patch-resource.sh` | Partial resource update |
| DELETE | `/local/resource` with delete flag | `delete-resource.sh` | Remove resources |

**Example Command Patterns:**
```markdown
# GET equivalent - Retrieves information
/local/review              # List or show review options
/local/expert              # Get expert information

# POST equivalent - Creates resources
/local/review expert="new" # Create new review with expert
/local/review file="new"   # Create new file with review

# PUT/PATCH equivalent - Updates resources
/local/review file="README.md" # Update file via review
/local/update-tracker          # Update tracker resource
```

### Consistent Response Patterns

Just as REST APIs use consistent response structures, commands and scripts should follow predictable patterns:

**Command Response Pattern:**
```markdown
## Expected Output Format

Commands should output structured, parseable responses:
- Success: Clear confirmation with relevant data
- Error: Descriptive error message with exit code
- Status: Progress indicators for long-running operations
```

**Script Response Pattern:**
```bash
# ✅ DO: Consistent script output
# Success output to stdout
echo "Resource created: $resource_path"

# Error output to stderr
echo "Error: Resource not found" >&2
exit 1

# Exit codes: 0 = success, non-zero = error
```

### Error Handling Consistency

Apply RESTful error handling patterns to commands and scripts:

**Error Response Structure:**
```bash
# Script error response (similar to API error format)
{
  "error": {
    "message": "File not found",
    "code": "FILE_NOT_FOUND",
    "details": {
      "file": "docs/example.md",
      "path": "./docs/example.md"
    }
  },
  "timestamp": "2026-01-05T12:00:00Z"
}
```

**Command Error Handling:**
- Use consistent error messages
- Provide actionable error details
- Include error codes for programmatic handling
- Follow RESTful status code concepts (200/201/400/404/500 equivalents)

### Versioning Commands and Scripts

Apply API versioning strategies to commands:

**Command Versioning:**
```markdown
# Versioned commands (similar to /api/v1/)
/local/v1/review
/local/v2/review  # New version with breaking changes

# Or use command parameters for versioning
/local/review version=2
```

**Script Versioning:**
```bash
# Versioned scripts
review-v1.sh
review-v2.sh

# Or use semantic versioning in script names
review-1.0.0.sh
review-1.1.0.sh
```

**Deprecation Strategy:**
- Announce deprecated commands/scripts in documentation
- Provide migration guides (like API migration guides)
- Support old versions for transition period
- Clear deprecation timelines

### Request/Response Validation

Apply API validation principles:

**Command Parameter Validation:**
```markdown
## Command Parameters (similar to API query parameters)

/local/review expert="Andrew Lee"  # Required parameter
/local/review file="README.md"      # Required parameter
/local/review tag="api"            # Optional parameter

# Validation rules:
# - Required parameters must be present
# - Parameter format validation
# - Type checking (string, integer, boolean)
```

**Script Input Validation:**
```bash
# ✅ DO: Validate script inputs (like API input validation)
if [ -z "$1" ]; then
    echo "Error: Required parameter missing" >&2
    exit 1
fi

# Validate file exists
if [ ! -f "$file_path" ]; then
    echo "Error: File not found: $file_path" >&2
    exit 1
fi
```

### Documentation Standards

Apply OpenAPI/Swagger documentation principles to commands:

**Command Documentation Structure:**
```markdown
## Command Documentation (similar to OpenAPI spec)

### /local/review

**Description**: Review files with expert personas

**Parameters**:
- `expert` (optional, string): Expert name or "new"
- `file` (optional, string): File name or "new"

**Examples**:
- `/local/review` - Random expert, random file
- `/local/review expert="Andrew Lee"` - Specific expert
- `/local/review file="README.md"` - Specific file

**Errors**:
- `EXPERT_NOT_FOUND`: Expert doesn't exist
- `FILE_NOT_FOUND`: File doesn't exist
```

**Script Documentation:**
```bash
#!/bin/bash
#
# Script: review-file.sh
# Description: Review a file with specified expert
# 
# Parameters:
#   $1 - Expert name (required)
#   $2 - File path (required)
#
# Exit codes:
#   0 - Success
#   1 - Invalid parameters
#   2 - Expert not found
#   3 - File not found
```

### Consistency Principles

Apply RESTful consistency principles:

1. **Naming Consistency**: Use consistent naming patterns across all commands and scripts
2. **Parameter Consistency**: Similar operations use similar parameter names
3. **Response Consistency**: Similar operations return similar response formats
4. **Error Consistency**: Consistent error handling and messaging
5. **Documentation Consistency**: All commands/scripts documented with same structure

**Example Consistent Patterns:**
```markdown
# Consistent command structure
/local/{resource}                    # List/retrieve resource
/local/{resource} {id}               # Get specific resource
/local/{resource} {action}           # Perform action on resource

# Consistent script structure
{resource}-list.sh                   # List resources
{resource}-get.sh {id}              # Get resource
{resource}-{action}.sh {id}         # Action on resource
```

### Rate Limiting and Resource Management

Apply API rate limiting concepts to commands:

**Command Execution Limits:**
- Limit concurrent command executions
- Queue long-running commands
- Implement command execution timeouts
- Track command usage metrics

**Script Resource Management:**
- Limit script execution time
- Monitor script resource usage
- Implement script cancellation
- Queue expensive script operations

### API-Like Command Contracts

Define clear contracts for commands (like API contracts):

**Command Contract Example:**
```markdown
## Command Contract: /local/review

**Input Contract**:
- Parameters: expert (string, optional), file (string, optional)
- Validation: Expert must exist or be "new", file must exist or be "new"

**Output Contract**:
- Success: Expert name and file path
- Error: Error message with code and details
- Side Effects: Updates tracker, creates files, commits changes

**Behavior Contract**:
- Atomicity: All-or-nothing operations
- Idempotency: Safe to retry
- Consistency: Updates tracker atomically
```

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

**Expert**: Andrew Lee  
**Expertise**: RESTful API Design  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "RESTful Design Principles for Commands and Scripts" section applying RESTful API design principles to command and script architecture. The addition includes resource-based command design (resource-oriented naming conventions, avoiding action-oriented commands), HTTP method equivalents in commands and scripts (GET/POST/PUT/PATCH/DELETE patterns with command and script examples), consistent response patterns (structured command outputs, standardized script responses), error handling consistency (RESTful error response structures, actionable error details, error codes), versioning commands and scripts (API versioning strategies applied to commands, script versioning patterns, deprecation strategies with migration guides), request/response validation (command parameter validation with examples, script input validation patterns), documentation standards (OpenAPI/Swagger-like documentation structure for commands, script documentation patterns with exit codes), consistency principles (naming, parameter, response, error, and documentation consistency across commands and scripts), rate limiting and resource management concepts, and API-like command contracts (input/output/behavior contracts with examples). This addition ensures commands and scripts follow RESTful design principles, resulting in consistent, maintainable, and developer-friendly command and script architectures that mirror best practices from RESTful API design.

---

