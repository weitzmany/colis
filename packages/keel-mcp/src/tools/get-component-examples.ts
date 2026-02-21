import { getExamplesForComponent } from '../data/examples.js';
import { getComponentBySelector } from '../data/components.js';

export interface GetComponentExamplesInput {
  component: string;
  variant?: string;
}

export function getComponentExamples(input: GetComponentExamplesInput) {
  const { component, variant } = input;
  const found = getComponentBySelector(component);

  if (!found) {
    return {
      error: `Component '${component}' not found.`,
      availableSelectors: ['keel-button', 'keel-input', 'keel-modal'],
    };
  }

  if (found.status === 'planned') {
    const examples = getExamplesForComponent(found.selector, variant);
    return {
      component: found.selector,
      status: 'planned',
      note: `${found.name} is planned for Phase ${found.phase}. Examples below are the intended API and may change before release.`,
      examples: examples.length > 0 ? examples : [],
    };
  }

  const examples = getExamplesForComponent(found.selector, variant);
  return {
    component: found.selector,
    status: found.status,
    examples,
  };
}
