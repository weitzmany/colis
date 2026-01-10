/**
 * Colors Command
 * 
 * Display available colors and current project color palette
 */

import chalk from 'chalk';
import { generateColorPalette, generateKeyColor } from '../../color-manager';
import { generateProjectName } from '../../../port-manager/utils/project-name';
import { PortManager } from '../../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as os from 'os';

/**
 * Display a color block in terminal
 */
function displayColorBlock(color: string, label: string, width: number = 20): string {
  // Convert hex to RGB for terminal color
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  const block = '█'.repeat(width);
  return chalk.rgb(r, g, b)(block) + ` ${label} (${color})`;
}

/**
 * Get all projects from Port Manager
 */
async function getAllProjects(): Promise<string[]> {
  try {
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();
    const assignments = await portManager.listPorts({ status: 'active' });
    await portManager.disconnect();

    // Get unique project names
    const projectNames = [...new Set(assignments.map(a => a.projectName))];
    return projectNames;
  } catch (error) {
    // Port Manager not available, return empty array
    return [];
  }
}

/**
 * Find projects by scanning for .githooks/post-checkout files
 */
async function findProjectsWithHooks(): Promise<Array<{ name: string; path: string; keyColor: string }>> {
  const projects: Array<{ name: string; path: string; keyColor: string }> = [];
  const homeDir = os.homedir();
  const documentsPath = path.join(homeDir, 'Documents');
  
  // Common project locations
  const searchPaths = [
    path.join(documentsPath, 'Projects'),
    path.join(documentsPath),
  ];

  for (const searchPath of searchPaths) {
    if (!(await fs.pathExists(searchPath))) continue;

    try {
      const entries = await fs.readdir(searchPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        
        const projectPath = path.join(searchPath, entry.name);
        const hookPath = path.join(projectPath, '.githooks', 'post-checkout');
        
        if (await fs.pathExists(hookPath)) {
          try {
            const hookContent = await fs.readFile(hookPath, 'utf-8');
            const keyColorMatch = hookContent.match(/KEY_COLOR="([^"]+)"/);
            const keyColor = keyColorMatch ? keyColorMatch[1] : 'unknown';
            
            projects.push({
              name: entry.name,
              path: projectPath,
              keyColor,
            });
          } catch {
            // Skip if can't read
          }
        }
      }
    } catch {
      // Skip if can't read directory
    }
  }

  return projects;
}

export async function colorsCommand(options: {
  projectName?: string;
  path?: string;
  showPalette?: boolean;
  all?: boolean;
}) {
  try {
    // Always show base palette first
    console.log(chalk.bold('\n🎨 Base Color Palette'));
    console.log(chalk.gray('─'.repeat(60)));
    
    const basePalette = {
      lightGray: '#DBDCE0',
      lightBlue: '#8AB4F9',
      coral: '#F38B82',
      yellow: '#FDD664',
      green: '#80CA95',
      pink: '#FF8BCC',
      purple: '#C58AFA',
      cyan: '#78D9ED',
      orange: '#FCAD70',
    };
    
    Object.entries(basePalette).forEach(([name, color]) => {
      const capitalized = name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1').trim();
      console.log(displayColorBlock(color, capitalized, 15));
    });
    
    // Show all projects' colors if requested
    if (options.all) {
      console.log(chalk.bold('\n\n🎨 All Projects Colors'));
      console.log(chalk.gray('─'.repeat(60)));
      
      // Get projects from Port Manager
      const portManagerProjects = await getAllProjects();
      
      // Also find projects with hooks
      const hookProjects = await findProjectsWithHooks();
      
      // Combine and deduplicate
      const allProjects = new Map<string, { name: string; keyColor: string }>();
      
      // Add from Port Manager (generate colors)
      for (const projectName of portManagerProjects) {
        const keyColor = generateKeyColor(projectName);
        allProjects.set(projectName, { name: projectName, keyColor });
      }
      
      // Add from hooks (use actual colors)
      for (const project of hookProjects) {
        const projectName = generateProjectName(project.path);
        allProjects.set(projectName, { name: projectName, keyColor: project.keyColor });
      }
      
      if (allProjects.size === 0) {
        console.log(chalk.yellow('\n  No projects found'));
      } else {
        // Sort by project name
        const sortedProjects = Array.from(allProjects.values()).sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        
        console.log(chalk.dim(`\n  Found ${sortedProjects.length} project(s):\n`));
        
        sortedProjects.forEach((project, index) => {
          const palette = generateColorPalette(project.name, project.keyColor);
          console.log(
            chalk.bold(`${(index + 1).toString().padStart(2)}. `) +
            chalk.cyan(project.name.padEnd(30)) +
            displayColorBlock(palette.keyColor, palette.keyColor, 10)
          );
        });
      }
    }
    
    // Show current project colors
    const projectPath = options.path || process.cwd();
    const projectName = options.projectName || generateProjectName(projectPath);
    const palette = generateColorPalette(projectName);
    
    console.log(chalk.bold('\n\n🎨 Current Project Colors: ') + chalk.cyan(projectName));
    console.log(chalk.gray('─'.repeat(60)));
    
    console.log(chalk.bold('\nProject KEY_COLOR:'));
    console.log(displayColorBlock(palette.keyColor, 'KEY_COLOR'));
    
    console.log(chalk.bold('\nBranch Colors:'));
    console.log(displayColorBlock(palette.mainBg, 'Main/Master (RED)'));
    console.log(displayColorBlock(palette.devBg, 'Development/Dev (ORANGE)'));
    console.log(displayColorBlock(palette.projectBg, 'Other Branches (Project KEY_COLOR)'));
    
    console.log(chalk.bold('\nFull Palette:'));
    const colorGroups = [
      { title: 'Main Branch', colors: [
        { name: 'Background', value: palette.mainBg },
        { name: 'Text', value: palette.mainColor },
        { name: 'Inactive', value: palette.mainInactive },
      ]},
      { title: 'Development Branch', colors: [
        { name: 'Background', value: palette.devBg },
        { name: 'Text', value: palette.devColor },
        { name: 'Inactive', value: palette.devInactive },
      ]},
      { title: 'Project Colors', colors: [
        { name: 'Background', value: palette.projectBg },
        { name: 'Text', value: palette.projectColor },
        { name: 'Inactive', value: palette.projectInactive },
        { name: 'Border', value: palette.border },
        { name: 'Darker BG', value: palette.darkerBg },
        { name: 'Dark BG', value: palette.darkBg },
        { name: 'Active', value: palette.activeColor },
      ]},
    ];
    
    colorGroups.forEach(group => {
      console.log(chalk.bold(`\n${group.title}:`));
      group.colors.forEach(color => {
        console.log(displayColorBlock(color.value, color.name, 15));
      });
    });
    
    console.log(chalk.gray('\n' + '─'.repeat(60)));
    console.log(chalk.dim('\n💡 Tip: Use --all to see all projects\' colors'));
    console.log(chalk.dim('   Colors are automatically applied when you switch branches\n'));
    
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}
