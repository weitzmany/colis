# Domain Manager Fixes - Quick Reference

## What Was Fixed

### ✅ Issue 1: Domain URL Now Shows in Angular Dev Server
**Before**: `➜ Local: http://localhost:4221/`  
**After**: 
```
➜ Local: http://localhost:4221/
➜ Domain: http://tai-chi-lessons.local/
```

### ✅ Issue 2: No More SSL Protocol Errors
**Before**: `ERR_SSL_PROTOCOL_ERROR` at `http://tai-chi-lessons.local/`  
**After**: Domain works correctly with HTTP

## Quick Test

### 1. Test SSL Fix (Most Important)
```bash
# Remove and re-add your domain to get new HTTP-only format
npx @colis/rig domain-manager remove --domain tai-chi-lessons.local
npx @colis/rig domain-manager setup --project-name tai-chi-lessons --port 4221

# Restart Caddy
caddy reload --config ~/.caddy/Caddyfile

# Test in browser
open http://tai-chi-lessons.local/
# Should work without SSL error ✅
```

### 2. Verify Caddyfile Format
```bash
cat ~/.caddy/Caddyfile
# Should see: http://tai-chi-lessons.local {
# Not just: tai-chi-lessons.local {
```

### 3. Test Domain URL Display (Angular Projects)
```bash
cd your-angular-project
npx @colis/rig port-manager init --framework angular --port 4221
npm start
# Should see both Local and Domain URLs
```

## Manual Fix (If Needed)

### If SSL Error Persists
```bash
# 1. Edit Caddyfile manually
nano ~/.caddy/Caddyfile

# 2. Add http:// prefix to domain
# Change: tai-chi-lessons.local {
# To:     http://tai-chi-lessons.local {

# 3. Reload Caddy
caddy reload --config ~/.caddy/Caddyfile
```

## Files Changed

- `packages/rig/src/features/port-manager/frameworks/angular.ts`
  - Added domain URL display to package.json start script

- `packages/rig/src/features/domain-manager/caddy-manager.ts`
  - Changed Caddyfile format to `http://domain.local`
  - Updated parsing to handle both old and new formats

## Publishing

After testing, publish the fix:

```bash
cd packages/rig
npm run release:patch
```

This will:
- Bump version (e.g., 1.7.0 → 1.7.1)
- Create git tag
- Publish to npm

## Documentation

- ✅ `TEST_DOMAIN_FIXES.md` - Comprehensive testing guide
- ✅ `DOMAIN_FIXES_SUMMARY.md` - Detailed implementation summary
- ✅ `DOMAIN_FIXES_QUICK_REF.md` - This quick reference

## Need Help?

- **SSL error still happening**: Check Caddyfile format, restart Caddy
- **Domain URL not showing**: Check `.port-manager.json` exists with domain
- **Domain doesn't resolve**: Check `/etc/hosts` and Caddy is running

See `TEST_DOMAIN_FIXES.md` for detailed troubleshooting.
