# Task Manager - Installation and Usage Workflow

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A project directory where you want to manage tasks

## Step 1: Install the Package

### In a New Project

```bash
# Navigate to your project directory
cd /path/to/your/project

# Install the task-manager package
npm install @your-org/task-manager
```

### What Happens During Installation

1. **Package Installation**: The package and its dependencies are installed:
   - `@your-org/task-manager`
   - `@your-org/core` (dependency)
   - `taskmaster-ai` (dependency)

2. **Postinstall Script**: The `postinstall` script automatically runs:
   - Checks if `.taskmaster/` directory exists
   - If not exists: Initializes taskmaster-ai using `npx taskmaster-ai init`
   - Creates the `.taskmaster/` directory structure

### Expected Output

```
npm install @your-org/task-manager

> @your-org/task-manager@1.0.0 postinstall
> node lib/init-taskmaster.js

✓ taskmaster-ai initialized successfully

added 15 packages in 5s
```

### Directory Structure Created

After installation, your project will have:

```
your-project/
├── .taskmaster/
│   ├── config.json          # Taskmaster configuration
│   ├── state.json           # Current state (currentTag, etc.)
│   ├── tasks/
│   │   └── tasks.json       # Main tasks file (empty initially)
│   └── docs/
│       └── prd.txt          # PRD template (optional)
├── node_modules/
│   └── @your-org/
│       └── task-manager/
└── package.json
```

## Step 2: Manual Initialization (If Needed)

If the postinstall script didn't run or you want to initialize manually:

```bash
# Option 1: Use the CLI command
npx task-manager-init

# Option 2: Use taskmaster-ai directly
npx taskmaster-ai init
```

## Step 3: Basic Usage in Your Code

### Import the Package

```typescript
import { TaskManager } from '@your-org/task-manager';
```

### Initialize TaskManager

```typescript
// Initialize with auto-initialization (default)
const manager = new TaskManager('/path/to/your/project', {
  autoInit: true  // This is the default
});

// Or initialize without auto-init
const manager = new TaskManager('/path/to/your/project', {
  autoInit: false
});
```

### Create Your First Task

```typescript
// Create a task
const task = await manager.createTask('my-project', {
  title: 'Set up authentication',
  description: 'Implement user authentication with JWT',
  priority: 'high',
  status: 'pending'
});

console.log('Created task:', task.id);
// Output: Created task: task-1704847200000-abc123xyz
```

### What Gets Created in tasks.json

After creating a task, `.taskmaster/tasks/tasks.json` will contain:

```json
{
  "my-project": {
    "tasks": [
      {
        "id": "task-1704847200000-abc123xyz",
        "title": "Set up authentication",
        "description": "Implement user authentication with JWT",
        "priority": "high",
        "status": "pending",
        "updatedAt": "2026-01-10T01:42:00.000Z",
        "createdAt": "2026-01-10T01:42:00.000Z",
        "type": "feature",
        "color": "#5865F2"
      }
    ]
  }
}
```

## Step 4: Manual Testing Workflow

### Test 1: Create Multiple Tasks

```typescript
// Create several tasks
const task1 = await manager.createTask('my-project', {
  title: 'Task 1: Setup',
  description: 'Initial setup',
  priority: 'high',
  status: 'pending'
});

const task2 = await manager.createTask('my-project', {
  title: 'Task 2: Implementation',
  description: 'Core implementation',
  priority: 'medium',
  status: 'pending'
});

const task3 = await manager.createTask('my-project', {
  title: 'Task 3: Testing',
  description: 'Write tests',
  priority: 'low',
  status: 'pending'
});

console.log('Created tasks:', [task1.id, task2.id, task3.id]);
```

**Expected Result**: 
- All 3 tasks appear in `tasks.json`
- Each task has unique ID
- Tasks have default values (type: 'feature', color: '#5865F2')

### Test 2: Read Tasks

