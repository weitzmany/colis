# Manual Test Plan for Project Template Creation

This document provides a comprehensive test plan for manually verifying that project creation works correctly.

## Prerequisites

Before testing, ensure:
- [ ] Node.js 18+ is installed
- [ ] npm/yarn/pnpm is available
- [ ] Git is installed
- [ ] You're in a clean directory (or use a test directory)
- [ ] `@colis/rig` package is built and linked

## Test Setup

### 1. Prepare Test Environment

```bash
# Create a test directory
mkdir -p ~/test-projects
cd ~/test-projects

# Ensure rig package is linked
cd ~/Documents/packages/packages/rig
npm link

# Link template-project package
cd ~/Documents/packages/packages/template-project
npm link
```

## Test Case 1: Angular Template (Default)

### Command to Run

```bash
cd ~/test-projects
npx @your-org/template-project create test-angular-app
```

### Step-by-Step Verification

#### 1.1 Directory Structure Check

**Expected Structure:**
```
test-angular-app/
├── angular.json
├── karma.conf.js
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── .gitignore
├── README.md
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.css
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.routes.ts
│   ├── components/
│   └── services/
└── public/
```

**Checklist:**
- [ ] `test-angular-app/` directory exists
- [ ] `angular.json` file exists
- [ ] `package.json` file exists
- [ ] `tsconfig.json` file exists
- [ ] `tsconfig.app.json` file exists
- [ ] `karma.conf.js` file exists
- [ ] `.gitignore` file exists
- [ ] `README.md` file exists
- [ ] `src/` directory exists
- [ ] `src/app/` directory exists
- [ ] `src/components/` directory exists
- [ ] `src/services/` directory exists
- [ ] `public/` directory exists
- [ ] No `.hbs` files remain (all processed)

#### 1.2 File Content Verification

**Check `package.json`:**
- [ ] Name is `test-angular-app` (kebab-case)
- [ ] Version is `1.0.0`
- [ ] Description matches what you entered (or is empty)
- [ ] Author matches what you entered (or is empty)
- [ ] License matches what you selected (or is empty)
- [ ] Scripts include: `start`, `build`, `test`
- [ ] Dependencies include Angular 17+ packages
- [ ] DevDependencies include Angular CLI, TypeScript, Karma, Jasmine

**Check `angular.json`:**
- [ ] Project name is `test-angular-app`
- [ ] Source root is `src`
- [ ] Output path is `dist/test-angular-app`
- [ ] Build configuration exists
- [ ] Serve configuration exists

**Check `tsconfig.json`:**
- [ ] Target is ES2022
- [ ] Strict mode is enabled
- [ ] Angular compiler options are present

**Check `src/app/app.component.ts`:**
- [ ] Component class exists
- [ ] Title is `test-angular-app` (not `{{projectName}}`)
- [ ] No template variables remain

**Check `src/main.ts`:**
- [ ] Bootstrap code exists
- [ ] Router provider is configured
- [ ] No template variables remain

**Check `README.md`:**
- [ ] Project name appears correctly
- [ ] Description appears (if provided)
- [ ] Installation instructions are correct
- [ ] Development server command shows correct port
- [ ] No template variables like `{{projectName}}` remain

#### 1.3 Project Initialization Verification

**Check `.cursor/` directory:**
- [ ] `.cursor/rules/experts/` directory exists
- [ ] `.cursor/rules/user/` directory exists
- [ ] `.cursor/commands/general/` directory exists
- [ ] Expert persona files are present (26 files expected)
- [ ] User rule files are present (3+ files expected)
- [ ] No `local/` commands were copied (packages repo only)

**Check Port Manager:**
```bash
cd test-angular-app
port-manager list
```
- [ ] Project `test-angular-app` appears in port list
- [ ] App type is `angular`
- [ ] Port is allocated (should be 4200 or similar)
- [ ] Port status is `active`

**Check Port Configuration Files:**
- [ ] Check if port appears in any config files (if framework supports it)
- [ ] Port number matches allocated port

**Check IDE Colors:**
- [ ] `.githooks/post-checkout` file exists
- [ ] `.githooks/post-checkout` is executable (`chmod +x .githooks/post-checkout`)
- [ ] `.vscode/settings.json` exists
- [ ] `.vscode/settings.json` contains color settings
- [ ] `.vscode/settings.json` is in `.gitignore`
- [ ] Git hooks path is configured: `git config core.hooksPath` should show `.githooks`

