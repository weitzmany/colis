/**
 * PHP Installation Checker and Debugger
 *
 * Comprehensive PHP detection with detailed debugging information
 */
import { execSync } from 'child_process';
import chalk from 'chalk';
/**
 * Comprehensive PHP availability check with debugging
 */
export function checkPhp(verbose = true) {
    const result = {
        isAvailable: false,
        phpPath: null,
        phpVersion: null,
        inPath: false,
        homebrewInstalled: false,
        composerAvailable: false,
        issues: [],
        recommendations: []
    };
    if (verbose) {
        console.log(chalk.blue('\n🔍 Checking PHP installation...'));
    }
    // 1. Check if PHP is in PATH
    try {
        const phpVersion = execSync('php --version', { encoding: 'utf-8', stdio: 'pipe' });
        result.inPath = true;
        result.phpPath = execSync('which php', { encoding: 'utf-8', stdio: 'pipe' }).trim();
        result.phpVersion = phpVersion.split('\n')[0];
        result.isAvailable = true;
        if (verbose) {
            console.log(chalk.green('✓ PHP found in PATH'));
            console.log(chalk.gray(`  Path: ${result.phpPath}`));
            console.log(chalk.gray(`  Version: ${result.phpVersion}`));
        }
    }
    catch (error) {
        result.issues.push('PHP not found in PATH');
        if (verbose) {
            console.log(chalk.yellow('✗ PHP not found in PATH'));
        }
        // 2. Check common Homebrew locations
        const homebrewPaths = [
            '/usr/local/opt/php/bin/php',
            '/opt/homebrew/opt/php/bin/php',
            '/usr/local/bin/php',
            '/opt/homebrew/bin/php'
        ];
        if (verbose) {
            console.log(chalk.blue('  Checking Homebrew PHP locations...'));
        }
        for (const tryPath of homebrewPaths) {
            try {
                const phpVersion = execSync(`${tryPath} --version`, { encoding: 'utf-8', stdio: 'pipe' });
                result.homebrewInstalled = true;
                result.phpPath = tryPath;
                result.phpVersion = phpVersion.split('\n')[0];
                result.isAvailable = true;
                result.issues.push(`PHP found at ${tryPath} but not in PATH`);
                result.recommendations.push('Run: brew link php');
                result.recommendations.push('Or add to ~/.zshrc: export PATH="/usr/local/opt/php/bin:$PATH"');
                if (verbose) {
                    console.log(chalk.yellow(`  ⚠ PHP found at: ${tryPath}`));
                    console.log(chalk.yellow(`     Version: ${result.phpVersion}`));
                    console.log(chalk.yellow(`     But NOT in PATH!`));
                }
                break;
            }
            catch {
                // Continue checking
            }
        }
        if (!result.isAvailable && verbose) {
            console.log(chalk.red('  ✗ PHP not found in common Homebrew locations'));
        }
    }
    // 3. Check Composer availability
    try {
        execSync('composer --version', { stdio: 'ignore' });
        result.composerAvailable = true;
        if (verbose) {
            console.log(chalk.green('✓ Composer is available'));
        }
    }
    catch (error) {
        result.issues.push('Composer not found in PATH');
        if (verbose) {
            console.log(chalk.yellow('✗ Composer not found in PATH'));
        }
        // Check if Composer might be installed but needs PHP
        if (!result.inPath && result.homebrewInstalled) {
            result.recommendations.push('Composer requires PHP in PATH to work');
        }
        else if (!result.isAvailable) {
            result.recommendations.push('Install Composer: https://getcomposer.org/');
        }
    }
    // 4. Print current PATH
    if (verbose && !result.inPath) {
        console.log(chalk.blue('\n📋 Current PATH:'));
        const pathDirs = process.env.PATH?.split(':') || [];
        pathDirs.forEach(dir => {
            console.log(chalk.gray(`  ${dir}`));
        });
    }
    // 5. Print recommendations
    if (verbose && result.recommendations.length > 0) {
        console.log(chalk.yellow('\n💡 Recommendations:'));
        result.recommendations.forEach(rec => {
            console.log(chalk.yellow(`  • ${rec}`));
        });
    }
    // 6. Final status
    if (verbose) {
        console.log('');
        if (result.isAvailable && result.inPath && result.composerAvailable) {
            console.log(chalk.green('✅ PHP and Composer are properly configured'));
        }
        else if (result.isAvailable && !result.inPath) {
            console.log(chalk.yellow('⚠️  PHP is installed but not in PATH'));
            console.log(chalk.yellow('    Composer commands will fail until PHP is in PATH'));
        }
        else {
            console.log(chalk.red('❌ PHP is not installed or not accessible'));
            console.log(chalk.red('    Cannot create Slim Framework projects'));
        }
    }
    return result;
}
/**
 * Quick PHP availability check (no output)
 */
export function isPhpAvailable() {
    const result = checkPhp(false);
    return result.isAvailable && result.inPath;
}
/**
 * Print PHP installation instructions
 */
export function printPhpInstallInstructions() {
    console.log(chalk.yellow('\n📦 How to install PHP:'));
    console.log('');
    console.log(chalk.blue('macOS (Homebrew):'));
    console.log(chalk.gray('  brew install php'));
    console.log(chalk.gray('  brew link php'));
    console.log('');
    console.log(chalk.blue('Ubuntu/Debian:'));
    console.log(chalk.gray('  sudo apt update'));
    console.log(chalk.gray('  sudo apt install php-cli php-mbstring php-xml'));
    console.log('');
    console.log(chalk.blue('Windows:'));
    console.log(chalk.gray('  Download from: https://windows.php.net/download/'));
    console.log('');
    console.log(chalk.yellow('After installation, verify with:'));
    console.log(chalk.gray('  php --version'));
    console.log('');
}
/**
 * Print PATH fix instructions for Homebrew PHP
 */
export function printPathFixInstructions(_phpPath) {
    console.log(chalk.yellow('\n🔧 How to fix PATH issue:'));
    console.log('');
    console.log(chalk.blue('Option 1: Link PHP (Recommended):'));
    console.log(chalk.gray('  brew link --overwrite php'));
    console.log('');
    console.log(chalk.blue('Option 2: Add to PATH manually:'));
    console.log(chalk.gray('  echo \'export PATH="/usr/local/opt/php/bin:$PATH"\' >> ~/.zshrc'));
    console.log(chalk.gray('  source ~/.zshrc'));
    console.log('');
    console.log(chalk.yellow('After fixing, verify with:'));
    console.log(chalk.gray('  php --version'));
    console.log(chalk.gray('  composer --version'));
    console.log('');
}
//# sourceMappingURL=php-checker.js.map