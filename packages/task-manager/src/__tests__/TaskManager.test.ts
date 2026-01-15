/**
 * Unit tests for TaskManager
 * 
 * @jest-environment node
 */

import { TaskManager } from '../core/TaskManager';
import * as fs from 'fs';
import * as path from 'path';
import { Task } from '../types/task';

describe('TaskManager', () => {
  let manager: TaskManager;
  let testProjectRoot: string;
  const testProjectName = 'test-project';

  beforeEach(() => {
    // Create a temporary test directory
    testProjectRoot = path.join(__dirname, '../../.test-temp');
    if (fs.existsSync(testProjectRoot)) {
      fs.rmSync(testProjectRoot, { recursive: true, force: true });
    }
    fs.mkdirSync(testProjectRoot, { recursive: true });

    manager = new TaskManager(testProjectRoot, { autoInit: false });
  });

  afterEach(() => {
    // Clean up test directory
    if (fs.existsSync(testProjectRoot)) {
      fs.rmSync(testProjectRoot, { recursive: true, force: true });
    }
  });

  describe('Initialization', () => {
    it('should initialize taskmaster structure', async () => {
      await manager.initializeTaskmaster();
      
      const taskmasterDir = path.join(testProjectRoot, '.taskmaster');
      expect(fs.existsSync(taskmasterDir)).toBe(true);
      expect(fs.existsSync(path.join(taskmasterDir, 'tasks'))).toBe(true);
    });
  });

  describe('Task CRUD Operations', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should create a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      expect(task).toBeDefined();
      expect(task.id).toBeDefined();
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test description');
      expect(task.priority).toBe('high');
      expect(task.status).toBe('pending');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should read a task by ID', async () => {
      const created = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      const retrieved = await manager.getTask(testProjectName, created.id);
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test Task');
    });

    it('should return null for non-existent task', async () => {
      const retrieved = await manager.getTask(testProjectName, 'non-existent-id');
      expect(retrieved).toBeNull();
    });

    it('should get all tasks', async () => {
      await manager.createTask(testProjectName, {
        title: 'Task 1',
        description: 'Description 1',
        priority: 'high',
        status: 'pending'
      });

      await manager.createTask(testProjectName, {
        title: 'Task 2',
        description: 'Description 2',
        priority: 'medium',
        status: 'pending'
      });

      const tasks = await manager.getTasks(testProjectName);
      expect(tasks.length).toBe(2);
    });

    it('should update a task', async () => {
      const created = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      const updated = await manager.updateTask(testProjectName, created.id, {
        status: 'in-progress',
        priority: 'very high'
      });

      expect(updated.status).toBe('in-progress');
      expect(updated.priority).toBe('very high');
      expect(updated.updatedAt).not.toBe(created.updatedAt);
    });

    it('should delete a task', async () => {
      const created = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.removeTask(testProjectName, created.id);

      const retrieved = await manager.getTask(testProjectName, created.id);
      expect(retrieved).toBeNull();
    });
  });

  describe('Filtering', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
      
      await manager.createTask(testProjectName, {
        title: 'High Priority Task',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      await manager.createTask(testProjectName, {
        title: 'Low Priority Task',
        description: 'Description',
        priority: 'low',
        status: 'in-progress'
      });
    });

    it('should filter tasks by status', async () => {
      const pendingTasks = await manager.getTasks(testProjectName, {
        status: ['pending']
      });

      expect(pendingTasks.length).toBe(1);
      expect(pendingTasks[0].status).toBe('pending');
    });

    it('should filter tasks by priority', async () => {
      const highPriorityTasks = await manager.getTasks(testProjectName, {
        priority: ['high']
      });

      expect(highPriorityTasks.length).toBe(1);
      expect(highPriorityTasks[0].priority).toBe('high');
    });
  });

  describe('Assignee Management', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should assign a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.assignTask(testProjectName, task.id, 'john.doe');

      const updated = await manager.getTask(testProjectName, task.id);
      expect(updated?.assignee).toBe('john.doe');
    });

    it('should unassign a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.assignTask(testProjectName, task.id, 'john.doe');
      await manager.unassignTask(testProjectName, task.id);

      const updated = await manager.getTask(testProjectName, task.id);
      expect(updated?.assignee).toBeUndefined();
    });

    it('should list assignees', async () => {
      const task1 = await manager.createTask(testProjectName, {
        title: 'Task 1',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      const task2 = await manager.createTask(testProjectName, {
        title: 'Task 2',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      await manager.assignTask(testProjectName, task1.id, 'john.doe');
      await manager.assignTask(testProjectName, task2.id, 'john.doe');

      const assignees = await manager.listAssignees(testProjectName);
      expect(assignees.length).toBe(1);
      expect(assignees[0].assignee).toBe('john.doe');
      expect(assignees[0].count).toBe(2);
    });
  });

  describe('Label Management', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should add labels to a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.addLabels(testProjectName, task.id, ['bug', 'frontend']);

      const updated = await manager.getTask(testProjectName, task.id);
      expect(updated?.labels).toContain('bug');
      expect(updated?.labels).toContain('frontend');
    });

    it('should remove a label from a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.addLabels(testProjectName, task.id, ['bug', 'frontend']);
      await manager.removeLabel(testProjectName, task.id, 'bug');

      const updated = await manager.getTask(testProjectName, task.id);
      expect(updated?.labels).not.toContain('bug');
      expect(updated?.labels).toContain('frontend');
    });
  });

  describe('Tag Management', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should add tags to a task', async () => {
      const task = await manager.createTask(testProjectName, {
        title: 'Test Task',
        description: 'Test description',
        priority: 'high',
        status: 'pending'
      });

      await manager.addTags(testProjectName, task.id, ['sprint-1', 'feature-auth']);

      const updated = await manager.getTask(testProjectName, task.id);
      expect(updated?.tags).toBeDefined();
      expect(updated?.tags?.length).toBe(2);
      expect(updated?.tags?.some(t => t.name === 'sprint-1')).toBe(true);
      expect(updated?.tags?.some(t => t.name === 'feature-auth')).toBe(true);
    });
  });

  describe('Dependency Management', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should add a dependency', async () => {
      const taskA = await manager.createTask(testProjectName, {
        title: 'Task A',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      const taskB = await manager.createTask(testProjectName, {
        title: 'Task B',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      await manager.addDependency(testProjectName, taskB.id, taskA.id);

      const updated = await manager.getTask(testProjectName, taskB.id);
      expect(updated?.dependencies).toContain(taskA.id);
    });

    it('should validate dependencies', async () => {
      const taskA = await manager.createTask(testProjectName, {
        title: 'Task A',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      const taskB = await manager.createTask(testProjectName, {
        title: 'Task B',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      await manager.addDependency(testProjectName, taskB.id, taskA.id);

      const validation = await manager.validateDependencies(testProjectName);
      expect(validation.valid).toBe(true);
      expect(validation.errors.length).toBe(0);
    });
  });

  describe('Batch Operations', () => {
    beforeEach(async () => {
      await manager.initializeTaskmaster();
    });

    it('should batch update tasks', async () => {
      const task1 = await manager.createTask(testProjectName, {
        title: 'Task 1',
        description: 'Description',
        priority: 'high',
        status: 'pending'
      });

      const task2 = await manager.createTask(testProjectName, {
        title: 'Task 2',
        description: 'Description',
        priority: 'medium',
        status: 'pending'
      });

      const result = await manager.batchUpdate(testProjectName, [task1.id, task2.id], {
        status: 'in-progress',
        priority: 'high'
      });

      expect(result.success).toBe(2);
      expect(result.failed).toBe(0);

      const updated1 = await manager.getTask(testProjectName, task1.id);
      const updated2 = await manager.getTask(testProjectName, task2.id);
      expect(updated1?.status).toBe('in-progress');
      expect(updated2?.status).toBe('in-progress');
    });
  });
});
