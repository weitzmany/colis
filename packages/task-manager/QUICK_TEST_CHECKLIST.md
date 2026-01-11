# Quick Test Checklist - Task Manager Package

Use this checklist for rapid manual testing of the `@your-org/task-manager` package.

## Before You Start

```bash
# Setup (one time)
mkdir -p ~/test-task-manager
cd ~/test-task-manager
npm init -y
npm install @your-org/task-manager
```

## Test Script Setup

Create `test-quick.ts`:

```typescript
import { TaskManager } from '@your-org/task-manager';
import * as path from 'path';

const projectRoot = process.cwd();
const manager = new TaskManager(projectRoot, { autoInit: true });

async function runTests() {
  // Tests go here
}

runTests().catch(console.error);
```

## 5-Minute Quick Check

### ✅ Step 1: Initialization (30 seconds)

```typescript
await manager.initializeTaskmaster();
```

**Check:**
- [ ] `.taskmaster` directory exists
- [ ] `.taskmaster/tasks/tasks.json` exists
- [ ] `.taskmaster/config.json` exists
- [ ] `.taskmaster/state.json` exists

**Verification:**
```bash
ls -la .taskmaster
ls -la .taskmaster/tasks/
cat .taskmaster/tasks/tasks.json  # Should show: {}
```

### ✅ Step 2: Create Task (1 minute)

```typescript
const task = await manager.createTask('test-project', {
  title: 'Test Task',
  description: 'This is a test task',
  priority: 'high',
  status: 'pending'
});

console.log('Created task:', task);
```

**Check:**
- [ ] Task is created successfully
- [ ] Task has unique ID (string format)
- [ ] Task has `createdAt` and `updatedAt` timestamps
- [ ] Task has correct title, description, priority, status

**Verification:**
```bash
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[0]'
```

### ✅ Step 3: Read Task (30 seconds)

```typescript
const retrieved = await manager.getTask('test-project', task.id);
console.log('Retrieved task:', retrieved);
```

**Check:**
- [ ] Task can be retrieved by ID
- [ ] Retrieved task matches created task
- [ ] All fields are present

### ✅ Step 4: Update Task (30 seconds)

```typescript
const updated = await manager.updateTask('test-project', task.id, {
  status: 'in-progress',
  priority: 'very high'
});

console.log('Updated task:', updated);
```

**Check:**
- [ ] Status is updated to 'in-progress'
- [ ] Priority is updated to 'very high'
- [ ] `updatedAt` timestamp is newer than `createdAt`
- [ ] Other fields remain unchanged

**Verification:**
```bash
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[0].status'
# Should show: "in-progress"
```

### ✅ Step 5: Filter Tasks (30 seconds)

```typescript
const pendingTasks = await manager.getTasks('test-project', {
  status: ['pending']
});

const inProgressTasks = await manager.getTasks('test-project', {
  status: ['in-progress']
});

console.log('Pending:', pendingTasks.length);
console.log('In Progress:', inProgressTasks.length);
```

**Check:**
- [ ] Filtering by status works
- [ ] Pending filter returns correct tasks
- [ ] In-progress filter returns correct tasks

### ✅ Step 6: Add Subtask (30 seconds)

```typescript
const subtask = await manager.addSubtask('test-project', task.id, {
  title: 'Subtask 1',
  description: 'First subtask',
  status: 'pending'
});

console.log('Created subtask:', subtask);
```

**Check:**
- [ ] Subtask is created successfully
- [ ] Subtask has `parentId` set correctly
- [ ] Parent task contains the subtask

**Verification:**
```typescript
const parent = await manager.getTask('test-project', task.id);
console.log('Parent subtasks:', parent.subtasks);
// Should contain the new subtask
```

### ✅ Step 7: Assign Task (30 seconds)

```typescript
await manager.assignTask('test-project', task.id, 'john.doe');

const assignedTask = await manager.getTask('test-project', task.id);
console.log('Assigned task:', assignedTask.assignee);
```

**Check:**
- [ ] Task is assigned to 'john.doe'
- [ ] Assignee field is set correctly
- [ ] Task can be filtered by assignee

