# Backend Composer Install - Quick Test Guide

## 🎯 Purpose

Verify that backend Composer dependencies are automatically installed during full-stack project creation.

## ⚡ Quick Test (5 minutes)

### 1. Create Test Project

```bash
cd /Users/yoavweitzman/Documents/Projects
create-project test-fullstack-backend
```

**When prompted**:
- Template: Choose "Angular + Slim" (full-stack)
- Accept defaults for other options

### 2. Verify Backend Dependencies Installed

```bash
cd test-fullstack-backend/backend

# Check if vendor directory exists
ls -la vendor/

# Should see:
# - autoload.php
# - composer/
# - slim/
# - psr/
# - Other dependencies
```

### 3. Test Backend Endpoint

```bash
# Start backend server
composer start

# In another terminal or browser, test endpoints:
curl http://localhost:<PORT>/health
curl http://localhost:<PORT>/api

# Should return JSON responses, NOT PHP errors
```

**Expected Results**:
- ✅ `vendor/` directory exists in `backend/`
- ✅ `/health` endpoint returns `{"status":"ok","message":"API is running"}`
- ✅ `/api` endpoint returns `{"message":"Welcome to the API"}`
- ❌ NO "vendor/autoload.php not found" errors

### 4. Cleanup

```bash
cd /Users/yoavweitzman/Documents/Projects
rm -rf test-fullstack-backend
```

## 🔍 Detailed Verification

### Check Composer Output During Creation

During `create-project`, you should see:

```
📦 Installing dependencies...
  Detected full-stack project structure
  Installing backend dependencies (PHP/Composer)...
  Loading composer repositories with package information
  Installing dependencies from lock file (if present)
  ...
  ✓ Backend dependencies installed
```

### Verify Backend Structure

```bash
cd test-fullstack-backend/backend

# Check critical files
ls -la composer.json     # Should exist
ls -la composer.lock     # Should exist (created by composer install)
ls -la vendor/           # Should exist (created by composer install)
ls -la vendor/autoload.php  # Should exist
```

### Test PHP Backend

```bash
cd backend

# Check PHP version
php --version

# Start backend
composer start

# Should start without errors
# Output: PHP 8.x Development Server (http://localhost:<PORT>) started
```

## ❌ What Would Fail Before Fix

Before the fix, you would see:

1. **No vendor directory**: `ls backend/vendor/` → "No such file or directory"
2. **PHP error on startup**: 
   ```
   Warning: require(.../vendor/autoload.php): Failed to open stream
   Fatal error: Failed opening required '.../vendor/autoload.php'
   ```
3. **Manual fix required**:
   ```bash
   cd backend
   composer install  # Had to run manually
   ```

## ✅ What Should Happen After Fix

After the fix:

1. **vendor directory exists**: `ls backend/vendor/` → Shows installed packages
2. **Backend works immediately**: No errors when running `composer start`
3. **No manual steps**: Everything works right after `create-project`

## 🐛 Troubleshooting

### Issue: "Composer not found"

**Symptom**: `⚠ Composer not found. Please install Composer`

**Solution**: Install Composer:
```bash
brew install composer   # macOS
# or visit https://getcomposer.org/
```

### Issue: "PHP not in PATH"

**Symptom**: `env: php: No such file or directory`

**Solution**: Add PHP to PATH:
```bash
# If using Homebrew PHP
export PATH="/usr/local/opt/php/bin:$PATH"
# or
brew link php
```

### Issue: Backend dependencies still not installed

**Symptom**: `vendor/` directory doesn't exist after project creation

**Checklist**:
- [ ] Did you skip dependencies? (`--skip-deps` flag)
- [ ] Is Composer installed? (`composer --version`)
- [ ] Is PHP in PATH? (`php --version`)
- [ ] Check console output for errors during creation

## 📊 Success Criteria

- ✅ Backend `vendor/` directory created automatically
- ✅ Backend endpoints return JSON (not PHP errors)
- ✅ No manual `composer install` required
- ✅ Console output shows "✓ Backend dependencies installed"
- ✅ Full-stack project works immediately after creation

---

**Test Duration**: ~5 minutes
**Requires**: PHP 8.1+, Composer, Angular CLI
**Status**: ✅ Ready to test
