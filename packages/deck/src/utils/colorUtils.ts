import { TaskType, TaskPriority } from '../types/task';

/**
 * Color utilities for task management
 */

/**
 * Default colors for task types
 */
export const TYPE_COLORS: Record<string, string> = {
  feature: '#5865F2', // Discord blue
  bug: '#ED4245', // Discord red
  fix: '#FEE75C', // Discord yellow
  test: '#57F287', // Discord green
  research: '#EB459E', // Discord pink
  prd: '#95A5A6', // Gray
  documents: '#34495E', // Dark gray
};

/**
 * Default colors for priority levels
 */
export const PRIORITY_COLORS: Record<string, string> = {
  'very low': '#95A5A6', // Gray
  low: '#57F287', // Green
  medium: '#FEE75C', // Yellow
  high: '#FAA61A', // Orange
  'very high': '#ED4245', // Red
};

/**
 * Get color for a task type
 */
export function getTypeColor(type?: TaskType): string {
  if (!type) {
    return TYPE_COLORS.feature; // Default
  }
  return TYPE_COLORS[type] || TYPE_COLORS.feature;
}

/**
 * Get color for a priority level
 */
export function getPriorityColor(priority: TaskPriority): string {
  return PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
}

/**
 * Generate a random color (for tasks without specific color)
 */
export function generateRandomColor(): string {
  const colors = Object.values(TYPE_COLORS);
  return colors[Math.floor(Math.random() * colors.length)];
}