```typescript
// Get all tasks
const allTasks = await manager.getTasks('my-project');
console.log('Total tasks:', allTasks.length);
// Expected: Total tasks: 3

// Get a specific task
const task = await manager.getTask('my-project', task1.id);
console.log('Task title:', task?.title);
// Expected: Task title: Task 1: Setup

// Get next available task (no dependencies)
const nextTask = await manager.getNextTask('my-project');
console.log('Next task:', nextTask?.title);
// Expected: Next task: Task 1: Setup (or any task with no dependencies)
```

**Expected Result**: 
- `getTasks()` returns array of all tasks
- `getTask()` returns specific task or null
- `getNextTask()` returns a task with all dependencies completed

### Test 3: Filter Tasks

```typescript
// Filter by status
const pendingTasks = await manager.getTasks('my-project', {
  status: 'pending'
});
console.log('Pending tasks:', pendingTasks.length);
// Expected: Pending tasks: 3

// Filter by priority
const highPriorityTasks = await manager.getTasks('my-project', {
  priority: 'high'
});
console.log('High priority tasks:', highPriorityTasks.length);
// Expected: High priority tasks: 1

// Filter by multiple criteria
const filteredTasks = await manager.getTasks('my-project', {
  status: 'pending',
  priority: ['high', 'medium']
});
console.log('Filtered tasks:', filteredTasks.length);
// Expected: Filtered tasks: 2
```

**Expected Result**: 
- Filters work correctly
- Multiple filter criteria combine with AND logic
- Array filters work (e.g., multiple priorities)

### Test 4: Update Task

```typescript
// Update task status
await manager.updateTask('my-project', task1.id, {
  status: 'in-progress'
});

// Verify update
const updatedTask = await manager.getTask('my-project', task1.id);
console.log('Updated status:', updatedTask?.status);
// Expected: Updated status: in-progress

// Append to details
await manager.updateTask('my-project', task1.id, {
  details: 'Started working on this'
}, { append: true });

const taskWithDetails = await manager.getTask('my-project', task1.id);
console.log('Details:', taskWithDetails?.details);
// Expected: Details: Started working on this
```

**Expected Result**: 
- Task status updates correctly
- `updatedAt` timestamp changes
- Append mode adds to details instead of replacing

### Test 5: Assignee Management

```typescript
// Assign task
await manager.assignTask('my-project', task1.id, 'john.doe');

// Verify assignment
const assignedTask = await manager.getTask('my-project', task1.id);
console.log('Assignee:', assignedTask?.assignee);
// Expected: Assignee: john.doe

// List all assignees
const assignees = await manager.listAssignees('my-project');
console.log('Assignees:', assignees.map(a => ({ name: a.assignee, count: a.taskCount })));
// Expected: Assignees: [{ name: 'john.doe', count: 1 }]

// Get tasks for assignee
const johnsTasks = await manager.getTasks('my-project', {
  assignee: 'john.doe'
});
console.log('John\'s tasks:', johnsTasks.length);
// Expected: John's tasks: 1

// Unassign
await manager.unassignTask('my-project', task1.id);
const unassignedTask = await manager.getTask('my-project', task1.id);
console.log('After unassign:', unassignedTask?.assignee);
// Expected: After unassign: undefined
```

**Expected Result**: 
- Tasks can be assigned and unassigned
- `listAssignees()` shows assignees with task counts
- Filtering by assignee works

### Test 6: Label Management

```typescript
// Add single label
await manager.addLabel('my-project', task1.id, 'bug');

// Add multiple labels
await manager.addLabels('my-project', task2.id, ['feature', 'frontend', 'urgent']);

// List all labels
const labels = await manager.listLabels('my-project');
console.log('Labels:', labels.map(l => ({ label: l.label, count: l.taskCount })));
// Expected: Labels: [
//   { label: 'bug', count: 1 },
//   { label: 'feature', count: 1 },
//   { label: 'frontend', count: 1 },
//   { label: 'urgent', count: 1 }
// ]

// Filter by labels
const bugTasks = await manager.getTasks('my-project', {
  labels: ['bug']
});
console.log('Bug tasks:', bugTasks.length);
// Expected: Bug tasks: 1

// Remove label
await manager.removeLabel('my-project', task2.id, 'urgent');
const taskAfterRemove = await manager.getTask('my-project', task2.id);
console.log('Labels after remove:', taskAfterRemove?.labels);
// Expected: Labels after remove: ['feature', 'frontend']
```

