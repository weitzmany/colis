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
   * Get all tasks for a project
   */
  async getTasks(projectName: string, filters?: TaskFilterOptions): Promise<Task[]> {
    if (filters) {
      return this.reader.readTasksWithFilters(projectName, filters);
    }
    return this.reader.readTasks(projectName);
  }

  /**
   * Get a specific task by ID
   */
  async getTask(projectName: string, taskId: number | string): Promise<Task | null> {
    return this.reader.readTask(projectName, taskId);
  }

  /**
   * Get the next available task based on dependencies
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
   * Create a new task
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
   * Update an existing task
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
   * Delete a task
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
   * Add a subtask to a task
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
   * Add a dependency between tasks
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
   * Batch update multiple tasks
   */
  async batchUpdate(
    projectName: string,
    taskIds: (number | string)[],
    updates: BatchUpdateOptions
  ): Promise<BatchOperationResult> {
    return this.batchOps.batchUpdate(projectName, taskIds, updates);
  }

  /**
   * Batch delete multiple tasks
   */
  async batchDelete(
    projectName: string,
    taskIds: (number | string)[]
  ): Promise<BatchOperationResult> {
    return this.batchOps.batchDelete(projectName, taskIds);
  }

  /**
   * Assign a task to an assignee
   */
  async assignTask(
    projectName: string,
    taskId: number | string,
    assignee: string
  ): Promise<void> {
    return this.assigneeManager.assignTask(projectName, taskId, assignee);
  }

  /**
   * Unassign a task
   */
  async unassignTask(projectName: string, taskId: number | string): Promise<void> {
    return this.assigneeManager.unassignTask(projectName, taskId);
  }

  /**
   * List all assignees with task counts
   */
  async listAssignees(projectName: string): Promise<AssigneeStats[]> {
    return this.assigneeManager.listAssignees(projectName);
  }

  /**
   * Add a label to a task
   */
  async addLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    return this.labelManager.addLabel(projectName, taskId, label);
  }

  /**
   * Add multiple labels to a task
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
   */
  async removeLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    return this.labelManager.removeLabel(projectName, taskId, label);
  }

  /**
   * List all labels with task counts
   */
  async listLabels(projectName: string): Promise<LabelStats[]> {
    return this.labelManager.listLabels(projectName);
  }

  /**
   * Add a tag to a task (taskmaster-ai single tag style)
   */
  async addTag(
    projectName: string,
    taskId: number | string,
    tag: string
  ): Promise<void> {
    return this.tagManager.addTag(projectName, taskId, tag);
  }

  /**
   * Add multiple tags to a task (discord-story-bot style with colors)
   */
  async addTags(
    projectName: string,
    taskId: number | string,
    tagNames: string[]
  ): Promise<void> {
    return this.tagManager.addTags(projectName, taskId, tagNames);
  }

  /**
   * List all tags with task counts and colors
   */
  async listTags(projectName: string): Promise<TagStats[]> {
    return this.tagManager.listTags(projectName);
  }

  /**
   * Migrate string tags to objects with colors
   */
  async migrateTags(projectName: string): Promise<void> {
    return this.tagManager.migrateTags(projectName);
  }
}
