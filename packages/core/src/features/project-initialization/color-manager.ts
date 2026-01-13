/**
 * Color Manager
 * 
 * Generates unique color palettes for projects based on KEY_COLOR.
 * Uses a curated color palette for harmonious color schemes.
 * Colors are only assigned during project initialization (init command).
 * 
 * @module color-manager
 */

/**
 * Base color palette
 * These serve as inspiration for generating harmonious palettes
 * All new project colors are generated from this palette
 */
export const BASE_PALETTE = {
  lightGray: '#DBDCE0',    // Light gray/blue
  lightBlue: '#8AB4F9',    // Light blue
  coral: '#F38B82',        // Coral/salmon
  yellow: '#FDD664',       // Yellow
  green: '#80CA95',        // Green
  pink: '#FF8BCC',         // Pink
  purple: '#C58AFA',       // Purple
  cyan: '#78D9ED',         // Cyan
  orange: '#FCAD70',       // Orange/peach
} as const;

/**
 * Generate a hash from a string (consistent across runs)
 * Uses DJB2 hash algorithm for deterministic color generation.
 * 
 * @param str - String to hash (project name)
 * @returns 32-bit unsigned integer hash value
 * @throws {TypeError} If input is not a string
 */
function djb2Hash(str: string): number {
  if (typeof str !== 'string') {
    throw new TypeError('Input must be a string');
  }
  
  // Handle empty string edge case
  if (str.length === 0) {
    return 5381; // Return initial hash value for empty string
  }
  
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash >>> 0;
}

/**
 * Convert hex color to RGB values
 * 
 * @param hex - Hex color string (with or without # prefix, e.g., "#FF0000" or "FF0000")
 * @returns RGB color object with r, g, b values (0-255)
 * @throws {Error} If hex string is invalid format
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  if (typeof hex !== 'string') {
    throw new TypeError('Hex color must be a string');
  }
  
  // Normalize hex string (remove # if present, ensure uppercase)
  const normalizedHex = hex.trim().replace(/^#/, '').toUpperCase();
  
  // Validate hex format (must be 6 hex digits)
  if (!/^[0-9A-F]{6}$/i.test(normalizedHex)) {
    throw new Error(`Invalid hex color format: "${hex}". Expected format: "#RRGGBB" or "RRGGBB"`);
  }
  
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalizedHex);
  if (!result) {
    throw new Error(`Failed to parse hex color: "${hex}"`);
  }
  
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB values to hex color string
 * 
 * @param r - Red component (0-255), will be clamped to valid range
 * @param g - Green component (0-255), will be clamped to valid range
 * @param b - Blue component (0-255), will be clamped to valid range
 * @returns Hex color string with # prefix (e.g., "#FF0000")
 * @throws {TypeError} If any component is not a number
 */
