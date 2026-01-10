import { Task } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';
import { TaskValidator } from '../core/TaskValidator';

/**
 * Options for batch update
 */
export interface BatchUpdateOptions {
  status?: Task['status'];
  type?: Task['type'];
  priority?: Task['priority'];
  color?: string;
  tags?: {
    add?: string[]; // Add tags (merge with existing)
  };
  markSubtasksDone?: boolean; // Mark all subtasks as done
}

/**
 * Result of a batch operation
 */
export interface BatchOperationResult {
  success: number;
  failed: number;
  errors: Array<{ taskId: number | string; error: string }>;
}

/**
 * BatchOperations - Handle batch updates and deletes
 */
export class BatchOperations {
  private reader: TaskReader;
  private writer: TaskWriter;
  private validator: TaskValidator;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
    this.validator = new TaskValidator();
  }

  /**
   * Batch update multiple tasks
   */
  async batchUpdate(
    projectName: string,
    taskIds: (number | string)[],
    updates: BatchUpdateOptions
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Validate all tasks exist before starting
    const allTasks = await this.reader.readTasks(projectName);
    const taskMap = new Map(allTasks.map((t) => [t.id, t]));

    for (const taskId of taskIds) {
      const task = taskMap.get(taskId);
      if (!task) {
        result.failed++;
        result.errors.push({
          taskId,
          error: `Task ${taskId} not found`,
        });
        continue;
      }

      try {
        // Prepare update object
        const updateData: Partial<Task> = {};

        if (updates.status !== undefined) {
          updateData.status = updates.status;
        }

        if (updates.type !== undefined) {
          updateData.type = updates.type;
        }

        if (updates.priority !== undefined) {
          updateData.priority = updates.priority;
        }

        if (updates.color !== undefined) {
          updateData.color = updates.color;
        }

        // Handle tags (add only, merge with existing)
        if (updates.tags?.add && updates.tags.add.length > 0) {
          const existingTags = task.tags || [];
          const existingTagNames = existingTags.map((t) =>
            typeof t === 'string' ? t : t.name
          );

          const newTags = updates.tags.add
            .filter((tagName) => !existingTagNames.includes(tagName))
            .map((tagName) => ({ name: tagName }));

          updateData.tags = [...existingTags, ...newTags];
        }

        // Handle mark subtasks done
        if (updates.markSubtasksDone && task.subtasks) {
          updateData.subtasks = task.subtasks.map((subtask) => ({
            ...subtask,
            completed: true,
            status: 'done' as Task['status'],
          }));
        }

        // Validate updated task
        const updatedTask = { ...task, ...updateData };
        this.validator.validateTask(updatedTask);

        // Write update
        await this.writer.updateTask(projectName, taskId, updateData);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          taskId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }

  /**
   * Batch delete multiple tasks
   */
  async batchDelete(
    projectName: string,
    taskIds: (number | string)[]
  ): Promise<BatchOperationResult> {
    const result: BatchOperationResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    // Check dependencies before deleting
    const allTasks = await this.reader.readTasks(projectName);
    const taskMap = new Map(allTasks.map((t) => [t.id, t]));
    const tasksToDelete = new Set(taskIds);

    // Find tasks that depend on tasks being deleted
    const dependentTasks = allTasks.filter(
      (task) =>
        task.dependencies &&
        task.dependencies.some((depId) => tasksToDelete.has(depId))
    );

    if (dependentTasks.length > 0) {
      throw new Error(
        `Cannot delete tasks: ${dependentTasks.length} task(s) depend on them`
      );
    }

    // Delete tasks
    for (const taskId of taskIds) {
      try {
        await this.writer.deleteTask(projectName, taskId);
        result.success++;
      } catch (error) {
        result.failed++;
        result.errors.push({
          taskId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    return result;
  }
}
