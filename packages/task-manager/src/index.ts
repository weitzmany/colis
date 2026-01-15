/**
 * @your-org/task-manager
 * Task management package for reading and managing tasks from taskmaster-ai
 * 
 * @packageDocumentation
 */

// Core types
export * from './types/task';

// Core classes
export * from './core/TaskManager';
export * from './core/TaskReader';
export * from './core/TaskWriter';
export * from './core/TaskValidator';

// Operations
export * from './operations/BatchOperations';
export * from './operations/AssigneeManager';
export * from './operations/LabelManager';
export * from './operations/TagManager';

// Utilities
export * from './utils/hashUtils';
export * from './utils/colorUtils';
export * from './utils/validationUtils';

// Main export - TaskManager class
export { TaskManager } from './core/TaskManager';

// Type exports for better IDE support
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
export type { ValidationError } from './core/TaskValidator';