# Framework CLI Integration Feature

This feature provides a unified interface for integrating various framework CLIs (Angular, React, Vue, Slim, Zend, etc.) into the project creation workflow.

## Architecture

### Core Components

1. **`types.ts`** - Core interfaces and types
   - `FrameworkCli` - Interface that all CLI implementations must follow
   - `FrameworkCliOptions` - Options for creating projects
   - `FrameworkCliResult` - Result of project creation
   - `FrameworkVersions` - Version information for frameworks

2. **`registry.ts`** - Framework CLI registry
   - `FrameworkCliRegistry` - Manages registration and lookup of CLI implementations
   - `frameworkCliRegistry` - Global singleton instance

3. **Framework Implementations**
   - `angular-cli.ts` - Angular CLI integration (complete)
   - `react-cli.ts` - React CLI integration (future)
   - `vue-cli.ts` - Vue CLI integration (future)
   - `slim-cli.ts` - Slim Framework integration (future)
   - etc.

## Usage

### Using the Framework CLI

```typescript
import { frameworkCliRegistry } from './features/framework-cli';

// Find the appropriate CLI for a template
const cli = frameworkCliRegistry.find('angular');

if (cli) {
  // Fetch latest versions
  const versions = await cli.fetchVersions();
  
  // Create project
  const result = await cli.create({
    projectName: 'my-app',
    outputPath: '/path/to/my-app',
    packageManager: 'npm',
    skipGit: false,
    skipDeps: false,
  });
  
  if (result.success) {
    console.log(`✓ ${cli.displayName} project created successfully`);
  }
}
```

### Registering a New Framework CLI

```typescript
import { FrameworkCli, frameworkCliRegistry } from './features/framework-cli';

class ReactCli implements FrameworkCli {
  name = 'react';
  displayName = 'React';
  
  shouldUse(templateType: string): boolean {
    return templateType.toLowerCase().includes('react');
  }
  
  async create(options: FrameworkCliOptions): Promise<FrameworkCliResult> {
    // Implementation for React (create-react-app or Vite)
    // ...
  }
}

// Register the CLI
frameworkCliRegistry.register(new ReactCli());
```

## Adding New Framework CLIs

To add support for a new framework CLI (e.g., Vue, React, Slim):

1. **Create a new file** (e.g., `react-cli.ts`)
2. **Implement the `FrameworkCli` interface**
3. **Register in `registry.ts` constructor**
4. **Export from `index.ts`**

### Example: React CLI

```typescript
// react-cli.ts
import { execSync } from 'child_process';
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult } from './types.js';

export class ReactCli implements FrameworkCli {
  name = 'react';
  displayName = 'React';
  
  shouldUse(templateType: string): boolean {
    return templateType.toLowerCase().includes('react');
  }
  
  async create(options: FrameworkCliOptions): Promise<FrameworkCliResult> {
    const { projectName, outputPath, packageManager } = options;
    
    try {
      // Use create-react-app or Vite
      const command = `npx create-react-app ${projectName} --template typescript`;
      execSync(command, { cwd: path.dirname(outputPath), stdio: 'inherit' });
      
      return {
        success: true,
        outputPath,
        framework: 'react',
        depsInstalled: true,
      };
    } catch (error) {
      return {
        success: false,
        outputPath,
        framework: 'react',
        depsInstalled: false,
        error: String(error),
      };
    }
  }
}
```

### Example: Vue CLI

```typescript
// vue-cli.ts
export class VueCli implements FrameworkCli {
  name = 'vue';
  displayName = 'Vue';
  
  shouldUse(templateType: string): boolean {
    return templateType.toLowerCase().includes('vue');
  }
  
  async create(options: FrameworkCliOptions): Promise<FrameworkCliResult> {
    // Use @vue/cli or create-vue (Vite)
    const command = `npx create-vue@latest ${projectName} --typescript`;
    // ...
  }
}
```

### Example: Slim Framework CLI

```typescript
// slim-cli.ts
export class SlimCli implements FrameworkCli {
  name = 'slim';
  displayName = 'Slim Framework';
  
  shouldUse(templateType: string): boolean {
    return templateType.toLowerCase().includes('slim');
  }
  
  async create(options: FrameworkCliOptions): Promise<FrameworkCliResult> {
    // Use composer create-project for Slim
    const command = `composer create-project slim/slim-skeleton ${projectName}`;
    // ...
  }
}
```

## Benefits

### Organization
- **Separation of Concerns**: Each framework CLI is in its own file
- **Easy to Navigate**: All framework CLIs are in one directory
- **Clear Responsibility**: Each CLI handles one framework

### Extensibility
- **Easy to Add**: Just implement the interface and register
- **Consistent API**: All CLIs follow the same interface
- **Flexible**: Custom options can be passed through

### Maintainability
- **Isolated Changes**: Changes to one CLI don't affect others
- **Testable**: Each CLI can be tested independently
- **Documented**: Clear interfaces and types

## Future Framework CLIs

Planned framework CLIs to add:

- **React** (`react-cli.ts`)
  - create-react-app
  - Vite + React
  
- **Vue** (`vue-cli.ts`)
  - @vue/cli
  - create-vue (Vite)
  
- **Slim Framework** (`slim-cli.ts`)
  - composer create-project slim/slim-skeleton
  
- **Zend Framework** (`zend-cli.ts`)
  - composer create-project laminas/laminas-mvc-skeleton
  
- **Next.js** (`nextjs-cli.ts`)
  - create-next-app
  
- **Nuxt.js** (`nuxtjs-cli.ts`)
  - create-nuxt-app

## Testing

Each framework CLI should have corresponding tests:

```typescript
// __tests__/angular-cli.test.ts
describe('AngularCli', () => {
  it('should detect angular templates', () => {
    const cli = new AngularCli();
    expect(cli.shouldUse('angular')).toBe(true);
    expect(cli.shouldUse('nextjs')).toBe(false);
  });
  
  // More tests...
});
```

## Migration Notes

The Angular CLI integration was previously inline in `create.ts`. It has been:
- Extracted to `angular-cli.ts`
- Organized with common interfaces
- Made extensible for future CLIs

The `create.ts` file now uses the registry to find and use framework CLIs.
