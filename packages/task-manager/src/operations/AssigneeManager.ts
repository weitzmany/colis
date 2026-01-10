import { Task } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';

/**
 * Assignee statistics
 */
export interface AssigneeStats {
  assignee: string;
  taskCount: number;
  tasks: Task[];
}

/**
 * AssigneeManager - Manage task assignments
 */
export class AssigneeManager {
  private reader: TaskReader;
  private writer: TaskWriter;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
  }

  /**
   * Assign a task to an assignee
   */
  async assignTask(
    projectName: string,
    taskId: number | string,
    assignee: string
  ): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { assignee });
  }

  /**
   * Unassign a task
   */
  async unassignTask(projectName: string, taskId: number | string): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { assignee: undefined });
  }

  /**
   * List all assignees with task counts
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
   * Get tasks for a specific assignee
   */
  async getTasksForAssignee(
    projectName: string,
    assignee: string
  ): Promise<Task[]> {
    return this.reader.readTasksWithFilters(projectName, { assignee });
  }

  /**
   * Bulk assign tasks to an assignee
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
