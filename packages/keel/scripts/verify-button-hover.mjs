import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourcePath = join(process.cwd(), 'src', 'components', 'button', 'keel-button.component.ts');
const source = readFileSync(sourcePath, 'utf8');

const requiredSnippets = [
  '.kh-button:hover:not(:disabled)',
  '.kh-button:active:not(:disabled)',
  '.kh-button-outline:hover:not(:disabled)',
  '.kh-button-flat:hover:not(:disabled)',
  '.kh-button-link:hover:not(:disabled)',
  '.kh-button__spinner',
  '@Input({ transform: booleanAttribute }) loading = false;',
  '[disabled]="isDisabled"',
];

for (const snippet of requiredSnippets) {
  if (!source.includes(snippet)) {
    console.error(`Button hover verification failed: missing "${snippet}" in component styles.`);
    process.exit(1);
  }
}

console.log('Button hover verification passed.');
