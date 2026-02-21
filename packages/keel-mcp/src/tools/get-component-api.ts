import { getComponentBySelector } from '../data/components.js';

export interface GetComponentApiInput {
  component: string;
}

export function getComponentApi(input: GetComponentApiInput) {
  const { component } = input;
  const found = getComponentBySelector(component);

  if (!found) {
    return {
      error: `Component '${component}' not found. Use list_components to see available components.`,
      availableSelectors: ['keel-button', 'keel-input', 'keel-modal'],
    };
  }

  return {
    name: found.name,
    selector: found.selector,
    importPath: found.importPath,
    status: found.status,
    phase: found.phase,
    inputs: found.inputs,
    outputs: found.outputs,
    slots: found.slots,
    cssTokens: found.cssTokens,
    angularUsage: {
      import: `import { ${found.name} } from '${found.importPath}';`,
      componentDecorator: `@Component({ standalone: true, imports: [${found.name}] })`,
      selector: found.selector,
    },
  };
}
