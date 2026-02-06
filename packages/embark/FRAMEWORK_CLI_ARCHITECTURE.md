# Framework CLI Architecture

## Directory Structure

```
packages/template-project/src/
├── features/
│   └── framework-cli/                 ← New Feature Directory
│       ├── types.ts                   ← Core interfaces & types
│       ├── registry.ts                ← CLI registry (singleton)
│       ├── index.ts                   ← Feature exports
│       ├── README.md                  ← Documentation
│       │
│       ├── angular-cli.ts             ← Angular CLI (✅ Complete)
│       ├── react-cli.ts               ← React CLI (📝 Placeholder)
│       ├── vue-cli.ts                 ← Vue CLI (📝 Placeholder)
│       ├── slim-cli.ts                ← Slim Framework (📝 Placeholder)
│       └── [future-framework].ts      ← Future CLIs...
│
├── cli/
│   └── commands/
│       └── create.ts                  ← Uses framework-cli feature
│
└── utils/
    └── npm-version-fetcher.ts         ← Used by Angular CLI
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        create.ts                            │
│                     (Project Creation)                      │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ frameworkCliRegistry.find(templateType)
                    ↓
┌─────────────────────────────────────────────────────────────┐
│             FrameworkCliRegistry (Singleton)                │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Angular  │  │  React   │  │   Vue    │  │   Slim   │  │
│  │   CLI    │  │   CLI    │  │   CLI    │  │   CLI    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│       ↓              ↓              ↓              ↓       │
│  Implements     Implements     Implements     Implements  │
│       ↓              ↓              ↓              ↓       │
└───────┴──────────────┴──────────────┴──────────────┴───────┘
        │              │              │              │
        └──────────────┴──────────────┴──────────────┘
                            │
                            ↓
             ┌──────────────────────────┐
             │   FrameworkCli Interface  │
             ├──────────────────────────┤
             │ + name: string           │
             │ + displayName: string    │
             │ + shouldUse(type)        │
             │ + fetchVersions()?       │
             │ + create(options)        │
             └──────────────────────────┘
```

## Workflow Diagram

```
User runs: create-project create my-app
                 │
                 ↓
    ┌────────────────────────┐
    │  create.ts (main flow) │
    └────────────────────────┘
                 │
                 │ 1. Detect template type
                 ↓
    ┌────────────────────────┐
    │ frameworkCliRegistry   │
    │ .find(templateType)    │
    └────────────────────────┘
                 │
                 │ 2. Returns matching CLI
                 ↓
    ┌────────────────────────┐
    │  AngularCli instance   │
    │  (or React, Vue, etc.) │
    └────────────────────────┘
                 │
                 │ 3. fetchVersions()
                 ↓
    ┌────────────────────────┐
    │  Get latest versions   │
    └────────────────────────┘
                 │
                 │ 4. create(options)
                 ↓
    ┌────────────────────────┐
    │  Run framework CLI     │
    │  (ng new, create-app)  │
    └────────────────────────┘
                 │
                 │ 5. Return result
                 ↓
    ┌────────────────────────┐
    │   Continue with        │
    │   Project Init, etc.   │
    └────────────────────────┘
```

## Interface Hierarchy

```
FrameworkCliOptions
├── projectName: string
├── projectDescription?: string
├── outputPath: string
├── packageManager: string
├── skipGit?: boolean
├── skipDeps?: boolean
├── dryRun?: boolean
└── customOptions?: Record<string, any>

FrameworkCliResult
├── success: boolean
├── outputPath: string
├── framework: string
├── depsInstalled: boolean
├── error?: string
└── metadata?: Record<string, any>

FrameworkVersions
├── framework: string
├── version: string
└── ecosystem?: Record<string, string>

FrameworkCli (interface)
├── name: string
├── displayName: string
├── shouldUse(templateType: string): boolean
├── fetchVersions?(): Promise<FrameworkVersions>
└── create(options): Promise<FrameworkCliResult>
    ↑
    │ implements
    │
    ├── AngularCli (✅ Complete)
    ├── ReactCli (📝 Placeholder)
    ├── VueCli (📝 Placeholder)
    └── SlimCli (📝 Placeholder)
```

## Registry Pattern

```typescript
// Singleton instance
const frameworkCliRegistry = new FrameworkCliRegistry();

// Register CLIs (in constructor)
constructor() {
  this.register(new AngularCli());
  // this.register(new ReactCli());   // Future
  // this.register(new VueCli());     // Future
  // this.register(new SlimCli());    // Future
}

// Usage in create.ts
const cli = frameworkCliRegistry.find('angular');
if (cli) {
  const result = await cli.create(options);
}
```

## Adding a New CLI (Step by Step)

```
1. Create new file: react-cli.ts
   ┌─────────────────────────────┐
   │ export class ReactCli       │
   │   implements FrameworkCli   │
   └─────────────────────────────┘

2. Implement interface methods
   ┌─────────────────────────────┐
   │ + name = 'react'            │
   │ + displayName = 'React'     │
   │ + shouldUse(type)           │
   │ + create(options)           │
   └─────────────────────────────┘

3. Register in registry.ts
   ┌─────────────────────────────┐
   │ constructor() {             │
   │   this.register(new React)  │
   │ }                           │
   └─────────────────────────────┘

4. Export from index.ts
   ┌─────────────────────────────┐
   │ export * from './react-cli' │
   └─────────────────────────────┘

5. Done! CLI is automatically used
   ┌─────────────────────────────┐
   │ create-project create app   │
   │ --template react            │
   └─────────────────────────────┘
```

## Benefits Visualization

```
Before (Inline in create.ts):
┌─────────────────────────────────────┐
│          create.ts (1000+ lines)    │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Angular CLI logic (inline)   │ │
│  │  - Version fetching           │ │
│  │  - Command building           │ │
│  │  - Execution                  │ │
│  │  - Error handling             │ │
│  └───────────────────────────────┘ │
│                                     │
│  [All other project creation code] │
└─────────────────────────────────────┘

After (Feature-based):
┌─────────────────────────────────────┐
│       create.ts (cleaner, shorter)  │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ frameworkCliRegistry.find()   │ │
│  │ cli.create(options)           │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Other project creation code]     │
└──────────────┬──────────────────────┘
               │
               ↓
    ┌──────────────────────┐
    │  features/           │
    │  framework-cli/      │
    │                      │
    │  ├── angular-cli.ts  │ ← Isolated
    │  ├── react-cli.ts    │ ← Isolated
    │  ├── vue-cli.ts      │ ← Isolated
    │  └── slim-cli.ts     │ ← Isolated
    └──────────────────────┘
```

## Key Principles

1. **Single Responsibility**: Each CLI file handles one framework
2. **Open/Closed**: Open for extension, closed for modification
3. **Dependency Inversion**: create.ts depends on interface, not concrete implementations
4. **Interface Segregation**: Small, focused FrameworkCli interface
5. **Registry Pattern**: Centralized CLI management

## Summary

This architecture provides:
- ✅ Clean separation of concerns
- ✅ Easy to add new CLIs
- ✅ Framework-agnostic main code
- ✅ Type-safe and testable
- ✅ Scalable and maintainable
- ✅ Self-documenting code structure
