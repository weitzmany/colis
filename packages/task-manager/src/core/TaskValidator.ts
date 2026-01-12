import { Task, TaskStatus, TaskPriority, TaskType, Subtask } from '../types/task';

/**
 * Validation error thrown when task validation fails.
 * Includes the field name that failed validation for better error reporting.
 */
export class ValidationError extends Error {
  /**
   * Creates a new ValidationError.
   * @param message Human-readable error message describing the validation failure.
   * @param field Optional field name that failed validation (e.g., 'title', 'status', 'dependencies').
   */
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * TaskValidator - Validates task structure and data.
 * 
 * This class provides comprehensive validation for tasks, subtasks, and dependencies.
 * All validation methods throw ValidationError with descriptive messages when validation fails.
 * 
 * @example
 * ```typescript
 * const validator = new TaskValidator();
 * try {
 *   validator.validateTask(task);
 *   console.log('Task is valid');
 * } catch (error) {
 *   if (error instanceof ValidationError) {
 *     console.error(`Validation failed for field "${error.field}": ${error.message}`);
 *   }
 * }
 * ```
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
   * Validate a task structure and all its fields.
   * Checks required fields, field types, valid values, and format constraints.
   * 
   * @param task The task to validate (can be partial for updates).
   * @throws {ValidationError} If any validation check fails, with the field name and error message.
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
   * Validate a subtask structure and its relationship to its parent task.
   * 
   * @param subtask The subtask to validate (can be partial for updates).
   * @param parentId The ID of the parent task (used to validate parentId field).
   * @throws {ValidationError} If any validation check fails, with the field name and error message.
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
   * Validate that adding dependencies doesn't create circular dependencies.
   * Uses depth-first search to detect cycles in the dependency graph.
   * 
   * @param tasks All existing tasks in the project (used to check dependency chains).
   * @param taskId The ID of the task that will have these dependencies.
   * @param dependencies Array of task IDs that the task will depend on.
   * @throws {ValidationError} If a circular dependency is detected or if a task depends on itself.
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
   * Check if all specified dependencies exist in the task list.
   * 
   * @param tasks All existing tasks in the project.
   * @param dependencies Array of task IDs to check for existence.
   * @throws {ValidationError} If any dependency ID doesn't exist in the task list.
   */
  validateDependenciesExist(
    tasks: Task[],
    dependencies: (number | string)[]
  ): void {
    const taskIds = new Set(tasks.map((t) => t.id));

    for (const depId of dependencies) {
      if (!taskIds.has(depId)) {
        const availableIds = Array.from(taskIds).slice(0, 10).join(', ');
        const moreText = taskIds.size > 10 ? ` (and ${taskIds.size - 10} more)` : '';
        throw new ValidationError(
          `Dependency "${depId}" does not exist. Available task IDs: ${availableIds}${moreText}`,
          'dependencies'
        );
      }
    }
  }

  /**
   * Validate that a date string is in valid ISO 8601 format.
   * @param dateString The date string to validate.
   * @returns True if the date is valid ISO format, false otherwise.
   */
  private isValidISODate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime()) && dateString === date.toISOString();
  }
}
