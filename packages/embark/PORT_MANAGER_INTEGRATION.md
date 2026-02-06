# Port Manager Integration

## Problem

When using Angular CLI to create projects, the generated `package.json` has a hardcoded port:

```json
{
  "scripts": {
    "start": "ng serve"   // Uses default port 4200
  }
}
```

This doesn't respect the port allocated by Port Manager, which can cause conflicts.

## Solution

After Project Initialization completes (which runs Port Manager), we now:

1. **Read `.port-manager.json`** to get the allocated port
2. **Update Angular's `package.json`** to use that port
3. **Create backend `.env`** with the correct port (allocated port + 1)

## Implementation

### Workflow

```
1. Angular CLI creates project → package.json with "ng serve" (default 4200)
2. Project Initialization runs → Port Manager allocates port (e.g., 4200)
3. Port Configuration runs → Updates package.json with allocated port
```

### Code (create.ts ~line 718)

```typescript
// Read .port-manager.json to get allocated port
const portManagerConfig = await fs.readJson('.port-manager.json');
const allocatedPort = portManagerConfig.port;

// Update Angular package.json
const packageJson = await fs.readJson('frontend/package.json');
packageJson.scripts.start = `ng serve --port ${allocatedPort}`;
await fs.writeJson('frontend/package.json', packageJson);

// Create backend .env
const envContent = `PORT=${allocatedPort + 1}
FRONTEND_URL=http://localhost:${allocatedPort}
`;
await fs.writeFile('backend/.env', envContent);
```

## Result

### Frontend (Angular)

**Before**:
```json
{
  "scripts": {
    "start": "ng serve"  // Port 4200 (hardcoded)
  }
}
```

**After**:
```json
{
  "scripts": {
    "start": "ng serve --port 4200"  // Port from Port Manager
  }
}
```

### Backend (Slim/Express)

**`.env` file created**:
```env
# Backend Configuration
PORT=4201
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:4200
```

**Backend code** (already respects this):
```typescript
const PORT = process.env.PORT || 8000;
```

## Benefits

✅ **No Port Conflicts**: Each project uses its allocated port  
✅ **Consistent Ports**: Frontend and backend ports are coordinated (port, port+1)  
✅ **CORS Ready**: Backend knows frontend URL for CORS configuration  
✅ **Port Manager Integration**: Full integration with Port Manager  
✅ **Environment Variables**: Backend uses standard `.env` pattern  

## Example

```bash
# Create full-stack project
create-project
# Choose Angular + Slim

# Port Manager allocates: 4200

# Frontend (frontend/package.json):
"start": "ng serve --port 4200"

# Backend (backend/.env):
PORT=4201
FRONTEND_URL=http://localhost:4200
```

## Output

```
⚙️  Running Project Initialization...
🔌 Initializing Port Manager...
  ✓ Port Manager initialized successfully
  → Port allocation configured (4200)

✓ Project Initialization completed

🔧 Configuring ports...
  ✓ Frontend configured to use port 4200
  ✓ Backend configured to use port 4201
```

## Port Allocation Strategy

- **Frontend**: Uses allocated port from Port Manager
- **Backend**: Uses allocated port + 1
- **Rationale**: Simple, predictable, avoids conflicts

## See Also

- [Port Manager docs](../../core/src/features/port-manager/README.md)
- [Project Initialization docs](../../core/src/features/commissioning/README.md)
- [COMPLETE_FIX_SUMMARY.md](./COMPLETE_FIX_SUMMARY.md)
