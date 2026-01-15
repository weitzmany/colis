import * as fs from 'fs';
import * as path from 'path';
import { Task, TasksFile, TaskStatus, TaskPriority, TaskType } from '../types/task';

/**
 * Options for filtering tasks when reading from the task file.
 * All filters are optional and can be combined for complex queries.
 */
export interface TaskFilterOptions {
  /** Filter by task status (single status or array of statuses) */
  status?: TaskStatus | TaskStatus[];
  /** Filter by task priority (single priority or array of priorities) */
  priority?: TaskPriority | TaskPriority[];
  /** Filter by assignee name */
  assignee?: string;
  /** Filter by labels (tasks must have at least one matching label) */
  labels?: string[];
  /** Filter by single tag (taskmaster-ai style) */
  tag?: string;
  /** Filter by multiple tags (discord-story-bot style) */
  tags?: string[];
  /** Filter by task type (single type or array of types) */
  type?: TaskType | TaskType[];
  /** Filter by version string */
  version?: string;
  /** Full-text search across title, description, and details */
  search?: string;
}

/**
 * TaskReader - Reads tasks from taskmaster-ai tasks.json file.
 * 
 * This class provides methods to read tasks from the taskmaster-ai file structure.
 * All read operations are non-destructive and return copies of the data.
 * 
 * @example
 * ```typescript
 * const reader = new TaskReader('/path/to/project');
 * const tasks = await reader.readTasks('my-project');
 * const filteredTasks = await reader.readTasksWithFilters('my-project', {
 *   status: 'pending',
 *   priority: 'high'
 * });
 * ```
 */
export class TaskReader {
  private taskmasterDir: string;
  private tasksFilePath: string;

  /**
   * Initializes a new TaskReader instance.
   * @param projectRoot The root directory of the project where .taskmaster files are located.
   */
  constructor(projectRoot: string) {
    this.taskmasterDir = path.join(projectRoot, '.taskmaster');
    this.tasksFilePath = path.join(this.taskmasterDir, 'tasks', 'tasks.json');
  }

  /**
   * Read all tasks for a project.
   * @param projectName The name of the project to read tasks from.
   * @returns A promise that resolves to an array of tasks, or an empty array if no tasks exist.
   */
  async readTasks(projectName: string): Promise<Task[]> {
    if (!fs.existsSync(this.tasksFilePath)) {
      return [];
    }

    const tasksFile = this.readTasksFile();
    return tasksFile[projectName]?.tasks || [];
  }

  /**
   * Read a specific task by ID.
   * @param projectName The name of the project to read from.
   * @param taskId The ID of the task to retrieve.
   * @returns A promise that resolves to the task if found, or null if not found.
   */
  async readTask(projectName: string, taskId: number | string): Promise<Task | null> {
    const tasks = await this.readTasks(projectName);
    return tasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Read tasks with filters applied.
   * Multiple filters can be combined - tasks must match all specified filters.
   * 
   * @param projectName The name of the project to read from.
   * @param filters Filter options to apply to the task list.
   * @returns A promise that resolves to an array of tasks matching the filters.
   * 
   * @example
   * ```typescript
   * // Find all high-priority pending tasks assigned to a specific user
   * const tasks = await reader.readTasksWithFilters('my-project', {
   *   status: 'pending',
   *   priority: 'high',
   *   assignee: 'john@example.com'
   * });
   * ```
   */
  async readTasksWithFilters(
    projectName: string,
    filters: TaskFilterOptions
  ): Promise<Task[]> {
    let tasks = await this.readTasks(projectName);

    // Filter by status
    if (filters.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      tasks = tasks.filter((task) => statuses.includes(task.status));
    }

    // Filter by priority
    if (filters.priority) {
      const priorities = Array.isArray(filters.priority)
        ? filters.priority
        : [filters.priority];
      tasks = tasks.filter((task) => priorities.includes(task.priority));
    }

    // Filter by assignee
    if (filters.assignee) {
      tasks = tasks.filter((task) => task.assignee === filters.assignee);
    }

    // Filter by labels
    if (filters.labels && filters.labels.length > 0) {
      tasks = tasks.filter((task) => {
        if (!task.labels || task.labels.length === 0) return false;
        return filters.labels!.some((label) => task.labels!.includes(label));
      });
    }

    // Filter by tag (taskmaster-ai single tag)
    if (filters.tag) {
      tasks = tasks.filter((task) => task.tag === filters.tag);
    }

    // Filter by tags (discord-story-bot multiple tags)
    if (filters.tags && filters.tags.length > 0) {
      tasks = tasks.filter((task) => {
        if (!task.tags || task.tags.length === 0) return false;
        const taskTagNames = task.tags.map((t) => (typeof t === 'string' ? t : t.name));
        return filters.tags!.some((tag) => taskTagNames.includes(tag));
      });
    }

    // Filter by type
    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      tasks = tasks.filter((task) => task.type && types.includes(task.type));
    }

    // Filter by version
    if (filters.version) {
      tasks = tasks.filter((task) => task.version === filters.version);
    }

    // Full-text search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      tasks = tasks.filter((task) => {
        return (
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower) ||
          (task.details && task.details.toLowerCase().includes(searchLower))
        );
      });
    }

    return tasks;
  }

  /**
   * Get subtasks for a specific task.
   * @param projectName The name of the project.
   * @param taskId The ID of the parent task.
   * @returns A promise that resolves to an array of subtasks, or an empty array if none exist.
   */
  async readSubtasks(projectName: string, taskId: number | string): Promise<Task['subtasks']> {
    const task = await this.readTask(projectName, taskId);
    return task?.subtasks || [];
  }

  /**
   * Read the entire tasks.json file.
   * @returns The complete tasks file structure containing all projects and their tasks.
   * @throws {Error} If the file exists but cannot be read or parsed.
   */
  readTasksFile(): TasksFile {
    if (!fs.existsSync(this.tasksFilePath)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.tasksFilePath, 'utf-8');
      return JSON.parse(content) as TasksFile;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to read tasks file at ${this.tasksFilePath}: ${errorMessage}`);
    }
  }

  /**
   * Check if the taskmaster directory exists.
   * @returns True if the .taskmaster directory exists, false otherwise.
   */
  taskmasterExists(): boolean {
    return fs.existsSync(this.taskmasterDir);
  }

  /**
   * Check if the tasks.json file exists.
   * @returns True if the tasks.json file exists, false otherwise.
   */
  tasksFileExists(): boolean {
    return fs.existsSync(this.tasksFilePath);
  }

  /**
   * Get all project names from the tasks.json file.
   * @returns An array of project names found in the tasks file.
   */
  getProjectNames(): string[] {
    const tasksFile = this.readTasksFile();
    return Object.keys(tasksFile);
  }
}
