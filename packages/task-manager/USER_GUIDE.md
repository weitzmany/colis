# Task Manager - User Guide

Complete guide for using the `@your-org/task-manager` package.

## Table of Contents

1. [Installation](#installation)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
4. [Task Management](#task-management)
5. [Filtering and Querying](#filtering-and-querying)
6. [Batch Operations](#batch-operations)
7. [Assignee Management](#assignee-management)
8. [Label Management](#label-management)
9. [Tag Management](#tag-management)
10. [Dependency Management](#dependency-management)
11. [Best Practices](#best-practices)
12. [Troubleshooting](#troubleshooting)

## Installation

```bash
npm install @your-org/task-manager
```

The package automatically initializes taskmaster-ai when installed via the postinstall script.

## Getting Started

### Basic Setup

```typescript
import { TaskManager } from '@your-org/task-manager';

// Initialize TaskManager
const manager = new TaskManager('/path/to/project', {
  autoInit: true // Automatically initialize taskmaster-ai if not present
});
```

### Project Structure

The package expects a `.taskmaster` directory in your project root:

```
project-root/
├── .taskmaster/
│   ├── config.json      # Taskmaster configuration
│   ├── state.json       # Current tag/branch mapping
│   └── tasks/
│       └── tasks.json   # Task data (created automatically)
```

## Core Concepts

### Projects

Tasks are organized by **project name**. A project is a logical grouping of tasks, typically corresponding to a codebase or feature area.

```typescript
// All operations require a project name
const tasks = await manager.getTasks('my-project');
```

### Tasks

A **task** represents a unit of work with:
- **ID**: Unique identifier (number or string)
- **Title**: Brief description
- **Description**: Detailed explanation
- **Status**: Current state (pending, in-progress, done, etc.)
- **Priority**: Importance level (very low, low, medium, high, very high)
- **Dependencies**: Other tasks that must be completed first
- **Subtasks**: Smaller work items within the task

### Subtasks

**Subtasks** are nested work items within a parent task. They can have their own status, dependencies, and completion state.

## Task Management

### Creating Tasks

```typescript
// Basic task creation
const task = await manager.createTask('my-project', {
  title: 'Implement user authentication',
  description: 'Add login and registration functionality',
  priority: 'high',
  status: 'pending'
});

// With options
const task = await manager.createTask('my-project', {
  title: 'Fix bug in API',
  description: 'Resolve 500 error on user endpoint',
  priority: 'high',
  status: 'in-progress'
}, {
  assignee: 'john.doe',
  labels: ['bug', 'api'],
  tag: 'sprint-1',
  type: 'bug',
  color: '#ff0000'
});
```

### Reading Tasks

```typescript
// Get all tasks
const allTasks = await manager.getTasks('my-project');

// Get specific task
const task = await manager.getTask('my-project', taskId);

// Get next available task (based on dependencies)
const nextTask = await manager.getNextTask('my-project');
```

### Updating Tasks

```typescript
// Update task status
await manager.updateTask('my-project', taskId, {
  status: 'in-progress'
});

// Update multiple fields
await manager.updateTask('my-project', taskId, {
  status: 'done',
  priority: 'medium',
  description: 'Updated description'
});

// Append to details (instead of replacing)
await manager.updateTask('my-project', taskId, {
  details: 'Additional notes...'
}, {
  append: true
});
```

### Deleting Tasks

```typescript
// Delete a task (will fail if other tasks depend on it)
await manager.removeTask('my-project', taskId);
```

## Filtering and Querying

### Basic Filtering

```typescript
// Filter by status
const inProgressTasks = await manager.getTasks('my-project', {
  status: 'in-progress'
});

// Filter by multiple statuses
const activeTasks = await manager.getTasks('my-project', {
  status: ['in-progress', 'testing', 'review']
});

// Filter by priority
const highPriorityTasks = await manager.getTasks('my-project', {
  priority: 'high'
});

// Filter by assignee
const myTasks = await manager.getTasks('my-project', {
  assignee: 'john.doe'
});
```

### Advanced Filtering

```typescript
// Multiple criteria
const filteredTasks = await manager.getTasks('my-project', {
  status: ['in-progress', 'testing'],
  priority: ['high', 'very high'],
  assignee: 'john.doe',
  labels: ['bug', 'frontend'],
  tags: ['sprint-1'],
  type: 'bug'
});

// Combine filters (AND logic)
const complexFilter = await manager.getTasks('my-project', {
  status: 'in-progress',
  assignee: 'john.doe',
  labels: ['bug'],
  tags: ['urgent']
});
```

## Batch Operations

### Batch Updates

```typescript
// Update multiple tasks at once
const result = await manager.batchUpdate('my-project', [taskId1, taskId2, taskId3], {
  status: 'in-progress',
  priority: 'high',
  assignee: 'john.doe'
});

// Result includes success/failure for each task
console.log(result.successful); // Array of successful task IDs
console.log(result.failed);     // Array of failed task IDs with errors
```

### Batch Delete

```typescript
// Delete multiple tasks
const result = await manager.batchDelete('my-project', [taskId1, taskId2]);

// Check results
if (result.failed.length > 0) {
  console.error('Some tasks could not be deleted:', result.failed);
}
```

## Assignee Management

### Assigning Tasks

```typescript
// Assign a task
await manager.assignTask('my-project', taskId, 'john.doe');

// Unassign a task
await manager.unassignTask('my-project', taskId);

// Bulk assign
await manager.bulkAssign('my-project', [taskId1, taskId2], 'john.doe');
```

### Listing Assignees

```typescript
// Get all assignees with task counts
const assignees = await manager.listAssignees('my-project');

assignees.forEach(assignee => {
  console.log(`${assignee.assignee}: ${assignee.taskCount} tasks`);
});

// Get tasks for specific assignee
const myTasks = await manager.getTasksForAssignee('my-project', 'john.doe');
```

## Label Management

### Adding Labels

```typescript
// Add single label
await manager.addLabel('my-project', taskId, 'bug');

// Add multiple labels
await manager.addLabels('my-project', taskId, ['bug', 'frontend', 'urgent']);

// Remove label
await manager.removeLabel('my-project', taskId, 'bug');
```

### Listing Labels

```typescript
// Get all labels with task counts
const labels = await manager.listLabels('my-project');

labels.forEach(label => {
  console.log(`${label.label}: ${label.taskCount} tasks`);
});

// Get label suggestions
const suggestions = await manager.suggestLabels('my-project', taskId);
```

## Tag Management

### Adding Tags

```typescript
// Add single tag (taskmaster-ai style)
await manager.addTag('my-project', taskId, 'sprint-1');

// Add multiple tags with colors (discord-story-bot style)
await manager.addTags('my-project', taskId, ['feature-auth', 'sprint-1']);

// Tags automatically get colors generated from their names
```

### Listing Tags

```typescript
// Get all tags with counts and colors
const tags = await manager.listTags('my-project');

tags.forEach(tag => {
  console.log(`${tag.tag} (${tag.color}): ${tag.taskCount} tasks`);
});

// Get tag suggestions
const suggestions = await manager.suggestTags('my-project', 'spr');
```

### Migrating Tags

```typescript
// Migrate string tags to objects with colors
await manager.migrateTags('my-project');
```

## Dependency Management

### Adding Dependencies

```typescript
// Add dependency (task 2 depends on task 1)
await manager.addDependency('my-project', taskId2, taskId1);

// Dependencies are validated:
// - Task cannot depend on itself
// - Circular dependencies are prevented
// - Dependencies must exist
```

### Validating Dependencies

```typescript
// Validate all dependencies in project
const validation = await manager.validateDependencies('my-project');

if (!validation.valid) {
  console.error('Dependency errors:', validation.errors);
}
```

### Getting Next Task

```typescript
// Get next task based on dependencies
const nextTask = await manager.getNextTask('my-project');

// Returns the first task with all dependencies completed
```

## Best Practices

### 1. Use Descriptive Task Titles

```typescript
// ✅ Good
title: 'Implement user authentication with JWT'

// ❌ Bad
title: 'Fix auth'
```

### 2. Set Appropriate Priorities

- **Very High**: Critical bugs, blocking issues
- **High**: Important features, high-value work
- **Medium**: Standard features, normal priority
- **Low**: Nice-to-have features, polish
- **Very Low**: Future considerations, backlog

### 3. Use Labels for Categorization

```typescript
// Use labels for flexible categorization
labels: ['bug', 'frontend', 'api', 'database']
```

### 4. Use Tags for Organization

```typescript
// Use tags for project organization
tags: ['sprint-1', 'feature-auth', 'release-v1.0']
```

### 5. Manage Dependencies Properly

```typescript
// Always set dependencies for tasks that require others
await manager.addDependency('my-project', taskId, dependsOnId);
```

### 6. Use Batch Operations for Efficiency

```typescript
// ✅ Efficient: Batch update
await manager.batchUpdate('my-project', taskIds, updates);

// ❌ Inefficient: Individual updates
for (const taskId of taskIds) {
  await manager.updateTask('my-project', taskId, updates);
}
```

## Troubleshooting

### Task Not Found

```typescript
try {
  const task = await manager.getTask('my-project', taskId);
} catch (error) {
  // Error message includes available task IDs
  console.error(error.message);
}
```

### Dependency Errors

```typescript
// Validate dependencies before operations
const validation = await manager.validateDependencies('my-project');
if (!validation.valid) {
  // Fix dependency issues
}
```

### Initialization Issues

```typescript
// If auto-init fails, initialize manually
try {
  await manager.initializeTaskmaster();
} catch (error) {
  // Run manually: npx taskmaster-ai init
  console.error('Manual initialization required');
}
```

## Additional Resources

- [API Reference](./README.md#api-reference)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Troubleshooting Guide](./TROUBLESHOOTING.md)
- [Test Plan](./TEST_PLAN.md)
