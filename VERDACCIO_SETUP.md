# Verdaccio Private Registry Setup Guide

## Overview

This guide will help you publish and manage `@colis/*` packages on your private Verdaccio registry hosted on AWS.

## Package Names

- **@colis/logbook** - Standardized git workflow assets and lifecycle management
- **@colis/rig** - Foundational development toolkit (port management, tech detection, project initialization)
- **@colis/embark** - Project template scaffolding tool

Future packages:
- **@colis/keel** - (planned)
- **@colis/hull** - (planned)

## Prerequisites

- Verdaccio server running on AWS
- AWS security groups configured to allow npm registry access
- Domain/IP address for your Verdaccio instance

## Package Publishing Order

Due to dependencies, publish in this order:

1. **@colis/logbook** (no dependencies on other @colis packages)
2. **@colis/rig** (depends on @colis/logbook)
3. **@colis/embark** (depends on @colis/rig)

## Setup Steps

### 1. Configure npm to use Verdaccio Registry

Create or update `.npmrc` in your home directory:

```bash
# Set registry for @colis scope
@colis:registry=http://your-verdaccio-server:4873/

# Optional: Set always-auth if Verdaccio requires authentication
# @colis:always-auth=true
```

Or set it via command:

```bash
npm config set @colis:registry http://your-verdaccio-server:4873/
```

### 2. Login to Verdaccio (if authentication is enabled)

```bash
npm login --registry=http://your-verdaccio-server:4873/ --scope=@colis
```

Enter your Verdaccio credentials when prompted.

### 3. Pre-Publish Checklist

For each package, ensure:

- [ ] `package.json` has correct version
- [ ] All tests pass (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] `dist/` directory contains compiled files
- [ ] `files` field in `package.json` includes all necessary assets
- [ ] Dependencies are correct (no `file:` references)

### 4. Update Package Dependencies

Before publishing, verify the dependency references use registry versions:

#### @colis/rig package.json

```json
{
  "dependencies": {
    "@colis/logbook": "^1.0.0"
  }
}
```

#### @colis/embark package.json

```json
{
  "dependencies": {
    "@colis/rig": "^1.0.0"
  }
}
```

### 5. Publishing Commands

#### Publish logbook (first)

```bash
cd ~/Documents/packages/packages/git-workflow
npm run clean
npm run build
npm test
npm publish --registry=http://your-verdaccio-server:4873/
```

#### Publish rig (second)

```bash
cd ~/Documents/packages/packages/core
npm run clean
npm run build
npm test
npm publish --registry=http://your-verdaccio-server:4873/
```

#### Publish embark (third)

```bash
cd ~/Documents/packages/packages/template-project
npm run clean
npm run build
npm test
npm publish --registry=http://your-verdaccio-server:4873/
```

### 6. Verify Published Packages

```bash
# Check if packages are available
npm view @colis/logbook --registry=http://your-verdaccio-server:4873/
npm view @colis/rig --registry=http://your-verdaccio-server:4873/
npm view @colis/embark --registry=http://your-verdaccio-server:4873/
```

### 7. Update Existing Projects

For each project (e.g., chore-allowance-manager):

```bash
cd ~/Documents/Projects/chore-allowance-manager

# Remove npm link if it exists
npm unlink @colis/rig

# Install from registry
npm install @colis/rig

# Verify installation
npm ls @colis/rig
```

### 8. Update embark Command

After publishing, you can use `embark` directly:

```bash
# Global installation from Verdaccio
npm install -g @colis/embark --registry=http://your-verdaccio-server:4873/

# Or use npx (will fetch from registry)
npx @colis/embark create my-new-app
```

## Development Workflow

### Local Development (before publishing)

Continue using `npm link` for local development:

```bash
# In package directory
cd ~/Documents/packages/packages/core
npm link

# In project directory
cd ~/Documents/Projects/my-project
npm link @colis/rig
```

### Publishing Updates

When ready to publish changes:

1. Update version in `package.json`:
   ```bash
   npm version patch  # or minor, major
   ```

2. Build and test:
   ```bash
   npm run clean
   npm run build
   npm test
   ```

3. Publish:
   ```bash
   npm publish --registry=http://your-verdaccio-server:4873/
   ```

4. Update consuming projects:
   ```bash
   cd ~/Documents/Projects/my-project
   npm update @colis/rig
   ```

## Automation Scripts

### Publish All Packages Script

Create `publish-all.sh` in workspace root:

```bash
#!/bin/bash

set -e

REGISTRY="http://your-verdaccio-server:4873/"

echo "Publishing @colis packages to $REGISTRY"
echo ""

# Publish logbook
echo "📦 Publishing @colis/logbook..."
cd packages/git-workflow
npm run clean && npm run build && npm test
npm publish --registry=$REGISTRY
cd ../..

# Publish rig
echo "📦 Publishing @colis/rig..."
cd packages/core
npm run clean && npm run build && npm test
npm publish --registry=$REGISTRY
cd ../..

# Publish embark
echo "📦 Publishing @colis/embark..."
cd packages/template-project
npm run clean && npm run build && npm test
npm publish --registry=$REGISTRY
cd ../..

echo ""
echo "✅ All packages published successfully!"
```

Make it executable:
```bash
chmod +x publish-all.sh
```

Run it:
```bash
./publish-all.sh
```

## Common Issues and Solutions

### Issue: `file:` dependencies not resolved

**Solution**: Update `package.json` to use version numbers instead of `file:` paths before publishing.

### Issue: Authentication fails

**Solution**: Run `npm login --registry=http://your-verdaccio-server:4873/ --scope=@colis`

### Issue: Package not found after publishing

**Solution**: 
1. Check Verdaccio logs for errors
2. Verify registry URL is correct
3. Check firewall/security group settings

### Issue: Version already exists

**Solution**: Bump version with `npm version patch/minor/major` before republishing

## Verdaccio Configuration (Server-Side)

Ensure your Verdaccio `config.yaml` includes:

```yaml
packages:
  '@colis/*':
    access: $authenticated
    publish: $authenticated
    proxy: npmjs
```

## CI/CD Integration

For automated publishing:

```yaml
# .github/workflows/publish.yml
name: Publish Packages

on:
  push:
    branches:
      - main
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'http://your-verdaccio-server:4873/'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build packages
        run: |
          cd packages/git-workflow && npm run build && cd ../..
          cd packages/core && npm run build && cd ../..
          cd packages/template-project && npm run build && cd ../..
      
      - name: Publish packages
        run: ./publish-all.sh
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Next Steps

1. **Configure npm registry** for @colis scope
2. **Publish packages** in order (logbook → rig → embark)
3. **Test installation** in a new project
4. **Update existing projects** to use registry versions
5. **Create publish automation** script for future updates

## Resources

- [Verdaccio Documentation](https://verdaccio.org/)
- [npm Publishing Guide](https://docs.npmjs.com/cli/v8/commands/npm-publish)
- [Scoped Packages](https://docs.npmjs.com/cli/v8/using-npm/scope)