**Check Git Setup:**
- [ ] `.git/` directory exists
- [ ] `.gitignore` file exists
- [ ] Initial commit may or may not exist (depends on implementation)

#### 1.4 Dependencies Verification

**Check `node_modules/`:**
- [ ] `node_modules/` directory exists (if dependencies were installed)
- [ ] Angular packages are installed
- [ ] TypeScript is installed
- [ ] Testing packages (Karma, Jasmine) are installed

**Verify Installation:**
```bash
cd test-angular-app
npm list --depth=0
```
- [ ] All dependencies are listed
- [ ] No missing dependencies
- [ ] Versions match package.json

#### 1.5 Build and Run Verification

**Test Build:**
```bash
cd test-angular-app
npm run build
```
- [ ] Build completes without errors
- [ ] `dist/` directory is created
- [ ] Build output exists

**Test Development Server:**
```bash
cd test-angular-app
npm start
```
- [ ] Server starts successfully
- [ ] Server runs on correct port (4200 or allocated port)
- [ ] Browser shows "Welcome to test-angular-app"
- [ ] No console errors

**Test Tests:**
```bash
cd test-angular-app
npm test
```
- [ ] Tests run successfully
- [ ] Karma test runner starts
- [ ] At least one test passes

---

## Test Case 2: Slim Template

### Command to Run

```bash
cd ~/test-projects
npx @your-org/template-project create test-slim-api --template slim
```

### Step-by-Step Verification

#### 2.1 Directory Structure Check

**Expected Structure:**
```
test-slim-api/
├── composer.json
├── phpunit.xml
├── phpstan.neon
├── .gitignore
├── README.md
├── config/
│   └── container.php
├── public/
│   ├── index.php
│   └── .htaccess
├── src/
│   ├── routes/
│   │   └── routes.php
│   ├── controllers/
│   │   └── HomeController.php
│   ├── middleware/
│   │   └── ExampleMiddleware.php
│   ├── models/
│   └── utils/
└── tests/
    └── ExampleTest.php
```

**Checklist:**
- [ ] `test-slim-api/` directory exists
- [ ] `composer.json` file exists
- [ ] `phpunit.xml` file exists
- [ ] `phpstan.neon` file exists
- [ ] `.gitignore` file exists
- [ ] `README.md` file exists
- [ ] `config/` directory exists
- [ ] `public/` directory exists
- [ ] `public/index.php` exists
- [ ] `public/.htaccess` exists
- [ ] `src/routes/` directory exists
- [ ] `src/controllers/` directory exists
- [ ] `src/middleware/` directory exists
- [ ] `src/models/` directory exists
- [ ] `tests/` directory exists
- [ ] No `.hbs` files remain

#### 2.2 File Content Verification

**Check `composer.json`:**
- [ ] Name is `test-slim-api/test-slim-api`
- [ ] Description matches what you entered
- [ ] PHP version requirement is `^8.1`
- [ ] Dependencies include `slim/slim` ^4.12.0
- [ ] Dependencies include `php-di/php-di`
- [ ] Dependencies include `monolog/monolog`
- [ ] DevDependencies include `phpunit/phpunit`
- [ ] Scripts include: `start`, `test`, `analyse`, `cs-check`, `cs-fix`
- [ ] Autoload PSR-4 namespace is `App\\`
- [ ] No template variables remain

**Check `public/index.php`:**
- [ ] PHP opening tag `<?php` exists
- [ ] `declare(strict_types=1);` is present
- [ ] Container builder is configured
- [ ] App factory is used
- [ ] Routes file is included
- [ ] No template variables remain

**Check `src/routes/routes.php`:**
- [ ] Health check route `/health` exists
- [ ] API root route `/api` exists
- [ ] Routes return JSON responses
- [ ] Project name appears in responses (not `{{projectName}}`)

**Check `src/controllers/HomeController.php`:**
- [ ] Namespace is `App\Controllers`
- [ ] Class name is `HomeController`
- [ ] Controller methods exist
- [ ] No template variables remain

**Check `README.md`:**
- [ ] Project name appears correctly
- [ ] PHP version requirement is mentioned
- [ ] Composer installation instructions
- [ ] Development server command shows correct port (8000)
- [ ] Testing instructions
- [ ] No template variables remain

#### 2.3 Project Initialization Verification

**Check `.cursor/` directory:**
- [ ] Same checks as Angular template (rules, commands, experts)

