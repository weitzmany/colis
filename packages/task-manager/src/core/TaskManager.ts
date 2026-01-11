import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { Task, TaskStatus, TaskPriority, TaskType, Subtask } from '../types/task';
import { TaskReader, TaskFilterOptions } from './TaskReader';
import { TaskWriter } from './TaskWriter';
import { TaskValidator, ValidationError } from './TaskValidator';
import { BatchOperations, BatchUpdateOptions, BatchOperationResult } from '../operations/BatchOperations';
import { AssigneeManager, AssigneeStats } from '../operations/AssigneeManager';
import { LabelManager, LabelStats } from '../operations/LabelManager';
import { TagManager, TagStats } from '../operations/TagManager';

/**
 * Options for TaskManager initialization
 */
export interface TaskManagerOptions {
  autoInit?: boolean; // Auto-initialize taskmaster-ai if .taskmaster doesn't exist
}

/**
 * Options for task creation
 */
export interface CreateTaskOptions {
  assignee?: string;
  labels?: string[];
  tag?: string;
  tags?: Array<{ name: string; color?: string }>;
  color?: string;
  type?: TaskType;
  version?: string;
  dueDate?: string;
  startDate?: string;
}

/**
 * Options for task update
 */
export interface UpdateTaskOptions {
  append?: boolean; // Append to details instead of replacing
}

/**
 * TaskManager - Main API class for task management
 */
export class TaskManager {
  private projectRoot: string;
  private reader: TaskReader;
  private writer: TaskWriter;
  private validator: TaskValidator;
  private batchOps: BatchOperations;
  private assigneeManager: AssigneeManager;
  private labelManager: LabelManager;
  private tagManager: TagManager;
  private initialized: boolean = false;

  constructor(projectRoot: string, options: TaskManagerOptions = {}) {
    this.projectRoot = projectRoot;
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
    this.validator = new TaskValidator();
    this.batchOps = new BatchOperations(projectRoot);
    this.assigneeManager = new AssigneeManager(projectRoot);
    this.labelManager = new LabelManager(projectRoot);
    this.tagManager = new TagManager(projectRoot);

    if (options.autoInit !== false) {
      this.initializeTaskmaster();
    }
  }

  /**
   * Initialize taskmaster-ai if not present
   */
  async initializeTaskmaster(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const taskmasterDir = path.join(this.projectRoot, '.taskmaster');

    if (fs.existsSync(taskmasterDir)) {
      // Validate structure
      await this.validateTaskmasterStructure(taskmasterDir);
      this.initialized = true;
      return;
    }

    // Initialize using taskmaster-ai CLI
    try {
      execSync('npx taskmaster-ai init', {
        cwd: this.projectRoot,
        stdio: 'inherit',
      });
      this.initialized = true;
    } catch (error) {
      throw new Error(
        `Failed to initialize taskmaster-ai: ${error}. Run manually: npx taskmaster-ai init`
      );
    }
  }

  /**
   * Validate taskmaster directory structure
   */
  private async validateTaskmasterStructure(taskmasterDir: string): Promise<void> {
    const requiredPaths = [
      path.join(taskmasterDir, 'config.json'),
      path.join(taskmasterDir, 'state.json'),
      path.join(taskmasterDir, 'tasks'),
    ];

    for (const requiredPath of requiredPaths) {
      if (!fs.existsSync(requiredPath)) {
        throw new Error(
          `Invalid taskmaster structure: ${requiredPath} does not exist`
        );
      }
    }
  }

  /**
   * Get all tasks for a project, optionally filtered by criteria
   * 
   * @param projectName - The name of the project to get tasks from
   * @param filters - Optional filter criteria (status, priority, assignee, labels, tags, etc.)
   * @returns Promise resolving to an array of tasks matching the filters
   * 
   * @example
   * ```typescript
   * // Get all tasks
   * const allTasks = await manager.getTasks('my-project');
   * 
   * // Get tasks with filters
   * const highPriorityTasks = await manager.getTasks('my-project', {
   *   status: ['in-progress'],
   *   priority: ['high', 'very high'],
   *   assignee: 'john.doe'
   * });
   * ```
   */
  async getTasks(projectName: string, filters?: TaskFilterOptions): Promise<Task[]> {
    if (filters) {
      return this.reader.readTasksWithFilters(projectName, filters);
    }
    return this.reader.readTasks(projectName);
  }

