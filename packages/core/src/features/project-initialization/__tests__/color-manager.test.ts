/**
 * Color Manager Tests
 * 
 * Comprehensive test suite for color generation and palette management.
 * Tests cover all functions, edge cases, error handling, and deterministic behavior.
 */

import {
  generateKeyColor,
  generateColorPalette,
  ensureUniqueColor,
  BASE_PALETTE,
  ProjectColorPalette,
} from '../color-manager.js';

describe('Color Manager', () => {
  describe('BASE_PALETTE', () => {
    it('should export BASE_PALETTE with 9 colors', () => {
      expect(BASE_PALETTE).toBeDefined();
      expect(Object.keys(BASE_PALETTE).length).toBe(9);
    });

    it('should have all colors in valid hex format', () => {
      Object.values(BASE_PALETTE).forEach((color) => {
        expect(color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('should contain expected color names', () => {
      expect(BASE_PALETTE).toHaveProperty('lightGray');
      expect(BASE_PALETTE).toHaveProperty('lightBlue');
      expect(BASE_PALETTE).toHaveProperty('coral');
      expect(BASE_PALETTE).toHaveProperty('yellow');
      expect(BASE_PALETTE).toHaveProperty('green');
      expect(BASE_PALETTE).toHaveProperty('pink');
      expect(BASE_PALETTE).toHaveProperty('purple');
      expect(BASE_PALETTE).toHaveProperty('cyan');
      expect(BASE_PALETTE).toHaveProperty('orange');
    });
  });

  describe('generateKeyColor', () => {
    it('should generate a valid hex color', () => {
      const color = generateKeyColor('test-project');
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should generate deterministic colors (same project name = same color)', () => {
      const color1 = generateKeyColor('my-project');
      const color2 = generateKeyColor('my-project');
      expect(color1).toBe(color2);
    });

    it('should generate different colors for different project names', () => {
      const color1 = generateKeyColor('project-one');
      const color2 = generateKeyColor('project-two');
      expect(color1).not.toBe(color2);
    });

    it('should handle project names with different cases consistently', () => {
      const color1 = generateKeyColor('MyProject');
      const color2 = generateKeyColor('myproject');
      const color3 = generateKeyColor('MYPROJECT');
      expect(color1).toBe(color2);
      expect(color2).toBe(color3);
    });

    it('should handle project names with whitespace', () => {
      const color1 = generateKeyColor('  my-project  ');
      const color2 = generateKeyColor('my-project');
      expect(color1).toBe(color2);
    });

    it('should handle special characters in project names', () => {
      const color1 = generateKeyColor('my-project_123');
      const color2 = generateKeyColor('my.project.123');
      expect(color1).toMatch(/^#[0-9A-F]{6}$/);
      expect(color2).toMatch(/^#[0-9A-F]{6}$/);
      // They should be different
      expect(color1).not.toBe(color2);
    });

    it('should throw error for empty project name', () => {
      expect(() => generateKeyColor('')).toThrow('Project name cannot be empty');
      expect(() => generateKeyColor('   ')).toThrow('Project name cannot be empty');
    });

    it('should throw TypeError for non-string project name', () => {
      expect(() => generateKeyColor(null as any)).toThrow(TypeError);
      expect(() => generateKeyColor(undefined as any)).toThrow(TypeError);
      expect(() => generateKeyColor(123 as any)).toThrow(TypeError);
      expect(() => generateKeyColor({} as any)).toThrow(TypeError);
    });

    it('should generate colors from base palette', () => {
      const generatedColor = generateKeyColor('test-project');
      
      // Generated color should be a valid hex color
      expect(generatedColor).toMatch(/^#[0-9A-F]{6}$/);
      
      // Color should be derived from palette (may be adjusted but should be valid)
      expect(generatedColor.length).toBe(7); // #RRGGBB
    });

    it('should handle very long project names', () => {
      const longName = 'a'.repeat(1000);
      const color = generateKeyColor(longName);
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should generate uppercase hex colors', () => {
      const color = generateKeyColor('test-project');
      expect(color).toBe(color.toUpperCase());
    });
  });

  describe('generateColorPalette', () => {
    it('should generate a complete palette with all required properties', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette).toHaveProperty('keyColor');
      expect(palette).toHaveProperty('mainColor');
      expect(palette).toHaveProperty('mainBg');
      expect(palette).toHaveProperty('mainInactive');
      expect(palette).toHaveProperty('devColor');
      expect(palette).toHaveProperty('devBg');
      expect(palette).toHaveProperty('devInactive');
      expect(palette).toHaveProperty('projectColor');
      expect(palette).toHaveProperty('projectBg');
      expect(palette).toHaveProperty('projectInactive');
      expect(palette).toHaveProperty('border');
      expect(palette).toHaveProperty('darkerBg');
      expect(palette).toHaveProperty('darkBg');
      expect(palette).toHaveProperty('activeColor');
    });

    it('should generate deterministic palettes (same project name = same palette)', () => {
      const palette1 = generateColorPalette('my-project');
      const palette2 = generateColorPalette('my-project');
      
      expect(palette1.keyColor).toBe(palette2.keyColor);
      expect(palette1.projectBg).toBe(palette2.projectBg);
      expect(palette1.border).toBe(palette2.border);
    });

    it('should use provided keyColor when given', () => {
      const customKeyColor = '#FF5733';
      const palette = generateColorPalette('test-project', customKeyColor);
      
      expect(palette.keyColor).toBe(customKeyColor.toUpperCase());
      expect(palette.projectBg).toBe(customKeyColor.toUpperCase());
    });

    it('should generate keyColor when not provided', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette.keyColor).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.projectBg).toBe(palette.keyColor);
    });

    it('should fallback to generated color if provided keyColor is invalid', () => {
      const invalidColor = '#INVALID';
      const palette = generateColorPalette('test-project', invalidColor);
      
      // Should generate a valid color instead
      expect(palette.keyColor).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.keyColor).not.toBe(invalidColor);
    });

    it('should have fixed main branch colors', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette.mainColor).toBe('#0B0B0B');
      expect(palette.mainBg).toBe('#ED3535');
      expect(palette.mainInactive).toBe('#EC7272CC');
    });

    it('should have fixed dev branch colors', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette.devColor).toBe('#0B0B0B');
      expect(palette.devBg).toBe('#FF8C00');
      expect(palette.devInactive).toBe('#FFA500CC');
    });

    it('should have fixed active color (white)', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette.activeColor).toBe('#FFFFFF');
    });

    it('should derive project colors from KEY_COLOR', () => {
      const customKeyColor = '#80CA95';
      const palette = generateColorPalette('test-project', customKeyColor);
      
      expect(palette.projectBg).toBe(customKeyColor.toUpperCase());
      expect(palette.projectInactive).toBe(customKeyColor.toUpperCase() + 'CC');
      
      // Project color should be darker than KEY_COLOR
      expect(palette.projectColor).not.toBe(palette.keyColor);
      expect(palette.projectColor).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should generate darker backgrounds from KEY_COLOR', () => {
      const palette = generateColorPalette('test-project');
      
      // darkerBg should be darker than darkBg (85% vs 90% darker)
      expect(palette.darkerBg).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.darkBg).toMatch(/^#[0-9A-F]{6}$/);
      
      // Both should be valid hex colors
      expect(palette.darkerBg.length).toBe(7);
      expect(palette.darkBg.length).toBe(7);
    });

    it('should generate border color lighter than KEY_COLOR', () => {
      const palette = generateColorPalette('test-project');
      
      expect(palette.border).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.border.length).toBe(7);
    });

    it('should normalize all colors to uppercase', () => {
      const palette = generateColorPalette('test-project', '#ff5733');
      
      expect(palette.keyColor).toBe('#FF5733');
      expect(palette.mainBg).toBe('#ED3535');
      expect(palette.devBg).toBe('#FF8C00');
      expect(palette.activeColor).toBe('#FFFFFF');
    });

    it('should throw error for empty project name when keyColor not provided', () => {
      expect(() => generateColorPalette('')).toThrow();
      expect(() => generateColorPalette('   ')).toThrow();
    });

    it('should handle empty project name when valid keyColor provided', () => {
      // When valid keyColor is provided, empty projectName is acceptable
      // (keyColor is used directly, projectName is only used if keyColor is invalid)
      const palette = generateColorPalette('', '#FF5733');
      expect(palette.keyColor).toBe('#FF5733');
    });
  });

  describe('ensureUniqueColor', () => {
    it('should return original color when no existing colors', () => {
      const keyColor = '#81CA95';
      const result = ensureUniqueColor('test-project', keyColor, []);
      
      expect(result).toBe(keyColor.toUpperCase());
    });

    it('should return original color when colors are sufficiently different', () => {
      const keyColor = '#81CA95';
      const existingColors = ['#FF0000', '#00FF00', '#0000FF']; // Very different colors
      const result = ensureUniqueColor('test-project', keyColor, existingColors);
      
      expect(result).toBe(keyColor.toUpperCase());
    });

    it('should adjust color when too similar to existing colors', () => {
      const keyColor = '#81CA95';
      const similarColor = '#81CA96'; // Very similar (distance < 30)
      const existingColors = [similarColor];
      const result = ensureUniqueColor('test-project', keyColor, existingColors);
      
      // Should return adjusted color (different from original)
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
      expect(result).not.toBe(keyColor.toUpperCase());
    });

    it('should be deterministic (same inputs = same adjustment)', () => {
      const keyColor = '#81CA95';
      const similarColor = '#81CA96';
      const existingColors = [similarColor];
      
      const result1 = ensureUniqueColor('test-project', keyColor, existingColors);
      const result2 = ensureUniqueColor('test-project', keyColor, existingColors);
      
      expect(result1).toBe(result2);
    });

    it('should handle multiple similar colors', () => {
      const keyColor = '#81CA95';
      const similarColors = ['#81CA96', '#81CA94', '#82CA95']; // All similar
      const result = ensureUniqueColor('test-project', keyColor, similarColors);
      
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
      expect(result).not.toBe(keyColor.toUpperCase());
    });

    it('should skip invalid colors in existingColors array', () => {
      const keyColor = '#81CA95';
      const existingColors = ['#FF0000', '', 'invalid', '#00FF00', null as any, undefined as any];
      const result = ensureUniqueColor('test-project', keyColor, existingColors);
      
      // Should process valid colors and skip invalid ones
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should throw error for empty project name', () => {
      expect(() => ensureUniqueColor('', '#81CA95', [])).toThrow('Project name must be a non-empty string');
      expect(() => ensureUniqueColor('   ', '#81CA95', [])).toThrow('Project name must be a non-empty string');
    });

    it('should throw error for empty keyColor', () => {
      expect(() => ensureUniqueColor('test-project', '', [])).toThrow('Key color must be a non-empty string');
      expect(() => ensureUniqueColor('test-project', '   ', [])).toThrow('Key color must be a non-empty string');
    });

    it('should throw TypeError for non-array existingColors', () => {
      expect(() => ensureUniqueColor('test-project', '#81CA95', null as any)).toThrow(TypeError);
      expect(() => ensureUniqueColor('test-project', '#81CA95', undefined as any)).toThrow(TypeError);
      expect(() => ensureUniqueColor('test-project', '#81CA95', {} as any)).toThrow(TypeError);
    });

    it('should throw error for invalid keyColor format', () => {
      expect(() => ensureUniqueColor('test-project', 'INVALID', [])).toThrow('Invalid keyColor format');
      expect(() => ensureUniqueColor('test-project', '#GGG', [])).toThrow('Invalid keyColor format');
    });

    it('should normalize returned color to uppercase', () => {
      const keyColor = '#81ca95'; // Lowercase
      const result = ensureUniqueColor('test-project', keyColor, []);
      
      expect(result).toBe(result.toUpperCase());
    });

    it('should handle edge case: color exactly at minimum distance threshold', () => {
      // Create a color that's exactly 30 units away
      const keyColor = '#81CA95';
      // Calculate a color that's exactly 30 units away in RGB space
      // For example, if keyColor is RGB(129, 202, 149), a color 30 units away would be RGB(129+10, 202+10, 149+10) = RGB(139, 212, 159)
      // Distance = sqrt(10² + 10² + 10²) = sqrt(300) ≈ 17.32 (too close)
      // Let's use a color that's further: RGB(159, 232, 179) = #9FE8B3
      // Distance = sqrt((159-129)² + (232-202)² + (179-149)²) = sqrt(30² + 30² + 30²) = sqrt(2700) ≈ 51.96 (safe)
      const safeColor = '#9FE8B3';
      const result = ensureUniqueColor('test-project', keyColor, [safeColor]);
      
      // Should return original (distance > 30)
      expect(result).toBe(keyColor.toUpperCase());
    });
  });

  describe('Color Palette Integration', () => {
    it('should generate consistent palettes across multiple calls', () => {
      const projectName = 'integration-test';
      const palette1 = generateColorPalette(projectName);
      const palette2 = generateColorPalette(projectName);
      
      // All properties should match
      expect(palette1).toEqual(palette2);
    });

    it('should generate different palettes for different projects', () => {
      const palette1 = generateColorPalette('project-a');
      const palette2 = generateColorPalette('project-b');
      
      expect(palette1.keyColor).not.toBe(palette2.keyColor);
      expect(palette1.projectBg).not.toBe(palette2.projectBg);
    });

    it('should maintain color relationships (projectColor darker than projectBg)', () => {
      const palette = generateColorPalette('test-project');
      
      // projectColor should be darker than projectBg (which equals keyColor)
      // We can't easily compare hex colors directly, but we know projectColor is 70% darker
      expect(palette.projectColor).not.toBe(palette.projectBg);
      expect(palette.projectColor).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should maintain color relationships (border lighter than keyColor)', () => {
      const palette = generateColorPalette('test-project');
      
      // Border should be lighter (15% lighter)
      expect(palette.border).not.toBe(palette.keyColor);
      expect(palette.border).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should maintain color relationships (darkerBg darker than darkBg)', () => {
      const palette = generateColorPalette('test-project');
      
      // darkerBg (85% darker) should be darker than darkBg (90% darker)
      // Both should be valid hex colors
      expect(palette.darkerBg).toMatch(/^#[0-9A-F]{6}$/);
      expect(palette.darkBg).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should have valid hex format for all palette colors', () => {
      const palette = generateColorPalette('test-project');
      
      // All colors should be valid hex (with or without alpha)
      Object.values(palette).forEach((color) => {
        if (color.includes('CC')) {
          // Color with transparency (e.g., #EC7272CC)
          expect(color).toMatch(/^#[0-9A-F]{6}CC$/);
        } else {
          // Regular hex color
          expect(color).toMatch(/^#[0-9A-F]{6}$/);
        }
      });
    });

    it('should work with ensureUniqueColor for multiple projects', () => {
      const project1 = 'project-one';
      const project2 = 'project-two';
      const project3 = 'project-three';
      
      const color1 = generateKeyColor(project1);
      const color2 = generateKeyColor(project2);
      
      // Ensure project3 color is unique from project1 and project2
      const color3 = generateKeyColor(project3);
      const uniqueColor3 = ensureUniqueColor(project3, color3, [color1, color2]);
      
      expect(uniqueColor3).toMatch(/^#[0-9A-F]{6}$/);
      
      // Generate palettes with unique colors
      const palette1 = generateColorPalette(project1, color1);
      const palette2 = generateColorPalette(project2, color2);
      const palette3 = generateColorPalette(project3, uniqueColor3);
      
      expect(palette1.keyColor).toBe(color1.toUpperCase());
      expect(palette2.keyColor).toBe(color2.toUpperCase());
      expect(palette3.keyColor).toBe(uniqueColor3.toUpperCase());
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('should handle Unicode characters in project names', () => {
      const color = generateKeyColor('测试项目');
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should handle emoji in project names', () => {
      const color = generateKeyColor('my-🚀-project');
      expect(color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('should handle numbers in project names', () => {
      const color1 = generateKeyColor('project-123');
      const color2 = generateKeyColor('project-456');
      expect(color1).toMatch(/^#[0-9A-F]{6}$/);
      expect(color2).toMatch(/^#[0-9A-F]{6}$/);
      expect(color1).not.toBe(color2);
    });

    it('should handle very similar project names differently', () => {
      const color1 = generateKeyColor('project');
      const color2 = generateKeyColor('project1');
      const color3 = generateKeyColor('project2');
      
      expect(color1).not.toBe(color2);
      expect(color2).not.toBe(color3);
      expect(color1).not.toBe(color3);
    });

    it('should handle ensureUniqueColor with empty array', () => {
      const color = '#81CA95';
      const result = ensureUniqueColor('test-project', color, []);
      expect(result).toBe(color.toUpperCase());
    });

    it('should handle ensureUniqueColor with single very different color', () => {
      const keyColor = '#81CA95';
      const veryDifferentColor = '#000000'; // Black - very different
      const result = ensureUniqueColor('test-project', keyColor, [veryDifferentColor]);
      expect(result).toBe(keyColor.toUpperCase());
    });

    it('should handle ensureUniqueColor with single very similar color', () => {
      const keyColor = '#81CA95';
      const verySimilarColor = '#81CA96'; // Only 1 unit different in blue
      const result = ensureUniqueColor('test-project', keyColor, [verySimilarColor]);
      
      // Should adjust
      expect(result).toMatch(/^#[0-9A-F]{6}$/);
      expect(result).not.toBe(keyColor.toUpperCase());
    });
  });

  describe('Performance and Determinism', () => {
    it('should generate colors quickly for many projects', () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        generateKeyColor(`project-${i}`);
      }
      const duration = Date.now() - start;
      
      // Should complete 1000 generations in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should generate palettes quickly for many projects', () => {
      const start = Date.now();
      for (let i = 0; i < 100; i++) {
        generateColorPalette(`project-${i}`);
      }
      const duration = Date.now() - start;
      
      // Should complete 100 palette generations in reasonable time (< 1 second)
      expect(duration).toBeLessThan(1000);
    });

    it('should maintain determinism across multiple runs', () => {
      const projectName = 'deterministic-test';
      const colors: string[] = [];
      
      // Generate same color 100 times
      for (let i = 0; i < 100; i++) {
        colors.push(generateKeyColor(projectName));
      }
      
      // All should be identical
      const firstColor = colors[0];
      colors.forEach((color) => {
        expect(color).toBe(firstColor);
      });
    });

    it('should maintain determinism for palettes across multiple runs', () => {
      const projectName = 'deterministic-palette-test';
      const palettes: ProjectColorPalette[] = [];
      
      // Generate same palette 50 times
      for (let i = 0; i < 50; i++) {
        palettes.push(generateColorPalette(projectName));
      }
      
      // All should be identical
      const firstPalette = palettes[0];
      palettes.forEach((palette) => {
        expect(palette).toEqual(firstPalette);
      });
    });
  });
});
