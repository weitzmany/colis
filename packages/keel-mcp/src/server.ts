#!/usr/bin/env node
/**
 * @colis/keel-mcp — MCP Server
 *
 * Provides AI assistants with authoritative knowledge about @colis/keel components
 * and @colis/hull theming.
 *
 * Start: node dist/server.js
 * Protocol: MCP over stdio
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { listComponents } from './tools/list-components.js';
import { getComponentApi } from './tools/get-component-api.js';
import { getComponentExamples } from './tools/get-component-examples.js';
import { getThemeTokens } from './tools/get-theme-tokens.js';
import { getThemeRecipes } from './tools/get-theme-recipes.js';
import { getStoryLinks } from './tools/get-story-links.js';
import { getDocsLinks } from './tools/get-docs-links.js';

const server = new Server(
  {
    name: 'keel-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_components',
      description:
        'List all @colis/keel components with their status (available or planned), selector, import path, and links.',
      inputSchema: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            enum: ['all', 'available', 'planned'],
            description: 'Filter by component status. Default: all',
          },
        },
      },
    },
    {
      name: 'get_component_api',
      description:
        'Get the full API for a specific @colis/keel component: all @Input() props, @Output() events, slots, and CSS tokens used.',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'Component selector (e.g. keel-button) or class name (e.g. KeelButtonComponent)',
          },
        },
        required: ['component'],
      },
    },
    {
      name: 'get_component_examples',
      description:
        'Get ready-to-paste Angular code examples for a @colis/keel component, with correct import, @Component decorator, and template.',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'Component selector or name (e.g. keel-button)',
          },
          variant: {
            type: 'string',
            description: 'Filter examples by variant (e.g. primary, secondary, danger)',
          },
        },
        required: ['component'],
      },
    },
    {
      name: 'get_theme_tokens',
      description:
        'Get --keel-* CSS custom property definitions with fallback defaults and @colis/hull Layer 1 values.',
      inputSchema: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['color', 'spacing', 'radius', 'typography', 'shadow', 'transition', 'z-index', 'focus'],
            description: 'Filter tokens by category',
          },
          name: {
            type: 'string',
            description: 'Get a specific token by name (e.g. --keel-color-primary)',
          },
        },
      },
    },
    {
      name: 'get_theme_recipes',
      description:
        'Get step-by-step instructions for common keel/hull setup tasks: installing keel only, adding hull, dark mode, and project branding.',
      inputSchema: {
        type: 'object',
        properties: {
          recipe: {
            type: 'string',
            enum: ['keel-only', 'with-hull', 'dark-mode', 'project-theme'],
            description: 'Specific recipe ID. Omit to list all available recipes.',
          },
        },
      },
    },
    {
      name: 'get_story_links',
      description:
        'Get Storybook story URLs for keel components or hull themes.',
      inputSchema: {
        type: 'object',
        properties: {
          component: {
            type: 'string',
            description: 'Component selector (e.g. keel-button) or "hull-themes" or "tokens"',
          },
        },
      },
    },
    {
      name: 'get_docs_links',
      description:
        'Get Colis documentation portal page links. Search by query or list all.',
      inputSchema: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query (e.g. "dark mode", "project theming", "install")',
          },
          path: {
            type: 'string',
            description: 'Exact docs path to look up (e.g. /design-system/hull/dark-mode)',
          },
        },
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const input = (args ?? {}) as Record<string, unknown>;

  try {
    let result: unknown;

    switch (name) {
      case 'list_components':
        result = listComponents(input as Parameters<typeof listComponents>[0]);
        break;
      case 'get_component_api':
        result = getComponentApi(input as unknown as Parameters<typeof getComponentApi>[0]);
        break;
      case 'get_component_examples':
        result = getComponentExamples(input as unknown as Parameters<typeof getComponentExamples>[0]);
        break;
      case 'get_theme_tokens':
        result = getThemeTokens(input as Parameters<typeof getThemeTokens>[0]);
        break;
      case 'get_theme_recipes':
        result = getThemeRecipes(input as Parameters<typeof getThemeRecipes>[0]);
        break;
      case 'get_story_links':
        result = getStoryLinks(input as Parameters<typeof getStoryLinks>[0]);
        break;
      case 'get_docs_links':
        result = getDocsLinks(input as Parameters<typeof getDocsLinks>[0]);
        break;
      default:
        return {
          content: [{ type: 'text', text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: 'text', text: `Error in tool '${name}': ${message}` }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('keel-mcp: fatal error', err);
  process.exit(1);
});
