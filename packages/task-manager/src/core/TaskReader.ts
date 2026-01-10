import * as fs from 'fs';
import * as path from 'path';
import { Task, TasksFile, TaskStatus, TaskPriority, TaskType } from '../types/task';

/**
 * Options for filtering tasks
 */
export interface TaskFilterOptions {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  assignee?: string;
  labels?: string[];
  tag?: string;
  tags?: string[];
  type?: TaskType | TaskType[];
  version?: string;
  search?: string; // Full-text search
}

/**
 * TaskReader - Reads tasks from taskmaster-ai tasks.json file
 */
export class TaskReader {
  private taskmasterDir: string;
  private tasksFilePath: string;

  constructor(projectRoot: string) {
    this.taskmasterDir = path.join(projectRoot, '.taskmaster');
    this.tasksFilePath = path.join(this.taskmasterDir, 'tasks', 'tasks.json');
  }

  /**
   * Read all tasks for a project
   */
  async readTasks(projectName: string): Promise<Task[]> {
    if (!fs.existsSync(this.tasksFilePath)) {
      return [];
    }

    const tasksFile = this.readTasksFile();
    return tasksFile[projectName]?.tasks || [];
  }

  /**
   * Read a specific task by ID
   */
  async readTask(projectName: string, taskId: number | string): Promise<Task | null> {
    const tasks = await this.readTasks(projectName);
    return tasks.find((task) => task.id === taskId) || null;
  }

  /**
   * Read tasks with filters
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
   * Get subtasks for a task
   */
  async readSubtasks(projectName: string, taskId: number | string): Promise<Task['subtasks']> {
    const task = await this.readTask(projectName, taskId);
    return task?.subtasks || [];
  }

  /**
   * Read the entire tasks.json file
   */
  readTasksFile(): TasksFile {
    if (!fs.existsSync(this.tasksFilePath)) {
      return {};
    }

    try {
      const content = fs.readFileSync(this.tasksFilePath, 'utf-8');
      return JSON.parse(content) as TasksFile;
    } catch (error) {
      throw new Error(`Failed to read tasks file: ${error}`);
    }
  }

  /**
   * Check if taskmaster directory exists
   */
  taskmasterExists(): boolean {
    return fs.existsSync(this.taskmasterDir);
  }

  /**
   * Check if tasks.json file exists
   */
  tasksFileExists(): boolean {
    return fs.existsSync(this.tasksFilePath);
  }

  /**
   * Get all project names from tasks.json
   */
  getProjectNames(): string[] {
    const tasksFile = this.readTasksFile();
    return Object.keys(tasksFile);
  }
}
