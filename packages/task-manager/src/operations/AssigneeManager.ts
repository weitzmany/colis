import { Task } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';

/**
 * Statistics for an assignee, including task count and list of assigned tasks.
 */
export interface AssigneeStats {
  /** The assignee name/identifier */
  assignee: string;
  /** Number of tasks assigned to this assignee */
  taskCount: number;
  /** Array of all tasks assigned to this assignee */
  tasks: Task[];
}

/**
 * AssigneeManager - Manage task assignments to team members.
 * 
 * Provides methods to assign, unassign, and query tasks by assignee.
 * 
 * @example
 * ```typescript
 * const assigneeManager = new AssigneeManager('/path/to/project');
 * await assigneeManager.assignTask('my-project', 1, 'john@example.com');
 * const stats = await assigneeManager.listAssignees('my-project');
 * ```
 */
export class AssigneeManager {
  private reader: TaskReader;
  private writer: TaskWriter;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
  }

  /**
   * Assign a task to an assignee.
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to assign.
   * @param assignee The assignee identifier (e.g., email, username).
   * @throws {Error} If the task is not found.
   */
  async assignTask(
    projectName: string,
    taskId: number | string,
    assignee: string
  ): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { assignee });
  }

  /**
   * Unassign a task (remove assignee).
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to unassign.
   * @throws {Error} If the task is not found.
   */
  async unassignTask(projectName: string, taskId: number | string): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { assignee: undefined });
  }

  /**
   * List all assignees with their task counts and assigned tasks.
   * Results are sorted by task count (highest first).
   * 
   * @param projectName The name of the project to query.
   * @returns A promise that resolves to an array of assignee statistics.
   */
  async listAssignees(projectName: string): Promise<AssigneeStats[]> {
    const tasks = await this.reader.readTasks(projectName);
    const assigneeMap = new Map<string, Task[]>();

    for (const task of tasks) {
      if (task.assignee) {
        if (!assigneeMap.has(task.assignee)) {
          assigneeMap.set(task.assignee, []);
        }
        assigneeMap.get(task.assignee)!.push(task);
      }
    }

    return Array.from(assigneeMap.entries())
      .map(([assignee, tasks]) => ({
        assignee,
        taskCount: tasks.length,
        tasks,
      }))
      .sort((a, b) => b.taskCount - a.taskCount);
  }

  /**
   * Get all tasks assigned to a specific assignee.
   * @param projectName The name of the project to query.
   * @param assignee The assignee identifier to filter by.
   * @returns A promise that resolves to an array of tasks assigned to the assignee.
   */
  async getTasksForAssignee(
    projectName: string,
    assignee: string
  ): Promise<Task[]> {
    return this.reader.readTasksWithFilters(projectName, { assignee });
  }

  /**
   * Bulk assign multiple tasks to an assignee.
   * @param projectName The name of the project containing the tasks.
   * @param taskIds Array of task IDs to assign.
   * @param assignee The assignee identifier to assign all tasks to.
   * @throws {Error} If any task is not found.
   */
  async bulkAssign(
    projectName: string,
    taskIds: (number | string)[],
    assignee: string
  ): Promise<void> {
    for (const taskId of taskIds) {
      await this.assignTask(projectName, taskId, assignee);
    }
  }
}
