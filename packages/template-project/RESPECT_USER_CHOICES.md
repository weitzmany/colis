# Respecting User Stack Choices

## Problem

Previously, when users selected both a frontend and backend (e.g., Angular + Slim), the system would:
1. Set `templateType = 'full-stack'`
2. Look for a single "full-stack" template
3. Find only the Next.js + Express template
4. Create Next.js + Express, **ignoring the user's choices**

**This was wrong.** If the user chooses Angular + Slim, they should get Angular + Slim, not Next.js.

## Solution

The system now:
1. Checks if a combined template exists (e.g., `angular-slim`)
2. If **no** combined template exists:
   - Uses **multiple templates** (Angular template + Slim template)
   - For Angular: Uses Angular CLI to create `frontend/` directory
   - For backend: Uses template to create `backend/` directory
   - Creates a root `README.md` explaining the structure

## Implementation Details

### Multi-Template Generation

When you select Angular + Slim:

```
my-project/
├── frontend/           # Created with Angular CLI (ng new)
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/            # Created from Slim template
│   ├── src/
│   ├── composer.json
│   └── ...
└── README.md           # Explains the structure
```

### Angular CLI Integration

For the frontend:
- Uses `ng new frontend` in the project directory
- Respects package manager choice (npm/yarn/pnpm)
- Respects `--skip-git` and `--skip-deps` flags

For the backend:
- Uses the Slim template from `templates/slim/`
- Applies variable substitution (project name, etc.)
- Configures on a different port (e.g., 8000 for backend if frontend is 4200)

### Port Allocation

When creating a multi-template project:
- **Frontend port**: Allocated first (e.g., 4200)
- **Backend port**: Frontend port + 1 (e.g., 4201)

Both ports are registered with Port Manager.

## Examples

### Angular + Slim

```bash
create-project
# Choose Angular for frontend
# Choose Slim for backend
```

**Result**:
- `frontend/` - Angular app created with `ng new`
- `backend/` - Slim API from template
- Root README explaining how to run both

### Angular Only

```bash
create-project
# Choose Angular for frontend
# Choose "none" for backend
```

**Result**:
- Angular app in project root (created with `ng new`)
- No backend directory

### Slim Only

```bash
create-project
# Choose "none" for frontend
# Choose Slim for backend
```

**Result**:
- Slim API in project root (from template)
- No frontend directory

## Benefits

✅ **Respects user choices** - Gets exactly what you selected  
✅ **Flexible combinations** - Mix any frontend + backend  
✅ **Angular CLI benefits** - Latest Angular features and structure  
✅ **Template benefits** - Customized backend configuration  
✅ **Clear structure** - Obvious separation of frontend and backend  
✅ **Easy development** - Each part has its own README  

## Future: Combined Templates

If you want a specific combination (e.g., Angular + Slim) to use a **single combined template**, create:

```
templates/angular-slim/
```

The system will automatically use it instead of generating separate directories.

## Technical Implementation

### Template Resolution Logic

```typescript
if (frontend !== 'none' && backend !== 'none') {
  // Try to find combined template
  const combined = `${frontend}-${backend}`;
  if (templateExists(combined)) {
    // Use single combined template
    useTemplate(combined);
  } else {
    // Use multiple templates
    useMultipleTemplates = true;
    frontendTemplate = getTemplate(frontend);
    backendTemplate = getTemplate(backend);
  }
}
```

### Angular CLI Execution

```typescript
if (useMultipleTemplates && frontendTemplate.type === 'angular') {
  // Create frontend/ subdirectory with Angular CLI
  execSync('npx @angular/cli@latest new frontend ...', {
    cwd: projectRoot,
  });
  
  // Generate backend from template
  generateFromTemplate(backendTemplate, 'backend/');
}
```

## See Also

- [ANGULAR_CLI_INTEGRATION.md](./ANGULAR_CLI_INTEGRATION.md) - Angular CLI details
- [USAGE.md](./USAGE.md) - Usage examples
- [README.md](./README.md) - Full documentation
