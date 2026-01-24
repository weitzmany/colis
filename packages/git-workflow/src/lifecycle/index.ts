/**
 * Git Workflow Lifecycle Tools
 */

export * from './init';
export * from './verify';
export * from './repair';
export * from './update';

import { init } from './init';
import { verify } from './verify';
import { repair } from './repair';
import { update } from './update';

/**
 * Git Workflow Lifecycle Management Class
 */
export class GitWorkflowLifecycle {
  static init = init;
  static verify = verify;
  static repair = repair;
  static update = update;
}
