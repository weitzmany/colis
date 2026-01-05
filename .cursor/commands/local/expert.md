# Random Expert Selector

Choose a random expert from the available expert personas and output only their name.

## Usage

Execute this command to randomly select an expert and output only their name.

## Implementation

This command uses a performance-optimized approach with a mapping cache:

1. **Mapping File**: `.cursor/commands/local/.expert_mapping.txt` stores `filename|expert_name` mappings
2. **Directory Scan**: Scans `.cursor/rules/experts/*.mdc` for filenames only (no file reads)
3. **Missing Files Check**: Compares directory files with mapping file
4. **Lazy Loading**: Only reads files that are missing from the mapping
5. **Random Selection**: Selects randomly from the mapping list (no file reads needed)

### Command Implementation

```bash
# Configuration
MAPPING_FILE=".cursor/commands/local/.expert_mapping.txt"
EXPERT_DIR=".cursor/rules/experts"

# Ensure mapping file exists
touch "$MAPPING_FILE"

# Get all expert files (filenames only)
current_files=$(ls "$EXPERT_DIR"/*.mdc 2>/dev/null | xargs -n1 basename | sort)

# Get files already in mapping (just filenames, skip comments and empty lines)
mapped_files=$(grep -v '^#' "$MAPPING_FILE" 2>/dev/null | grep -v '^$' | grep '|' | cut -d'|' -f1 | sort)

# Find missing files
missing_files=$(comm -23 <(echo "$current_files") <(echo "$mapped_files"))

# Process missing files: read name and add to mapping
if [ -n "$missing_files" ]; then
  while IFS= read -r filename; do
    filepath="$EXPERT_DIR/$filename"
    if [ -f "$filepath" ]; then
      expert_name=$(grep -m 1 "^name:" "$filepath" 2>/dev/null | sed 's/^name: //')
      if [ -n "$expert_name" ]; then
        echo "$filename|$expert_name" >> "$MAPPING_FILE"
      fi
    fi
  done <<< "$missing_files"
fi

# Random selection from mapping file (skip comments and empty lines)
mapping_data=$(grep -v '^#' "$MAPPING_FILE" | grep -v '^$' | grep '|')
total_lines=$(echo "$mapping_data" | wc -l | tr -d ' ')
if [ "$total_lines" -eq 0 ]; then
  exit 1
fi

random_line=$((RANDOM % total_lines + 1))
echo "$mapping_data" | cut -d'|' -f2 | sed -n "${random_line}p"
```

### One-liner Version

```bash
MAPPING_FILE=".cursor/commands/local/.expert_mapping.txt" && EXPERT_DIR=".cursor/rules/experts" && touch "$MAPPING_FILE" && current_files=$(ls "$EXPERT_DIR"/*.mdc 2>/dev/null | xargs -n1 basename | sort) && mapped_files=$(grep -v '^#' "$MAPPING_FILE" 2>/dev/null | grep -v '^$' | grep '|' | cut -d'|' -f1 | sort) && missing_files=$(comm -23 <(echo "$current_files") <(echo "$mapped_files")) && [ -n "$missing_files" ] && while IFS= read -r filename; do filepath="$EXPERT_DIR/$filename" && [ -f "$filepath" ] && expert_name=$(grep -m 1 "^name:" "$filepath" 2>/dev/null | sed 's/^name: //') && [ -n "$expert_name" ] && echo "$filename|$expert_name" >> "$MAPPING_FILE"; done <<< "$missing_files"; mapping_data=$(grep -v '^#' "$MAPPING_FILE" | grep -v '^$' | grep '|') && total_lines=$(echo "$mapping_data" | wc -l | tr -d ' ') && [ "$total_lines" -eq 0 ] && exit 1 || random_line=$((RANDOM % total_lines + 1)) && echo "$mapping_data" | cut -d'|' -f2 | sed -n "${random_line}p"
```

## Performance Benefits

- **First Run**: Scans directory, reads all files, creates mapping
- **Subsequent Runs**: Only scans directory (filenames), compares with mapping, reads only new files
- **Random Selection**: Uses mapping file (no file reads needed)
- **Cache Invalidation**: Automatically detects new files and updates mapping

## Mapping File Format

The `.cursor/commands/local/.expert_mapping.txt` file uses pipe-separated format:
```
accessibility_expert.mdc|Sarah Johnson
api_design_expert.mdc|Andrew Lee
architecture_expert.mdc|Arthur Davis
...
```

## Expected Output

Output will be only the expert's name, for example:
- `Sarah Johnson`
- `Dorothy Clark`
- `Arthur Davis`
- `Thomas Mitchell`

(No additional text, prefixes, or formatting - just the name)
