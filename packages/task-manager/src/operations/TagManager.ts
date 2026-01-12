import { Task, Tag } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';
import { stringToColor } from '../utils/hashUtils';

/**
 * Statistics for a tag, including task count, color, and list of tasks with that tag.
 */
export interface TagStats {
  /** The tag name */
  tag: string;
  /** Number of tasks with this tag */
  taskCount: number;
  /** Auto-generated color for the tag (hex format) */
  color?: string;
  /** Array of all tasks with this tag */
  tasks: Task[];
}

/**
 * TagManager - Manage task tags with automatic color generation.
 * 
 * Supports both single tag (taskmaster-ai style) and multiple tags (discord-story-bot style).
 * Automatically generates consistent colors for tags using DJB2 hash algorithm.
 * 
 * @example
 * ```typescript
 * const tagManager = new TagManager('/path/to/project');
 * await tagManager.addTag('my-project', 1, 'feature'); // Single tag
 * await tagManager.addTags('my-project', 1, ['bug', 'urgent']); // Multiple tags with colors
 * ```
 */
export class TagManager {
  private reader: TaskReader;
  private writer: TaskWriter;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
  }

  /**
   * Add a single tag to a task (taskmaster-ai style).
   * Replaces any existing single tag.
   * 
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to tag.
   * @param tag The tag to add.
   * @throws {Error} If the task is not found.
   */
  async addTag(
    projectName: string,
    taskId: number | string,
    tag: string
  ): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { tag });
  }

  /**
   * Add multiple tags to a task (discord-story-bot style with auto-generated colors).
   * Merges with existing tags and automatically generates colors for new tags.
   * 
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to tag.
   * @param tagNames Array of tag names to add.
   * @throws {Error} If the task is not found.
   */
  async addTags(
    projectName: string,
    taskId: number | string,
    tagNames: string[]
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task "${taskId}" not found in project "${projectName}"`);
    }

    const existingTags = task.tags || [];
    const existingTagNames = existingTags.map((t) =>
      typeof t === 'string' ? t : t.name
    );

    const newTags: Tag[] = tagNames
      .filter((tagName) => !existingTagNames.includes(tagName))
      .map((tagName) => ({
        name: tagName,
        color: stringToColor(tagName), // Auto-generate color
      }));

    await this.writer.updateTask(projectName, taskId, {
      tags: [...existingTags, ...newTags],
    });
  }

  /**
   * Remove a tag from a task.
   * Works with both single tag (taskmaster-ai style) and multiple tags (discord-story-bot style).
   * 
   * @param projectName The name of the project containing the task.
   * @param taskId The ID of the task to remove the tag from.
   * @param tagName The tag name to remove.
   * @throws {Error} If the task is not found.
   */
  async removeTag(
    projectName: string,
    taskId: number | string,
    tagName: string
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task "${taskId}" not found in project "${projectName}"`);
    }

    // Handle single tag (taskmaster-ai style)
    if (task.tag === tagName) {
      await this.writer.updateTask(projectName, taskId, { tag: undefined });
      return;
    }

    // Handle multiple tags (discord-story-bot style)
    if (task.tags && task.tags.length > 0) {
      const updatedTags = task.tags.filter((t) => {
        if (typeof t === 'string') {
          return t !== tagName;
        }
        return t.name !== tagName;
      });

      await this.writer.updateTask(projectName, taskId, { tags: updatedTags });
    }
  }

  /**
   * List all tags with their task counts, colors, and associated tasks.
   * Results are sorted by task count (highest first).
   * Automatically generates colors for tags that don't have them.
   * 
   * @param projectName The name of the project to query.
   * @returns A promise that resolves to an array of tag statistics.
   */
  async listTags(projectName: string): Promise<TagStats[]> {
    const tasks = await this.reader.readTasks(projectName);
    const tagMap = new Map<string, { tasks: Task[]; color?: string }>();

    for (const task of tasks) {
      // Handle single tag (taskmaster-ai style)
      if (task.tag) {
        if (!tagMap.has(task.tag)) {
          tagMap.set(task.tag, {
            tasks: [],
            color: stringToColor(task.tag),
          });
        }
        tagMap.get(task.tag)!.tasks.push(task);
      }

      // Handle multiple tags (discord-story-bot style)
      if (task.tags && task.tags.length > 0) {
        for (const tag of task.tags) {
          const tagName = typeof tag === 'string' ? tag : tag.name;
          const tagColor = typeof tag === 'string' ? stringToColor(tag) : tag.color || stringToColor(tag.name);

          if (!tagMap.has(tagName)) {
            tagMap.set(tagName, {
              tasks: [],
              color: tagColor,
            });
          }
          tagMap.get(tagName)!.tasks.push(task);
        }
      }
    }

    return Array.from(tagMap.entries())
      .map(([tag, data]) => ({
        tag,
        taskCount: data.tasks.length,
        color: data.color,
        tasks: data.tasks,
      }))
      .sort((a, b) => b.taskCount - a.taskCount);
  }

  /**
   * Migrate string tags to tag objects with auto-generated colors.
   * Converts both single tag (taskmaster-ai style) and string array tags to
   * tag objects with colors. Clears the single tag field after migration.
   * 
   * @param projectName The name of the project to migrate tags for.
   */
  async migrateTags(projectName: string): Promise<void> {
    const tasks = await this.reader.readTasks(projectName);
    const updates: Array<{ taskId: number | string; tags: Tag[] }> = [];

    for (const task of tasks) {
      // Skip if already migrated
      if (task.tags && task.tags.length > 0 && typeof task.tags[0] !== 'string') {
        continue;
      }

      const tagsToMigrate: Tag[] = [];

      // Migrate single tag (taskmaster-ai style)
      if (task.tag) {
        tagsToMigrate.push({
          name: task.tag,
          color: stringToColor(task.tag),
        });
      }

      // Migrate string tags to objects
      if (task.tags && task.tags.length > 0) {
        for (const tag of task.tags) {
          if (typeof tag === 'string') {
            tagsToMigrate.push({
              name: tag,
              color: stringToColor(tag),
            });
          } else {
            tagsToMigrate.push(tag);
          }
        }
      }

      if (tagsToMigrate.length > 0) {
        updates.push({
          taskId: task.id,
          tags: tagsToMigrate,
        });
      }
    }

    // Apply updates
    for (const update of updates) {
      await this.writer.updateTask(projectName, update.taskId, {
        tags: update.tags,
        tag: undefined, // Clear single tag after migration
      });
    }
  }

  /**
   * Get tag suggestions for autocomplete based on a prefix.
   * Searches existing tags that start with the given prefix (case-insensitive).
   * 
   * @param projectName The name of the project to search tags in.
   * @param prefix The prefix to search for.
   * @returns A promise that resolves to an array of matching tag names (up to 10).
   */
  async suggestTags(projectName: string, prefix: string): Promise<string[]> {
    const allTags = await this.listTags(projectName);
    const prefixLower = prefix.toLowerCase();

    return allTags
      .filter((tagStat) => tagStat.tag.toLowerCase().startsWith(prefixLower))
      .map((tagStat) => tagStat.tag)
      .slice(0, 10); // Return top 10 matches
  }
}