**Expected Result**: 
- Labels can be added and removed
- Multiple labels per task supported
- `listLabels()` shows labels with task counts
- Filtering by labels works

### Test 7: Tag Management

```typescript
// Add single tag (taskmaster-ai style)
await manager.addTag('my-project', task1.id, 'feature-auth');

// Add multiple tags with colors (discord-story-bot style)
await manager.addTags('my-project', task2.id, ['sprint-1', 'backend']);

// List all tags
const tags = await manager.listTags('my-project');
console.log('Tags:', tags.map(t => ({ 
  tag: t.tag, 
  count: t.taskCount, 
  color: t.color 
})));
// Expected: Tags: [
//   { tag: 'feature-auth', count: 1, color: '#a1b2c3' },
//   { tag: 'sprint-1', count: 1, color: '#d4e5f6' },
//   { tag: 'backend', count: 1, color: '#g7h8i9' }
// ]

// Filter by tag
const taggedTasks = await manager.getTasks('my-project', {
  tag: 'feature-auth'
});
console.log('Tagged tasks:', taggedTasks.length);
// Expected: Tagged tasks: 1

// Migrate tags (convert string tags to objects with colors)
await manager.migrateTags('my-project');
```

**Expected Result**: 
- Tags can be added (single or multiple)
- Tags get auto-generated colors (DJB2 hash)
- `listTags()` shows tags with colors and counts
- Filtering by tags works
- Migration converts string tags to objects

### Test 8: Dependencies

```typescript
// Add dependency (task2 depends on task1)
await manager.addDependency('my-project', task2.id, task1.id);

// Verify dependency
const task2WithDep = await manager.getTask('my-project', task2.id);
console.log('Task 2 dependencies:', task2WithDep?.dependencies);
// Expected: Task 2 dependencies: [task1.id]

// Get next task (should return task1, not task2)
const nextTask = await manager.getNextTask('my-project');
console.log('Next task (should be task1):', nextTask?.id === task1.id);
// Expected: Next task (should be task1): true

// Try to create circular dependency (should fail)
try {
  await manager.addDependency('my-project', task1.id, task2.id);
  console.log('ERROR: Should have thrown');
} catch (error) {
  console.log('Correctly prevented circular dependency:', error.message);
  // Expected: Correctly prevented circular dependency: ...
}

// Validate all dependencies
const validation = await manager.validateDependencies('my-project');
console.log('Dependencies valid:', validation.valid);
// Expected: Dependencies valid: true
```

**Expected Result**: 
- Dependencies can be added
- Circular dependencies are prevented
- `getNextTask()` respects dependencies
- Validation detects dependency issues

### Test 9: Batch Operations

```typescript
// Batch update multiple tasks
const result = await manager.batchUpdate('my-project', [task1.id, task2.id], {
  status: 'in-progress',
  priority: 'high',
  tags: { add: ['sprint-1'] }
});

console.log('Batch update result:', {
  success: result.success,
  failed: result.failed,
  errors: result.errors
});
// Expected: Batch update result: { success: 2, failed: 0, errors: [] }

// Verify updates
const updatedTask1 = await manager.getTask('my-project', task1.id);
const updatedTask2 = await manager.getTask('my-project', task2.id);
console.log('Task1 status:', updatedTask1?.status);
console.log('Task2 status:', updatedTask2?.status);
// Expected: Both tasks have status: 'in-progress'

// Batch delete
const deleteResult = await manager.batchDelete('my-project', [task3.id]);
console.log('Batch delete:', deleteResult.success, 'tasks deleted');
// Expected: Batch delete: 1 tasks deleted

// Verify deletion
const remainingTasks = await manager.getTasks('my-project');
console.log('Remaining tasks:', remainingTasks.length);
// Expected: Remaining tasks: 2
```

