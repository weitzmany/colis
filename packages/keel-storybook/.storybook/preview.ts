import type { Preview } from '@storybook/angular';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: 'Hull Light', value: '#ffffff' },
        { name: 'Hull Dark', value: '#111827' },
        { name: 'Hull Subtle', value: '#f9fafb' },
      ],
      default: 'Hull Light',
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '900px' } },
      },
      defaultViewport: 'desktop',
    },
    layout: 'padded',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Design Tokens',
          ['Token Reference', 'Colors', 'Spacing', 'Typography', 'Radius'],
          'Hull Themes',
          ['Overview', 'Light', 'Dark', 'Theme Matrix'],
          'Components',
          ['*'],
        ],
      },
    },
  },
  decorators: [],
};

export default preview;
