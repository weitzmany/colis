#!/usr/bin/env node

/**
 * CLI command for manual taskmaster-ai initialization
 * Usage: task-manager-init [project-root]
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const projectRoot = process.argv[2] || process.cwd();
const taskmasterDir = path.join(projectRoot, '.taskmaster');

if (fs.existsSync(taskmasterDir)) {
  console.log('taskmaster-ai already initialized at:', taskmasterDir);
  process.exit(0);
}

try {
  execSync('npx taskmaster-ai init', {
    cwd: projectRoot,
    stdio: 'inherit',
  });
  console.log('✓ taskmaster-ai initialized successfully');
} catch (error) {
  console.error('✗ Failed to initialize taskmaster-ai:', error.message);
  process.exit(1);
}
