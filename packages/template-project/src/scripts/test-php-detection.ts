#!/usr/bin/env node
/**
 * Test PHP Detection
 * 
 * Standalone script to test PHP detection and debugging
 */

import { checkPhp, printPhpInstallInstructions, printPathFixInstructions } from '../features/framework-cli/php-checker.js';
import chalk from 'chalk';

console.log(chalk.bold.blue('\n════════════════════════════════════════'));
console.log(chalk.bold.blue('  PHP Detection & Debugging Test'));
console.log(chalk.bold.blue('════════════════════════════════════════\n'));

// Run comprehensive PHP check
const result = checkPhp(true);

// Print detailed result object
console.log(chalk.bold('\n📊 Detection Result:'));
console.log(JSON.stringify(result, null, 2));

// Print issues if any
if (result.issues.length > 0) {
    console.log(chalk.bold.yellow('\n⚠️  Issues Found:'));
    result.issues.forEach((issue: string) => {
        console.log(chalk.yellow(`   • ${issue}`));
    });
}

// Print final verdict
console.log(chalk.bold('\n🏁 Final Verdict:'));
if (result.isAvailable && result.inPath && result.composerAvailable) {
    console.log(chalk.green('   ✅ Ready to create Slim Framework projects!'));
} else if (result.isAvailable && !result.inPath) {
    console.log(chalk.yellow('   ⚠️  PHP installed but not in PATH'));
    console.log(chalk.yellow('   ⚠️  Composer commands will fail'));
    console.log(chalk.yellow('   ⚠️  Project creation will fail'));
    if (result.phpPath) {
        printPathFixInstructions(result.phpPath);
    }
} else {
    console.log(chalk.red('   ❌ Cannot create Slim Framework projects'));
    printPhpInstallInstructions();
}

console.log('');

// Exit with appropriate code
process.exit(result.isAvailable && result.inPath && result.composerAvailable ? 0 : 1);
