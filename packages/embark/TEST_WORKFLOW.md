# Manual Test Workflow - Visual Guide

## Complete Test Workflow After Running Create Command

```
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Run Create Command                                 │
│  npx @your-org/template-project create my-awesome-app     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Verify Directory Structure                        │
│  cd my-awesome-app                                         │
│  ls -la                                                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Check for Template Variables                      │
│  grep -r "{{" . --exclude-dir=node_modules                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Verify Project Initialization                     │
│  ls .cursor/rules/experts/                                 │
│  port-manager list                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Check IDE Colors                                  │
│  cat .vscode/settings.json                                 │
│  ls .githooks/post-checkout                                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 6: Verify Dependencies                               │
│  ls node_modules/  (or vendor/)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 7: Test Build & Run                                  │
│  npm run build && npm start                                │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Verification Steps

### 1. Directory Structure Verification

**Command:**
```bash
cd my-awesome-app
find . -type f -name "*.json" -o -name "*.ts" -o -name "*.php" | sort
```

**For Angular, expect:**
```
./angular.json
./package.json
./tsconfig.json
./tsconfig.app.json
./karma.conf.js
./src/main.ts
./src/app/app.component.ts
./src/app/app.routes.ts
./README.md
```

**For Slim, expect:**
```
./composer.json
./phpunit.xml
./phpstan.neon
./public/index.php
./src/routes/routes.php
./src/controllers/HomeController.php
./README.md
```

### 2. Configuration Files Content Check

**Angular - Check `package.json`:**
```bash
cat package.json | jq '.name, .version, .scripts.start'
```

**Expected:**
- `name`: `"my-awesome-app"` (kebab-case)
- `version`: `"1.0.0"`
- `scripts.start`: Contains port `4200` or allocated port

**Slim - Check `composer.json`:**
```bash
cat composer.json | jq '.name, .require."slim/slim"'
```

**Expected:**
- `name`: `"my-awesome-app/my-awesome-app"`
- `slim/slim`: `"^4.12.0"`

### 3. Port Manager Verification

**Check Port Allocation:**
```bash
port-manager list
port-manager show my-awesome-app
```

**Expected Output:**
```
Project: my-awesome-app
App Type: angular (or php for Slim)
Port: 4200 (or 8000 for Slim)
Status: active
```

**Verify Port in Config Files:**
```bash
# Angular
grep -E "4200|port" package.json angular.json

# Slim
grep -E "8000|PORT" composer.json
```

### 4. Project Initialization Files Check

**Check Rules:**
```bash
ls .cursor/rules/experts/*.mdc | wc -l      # Should be ~26
ls .cursor/rules/user/*.mdc | wc -l         # Should be ~3
```

**Check Commands:**
```bash
ls .cursor/commands/general/*.md            # Should show general commands
ls .cursor/commands/local/ 2>/dev/null      # Should NOT exist (or be empty)
```

**Verify No Local Commands:**
```bash
# This should return nothing or error
ls .cursor/commands/local/review.md 2>/dev/null && echo "ERROR: Local command copied!" || echo "OK: Local commands not copied"
```

### 5. IDE Colors Verification

**Check Settings File:**
```bash
cat .vscode/settings.json
```

**Expected Content:**
- `workbench.colorCustomizations` section
- Color values (not `{{projectName}}`)
- Branch-specific color logic

**Check Git Hook:**
```bash
cat .githooks/post-checkout | head -30
```

**Expected:**
- Shell script that updates colors
- References to project name
- Color variable definitions

**Verify Git Config:**
```bash
git config core.hooksPath
```

**Expected:** `.githooks`

**Verify Settings Ignored:**
```bash
grep "settings.json" .gitignore
```

**Expected:** `.vscode/settings.json` in gitignore

### 6. Template Variable Check (Critical)

**Comprehensive Check:**
```bash
# Find all remaining template variables
grep -r "{{" . \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=vendor \
  --exclude-dir=dist \
  --exclude="*.log" \
  2>/dev/null
```

**Should Return:** Nothing (or only comments/documentation)

**Specific Files to Check Manually:**
```bash
# Check key files
grep "{{" package.json composer.json README.md src/**/*.ts src/**/*.php 2>/dev/null
```

**Expected:** No matches

### 7. Dependency Verification

**Angular:**
```bash
npm list --depth=0
```

**Expected Packages:**
- `@angular/core@^17.0.0`
- `@angular/common@^17.0.0`
- `typescript@^5.3.3`
- `rxjs@^7.8.0`

**Slim:**
```bash
composer show
```

**Expected Packages:**
- `slim/slim@^4.12.0`
- `php-di/php-di@^6.1.0`
- `monolog/monolog@^3.5.0`

### 8. Build Verification

**Angular:**
```bash
npm run build
ls -la dist/
```

**Expected:**
- Build completes without errors
- `dist/` directory created
- Compiled files present

**Slim:**
```bash
composer install
composer analyse  # PHPStan
```

**Expected:**
- No dependency errors
- PHPStan runs (may show warnings, but should run)

### 9. Runtime Verification

**Angular:**
```bash
npm start
# In another terminal:
curl http://localhost:4200
```

**Expected:**
- Server starts on port 4200 (or allocated port)
- HTML response contains "Welcome to my-awesome-app"
- No errors in console

**Slim:**
```bash
composer start
# In another terminal:
curl http://localhost:8000/health
curl http://localhost:8000/api
```

**Expected:**
- Server starts on port 8000 (or allocated port)
- `/health` returns JSON: `{"status":"ok",...}`
- `/api` returns JSON: `{"message":"Welcome to my-awesome-app API",...}`

### 10. Git Verification

**Check Git Status:**
```bash
git status
git log --oneline  # May be empty if no initial commit
```

**Expected:**
- Git repository initialized
- Files are tracked (or ready to be tracked)
- `.gitignore` is present

**Check Gitignore:**
```bash
cat .gitignore
```

**Expected Entries:**
- `node_modules/` (for Angular)
- `vendor/` (for Slim)
- `.vscode/settings.json`
- Build outputs
- Log files

---

## Quick Verification Script

Save this as `test-project.sh`:

```bash
#!/bin/bash

