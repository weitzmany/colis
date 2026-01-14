# @your-org/task-manager

Task management package for reading and managing tasks from taskmaster-ai.

## Installation

```bash
npm install @your-org/task-manager
```

The package automatically initializes taskmaster-ai when installed (via postinstall script).

## Features

- **Full CRUD Operations**: Create, read, update, delete tasks and subtasks
- **Batch Operations**: Batch update/delete multiple tasks atomically
- **Task Filtering**: Multi-criteria filtering (status, priority, assignee, labels, tags)
- **Assignee Management**: Assign tasks to team members
- **Label Management**: Add flexible labels to tasks
- **Tag Management**: Support for both taskmaster-ai single tags and multiple tags with auto-generated colors
- **Dependency Management**: Task dependencies with cycle detection
- **Validation**: Comprehensive task validation
- **Type Safety**: Full TypeScript support

## Quick Start

```typescript
import { TaskManager } from '@your-org/task-manager';

// Initialize TaskManager (auto-initializes taskmaster-ai if needed)
const manager = new TaskManager('/path/to/project', {
  autoInit: true
});

// Create a task
const task = await manager.createTask('my-project', {
  title: 'Implement feature X',
  description: 'Add new feature to the application',
  priority: 'high',
  status: 'pending'
});

// Get tasks
const tasks = await manager.getTasks('my-project');
const task = await manager.getTask('my-project', task.id);

// Update task
await manager.updateTask('my-project', task.id, {
  status: 'in-progress'
});

// Assign task
await manager.assignTask('my-project', task.id, 'john.doe');

// Add labels
await manager.addLabels('my-project', task.id, ['bug', 'frontend']);

// Add tags
await manager.addTags('my-project', task.id, ['feature-auth', 'sprint-1']);

// Batch operations
await manager.batchUpdate('my-project', [task.id, task2.id], {
  status: 'in-progress',
  priority: 'high'
});

// Filter tasks
const filteredTasks = await manager.getTasks('my-project', {
  status: ['in-progress', 'testing'],
  assignee: 'john.doe',
  labels: ['bug']
});
```

## API Reference

### TaskManager

Main class for task management operations.

#### Constructor

```typescript
new TaskManager(projectRoot: string, options?: TaskManagerOptions)
```

- `projectRoot`: Path to project root directory
- `options.autoInit`: Auto-initialize taskmaster-ai if `.taskmaster` doesn't exist (default: `true`)

#### Methods

##### Task CRUD

- `getTasks(projectName: string, filters?: TaskFilterOptions): Promise<Task[]>`
- `getTask(projectName: string, taskId: number | string): Promise<Task | null>`
- `getNextTask(projectName: string): Promise<Task | null>`
- `createTask(projectName: string, taskData: CreateTaskInput, options?: CreateTaskOptions): Promise<Task>`
- `updateTask(projectName: string, taskId: number | string, updates: Partial<Task>, options?: UpdateTaskOptions): Promise<Task>`
- `removeTask(projectName: string, taskId: number | string): Promise<void>`

##### Subtasks

- `addSubtask(projectName: string, taskId: number | string, subtaskData: SubtaskInput): Promise<Subtask>`

##### Dependencies

- `addDependency(projectName: string, taskId: number | string, dependsOnId: number | string): Promise<void>`
- `validateDependencies(projectName: string): Promise<{ valid: boolean; errors: string[] }>`

##### Batch Operations

- `batchUpdate(projectName: string, taskIds: (number | string)[], updates: BatchUpdateOptions): Promise<BatchOperationResult>`
- `batchDelete(projectName: string, taskIds: (number | string)[]): Promise<BatchOperationResult>`

##### Assignee Management

- `assignTask(projectName: string, taskId: number | string, assignee: string): Promise<void>`
- `unassignTask(projectName: string, taskId: number | string): Promise<void>`
- `listAssignees(projectName: string): Promise<AssigneeStats[]>`

##### Label Management

- `addLabel(projectName: string, taskId: number | string, label: string): Promise<void>`
- `addLabels(projectName: string, taskId: number | string, labels: string[]): Promise<void>`
- `removeLabel(projectName: string, taskId: number | string, label: string): Promise<void>`
- `listLabels(projectName: string): Promise<LabelStats[]>`

##### Tag Management

- `addTag(projectName: string, taskId: number | string, tag: string): Promise<void>`
- `addTags(projectName: string, taskId: number | string, tagNames: string[]): Promise<void>`
- `listTags(projectName: string): Promise<TagStats[]>`
- `migrateTags(projectName: string): Promise<void>`

## Task Structure

Tasks follow the taskmaster-ai format with extensions:

```typescript
interface Task {
  id: number | string;
  title: string;
  description: string;
  details?: string;
  testStrategy?: string | null;
  priority: TaskPriority; // 'very low' | 'low' | 'medium' | 'high' | 'very high'
  status: TaskStatus; // 'pending' | 'in-progress' | 'done' | ...
  dependencies?: (number | string)[];
  subtasks?: Subtask[];
  updatedAt: string; // ISO timestamp
  createdAt?: string; // ISO timestamp
  
  // Extensions
  assignee?: string;
  labels?: string[];
  tag?: string; // taskmaster-ai single tag
  tags?: Tag[]; // discord-story-bot multiple tags with colors
  color?: string;
  type?: TaskType; // 'feature' | 'bug' | 'fix' | ...
  version?: string;
  
  // Time management (future)
  dueDate?: string;
  startDate?: string;
  
  // Collaboration (future)
  comments?: Comment[];
  attachments?: Attachment[];
}
```

## Integration with taskmaster-ai

This package works alongside taskmaster-ai:

- Reads from `.taskmaster/tasks/tasks.json`
- Reads `.taskmaster/config.json` for configuration
- Reads `.taskmaster/state.json` for current tag/branch mapping
- Auto-initializes taskmaster-ai if not present

## Documentation

- **[User Guide](./USER_GUIDE.md)** - Complete user guide with examples and best practices
- **[Migration Guide](./MIGRATION_GUIDE.md)** - Guide for migrating from other systems
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Workflow Guide](../../docs/features/task-manager/WORKFLOW.md)** - Detailed workflow guide

## Development

### Building

```bash
npm run build
```

### Type Checking

```bash
npm run typecheck
```

### Testing

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Formatting

```bash
npm run format
npm run format:check
```

## Manual Testing

Comprehensive manual test documentation is available:

- **[TEST_PLAN.md](./TEST_PLAN.md)** - Detailed test plan with 50+ test cases
- **[QUICK_TEST_CHECKLIST.md](./QUICK_TEST_CHECKLIST.md)** - Quick 5-minute test checklist
- **[TEST_CHEATSHEET.md](./TEST_CHEATSHEET.md)** - One-page quick reference

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run build && npm run typecheck && npm test`
6. Submit a pull request

## License

MIT
