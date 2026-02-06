/**
 * Validation utilities
 */

/**
 * Validate version format (semver-like: x.y or x.y.z)
 */
export function validateVersion(version: string): boolean {
  const versionPattern = /^\d+\.\d+(\.\d+)?$/;
  return versionPattern.test(version);
}

/**
 * Validate hex color format (#RRGGBB)
 */
export function validateHexColor(color: string): boolean {
  const colorPattern = /^#[0-9A-Fa-f]{6}$/;
  return colorPattern.test(color);
}

/**
 * Validate ISO date string
 */
export function validateISODate(dateString: string): boolean {
  const date = new Date(dateString);
  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    dateString === date.toISOString()
  );
}
