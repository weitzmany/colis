/**
 * Git Workflow Lifecycle Tools
 */

export * from './init';
export * from './verify';
export * from './mend';
export * from './update';

import { init } from './init';
import { verify } from './verify';
import { mend } from './mend';
import { update } from './update';

/**
 * Git Workflow Lifecycle Management Class
 */
export class GitWorkflowLifecycle {
  static init = init;
  static verify = verify;
  static mend = mend;
  static update = update;
}
