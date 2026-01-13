import * as fs from 'fs';
import * as path from 'path';
import { Task, TasksFile } from '../types/task';
import { TaskReader } from './TaskReader';

/**
 * TaskWriter - Writes tasks to taskmaster-ai tasks.json file.
 * 
 * This class provides methods to write tasks to the taskmaster-ai file structure.
 * All write operations are atomic (using temporary files and rename) and create
 * automatic backups before modifying the file.
 * 
 * @example
 * ```typescript
 * const writer = new TaskWriter('/path/to/project');
 * await writer.addTask('my-project', newTask);
 * await writer.updateTask('my-project', taskId, { status: 'done' });
 * ```
 */
export class TaskWriter {
  private static readonly MAX_BACKUPS = 10;
  private static readonly BACKUP_FILE_PREFIX = 'tasks-';
  private static readonly BACKUP_FILE_SUFFIX = '.json';

  private taskmasterDir: string;
  private tasksFilePath: string;
  private tasksBackupDir: string;
  private reader: TaskReader;

  /**
   * Initializes a new TaskWriter instance.
   * @param projectRoot The root directory of the project where .taskmaster files are located.
   */
  constructor(projectRoot: string) {
    this.taskmasterDir = path.join(projectRoot, '.taskmaster');
    this.tasksFilePath = path.join(this.taskmasterDir, 'tasks', 'tasks.json');
    this.tasksBackupDir = path.join(this.taskmasterDir, 'tasks', 'backups');
    this.reader = new TaskReader(projectRoot);
  }

  /**
   * Write tasks for a project (replaces all tasks).
   * This operation creates a backup before writing and uses atomic file operations.
   * 
   * @param projectName The name of the project to write tasks for.
   * @param tasks The complete array of tasks to write (replaces existing tasks).
   * @throws {Error} If the file cannot be written.
   */
  async writeTasks(projectName: string, tasks: Task[]): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    tasksFile[projectName] = { tasks };

    await this.writeTasksFile(tasksFile);
  }

  /**
   * Add a new task to a project.
   * Creates the project if it doesn't exist.
   * 
   * @param projectName The name of the project to add the task to.
   * @param task The task to add.
   * @throws {Error} If the file cannot be written.
   */
  async addTask(projectName: string, task: Task): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    if (!tasksFile[projectName]) {
      tasksFile[projectName] = { tasks: [] };
    }

    tasksFile[projectName].tasks.push(task);
    await this.writeTasksFile(tasksFile);
  }

  /**
   * Update an existing task with partial updates.
   * Automatically updates the `updatedAt` timestamp.
   * 
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to update.
   * @param updates Partial task object containing fields to update.
   * @throws {Error} If the project or task is not found, or if the file cannot be written.
   */
  async updateTask(
    projectName: string,
    taskId: number | string,
    updates: Partial<Task>
  ): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    if (!tasksFile[projectName]) {
      throw new Error(`Project "${projectName}" not found. Available projects: ${Object.keys(tasksFile).join(', ') || 'none'}`);
    }

    const taskIndex = tasksFile[projectName].tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      const availableIds = tasksFile[projectName].tasks.map(t => t.id).join(', ');
      throw new Error(`Task with ID "${taskId}" not found in project "${projectName}". Available task IDs: ${availableIds || 'none'}`);
    }

    // Update task with new values
    tasksFile[projectName].tasks[taskIndex] = {
      ...tasksFile[projectName].tasks[taskIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.writeTasksFile(tasksFile);
  }

  /**
   * Delete a task from a project.
   * 
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to delete.
   * @throws {Error} If the project or task is not found, or if the file cannot be written.
   */
  async deleteTask(projectName: string, taskId: number | string): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    if (!tasksFile[projectName]) {
      throw new Error(`Project "${projectName}" not found. Available projects: ${Object.keys(tasksFile).join(', ') || 'none'}`);
    }

    const initialLength = tasksFile[projectName].tasks.length;
    tasksFile[projectName].tasks = tasksFile[projectName].tasks.filter(
      (t) => t.id !== taskId
    );

    if (tasksFile[projectName].tasks.length === initialLength) {
      const availableIds = tasksFile[projectName].tasks.map(t => t.id).join(', ');
      throw new Error(`Task with ID "${taskId}" not found in project "${projectName}". Available task IDs: ${availableIds || 'none'}`);
    }

    await this.writeTasksFile(tasksFile);
  }

  /**
   * Write the entire tasks.json file atomically.
   * Uses a temporary file and rename operation to ensure atomic writes.
   * 
   * @param tasksFile The complete tasks file structure to write.
   * @throws {Error} If the file cannot be written.
   */
  private async writeTasksFile(tasksFile: TasksFile): Promise<void> {
    // Atomic write: write to temp file first, then rename
    const tempFilePath = `${this.tasksFilePath}.tmp`;
    const content = JSON.stringify(tasksFile, null, 2);

    try {
      // Write to temp file
      fs.writeFileSync(tempFilePath, content, 'utf-8');

      // Rename temp file to actual file (atomic operation)
      fs.renameSync(tempFilePath, this.tasksFilePath);
    } catch (error) {
      // Clean up temp file if it exists
      if (fs.existsSync(tempFilePath)) {
        try {
          fs.unlinkSync(tempFilePath);
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to write tasks file at ${this.tasksFilePath}: ${errorMessage}`);
    }
  }

  /**
   * Backup the tasks.json file before writing
   */
  private async backupTasksFile(): Promise<void> {
    if (!fs.existsSync(this.tasksFilePath)) {
      return; // No file to backup
    }

    // Ensure backup directory exists
    if (!fs.existsSync(this.tasksBackupDir)) {
      fs.mkdirSync(this.tasksBackupDir, { recursive: true });
    }

    // Create backup with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(
      this.tasksBackupDir,
      `${TaskWriter.BACKUP_FILE_PREFIX}${timestamp}${TaskWriter.BACKUP_FILE_SUFFIX}`
    );

    try {
      fs.copyFileSync(this.tasksFilePath, backupFilePath);

      // Keep only last MAX_BACKUPS backups
      this.cleanupOldBackups();
    } catch (error) {
      // Log warning but don't fail the operation
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Failed to create backup: ${errorMessage}`);
    }
  }

  /**
   * Clean up old backups, keeping only the last MAX_BACKUPS
   */
  private cleanupOldBackups(): void {
    if (!fs.existsSync(this.tasksBackupDir)) {
      return;
    }

    const backups = fs
      .readdirSync(this.tasksBackupDir)
      .filter(
        (file) =>
          file.startsWith(TaskWriter.BACKUP_FILE_PREFIX) &&
          file.endsWith(TaskWriter.BACKUP_FILE_SUFFIX)
      )
      .map((file) => ({
        name: file,
        path: path.join(this.tasksBackupDir, file),
        mtime: fs.statSync(path.join(this.tasksBackupDir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // Newest first

    // Delete backups beyond the last MAX_BACKUPS
    if (backups.length > TaskWriter.MAX_BACKUPS) {
      for (let i = TaskWriter.MAX_BACKUPS; i < backups.length; i++) {
        try {
          fs.unlinkSync(backups[i].path);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.warn(`Failed to delete old backup ${backups[i].name}: ${errorMessage}`);
        }
      }
    }
  }

  /**
   * Ensure tasks directory exists
   */
  private async ensureTasksDirectory(): Promise<void> {
    const tasksDir = path.dirname(this.tasksFilePath);
    if (!fs.existsSync(tasksDir)) {
      fs.mkdirSync(tasksDir, { recursive: true });
    }
  }
}
