# Quick Test Checklist

Use this checklist for rapid manual testing after creating a project.

## Before You Start

```bash
# Setup (one time)
cd ~/test-projects  # or any test directory
```

## Test Command

```bash
npx @your-org/template-project create my-awesome-app
```

## 5-Minute Quick Check

### ✅ Step 1: Basic Structure (30 seconds)

```bash
cd my-awesome-app
ls -la
```

**Check:**
- [ ] Directory `my-awesome-app` exists
- [ ] Main config file exists (`package.json` for Angular, `composer.json` for Slim)
- [ ] `src/` directory exists
- [ ] `README.md` exists
- [ ] `.gitignore` exists

### ✅ Step 2: No Template Variables (30 seconds)

```bash
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=vendor 2>/dev/null | head -5
```

**Check:**
- [ ] No results (or only expected results like comments)
- [ ] `package.json` / `composer.json` has correct project name
- [ ] `README.md` has correct project name

### ✅ Step 3: Project Initialization (1 minute)

```bash
ls -la .cursor/rules/experts/ | wc -l    # Should show ~26
ls -la .cursor/rules/user/ | wc -l       # Should show ~3
ls -la .cursor/commands/general/         # Should show files
port-manager list | grep my-awesome-app  # Should show project
```

**Check:**
- [ ] `.cursor/` directory exists
- [ ] Expert rules copied (~26 files)
- [ ] User rules copied (~3 files)
- [ ] General commands copied
- [ ] Port Manager shows your project
- [ ] Port is allocated (4200 for Angular, 8000 for Slim)

### ✅ Step 4: IDE Colors (30 seconds)

```bash
cat .vscode/settings.json | grep -i color | head -3
ls -la .githooks/post-checkout
git config core.hooksPath
```

**Check:**
- [ ] `.vscode/settings.json` exists and has color settings
- [ ] `.githooks/post-checkout` exists and is executable
- [ ] Git hooks path is set to `.githooks`

### ✅ Step 5: Dependencies (1 minute)

**For Angular/Node projects:**
```bash
ls -la node_modules/ | head -5
npm list --depth=0 2>/dev/null | head -10
```

**For Slim/PHP projects:**
```bash
ls -la vendor/ | head -5
composer show 2>/dev/null | head -10
```

**Check:**
- [ ] Dependencies directory exists (`node_modules/` or `vendor/`)
- [ ] Key packages are installed
- [ ] No installation errors

### ✅ Step 6: Build & Run (2 minutes)

**For Angular:**
```bash
npm run build
npm start
# Open http://localhost:4200
```

**For Slim:**
```bash
composer install  # if skipped
composer start
# Test: curl http://localhost:8000/health
```

**Check:**
- [ ] Build completes without errors
- [ ] Server starts successfully
- [ ] Server runs on correct port
- [ ] Application loads/responds correctly
- [ ] No console errors

---

## Detailed File Checks

### Angular Template Specific

```bash
cd my-awesome-app

# Check key files
cat package.json | grep -E '"name"|"version"|"description"'
cat angular.json | grep -E '"root"|"sourceRoot"'
cat src/app/app.component.ts | grep "title"
cat README.md | head -10
```

**Expected:**
- `package.json` name: `my-awesome-app`
- `angular.json` root: `""` (empty, meaning current dir)
- `app.component.ts` title: `'my-awesome-app'`
- `README.md` shows project name, not `{{projectName}}`

### Slim Template Specific

```bash
cd my-awesome-app

# Check key files
cat composer.json | grep -E '"name"|"description"|"require"'
cat public/index.php | grep "require\|AppFactory"
cat src/routes/routes.php | grep "test-awesome-app\|my-awesome-app"
cat README.md | head -10
```

**Expected:**
- `composer.json` name: `my-awesome-app/my-awesome-app`
- `index.php` has proper Slim setup
- Routes file has correct project name
- `README.md` shows project name, not `{{projectName}}`

---

## Port Verification

```bash
cd my-awesome-app

# Check Port Manager
port-manager list
port-manager show my-awesome-app

# Check if port appears in config files
grep -r "4200\|8000\|port\|PORT" package.json composer.json angular.json 2>/dev/null
```

**Expected:**
- Port Manager shows project with allocated port
- Port appears in start scripts (if template includes it)
- Port matches framework default (4200 for Angular, 8000 for Slim)

---

## Git Verification

```bash
cd my-awesome-app

git status
git log --oneline  # May or may not have commits
cat .gitignore | head -10
```

**Expected:**
- `.git/` directory exists
- `.gitignore` exists with appropriate entries
- Git repository is initialized

---

## Color Verification

```bash
cd my-awesome-app

# Check hook
cat .githooks/post-checkout | head -20

# Check settings
cat .vscode/settings.json

# Verify gitignore
grep "settings.json" .gitignore
```

**Expected:**
- Hook file contains color update script
- Settings file contains color configuration
- Settings file is in `.gitignore`

---

## Common Commands for Testing

### Create Test Project
```bash
npx @your-org/template-project create test-app
```

### Check Structure
```bash
cd test-app
tree -L 2  # or: find . -type f -name "*.json" -o -name "*.ts" -o -name "*.php" | head -20
```

### Verify No Template Variables
```bash
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=vendor
```

### Check Port Manager
```bash
port-manager list
port-manager show test-app
```

### Verify Project Initialization
```bash
ls -la .cursor/rules/experts/ | wc -l
ls -la .cursor/commands/general/
```

### Test Build
```bash
npm run build  # Angular
# or
composer install && composer start  # Slim
```

