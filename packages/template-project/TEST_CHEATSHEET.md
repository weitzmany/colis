# Test Cheat Sheet - Quick Reference

## 🚀 Create Project

```bash
npx @your-org/template-project create my-awesome-app
```

## ✅ 5-Minute Verification

### 1. Structure (30 sec)
```bash
cd my-awesome-app
ls -la                    # Check main files exist
tree -L 2                 # Visual structure (if available)
```

### 2. No Template Variables (30 sec)
```bash
grep -r "{{" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=vendor
# Should return: NOTHING
```

### 3. Project Init (1 min)
```bash
ls .cursor/rules/experts/ | wc -l    # ~26 files
port-manager list | grep my-awesome-app
```

### 4. IDE Colors (30 sec)
```bash
ls .vscode/settings.json .githooks/post-checkout
git config core.hooksPath            # Should show: .githooks
```

### 5. Build & Run (2 min)
```bash
npm run build && npm start           # Angular
# OR
composer install && composer start   # Slim
```

## 📋 File Checklist

### Angular Template
- [ ] `package.json` - name = `my-awesome-app`
- [ ] `angular.json` - project configured
- [ ] `src/app/app.component.ts` - title = `'my-awesome-app'`
- [ ] `README.md` - project name appears correctly

### Slim Template  
- [ ] `composer.json` - name = `my-awesome-app/my-awesome-app`
- [ ] `public/index.php` - Slim setup correct
- [ ] `src/routes/routes.php` - project name in responses
- [ ] `README.md` - project name appears correctly

## 🔍 Key Commands

```bash
# Check Port Manager
port-manager list
port-manager show my-awesome-app

# Check Project Init
ls .cursor/rules/experts/*.mdc | wc -l
ls .cursor/commands/general/

# Verify no local commands copied
ls .cursor/commands/local/ 2>/dev/null && echo "ERROR" || echo "OK"

# Check IDE colors
cat .vscode/settings.json | grep color
cat .githooks/post-checkout | head -10

# Test build
npm run build    # Angular
composer install # Slim

# Test run
npm start        # Angular → http://localhost:4200
composer start   # Slim → http://localhost:8000
```

## ❌ Red Flags

- `{{projectName}}` in files = **FAIL**
- No `.cursor/` directory = **FAIL**
- Port Manager doesn't show project = **FAIL**
- Build fails = **FAIL**
- Server won't start = **FAIL**

## ✅ Success = All Checks Pass
