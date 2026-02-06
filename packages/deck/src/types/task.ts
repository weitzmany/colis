/**
 * Task status values (combining taskmaster-ai and discord-story-bot)
 * 
 * @remarks
 * Status values from taskmaster-ai:
 * - `pending`: Task is waiting to be started
 * - `in-progress`: Task is currently being worked on
 * - `done`: Task is completed
 * - `deferred`: Task is postponed
 * - `cancelled`: Task is cancelled
 * - `blocked`: Task is blocked by dependencies or issues
 * - `review`: Task is in review
 * 
 * Status values from discord-story-bot:
 * - `backlog`: Task is in backlog
 * - `to do`: Task is ready to be started (alternative to pending)
 * - `in progress`: Task is in progress (alternative spelling)
 * - `testing`: Task is being tested
 * - `next release`: Task is scheduled for next release
 * - `archive`: Task is archived
 * 
 * @public
 */
export type TaskStatus =
  // taskmaster-ai statuses
  | 'pending'
  | 'in-progress'
  | 'done'
  | 'deferred'
  | 'cancelled'
  | 'blocked'
  | 'review'
  // discord-story-bot statuses
  | 'backlog'
  | 'to do'
  | 'in progress'
  | 'testing'
  | 'next release'
  | 'archive';

/**
 * Task priority values (combining both systems)
 * 
 * @remarks
 * Priority values from taskmaster-ai:
 * - `low`: Low priority task
 * - `medium`: Medium priority task (default)
 * - `high`: High priority task
 * 
 * Priority values from discord-story-bot (5-level system):
 * - `very low`: Very low priority task
 * - `very high`: Very high priority task
 * 
 * Note: "urgent" is invalid per taskmaster-ai validation and should not be used.
 * 
 * @public
 */
export type TaskPriority =
  // taskmaster-ai priorities
  | 'low'
  | 'medium'
  | 'high'
  // discord-story-bot priorities (5-level system)
  | 'very low'
  | 'very high';

/**
 * Task type (from discord-story-bot)
 * 
 * @remarks
 * Task types categorize tasks by their nature:
 * - `feature`: New feature implementation
 * - `bug`: Bug fix
 * - `fix`: General fix (non-bug)
 * - `test`: Testing task
 * - `research`: Research task
 * - `prd`: Product Requirements Document task
 * - `documents`: Documentation task
 * 
 * @public
 */
export type TaskType =
  | 'feature'
  | 'bug'
  | 'fix'
  | 'test'
  | 'research'
  | 'prd'
  | 'documents';

/**
 * Tag structure (from discord-story-bot)
 * 
 * @remarks
 * Tags provide flexible organization for tasks. Colors are automatically
 * generated using the DJB2 hash algorithm if not provided, ensuring consistent
 * colors for the same tag name.
 * 
 * @public
 */
export interface Tag {
  /** Tag name (e.g., "sprint-1", "feature-auth") */
  name: string;
  /** 
   * Tag color in hex format (e.g., "#ff0000")
   * Auto-generated from name hash if not provided
   */
  color?: string;
}

/**
 * Recurrence pattern for recurring tasks
 */
export interface RecurrencePattern {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // For weekly: [0=Sunday, 1=Monday, ...]
  dayOfMonth?: number; // For monthly: day of month
  endDate?: string; // End date for recurrence (ISO)
  occurrences?: number; // Number of occurrences
  cronExpression?: string; // Custom cron expression
}

/**
 * Time entry for time tracking
 */
export interface TimeEntry {
  id: string;
  taskId: string | number;
  startTime: string; // ISO timestamp
  endTime?: string; // ISO timestamp (if still running, undefined)
  duration?: number; // Duration in minutes
  userId?: string; // User who logged time
  notes?: string; // Time entry notes
}

/**
 * Comment on a task
 */
export interface Comment {
  id: string;
  taskId: string | number;
  userId?: string;
  userName?: string;
  content: string;
  createdAt: string; // ISO timestamp
  updatedAt?: string; // ISO timestamp
  mentions?: string[]; // @mentioned user IDs
  attachments?: string[]; // Attachment IDs
}

/**
 * File attachment for a task
 */
export interface Attachment {
  id: string;
  taskId: string | number;
  fileName: string;
  filePath?: string; // Local file path
  fileUrl?: string; // Remote file URL
  fileSize?: number; // File size in bytes
  mimeType?: string; // MIME type
  uploadedAt: string; // ISO timestamp
  uploadedBy?: string; // User ID
}

/**
 * Activity log entry
 */
export interface ActivityLog {
  id: string;
  taskId: string | number;
  action: string; // 'created', 'updated', 'deleted', 'commented', etc.
  userId?: string;
  userName?: string;
  changes?: Record<string, { old: any; new: any }>; // Field changes
  timestamp: string; // ISO timestamp
}

/**
 * Automation rule
 */
export interface AutomationRule {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  enabled: boolean;
}

/**
 * Automation trigger
 */
export interface AutomationTrigger {
  type:
    | 'task_created'
    | 'task_updated'
    | 'task_status_changed'
    | 'due_date_approaching'
    | 'custom';
  config?: Record<string, any>;
}