**Check Port Manager:**
```bash
cd test-slim-api
port-manager list
```
- [ ] Project `test-slim-api` appears in port list
- [ ] App type is `php`
- [ ] Port is allocated (should be 8000 or similar)
- [ ] Port status is `active`

**Check IDE Colors:**
- [ ] Same checks as Angular template

**Check Git Setup:**
- [ ] Same checks as Angular template

#### 2.4 Dependencies Verification

**Check Composer:**
```bash
cd test-slim-api
composer install
```
- [ ] `vendor/` directory is created
- [ ] Slim packages are installed
- [ ] PHP-DI is installed
- [ ] Monolog is installed
- [ ] No dependency errors

**Verify Installation:**
```bash
composer show
```
- [ ] All dependencies are listed
- [ ] Versions match composer.json

#### 2.5 Run Verification

**Test Development Server:**
```bash
cd test-slim-api
composer start
# Or: php -S localhost:8000 -t public public/index.php
```
- [ ] Server starts successfully
- [ ] Server runs on correct port (8000 or allocated port)
- [ ] Health endpoint works: `curl http://localhost:8000/health`
- [ ] API endpoint works: `curl http://localhost:8000/api`
- [ ] Responses are valid JSON
- [ ] No PHP errors

**Test Tests:**
```bash
cd test-slim-api
composer test
```
- [ ] PHPUnit runs successfully
- [ ] At least one test passes

---

## Test Case 3: Full-Stack Template

### Command to Run

```bash
cd ~/test-projects
npx @your-org/template-project create test-fullstack --template full-stack
```

### Verification Points

- [ ] Next.js frontend structure exists (`src/app/`)
- [ ] Express backend structure exists (`src/api/`)
- [ ] Both `package.json` scripts work
- [ ] Frontend runs on one port
- [ ] Backend API runs on another port
- [ ] Port Manager assigns appropriate ports

---

## Test Case 4: Command-Line Options

### Test 4.1: Skip Dependencies

```bash
npx @your-org/template-project create test-skip-deps --skip-deps
```

**Verify:**
- [ ] Project structure is created
- [ ] `node_modules/` does NOT exist
- [ ] `package.json` exists with dependencies listed
- [ ] User can manually run `npm install` later

### Test 4.2: Skip Git

```bash
npx @your-org/template-project create test-skip-git --skip-git
```

**Verify:**
- [ ] Project structure is created
- [ ] `.git/` directory does NOT exist
- [ ] `.gitignore` still exists (for future git init)

### Test 4.3: Skip Project Initialization

```bash
npx @your-org/template-project create test-skip-init --skip-init
```

**Verify:**
- [ ] Project structure is created
- [ ] `.cursor/` directory does NOT exist
- [ ] Port Manager is NOT initialized
- [ ] IDE colors are NOT set up
- [ ] User can manually run `npx @colis/rig init` later

### Test 4.4: Overwrite Existing Files

```bash
# Create project first
npx @your-org/template-project create test-overwrite

# Modify a file
echo "modified" > test-overwrite/README.md

# Create again with --overwrite
npx @your-org/template-project create test-overwrite --overwrite
```

**Verify:**
- [ ] Project is recreated
- [ ] Modified `README.md` is overwritten with template version
- [ ] No errors about existing files

### Test 4.5: Dry Run

```bash
npx @your-org/template-project create test-dry-run --dry-run
```

**Verify:**
- [ ] No files are actually created
- [ ] List of files that would be created is shown
- [ ] No errors occur

### Test 4.6: Custom Options

```bash
npx @your-org/template-project create test-custom \
  --template angular \
  --package-manager pnpm \
  --description "My awesome app" \
  --author "John Doe" \
  --license "MIT"
```

**Verify:**
- [ ] Template type is Angular
- [ ] `package.json` uses pnpm scripts format
- [ ] Description appears in `package.json` and `README.md`
- [ ] Author appears in `package.json`
- [ ] License appears in `package.json`

---

## Test Case 5: Error Scenarios

### Test 5.1: Invalid Project Name

```bash
npx @your-org/template-project create "invalid name with spaces"
```

**Expected:**
- [ ] Error message about invalid project name
- [ ] Suggestion to use kebab-case
- [ ] No project is created

### Test 5.2: Non-Existent Template

```bash
npx @your-org/template-project create test-invalid --template non-existent
```

**Expected:**
- [ ] Error message about template not found
- [ ] List of available templates is shown
- [ ] No project is created

