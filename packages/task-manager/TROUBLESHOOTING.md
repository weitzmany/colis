# Task Manager - Troubleshooting Guide

Common issues and solutions when using `@your-org/task-manager`.

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Initialization Issues](#initialization-issues)
3. [Task Operations](#task-operations)
4. [Dependency Issues](#dependency-issues)
5. [File System Issues](#file-system-issues)
6. [Performance Issues](#performance-issues)
7. [Type Errors](#type-errors)

## Installation Issues

### Issue: Package Not Found

**Error**: `npm ERR! 404 '@your-org/task-manager' not found`

**Solution**:
```bash
# Ensure you're using the correct package name
npm install @your-org/task-manager

# If using a private registry, configure npm
npm config set @your-org:registry https://your-registry.com
```

### Issue: Postinstall Script Fails

**Error**: `Error: Failed to initialize taskmaster-ai`

**Solution**:
```bash
# Initialize manually
npx taskmaster-ai init

# Or disable auto-init
const manager = new TaskManager('/path/to/project', {
  autoInit: false
});
```

## Initialization Issues

### Issue: .taskmaster Directory Not Found

**Error**: `Error: .taskmaster directory not found`

**Solution**:
```typescript
// Ensure you're using the correct project root
const manager = new TaskManager('/correct/path/to/project');

// Or initialize explicitly
await manager.initializeTaskmaster();
```

### Issue: Invalid Taskmaster Structure

**Error**: `Error: Invalid taskmaster structure`

**Solution**:
```typescript
// Validate structure
const taskmasterDir = path.join(projectRoot, '.taskmaster');
if (!fs.existsSync(path.join(taskmasterDir, 'config.json'))) {
  // Reinitialize
  await manager.initializeTaskmaster();
}
```

## Task Operations

### Issue: Task Not Found

**Error**: `Error: Task with ID "123" not found`

**Solution**:
```typescript
// Check available task IDs
const tasks = await manager.getTasks('my-project');
const taskIds = tasks.map(t => t.id);
console.log('Available IDs:', taskIds);

// Verify project name
const projectNames = await manager.getProjectNames();
console.log('Available projects:', projectNames);
```

### Issue: Task Creation Fails

**Error**: `ValidationError: Invalid task data`

**Solution**:
```typescript
// Ensure required fields are provided
const task = await manager.createTask('my-project', {
  title: 'Task title',        // Required
  description: 'Description',  // Required
  priority: 'medium',         // Required
  status: 'pending'          // Required
});

// Check validation errors
try {
  await manager.createTask('my-project', taskData);
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(`Field "${error.field}": ${error.message}`);
  }
}
```

### Issue: Task Update Doesn't Work

**Error**: Task not updating as expected

**Solution**:
```typescript
// Check if task exists
const task = await manager.getTask('my-project', taskId);
if (!task) {
  throw new Error('Task not found');
}

// Verify update data
await manager.updateTask('my-project', taskId, {
  status: 'in-progress' // Use valid status
});

// Check if append mode is needed
await manager.updateTask('my-project', taskId, {
  details: 'Additional notes'
}, {
  append: true // Append instead of replace
});
```

## Dependency Issues

### Issue: Circular Dependency Detected

**Error**: `ValidationError: Circular dependency detected`

**Solution**:
```typescript
// Check for cycles
const validation = await manager.validateDependencies('my-project');
if (!validation.valid) {
  console.error('Dependency errors:', validation.errors);
  
  // Remove circular dependencies
  // Example: If Task A depends on B, and B depends on A
  await manager.removeDependency('my-project', taskAId, taskBId);
}
```

### Issue: Dependency Not Found

**Error**: `ValidationError: Dependency "123" does not exist`

**Solution**:
```typescript
// Verify dependency exists
const allTasks = await manager.getTasks('my-project');
const taskIds = new Set(allTasks.map(t => t.id));

if (!taskIds.has(dependsOnId)) {
  // Create dependency task first, or use existing task ID
  const dependsOnTask = await manager.createTask('my-project', {
    title: 'Dependency task',
    description: '',
    priority: 'medium',
    status: 'pending'
  });
  
  await manager.addDependency('my-project', taskId, dependsOnTask.id);
}
```

### Issue: Task Depends on Itself

**Error**: `ValidationError: Task cannot depend on itself`

**Solution**:
```typescript
// Check before adding dependency
if (taskId !== dependsOnId) {
  await manager.addDependency('my-project', taskId, dependsOnId);
} else {
  console.error('Task cannot depend on itself');
}
```

## File System Issues

### Issue: Permission Denied

**Error**: `Error: EACCES: permission denied`

**Solution**:
```bash
# Check file permissions
ls -la .taskmaster/tasks/tasks.json

# Fix permissions
chmod 644 .taskmaster/tasks/tasks.json
chmod 755 .taskmaster/tasks
```

### Issue: File Locked

**Error**: `Error: EBUSY: resource busy or locked`

**Solution**:
```typescript
// Ensure only one instance is writing
// Use file locking or queue operations
const writeQueue: Array<() => Promise<void>> = [];

async function queueWrite(operation: () => Promise<void>) {
  writeQueue.push(operation);
  if (writeQueue.length === 1) {
    while (writeQueue.length > 0) {
      await writeQueue[0]();
      writeQueue.shift();
    }
  }
}
```

### Issue: Backup Creation Fails

**Error**: `Warning: Failed to create backup`

**Solution**:
```typescript
// Check backup directory permissions
const backupDir = path.join(projectRoot, '.taskmaster', 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Manually backup before operations
fs.copyFileSync(
  '.taskmaster/tasks/tasks.json',
  `.taskmaster/backups/tasks-${Date.now()}.json`
);
```

## Performance Issues

### Issue: Slow Task Loading

**Problem**: Loading many tasks is slow

**Solution**:
```typescript
// Use filtering to reduce data
const tasks = await manager.getTasks('my-project', {
  status: 'in-progress' // Only load in-progress tasks
});

// Load tasks in batches
const batchSize = 100;
for (let i = 0; i < allTasks.length; i += batchSize) {
  const batch = allTasks.slice(i, i + batchSize);
  // Process batch
}
```

### Issue: Memory Usage High

**Problem**: High memory usage with many tasks

**Solution**:
```typescript
// Process tasks one at a time instead of loading all
const projectNames = await manager.getProjectNames();
for (const projectName of projectNames) {
  const tasks = await manager.getTasks(projectName);
  // Process and release
}
```

## Type Errors

### Issue: TypeScript Type Errors

**Error**: `Type 'string' is not assignable to type 'TaskStatus'`

**Solution**:
```typescript
// Use proper types
import { TaskStatus, TaskPriority } from '@your-org/task-manager';

const status: TaskStatus = 'in-progress'; // ✅ Valid
const status: TaskStatus = 'invalid';      // ❌ Invalid

// Check valid values
const validStatuses: TaskStatus[] = [
  'pending', 'in-progress', 'done', 'deferred', 'cancelled',
  'blocked', 'review', 'backlog', 'to do', 'testing', 'next release', 'archive'
];
```

### Issue: Optional Fields Required

**Error**: `Property 'assignee' is required`

**Solution**:
```typescript
// Use Partial<> for updates
await manager.updateTask('my-project', taskId, {
  status: 'done' // Only update status, other fields optional
});

// Use CreateTaskOptions for optional fields
await manager.createTask('my-project', {
  title: 'Task',
  description: '',
  priority: 'medium',
  status: 'pending'
}, {
  assignee: 'john.doe', // Optional
  labels: ['bug']       // Optional
});
```

## Common Patterns

### Pattern 1: Safe Task Operations

```typescript
async function safeUpdateTask(
  projectName: string,
  taskId: number | string,
  updates: Partial<Task>
) {
  try {
    const task = await manager.getTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }
    return await manager.updateTask(projectName, taskId, updates);
  } catch (error) {
    console.error('Update failed:', error);
    throw error;
  }
}
```

### Pattern 2: Retry Logic

```typescript
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}
```

### Pattern 3: Batch Error Handling

```typescript
const result = await manager.batchUpdate('my-project', taskIds, updates);

if (result.failed.length > 0) {
  console.error('Failed tasks:', result.failed);
  
  // Retry failed tasks individually
  for (const failure of result.failed) {
    try {
      await manager.updateTask('my-project', failure.taskId, updates);
    } catch (error) {
      console.error(`Task ${failure.taskId} still failed:`, error);
    }
  }
}
```

## Getting Help

If you're still experiencing issues:

1. Check [User Guide](./USER_GUIDE.md) for usage examples
2. Review [API Reference](./README.md#api-reference)
3. Check [GitHub Issues](https://github.com/your-org/packages/issues)
4. Review error messages carefully - they often include helpful context

## Reporting Issues

When reporting issues, include:

1. **Error Message**: Full error message and stack trace
2. **Code Example**: Minimal code that reproduces the issue
3. **Environment**: Node.js version, package version, OS
4. **Expected Behavior**: What you expected to happen
5. **Actual Behavior**: What actually happened
