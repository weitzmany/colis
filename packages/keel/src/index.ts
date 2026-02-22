/**
 * @colis/keel — Angular component library
 *
 * CSS token contract:
 * All keel components consume --keel-* CSS custom properties.
 * See src/tokens/defaults.css for fallback values.
 *
 * Usage:
 *   import { KeelButtonComponent } from '@colis/keel';
 *   @import '@colis/keel/src/tokens/defaults.css';
 */

export * from './components/button/keel-button.component';
export * from './components/input/keel-input.component';

export const KEEL_VERSION = '0.3.3';
