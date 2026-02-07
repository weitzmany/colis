/**
 * File Updater Utilities
 * 
 * Helper functions for updating configuration files.
 */

import * as fs from 'fs-extra';

export class FileUpdater {
  /**
   * Update or create .env file with port
   */
  static async updateEnvFile(
    filePath: string,
    port: number,
    variableName: string = 'PORT'
  ): Promise<void> {
    let content = '';
    if (await fs.pathExists(filePath)) {
      content = await fs.readFile(filePath, 'utf-8');
    }

    const regex = new RegExp(`${variableName}\\s*=\\s*\\d+`, 'i');
    if (content.match(regex)) {
      content = content.replace(regex, `${variableName}=${port}`);
    } else {
      content += `\n${variableName}=${port}\n`;
    }

    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Update JSON file
   */
  static async updateJsonFile(
    filePath: string,
    updater: (json: any) => void
  ): Promise<void> {
    const content = await fs.readFile(filePath, 'utf-8');
    const json = JSON.parse(content);
    updater(json);
    await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf-8');
  }

  /**
   * Update YAML file
   */
  static async updateYamlFile(
    filePath: string,
    updater: (yaml: any) => void
  ): Promise<void> {
    const yaml = require('js-yaml');
    const content = await fs.readFile(filePath, 'utf-8');
    const data = yaml.load(content);
    updater(data);
    await fs.writeFile(filePath, yaml.dump(data), 'utf-8');
  }
}

