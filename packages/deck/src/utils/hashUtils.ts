/**
 * DJB2 hash function for generating consistent colors from strings
 * Used for tag color generation (from discord-story-bot)
 */

/**
 * Generate a hash from a string using DJB2 algorithm
 */
export function djb2Hash(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return hash >>> 0; // Convert to unsigned 32-bit integer
}

/**
 * Generate a color from a hash value
 * Returns a hex color string
 */
export function hashToColor(hash: number): string {
  // Use hash to generate RGB values
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;

  // Ensure minimum brightness for readability
  const minBrightness = 80;
  const adjustedR = Math.max(r, minBrightness);
  const adjustedG = Math.max(g, minBrightness);
  const adjustedB = Math.max(b, minBrightness);

  // Convert to hex
  const toHex = (n: number) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(adjustedR)}${toHex(adjustedG)}${toHex(adjustedB)}`;
}

/**
 * Generate a color from a string (tag name, etc.)
 */
export function stringToColor(str: string): string {
  const hash = djb2Hash(str);
  return hashToColor(hash);
}
