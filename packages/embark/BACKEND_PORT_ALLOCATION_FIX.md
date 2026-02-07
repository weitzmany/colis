# Backend Port Allocation Fix - COMPLETE SOLUTION

## Problem

When creating full-stack projects (Angular frontend + PHP/Slim backend), the backend port was not being automatically allocated through Port Manager. Instead, a hardcoded default port (8001) was used, which could cause conflicts if multiple backends were created.

**User Impact**: After creating a full-stack project, users had to manually allocate backend ports using:
```bash
cd backend
port-manager allocate -p project-name-backend -t php
```

## Root Cause

The project initialization process only allocated a port for the **frontend** application. For full-stack projects, the backend port was:
1. Hardcoded to `8001` (line 465 in create.ts)
2. Never allocated through Port Manager
3. Required manual allocation after project creation

## Solution Implemented

### Automatic Backend Port Allocation

When creating a full-stack project, the system now:

1. **Allocates Frontend Port** (existing behavior)
   - During Project Initialization
   - Via Port Manager
   - Stored in root `.port-manager.json`

2. **Allocates Backend Port** (NEW behavior)
   - After frontend port allocation
   - Via Port Manager CLI: `npx @colis/rig port-manager allocate -p <project-name>-backend -t php`
   - Stored in `backend/.port-manager.json`
   - Updates `backend/composer.json` with allocated port
   - Creates `backend/.env` with allocated port

### Implementation Details

**Location**: `packages/template-project/src/cli/commands/create.ts`

**Changes**:

1. **Lines 783-858**: Added automatic backend port allocation
   ```typescript
   // Allocate a separate port for the backend through Port Manager
   console.log(chalk.blue('  Allocating backend port...'));
   
   // Determine backend app type
   const backendAppType = backendTemplate.type.toLowerCase().includes('slim') || 
                           backendTemplate.type.toLowerCase().includes('php') 
                           ? 'php' 
                           : backendTemplate.type;
   
   // Run Port Manager allocate command for backend
   const backendProjectName = `${config.projectName}-backend`;
   const backendPath = path.join(outputPath, 'backend');
   
   const allocateCmd = `npx @colis/rig port-manager allocate -p "${backendProjectName}" -t "${backendAppType}"`;
   execSync(allocateCmd, { cwd: backendPath, stdio: 'inherit' });
   
   // Read allocated port
   const backendPortConfig = await fs.readJson(path.join(backendPath, '.port-manager.json'));
   backendPort = backendPortConfig.port;
   ```

2. **Lines 841-850**: Update `composer.json` with allocated backend port
   ```typescript
   const composerJson = await fs.readJson(backendComposerPath);
   if (composerJson.scripts && composerJson.scripts.start) {
     composerJson.scripts.start = composerJson.scripts.start.replace(/localhost:\d+/, `localhost:${backendPort}`);
     await fs.writeJson(backendComposerPath, composerJson, { spaces: 2 });
   }
   ```

3. **Line 600**: Updated README generation to use actual backend port
   ```typescript
   - `backend/` - Slim PHP backend (port ${backendPort})
   ```

### Files Modified

- `packages/template-project/src/cli/commands/create.ts`
  - Lines 783-858: Added automatic backend port allocation
  - Line 600: Fixed README generation to use actual backend port

### Error Handling

If backend port allocation fails:
- Falls back to default port (8001)
- Warns user about manual allocation
- Provides command to manually allocate: `cd backend && port-manager allocate -p project-name-backend -t php`

## Testing

### Test Case 1: Create Full-Stack Project

```bash
npx create-project my-app
# Select: Full-stack (Angular + Slim)
```

**Expected Result**:
```
✅ Frontend port allocated: 4201
✅ Backend port allocated: 8002
✅ Backend composer.json configured with port 8002
✅ Backend .env configured with port 8002
```

### Test Case 2: Verify Port Manager Registrations

```bash
port-manager list
```

**Expected Result**:
```
Project Name          | App Type | Port | Status
----------------------|----------|------|----------
my-app                | angular  | 4201 | active
my-app-backend        | php      | 8002 | active
```

### Test Case 3: Start Both Services

```bash
# Frontend
cd frontend
npm start  # Uses port 4201

# Backend (separate terminal)
cd backend
composer start  # Uses port 8002
```

**Expected Result**: Both services start without port conflicts.

## Benefits

✅ **No Manual Port Allocation**: Backend ports are automatically allocated
✅ **No Port Conflicts**: Port Manager ensures unique ports
✅ **Proper Port Ranges**: Backend uses PHP range (8001-8099)
✅ **Automatic Configuration**: Both `composer.json` and `.env` are updated
✅ **Better User Experience**: Users can start coding immediately after project creation

## Before vs After

### Before (Manual Allocation Required)

```bash
# 1. Create project
npx create-project my-app
# ✓ Frontend port: 4201
# ✗ Backend port: 8001 (hardcoded, might conflict)

# 2. Manually allocate backend port
cd backend
port-manager allocate -p my-app-backend -t php
# ✓ Backend port: 8002 (properly allocated)

# 3. Manually update composer.json
# Edit composer.json start script to use port 8002

# 4. Start backend
composer start  # Finally works on port 8002
```

### After (Fully Automatic)

```bash
# 1. Create project
npx create-project my-app
# ✓ Frontend port: 4201 (automatic)
# ✓ Backend port: 8002 (automatic)
# ✓ composer.json updated (automatic)
# ✓ .env created (automatic)

# 2. Start backend immediately
cd backend
composer start  # Works on port 8002 immediately
```

## Related Documentation

- [Port Manager Integration](./PORT_MANAGER_INTEGRATION.md)
- [Port Allocation Fix](./PORT_ALLOCATION_FIX.md)
- [Complete Fix Summary](./COMPLETE_FIX_SUMMARY.md)

## Implementation Date

**Date**: 2026-01-20
**Version**: 1.0.0
**Status**: ✅ Complete and tested

---

**Summary**: Full-stack project creation now automatically allocates BOTH frontend and backend ports through Port Manager, eliminating manual port allocation steps and ensuring proper port management from project creation.
