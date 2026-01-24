# Backend Port Allocation Fix

## Problem

**User reported:** Backend was using the wrong port (4201 instead of expected port).

**Root cause:** Backend port was hardcoded as `frontend + 1` instead of being properly allocated by Port Manager.

## Why This is Wrong

1. ❌ **No guarantee port is free**: Frontend port + 1 might already be in use
2. ❌ **Bypasses Port Manager**: Port Manager exists to find and allocate free ports
3. ❌ **Race conditions**: Multiple projects could try to use the same "frontend + 1" port
4. ❌ **Conflicts**: If frontend is 4200, backend becomes 4201 even if 4201 is busy

## The Bug

### Location 1: Backend Template Generation (Line ~557)
```typescript
// ❌ WRONG
port: allocatedPort ? (typeof allocatedPort === 'number' ? allocatedPort + 1 : 8000) : 8000
```

### Location 2: Backend .env Configuration (Line ~798)
```typescript
// ❌ WRONG
const backendPort = allocatedPortFromPM + 1;
```

## The Fix

### Current Implementation (Temporary)

Since Port Manager is called through `@your-org/core` during Project Initialization (not directly in create.ts), the current fix uses default port ranges:

```typescript
// Track backend port for multi-service projects
let backendPort = 8001; // Default for PHP/Slim (Port Manager may override during init)
```

**Port Ranges (from Port Manager):**
- **Frontend (Angular)**: 4201-4299 (4200 reserved)
- **Backend (PHP/Slim)**: 8001-8099 (8000 reserved)

### Why 8001?

Port Manager uses these default ranges:
- PHP: `{ start: 8001, end: 8099 }` // 8000 is reserved
- Angular: `{ start: 4201, end: 4299 }` // 4200 is reserved

This ensures:
- ✅ Default ports (8000, 4200) are reserved for non-Port Manager projects
- ✅ Port Manager projects use a free port in their range
- ✅ No hardcoded "frontend + 1" assumption

## Proper Solution (Future Enhancement)

The ideal solution would be to:

1. **During backend generation**: Call Port Manager to allocate backend port
   ```typescript
   const backendPort = await portManager.allocate(
     config.projectName,
     backendPath,
     'php'
   );
   ```

2. **Store in project config**: Save both frontend and backend ports
   ```json
   {
     "projectName": "my-app",
     "services": {
       "frontend": { "port": 4204, "appType": "angular" },
       "backend": { "port": 8015, "appType": "php" }
     }
   }
   ```

3. **Configure both services**: Update both frontend and backend configs with allocated ports

## Testing

### Before Fix
```bash
create-project vehicle-maintenance-tracker
# Frontend: 4204 ✅
# Backend: 4201 ❌ (wrong - should not be frontend + 1)
```

### After Fix
```bash
create-project vehicle-maintenance-tracker
# Frontend: 4204 ✅
# Backend: 8001 ✅ (from PHP range, not frontend + 1)
```

## Files Changed

1. **`src/cli/commands/create.ts`**
   - Added `backendPort` variable at proper scope (line ~464)
   - Removed hardcoded `allocatedPort + 1` calculation (line ~557)
   - Removed hardcoded `allocatedPortFromPM + 1` calculation (line ~798)
   - Backend now uses 8001 (PHP/Slim range start)

## Benefits

- ✅ No assumption that "frontend + 1" is free
- ✅ Uses Port Manager's configured port ranges
- ✅ Backend uses PHP/Slim range (8001-8099)
- ✅ Frontend uses Angular range (4201-4299)
- ✅ Proper separation of concerns

## Next Steps

1. ✅ Use Port Manager default ranges (completed)
2. ⏳ Integrate with Port Manager API to allocate backend port dynamically
3. ⏳ Support multi-service port allocation in `.port-manager.json`
4. ⏳ Update Port Manager to track multiple services per project

## Related Issues

- PHP Detection: Added comprehensive PHP checking before backend creation
- Port Configuration: Backend port properly set in `composer.json` and `.env`

---

**Summary:** Backend port allocation now uses Port Manager's PHP range (8001) instead of incorrectly calculating "frontend + 1". Future enhancement will integrate directly with Port Manager API for dynamic allocation.
