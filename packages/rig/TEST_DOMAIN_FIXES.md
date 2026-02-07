# Testing Domain Manager Fixes

## Issues Fixed

### Issue 1: Angular Dev Server Doesn't Display Domain URL
**Before**: Only showed `➜ Local: http://localhost:4221/`
**After**: Should show both Local and Domain URLs

### Issue 2: SSL Protocol Error at Domain URL
**Before**: Browser tried HTTPS causing `ERR_SSL_PROTOCOL_ERROR`
**After**: Caddy explicitly configured for HTTP only

## Testing Steps

### Test 1: Verify Caddyfile HTTP Configuration

1. **Check existing Caddyfile**:
   ```bash
   cat ~/.caddy/Caddyfile
   ```

2. **Look for domain entries**:
   - OLD FORMAT: `tai-chi-lessons.local {`
   - NEW FORMAT: `http://tai-chi-lessons.local {`

3. **If you have existing domains configured, regenerate them**:
   ```bash
   # Remove existing domain
   npx @colis/rig domain-manager remove --domain tai-chi-lessons.local
   
   # Re-add domain (this will use new HTTP format)
   npx @colis/rig domain-manager setup --project-name tai-chi-lessons --port 4221
   ```

### Test 2: Verify Domain Works with HTTP

1. **Restart Caddy** (to load new configuration):
   ```bash
   # Stop Caddy
   pkill caddy
   
   # Start Caddy with the Caddyfile
   caddy run --config ~/.caddy/Caddyfile
   ```
   Or if running as a service:
   ```bash
   caddy reload --config ~/.caddy/Caddyfile
   ```

2. **Access domain with HTTP**:
   - Open browser
   - Navigate to: `http://tai-chi-lessons.local/`
   - Should load WITHOUT SSL error

3. **Verify HTTPS doesn't work** (expected):
   - Try: `https://tai-chi-lessons.local/`
   - Should fail or show warning (this is expected for .local domains)

### Test 3: Verify Angular Dev Server Shows Domain URL

**Note**: This fix requires updating an existing Angular project's configuration.

1. **For a new project** (Domain Manager will be integrated):
   ```bash
   # This will be tested when Domain Manager is integrated with embark
   npx @colis/embark create my-test-app --type angular
   ```

2. **For an existing Angular project**:
   ```bash
   cd /path/to/your/angular/project
   
   # Run port manager init (this should update package.json)
   npx @colis/rig port-manager init --framework angular --port 4221
   
   # Check package.json
   cat package.json | grep "start"
   # Should see something like:
   # "start": "ng serve --port 4221 & echo \"\" && echo \"  ➜ Domain: http://tai-chi-lessons.local/\" && wait"
   ```

3. **Run the dev server**:
   ```bash
   npm start
   ```

4. **Verify output shows**:
   ```
   ➜ Local: http://localhost:4221/
   ➜ Domain: http://tai-chi-lessons.local/
   ```

## Expected Results

### ✅ Success Criteria

1. **Caddyfile Format**:
   - Domain entries use `http://domain.local` format
   - No automatic HTTPS attempted

2. **Browser Access**:
   - `http://domain.local/` works without SSL errors
   - Page loads correctly
   - No certificate warnings

3. **Angular Dev Server**:
   - Shows both Local and Domain URLs
   - Domain URL is clickable and works

### ❌ Failure Indicators

1. **SSL Error Still Occurs**:
   - Check Caddyfile format (must have `http://` prefix)
   - Restart Caddy after configuration change

2. **Domain URL Not Displayed**:
   - Check package.json `start` script
   - Verify `.port-manager.json` exists with domain configured
   - Re-run port manager init if needed

3. **Domain Doesn't Resolve**:
   - Check `/etc/hosts` has entry: `127.0.0.1 domain.local`
   - Check Caddy is running: `pgrep caddy`

## Manual Caddyfile Update (If Needed)

If you have existing domains configured in the old format, you can manually update the Caddyfile:

```bash
# Edit Caddyfile
nano ~/.caddy/Caddyfile

# Change from:
tai-chi-lessons.local {
    reverse_proxy localhost:4221
}

# To:
http://tai-chi-lessons.local {
    reverse_proxy localhost:4221
}

# Save and reload Caddy
caddy reload --config ~/.caddy/Caddyfile
```

## Next Steps

Once these fixes are verified:

1. **Update embark package** to integrate Domain Manager with project creation
2. **Add domain URL display** to Angular project templates
3. **Document** HTTP-only configuration for .local domains
4. **Test** with multiple projects and domain configurations

## Troubleshooting

### Problem: Domain still shows SSL error
**Solution**: 
1. Check Caddyfile has `http://` prefix
2. Restart Caddy completely (not just reload)
3. Clear browser cache
4. Try different browser

### Problem: Domain URL not in dev server output
**Solution**:
1. Verify `.port-manager.json` exists and has `domain` field
2. Check `package.json` `start` script
3. Re-run `npx @colis/rig port-manager init` to update configuration

### Problem: Domain doesn't resolve at all
**Solution**:
1. Check `/etc/hosts`: `cat /etc/hosts | grep local`
2. Verify Caddy is running: `pgrep caddy`
3. Check Caddyfile syntax: `caddy validate --config ~/.caddy/Caddyfile`
