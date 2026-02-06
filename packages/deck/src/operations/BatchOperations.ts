import { Task } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';
import { TaskValidator } from '../core/TaskValidator';

/**
 * Options for batch updating multiple tasks.
 * All fields are optional - only specified fields will be updated.
 */
export interface BatchUpdateOptions {
  /** Update status for all tasks in the batch */
  status?: Task['status'];
  /** Update type for all tasks in the batch */
  type?: Task['type'];
  /** Update priority for all tasks in the batch */
  priority?: Task['priority'];
  /** Update color for all tasks in the batch */
  color?: string;
  /** Tag operations - currently supports adding tags (merges with existing) */
  tags?: {
    /** Add tags to tasks (merges with existing tags, no duplicates) */
    add?: string[];
  };
  /** Mark all subtasks as done for tasks in the batch */
  markSubtasksDone?: boolean;
}

/**
 * Result of a batch operation (update or delete).
 * Provides detailed information about successes, failures, and errors.
 */
export interface BatchOperationResult {
  /** Number of tasks successfully processed */
  success: number;
  /** Number of tasks that failed to process */
  failed: number;
  /** Array of errors with task ID and error message for each failure */
  errors: Array<{ taskId: number | string; error: string }>;
}

/**
 * BatchOperations - Handle batch updates and deletes for multiple tasks.
 * 
 * Provides efficient batch operations with comprehensive error reporting.
 * All operations validate tasks before applying changes and report individual failures.
 * 
 * @example
 * ```typescript
 * const batchOps = new BatchOperations('/path/to/project');
 * const result = await batchOps.batchUpdate('my-project', [1, 2, 3], {
 *   status: 'done',
 *   priority: 'high'
 * });
 * console.log(`Updated ${result.success} tasks, ${result.failed} failed`);
 * ```
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
   * Batch update multiple tasks with the same updates.
   * Validates all tasks before applying changes and reports individual failures.
   * 
   * @param projectName The name of the project containing the tasks.
   * @param taskIds Array of task IDs to update.
   * @param updates The updates to apply to all tasks.
   * @returns A result object with success count, failure count, and detailed error information.
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
   * Batch delete multiple tasks.
   * Checks for dependencies before deleting and prevents deletion if other tasks depend on them.
   * 
   * @param projectName The name of the project containing the tasks.
   * @param taskIds Array of task IDs to delete.
   * @returns A result object with success count, failure count, and detailed error information.
   * @throws {Error} If any tasks have dependencies (prevents deletion of all tasks in the batch).
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
      const dependentTaskIds = dependentTasks.map(t => t.id).join(', ');
      throw new Error(
        `Cannot delete tasks: ${dependentTasks.length} task(s) depend on them. Dependent task IDs: ${dependentTaskIds}`
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