PROJECT_NAME="${1:-test-project}"
TEMPLATE="${2:-angular}"

echo "🧪 Testing project: $PROJECT_NAME (template: $TEMPLATE)"
echo ""

# Create project
echo "📦 Creating project..."
npx @your-org/template-project create "$PROJECT_NAME" --template "$TEMPLATE" --skip-deps

cd "$PROJECT_NAME" || exit 1

echo ""
echo "✅ Structure Check:"
ls -la | head -10

echo ""
echo "✅ Template Variables Check:"
TEMPLATE_VARS=$(grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=vendor 2>/dev/null | wc -l)
if [ "$TEMPLATE_VARS" -eq 0 ]; then
  echo "  ✓ No template variables found"
else
  echo "  ✗ Found $TEMPLATE_VARS template variables!"
fi

echo ""
echo "✅ Project Initialization Check:"
if [ -d ".cursor/rules/experts" ]; then
  EXPERT_COUNT=$(ls .cursor/rules/experts/*.mdc 2>/dev/null | wc -l)
  echo "  ✓ Expert rules: $EXPERT_COUNT files"
else
  echo "  ✗ .cursor/rules/experts/ missing!"
fi

echo ""
echo "✅ Port Manager Check:"
if command -v port-manager &> /dev/null; then
  port-manager list | grep "$PROJECT_NAME" && echo "  ✓ Project found in Port Manager" || echo "  ✗ Project NOT in Port Manager"
else
  echo "  ⚠ Port Manager not available"
fi

echo ""
echo "✅ IDE Colors Check:"
if [ -f ".vscode/settings.json" ]; then
  echo "  ✓ VS Code settings exist"
else
  echo "  ✗ VS Code settings missing"
fi

if [ -f ".githooks/post-checkout" ]; then
  echo "  ✓ Git hook exists"
else
  echo "  ✗ Git hook missing"
fi

echo ""
echo "✅ Configuration Files Check:"
if [ "$TEMPLATE" = "angular" ]; then
  [ -f "package.json" ] && echo "  ✓ package.json exists" || echo "  ✗ package.json missing"
  [ -f "angular.json" ] && echo "  ✓ angular.json exists" || echo "  ✗ angular.json missing"
elif [ "$TEMPLATE" = "slim" ]; then
  [ -f "composer.json" ] && echo "  ✓ composer.json exists" || echo "  ✗ composer.json missing"
  [ -f "public/index.php" ] && echo "  ✓ index.php exists" || echo "  ✗ index.php missing"
fi

echo ""
echo "✅ Git Check:"
if [ -d ".git" ]; then
  echo "  ✓ Git initialized"
else
  echo "  ✗ Git NOT initialized"
fi

echo ""
echo "Test complete! Check output above for any ✗ marks."
```

**Usage:**
```bash
chmod +x test-project.sh
./test-project.sh my-test-app angular
```

---

## Critical Checks (Must All Pass)

These are the **most important** checks - if any fail, the template creation failed:

1. ✅ **No Template Variables** - No `{{projectName}}` in any files
2. ✅ **Port Allocated** - Port Manager shows the project
3. ✅ **Project Init Ran** - `.cursor/` directory exists with rules
4. ✅ **Structure Complete** - All expected files and directories exist
5. ✅ **Project Runs** - `npm start` or `composer start` works

---

## Test Results Log

Use this format to log your test results:

```
Date: ___________
Template: ___________
Project Name: ___________

[ ] Structure: PASS / FAIL
[ ] Template Variables: PASS / FAIL  
[ ] Port Manager: PASS / FAIL
[ ] Project Init: PASS / FAIL
[ ] IDE Colors: PASS / FAIL
[ ] Dependencies: PASS / FAIL
[ ] Build: PASS / FAIL
[ ] Run: PASS / FAIL

Issues:
- 

Notes:
- 
```
