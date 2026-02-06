#!/usr/bin/env node

/**
 * Postinstall script to initialize taskmaster-ai
 * Runs automatically after npm install
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = process.cwd();
const taskmasterDir = path.join(projectRoot, '.taskmaster');

// Check if .taskmaster already exists
if (fs.existsSync(taskmasterDir)) {
  console.log('✓ taskmaster-ai already initialized');
  return;
}

// Initialize taskmaster-ai using CLI
try {
  // Use taskmaster-ai CLI to initialize
  execSync('npx taskmaster-ai init', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('✓ taskmaster-ai initialized successfully');
} catch (error) {
  console.warn('⚠ Could not auto-initialize taskmaster-ai:', error.message);
  console.log('Run manually: npx taskmaster-ai init');
}
