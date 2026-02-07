# IDE Colors Reference

This document lists all available colors used by the IDE color system.

## How to View Colors

### Using the CLI Command

Once the package is built, you can view colors:

```bash
# View 70's palette + current project colors
npx @colis/rig colors

# View 70's palette + all projects' colors
npx @colis/rig colors --all

# View colors for specific project
npx @colis/rig colors --project-name my-project --path /path/to/project
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

**Important**: Colors are only assigned when running `npx @colis/rig init`. Existing projects are not affected.

### Generated Colors (Derived from KEY_COLOR)

For each project, a complete color palette is automatically generated from the KEY_COLOR:

| Color Property | Description | Generation Method | Example (for KEY_COLOR `#81ca95`) |
|--------------|------------|-------------------|-----------------------------------|
| **keyColor** | Unique project color | Generated from project name | `#81ca95` 🟢 |
| **mainColor** | Text color for main branch | Fixed: `#0b0b0b` | `#0b0b0b` ⚫ |
| **mainBg** | Background for main branch | Fixed: `#ed3535` (RED) | `#ed3535` 🔴 |
| **mainInactive** | Inactive state for main branch | Fixed: `#ec7272cc` (RED with transparency) | `#ec7272cc` 🔴 |
| **devColor** | Text color for dev branch | Fixed: `#0b0b0b` | `#0b0b0b` ⚫ |
| **devBg** | Background for dev branch | Fixed: `#FF8C00` (ORANGE) | `#FF8C00` 🟠 |
| **devInactive** | Inactive state for dev branch | Fixed: `#FFA500cc` (ORANGE with transparency) | `#FFA500cc` 🟠 |
| **projectColor** | Text color for project branches | Darkened KEY_COLOR (70%) | `#062015` ⚫ |
| **projectBg** | Background for project branches | Same as KEY_COLOR | `#81ca95` 🟢 |
| **projectInactive** | Inactive state for project branches | KEY_COLOR + `cc` (transparency) | `#81ca95cc` 🟢 |
| **border** | Border color | Lightened KEY_COLOR (15%) | `#5aa978` 🟢 |
| **darkerBg** | Darker background | Darkened KEY_COLOR (85%) | `#0b1f17` ⚫ |
| **darkBg** | Dark background | Darkened KEY_COLOR (90%) | `#071a13` ⚫ |
| **activeColor** | Active/highlight color | Fixed: `#ffffff` (WHITE) | `#ffffff` ⚪ |

**Color Generation Details**:
- **Darkening**: Multiplies RGB values by `(1 - amount)` where amount is percentage (0.7 = 70% darker)
- **Lightening**: Adds `(255 - rgb) * amount` to RGB values where amount is percentage (0.15 = 15% lighter)
- **Transparency**: Appends `cc` hex alpha channel (80% opacity) to hex color
- **Fixed Colors**: Main and dev branch colors are fixed for consistency across projects

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

The color generation algorithm ensures each project gets a unique, deterministic KEY_COLOR:

1. **Project Name Hash**: Uses DJB2 hash algorithm (consistent across runs)
   - Hash function: `djb2Hash(projectName)` 
   - Returns deterministic 32-bit unsigned integer

2. **Base Color Selection**: Selects from curated 9-color palette based on hash modulo
   - Palette colors: Light Gray, Light Blue, Coral, Yellow, Green, Pink, Purple, Cyan, Orange
   - Selection: `paletteColors[hash % paletteColors.length]`

3. **Hue Adjustment**: Applies hue shift for uniqueness
   - Shift range: -30 to +30 degrees
   - Calculation: `((hash >> 8) % 60) - 30`
   - Warmer tones: Positive shift (increase red/green)
   - Cooler tones: Negative shift (increase green/blue)

4. **Saturation Adjustment**: Adjusts color vibrancy
   - Adjustment range: -15% to +15%
   - Calculation: `(variation - 0.5) * 0.3` where `variation = (hash % 100) / 100`
   - Uses grayscale conversion for saturation calculation

5. **Uniqueness Check**: Ensures minimum color distance from existing projects
   - Minimum distance: 30 units (Euclidean distance in RGB space)
   - Calculation: `√((r1-r2)² + (g1-g2)² + (b1-b2)²)`
   - If too similar, applies additional hue shift using adjusted hash

**Color Manipulation Functions**:
- `hexToRgb(hex)`: Converts hex color to RGB values
- `rgbToHex(r, g, b)`: Converts RGB values to hex color
- `darken(color, amount)`: Darkens color by percentage (default: 20%)
- `lighten(color, amount)`: Lightens color by percentage (default: 20%)
- `adjustSaturation(color, amount)`: Adjusts color saturation/vibrancy

## API Reference

### Color Manager Functions

The color-manager module exports the following functions:

#### `generateKeyColor(projectName: string): string`
Generates a unique KEY_COLOR for a project based on its name.

**Parameters**:
- `projectName`: The name of the project (string)

**Returns**: Hex color string (e.g., `#81ca95`)

**Algorithm**: Uses DJB2 hash, base palette selection, hue shift, and saturation adjustment.

#### `generateColorPalette(projectName: string, keyColor?: string): ProjectColorPalette`
Generates a complete color palette for a project.

**Parameters**:
- `projectName`: The name of the project (string)
- `keyColor`: Optional KEY_COLOR (if not provided, generates one)

**Returns**: `ProjectColorPalette` object with all color properties

**Interface**:
```typescript
interface ProjectColorPalette {
  keyColor: string;
  mainColor: string;
  mainBg: string;
  mainInactive: string;
  devColor: string;
  devBg: string;
  devInactive: string;
  projectColor: string;
  projectBg: string;
  projectInactive: string;
  border: string;
  darkerBg: string;
  darkBg: string;
  activeColor: string;
}
```

#### `ensureUniqueColor(projectName: string, keyColor: string, existingColors: string[]): string`
Ensures a color is unique by checking against existing project colors.

**Parameters**:
- `projectName`: The name of the project (string)
- `keyColor`: The generated KEY_COLOR to check
- `existingColors`: Array of existing project KEY_COLORs

**Returns**: Adjusted KEY_COLOR if too similar, original KEY_COLOR otherwise

**Algorithm**: Calculates Euclidean distance in RGB space, adjusts hue if distance < 30.

## See Also

- [IDE Colors Usage Guide](../guides/IDE_COLORS_USAGE.md) - Complete user guide for IDE colors
- [Project Initialization PRD](../features/commissioning/PRD.md) - Feature documentation including color manager

---

## Review/Contribution

**Expert**: Documentation Expert  
**Date**: 2026-01-05  
**Changes**: Enhanced IDE Colors Reference documentation with comprehensive color generation algorithm details including DJB2 hash algorithm explanation, base color selection method, hue adjustment calculation with shift range and formulas, saturation adjustment with variation calculation, uniqueness check with Euclidean distance formula and minimum distance threshold. Added detailed generated colors table with all 14 color properties, generation methods, and examples. Added API reference section documenting `generateKeyColor`, `generateColorPalette`, and `ensureUniqueColor` functions with parameters, return types, and algorithm descriptions. Added TypeScript interface definition for `ProjectColorPalette`. This enhancement ensures the reference documentation comprehensively covers all aspects of the color manager feature, making it easier for developers to understand and use the color generation system.