### Test 5.3: Existing Directory (Without Overwrite)

```bash
mkdir test-existing
npx @your-org/template-project create test-existing
```

**Expected:**
- [ ] Warning about existing directory
- [ ] Project creation is skipped
- [ ] No files are overwritten

---

## Test Case 6: Integration Points

### 6.1 Port Manager Integration

**After creating project:**
```bash
cd test-angular-app
port-manager list
port-manager show test-angular-app
```

**Verify:**
- [ ] Project appears in port registry
- [ ] Port is allocated correctly
- [ ] Port matches framework defaults (4200 for Angular, 8000 for Slim)
- [ ] Port is marked as active

### 6.2 Project Initialization Integration

**Check that init ran automatically:**
```bash
cd test-angular-app
ls -la .cursor/rules/experts/ | wc -l  # Should show ~26 files
ls -la .cursor/rules/user/ | wc -l     # Should show ~3 files
ls -la .cursor/commands/general/       # Should show general commands
```

**Verify:**
- [ ] Rules were copied
- [ ] Commands were copied
- [ ] Local commands were NOT copied
- [ ] Port Manager was initialized

### 6.3 IDE Colors Integration

**Check Git Hook:**
```bash
cd test-angular-app
cat .githooks/post-checkout
```

**Verify:**
- [ ] Hook file contains color update logic
- [ ] Hook references project name correctly
- [ ] Hook is executable

**Check VS Code Settings:**
```bash
cat .vscode/settings.json
```

**Verify:**
- [ ] Settings file contains color configuration
- [ ] Colors reference project-specific values
- [ ] Settings file is in `.gitignore`

**Test Branch Switching:**
```bash
cd test-angular-app
git checkout -b feature/test
```

**Verify:**
- [ ] IDE colors update (if VS Code is open)
- [ ] Colors match project color scheme

---

## Test Case 7: Template Variable Substitution

### Check All Files for Remaining Variables

**Run this command in created project:**
```bash
cd test-angular-app
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git
```

**Verify:**
- [ ] No `{{projectName}}` variables remain
- [ ] No `{{port}}` variables remain
- [ ] No `{{packageManager}}` variables remain
- [ ] No other template variables remain

**Common files to check:**
- [ ] `package.json` - project name, description, author, license
- [ ] `README.md` - project name, description, port, commands
- [ ] `angular.json` / `composer.json` - project name
- [ ] Source files - project name in code
- [ ] Configuration files - any project-specific values

---

## Test Case 8: Port Configuration in Files

### Angular Template

**Check if port is configured:**
```bash
cd test-angular-app
grep -r "4200\|port" package.json angular.json
```

**Verify:**
- [ ] Port appears in `package.json` start script (if template includes it)
- [ ] Port matches allocated port from Port Manager

### Slim Template

**Check if port is configured:**
```bash
cd test-slim-api
grep -r "8000\|PORT" composer.json public/index.php
```

**Verify:**
- [ ] Port appears in `composer.json` start script
- [ ] Port matches allocated port from Port Manager

---

## Test Case 9: Package Manager Specific Checks

### npm

```bash
npx @your-org/template-project create test-npm --package-manager npm
cd test-npm
```

**Verify:**
- [ ] `package-lock.json` exists (if deps installed)
- [ ] Scripts use `npm run` format
- [ ] README shows npm commands

### yarn

```bash
npx @your-org/template-project create test-yarn --package-manager yarn
cd test-yarn
```

**Verify:**
- [ ] `yarn.lock` exists (if deps installed)
- [ ] Scripts use `yarn` format
- [ ] README shows yarn commands

### pnpm

```bash
npx @your-org/template-project create test-pnpm --package-manager pnpm
cd test-pnpm
```

**Verify:**
- [ ] `pnpm-lock.yaml` exists (if deps installed)
- [ ] Scripts use `pnpm` format
- [ ] README shows pnpm commands

---

## Test Case 10: Complete Workflow Test

### End-to-End Test

```bash
# 1. Create project
npx @your-org/template-project create my-blog --template angular

# 2. Navigate to project
cd my-blog

# 3. Verify structure
ls -la
tree -L 2  # If tree is installed

# 4. Check Port Manager
port-manager list | grep my-blog

# 5. Check Project Initialization
ls -la .cursor/rules/experts/ | head -5

# 6. Check IDE colors
cat .vscode/settings.json | grep -i color

# 7. Check Git
git status

# 8. Install dependencies (if skipped)
npm install

# 9. Build project
npm run build

# 10. Start development server
npm start
# Open browser to http://localhost:4200

# 11. Verify it works
curl http://localhost:4200  # Or open in browser
```

