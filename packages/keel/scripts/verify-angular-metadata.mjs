import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dtsPath = join(process.cwd(), 'dist', 'components', 'button', 'keel-button.component.d.ts');
const dts = readFileSync(dtsPath, 'utf8');

if (!dts.includes('ɵcmp') || !dts.includes('ɵfac')) {
  console.error('Angular metadata verification failed: expected ɵcmp and ɵfac in emitted declaration file.');
  process.exit(1);
}

console.log('Angular metadata verification passed.');