**Verification:**
```typescript
const johnTasks = await manager.getTasks('test-project', {
  assignee: 'john.doe'
});
console.log('John\'s tasks:', johnTasks.length); // Should be 1
```

### ✅ Step 8: Add Labels (30 seconds)

```typescript
await manager.addLabels('test-project', task.id, ['bug', 'frontend', 'urgent']);

const labeledTask = await manager.getTask('test-project', task.id);
console.log('Task labels:', labeledTask.labels);
```

**Check:**
- [ ] Labels are added successfully
- [ ] All 3 labels are present
- [ ] Labels are unique (no duplicates)
- [ ] Task can be filtered by labels

**Verification:**
```typescript
const bugTasks = await manager.getTasks('test-project', {
  labels: ['bug']
});
console.log('Bug tasks:', bugTasks.length); // Should be 1
```

### ✅ Step 9: Add Tags (30 seconds)

```typescript
await manager.addTags('test-project', task.id, ['sprint-1', 'feature-auth']);

const taggedTask = await manager.getTask('test-project', task.id);
console.log('Task tags:', taggedTask.tags);
```

**Check:**
- [ ] Tags are added successfully
- [ ] Tags have auto-generated colors
- [ ] Tags array contains all tags
- [ ] Task can be filtered by tags

**Verification:**
```typescript
const sprint1Tasks = await manager.getTasks('test-project', {
  tags: ['sprint-1']
});
console.log('Sprint 1 tasks:', sprint1Tasks.length); // Should be 1
```

### ✅ Step 10: Batch Update (30 seconds)

```typescript
// Create second task
const task2 = await manager.createTask('test-project', {
  title: 'Task 2',
  description: 'Second task',
  priority: 'medium',
  status: 'pending'
});

// Batch update both tasks
const result = await manager.batchUpdate('test-project', [task.id, task2.id], {
  status: 'in-progress',
  priority: 'high'
});

console.log('Batch update result:', result);
```

**Check:**
- [ ] Both tasks are updated successfully
- [ ] Result shows `success: 2, failed: 0`
- [ ] Both tasks have status 'in-progress'
- [ ] Both tasks have priority 'high'

**Verification:**
```typescript
const task1Updated = await manager.getTask('test-project', task.id);
const task2Updated = await manager.getTask('test-project', task2.id);
console.log('Task 1 status:', task1Updated.status); // Should be 'in-progress'
console.log('Task 2 status:', task2Updated.status); // Should be 'in-progress'
```

### ✅ Step 11: Delete Task (30 seconds)

```typescript
await manager.removeTask('test-project', task2.id);

const deleted = await manager.getTask('test-project', task2.id);
console.log('Deleted task:', deleted); // Should be null
```

**Check:**
- [ ] Task is deleted successfully
- [ ] `getTask` returns `null` for deleted task
- [ ] Task is removed from tasks.json

**Verification:**
```bash
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks | length'
# Should show 1 (only task1 remains)
```

### ✅ Step 12: Dependency Management (1 minute)

```typescript
// Create Task A
const taskA = await manager.createTask('test-project', {
  title: 'Task A',
  description: 'First task',
  priority: 'high',
  status: 'pending'
});

// Create Task B
const taskB = await manager.createTask('test-project', {
  title: 'Task B',
  description: 'Second task',
  priority: 'high',
  status: 'pending'
});

// Add dependency: B depends on A
await manager.addDependency('test-project', taskB.id, taskA.id);

// Validate dependencies
const validation = await manager.validateDependencies('test-project');
console.log('Dependency validation:', validation);
```

**Check:**
- [ ] Dependency is added successfully
- [ ] Task B has Task A in dependencies array
- [ ] Validation passes (valid: true)
- [ ] `getNextTask` returns Task A (not Task B, since B depends on A)

**Verification:**
```typescript
const taskBWithDep = await manager.getTask('test-project', taskB.id);
console.log('Task B dependencies:', taskBWithDep.dependencies);
// Should contain taskA.id

const nextTask = await manager.getNextTask('test-project');
console.log('Next task:', nextTask?.id); // Should be taskA.id
```

---

## Red Flags to Watch For

### ❌ Critical Issues

