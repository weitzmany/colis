# Task Manager Test Cheatsheet

Quick reference for testing the `@your-org/task-manager` package.

## Essential Commands

### Setup
```bash
mkdir -p ~/test-task-manager && cd ~/test-task-manager
npm init -y
npm install @your-org/task-manager
```

### File Checks
```bash
# Check structure
ls -la .taskmaster
ls -la .taskmaster/tasks/

# View tasks
cat .taskmaster/tasks/tasks.json | jq '.'
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks'

# Count tasks
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks | length'

# Clean up
rm -rf .taskmaster
```

## Quick Test Code

### Basic Operations
```typescript
import { TaskManager } from '@your-org/task-manager';

const manager = new TaskManager(process.cwd(), { autoInit: true });

// Create
const task = await manager.createTask('test-project', {
  title: 'Test',
  description: 'Test task',
  priority: 'high',
  status: 'pending'
});

// Read
const tasks = await manager.getTasks('test-project');
const task = await manager.getTask('test-project', taskId);

// Update
await manager.updateTask('test-project', taskId, {
  status: 'in-progress'
});

// Delete
await manager.removeTask('test-project', taskId);
```

### Advanced Operations
```typescript
// Subtask
await manager.addSubtask('test-project', taskId, {
  title: 'Subtask',
  status: 'pending'
});

// Dependency
await manager.addDependency('test-project', taskBId, taskAId);
await manager.validateDependencies('test-project');

// Assignee
await manager.assignTask('test-project', taskId, 'john.doe');
await manager.unassignTask('test-project', taskId);
await manager.listAssignees('test-project');

// Labels
await manager.addLabel('test-project', taskId, 'bug');
await manager.addLabels('test-project', taskId, ['bug', 'frontend']);
await manager.removeLabel('test-project', taskId, 'bug');
await manager.listLabels('test-project');

// Tags
await manager.addTag('test-project', taskId, 'sprint-1');
await manager.addTags('test-project', taskId, ['sprint-1', 'feature']);
await manager.listTags('test-project');
await manager.migrateTags('test-project');

// Batch
await manager.batchUpdate('test-project', [id1, id2], {
  status: 'in-progress'
});
await manager.batchDelete('test-project', [id1, id2]);

// Filter
await manager.getTasks('test-project', {
  status: ['pending', 'in-progress'],
  priority: ['high'],
  assignee: 'john.doe',
  labels: ['bug'],
  tags: ['sprint-1']
});
```

## Key Checks

### ✅ Initialization
- `.taskmaster/` exists
- `.taskmaster/tasks/tasks.json` exists
- `.taskmaster/config.json` exists
- `.taskmaster/state.json` exists

### ✅ Task Creation
- Task has unique ID (string: `task-{timestamp}-{random}`)
- Task has `createdAt` and `updatedAt`
- All fields match input

### ✅ Task Updates
- `updatedAt` is newer than `createdAt`
- Fields are updated correctly
- Other fields unchanged

### ✅ Data Persistence
- Tasks persist across instances
- JSON structure is valid
- No data corruption

## Red Flags

- ❌ Tasks not persisting → Check file permissions
- ❌ ID collisions → Verify ID generation
- ❌ Invalid JSON → Check file structure
- ❌ Slow performance → Check for memory leaks
- ❌ Validation errors → Check data format

## Test Status Values

```typescript
// taskmaster-ai
'pending' | 'in-progress' | 'done' | 'deferred' | 'cancelled' | 'blocked' | 'review'

// discord-story-bot
'backlog' | 'to do' | 'in progress' | 'testing' | 'next release' | 'archive'
```

## Test Priority Values

```typescript
'low' | 'medium' | 'high' | 'very low' | 'very high'
```

## Test Task Types

```typescript
'feature' | 'bug' | 'fix' | 'test' | 'research' | 'prd' | 'documents'
```

## Quick Verification

```bash
# Check if task exists
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[] | select(.id == "task-id")'

# Check task count
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks | length'

# Check by status
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[] | select(.status == "pending")'

# Check by assignee
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[] | select(.assignee == "john.doe")'

# Check by labels
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[] | select(.labels[] == "bug")'
```

---

**Version**: 1.0.0
