import { Task, TaskStatus, TaskPriority, TaskType, Subtask } from '../types/task';

/**
 * Validation error
 */
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * TaskValidator - Validates task structure and data
 */
export class TaskValidator {
  private readonly VALID_STATUSES: TaskStatus[] = [
    'pending',
    'in-progress',
    'done',
    'deferred',
    'cancelled',
    'blocked',
    'review',
    'backlog',
    'to do',
    'in progress',
    'testing',
    'next release',
    'archive',
  ];

  private readonly VALID_PRIORITIES: TaskPriority[] = [
    'very low',
    'low',
    'medium',
    'high',
    'very high',
  ];

  private readonly VALID_TYPES: TaskType[] = [
    'feature',
    'bug',
    'fix',
    'test',
    'research',
    'prd',
    'documents',
  ];

  /**
   * Validate a task
   */
  validateTask(task: Partial<Task>): void {
    // Required fields
    if (!task.id && task.id !== 0) {
      throw new ValidationError('Task ID is required', 'id');
    }

    if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
      throw new ValidationError('Task title is required and must be non-empty', 'title');
    }

    if (!task.description || typeof task.description !== 'string') {
      throw new ValidationError('Task description is required', 'description');
    }

    if (!task.priority) {
      throw new ValidationError('Task priority is required', 'priority');
    }

    if (!task.status) {
      throw new ValidationError('Task status is required', 'status');
    }

    if (!task.updatedAt || typeof task.updatedAt !== 'string') {
      throw new ValidationError('Task updatedAt timestamp is required', 'updatedAt');
    }

    // Validate status
    if (!this.VALID_STATUSES.includes(task.status)) {
      throw new ValidationError(
        `Invalid task status: ${task.status}. Valid statuses: ${this.VALID_STATUSES.join(', ')}`,
        'status'
      );
    }

    // Validate priority
    if (!this.VALID_PRIORITIES.includes(task.priority)) {
      throw new ValidationError(
        `Invalid task priority: ${task.priority}. Valid priorities: ${this.VALID_PRIORITIES.join(', ')}`,
        'priority'
      );
    }

    // Validate type if provided
    if (task.type && !this.VALID_TYPES.includes(task.type)) {
      throw new ValidationError(
        `Invalid task type: ${task.type}. Valid types: ${this.VALID_TYPES.join(', ')}`,
        'type'
      );
    }

    // Validate version format if provided (semver-like: x.y.z or x.y)
    if (task.version && typeof task.version === 'string') {
      const versionPattern = /^\d+\.\d+(\.\d+)?$/;
      if (!versionPattern.test(task.version)) {
        throw new ValidationError(
          `Invalid version format: ${task.version}. Expected format: x.y or x.y.z`,
          'version'
        );
      }
    }

    // Validate color format if provided (hex color)
    if (task.color && typeof task.color === 'string') {
      const colorPattern = /^#[0-9A-Fa-f]{6}$/;
      if (!colorPattern.test(task.color)) {
        throw new ValidationError(
          `Invalid color format: ${task.color}. Expected hex color format: #RRGGBB`,
          'color'
        );
      }
    }

    // Validate dependencies are arrays
    if (task.dependencies && !Array.isArray(task.dependencies)) {
      throw new ValidationError('Task dependencies must be an array', 'dependencies');
    }

    // Validate labels are arrays
    if (task.labels && !Array.isArray(task.labels)) {
      throw new ValidationError('Task labels must be an array', 'labels');
    }

    // Validate tags structure
    if (task.tags && Array.isArray(task.tags)) {
      for (const tag of task.tags) {
        if (typeof tag === 'string') {
          // String tags are valid
          continue;
        } else if (typeof tag === 'object' && tag !== null) {
          if (!tag.name || typeof tag.name !== 'string') {
            throw new ValidationError('Tag must have a name property', 'tags');
          }
          if (tag.color && typeof tag.color !== 'string') {
            throw new ValidationError('Tag color must be a string', 'tags');
          }
        } else {
          throw new ValidationError('Tag must be a string or object with name property', 'tags');
        }
      }
    }

