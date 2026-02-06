# Quick Test: Slim CLI Integration

## Prerequisites

- ✅ Composer installed (`composer --version`)
- ✅ PHP 8.1+ installed
- ✅ Node.js installed (for the template-project package)

## Quick Test Commands

### 1. Basic Slim Project Creation

```bash
# Navigate to a test directory
cd /tmp

# Create a Slim project
npx @your-org/template-project create test-slim-app --template slim

# Expected output:
# 🎼 Using Composer to create Slim Framework project...
#   Running: composer create-project slim/slim-skeleton test-slim-app --no-interaction
# ✓ Slim Framework project created with Composer
# 📦 Installing dependencies...
#   Detected PHP project (composer.json found)
#   Running: composer install
# ✓ Composer dependencies installed
# ✅ Project created successfully!
```

### 2. Verify Project Structure

```bash
cd test-slim-app
ls -la

# Expected files:
# - composer.json
# - composer.lock
# - vendor/          (dependencies installed)
# - public/
# - src/
# - .cursor/         (from Project Init)
# - .githooks/       (from Project Init)
# - .port-manager.json
```

### 3. Start the Project

```bash
# Using composer script
composer start

# Or manually
php -S localhost:8080 -t public

# Open browser: http://localhost:8080
# Should see Slim app running
```

### 4. Test with Skip Dependencies

```bash
cd /tmp
npx @your-org/template-project create test-slim-skip --template slim --skip-deps

# Expected: composer create-project runs with --no-install
# No automatic composer install
# vendor/ directory should NOT exist

cd test-slim-skip
ls -la  # No vendor/ directory

# Install manually
composer install

# Now vendor/ exists
ls -la vendor/
```

### 5. Test Dry Run

```bash
cd /tmp
npx @your-org/template-project create test-slim-dry --template slim --dry-run

# Expected output:
# 🔍 Dry run - Would use Slim Framework CLI
#   composer create-project slim/slim-skeleton test-slim-dry
```

## Verification Checklist

After creating a Slim project, verify:

- [ ] `composer.json` exists
- [ ] `composer.lock` exists
- [ ] `vendor/` directory exists (unless --skip-deps)
- [ ] `public/index.php` exists
- [ ] `src/` directory exists
- [ ] `.cursor/` directory exists (from Project Init)
- [ ] `.port-manager.json` exists
- [ ] `composer start` works
- [ ] PHP development server starts successfully
- [ ] App loads in browser

## Error Scenarios

### Composer Not Installed

```bash
# Uninstall composer temporarily (for testing)
# Then try to create project

npx @your-org/template-project create test-slim --template slim

# Expected error:
# ❌ Failed to create project with Composer:
# Composer is not installed or not available in PATH. 
# Please install Composer: https://getcomposer.org/
```

### No composer.json (Non-PHP Project)

```bash
# Create Angular project
npx @your-org/template-project create test-ng --template angular

# Expected: npm install runs (not composer install)
# Should detect package.json and use npm
```

## Success Criteria

✅ **Slim project created successfully**
✅ **Dependencies installed automatically**
✅ **Project runs without manual steps**
✅ **No errors during creation**
✅ **All verification checks pass**

## Troubleshooting

### Problem: Composer not found
**Solution:** Install Composer from https://getcomposer.org/

### Problem: PHP version too old
**Solution:** Upgrade to PHP 8.1 or higher

### Problem: Permission denied
**Solution:** Check directory permissions or run with appropriate user

### Problem: Dependencies not installed
**Solution:** Run `composer install` manually or check that `--skip-deps` wasn't used

## Cleanup

```bash
# Remove test projects
rm -rf /tmp/test-slim-app
rm -rf /tmp/test-slim-skip
```

## Integration Test (Full Workflow)

```bash
# 1. Create project
cd /tmp
npx @your-org/template-project create my-api --template slim

# 2. Navigate to project
cd my-api

# 3. Verify structure
ls -la

# 4. Check dependencies
composer show

# 5. Start server
composer start &

# 6. Test API
curl http://localhost:8080

# 7. Stop server
pkill -f "php -S"

# 8. Cleanup
cd /tmp
rm -rf my-api
```

**If all steps complete successfully, Slim CLI integration is working! ✅**