**Expected Result**: 
- Batch updates apply to multiple tasks
- Batch delete removes multiple tasks
- Partial failures are reported
- Results show success/failure counts

### Test 10: Subtasks

```typescript
// Add subtask
const subtask = await manager.addSubtask('my-project', task1.id, {
  title: 'Subtask: Create login form',
  description: 'Build the login UI component',
  status: 'pending'
});

console.log('Created subtask:', subtask.id);
// Expected: Created subtask: subtask-1704847300000-xyz789

// Verify subtask
const taskWithSubtask = await manager.getTask('my-project', task1.id);
console.log('Subtasks count:', taskWithSubtask?.subtasks?.length);
// Expected: Subtasks count: 1

// Batch mark subtasks as done
await manager.batchUpdate('my-project', [task1.id], {
  markSubtasksDone: true
});

const taskAfterMarkDone = await manager.getTask('my-project', task1.id);
console.log('Subtask completed:', taskAfterMarkDone?.subtasks?.[0]?.completed);
// Expected: Subtask completed: true
```

**Expected Result**: 
- Subtasks can be added to tasks
- Subtasks have their own IDs
- Batch operation can mark all subtasks as done

## Step 5: Verify File Structure

After running tests, check the `.taskmaster/` directory:

```bash
# View tasks.json
cat .taskmaster/tasks/tasks.json | jq .

# View config.json
cat .taskmaster/config.json | jq .

# View state.json
cat .taskmaster/state.json | jq .
```

**Expected Structure**:

```json
// .taskmaster/tasks/tasks.json
{
  "my-project": {
    "tasks": [
      {
        "id": "task-1704847200000-abc123xyz",
        "title": "Task 1: Setup",
        "description": "Initial setup",
        "priority": "high",
        "status": "in-progress",
        "assignee": "john.doe",
        "labels": ["bug"],
        "tag": "feature-auth",
        "tags": [{"name": "sprint-1", "color": "#a1b2c3"}],
        "type": "feature",
        "color": "#5865F2",
        "dependencies": [],
        "subtasks": [
          {
            "id": "subtask-1704847300000-xyz789",
            "title": "Subtask: Create login form",
            "parentId": "task-1704847200000-abc123xyz",
            "status": "done",
            "completed": true,
            "updatedAt": "2026-01-10T01:43:00.000Z"
          }
        ],
        "updatedAt": "2026-01-10T01:42:30.000Z",
        "createdAt": "2026-01-10T01:42:00.000Z"
      },
      // ... more tasks
    ]
  }
}
```

## Step 6: Error Handling Tests

### Test Invalid Priority

```typescript
try {
  await manager.createTask('my-project', {
    title: 'Invalid Task',
    description: 'Test',
    priority: 'urgent' as any  // Invalid priority
  });
} catch (error) {
  console.log('Caught validation error:', error.message);
  // Expected: Caught validation error: Invalid task priority: urgent...
}
```

### Test Missing Dependencies

```typescript
try {
  await manager.addDependency('my-project', task1.id, 'non-existent-task-id');
} catch (error) {
  console.log('Caught dependency error:', error.message);
  // Expected: Caught dependency error: Dependency non-existent-task-id does not exist
}
```

### Test Delete Task with Dependencies

```typescript
// Try to delete task1 when task2 depends on it
try {
  await manager.removeTask('my-project', task1.id);
} catch (error) {
  console.log('Caught deletion error:', error.message);
  // Expected: Caught deletion error: Cannot delete task ...: 1 task(s) depend on it
}
```

## Step 7: Integration with taskmaster-ai CLI

The package works alongside taskmaster-ai CLI:

```bash
# Use taskmaster-ai CLI commands
npx taskmaster-ai list
npx taskmaster-ai show 1
npx taskmaster-ai set-status --id=1 --status=done

# Your TaskManager will see the changes
const tasks = await manager.getTasks('my-project');
// Tasks reflect changes made via CLI
```

