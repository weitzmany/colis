# Task Manager - Migration Guide

Guide for migrating from other task management systems or upgrading from previous versions.

## Table of Contents

1. [Migrating from taskmaster-ai CLI](#migrating-from-taskmaster-ai-cli)
2. [Migrating from Other Systems](#migrating-from-other-systems)
3. [Upgrading Between Versions](#upgrading-between-versions)
4. [Data Migration](#data-migration)

## Migrating from taskmaster-ai CLI

If you're currently using taskmaster-ai CLI commands and want to use the programmatic API:

### Before (CLI)

```bash
# Using CLI commands
task-master list
task-master add-task "New task"
task-master set-status --id=1 --status=done
```

### After (Programmatic API)

```typescript
import { TaskManager } from '@colis/deck';

const manager = new TaskManager('/path/to/project');

// List tasks
const tasks = await manager.getTasks('my-project');

// Add task
await manager.createTask('my-project', {
  title: 'New task',
  description: '',
  priority: 'medium',
  status: 'pending'
});

// Update status
await manager.updateTask('my-project', 1, {
  status: 'done'
});
```

### Key Differences

1. **Project Names**: The API requires explicit project names, while CLI uses current tag context
2. **Async Operations**: All API methods are async (return Promises)
3. **Type Safety**: Full TypeScript support with type checking
4. **Error Handling**: Errors are thrown as exceptions, not returned as exit codes

## Migrating from Other Systems

### From Jira/Trello/Asana

If you're migrating from a different task management system:

#### 1. Export Your Data

Export tasks from your current system in JSON format:

```json
{
  "tasks": [
    {
      "id": "TASK-1",
      "title": "Task title",
      "description": "Task description",
      "status": "in-progress",
      "priority": "high",
      "assignee": "john.doe",
      "labels": ["bug", "frontend"],
      "dueDate": "2026-01-15T00:00:00Z"
    }
  ]
}
```

#### 2. Map Fields

Map your system's fields to Task Manager fields:

```typescript
interface ExternalTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  assignee?: string;
  labels?: string[];
  dueDate?: string;
}

function mapToTaskManager(externalTask: ExternalTask) {
  return {
    title: externalTask.title,
    description: externalTask.description,
    status: mapStatus(externalTask.status),
    priority: mapPriority(externalTask.priority),
    assignee: externalTask.assignee,
    labels: externalTask.labels,
    dueDate: externalTask.dueDate
  };
}

function mapStatus(status: string): TaskStatus {
  const statusMap: Record<string, TaskStatus> = {
    'todo': 'pending',
    'in-progress': 'in-progress',
    'done': 'done',
    'blocked': 'blocked'
  };
  return statusMap[status] || 'pending';
}

function mapPriority(priority: string): TaskPriority {
  const priorityMap: Record<string, TaskPriority> = {
    'lowest': 'very low',
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'highest': 'very high'
  };
  return priorityMap[priority] || 'medium';
}
```

#### 3. Import Tasks

```typescript
import { TaskManager } from '@colis/deck';
import * as fs from 'fs';

const manager = new TaskManager('/path/to/project');
const externalData = JSON.parse(fs.readFileSync('exported-tasks.json', 'utf-8'));

for (const externalTask of externalData.tasks) {
  const taskData = mapToTaskManager(externalTask);
  await manager.createTask('my-project', taskData, {
    assignee: externalTask.assignee,
    labels: externalTask.labels
  });
}
```

### From Simple Todo Lists

If you're migrating from a simple todo list (text file, spreadsheet, etc.):

#### 1. Parse Your Data

```typescript
// Example: Parse from markdown file
const markdown = `
- [ ] Task 1
- [x] Task 2 (done)
- [ ] Task 3 (high priority)
`;

const tasks = parseMarkdownTodos(markdown);
```

#### 2. Create Tasks

```typescript
for (const todo of tasks) {
  await manager.createTask('my-project', {
    title: todo.title,
    description: '',
    priority: todo.priority || 'medium',
    status: todo.completed ? 'done' : 'pending'
  });
}
```

## Upgrading Between Versions

### Version 1.0.0 to Future Versions

When upgrading to newer versions:

#### 1. Backup Your Data

```bash
# Backup tasks.json
cp .taskmaster/tasks/tasks.json .taskmaster/tasks/tasks.json.backup
```

#### 2. Check Breaking Changes

Review the CHANGELOG.md for breaking changes:

```typescript
// Example: API change in future version
// Before
await manager.updateTask(projectName, taskId, updates);

// After (if API changes)
await manager.updateTask(projectName, taskId, updates, options);
```

#### 3. Run Migration Scripts

If the new version includes migration scripts:

```bash
npm run migrate
```

#### 4. Verify Data Integrity

```typescript
// Validate all tasks
const validation = await manager.validateDependencies('my-project');
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

## Data Migration

### Migrating Tags

If you have string tags and want to migrate to tag objects with colors:

```typescript
// Automatically migrate all tags
await manager.migrateTags('my-project');
```

This will:
- Convert `tag: "sprint-1"` to `tags: [{ name: "sprint-1", color: "#abc123" }]`
- Convert string arrays to tag objects
- Generate colors automatically using DJB2 hash algorithm

### Migrating Subtasks

If you need to migrate subtask structures:

```typescript
// Read all tasks
const tasks = await manager.getTasks('my-project');

for (const task of tasks) {
  if (task.subtasks && needsMigration(task.subtasks)) {
    // Migrate subtask structure
    const migratedSubtasks = migrateSubtasks(task.subtasks);
    
    await manager.updateTask('my-project', task.id, {
      subtasks: migratedSubtasks
    });
  }
}
```

### Preserving Metadata

When migrating, preserve important metadata:

```typescript
// Preserve creation dates
const task = await manager.createTask('my-project', {
  title: externalTask.title,
  description: externalTask.description,
  priority: externalTask.priority,
  status: externalTask.status,
  createdAt: externalTask.createdAt, // Preserve original date
  updatedAt: externalTask.updatedAt
});
```

## Common Migration Scenarios

### Scenario 1: Migrating from GitHub Issues

```typescript
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const issues = await octokit.issues.listForRepo({
  owner: 'your-org',
  repo: 'your-repo'
});

for (const issue of issues.data) {
  await manager.createTask('my-project', {
    title: issue.title,
    description: issue.body || '',
    priority: issue.labels.some(l => l.name === 'priority:high') ? 'high' : 'medium',
    status: issue.state === 'open' ? 'pending' : 'done'
  }, {
    assignee: issue.assignee?.login,
    labels: issue.labels.map(l => l.name)
  });
}
```

### Scenario 2: Migrating from Linear

```typescript
// Linear API example
const linearIssues = await linearClient.issues();

for (const issue of linearIssues.nodes) {
  await manager.createTask('my-project', {
    title: issue.title,
    description: issue.description || '',
    priority: mapLinearPriority(issue.priority),
    status: mapLinearStatus(issue.state)
  }, {
    assignee: issue.assignee?.email,
    labels: issue.labels.nodes.map(l => l.name)
  });
}
```

## Troubleshooting Migration

### Issue: Task IDs Conflict

If you have ID conflicts:

```typescript
// Use string IDs instead of numbers
const task = await manager.createTask('my-project', {
  id: `task-${Date.now()}`, // Use string ID
  title: 'Task title',
  // ...
});
```

### Issue: Dependencies Lost

If dependencies are lost during migration:

```typescript
// Rebuild dependencies after migration
const tasks = await manager.getTasks('my-project');
const dependencyMap = buildDependencyMap(externalData);

for (const [taskId, dependsOn] of Object.entries(dependencyMap)) {
  await manager.addDependency('my-project', taskId, dependsOn);
}
```

## Best Practices

1. **Always Backup**: Backup your data before migration
2. **Test Migration**: Test on a small subset first
3. **Validate Data**: Validate all tasks after migration
4. **Preserve Metadata**: Keep important metadata (dates, IDs, etc.)
5. **Document Mapping**: Document your field mappings for future reference

## Getting Help

If you encounter issues during migration:

1. Check [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review [API Reference](./README.md#api-reference)
3. Check [GitHub Issues](https://github.com/your-org/packages/issues)
