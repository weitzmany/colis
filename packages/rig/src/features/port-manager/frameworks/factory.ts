/**
 * Framework Handler Factory
 * 
 * Creates framework handler instances using Factory pattern.
 */

import { FrameworkHandler } from './interfaces.js';
import { NextJsHandler } from './nextjs.js';
import { AngularHandler } from './angular.js';
import { ExpressHandler } from './express.js';
import { ReactHandler } from './react.js';
import { DockerHandler } from './docker.js';
import { ReactNativeHandler } from './react-native.js';
import { ExpoHandler } from './expo.js';

export class FrameworkFactory {
  private static handlers: FrameworkHandler[] = [
    new NextJsHandler(),
    new AngularHandler(),
    new ExpressHandler(),
    new ReactHandler(),
    new DockerHandler(),
    new ReactNativeHandler(),
    new ExpoHandler(),
  ];

  /**
   * Get framework handler for a project
   */
  static async getHandler(projectPath: string): Promise<FrameworkHandler | null> {
    for (const handler of this.handlers) {
      if (await handler.detect(projectPath)) {
        return handler;
      }
    }
    return null;
  }

  /**
   * Get framework handler by name
   */
  static getHandlerByName(name: string): FrameworkHandler | null {
    return this.handlers.find((h) => h.getName() === name) || null;
  }

  /**
   * Get all available handlers
   */
  static getAllHandlers(): FrameworkHandler[] {
    return [...this.handlers];
  }
}




