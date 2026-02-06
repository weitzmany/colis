# Task Manager - Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Package

```bash
cd /path/to/your/project
npm install @colis/deck
```

**Expected Output:**
```
✓ taskmaster-ai initialized successfully
added 15 packages in 5s
```

**What Gets Created:**
```
your-project/
└── .taskmaster/
    ├── config.json
    ├── state.json
    ├── tasks/
    │   └── tasks.json  (empty initially)
    └── docs/
```

### Step 2: Use in Your Code

```typescript
import { TaskManager } from '@colis/deck';

const manager = new TaskManager(process.cwd());
```

## Basic Operations

### Create Task

```typescript
const task = await manager.createTask('my-project', {
  title: 'My First Task',
  description: 'Task description here',
  priority: 'high',
  status: 'pending'
});

console.log(task.id);  // "task-1704847200000-abc123xyz"
```

**Expected in tasks.json:**
```json
{
  "my-project": {
    "tasks": [{
      "id": "task-1704847200000-abc123xyz",
      "title": "My First Task",
      "description": "Task description here",
      "priority": "high",
      "status": "pending",
      "type": "feature",
      "color": "#5865F2",
      "updatedAt": "2026-01-10T01:42:00.000Z",
      "createdAt": "2026-01-10T01:42:00.000Z"
    }]
  }
}
```

### Read Tasks

```typescript
// Get all tasks
const allTasks = await manager.getTasks('my-project');
console.log(allTasks.length);  // 1

// Get specific task
const task = await manager.getTask('my-project', task.id);
console.log(task?.title);  // "My First Task"

// Filter tasks
const highPriority = await manager.getTasks('my-project', {
  priority: 'high'
});
console.log(highPriority.length);  // 1
```

### Update Task

```typescript
await manager.updateTask('my-project', task.id, {
  status: 'in-progress'
});

const updated = await manager.getTask('my-project', task.id);
console.log(updated?.status);  // "in-progress"
```

### Assign & Label

```typescript
// Assign task
await manager.assignTask('my-project', task.id, 'alice');

// Add labels
await manager.addLabels('my-project', task.id, ['bug', 'frontend']);

// Add tags
await manager.addTags('my-project', task.id, ['sprint-1']);

// Verify
const task = await manager.getTask('my-project', task.id);
console.log(task?.assignee);  // "alice"
console.log(task?.labels);    // ["bug", "frontend"]
console.log(task?.tags);      // [{name: "sprint-1", color: "#a1b2c3"}]
```

### Batch Operations

```typescript
// Batch update
const result = await manager.batchUpdate('my-project', [task1.id, task2.id], {
  status: 'in-progress',
  priority: 'high'
});

console.log(result.success);  // 2
console.log(result.failed);   // 0
```

## Manual Testing Checklist

Run these tests to verify everything works:

### ✅ Test 1: Installation
```bash
npm install @colis/deck
# Expected: .taskmaster/ directory created
```

### ✅ Test 2: Create Task
```typescript
const task = await manager.createTask('test', {
  title: 'Test Task',
  description: 'Testing',
  priority: 'medium'
});
// Expected: task.id is a string like "task-..."
```

### ✅ Test 3: Read Task
```typescript
const task = await manager.getTask('test', task.id);
// Expected: task.title === 'Test Task'
```

### ✅ Test 4: Update Task
```typescript
await manager.updateTask('test', task.id, { status: 'done' });
const updated = await manager.getTask('test', task.id);
// Expected: updated.status === 'done'
```

### ✅ Test 5: Filter Tasks
```typescript
const doneTasks = await manager.getTasks('test', { status: 'done' });
// Expected: doneTasks.length === 1
```

### ✅ Test 6: Assignee
```typescript
await manager.assignTask('test', task.id, 'bob');
const bobTasks = await manager.getTasks('test', { assignee: 'bob' });
// Expected: bobTasks.length === 1
```

### ✅ Test 7: Labels
```typescript
await manager.addLabels('test', task.id, ['urgent', 'bug']);
const labels = await manager.listLabels('test');
// Expected: labels array with 'urgent' and 'bug'
```

### ✅ Test 8: Tags
```typescript
await manager.addTags('test', task.id, ['sprint-1']);
const tags = await manager.listTags('test');
// Expected: tags array with 'sprint-1' and auto-generated color
```

### ✅ Test 9: Dependencies
```typescript
const task2 = await manager.createTask('test', {
  title: 'Task 2',
  description: 'Depends on Task 1',
  priority: 'medium'
});

await manager.addDependency('test', task2.id, task.id);
const nextTask = await manager.getNextTask('test');
// Expected: nextTask.id === task.id (not task2)
```

### ✅ Test 10: Batch Update
```typescript
const result = await manager.batchUpdate('test', [task.id, task2.id], {
  status: 'in-progress'
});
// Expected: result.success === 2
```

## What to Expect When Testing

### File Changes

**Before operations:**
```json
// .taskmaster/tasks/tasks.json
{}
```

**After creating tasks:**
```json
{
  "test": {
    "tasks": [
      {
        "id": "task-...",
        "title": "Test Task",
        "status": "pending",
        "priority": "medium",
        ...
      }
    ]
  }
}
```

### Console Output

When running operations, you should see:
- No errors (unless testing error cases)
- Tasks created successfully
- Updates applied correctly
- Filters return expected results

### Backup Files

After operations, check:
```bash
ls .taskmaster/tasks/backups/
# Expected: timestamped backup files (last 10 kept)
```

## Common Issues & Solutions

### Issue: "taskmaster-ai already initialized"
✅ **Normal** - Directory already exists, package will use it

### Issue: "Task not found"
❌ **Check**: Project name and task ID are correct

### Issue: "Circular dependency"
❌ **Check**: Dependency chain doesn't create a cycle

### Issue: "Invalid priority"
❌ **Check**: Using valid priority: 'very low' | 'low' | 'medium' | 'high' | 'very high'

## Next Steps

1. ✅ Complete basic CRUD operations
2. ✅ Test filtering and batch operations
3. ✅ Try assignee/label/tag management
4. ✅ Test dependency management
5. 📖 Read full [WORKFLOW.md](./WORKFLOW.md) for detailed examples
