# Component Story Template

Use this template when adding a story for a new keel component.

## File Location

```
stories/components/<component-name>/<ComponentName>.stories.ts
```

## Template

```typescript
import type { Meta, StoryObj } from '@storybook/angular';
import { KeelXxxComponent } from '@colis/keel';

const meta: Meta<KeelXxxComponent> = {
  title: 'Components/Xxx',
  component: KeelXxxComponent,
  tags: ['autodocs'],
  argTypes: {
    // Document all @Input() properties here
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual variant of the component',
      table: {
        defaultValue: { summary: 'primary' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the component',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component: `
Description of the component.

**Import**:
\`\`\`typescript
import { KeelXxxComponent } from '@colis/keel';
\`\`\`

**CSS Tokens used**: \`--keel-color-primary\`, \`--keel-space-sm\`

**Docs Portal**: [Link to chartroom page](http://localhost:4300/design-system/keel/xxx/)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<KeelXxxComponent>;

// One story per significant variant/state
export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
  },
};
```

## Sync Checklist (per package_docs_sync.mdc)

When adding a story, also update:
- [ ] `packages/keel-mcp/src/data/story-links.ts` — add the story IDs
- [ ] `stories/themes/ThemeMatrix.stories.ts` — add component to each theme column
- [ ] `packages/chartroom/src/content/docs/design-system/keel/overview.mdx` — update component status table
