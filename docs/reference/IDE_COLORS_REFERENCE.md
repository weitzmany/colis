# IDE Colors Reference

This document lists all available colors used by the IDE color system.

## How to View Colors

### Using the CLI Command

Once the package is built, you can view colors:

```bash
# View 70's palette + current project colors
npx @your-org/core colors

# View 70's palette + all projects' colors
npx @your-org/core colors --all

# View colors for specific project
npx @your-org/core colors --project-name my-project --path /path/to/project
```

The command always shows:
1. **Base Color Palette** - All 9 base colors
2. **Current Project Colors** - Colors for the project you're in
3. **All Projects Colors** (with `--all`) - List of all projects and their KEY_COLORs

**Note**: Colors are only assigned during project initialization. Existing projects keep their current colors.

## Base Color Palette

These colors serve as the foundation for generating unique project KEY_COLORs:

| Color Name | Hex Code | Description |
|------------|----------|-------------|
| **Light Gray** | `#DBDCE0` | Light gray/blue |
| **Light Blue** | `#8AB4F9` | Light blue |
| **Coral** | `#F38B82` | Coral/salmon |
| **Yellow** | `#FDD664` | Yellow |
| **Green** | `#80CA95` | Green |
| **Pink** | `#FF8BCC` | Pink |
| **Purple** | `#C58AFA` | Purple |
| **Cyan** | `#78D9ED` | Cyan |
| **Orange** | `#FCAD70` | Orange/peach |

## Branch Colors

These are fixed colors used for specific branches:

### Main/Master Branch (RED)
- **Background**: `#ed3535` 🔴
- **Text**: `#0b0b0b` ⚫
- **Inactive**: `#ec7272cc` 🔴 (with transparency)

### Development/Dev Branch (ORANGE)
- **Background**: `#FF8C00` 🟠
- **Text**: `#0b0b0b` ⚫
- **Inactive**: `#FFA500cc` 🟠 (with transparency)

## Project KEY_COLOR

Each project gets a unique KEY_COLOR generated from:
- Project name (deterministic hash)
- Base palette colors
- Hue and saturation adjustments for uniqueness

**Important**: Colors are only assigned when running `npx @your-org/core init`. Existing projects are not affected.

### Generated Colors (Derived from KEY_COLOR)

For each project, these colors are automatically generated:

| Color Type | Description | Example (for KEY_COLOR `#81ca95`) |
|-----------|------------|-----------------------------------|
| **KEY_COLOR** | Unique project color | `#81ca95` 🟢 |
| **Project Background** | Same as KEY_COLOR | `#81ca95` 🟢 |
| **Project Text** | Darkened KEY_COLOR (70%) | `#062015` ⚫ |
| **Project Inactive** | KEY_COLOR with transparency | `#81ca95cc` 🟢 |
| **Border** | Lightened KEY_COLOR (15%) | `#5aa978` 🟢 |
| **Darker Background** | Darkened KEY_COLOR (85%) | `#0b1f17` ⚫ |
| **Dark Background** | Darkened KEY_COLOR (90%) | `#071a13` ⚫ |
| **Active Color** | White (for contrast) | `#ffffff` ⚪ |

## Current Project Colors

To see the actual colors for your current project, check the `.githooks/post-checkout` file:

```bash
# View your project's KEY_COLOR
grep "KEY_COLOR=" .githooks/post-checkout

# View all colors
cat .githooks/post-checkout | grep -E "(KEY_COLOR|MAIN_|DEV_|PROJECT_|BORDER|DARKER|DARK|ACTIVE)"
```

Or view the generated settings:

```bash
# View current color settings
cat .vscode/settings.json | grep -A 20 "colorCustomizations"
```

## Color Usage in IDE

Colors are applied to these VS Code/Cursor UI elements:

- **Title Bar** (active/inactive) - Uses branch color
- **Status Bar** - Uses branch color
- **Activity Bar** - Dark background with branch color accent
- **Sidebar** - Dark background with branch color border
- **Editor Borders** - Branch color border
- **Panel Borders** - Branch color border
- **Focus Border** - Branch color
- **Active Tab Border** - Branch color
- **Tab Text** - White (for contrast)

## Examples

### Example Project: "packages"
- **KEY_COLOR**: `#81ca95` (Avocado Green variant)
- **Main branch**: RED (`#ed3535`)
- **Development branch**: ORANGE (`#FF8C00`)
- **Other branches**: `#81ca95` (Avocado Green)

### Example Project: "my-app"
- **KEY_COLOR**: Generated from project name (will be different)
- **Main branch**: RED (`#ed3535`)
- **Development branch**: ORANGE (`#FF8C00`)
- **Other branches**: Unique KEY_COLOR for "my-app"

## Color Generation Algorithm

1. **Project Name Hash**: DJB2 hash of project name
2. **Base Color Selection**: Select from 70's palette based on hash
3. **Hue Adjustment**: Shift hue by -30 to +30 degrees
4. **Saturation Adjustment**: Adjust saturation by -15% to +15%
5. **Uniqueness Check**: Ensure minimum distance from other project colors

## See Also

- [IDE Colors Usage Guide](../guides/IDE_COLORS_USAGE.md)
- [Project Initialization PRD](../features/project-initialization/PRD.md)