### Test Run
```bash
npm start  # Angular - opens http://localhost:4200
# or
composer start  # Slim - runs on http://localhost:8000
```

---

## Red Flags (Things That Should NOT Happen)

❌ **Template variables in files** - Files contain `{{projectName}}` instead of actual name  
❌ **Missing directories** - Expected folders like `src/`, `.cursor/` don't exist  
❌ **Port not allocated** - Port Manager doesn't show the project  
❌ **No IDE colors** - `.vscode/settings.json` or `.githooks/post-checkout` missing  
❌ **Build fails** - `npm run build` or `composer install` has errors  
❌ **Server won't start** - `npm start` or `composer start` fails  
❌ **Wrong port** - Server runs on different port than allocated  
❌ **Missing dependencies** - `node_modules/` or `vendor/` empty when should have packages  

---

## Success = All Green Checks ✅

If all checks pass, the template creation worked correctly!

---

## Testing Angular CLI Integration

### Test Command with Angular CLI

```bash
npx @your-org/template-project create my-ng-cli-app --use-ng-cli
```

### ✅ Step 1: Angular CLI Structure (30 seconds)

```bash
cd my-ng-cli-app
ls -la
```

**Check:**
- [ ] Directory `my-ng-cli-app` exists
- [ ] `package.json` exists (Angular CLI generated)
- [ ] `angular.json` exists (Angular CLI config)
- [ ] `src/` directory exists
- [ ] `src/app/` directory exists
- [ ] Standard Angular files present (main.ts, app.component.ts, etc.)

### ✅ Step 2: Angular CLI Generated Files (1 minute)

```bash
cat package.json | grep -E '"name"|"@angular/core"'
cat angular.json | grep projectType
ls -la src/app/
```

**Check:**
- [ ] `package.json` name: `my-ng-cli-app`
- [ ] `@angular/core` is in dependencies
- [ ] `angular.json` has `projectType: "application"`
- [ ] Standard Angular app components exist

### ✅ Step 3: Project Initialization Still Works (1 minute)

```bash
ls -la .cursor/rules/experts/ | wc -l
ls -la .cursor/commands/general/
port-manager list | grep my-ng-cli-app
```

**Check:**
- [ ] `.cursor/` directory exists
- [ ] Expert rules copied (~26 files)
- [ ] General commands copied
- [ ] Port Manager shows your project
- [ ] Port is allocated (default 4200 for Angular)

### ✅ Step 4: Build & Run Angular CLI Project (2 minutes)

```bash
npm install  # If --skip-deps was used
npm start
# Open http://localhost:4200
```

**Check:**
- [ ] Dependencies install successfully
- [ ] Server starts on port 4200
- [ ] Angular app loads in browser
- [ ] No console errors

### Dry Run Test

```bash
npx @your-org/template-project create test-dry --use-ng-cli --dry-run
```

**Check:**
- [ ] Shows command that would be run
- [ ] Shows Angular CLI command with correct flags
- [ ] Does not actually create project

### Test with Different Package Managers

**PNPM:**
```bash
npx @your-org/template-project create my-pnpm-app --use-ng-cli --package-manager pnpm
cd my-pnpm-app
pnpm install
pnpm start
```

**Check:**
- [ ] Project created with pnpm
- [ ] `pnpm-lock.yaml` exists
- [ ] Dependencies install with pnpm
- [ ] App runs correctly

**Yarn:**
```bash
npx @your-org/template-project create my-yarn-app --use-ng-cli --package-manager yarn
cd my-yarn-app
yarn install
yarn start
```

**Check:**
- [ ] Project created with yarn
- [ ] `yarn.lock` exists
- [ ] Dependencies install with yarn
- [ ] App runs correctly

### Test with Skip Options

```bash
# Skip deps
npx @your-org/template-project create test-skip-deps --use-ng-cli --skip-deps

# Skip git
npx @your-org/template-project create test-skip-git --use-ng-cli --skip-git

# Skip init
npx @your-org/template-project create test-skip-init --use-ng-cli --skip-init
```

**Check:**
- [ ] `--skip-deps`: No `node_modules/`, but project created
- [ ] `--skip-git`: No `.git/` directory
- [ ] `--skip-init`: No `.cursor/` directory, no Port Manager entry

---

## Angular CLI vs Template Comparison

### Create Both

```bash
# Template-based
npx @your-org/template-project create my-template-app --template angular

# Angular CLI-based
npx @your-org/template-project create my-cli-app --use-ng-cli
```

### Compare Structure

```bash
# Check differences
diff -r my-template-app my-cli-app --exclude=node_modules --exclude=.git --brief | head -20
```

**Expected Differences:**
- Angular CLI app may have different file structure
- Angular CLI app has latest Angular CLI defaults
- Template app has customizations
- Both should have Project Initialization files (`.cursor/`, Port Manager)

---

## Red Flags for Angular CLI Integration

❌ **Angular CLI fails** - `npx @angular/cli@latest new` command errors  
❌ **Wrong directory structure** - Not standard Angular CLI structure  
❌ **Project Initialization skipped** - `.cursor/` missing when not using `--skip-init`  
❌ **Port not allocated** - Port Manager doesn't show the project  
❌ **Build fails** - `npm run build` has errors  
❌ **Server won't start** - `npm start` fails  

---

## Angular CLI Integration Success Criteria

✅ Angular CLI generates standard Angular project structure  
✅ Project Initialization still runs and adds Cursor rules  
✅ Port Manager allocates a port  
✅ Package manager choice is respected  
✅ Skip options work correctly  
✅ Dry run shows correct command  
✅ Project builds and runs successfully