**Success Criteria:**
- [ ] All steps complete without errors
- [ ] Project runs successfully
- [ ] Browser shows expected content
- [ ] No console errors

---

## Quick Verification Checklist

After running `npx @your-org/template-project create my-app`, quickly verify:

### Structure (30 seconds)
- [ ] Project directory exists
- [ ] Main config files exist (`package.json` or `composer.json`)
- [ ] Source directory exists (`src/`)
- [ ] README exists

### Content (1 minute)
- [ ] Open `package.json` / `composer.json` - project name is correct
- [ ] Open `README.md` - project name appears correctly
- [ ] No `{{projectName}}` or other template variables visible

### Integration (1 minute)
- [ ] `.cursor/` directory exists
- [ ] Port Manager shows project: `port-manager list | grep my-app`
- [ ] `.vscode/settings.json` exists (for IDE colors)
- [ ] `.githooks/post-checkout` exists

### Functionality (2 minutes)
- [ ] Dependencies installed (check `node_modules/` or `vendor/`)
- [ ] Project builds: `npm run build` or `composer install`
- [ ] Project runs: `npm start` or `composer start`
- [ ] Server starts on correct port

---

## Common Issues to Watch For

### Issue 1: Template Variables Not Replaced

**Symptom:** Files contain `{{projectName}}` instead of actual name

**Check:**
```bash
grep -r "{{" . --exclude-dir=node_modules
```

**Fix:** Template processor may have failed - check error logs

### Issue 2: Port Not Allocated

**Symptom:** Port Manager doesn't show project

**Check:**
```bash
port-manager list
```

**Fix:** Project Initialization may have failed - check if `.cursor/` exists

### Issue 3: IDE Colors Not Set Up

**Symptom:** `.vscode/settings.json` missing or `.githooks/post-checkout` missing

**Check:**
```bash
ls -la .vscode/settings.json
ls -la .githooks/post-checkout
git config core.hooksPath
```

**Fix:** Colors setup may have been skipped - check if `--skip-colors` was used

### Issue 4: Dependencies Not Installed

**Symptom:** `node_modules/` or `vendor/` missing

**Check:**
```bash
ls -la node_modules/  # or vendor/
```

**Fix:** May have used `--skip-deps` - manually run `npm install` or `composer install`

### Issue 5: Wrong Port in Files

**Symptom:** Port in config files doesn't match Port Manager

**Check:**
```bash
port-manager show my-app
grep -r "port\|PORT" package.json composer.json
```

**Fix:** Port may not have been allocated before template generation

---

## Test Results Template

Use this template to record test results:

```
Test Date: ___________
Tester: ___________
Template: ___________
Project Name: ___________

Structure: [ ] Pass [ ] Fail
Content: [ ] Pass [ ] Fail
Integration: [ ] Pass [ ] Fail
Functionality: [ ] Pass [ ] Fail

Issues Found:
1. 
2. 
3. 

Notes:
```

---

## Success Criteria

A test is considered **PASSING** if:

1. ✅ Project directory is created with correct name
2. ✅ All expected files and directories exist
3. ✅ No template variables remain in files
4. ✅ Project Initialization ran successfully
5. ✅ Port Manager allocated a port
6. ✅ IDE colors are configured
7. ✅ Dependencies are installed (if not skipped)
8. ✅ Git is initialized (if not skipped)
9. ✅ Project builds without errors
10. ✅ Project runs successfully
11. ✅ Server starts on correct port
12. ✅ No console errors or warnings

---

## Regression Testing

After making changes to templates or code, re-run:

1. **Smoke Test:** Create Angular project, verify it works
2. **Template Test:** Create each template type, verify structure
3. **Options Test:** Test each command-line option
4. **Integration Test:** Verify Port Manager and Project Initialization integration

---

## Performance Benchmarks

Track these metrics:

- **Creation Time:** Should complete in < 60 seconds
- **File Count:** Angular ~15-20 files, Slim ~12-15 files
- **Directory Depth:** Should not exceed 4 levels
- **Template Processing:** Should process all files without errors

---

## Notes

- Always test in a clean directory
- Use different project names for each test
- Clean up test projects after verification
- Document any issues found for fixing
