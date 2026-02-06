/**
 * Template Processor Tests
 */

import { TemplateProcessor } from '../template-processor';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('TemplateProcessor', () => {
  let processor: TemplateProcessor;
  let tempDir: string;

  beforeEach(() => {
    processor = new TemplateProcessor();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'template-test-'));
  });

  afterEach(async () => {
    if (tempDir && (await fs.pathExists(tempDir))) {
      await fs.remove(tempDir);
    }
  });

  it('should process template with variables', async () => {
    const templatePath = path.join(tempDir, 'test.hbs');
    const outputPath = path.join(tempDir, 'output.txt');
    
    await fs.writeFile(templatePath, 'Hello {{projectName}}!');
    
    await processor.processTemplate(templatePath, outputPath, {
      projectName: 'test-project',
      appType: 'node',
      packageManager: 'npm',
    });

    const content = await fs.readFile(outputPath, 'utf-8');
    expect(content).toBe('Hello test-project!');
  });

  it('should process template path with variables', () => {
    const templatePath = '{{projectName}}/file.txt';
    const processed = processor.processTemplatePath(templatePath, {
      projectName: 'my-project',
      appType: 'node',
      packageManager: 'npm',
    });
    
    expect(processed).toBe('my-project/file.txt');
  });

  it('should remove .hbs extension from processed path', () => {
    const templatePath = 'file.txt.hbs';
    const processed = processor.processTemplatePath(templatePath, {
      projectName: 'test',
      appType: 'node',
      packageManager: 'npm',
    });
    
    expect(processed).toBe('file.txt');
  });

  it('should identify template files', () => {
    expect(processor.isTemplateFile('file.hbs')).toBe(true);
    expect(processor.isTemplateFile('file.txt')).toBe(false);
    expect(processor.isTemplateFile('{{projectName}}.txt')).toBe(true);
  });
});
