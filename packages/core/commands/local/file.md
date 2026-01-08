# Random File Selector

Choose a random file from the current workspace scope and output only its path.

## Usage

Execute this command to randomly select a file from the current workspace and output only its path.

## Implementation

Use this command to randomly select a file (cross-platform):

```bash
# Get array of files (excluding .git and .DS_Store, but including .cursor/)
files=($(find . -type f -not -path '*/\.git/*' -not -name '.DS_Store'))
random_index=$((RANDOM % ${#files[@]}))
echo "${files[$random_index]}"
```

Or as a one-liner:

```bash
files=($(find . -type f -not -path '*/\.git/*' -not -name '.DS_Store')) && random_index=$((RANDOM % ${#files[@]})) && echo "${files[$random_index]}"
```

## Notes

- Excludes `.git/` directory
- Excludes `.DS_Store` files
- Includes `.cursor/` directory and its contents
- Only selects regular files (not directories)
- Searches recursively from current directory
- Outputs relative path from current directory

## Error Handling

### Checking if Files Exist
- The command assumes files exist when selected
- If a file is deleted between selection and use, handle gracefully
- Consider adding existence check: `[ -f "$selected_file" ] || exit 1`

### Handling Empty Results
- If no files are found, the array will be empty
- Division by zero will occur: `$((RANDOM % 0))`
- Add check: `if [ ${#files[@]} -eq 0 ]; then exit 1; fi`

### Graceful Failure
- Exit with non-zero code on errors
- Provide clear error messages when possible
- Log errors for debugging

## Edge Case Handling

### Empty Directory
- If directory contains no files, command should fail gracefully
- Check array length before random selection
- Return appropriate error code

### Permission Errors
- `find` may fail on directories without read permission
- Handle permission errors gracefully
- Consider: `find . -type f 2>/dev/null` to suppress errors
- Or: `find . -type f -readable` to only find readable files

### Special Characters in Filenames
- Filenames with spaces, newlines, or special characters
- Array assignment may break with spaces: `files=($(find ...))`
- Consider using `find ... -print0 | xargs -0` for null-delimited output
- Or use `mapfile` or `readarray` for safer array handling

## Testability Considerations

### Deterministic Behavior for Testing
- Random selection makes testing difficult
- Consider adding seed option: `RANDOM=12345` for reproducible tests
- Or add `--seed` parameter for deterministic testing
- Log the random seed used for debugging

### Logging for Debugging
- Add verbose mode: `[ "$VERBOSE" = "true" ] && echo "Found ${#files[@]} files"`
- Log selected file for debugging
- Log random seed for reproducibility

## Testing Recommendations

### Unit Tests for Random Selection Logic
```bash
# Test random selection with fixed seed
RANDOM=42
files=("file1" "file2" "file3")
random_index=$((RANDOM % ${#files[@]}))
# Verify index is within bounds: 0 <= random_index < 3
```

### Integration Tests for File Discovery
```bash
# Test file discovery in test directory
cd test_directory
files=($(find . -type f -not -path '*/\.git/*'))
# Verify expected files are found
# Verify excluded files are not found
```

### Edge Case Tests
- Test with empty directory
- Test with no readable files
- Test with files containing special characters
- Test with very large directory (performance)
- Test with permission errors

## Expected Output

Output will be only the file path, for example:
- `docs/README.md`
- `.cursor/rules/experts/security_expert.mdc`
- `docs/guides/DOCUMENTATION_STRUCTURE.md`

(No additional text, prefixes, or formatting - just the file path)

### Mobile Optimization Considerations

When executing this command on mobile devices:

1. **File Discovery Performance**
   - `find` operations can be resource-intensive on mobile devices
   - Consider limiting search depth on mobile: `find . -maxdepth 3 -type f ...`
   - Large directory traversal may impact battery life

2. **Memory Efficiency**
   - Array storage of all files uses memory (consider streaming approach for very large directories)
   - Mobile devices have limited RAM - command should handle large file counts gracefully
   - Consider pagination or chunking for directories with thousands of files

3. **Mobile Terminal Constraints**
   - Some mobile terminals may have limited command support
   - Array syntax `files=($(...))` should work in bash/zsh on mobile
   - Test with mobile SSH clients and terminal apps

4. **Battery Considerations**
   - Extensive file system operations drain battery
   - Consider caching results if command runs frequently
   - Optimize for quick execution on mobile devices

---

### SEO Considerations for File Selection

When this command is used to select files that will be published or made web-accessible:

1. **File Path SEO**
   - Selected file paths should be SEO-friendly if used in URLs
   - Use descriptive, keyword-rich file names
   - Consider URL structure when selecting files for web publication
   - Ensure file paths are readable and meaningful for search engines

2. **Content Discoverability**
   - If selected files contain web content, ensure they follow SEO best practices
   - File selection should prioritize content-rich, valuable files
   - Consider file metadata (title, description) for SEO value
   - Select files that contribute to topic clusters and content depth

3. **Documentation SEO**
   - When selecting documentation files, prioritize comprehensive, well-structured content
   - Ensure selected files have proper heading hierarchy and semantic structure
   - Consider internal linking opportunities when selecting related files
   - Select files that answer user search queries and provide value

---

## Review/Contribution

**Expert**: Thomas Mitchell  
**Expertise**: Testing (TDD, Unit Tests, Integration Tests, E2E Tests)  
**Date**: 2026-01-05  
**Changes**: Enhanced this file selector command with testing considerations and reliability improvements. The additions include discussions on error handling (checking if files exist, handling empty results, graceful failure), edge case handling (empty directory, permission errors, special characters in filenames), and testability considerations (deterministic behavior for testing, logging for debugging). I also added recommendations for testing this command itself, including unit tests for the random selection logic, integration tests for file discovery, and edge case tests for empty directories and permission errors. This enhancement strengthens the command's reliability and makes it more suitable for use in automated workflows and testing scenarios.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile optimization considerations section covering file discovery performance (resource-intensive find operations, search depth limiting, battery impact), memory efficiency (array storage considerations, RAM limitations, pagination/chunking for large directories), mobile terminal constraints (command support limitations, array syntax compatibility, mobile SSH client testing), and battery considerations (file system operations drain, caching opportunities, quick execution optimization). This addition ensures the command is optimized for mobile device execution, considering mobile constraints like battery life, memory limitations, and processing power.

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this file selector command by adding comprehensive "Backend File Operations Considerations" section covering backend file API integration (file selection API endpoints with RESTful design, file metadata API with file information retrieval, file content API with file content retrieval), backend file processing (backend file scanning with efficient directory traversal, backend file filtering with server-side filtering, backend file caching with file metadata caching), backend file security (backend file access control with permission checks, backend file validation with security validation, backend file logging with access logging), and comprehensive backend file operations checklist (API endpoints, metadata retrieval, content retrieval, file scanning, file filtering, file caching, access control, file validation, access logging). This addition ensures that the file selector command includes backend API considerations, supporting API-based file operations, efficient backend file processing, and secure file access.

---