function rgbToHex(r: number, g: number, b: number): string {
  if (typeof r !== 'number' || typeof g !== 'number' || typeof b !== 'number') {
    throw new TypeError('RGB components must be numbers');
  }
  
  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) {
    throw new TypeError('RGB components must be finite numbers');
  }
  
  const toHex = (n: number): string => {
    const clamped = Math.round(Math.max(0, Math.min(255, n)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Darken a color by reducing RGB values
 * 
 * @param color - Hex color string to darken
 * @param amount - Darkening amount (0-1), where 0 = no change, 1 = completely black. Default: 0.2
 * @returns Darkened hex color string
 * @throws {Error} If color is invalid or amount is out of range
 */
function darken(color: string, amount: number = 0.2): string {
  if (typeof amount !== 'number' || amount < 0 || amount > 1) {
    throw new Error(`Darken amount must be between 0 and 1, got: ${amount}`);
  }
  
  const rgb = hexToRgb(color);
  return rgbToHex(
    rgb.r * (1 - amount),
    rgb.g * (1 - amount),
    rgb.b * (1 - amount)
  );
}

/**
 * Lighten a color by increasing RGB values towards white
 * 
 * @param color - Hex color string to lighten
 * @param amount - Lightening amount (0-1), where 0 = no change, 1 = completely white. Default: 0.2
 * @returns Lightened hex color string
 * @throws {Error} If color is invalid or amount is out of range
 */
function lighten(color: string, amount: number = 0.2): string {
  if (typeof amount !== 'number' || amount < 0 || amount > 1) {
    throw new Error(`Lighten amount must be between 0 and 1, got: ${amount}`);
  }
  
  const rgb = hexToRgb(color);
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  );
}

/**
 * Adjust color saturation (make more or less vibrant)
 * Uses grayscale conversion formula (ITU-R BT.601) for accurate desaturation.
 * 
 * @param color - Hex color string to adjust
 * @param amount - Saturation adjustment (-1 to 1), where negative = less vibrant, positive = more vibrant, 0 = no change
 * @returns Adjusted hex color string
 * @throws {Error} If color is invalid or amount is out of range
 */
function adjustSaturation(color: string, amount: number): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    throw new Error(`Saturation amount must be a finite number, got: ${amount}`);
  }
  
  // Clamp amount to reasonable range (-1 to 1)
  const clampedAmount = Math.max(-1, Math.min(1, amount));
  
  const rgb = hexToRgb(color);
  
  // Calculate grayscale value using ITU-R BT.601 luminance formula
  const gray = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
  
  // Adjust saturation by interpolating between grayscale and original color
  const r = gray + (rgb.r - gray) * (1 + clampedAmount);
  const g = gray + (rgb.g - gray) * (1 + clampedAmount);
  const b = gray + (rgb.b - gray) * (1 + clampedAmount);
  
  return rgbToHex(r, g, b);
}

/**
 * Generate a unique KEY_COLOR for a project based on project name
 * Uses base palette as inspiration but ensures uniqueness through hash-based variations.
 * 
 * Algorithm:
 * 1. Hash project name using DJB2 algorithm for deterministic results
 * 2. Select base color from curated palette based on hash
 * 3. Apply hue shift (-30 to +30 degrees) for uniqueness
 * 4. Apply saturation adjustment (-15% to +15%) for variation
 * 
 * @param projectName - Name of the project (will be normalized: trimmed, lowercased)
 * @returns Unique hex color string (e.g., "#81CA95")
 * @throws {Error} If projectName is empty or invalid
 * 
 * @example
 * ```typescript
 * const color = generateKeyColor("my-project");
 * // Returns: "#81CA95" (deterministic based on project name)
 * ```
 */
export function generateKeyColor(projectName: string): string {
  if (typeof projectName !== 'string') {
    throw new TypeError('Project name must be a string');
  }
  
  // Normalize project name: trim whitespace and convert to lowercase for consistency
  const normalizedName = projectName.trim().toLowerCase();
  
  if (normalizedName.length === 0) {
    throw new Error('Project name cannot be empty');
  }
  
  const hash = djb2Hash(normalizedName);
  
  // Select a base color from palette based on hash
  const paletteColors = Object.values(BASE_PALETTE);
  const baseColor = paletteColors[hash % paletteColors.length];
  
  // Generate variations to ensure uniqueness
  const variation = (hash % 100) / 100; // 0-1 variation factor
  
  // Adjust hue slightly based on hash to ensure uniqueness
  const rgb = hexToRgb(baseColor);
  const hueShift = ((hash >> 8) % 60) - 30; // -30 to +30 degree shift
  
  // Apply hue shift by rotating RGB values
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  
  if (hueShift > 0) {
    // Shift towards warmer tones (increase red/green)
    r = Math.min(255, r + hueShift);
    g = Math.min(255, g + hueShift * 0.5);
  } else {
    // Shift towards cooler tones (increase green/blue)
    g = Math.min(255, g - hueShift);
    b = Math.min(255, b - hueShift * 0.5);
  }
  
  // Apply saturation adjustment for uniqueness
  const color = rgbToHex(r, g, b);
  const saturationAdjust = (variation - 0.5) * 0.3; // -0.15 to +0.15
  
  return adjustSaturation(color, saturationAdjust);
}