## Expected Behavior Summary

### ✅ What Works

1. **Installation**: Package installs and auto-initializes taskmaster-ai
2. **Task CRUD**: Create, read, update, delete tasks works
3. **Filtering**: Multi-criteria filtering works correctly
4. **Batch Operations**: Batch updates/deletes work atomically
5. **Assignee Management**: Assign/unassign/list works
6. **Label Management**: Add/remove/list labels works
7. **Tag Management**: Single and multiple tags with colors work
8. **Dependencies**: Add dependencies, prevent cycles, validate
9. **Subtasks**: Add subtasks, mark as done
10. **Validation**: Invalid data is rejected with clear errors
11. **File Operations**: Atomic writes, backups created automatically

### ⚠️ What to Watch For

1. **File Permissions**: Ensure `.taskmaster/` directory has proper permissions
2. **Concurrent Access**: File-based storage doesn't handle concurrent writes well
3. **Large Task Sets**: Performance may degrade with 1000+ tasks
4. **Backups**: Check `.taskmaster/tasks/backups/` for automatic backups

### 🔍 Debugging Tips

1. **Check tasks.json**: View the file directly to see what's stored
2. **Check backups**: Look in `.taskmaster/tasks/backups/` if something goes wrong
3. **Validate dependencies**: Run `validateDependencies()` to check for issues
4. **Check logs**: Look for console warnings/errors during operations

## Complete Example Script

Save this as `test-task-manager.ts`:

```typescript
import { TaskManager } from '@your-org/task-manager';
import * as path from 'path';

async function testTaskManager() {
  const projectRoot = process.cwd();
  const manager = new TaskManager(projectRoot);

  const projectName = 'test-project';

  // Create tasks
  console.log('Creating tasks...');
  const task1 = await manager.createTask(projectName, {
    title: 'Task 1',
    description: 'First task',
    priority: 'high',
    status: 'pending'
  });

  const task2 = await manager.createTask(projectName, {
    title: 'Task 2',
    description: 'Second task',
    priority: 'medium',
    status: 'pending'
  });

  console.log('Created tasks:', task1.id, task2.id);

  // Assign and label
  await manager.assignTask(projectName, task1.id, 'alice');
  await manager.addLabels(projectName, task1.id, ['bug', 'frontend']);

  // Add dependency
  await manager.addDependency(projectName, task2.id, task1.id);

  // Get next task
  const nextTask = await manager.getNextTask(projectName);
  console.log('Next task:', nextTask?.title);

  // Batch update
  await manager.batchUpdate(projectName, [task1.id], {
    status: 'in-progress'
  });

  // List all tasks
  const allTasks = await manager.getTasks(projectName);
  console.log('All tasks:', allTasks.length);

  console.log('✅ All tests passed!');
}

testTaskManager().catch(console.error);
```

Run it:

```bash
npx ts-node test-task-manager.ts
```

## Troubleshooting

### Issue: "taskmaster-ai already initialized"

**Solution**: This is normal if `.taskmaster/` already exists. The package will use the existing structure.

### Issue: "Failed to initialize taskmaster-ai"

**Solution**: 
1. Check if `npx taskmaster-ai init` works manually
2. Ensure you have write permissions in the project directory
3. Try running `npx task-manager-init` manually

### Issue: "Task not found"

**Solution**: 
1. Verify the project name matches what's in `tasks.json`
2. Check the task ID is correct
3. Use `getTasks()` to list all tasks and verify IDs

### Issue: "Circular dependency detected"

**Solution**: 
1. Review your dependency chain
2. Use `validateDependencies()` to find the cycle
3. Remove the circular dependency

## Next Steps

After testing the core functionality:

1. **Add Tests**: Write unit and integration tests
2. **Build Package**: Run `npm run build` to compile TypeScript
3. **Use in Real Project**: Integrate into an actual project
4. **Explore Advanced Features**: Try time management, collaboration features (when implemented)
