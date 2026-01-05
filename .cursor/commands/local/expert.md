# Random Expert Selector

Choose a random expert from the available expert personas and output only their name.

## Usage

Execute this command to randomly select an expert and output only their name.

## Implementation

Use this command to randomly select an expert (cross-platform):

```bash
# Get array of expert files and select random one
files=($(ls .cursor/rules/experts/*.mdc))
random_index=$((RANDOM % ${#files[@]}))
grep -m 1 "^name:" "${files[$random_index]}" | sed 's/^name: //'
```

Or as a one-liner:

```bash
files=($(ls .cursor/rules/experts/*.mdc)) && random_index=$((RANDOM % ${#files[@]})) && grep -m 1 "^name:" "${files[$random_index]}" | sed 's/^name: //'
```

## Expected Output

Output will be only the expert's name, for example:
- `Sarah Johnson`
- `Dorothy Clark`
- `Arthur Davis`
- `Thomas Mitchell`

(No additional text, prefixes, or formatting - just the name)
