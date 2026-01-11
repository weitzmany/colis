# Task Manager Package - Comprehensive Test Plan

This document provides detailed manual test instructions for the `@your-org/task-manager` package.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setup and Installation](#setup-and-installation)
3. [Test Environment Setup](#test-environment-setup)
4. [Test Cases](#test-cases)
   - [Initialization Tests](#initialization-tests)
   - [Task CRUD Operations](#task-crud-operations)
   - [Subtask Operations](#subtask-operations)
   - [Dependency Management](#dependency-management)
   - [Batch Operations](#batch-operations)
   - [Assignee Management](#assignee-management)
   - [Label Management](#label-management)
   - [Tag Management](#tag-management)
   - [Task Filtering](#task-filtering)
   - [Validation Tests](#validation-tests)
   - [Error Handling](#error-handling)
   - [Integration Tests](#integration-tests)
5. [Regression Tests](#regression-tests)
6. [Performance Tests](#performance-tests)

---

## Prerequisites

### Required Tools

- Node.js (v18 or higher)
- npm (v9 or higher)
- TypeScript (v5 or higher)
- A text editor or IDE
- Terminal/Command line access

### Required Knowledge

- Basic TypeScript/JavaScript
- Understanding of async/await
- File system operations
- JSON structure

---

## Setup and Installation

### Step 1: Create Test Project

```bash
# Create a test directory
mkdir -p ~/test-task-manager
cd ~/test-task-manager

# Initialize a test project
npm init -y
```

### Step 2: Install Package

```bash
# Install the task-manager package
npm install @your-org/task-manager

# Or install from local path (if testing locally)
npm install file:../packages/task-manager
```

### Step 3: Verify Installation

```bash
# Check package.json includes the dependency
cat package.json | grep task-manager

# Expected: "@your-org/task-manager": "^1.0.0" (or version number)
```

### Step 4: Create Test Script

Create `test-manual.ts`:

```typescript
import { TaskManager } from '@your-org/task-manager';
import * as path from 'path';

const projectRoot = process.cwd();
const manager = new TaskManager(projectRoot, { autoInit: true });

// Test code will go here
```

---

## Test Environment Setup

### Test Project Structure

```
test-task-manager/
├── package.json
├── test-manual.ts
├── .taskmaster/          # Created by TaskManager
│   ├── tasks/
│   │   └── tasks.json
│   ├── config.json
│   └── state.json
└── node_modules/
```

### Initialize Test Data

Before running tests, ensure you have a clean state:

```bash
# Remove existing .taskmaster if present
rm -rf .taskmaster

# This will be auto-created by TaskManager
```

---

## Test Cases

### Initialization Tests

#### Test Case 1.1: Auto-Initialization

**Objective**: Verify TaskManager auto-initializes taskmaster-ai when `.taskmaster` doesn't exist.

**Steps**:
1. Remove `.taskmaster` directory if it exists: `rm -rf .taskmaster`
2. Create a new TaskManager instance:
   ```typescript
   const manager = new TaskManager(projectRoot, { autoInit: true });
   await manager.initializeTaskmaster();
   ```
3. Check that `.taskmaster` directory exists
4. Verify `.taskmaster/tasks/tasks.json` exists
5. Verify `.taskmaster/config.json` exists
6. Verify `.taskmaster/state.json` exists

**Expected Results**:
- ✅ `.taskmaster` directory is created
- ✅ All required files exist
- ✅ `tasks.json` has valid JSON structure: `{}`
- ✅ `config.json` has valid configuration
- ✅ `state.json` has valid state structure

**Verification Commands**:
```bash
ls -la .taskmaster
ls -la .taskmaster/tasks/
cat .taskmaster/tasks/tasks.json
cat .taskmaster/config.json
cat .taskmaster/state.json
```

#### Test Case 1.2: Manual Initialization Disabled

**Objective**: Verify TaskManager doesn't auto-initialize when `autoInit: false`.

**Steps**:
1. Remove `.taskmaster` directory: `rm -rf .taskmaster`
2. Create TaskManager with `autoInit: false`:
   ```typescript
   const manager = new TaskManager(projectRoot, { autoInit: false });
   ```
3. Check that `.taskmaster` directory does NOT exist

**Expected Results**:
- ✅ `.taskmaster` directory is NOT created
- ✅ No error is thrown

#### Test Case 1.3: Existing Taskmaster Structure

**Objective**: Verify TaskManager works with existing taskmaster-ai structure.

**Steps**:
1. Create `.taskmaster` directory manually
2. Create `.taskmaster/tasks/tasks.json` with valid structure
3. Create TaskManager instance
4. Verify it reads existing structure

**Expected Results**:
- ✅ TaskManager initializes successfully
- ✅ Existing tasks are readable
- ✅ No data is lost

---

### Task CRUD Operations

#### Test Case 2.1: Create Task - Basic

**Objective**: Verify basic task creation works correctly.

**Steps**:
1. Create a new task:
   ```typescript
   const task = await manager.createTask('test-project', {
     title: 'Test Task',
     description: 'This is a test task',
     priority: 'high',
     status: 'pending'
   });
   ```
2. Verify task object returned
3. Read task back using `getTask`
4. Verify all fields match

**Expected Results**:
- ✅ Task is created successfully
- ✅ Task has unique ID (string format: `task-{timestamp}-{random}`)
- ✅ Task has `createdAt` timestamp
- ✅ Task has `updatedAt` timestamp
- ✅ Task has correct title, description, priority, status
- ✅ Task can be retrieved using `getTask`

**Verification**:
```typescript
const retrieved = await manager.getTask('test-project', task.id);
console.log('Created:', task);
console.log('Retrieved:', retrieved);
// Should match
```

#### Test Case 2.2: Create Task - With All Options

**Objective**: Verify task creation with all optional fields.

**Steps**:
1. Create task with all options:
   ```typescript
   const task = await manager.createTask('test-project', {
     title: 'Full Feature Task',
     description: 'Task with all options',
     priority: 'very high',
     status: 'in-progress',
     details: 'Additional details here',
     testStrategy: 'Manual testing required',
     assignee: 'john.doe',
     labels: ['bug', 'frontend'],
     tag: 'feature-auth',
     tags: [{ name: 'sprint-1', color: '#FF5733' }],
     color: '#5865F2',
     type: 'feature',
     version: '1.0.0',
     dueDate: '2024-12-31T23:59:59Z',
     startDate: '2024-01-01T00:00:00Z'
   });
   ```
2. Verify all fields are set correctly

**Expected Results**:
- ✅ All optional fields are saved
- ✅ Fields match input values
- ✅ Timestamps are valid ISO strings

#### Test Case 2.3: Read Tasks - Get All

**Objective**: Verify reading all tasks works.

**Steps**:
1. Create multiple tasks (3-5 tasks)
2. Read all tasks:
   ```typescript
   const tasks = await manager.getTasks('test-project');
   ```
3. Verify count matches
4. Verify all tasks are returned

**Expected Results**:
- ✅ All created tasks are returned
- ✅ Task count matches created count
- ✅ Tasks are in array format

#### Test Case 2.4: Read Task - Get Single

**Objective**: Verify reading a single task by ID works.

**Steps**:
1. Create a task
2. Read task by ID:
   ```typescript
   const task = await manager.getTask('test-project', taskId);
   ```
3. Verify task matches created task
4. Test with non-existent ID:
   ```typescript
   const notFound = await manager.getTask('test-project', 'non-existent-id');
   ```

**Expected Results**:
- ✅ Existing task is returned correctly
- ✅ Non-existent task returns `null`
- ✅ No errors thrown for non-existent tasks

#### Test Case 2.5: Read Task - Get Next Task

**Objective**: Verify `getNextTask` returns next available task.

**Steps**:
1. Create multiple tasks with different statuses:
   - Task 1: status 'done'
   - Task 2: status 'pending' (no dependencies)
   - Task 3: status 'pending' (with dependencies)
2. Call `getNextTask`:
   ```typescript
   const nextTask = await manager.getNextTask('test-project');
   ```
3. Verify it returns Task 2 (pending, no dependencies)

**Expected Results**:
- ✅ Returns task with status 'pending' or 'in-progress'
- ✅ Returns task with no unmet dependencies
- ✅ Returns `null` if no available tasks

#### Test Case 2.6: Update Task - Basic Fields

**Objective**: Verify basic task updates work.

**Steps**:
1. Create a task
2. Update task:
   ```typescript
   const updated = await manager.updateTask('test-project', task.id, {
     status: 'in-progress',
     priority: 'high'
   });
   ```
3. Verify updated fields
4. Verify `updatedAt` timestamp changed

**Expected Results**:
- ✅ Status is updated to 'in-progress'
- ✅ Priority is updated to 'high'
- ✅ `updatedAt` timestamp is newer than `createdAt`
- ✅ Other fields remain unchanged

#### Test Case 2.7: Update Task - Append Details

**Objective**: Verify append mode for details field.

**Steps**:
1. Create task with details: `"Original details"`
2. Update with append:
   ```typescript
   await manager.updateTask('test-project', task.id, {
     details: '\n\nUpdated details'
   }, { append: true });
   ```
3. Verify details are appended, not replaced

**Expected Results**:
- ✅ Details field contains both original and new content
- ✅ Content is properly concatenated
- ✅ Timestamp is added to appended content (if implemented)

#### Test Case 2.8: Delete Task

**Objective**: Verify task deletion works.

**Steps**:
1. Create a task
2. Verify task exists
3. Delete task:
   ```typescript
   await manager.removeTask('test-project', task.id);
   ```
4. Verify task no longer exists
5. Verify task is removed from tasks.json

**Expected Results**:
- ✅ Task is deleted successfully
- ✅ `getTask` returns `null` for deleted task
- ✅ Task is removed from tasks array
- ✅ No errors thrown

---

### Subtask Operations

#### Test Case 3.1: Add Subtask

**Objective**: Verify adding subtasks to a task works.

**Steps**:
1. Create a parent task
2. Add subtask:
   ```typescript
   const subtask = await manager.addSubtask('test-project', parentTask.id, {
     title: 'Subtask 1',
     description: 'First subtask',
     status: 'pending'
   });
   ```
3. Verify subtask is added
4. Verify parent task contains subtask

**Expected Results**:
- ✅ Subtask is created with unique ID
- ✅ Subtask has `parentId` set to parent task ID
- ✅ Parent task's `subtasks` array contains the new subtask
- ✅ Subtask can be retrieved from parent task

**Verification**:
```typescript
const parent = await manager.getTask('test-project', parentTask.id);
console.log('Parent subtasks:', parent.subtasks);
// Should contain the new subtask
```

#### Test Case 3.2: Add Multiple Subtasks

**Objective**: Verify adding multiple subtasks works.

**Steps**:
1. Create a parent task
2. Add 3 subtasks sequentially
3. Verify all subtasks are added
4. Verify subtask order is maintained

**Expected Results**:
- ✅ All subtasks are added successfully
- ✅ Parent task contains all 3 subtasks
- ✅ Subtask IDs are unique
- ✅ Subtask order matches creation order

---

### Dependency Management

#### Test Case 4.1: Add Dependency

**Objective**: Verify adding task dependencies works.

**Steps**:
1. Create Task A
2. Create Task B
3. Add dependency: Task B depends on Task A:
   ```typescript
   await manager.addDependency('test-project', taskB.id, taskA.id);
   ```
4. Verify Task B has Task A in dependencies array

**Expected Results**:
- ✅ Task B's `dependencies` array contains Task A's ID
- ✅ Task A is not affected
- ✅ Dependency relationship is saved

**Verification**:
```typescript
const taskB = await manager.getTask('test-project', taskB.id);
console.log('Task B dependencies:', taskB.dependencies);
// Should contain taskA.id
```

#### Test Case 4.2: Validate Dependencies - Valid

**Objective**: Verify dependency validation passes for valid dependencies.

**Steps**:
1. Create Task A
2. Create Task B (depends on A)
3. Create Task C (depends on B)
4. Validate dependencies:
   ```typescript
   const result = await manager.validateDependencies('test-project');
   ```
5. Verify validation passes

**Expected Results**:
- ✅ Validation returns `{ valid: true, errors: [] }`
- ✅ No circular dependencies detected
- ✅ All dependencies exist

#### Test Case 4.3: Validate Dependencies - Circular

**Objective**: Verify circular dependency detection works.

**Steps**:
1. Create Task A
2. Create Task B
3. Manually create circular dependency:
   - Task A depends on Task B
   - Task B depends on Task A
4. Validate dependencies:
   ```typescript
   const result = await manager.validateDependencies('test-project');
   ```
5. Verify circular dependency is detected

**Expected Results**:
- ✅ Validation returns `{ valid: false, errors: [...] }`
- ✅ Error message indicates circular dependency
- ✅ Error identifies the circular path

#### Test Case 4.4: Validate Dependencies - Missing Task

**Objective**: Verify validation detects missing dependency targets.

**Steps**:
1. Create Task A
2. Manually set Task A's dependencies to include non-existent task ID
3. Validate dependencies:
   ```typescript
   const result = await manager.validateDependencies('test-project');
   ```
4. Verify missing dependency is detected

**Expected Results**:
- ✅ Validation returns `{ valid: false, errors: [...] }`
- ✅ Error message indicates missing dependency
- ✅ Error identifies the missing task ID

---

### Batch Operations

#### Test Case 5.1: Batch Update - Multiple Tasks

**Objective**: Verify batch updating multiple tasks works.

**Steps**:
1. Create 3 tasks with different statuses
2. Batch update all 3 tasks:
   ```typescript
   const result = await manager.batchUpdate('test-project', [task1.id, task2.id, task3.id], {
     status: 'in-progress',
     priority: 'high'
   });
   ```
3. Verify all tasks are updated
4. Verify result shows success count

**Expected Results**:
- ✅ All 3 tasks have status 'in-progress'
- ✅ All 3 tasks have priority 'high'
- ✅ Result shows `{ success: 3, failed: 0, errors: [] }`
- ✅ Operation is atomic (all succeed or all fail)

#### Test Case 5.2: Batch Update - Partial Failure

**Objective**: Verify batch update handles partial failures correctly.

**Steps**:
1. Create 2 valid tasks
2. Include 1 non-existent task ID in batch update
3. Execute batch update:
   ```typescript
   const result = await manager.batchUpdate('test-project', [task1.id, task2.id, 'non-existent'], {
     status: 'in-progress'
   });
   ```
4. Verify valid tasks are updated
5. Verify result shows partial success

**Expected Results**:
- ✅ Valid tasks are updated successfully
- ✅ Result shows `{ success: 2, failed: 1, errors: [...] }`
- ✅ Error message identifies failed task
- ✅ Valid tasks are not rolled back

#### Test Case 5.3: Batch Delete - Multiple Tasks

**Objective**: Verify batch deleting multiple tasks works.

**Steps**:
1. Create 3 tasks
2. Batch delete all 3:
   ```typescript
   const result = await manager.batchDelete('test-project', [task1.id, task2.id, task3.id]);
   ```
3. Verify all tasks are deleted
4. Verify result shows success count

**Expected Results**:
- ✅ All 3 tasks are deleted
- ✅ `getTask` returns `null` for all deleted tasks
- ✅ Result shows `{ success: 3, failed: 0, errors: [] }`
- ✅ Tasks are removed from tasks.json

---

### Assignee Management

#### Test Case 6.1: Assign Task

**Objective**: Verify assigning a task to an assignee works.

**Steps**:
1. Create a task
2. Assign task:
   ```typescript
   await manager.assignTask('test-project', task.id, 'john.doe');
   ```
3. Verify task has assignee set

**Expected Results**:
- ✅ Task's `assignee` field is set to 'john.doe'
- ✅ Task can be filtered by assignee
- ✅ Assignment is saved

#### Test Case 6.2: Unassign Task

**Objective**: Verify unassigning a task works.

**Steps**:
1. Create task with assignee
2. Unassign task:
   ```typescript
   await manager.unassignTask('test-project', task.id);
   ```
3. Verify assignee is removed

**Expected Results**:
- ✅ Task's `assignee` field is `undefined` or removed
- ✅ Task no longer appears in assignee-filtered results

#### Test Case 6.3: List Assignees

**Objective**: Verify listing assignees with statistics works.

**Steps**:
1. Create multiple tasks with different assignees:
   - Task 1: assignee 'john.doe'
   - Task 2: assignee 'john.doe'
   - Task 3: assignee 'jane.smith'
   - Task 4: no assignee
2. List assignees:
   ```typescript
   const assignees = await manager.listAssignees('test-project');
   ```
3. Verify statistics are correct

**Expected Results**:
- ✅ Returns array of assignee stats
- ✅ 'john.doe' has count: 2
- ✅ 'jane.smith' has count: 1
- ✅ Each stat includes assignee name, count, and tasks array

**Verification**:
```typescript
console.log('Assignees:', assignees);
// Should show:
// [
//   { assignee: 'john.doe', count: 2, tasks: [...] },
//   { assignee: 'jane.smith', count: 1, tasks: [...] }
// ]
```

---

### Label Management

#### Test Case 7.1: Add Single Label

**Objective**: Verify adding a single label works.

**Steps**:
1. Create a task
2. Add label:
   ```typescript
   await manager.addLabel('test-project', task.id, 'bug');
   ```
3. Verify label is added

**Expected Results**:
- ✅ Task's `labels` array contains 'bug'
- ✅ Label is saved

#### Test Case 7.2: Add Multiple Labels

**Objective**: Verify adding multiple labels at once works.

**Steps**:
1. Create a task
2. Add multiple labels:
   ```typescript
   await manager.addLabels('test-project', task.id, ['bug', 'frontend', 'urgent']);
   ```
3. Verify all labels are added

**Expected Results**:
- ✅ Task's `labels` array contains all 3 labels
- ✅ Labels are unique (no duplicates)
- ✅ Labels are saved

#### Test Case 7.3: Remove Label

**Objective**: Verify removing a label works.

**Steps**:
1. Create task with labels: ['bug', 'frontend', 'urgent']
2. Remove label:
   ```typescript
   await manager.removeLabel('test-project', task.id, 'frontend');
   ```
3. Verify label is removed

**Expected Results**:
- ✅ Task's `labels` array no longer contains 'frontend'
- ✅ Other labels remain: ['bug', 'urgent']
- ✅ Change is saved

#### Test Case 7.4: List Labels

**Objective**: Verify listing labels with statistics works.

**Steps**:
1. Create multiple tasks with different labels:
   - Task 1: labels ['bug', 'frontend']
   - Task 2: labels ['bug', 'backend']
   - Task 3: labels ['feature']
   - Task 4: no labels
2. List labels:
   ```typescript
   const labels = await manager.listLabels('test-project');
   ```
3. Verify statistics are correct

**Expected Results**:
- ✅ Returns array of label stats
- ✅ 'bug' has count: 2
- ✅ 'frontend' has count: 1
- ✅ 'backend' has count: 1
- ✅ 'feature' has count: 1
- ✅ Each stat includes label name, count, and tasks array

---

### Tag Management

#### Test Case 8.1: Add Single Tag (taskmaster-ai style)

**Objective**: Verify adding single tag works.

**Steps**:
1. Create a task
2. Add tag:
   ```typescript
   await manager.addTag('test-project', task.id, 'feature-auth');
   ```
3. Verify tag is added

**Expected Results**:
- ✅ Task's `tag` field is set to 'feature-auth'
- ✅ Tag is saved

#### Test Case 8.2: Add Multiple Tags (discord-story-bot style)

**Objective**: Verify adding multiple tags with colors works.

**Steps**:
1. Create a task
2. Add multiple tags:
   ```typescript
   await manager.addTags('test-project', task.id, [
     'sprint-1',
     'feature-auth',
     'high-priority'
   ]);
   ```
3. Verify tags are added with auto-generated colors

**Expected Results**:
- ✅ Task's `tags` array contains all 3 tags
- ✅ Each tag has a `name` and `color` property
- ✅ Colors are auto-generated from tag names (consistent hashing)
- ✅ Tags are saved

#### Test Case 8.3: Add Tags with Custom Colors

**Objective**: Verify adding tags with custom colors works.

**Steps**:
1. Create a task
2. Add tags with custom colors:
   ```typescript
   await manager.addTags('test-project', task.id, [
     { name: 'sprint-1', color: '#FF5733' },
     { name: 'feature-auth', color: '#33FF57' }
   ]);
   ```
3. Verify custom colors are used

**Expected Results**:
- ✅ Tags use custom colors instead of auto-generated
- ✅ Colors are saved correctly

#### Test Case 8.4: List Tags

**Objective**: Verify listing tags with statistics works.

**Steps**:
1. Create multiple tasks with different tags:
   - Task 1: tags ['sprint-1', 'feature-auth']
   - Task 2: tags ['sprint-1', 'bug-fix']
   - Task 3: tag 'sprint-2' (single tag)
   - Task 4: no tags
2. List tags:
   ```typescript
   const tags = await manager.listTags('test-project');
   ```
3. Verify statistics are correct

**Expected Results**:
- ✅ Returns array of tag stats
- ✅ 'sprint-1' has count: 2
- ✅ 'feature-auth' has count: 1
- ✅ 'bug-fix' has count: 1
- ✅ 'sprint-2' has count: 1
- ✅ Each stat includes tag name, count, color, and tasks array

#### Test Case 8.5: Migrate Tags

**Objective**: Verify tag migration from single tag to multiple tags works.

**Steps**:
1. Create tasks with single `tag` field (taskmaster-ai style)
2. Run migration:
   ```typescript
   await manager.migrateTags('test-project');
   ```
3. Verify tags are migrated to `tags` array

**Expected Results**:
- ✅ Single `tag` values are converted to `tags` array
- ✅ Original `tag` field is preserved or removed (check implementation)
- ✅ Tags have auto-generated colors
- ✅ Migration is idempotent (can run multiple times safely)

---

### Task Filtering

#### Test Case 9.1: Filter by Status

**Objective**: Verify filtering tasks by status works.

**Steps**:
1. Create tasks with different statuses:
   - Task 1: 'pending'
   - Task 2: 'in-progress'
   - Task 3: 'done'
   - Task 4: 'pending'
2. Filter by status:
   ```typescript
   const pendingTasks = await manager.getTasks('test-project', {
     status: ['pending']
   });
   ```
3. Verify only pending tasks are returned

**Expected Results**:
- ✅ Returns only tasks with status 'pending'
- ✅ Task 1 and Task 4 are returned
- ✅ Task 2 and Task 3 are excluded

#### Test Case 9.2: Filter by Multiple Statuses

**Objective**: Verify filtering by multiple statuses works.

**Steps**:
1. Create tasks with different statuses
2. Filter by multiple statuses:
   ```typescript
   const activeTasks = await manager.getTasks('test-project', {
     status: ['pending', 'in-progress']
   });
   ```
3. Verify tasks with either status are returned

**Expected Results**:
- ✅ Returns tasks with status 'pending' OR 'in-progress'
- ✅ All matching tasks are included

#### Test Case 9.3: Filter by Priority

**Objective**: Verify filtering by priority works.

**Steps**:
1. Create tasks with different priorities
2. Filter by priority:
   ```typescript
   const highPriorityTasks = await manager.getTasks('test-project', {
     priority: ['high', 'very high']
   });
   ```
3. Verify only high priority tasks are returned

**Expected Results**:
- ✅ Returns only tasks with specified priorities
- ✅ Filtering works correctly

#### Test Case 9.4: Filter by Assignee

**Objective**: Verify filtering by assignee works.

**Steps**:
1. Create tasks with different assignees
2. Filter by assignee:
   ```typescript
   const johnTasks = await manager.getTasks('test-project', {
     assignee: 'john.doe'
   });
   ```
3. Verify only tasks assigned to 'john.doe' are returned

**Expected Results**:
- ✅ Returns only tasks assigned to specified assignee
- ✅ Unassigned tasks are excluded

#### Test Case 9.5: Filter by Labels

**Objective**: Verify filtering by labels works.

**Steps**:
1. Create tasks with different labels
2. Filter by labels:
   ```typescript
   const bugTasks = await manager.getTasks('test-project', {
     labels: ['bug']
   });
   ```
3. Verify only tasks with 'bug' label are returned

**Expected Results**:
- ✅ Returns only tasks containing specified labels
- ✅ Tasks must have ALL specified labels (AND logic)

#### Test Case 9.6: Filter by Tags

**Objective**: Verify filtering by tags works.

**Steps**:
1. Create tasks with different tags
2. Filter by tags:
   ```typescript
   const sprint1Tasks = await manager.getTasks('test-project', {
     tags: ['sprint-1']
   });
   ```
3. Verify only tasks with 'sprint-1' tag are returned

**Expected Results**:
- ✅ Returns only tasks containing specified tags
- ✅ Works with both single `tag` and `tags` array

#### Test Case 9.7: Combined Filters

**Objective**: Verify combining multiple filters works.

**Steps**:
1. Create tasks with various combinations of status, priority, assignee, labels
2. Filter with multiple criteria:
   ```typescript
   const filtered = await manager.getTasks('test-project', {
     status: ['in-progress'],
     priority: ['high'],
     assignee: 'john.doe',
     labels: ['bug']
   });
   ```
3. Verify only tasks matching ALL criteria are returned

**Expected Results**:
- ✅ Returns tasks matching ALL filter criteria (AND logic)
- ✅ Filtering is correct

---

### Validation Tests

#### Test Case 10.1: Valid Task Data

**Objective**: Verify valid task data passes validation.

**Steps**:
1. Create task with all valid fields
2. Verify no validation errors

**Expected Results**:
- ✅ Task is created successfully
- ✅ No validation errors

#### Test Case 10.2: Invalid Status

**Objective**: Verify invalid status is rejected.

**Steps**:
1. Attempt to create task with invalid status:
   ```typescript
   try {
     await manager.createTask('test-project', {
       title: 'Test',
       description: 'Test',
       status: 'invalid-status' as any
     });
   } catch (error) {
     // Expected
   }
   ```
2. Verify validation error is thrown

**Expected Results**:
- ✅ ValidationError is thrown
- ✅ Error message indicates invalid status
- ✅ Task is not created

#### Test Case 10.3: Invalid Priority

**Objective**: Verify invalid priority is rejected.

**Steps**:
1. Attempt to create task with invalid priority
2. Verify validation error is thrown

**Expected Results**:
- ✅ ValidationError is thrown
- ✅ Error message indicates invalid priority
- ✅ Task is not created

#### Test Case 10.4: Missing Required Fields

**Objective**: Verify missing required fields are rejected.

**Steps**:
1. Attempt to create task without title
2. Attempt to create task without description
3. Verify validation errors are thrown

**Expected Results**:
- ✅ ValidationError is thrown for missing title
- ✅ ValidationError is thrown for missing description
- ✅ Tasks are not created

#### Test Case 10.5: Invalid Dependencies

**Objective**: Verify invalid dependencies are rejected.

**Steps**:
1. Create task with dependency on non-existent task
2. Verify validation error is thrown

**Expected Results**:
- ✅ ValidationError is thrown
- ✅ Error message indicates missing dependency
- ✅ Task is not created

---

### Error Handling

#### Test Case 11.1: Non-Existent Project

**Objective**: Verify operations on non-existent project handle errors gracefully.

**Steps**:
1. Attempt to get tasks from non-existent project:
   ```typescript
   const tasks = await manager.getTasks('non-existent-project');
   ```
2. Verify behavior (should return empty array or throw error - check implementation)

**Expected Results**:
- ✅ Either returns empty array or throws appropriate error
- ✅ Error message is clear
- ✅ No crashes

#### Test Case 11.2: Non-Existent Task

**Objective**: Verify operations on non-existent task handle errors gracefully.

**Steps**:
1. Attempt to update non-existent task
2. Attempt to delete non-existent task
3. Verify error handling

**Expected Results**:
- ✅ Appropriate error is thrown or null is returned
- ✅ Error message is clear
- ✅ No crashes

#### Test Case 11.3: Invalid File Structure

**Objective**: Verify handling of corrupted or invalid tasks.json.

**Steps**:
1. Manually corrupt `.taskmaster/tasks/tasks.json` (invalid JSON)
2. Attempt to read tasks
3. Verify error handling

**Expected Results**:
- ✅ Error is thrown with clear message
- ✅ Error indicates file corruption
- ✅ No crashes

#### Test Case 11.4: Permission Errors

**Objective**: Verify handling of file permission errors.

**Steps**:
1. Remove write permissions from `.taskmaster/tasks/` directory
2. Attempt to create task
3. Verify error handling

**Expected Results**:
- ✅ Error is thrown with clear message
- ✅ Error indicates permission issue
- ✅ No crashes

---

### Integration Tests

#### Test Case 12.1: Full Workflow

**Objective**: Verify complete workflow from creation to completion.

**Steps**:
1. Create project
2. Create multiple tasks with dependencies
3. Assign tasks to assignees
4. Add labels and tags
5. Update task statuses
6. Filter and query tasks
7. Complete tasks
8. Verify final state

**Expected Results**:
- ✅ All operations succeed
- ✅ Data is persisted correctly
- ✅ Final state matches expectations

#### Test Case 12.2: Multiple Projects

**Objective**: Verify TaskManager works with multiple projects.

**Steps**:
1. Create tasks in 'project-1'
2. Create tasks in 'project-2'
3. Verify tasks are isolated per project
4. Verify filtering works per project

**Expected Results**:
- ✅ Tasks are isolated per project
- ✅ Project 1 tasks don't appear in Project 2
- ✅ Filtering works correctly per project

#### Test Case 12.3: Concurrent Operations

**Objective**: Verify TaskManager handles concurrent operations.

**Steps**:
1. Create multiple tasks concurrently
2. Update multiple tasks concurrently
3. Verify no data loss or corruption

**Expected Results**:
- ✅ All operations complete successfully
- ✅ No data corruption
- ✅ All tasks are saved correctly

---

## Regression Tests

### Test Case R1: Data Persistence

**Objective**: Verify data persists across TaskManager instances.

**Steps**:
1. Create TaskManager instance 1
2. Create tasks
3. Create new TaskManager instance 2
4. Verify tasks are still accessible

**Expected Results**:
- ✅ Tasks persist across instances
- ✅ Data is not lost

### Test Case R2: ID Uniqueness

**Objective**: Verify task IDs are always unique.

**Steps**:
1. Create 100 tasks rapidly
2. Verify all IDs are unique
3. Verify no collisions

**Expected Results**:
- ✅ All IDs are unique
- ✅ No ID collisions

### Test Case R3: Timestamp Accuracy

**Objective**: Verify timestamps are accurate and sequential.

**Steps**:
1. Create task
2. Wait 1 second
3. Update task
4. Verify `updatedAt` > `createdAt`

**Expected Results**:
- ✅ Timestamps are accurate
- ✅ `updatedAt` is always >= `createdAt`
- ✅ Timestamps are valid ISO strings

---

## Performance Tests

### Test Case P1: Large Dataset

**Objective**: Verify performance with large number of tasks.

**Steps**:
1. Create 1000 tasks
2. Measure time to:
   - Read all tasks
   - Filter tasks
   - Update tasks
   - Delete tasks
3. Verify performance is acceptable

**Expected Results**:
- ✅ Operations complete in reasonable time (< 5 seconds for 1000 tasks)
- ✅ No memory leaks
- ✅ Performance degrades gracefully

### Test Case P2: Deep Dependency Chains

**Objective**: Verify performance with deep dependency chains.

**Steps**:
1. Create chain of 100 dependent tasks (A -> B -> C -> ... -> Z)
2. Validate dependencies
3. Measure validation time
4. Verify performance is acceptable

**Expected Results**:
- ✅ Validation completes in reasonable time
- ✅ No stack overflow errors
- ✅ Performance is acceptable

---

## Test Execution Summary

### Quick Test Run

For a quick verification, run these essential tests:

1. ✅ Initialization (Test Case 1.1)
2. ✅ Create Task (Test Case 2.1)
3. ✅ Read Tasks (Test Case 2.3)
4. ✅ Update Task (Test Case 2.6)
5. ✅ Delete Task (Test Case 2.8)
6. ✅ Add Subtask (Test Case 3.1)
7. ✅ Add Dependency (Test Case 4.1)
8. ✅ Batch Update (Test Case 5.1)
9. ✅ Assign Task (Test Case 6.1)
10. ✅ Filter Tasks (Test Case 9.1)

### Full Test Run

Execute all test cases in order for comprehensive verification.

### Test Results Template

```
Test Execution Date: __________
Tester: __________
Environment: __________

Test Case | Status | Notes
----------|--------|------
1.1       | ✅/❌  |
1.2       | ✅/❌  |
...       | ...    |

Total: ___/___ Passed
```

---

## Troubleshooting

### Common Issues

1. **Taskmaster not initializing**
   - Check Node.js version (v18+)
   - Verify `taskmaster-ai` is installed
   - Check file permissions

2. **Tasks not persisting**
   - Verify `.taskmaster/tasks/tasks.json` exists
   - Check file permissions
   - Verify JSON is valid

3. **Validation errors**
   - Check task data matches expected format
   - Verify status/priority values are valid
   - Check dependencies exist

4. **Filter not working**
   - Verify filter syntax is correct
   - Check task data matches filter criteria
   - Verify project name is correct

---

## Success Criteria

All tests pass when:
- ✅ All CRUD operations work correctly
- ✅ All filtering works correctly
- ✅ All validation works correctly
- ✅ Error handling is graceful
- ✅ Data persists correctly
- ✅ Performance is acceptable
- ✅ No data corruption occurs

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0
