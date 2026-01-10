/**
 * @your-org/task-manager
 * Task management package for reading and managing tasks from taskmaster-ai
 */

export * from './types/task';
export * from './core/TaskManager';
export * from './core/TaskReader';
export * from './core/TaskWriter';
export * from './core/TaskValidator';
export * from './operations/BatchOperations';
export * from './operations/AssigneeManager';
export * from './operations/LabelManager';
export * from './operations/TagManager';
export * from './utils/hashUtils';
export * from './utils/colorUtils';
export * from './utils/validationUtils';

// Main export
export { TaskManager } from './core/TaskManager';
export type {
  TaskManagerOptions,
  CreateTaskOptions,
  UpdateTaskOptions,
} from './core/TaskManager';
export type { TaskFilterOptions } from './core/TaskReader';
export type {
  BatchUpdateOptions,
  BatchOperationResult,
} from './operations/BatchOperations';
export type { AssigneeStats } from './operations/AssigneeManager';
export type { LabelStats } from './operations/LabelManager';
export type { TagStats } from './operations/TagManager';
