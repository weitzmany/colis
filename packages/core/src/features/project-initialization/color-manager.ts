/**
 * Color Manager
 * 
 * Generates unique color palettes for projects based on KEY_COLOR
 * Uses 70's color palette as inspiration for harmonious color schemes
 */

/**
 * 70's inspired color palette base colors
 * These serve as inspiration for generating harmonious palettes
 */
const SEVENTIES_PALETTE = {
  mustard: '#FFDB58',      // Mustard Yellow
  burntOrange: '#CC5500',   // Burnt Orange
  avocado: '#568203',      // Avocado Green
  rust: '#B7410E',         // Rust Red
  harvest: '#DA9100',      // Harvest Gold
  earth: '#8B4513',        // Saddle Brown
  terracotta: '#E2725B',    // Terracotta
  olive: '#808000',        // Olive
  amber: '#FFBF00',        // Amber
  copper: '#B87333',       // Copper
  sage: '#87AE73',         // Sage Green
  coral: '#FF7F50',        // Coral
};

/**
 * Generate a hash from a string (consistent across runs)
 */
function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash >>> 0;
}

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Blend two colors
 */
function blendColors(color1: string, color2: string, ratio: number = 0.5): string {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  const r = rgb1.r + (rgb2.r - rgb1.r) * ratio;
  const g = rgb1.g + (rgb2.g - rgb1.g) * ratio;
  const b = rgb1.b + (rgb2.b - rgb1.b) * ratio;
  return rgbToHex(r, g, b);
}

/**
 * Darken a color
 */
function darken(color: string, amount: number = 0.2): string {
  const rgb = hexToRgb(color);
  return rgbToHex(rgb.r * (1 - amount), rgb.g * (1 - amount), rgb.b * (1 - amount));
}

/**
 * Lighten a color
 */
function lighten(color: string, amount: number = 0.2): string {
  const rgb = hexToRgb(color);
  return rgbToHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount
  );
}

/**
 * Adjust color saturation (make more or less vibrant)
 */
function adjustSaturation(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  const gray = rgb.r * 0.299 + rgb.g * 0.587 + rgb.b * 0.114;
  const r = gray + (rgb.r - gray) * (1 + amount);
  const g = gray + (rgb.g - gray) * (1 + amount);
  const b = gray + (rgb.b - gray) * (1 + amount);
  return rgbToHex(r, g, b);
}

/**
 * Generate a unique KEY_COLOR for a project based on project name
 * Uses 70's palette as inspiration but ensures uniqueness
 */
export function generateKeyColor(projectName: string): string {
  const hash = djb2Hash(projectName);
  
  // Select a base color from 70's palette based on hash
  const paletteColors = Object.values(SEVENTIES_PALETTE);
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
    // Shift towards warmer tones
    r = Math.min(255, r + hueShift);
    g = Math.min(255, g + hueShift * 0.5);
  } else {
    // Shift towards cooler tones
    g = Math.min(255, g - hueShift);
    b = Math.min(255, b - hueShift * 0.5);
  }
  
  // Apply saturation adjustment for uniqueness
  const color = rgbToHex(r, g, b);
  const saturationAdjust = (variation - 0.5) * 0.3; // -0.15 to +0.15
  
  return adjustSaturation(color, saturationAdjust);
}

/**
 * Generate a complete color palette based on KEY_COLOR
 * All colors are derived from KEY_COLOR to ensure harmony
 */
export interface ProjectColorPalette {
  keyColor: string;
  mainColor: string;        // Dark text color
  mainBg: string;           // Main background (for main/master branch) - RED
  mainInactive: string;     // Inactive state for main branch
  devColor: string;          // Development branch text color
  devBg: string;             // Development branch background - ORANGE
  devInactive: string;      // Inactive state for development branch
  projectColor: string;     // Project text color
  projectBg: string;        // Project background (uses KEY_COLOR)
  projectInactive: string;  // Inactive state for project branches
  border: string;           // Border color
  darkerBg: string;         // Darker background
  darkBg: string;           // Dark background
  activeColor: string;       // Active/highlight color
}

export function generateColorPalette(projectName: string, keyColor?: string): ProjectColorPalette {
  const KEY_COLOR = keyColor || generateKeyColor(projectName);
  
  // Main branch colors (red-based for distinction)
  const MAIN_COLOR = '#0b0b0b';
  const MAIN_BG = '#ed3535';
  const MAIN_INACTIVE = '#ec7272cc';
  
  // Development branch colors (orange-based)
  const DEV_COLOR = '#0b0b0b';
  const DEV_BG = '#FF8C00'; // Dark orange
  const DEV_INACTIVE = '#FFA500cc'; // Orange with transparency
  
  // Project colors built around KEY_COLOR
  const PROJECT_BG = KEY_COLOR;
  const PROJECT_COLOR = darken(KEY_COLOR, 0.7); // Darker version for text
  const PROJECT_INACTIVE = KEY_COLOR + 'cc'; // Add transparency
  
  // Border color - slightly lighter than KEY_COLOR
  const BORDER = lighten(KEY_COLOR, 0.15);
  
  // Background colors - darker variations of KEY_COLOR
  const DARKER_BG = darken(KEY_COLOR, 0.85);
  const DARK_BG = darken(KEY_COLOR, 0.9);
  
  // Active color - white for contrast
  const ACTIVE_COLOR = '#ffffff';
  
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
 * Checks against existing colors and adjusts if needed
 */
export function ensureUniqueColor(
  projectName: string,
  keyColor: string,
  existingColors: string[]
): string {
  // If no existing colors, return as-is
  if (existingColors.length === 0) {
    return keyColor;
  }
  
  // Check if color is too similar to existing colors
  const minDistance = 30; // Minimum color distance (0-255 scale)
  
  const rgb1 = hexToRgb(keyColor);
  
  for (const existingColor of existingColors) {
    const rgb2 = hexToRgb(existingColor);
    
    // Calculate color distance (Euclidean distance in RGB space)
    const distance = Math.sqrt(
      Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
    );
    
    // If too similar, adjust the color
    if (distance < minDistance) {
      // Shift hue slightly
      const hash = djb2Hash(projectName + '_adjusted');
      const shift = ((hash % 40) - 20); // -20 to +20
      
      let r = rgb1.r;
      let g = rgb1.g;
      let b = rgb1.b;
      
      // Apply shift
      if (shift > 0) {
        r = Math.min(255, r + shift);
        g = Math.min(255, g + shift * 0.7);
      } else {
        g = Math.min(255, g - shift);
        b = Math.min(255, b - shift * 0.7);
      }
      
      return rgbToHex(r, g, b);
    }
  }
  
  return keyColor;
}
