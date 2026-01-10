import * as fs from 'fs';
import * as path from 'path';
import { Task, TasksFile } from '../types/task';
import { TaskReader } from './TaskReader';

/**
 * TaskWriter - Writes tasks to taskmaster-ai tasks.json file
 */
export class TaskWriter {
  private taskmasterDir: string;
  private tasksFilePath: string;
  private tasksBackupDir: string;
  private reader: TaskReader;

  constructor(projectRoot: string) {
    this.taskmasterDir = path.join(projectRoot, '.taskmaster');
    this.tasksFilePath = path.join(this.taskmasterDir, 'tasks', 'tasks.json');
    this.tasksBackupDir = path.join(this.taskmasterDir, 'tasks', 'backups');
    this.reader = new TaskReader(projectRoot);
  }

  /**
   * Write tasks for a project (replaces all tasks)
   */
  async writeTasks(projectName: string, tasks: Task[]): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    tasksFile[projectName] = { tasks };

    await this.writeTasksFile(tasksFile);
  }

  /**
   * Add a new task to a project
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
   * Update an existing task
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
      throw new Error(`Project ${projectName} not found`);
    }

    const taskIndex = tasksFile[projectName].tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
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
   * Delete a task
   */
  async deleteTask(projectName: string, taskId: number | string): Promise<void> {
    await this.ensureTasksDirectory();
    await this.backupTasksFile();

    const tasksFile = this.reader.readTasksFile();
    if (!tasksFile[projectName]) {
      throw new Error(`Project ${projectName} not found`);
    }

    const initialLength = tasksFile[projectName].tasks.length;
    tasksFile[projectName].tasks = tasksFile[projectName].tasks.filter(
      (t) => t.id !== taskId
    );

    if (tasksFile[projectName].tasks.length === initialLength) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    await this.writeTasksFile(tasksFile);
  }

  /**
   * Write the entire tasks.json file atomically
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
        fs.unlinkSync(tempFilePath);
      }
      throw new Error(`Failed to write tasks file: ${error}`);
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
      `tasks-${timestamp}.json`
    );

    try {
      fs.copyFileSync(this.tasksFilePath, backupFilePath);

      // Keep only last 10 backups
      this.cleanupOldBackups();
    } catch (error) {
      // Log warning but don't fail the operation
      console.warn(`Failed to create backup: ${error}`);
    }
  }

  /**
   * Clean up old backups, keeping only the last 10
   */
  private cleanupOldBackups(): void {
    if (!fs.existsSync(this.tasksBackupDir)) {
      return;
    }

    const backups = fs
      .readdirSync(this.tasksBackupDir)
      .filter((file) => file.startsWith('tasks-') && file.endsWith('.json'))
      .map((file) => ({
        name: file,
        path: path.join(this.tasksBackupDir, file),
        mtime: fs.statSync(path.join(this.tasksBackupDir, file)).mtime,
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime()); // Newest first

    // Delete backups beyond the last 10
    if (backups.length > 10) {
      for (let i = 10; i < backups.length; i++) {
        try {
          fs.unlinkSync(backups[i].path);
        } catch (error) {
          console.warn(`Failed to delete old backup ${backups[i].name}: ${error}`);
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
