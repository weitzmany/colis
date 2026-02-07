# Port Ranges Update

## Overview

Reorganized port ranges to be non-overlapping and clearly separated by technology.

## Changes

### Before (Overlapping Ranges)
```
node:         3001-3099
nextjs:       3001-3099  ❌ OVERLAPS with node
docker:       3001-3999  ❌ OVERLAPS with everything
react:        4001-4099
angular:      4201-4299
python:       5001-5099
flutter:      5000-5099  ❌ OVERLAPS with python
php:          8001-8099
react-native: 8081-8199  ❌ OVERLAPS with php
expo:         8081-8199  ❌ OVERLAPS with php
ionic:        8100-8199  ❌ OVERLAPS with php
```

### After (Clean Separation)
```
Frontend Frameworks (3xxx-4xxx):
  React:     3001-3099  (100 ports, default 3000 reserved)
  Next.js:   3101-3199  (100 ports, default 3100 reserved)
  Node:      3201-3299  (100 ports)
  Angular:   4201-4299  (100 ports, default 4200 reserved)

Backend Frameworks (5xxx):
  Vue:       5001-5099  (100 ports, default 5000 reserved)
  Python:    5101-5199  (100 ports, Django/Flask)

Mobile & Native (8xxx):
  PHP:       8001-8099  (100 ports, default 8000 reserved)
  Slim:      8001-8099  (same range as PHP)
  React Native: 8101-8199  (100 ports, defaults 8081/8100 reserved)
  Expo:      8201-8299  (100 ports)
  Ionic:     8301-8399  (100 ports, default 8300 reserved)
  Flutter:   8401-8499  (100 ports)

Infrastructure (9xxx):
  Docker:    9001-9099  (100 ports, default 9000 reserved)
```

## Reserved Default Ports

These ports are **never assigned** by Port Manager:
- 3000 (React/Node.js)
- 3100 (Next.js)
- 4200 (Angular)
- 5000 (Vue/Python)
- 8000 (PHP)
- 8081 (React Native Metro)
- 8100 (React Native alternative)
- 8300 (Ionic)
- 9000 (Docker)

## Benefits

✅ **No Overlaps**: Each tech has its own dedicated range  
✅ **Consistent Size**: 100 ports per technology  
✅ **Organized by Category**: Frontend, Backend, Mobile, Infrastructure  
✅ **Room for Growth**: Easy to add new techs  
✅ **Clear Defaults**: Reserved ports documented

## Cleanup Process

### ONE-TIME CLEANUP (Required)

Run this to delete the old port registry:

```bash
cd packages/rig
npm run clean:port-registry
```

This will:
- Delete `~/.port-manager/registry.db`
- Remove all old port assignments
- Prepare for new port ranges

### After Cleanup

All projects will need to be rebuilt or re-initialized to get new port allocations.

Port Manager will automatically use the new ranges when allocating ports.

## Examples

### Before
```
my-angular-app (angular):  4204
my-react-app (react):      4001
my-backend (php):          8001
my-mobile (react-native):  8081  ❌ Overlaps PHP range!
```

### After
```
my-angular-app (angular):  4201  (from 4201-4299 range)
my-react-app (react):      3001  (from 3001-3099 range)
my-backend (php):          8001  (from 8001-8099 range)
my-mobile (react-native):  8101  (from 8101-8199 range) ✅ No overlap!
```

## Files Changed

- `packages/rig/src/features/port-manager/core/allocator.ts` - Updated port ranges
- `packages/rig/package.json` - Added cleanup script
- `packages/rig/scripts/clean-port-registry.ts` - New cleanup utility

## Testing

After cleanup and rebuild:

1. Create new Angular project → Should get port from 4201-4299
2. Create new React project → Should get port from 3001-3099
3. Create new PHP backend → Should get port from 8001-8099
4. Create React Native app → Should get port from 8101-8199

All ports should be in their correct, non-overlapping ranges!