- [ ] **Tasks not persisting**: Check `.taskmaster/tasks/tasks.json` is being written
- [ ] **ID collisions**: Verify all task IDs are unique
- [ ] **Data corruption**: Verify JSON structure is valid after operations
- [ ] **Memory leaks**: Check for increasing memory usage during batch operations
- [ ] **Race conditions**: Verify concurrent operations don't corrupt data

### ⚠️ Warning Signs

- [ ] **Slow performance**: Operations taking > 1 second for < 100 tasks
- [ ] **Validation errors**: Invalid data passing validation
- [ ] **Missing fields**: Required fields not being set
- [ ] **Timestamp issues**: `updatedAt` not updating or being older than `createdAt`
- [ ] **Filter failures**: Filters returning incorrect results

---

## Quick Verification Script

Run this complete test script:

```typescript
import { TaskManager } from '@your-org/task-manager';
import * as path from 'path';

const projectRoot = process.cwd();
const manager = new TaskManager(projectRoot, { autoInit: true });

async function quickTest() {
  console.log('🚀 Starting quick test...\n');

  // 1. Initialize
  console.log('1. Initializing...');
  await manager.initializeTaskmaster();
  console.log('✅ Initialized\n');

  // 2. Create task
  console.log('2. Creating task...');
  const task = await manager.createTask('test-project', {
    title: 'Quick Test Task',
    description: 'Testing task manager',
    priority: 'high',
    status: 'pending'
  });
  console.log('✅ Created task:', task.id, '\n');

  // 3. Read task
  console.log('3. Reading task...');
  const retrieved = await manager.getTask('test-project', task.id);
  console.log('✅ Retrieved task:', retrieved?.title, '\n');

  // 4. Update task
  console.log('4. Updating task...');
  const updated = await manager.updateTask('test-project', task.id, {
    status: 'in-progress'
  });
  console.log('✅ Updated task status:', updated.status, '\n');

  // 5. Add subtask
  console.log('5. Adding subtask...');
  const subtask = await manager.addSubtask('test-project', task.id, {
    title: 'Subtask 1',
    description: 'First subtask',
    status: 'pending'
  });
  console.log('✅ Added subtask:', subtask.id, '\n');

  // 6. Assign task
  console.log('6. Assigning task...');
  await manager.assignTask('test-project', task.id, 'john.doe');
  console.log('✅ Assigned task\n');

  // 7. Add labels
  console.log('7. Adding labels...');
  await manager.addLabels('test-project', task.id, ['bug', 'frontend']);
  console.log('✅ Added labels\n');

  // 8. Add tags
  console.log('8. Adding tags...');
  await manager.addTags('test-project', task.id, ['sprint-1']);
  console.log('✅ Added tags\n');

  // 9. Filter tasks
  console.log('9. Filtering tasks...');
  const filtered = await manager.getTasks('test-project', {
    status: ['in-progress']
  });
  console.log('✅ Filtered tasks:', filtered.length, '\n');

  // 10. Final verification
  console.log('10. Final verification...');
  const final = await manager.getTask('test-project', task.id);
  console.log('✅ Final task state:');
  console.log('   - Status:', final?.status);
  console.log('   - Assignee:', final?.assignee);
  console.log('   - Labels:', final?.labels);
  console.log('   - Tags:', final?.tags?.map(t => t.name));
  console.log('   - Subtasks:', final?.subtasks?.length || 0);

  console.log('\n🎉 All quick tests passed!');
}

quickTest().catch(console.error);
```

**Run:**
```bash
npx ts-node test-quick.ts
```

---

## Success Criteria

All quick tests pass when:
- ✅ Initialization works
- ✅ CRUD operations work
- ✅ Subtasks work
- ✅ Assignees work
- ✅ Labels work
- ✅ Tags work
- ✅ Filtering works
- ✅ Data persists correctly

---

## Common Commands

```bash
# Check taskmaster structure
ls -la .taskmaster
ls -la .taskmaster/tasks/

# View tasks.json
cat .taskmaster/tasks/tasks.json | jq '.'

# View specific project tasks
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks'

# Count tasks
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks | length'

# Check task by index
cat .taskmaster/tasks/tasks.json | jq '.test-project.tasks[0]'

# Clean up (remove all test data)
rm -rf .taskmaster
```

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0