/**
 * Automation condition
 */
export interface AutomationCondition {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: any;
}

/**
 * Automation action
 */
export interface AutomationAction {
  type:
    | 'update_field'
    | 'add_tag'
    | 'assign'
    | 'notify'
    | 'create_subtask'
    | 'custom';
  config: Record<string, any>;
}

/**
 * Permissions for task access control
 */
export interface Permissions {
  read: string[]; // User IDs who can read
  write: string[]; // User IDs who can write
  delete: string[]; // User IDs who can delete
  assign: string[]; // User IDs who can assign
}

/**
 * Gate review status (for Waterfall methodology)
 */
export type GateReviewStatus = 'pending' | 'approved' | 'rejected' | 'deferred';

/**
 * Subtask interface
 */
export interface Subtask {
  id: number | string;
  title: string; // Subtask title
  description?: string; // Optional description
  text?: string; // Alternative to title (discord-story-bot style)
  dependencies?: (number | string)[];
  details?: string;
  status?: TaskStatus; // Optional status (taskmaster-ai style)
  testStrategy?: string | null;
  parentId: string | number;
  updatedAt?: string;
  completed?: boolean; // Completion flag (discord-story-bot style)
}

/**
 * Main Task interface
 */
export interface Task {
  id: number | string; // Can be number (taskmaster-ai) or string (discord-story-bot style)
  title: string; // Task title/name
  description: string; // Task description
  details?: string; // Additional details (taskmaster-ai)
  testStrategy?: string | null; // Test strategy (taskmaster-ai)
  priority: TaskPriority; // Priority level
  dependencies?: (number | string)[]; // Task dependencies (taskmaster-ai)
  status: TaskStatus; // Current status
  subtasks?: Subtask[]; // Nested subtasks
  updatedAt: string; // Last update timestamp (ISO)
  createdAt?: string; // Creation timestamp (ISO)
  assignee?: string; // Task assignee (extension feature)
  tag?: string; // Task tag for organization (taskmaster-ai feature)
  labels?: string[]; // Additional labels (extension feature)
  color?: string; // Color code for visual organization (discord-story-bot)
  type?: TaskType; // Task type/category (discord-story-bot)
  tags?: Tag[]; // Multiple tags (discord-story-bot style, can coexist with tag)
  version?: string; // Version/release tracking (discord-story-bot)

  // Time management features (from web research)
  dueDate?: string; // Due date (ISO timestamp)
  startDate?: string; // Start date (ISO timestamp)
  estimatedTime?: number; // Estimated time in minutes/hours
  actualTime?: number; // Actual time spent
  timeEntries?: TimeEntry[]; // Time tracking entries
  isRecurring?: boolean; // Recurring task flag
  recurrencePattern?: RecurrencePattern; // Recurrence pattern

  // Collaboration features (from web research)
  comments?: Comment[]; // Task comments
  attachments?: Attachment[]; // File attachments
  activityLog?: ActivityLog[]; // Activity history

  // Advanced features (from web research)
  templateId?: string; // Template used to create task
  automationRules?: AutomationRule[]; // Automation rules applied
  permissions?: Permissions; // Access permissions
  relatedTasks?: (number | string)[]; // Related task IDs
  archived?: boolean; // Archive flag
  archivedAt?: string; // Archive timestamp

  // Methodology-specific fields (future enhancement)
  methodology?: string; // Current methodology (scrum, kanban, waterfall, etc.)
  // Scrum fields
  sprint?: string; // Sprint ID or name
  storyPoints?: number; // Story point estimate
  userStory?: string; // User story ID
  // Kanban fields
  wipLimit?: number; // Work-in-progress limit
  cycleTime?: number; // Cycle time in days
  leadTime?: number; // Lead time in days
  // Waterfall fields
  phase?: string; // Current phase
  milestone?: string; // Associated milestone
  gateReview?: GateReviewStatus; // Gate review status
}

/**
 * Tasks file structure (from taskmaster-ai)
 */
export interface TasksFile {
  [projectName: string]: {
    tasks: Task[];
  };
}

/**
 * Taskmaster-ai config structure
 */
export interface TaskmasterConfig {
  models: {
    main: ModelConfig;
    research: ModelConfig;
    fallback: ModelConfig;
  };
  global: {
    logLevel: string;
    debug: boolean;
    defaultNumTasks: number | null;
    defaultSubtasks: number | null;
    defaultPriority: TaskPriority;
    projectName: string;
    responseLanguage: string;
    enableCodebaseAnalysis: boolean;
    defaultTag: string;
    userId: string;
  };
}

/**
 * Model configuration
 */
export interface ModelConfig {
  provider: string;
  modelId: string;
  maxTokens: number;
  temperature: number;
}

/**
 * Sprint interface (for Scrum methodology)
 */
export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goal?: string;
  velocity?: number;
  tasks: (string | number)[]; // Task IDs
}

/**
 * User story interface (for Scrum methodology)
 */
export interface UserStory {
  id: string;
  title: string;
  description: string;
  storyPoints: number;
  priority: TaskPriority;
  acceptanceCriteria: string[];
  tasks: (string | number)[]; // Task IDs
  sprint?: string; // Sprint ID
}