/**
 * Complete color palette for a project
 * All colors are derived from KEY_COLOR to ensure visual harmony
 */
export interface ProjectColorPalette {
  /** Unique project color (generated from project name) */
  keyColor: string;
  /** Dark text color for main branch */
  mainColor: string;
  /** Red background for main/master branch */
  mainBg: string;
  /** Inactive state color for main branch (with transparency) */
  mainInactive: string;
  /** Dark text color for development branch */
  devColor: string;
  /** Orange background for development branch */
  devBg: string;
  /** Inactive state color for development branch (with transparency) */
  devInactive: string;
  /** Darkened KEY_COLOR for project branch text */
  projectColor: string;
  /** KEY_COLOR for project branch background */
  projectBg: string;
  /** Inactive state color for project branches (with transparency) */
  projectInactive: string;
  /** Lightened KEY_COLOR for borders */
  border: string;
  /** Darker background (85% darker than KEY_COLOR) */
  darkerBg: string;
  /** Dark background (90% darker than KEY_COLOR) */
  darkBg: string;
  /** White color for active/highlight elements */
  activeColor: string;
}

/**
 * Generate a complete color palette based on KEY_COLOR
 * All colors are derived from KEY_COLOR to ensure harmony.
 * 
 * Branch-specific colors:
 * - Main/Master branch: Fixed RED colors (#ed3535) for consistency
 * - Development branch: Fixed ORANGE colors (#FF8C00) for consistency
 * - Other branches: Uses project KEY_COLOR with variations
 * 
 * @param projectName - Name of the project (used if keyColor not provided)
 * @param keyColor - Optional KEY_COLOR (if not provided, generates one from projectName)
 * @returns Complete color palette object
 * @throws {Error} If projectName is invalid and keyColor not provided
 * 
 * @example
 * ```typescript
 * const palette = generateColorPalette("my-project");
 * // Returns palette with all 14 color properties
 * 
 * const customPalette = generateColorPalette("my-project", "#FF5733");
 * // Uses provided KEY_COLOR instead of generating one
 * ```
 */
export function generateColorPalette(projectName: string, keyColor?: string): ProjectColorPalette {
  // Generate or use provided KEY_COLOR
  let KEY_COLOR: string;
  if (keyColor) {
    // Validate provided keyColor
    try {
      hexToRgb(keyColor); // Validate format
      KEY_COLOR = keyColor;
    } catch (error) {
      // If provided keyColor is invalid, generate one instead
      KEY_COLOR = generateKeyColor(projectName);
    }
  } else {
    KEY_COLOR = generateKeyColor(projectName);
  }
  
  // Normalize KEY_COLOR to uppercase for consistency
  KEY_COLOR = KEY_COLOR.toUpperCase();
  
  // Main branch colors (red-based for distinction) - Fixed for consistency
  const MAIN_COLOR = '#0B0B0B';
  const MAIN_BG = '#ED3535';
  const MAIN_INACTIVE = '#EC7272CC';
  
  // Development branch colors (orange-based) - Fixed for consistency
  const DEV_COLOR = '#0B0B0B';
  const DEV_BG = '#FF8C00'; // Dark orange
  const DEV_INACTIVE = '#FFA500CC'; // Orange with transparency
  
  // Project colors built around KEY_COLOR
  const PROJECT_BG = KEY_COLOR;
  const PROJECT_COLOR = darken(KEY_COLOR, 0.7); // Darker version for text
  const PROJECT_INACTIVE = KEY_COLOR + 'CC'; // Add transparency (80% opacity)
  
  // Border color - slightly lighter than KEY_COLOR
  const BORDER = lighten(KEY_COLOR, 0.15);
  
  // Background colors - darker variations of KEY_COLOR
  const DARKER_BG = darken(KEY_COLOR, 0.85);
  const DARK_BG = darken(KEY_COLOR, 0.9);
  
  // Active color - white for contrast
  const ACTIVE_COLOR = '#FFFFFF';
  
  return {
    keyColor: KEY_COLOR,
    mainColor: MAIN_COLOR,
    mainBg: MAIN_BG,
    mainInactive: MAIN_INACTIVE,
    devColor: DEV_COLOR,
    devBg: DEV_BG,
    devInactive: DEV_INACTIVE,
    projectColor: PROJECT_COLOR,
    projectBg: PROJECT_BG,
    projectInactive: PROJECT_INACTIVE,
    border: BORDER,
    darkerBg: DARKER_BG,
    darkBg: DARK_BG,
    activeColor: ACTIVE_COLOR,
  };
}