  /**
   * Get a specific task by ID
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task to retrieve
   * @returns Promise resolving to the task if found, or null if not found
   * 
   * @example
   * ```typescript
   * const task = await manager.getTask('my-project', 'task-123');
   * if (task) {
   *   console.log(task.title);
   * }
   * ```
   */
  async getTask(projectName: string, taskId: number | string): Promise<Task | null> {
    return this.reader.readTask(projectName, taskId);
  }

  /**
   * Get the next available task based on dependencies
   * 
   * Returns the first task that:
   * - Is not completed or cancelled
   * - Has all dependencies completed (or no dependencies)
   * 
   * @param projectName - The name of the project to get the next task from
   * @returns Promise resolving to the next available task, or null if no tasks are available
   * 
   * @example
   * ```typescript
   * const nextTask = await manager.getNextTask('my-project');
   * if (nextTask) {
   *   console.log(`Next task: ${nextTask.title}`);
   * }
   * ```
   */
  async getNextTask(projectName: string): Promise<Task | null> {
    const tasks = await this.reader.readTasks(projectName);
    const completedTaskIds = new Set(
      tasks.filter((t) => t.status === 'done').map((t) => t.id)
    );

    // Find tasks with all dependencies completed
    for (const task of tasks) {
      if (task.status === 'done' || task.status === 'cancelled') {
        continue;
      }

      if (!task.dependencies || task.dependencies.length === 0) {
        return task;
      }

      const allDependenciesDone = task.dependencies.every((depId) =>
        completedTaskIds.has(depId)
      );

      if (allDependenciesDone) {
        return task;
      }
    }

    return null;
  }

  /**
   * Create a new task in the specified project
   * 
   * @param projectName - The name of the project to create the task in
   * @param taskData - Task data including title, description, and optional fields
   * @param options - Additional options for task creation (assignee, labels, tags, etc.)
   * @returns Promise resolving to the created task with generated ID and timestamps
   * @throws {ValidationError} If task data is invalid or dependencies don't exist
   * 
   * @example
   * ```typescript
   * const task = await manager.createTask('my-project', {
   *   title: 'Implement feature X',
   *   description: 'Add new feature to the application',
   *   priority: 'high',
   *   status: 'pending'
   * }, {
   *   assignee: 'john.doe',
   *   labels: ['frontend', 'urgent']
   * });
   * ```
   */
  async createTask(
    projectName: string,
    taskData: {
      title: string;
      description: string;
      details?: string;
      testStrategy?: string | null;
      priority?: TaskPriority;
      status?: TaskStatus;
      dependencies?: (number | string)[];
      assignee?: string;
      labels?: string[];
      tag?: string;
      tags?: Array<{ name: string; color?: string }>;
      color?: string;
      type?: TaskType;
      version?: string;
      dueDate?: string;
      startDate?: string;
    },
    options?: CreateTaskOptions
  ): Promise<Task> {
    // Generate ID if not provided (use timestamp-based string ID)
    const id = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Set defaults
    const task: Task = {
      id,
      title: taskData.title,
      description: taskData.description,
      details: taskData.details,
      testStrategy: taskData.testStrategy ?? null,
      priority: taskData.priority || 'medium',
      status: taskData.status || 'backlog',
      dependencies: taskData.dependencies || [],
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      assignee: taskData.assignee || options?.assignee,
      labels: taskData.labels || options?.labels || [],
      tag: taskData.tag || options?.tag,
      tags: taskData.tags || options?.tags,
      color: taskData.color || options?.color || '#5865F2',
      type: taskData.type || options?.type || 'feature',
      version: taskData.version || options?.version,
      dueDate: taskData.dueDate || options?.dueDate,
      startDate: taskData.startDate || options?.startDate,
    };

    // Validate task
    this.validator.validateTask(task);

    // Validate dependencies exist
    const existingTasks = await this.reader.readTasks(projectName);
    if (task.dependencies && task.dependencies.length > 0) {
      this.validator.validateDependenciesExist(existingTasks, task.dependencies);
    }

    // Write task
    await this.writer.addTask(projectName, task);

    return task;
  }

