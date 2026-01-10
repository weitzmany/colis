import { Task, Tag } from '../types/task';
import { TaskReader } from '../core/TaskReader';
import { TaskWriter } from '../core/TaskWriter';
import { stringToColor } from '../utils/hashUtils';

/**
 * Tag statistics
 */
export interface TagStats {
  tag: string;
  taskCount: number;
  color?: string;
  tasks: Task[];
}

/**
 * TagManager - Manage task tags with color generation
 */
export class TagManager {
  private reader: TaskReader;
  private writer: TaskWriter;

  constructor(projectRoot: string) {
    this.reader = new TaskReader(projectRoot);
    this.writer = new TaskWriter(projectRoot);
  }

  /**
   * Add a tag to a task (taskmaster-ai single tag style)
   */
  async addTag(
    projectName: string,
    taskId: number | string,
    tag: string
  ): Promise<void> {
    await this.writer.updateTask(projectName, taskId, { tag });
  }

  /**
   * Add multiple tags to a task (discord-story-bot style with colors)
   */
  async addTags(
    projectName: string,
    taskId: number | string,
    tagNames: string[]
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
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
   * Remove a tag from a task
   */
  async removeTag(
    projectName: string,
    taskId: number | string,
    tagName: string
  ): Promise<void> {
    const task = await this.reader.readTask(projectName, taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found in project ${projectName}`);
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
   * List all tags with task counts and colors
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
   * Migrate string tags to objects with colors
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
   * Get tag suggestions (autocomplete)
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
