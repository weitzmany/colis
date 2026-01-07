/**
 * Framework Handler Factory
 * 
 * Creates framework handler instances using Factory pattern.
 */

import { FrameworkHandler } from './interfaces';
import { NextJsHandler } from './nextjs';
import { AngularHandler } from './angular';
import { ExpressHandler } from './express';
import { ReactHandler } from './react';
import { DockerHandler } from './docker';

export class FrameworkFactory {
  private static handlers: FrameworkHandler[] = [
    new NextJsHandler(),
    new AngularHandler(),
    new ExpressHandler(),
    new ReactHandler(),
    new DockerHandler(),
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




