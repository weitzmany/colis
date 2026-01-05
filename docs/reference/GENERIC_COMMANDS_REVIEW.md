# Generic Commands Review

This document lists generic/useful commands found in other projects that could be helpful across multiple projects.

**Last Updated**: 2025-01-05

## Commands Found in Other Projects

### ✅ Generic/Useful Commands (Recommended for Review)

These commands are generic enough to be useful across multiple projects:

#### 1. **commit** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/commit.md`
- **Description**: Simple commit to current branch (with optional message)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - basic git commit workflow
- **Notes**: 
  - Games version: Executes `.cursor/scripts/commit.sh` script
  - Discord-story-bot version: More detailed with review process and commit type detection
  - Both are useful, discord-story-bot version is more comprehensive

#### 2. **push** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/push.md`
- **Description**: Commit changes and push to origin
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - basic git push workflow
- **Notes**: Simple workflow that applies to any git project

#### 3. **update** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/update.md`
- **Description**: Update branch workflow (fetch, rebase, merge, push)
- **Usefulness**: ⭐⭐⭐⭐ Generic concept but workflow-specific
- **Notes**: 
  - Games version: Updates with development branch
  - Discord-story-bot version: Updates with main branch
  - Concept is generic, implementation depends on branch strategy

#### 4. **help** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/commands/help.md`
- **Description**: Display help information for commands (list all or specific command)
- **Usefulness**: ⭐⭐⭐⭐⭐ Very generic - helpful for any project with commands
- **Notes**: Useful meta-command for discovering available commands

### ⚠️ Project-Specific Commands (Skip These)

These commands are too specific to their projects:

#### 1. **dev** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/dev.md`
- **Description**: Merge to development branch (local, no push)
- **Reason to Skip**: ⚠️ Specific to games project's development/main branch workflow

#### 2. **stage** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/stage.md`
- **Description**: Stage/approve workflow - merge to development and push
- **Reason to Skip**: ⚠️ Specific to games project's development branch workflow

#### 3. **main** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/main.md`
- **Description**: Merge current branch to main/master
- **Reason to Skip**: ⚠️ Workflow-specific, depends on branch strategy

#### 4. **prod** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/prod.md`
- **Description**: Push to production workflow
- **Reason to Skip**: ⚠️ Workflow-specific, depends on deployment strategy

#### 5. **feature** (games, discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/feature.md`
- **Description**: 
  - Games: Complex feature workflow with TaskMaster integration, PRD generation, expert reviews
  - Discord-story-bot: Create feature branch with version increment
- **Reason to Skip**: ⚠️ Both are very project-specific workflows

#### 6. **task** (games)
- **Location**: `/Users/yoavweitzman/Documents/games/.cursor/commands/task.md`
- **Description**: Create a manual task in TaskMaster
- **Reason to Skip**: ⚠️ Specific to TaskMaster system integration

#### 7. **release** (discord-story-bot)
- **Location**: `/Users/yoavweitzman/Documents/discord-story-bot/.cursor/commands/release.md`
- **Description**: Complete a version release with changelog generation
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's version-based workflow

#### 8. **major/minor/hotfix/latest** (discord-story-bot)
- **Location**: Various files in discord-story-bot
- **Description**: Version-based branch creation (release/1.0.0, release/1.1.0, etc.)
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's version-based workflow

#### 9. **backup/restore/upload-db/download-db** (discord-story-bot)
- **Location**: Various files in discord-story-bot
- **Description**: Database backup/restore operations for EC2/S3
- **Reason to Skip**: ⚠️ Specific to discord-story-bot's AWS deployment setup

## Recommended Commands to Consider

Based on the review, here are the most generic and useful commands:

### Top Priority (Highly Generic):
1. ✅ **commit** - Basic git commit workflow (discord-story-bot version is more comprehensive)
   - Review changes before committing
   - Check for sensitive files
   - Determine commit type
   - Generate/provide commit message

2. ✅ **push** - Basic git push workflow
   - Commit changes if any exist
   - Push to origin
   - Simple and generic

3. ✅ **help** - Command help/discovery system
   - List all available commands
   - Show detailed help for specific command
   - Useful meta-command

### Lower Priority (Workflow-Dependent):
4. ✅ **update** - Branch update workflow (needs adaptation)
   - Generic concept: fetch, rebase, merge
   - Implementation depends on branch strategy (development vs main)
   - Can be adapted to any workflow

## Command Patterns Observed

### Common Patterns:
1. **Script-based commands** (games): Commands execute `.cursor/scripts/*.sh` scripts
2. **Direct workflow commands** (discord-story-bot): Commands describe workflow steps
3. **Help system**: Commands have documentation in `.cursor/commands/*.md` files

### Command File Format:
- Commands are markdown files (`.md`) in `.cursor/commands/` directory
- Format: Description, Usage, Workflow/Process, Examples
- Can reference scripts or describe direct workflows

## Notes

- Commands marked with ⭐⭐⭐⭐⭐ are highly generic and recommended
- Workflow-specific commands (dev, stage, main, prod) should be skipped or heavily adapted
- Script-based commands require corresponding shell scripts
- Direct workflow commands are self-contained in the markdown file
- Some commands may need adaptation for this project's workflow

---

**Next Steps**: Review each recommended command and decide which ones to adopt/adapt for this project, and whether to use script-based or direct workflow approach.

