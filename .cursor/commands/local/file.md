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

## Expected Output

Output will be only the file path, for example:
- `docs/README.md`
- `.cursor/rules/experts/security_expert.mdc`
- `docs/guides/DOCUMENTATION_STRUCTURE.md`

(No additional text, prefixes, or formatting - just the file path)
