import { Task } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';

/**
 * Label statistics
 */
export interface LabelStats {
  label: string;
  taskCount: number;
  tasks: Task[];
}

/**
 * LabelManager - Manage task labels
 */
export class LabelManager {
  private reader: TaskReader;
  private writer: TaskWriter;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
  }

  /**
   * Add a label to a task
   */
  async addLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    const labels = task.labels || [];
    if (labels.includes(label)) {
      return; // Label already exists
    }

    await this.writer.updateTask(projectName, taskId, {
      labels: [...labels, label],
    });
  }

  /**
   * Add multiple labels to a task
   */
  async addLabels(
    projectName: string,
    taskId: number | string,
    labels: string[]
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    const existingLabels = task.labels || [];
    const newLabels = labels.filter((label) => !existingLabels.includes(label));

    if (newLabels.length > 0) {
      await this.writer.updateTask(projectName, taskId, {
        labels: [...existingLabels, ...newLabels],
      });
    }
  }

  /**
   * Remove a label from a task
   */
  async removeLabel(
    projectName: string,
    taskId: number | string,
    label: string
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
    }

    const labels = task.labels || [];
    const updatedLabels = labels.filter((l) => l !== label);

    await this.writer.updateTask(projectName, taskId, {
      labels: updatedLabels,
    });
  }

  /**
   * List all labels with task counts
   */
  async listLabels(projectName: string): Promise<LabelStats[]> {
    const tasks = await this.reader.readTasks(projectName);
    const labelMap = new Map<string, Task[]>();

    for (const task of tasks) {
      if (task.labels && task.labels.length > 0) {
        for (const label of task.labels) {
          if (!labelMap.has(label)) {
            labelMap.set(label, []);
          }
          labelMap.get(label)!.push(task);
        }
      }
    }

    return Array.from(labelMap.entries())
      .map(([label, tasks]) => ({
        label,
        taskCount: tasks.length,
        tasks,
      }))
      .sort((a, b) => b.taskCount - a.taskCount);
  }

  /**
   * Get label suggestions based on task content
   */
  async suggestLabels(
    projectName: string,
    taskId: number | string
  ): Promise<string[]> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      return [];
    }

    // Get all existing labels
    const allLabels = await this.listLabels(projectName);
    const existingLabelNames = new Set(allLabels.map((l) => l.label));

    // Simple keyword extraction from title and description
    const text = `${task.title} ${task.description}`.toLowerCase();
    const commonKeywords = [
      'bug',
      'feature',
      'fix',
      'test',
      'documentation',
      'frontend',
      'backend',
      'api',
      'ui',
      'ux',
      'database',
      'security',
      'performance',
      'refactor',
    ];

    const suggestions = commonKeywords.filter(
      (keyword) =>
        text.includes(keyword) && !existingLabelNames.has(keyword) && !task.labels?.includes(keyword)
    );

    return suggestions.slice(0, 5); // Return top 5 suggestions
  }
}
