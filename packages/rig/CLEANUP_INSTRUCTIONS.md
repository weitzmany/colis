# Port Manager Cleanup Instructions

## 🎯 What We Fixed

1. **Eliminated overlapping port ranges** (e.g., Node and Next.js both used 3001-3099)
2. **Organized by technology category** (Frontend, Backend, Mobile, Infrastructure)
3. **Gave each tech 100 dedicated ports** in non-overlapping ranges
4. **Created cleanup script** to reset the port registry

## 🚀 ONE-TIME CLEANUP (Do This Now!)

### Step 1: Clean the Port Registry

Run this command to delete all old port assignments:

```bash
cd packages/rig
npm run clean:port-registry
```

**Expected output:**
```
⚠️  Port Manager Registry Cleanup
This will delete ALL port assignments!

Found database: /Users/yoavweitzman/.port-manager/registry.db
✓ Deleted database file
✓ Deleted empty directory

✅ Port Manager registry cleaned successfully!

Next steps:
1. Rebuild all projects with new port ranges
2. Port Manager will create a fresh database with the new ranges
```

### Step 2: Rebuild Projects

After cleanup, all existing projects need to be recreated to get new port allocations.

For example, your `vehicle-maintenance-tracker`:
```bash
# Delete and recreate
cd ~/Documents/Projects
rm -rf vehicle-maintenance-tracker
create-project vehicle-maintenance-tracker
# Select: Angular frontend + Slim backend
```

## 📊 New Port Ranges

### Frontend (3xxx-4xxx)
| Tech | Range | Ports | Default Reserved |
|------|-------|-------|------------------|
| React | 3001-3099 | 100 | 3000 |
| Next.js | 3101-3199 | 100 | 3100 |
| Node | 3201-3299 | 100 | - |
| Angular | 4201-4299 | 100 | 4200 |

### Backend (5xxx)
| Tech | Range | Ports | Default Reserved |
|------|-------|-------|------------------|
| Vue | 5001-5099 | 100 | 5000 |
| Python | 5101-5199 | 100 | - |

### Mobile & Native (8xxx)
| Tech | Range | Ports | Default Reserved |
|------|-------|-------|------------------|
| PHP/Slim | 8001-8099 | 100 | 8000 |
| React Native | 8101-8199 | 100 | 8081, 8100 |
| Expo | 8201-8299 | 100 | - |
| Ionic | 8301-8399 | 100 | 8300 |
| Flutter | 8401-8499 | 100 | - |

### Infrastructure (9xxx)
| Tech | Range | Ports | Default Reserved |
|------|-------|-------|------------------|
| Docker | 9001-9099 | 100 | 9000 |

## ✅ Verification

After cleanup and rebuild, verify port assignments:

```bash
# List all port assignments
port-manager list

# Should show clean, non-overlapping ranges:
# - Angular apps: 4201-4299
# - PHP/Slim backends: 8001-8099
# - React Native: 8101-8199
# etc.
```

## 🎉 Benefits

✅ **No more port conflicts** between different technologies  
✅ **Clean separation** by category (Frontend, Backend, Mobile)  
✅ **Predictable port ranges** for each tech  
✅ **Room for growth** (100 ports per tech)  
✅ **Reserved defaults** won't be assigned

## 📝 Example: Full-Stack Project

**Before (Problematic):**
```
Frontend (Angular): 4204
Backend (PHP):      8001  ❌ Overlaps with React Native range!
```

**After (Clean):**
```
Frontend (Angular): 4201  (from dedicated 4201-4299 range)
Backend (PHP):      8001  (from dedicated 8001-8099 range)
```

If you later add React Native, it gets 8101 (separate range) ✅

## 🔍 Files Changed

- `packages/rig/src/features/port-manager/core/allocator.ts` - Updated ranges
- `packages/rig/scripts/clean-port-registry.ts` - New cleanup script
- `packages/rig/package.json` - Added cleanup command

---

**Ready?** Run the cleanup now:

```bash
cd packages/rig && npm run clean:port-registry
```