    // Validate subtasks if provided
    if (task.subtasks && Array.isArray(task.subtasks)) {
      for (const subtask of task.subtasks) {
        this.validateSubtask(subtask, task.id!);
      }
    }

    // Validate dates are ISO format
    if (task.createdAt && !this.isValidISODate(task.createdAt)) {
      throw new ValidationError('createdAt must be a valid ISO date string', 'createdAt');
    }

    if (task.updatedAt && !this.isValidISODate(task.updatedAt)) {
      throw new ValidationError('updatedAt must be a valid ISO date string', 'updatedAt');
    }

    if (task.dueDate && !this.isValidISODate(task.dueDate)) {
      throw new ValidationError('dueDate must be a valid ISO date string', 'dueDate');
    }

    if (task.startDate && !this.isValidISODate(task.startDate)) {
      throw new ValidationError('startDate must be a valid ISO date string', 'startDate');
    }
  }

  /**
   * Validate a subtask
   */
  validateSubtask(subtask: Partial<Subtask>, parentId: number | string): void {
    if (!subtask.id && subtask.id !== 0) {
      throw new ValidationError('Subtask ID is required', 'subtask.id');
    }

    if (!subtask.title || typeof subtask.title !== 'string' || subtask.title.trim() === '') {
      throw new ValidationError('Subtask title is required and must be non-empty', 'subtask.title');
    }

    if (subtask.parentId !== undefined && subtask.parentId !== parentId) {
      throw new ValidationError(
        `Subtask parentId (${subtask.parentId}) does not match parent task ID (${parentId})`,
        'subtask.parentId'
      );
    }

    if (subtask.status && !this.VALID_STATUSES.includes(subtask.status)) {
      throw new ValidationError(
        `Invalid subtask status: ${subtask.status}. Valid statuses: ${this.VALID_STATUSES.join(', ')}`,
        'subtask.status'
      );
    }

    if (subtask.updatedAt && !this.isValidISODate(subtask.updatedAt)) {
      throw new ValidationError('Subtask updatedAt must be a valid ISO date string', 'subtask.updatedAt');
    }
  }

  /**
   * Validate dependencies don't create cycles
   */
  validateDependencies(
    tasks: Task[],
    taskId: number | string,
    dependencies: (number | string)[]
  ): void {
    const visited = new Set<number | string>();
    const recursionStack = new Set<number | string>();

    const hasCycle = (id: number | string): boolean => {
      if (recursionStack.has(id)) {
        return true; // Cycle detected
      }

      if (visited.has(id)) {
        return false; // Already processed
      }

      visited.add(id);
      recursionStack.add(id);

      const task = tasks.find((t) => t.id === id);
      if (task && task.dependencies) {
        for (const depId of task.dependencies) {
          if (hasCycle(depId)) {
            return true;
          }
        }
      }

      recursionStack.delete(id);
      return false;
    };

    // Check if adding these dependencies creates a cycle
    for (const depId of dependencies) {
      if (depId === taskId) {
        throw new ValidationError('Task cannot depend on itself', 'dependencies');
      }

      // Temporarily add the dependency to check for cycles
      const tempTask: Task = {
        id: taskId,
        title: '',
        description: '',
        priority: 'medium',
        status: 'pending',
        updatedAt: new Date().toISOString(),
        dependencies: dependencies,
      };

      const tempTasks = [...tasks, tempTask];
      if (hasCycle(taskId)) {
        throw new ValidationError(
          `Adding dependency ${depId} creates a circular dependency`,
          'dependencies'
        );
      }
    }
  }

  /**
   * Check if all dependencies exist
   */
  validateDependenciesExist(
    tasks: Task[],
    dependencies: (number | string)[]
  ): void {
    const taskIds = new Set(tasks.map((t) => t.id));

    for (const depId of dependencies) {
      if (!taskIds.has(depId)) {
        throw new ValidationError(`Dependency ${depId} does not exist`, 'dependencies');
      }
    }
  }

  /**
   * Validate ISO date string
   */
  private isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString();
  }
}
