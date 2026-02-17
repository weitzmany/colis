export * from './types';
export * from './lifecycle';

import type {
  ApplyResult,
  FeatureInstallOptions,
  InitOptions,
  LandfallInstallOptions
} from './types';
import { init } from './lifecycle';
import { installDockside } from './features/dockside';
import { installPassage } from './features/passage';
import { installLandfall } from './features/landfall';

export class Shipyard {
  static async init(options: InitOptions): Promise<ApplyResult> {
    return init(options);
  }

  static async installDockside(options: FeatureInstallOptions): Promise<ApplyResult> {
    return installDockside(options);
  }

  static async installPassage(options: FeatureInstallOptions): Promise<ApplyResult> {
    return installPassage(options);
  }

  static async installLandfall(options: LandfallInstallOptions): Promise<ApplyResult> {
    return installLandfall(options);
  }
}