  /**
   * Update an existing task with partial updates
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task to update
   * @param updates - Partial task data to update
   * @param options - Update options (e.g., append mode for details field)
   * @returns Promise resolving to the updated task
   * @throws {Error} If task is not found
   * @throws {ValidationError} If updated data is invalid or creates dependency cycles
   * 
   * @example
   * ```typescript
   * // Update task status
   * await manager.updateTask('my-project', taskId, {
   *   status: 'in-progress'
   * });
   * 
   * // Append to details field
   * await manager.updateTask('my-project', taskId, {
   *   details: 'Additional information'
   * }, { append: true });
   * ```
   */
  async updateTask(
    projectName: string,
    taskId: number | string,
    updates: Partial<Task>,
    options?: UpdateTaskOptions
  ): Promise<Task> {
    const existingTask = await this.reader.readTask(projectName, taskId);
    if (!existingTask) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    // Handle append mode for details
    if (options?.append && updates.details) {
      updates.details = `${existingTask.details || ''}\n${updates.details}`.trim();
    }

    // Merge updates
    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // Validate updated task
    this.validator.validateTask(updatedTask);

    // Validate dependencies if changed
    if (updates.dependencies) {
      const allTasks = await this.reader.readTasks(projectName);
      this.validator.validateDependencies(allTasks, taskId, updates.dependencies);
      this.validator.validateDependenciesExist(allTasks, updates.dependencies);
    }

    // Write updated task
    await this.writer.updateTask(projectName, taskId, updatedTask);

    return updatedTask;
  }

  /**
   * Delete a task from the project
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task to delete
   * @returns Promise that resolves when the task is deleted
   * @throws {Error} If task is not found or if other tasks depend on it
   * 
   * @example
   * ```typescript
   * await manager.removeTask('my-project', taskId);
   * ```
   */
  async removeTask(projectName: string, taskId: number | string): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    // Check if other tasks depend on this task
    const allTasks = await this.reader.readTasks(projectName);
    const dependentTasks = allTasks.filter(
      (t) => t.dependencies && t.dependencies.includes(taskId)
    );

    if (dependentTasks.length > 0) {
      throw new Error(
        `Cannot delete task ${taskId}: ${dependentTasks.length} task(s) depend on it`
      );
    }