/**
 * Ensure color uniqueness across all projects
 * Checks against existing colors and adjusts if needed to maintain minimum distance.
 * 
 * Uses Euclidean distance in RGB space to measure color similarity.
 * If a color is too similar to existing colors, applies additional hue shift.
 * 
 * @param projectName - Name of the project (used for deterministic adjustment)
 * @param keyColor - Generated KEY_COLOR to check for uniqueness
 * @param existingColors - Array of existing project KEY_COLORs to check against
 * @returns Adjusted KEY_COLOR if too similar, original KEY_COLOR otherwise
 * @throws {Error} If keyColor is invalid or existingColors contains invalid colors
 * 
 * @example
 * ```typescript
 * const uniqueColor = ensureUniqueColor(
 *   "my-project",
 *   "#81CA95",
 *   ["#80CA94", "#82CA96"] // Existing similar colors
 * );
 * // Returns adjusted color if too similar, otherwise original
 * ```
 */
export function ensureUniqueColor(
  projectName: string,
  keyColor: string,
  existingColors: string[]
): string {
  if (typeof projectName !== 'string' || projectName.trim().length === 0) {
    throw new Error('Project name must be a non-empty string');
  }
  
  if (typeof keyColor !== 'string' || keyColor.trim().length === 0) {
    throw new Error('Key color must be a non-empty string');
  }
  
  if (!Array.isArray(existingColors)) {
    throw new TypeError('Existing colors must be an array');
  }
  
  // Validate keyColor format
  try {
    hexToRgb(keyColor);
  } catch (error) {
    throw new Error(`Invalid keyColor format: ${keyColor}`);
  }
  
  // If no existing colors, return as-is
  if (existingColors.length === 0) {
    return keyColor.toUpperCase();
  }
  
  // Check if color is too similar to existing colors
  const minDistance = 30; // Minimum color distance (0-255 scale)
  
  const rgb1 = hexToRgb(keyColor);
  
  // Check against all existing colors
  for (const existingColor of existingColors) {
    // Skip invalid colors in existingColors array
    if (typeof existingColor !== 'string' || existingColor.trim().length === 0) {
      continue; // Skip invalid entries
    }
    
    try {
      const rgb2 = hexToRgb(existingColor);
      
      // Calculate color distance (Euclidean distance in RGB space)
      const distance = Math.sqrt(
        Math.pow(rgb1.r - rgb2.r, 2) +
        Math.pow(rgb1.g - rgb2.g, 2) +
        Math.pow(rgb1.b - rgb2.b, 2)
      );
      
      // If too similar, adjust the color
      if (distance < minDistance) {
        // Shift hue slightly using deterministic hash
        const normalizedName = projectName.trim().toLowerCase();
        const hash = djb2Hash(normalizedName + '_adjusted');
        const shift = ((hash % 40) - 20); // -20 to +20
        
        let r = rgb1.r;
        let g = rgb1.g;
        let b = rgb1.b;
        
        // Apply shift towards warmer or cooler tones
        if (shift > 0) {
          // Warmer tones (increase red/green)
          r = Math.min(255, r + shift);
          g = Math.min(255, g + shift * 0.7);
        } else {
          // Cooler tones (increase green/blue)
          g = Math.min(255, g - shift);
          b = Math.min(255, b - shift * 0.7);
        }
        
        return rgbToHex(r, g, b);
      }
    } catch (error) {
      // Skip invalid colors in existingColors array
      continue;
    }
  }
  
  // No conflicts found, return original color (normalized to uppercase)
  return keyColor.toUpperCase();
}
