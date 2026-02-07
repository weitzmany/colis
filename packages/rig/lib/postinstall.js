#!/usr/bin/env node

/**
 * Postinstall Script
 * 
 * Automatically runs project initialization after npm install.
 * This copies rules, commands, and initializes Port Manager.
 */

import * as path from 'path';
import * as fs from 'fs';
import { pathToFileURL } from 'url';

async function runPostinstall() {
  try {
    const projectRoot = process.cwd();
    const packageJsonPath = path.join(projectRoot, 'package.json');
    
    // Only run if we're in a project (has package.json)
    if (!fs.existsSync(packageJsonPath)) {
      return; // Not in a project, skip
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Skip if this is the packages repo itself
    if (projectRoot.includes('packages/packages/core') || projectRoot.includes('packages/core')) {
      return; // Skip in packages repo
    }
    
    // Find the installed package in node_modules
    const nodeModulesPath = path.join(projectRoot, 'node_modules', '@your-org', 'core');
    const distPath = path.join(nodeModulesPath, 'dist');
    
    // Check if dist exists (package was built)
    if (!fs.existsSync(distPath)) {
      console.warn('⚠️  @colis/rig: dist folder not found. Package may need to be built.');
      console.warn('   Run "npx @colis/rig init" manually after building.');
      return;
    }
    
    // Import and run initialization
    try {
      // Convert path to file:// URL for ES module import
      const modulePath = path.join(nodeModulesPath, 'dist', 'features', 'commissioning', 'project-initializer.js');
      const moduleUrl = pathToFileURL(modulePath).href;
      const { initializeProject } = await import(moduleUrl);
      
      console.log('🚀 @colis/rig: Initializing project...');
      
      const result = await initializeProject({
        skipExisting: true, // Don't overwrite existing files
      });
      
      if (result.success) {
        console.log('✅ @colis/rig: Project initialized successfully!');
      } else {
        console.warn('⚠️  @colis/rig: Initialization completed with errors:');
        result.errors.forEach(err => console.warn(`   - ${err}`));
        console.warn('   Run "npx @colis/rig init" manually to retry.');
      }
    } catch (error) {
      // If initialization code fails, don't fail the install
      console.warn('⚠️  @colis/rig: Automatic initialization failed.');
      console.warn(`   Error: ${error.message}`);
      console.warn('   Run "npx @colis/rig init" manually to initialize your project.');
    }
  } catch (error) {
    // Don't fail npm install if postinstall fails
    console.warn('⚠️  @colis/rig: Postinstall script error:', error.message);
    console.warn('   Run "npx @colis/rig init" manually to initialize your project.');
  }
}

// Run the postinstall
runPostinstall().catch(() => {
  // Silently fail - don't break npm install
});
