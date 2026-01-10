import { TaskManager } from '@your-org/task-manager';
import * as path from 'path';

async function demonstrateWorkflow() {
  console.log('🚀 Task Manager Workflow Demonstration\n');
  
  const projectRoot = process.cwd();
  const manager = new TaskManager(projectRoot, { autoInit: true });
  const projectName = 'demo-project';

  console.log('1️⃣ Creating tasks...');
  const task1 = await manager.createTask(projectName, {
    title: 'Setup project structure',
    description: 'Create directory structure and initial files',
    priority: 'high',
    status: 'pending'
  });
  console.log('   ✓ Created:', task1.id, '-', task1.title);

  const task2 = await manager.createTask(projectName, {
    title: 'Implement core features',
    description: 'Build the main functionality',
    priority: 'medium',
    status: 'pending'
  });
  console.log('   ✓ Created:', task2.id, '-', task2.title);

  console.log('\n2️⃣ Assigning and labeling...');
  await manager.assignTask(projectName, task1.id, 'alice');
  await manager.addLabels(projectName, task1.id, ['setup', 'infrastructure']);
  await manager.addTags(projectName, task1.id, ['sprint-1']);
  console.log('   ✓ Assigned task1 to alice');
  console.log('   ✓ Added labels: setup, infrastructure');
  console.log('   ✓ Added tag: sprint-1');

  console.log('\n3️⃣ Adding dependency...');
  await manager.addDependency(projectName, task2.id, task1.id);
  console.log('   ✓ Task2 now depends on Task1');

  console.log('\n4️⃣ Getting next task...');
  const nextTask = await manager.getNextTask(projectName);
  console.log('   ✓ Next task:', nextTask?.title);
  console.log('   (Should be Task1 since Task2 depends on it)');

  console.log('\n5️⃣ Filtering tasks...');
  const highPriorityTasks = await manager.getTasks(projectName, {
    priority: 'high'
  });
  console.log('   ✓ High priority tasks:', highPriorityTasks.length);

  const aliceTasks = await manager.getTasks(projectName, {
    assignee: 'alice'
  });
  console.log('   ✓ Alice\'s tasks:', aliceTasks.length);

  console.log('\n6️⃣ Batch operations...');
  const batchResult = await manager.batchUpdate(projectName, [task1.id], {
    status: 'in-progress',
    priority: 'high'
  });
  console.log('   ✓ Batch update:', batchResult.success, 'successful,', batchResult.failed, 'failed');

  console.log('\n7️⃣ Listing statistics...');
  const assignees = await manager.listAssignees(projectName);
  console.log('   ✓ Assignees:', assignees.map(a => `${a.assignee} (${a.taskCount} tasks)`).join(', '));

  const labels = await manager.listLabels(projectName);
  console.log('   ✓ Labels:', labels.map(l => `${l.label} (${l.taskCount})`).join(', '));

  const tags = await manager.listTags(projectName);
  console.log('   ✓ Tags:', tags.map(t => `${t.tag} (${t.taskCount}, color: ${t.color})`).join(', '));

  console.log('\n8️⃣ Validating dependencies...');
  const validation = await manager.validateDependencies(projectName);
  console.log('   ✓ Dependencies valid:', validation.valid);
  if (validation.errors.length > 0) {
    console.log('   ⚠ Errors:', validation.errors);
  }

  console.log('\n✅ Workflow demonstration complete!');
  console.log('\n📁 Check .taskmaster/tasks/tasks.json to see the results');
}

demonstrateWorkflow().catch(console.error);