    await this.writer.deleteTask(projectName, taskId);
  }

  /**
   * Add a subtask to an existing task
   * 
   * @param projectName - The name of the project containing the parent task
   * @param taskId - The ID of the parent task
   * @param subtaskData - Subtask data including title and optional fields
   * @returns Promise resolving to the created subtask
   * @throws {Error} If parent task is not found
   * @throws {ValidationError} If subtask data is invalid
   * 
   * @example
   * ```typescript
   * const subtask = await manager.addSubtask('my-project', parentTaskId, {
   *   title: 'Subtask 1',
   *   description: 'First subtask',
   *   status: 'pending'
   * });
   * ```
   */
  async addSubtask(
    projectName: string,
    taskId: number | string,
    subtaskData: {
      title: string;
      description?: string;
      status?: TaskStatus;
    }
  ): Promise<Subtask> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    const subtaskId = `subtask-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const subtask: Subtask = {
      id: subtaskId,
      title: subtaskData.title,
      description: subtaskData.description,
      status: subtaskData.status || 'pending',
      parentId: taskId,
      updatedAt: new Date().toISOString(),
      completed: false,
    };

    // Validate subtask
    this.validator.validateSubtask(subtask, taskId);

    // Add subtask to task
    const updatedSubtasks = [...(task.subtasks || []), subtask];
    await this.writer.updateTask(projectName, taskId, { subtasks: updatedSubtasks });

    return subtask;
  }

  /**
   * Add a dependency relationship between tasks
   * 
   * Task B will depend on Task A, meaning Task B cannot be started until Task A is completed.
   * 
   * @param projectName - The name of the project containing the tasks
   * @param taskId - The ID of the task that will depend on another task
   * @param dependsOnId - The ID of the task that must be completed first
   * @returns Promise that resolves when the dependency is added
   * @throws {Error} If task is not found, if task depends on itself, or if dependency creates a cycle
   * 
   * @example
   * ```typescript
   * // Task B depends on Task A
   * await manager.addDependency('my-project', taskBId, taskAId);
   * ```
   */
  async addDependency(
    projectName: string,
    taskId: number | string,
    dependsOnId: number | string
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    if (taskId === dependsOnId) {
      throw new Error('Task cannot depend on itself');
    }

    const dependencies = task.dependencies || [];
    if (dependencies.includes(dependsOnId)) {
      return; // Already a dependency
    }

    // Validate dependency exists
    const allTasks = await this.reader.readTasks(projectName);
    this.validator.validateDependenciesExist(allTasks, [dependsOnId]);

    // Validate no cycles
    this.validator.validateDependencies(allTasks, taskId, [
      ...dependencies,
      dependsOnId,
    ]);

    await this.writer.updateTask(projectName, taskId, {
      dependencies: [...dependencies, dependsOnId],
    });
  }

  /**
   * Validate all dependencies in a project
   * 
   * Checks for:
   * - Missing dependencies (referenced task doesn't exist)
   * - Circular dependencies (A depends on B, B depends on A)
   * 
   * @param projectName - The name of the project to validate
   * @returns Promise resolving to validation result with valid flag and array of error messages
   * 
   * @example
   * ```typescript
   * const result = await manager.validateDependencies('my-project');
   * if (!result.valid) {
   *   console.error('Dependency errors:', result.errors);
   * }
   * ```
   */
  async validateDependencies(projectName: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const tasks = await this.reader.readTasks(projectName);
    const errors: string[] = [];

    for (const task of tasks) {
      if (task.dependencies && task.dependencies.length > 0) {
        try {
          this.validator.validateDependenciesExist(tasks, task.dependencies);
          this.validator.validateDependencies(tasks, task.id, task.dependencies);
        } catch (error) {
          if (error instanceof ValidationError) {
            errors.push(`Task ${task.id}: ${error.message}`);
          }
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Batch update multiple tasks atomically
   * 
   * Updates multiple tasks with the same changes. If any task fails to update,
   * the operation reports which tasks succeeded and which failed.
   * 
   * @param projectName - The name of the project containing the tasks
   * @param taskIds - Array of task IDs to update
   * @param updates - Update data to apply to all tasks
   * @returns Promise resolving to batch operation result with success/failure counts
   * 
   * @example
   * ```typescript
   * const result = await manager.batchUpdate('my-project', [task1Id, task2Id, task3Id], {
   *   status: 'in-progress',
   *   priority: 'high'
   * });
   * console.log(`Updated ${result.success} tasks, ${result.failed} failed`);
   * ```
   */
  async batchUpdate(
    projectName: string,
    taskIds: (number | string)[],
    updates: BatchUpdateOptions
  ): Promise<BatchOperationResult> {
    return this.batchOps.batchUpdate(projectName, taskIds, updates);
  }

  /**
   * Batch delete multiple tasks atomically
   * 
   * Deletes multiple tasks. If any task fails to delete (e.g., has dependencies),
   * the operation reports which tasks succeeded and which failed.
   * 
   * @param projectName - The name of the project containing the tasks
   * @param taskIds - Array of task IDs to delete
   * @returns Promise resolving to batch operation result with success/failure counts
   * 
   * @example
   * ```typescript
   * const result = await manager.batchDelete('my-project', [task1Id, task2Id]);
   * console.log(`Deleted ${result.success} tasks, ${result.failed} failed`);
   * ```
   */
  async batchDelete(
    projectName: string,
    taskIds: (number | string)[]
  ): Promise<BatchOperationResult> {
    return this.batchOps.batchDelete(projectName, taskIds);
  }

  /**
   * Assign a task to an assignee
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task to assign
   * @param assignee - The assignee identifier (e.g., username, email)
   * @returns Promise that resolves when the task is assigned
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.assignTask('my-project', taskId, 'john.doe');
   * ```
   */
  async assignTask(
    projectName: string,
    taskId: number | string,
    assignee: string
  ): Promise<void> {
    return this.assigneeManager.assignTask(projectName, taskId, assignee);
  }

  /**
   * Unassign a task (remove assignee)
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task to unassign
   * @returns Promise that resolves when the task is unassigned
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.unassignTask('my-project', taskId);
   * ```
   */
  async unassignTask(projectName: string, taskId: number | string): Promise<void> {
    return this.assigneeManager.unassignTask(projectName, taskId);
  }

  /**
   * List all assignees with their task counts and assigned tasks
   * 
   * @param projectName - The name of the project to list assignees from
   * @returns Promise resolving to array of assignee statistics
   * 
   * @example
   * ```typescript
   * const assignees = await manager.listAssignees('my-project');
   * assignees.forEach(stat => {
   *   console.log(`${stat.assignee}: ${stat.count} tasks`);
   * });
   * ```
   */
  async listAssignees(projectName: string): Promise<AssigneeStats[]> {
    return this.assigneeManager.listAssignees(projectName);
  }

  /**
   * Add a single label to a task
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task
   * @param label - The label to add
   * @returns Promise that resolves when the label is added
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.addLabel('my-project', taskId, 'bug');
   * ```
   */
  async addLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    return this.labelManager.addLabel(projectName, taskId, label);
  }

  /**
   * Add multiple labels to a task at once
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task
   * @param labels - Array of labels to add
   * @returns Promise that resolves when the labels are added
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.addLabels('my-project', taskId, ['bug', 'frontend', 'urgent']);
   * ```
   */
  async addLabels(
    projectName: string,
    taskId: number | string,
    labels: string[]
  ): Promise<void> {
    return this.labelManager.addLabels(projectName, taskId, labels);
  }

  /**
   * Remove a label from a task
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task
   * @param label - The label to remove
   * @returns Promise that resolves when the label is removed
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.removeLabel('my-project', taskId, 'bug');
   * ```
   */
  async removeLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    return this.labelManager.removeLabel(projectName, taskId, label);
  }

  /**
   * List all labels used in the project with their task counts
   * 
   * @param projectName - The name of the project to list labels from
   * @returns Promise resolving to array of label statistics
   * 
   * @example
   * ```typescript
   * const labels = await manager.listLabels('my-project');
   * labels.forEach(stat => {
   *   console.log(`${stat.label}: ${stat.count} tasks`);
   * });
   * ```
   */
  async listLabels(projectName: string): Promise<LabelStats[]> {
    return this.labelManager.listLabels(projectName);
  }

  /**
   * Add a single tag to a task (taskmaster-ai style)
   * 
   * Sets the `tag` field on the task. This is compatible with taskmaster-ai's single tag system.
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task
   * @param tag - The tag name to add
   * @returns Promise that resolves when the tag is added
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.addTag('my-project', taskId, 'feature-auth');
   * ```
   */
  async addTag(
    projectName: string,
    taskId: number | string,
    tag: string
  ): Promise<void> {
    return this.tagManager.addTag(projectName, taskId, tag);
  }

  /**
   * Add multiple tags to a task with auto-generated colors (discord-story-bot style)
   * 
   * Adds tags to the `tags` array with auto-generated colors based on tag name hash.
   * This is compatible with discord-story-bot's multiple tags system.
   * 
   * @param projectName - The name of the project containing the task
   * @param taskId - The ID of the task
   * @param tagNames - Array of tag names to add (colors will be auto-generated)
   * @returns Promise that resolves when the tags are added
   * @throws {Error} If task is not found
   * 
   * @example
   * ```typescript
   * await manager.addTags('my-project', taskId, ['sprint-1', 'feature-auth', 'high-priority']);
   * ```
   */
  async addTags(
    projectName: string,
    taskId: number | string,
    tagNames: string[]
  ): Promise<void> {
    return this.tagManager.addTags(projectName, taskId, tagNames);
  }

  /**
   * List all tags used in the project with their task counts and colors
   * 
   * @param projectName - The name of the project to list tags from
   * @returns Promise resolving to array of tag statistics with colors
   * 
   * @example
   * ```typescript
   * const tags = await manager.listTags('my-project');
   * tags.forEach(stat => {
   *   console.log(`${stat.tag} (${stat.color}): ${stat.count} tasks`);
   * });
   * ```
   */
  async listTags(projectName: string): Promise<TagStats[]> {
    return this.tagManager.listTags(projectName);
  }

  /**
   * Migrate single string tags to multiple tags array with colors
   * 
   * Converts tasks with `tag` field (taskmaster-ai style) to `tags` array
   * (discord-story-bot style) with auto-generated colors. This allows migration
   * from single tag to multiple tags system.
   * 
   * @param projectName - The name of the project to migrate tags in
   * @returns Promise that resolves when migration is complete
   * 
   * @example
   * ```typescript
   * await manager.migrateTags('my-project');
   * ```
   */
  async migrateTags(projectName: string): Promise<void> {
    return this.tagManager.migrateTags(projectName);
  }
}
