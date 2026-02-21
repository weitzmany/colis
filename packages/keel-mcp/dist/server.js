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
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { listComponents } from './tools/list-components.js';
import { getComponentApi } from './tools/get-component-api.js';
import { getComponentExamples } from './tools/get-component-examples.js';
import { getThemeTokens } from './tools/get-theme-tokens.js';
import { getThemeRecipes } from './tools/get-theme-recipes.js';
import { getStoryLinks } from './tools/get-story-links.js';
import { getDocsLinks } from './tools/get-docs-links.js';
import { reportIssue } from './tools/report-issue.js';
import { requestFeature } from './tools/request-feature.js';
import { listIssues } from './tools/list-issues.js';
import { closeIssue } from './tools/close-issue.js';
const server = new Server({
    name: 'keel-mcp',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
        {
            name: 'list_components',
            description: 'List all @colis/keel components with their status (available or planned), selector, import path, and links.',
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
            description: 'Get the full API for a specific @colis/keel component: all @Input() props, @Output() events, slots, and CSS tokens used.',
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
            description: 'Get ready-to-paste Angular code examples for a @colis/keel component, with correct import, @Component decorator, and template.',
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
            description: 'Get --keel-* CSS custom property definitions with fallback defaults and @colis/hull Layer 1 values.',
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
            description: 'Get step-by-step instructions for common keel/hull setup tasks: installing keel only, adding hull, dark mode, and project branding.',
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
            description: 'Get Storybook story URLs for keel components or hull themes.',
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
            description: 'Get Colis documentation portal page links. Search by query or list all.',
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
        {
            name: 'report_issue',
            description: 'File a bug report on the @colis packages GitHub repo (weitzmany/colis). The issue is attributed to the AI expert who found it. Always call list_issues first to avoid duplicates.',
            inputSchema: {
                type: 'object',
                properties: {
                    package: {
                        type: 'string',
                        description: 'The affected @colis package (e.g. @colis/keel, @colis/hull, @colis/rig)',
                    },
                    title: {
                        type: 'string',
                        description: 'Short, descriptive bug title',
                    },
                    description: {
                        type: 'string',
                        description: 'Full description: what happened, steps to reproduce, expected vs actual behaviour',
                    },
                    expert_name: {
                        type: 'string',
                        description: 'Name of the AI expert filing the issue (e.g. "Allison Foster")',
                    },
                    expert_role: {
                        type: 'string',
                        description: 'Role/expertise of the filer (e.g. "Accessibility Expert")',
                    },
                    project: {
                        type: 'string',
                        description: 'Name of the consuming project where the bug was found (optional)',
                    },
                    version: {
                        type: 'string',
                        description: 'Package version where the bug was observed (optional)',
                    },
                },
                required: ['package', 'title', 'description'],
            },
        },
        {
            name: 'request_feature',
            description: 'Create a feature request on the @colis packages GitHub repo (weitzmany/colis). Attributed to the AI expert requesting it.',
            inputSchema: {
                type: 'object',
                properties: {
                    package: {
                        type: 'string',
                        description: 'The target @colis package (e.g. @colis/keel)',
                    },
                    title: {
                        type: 'string',
                        description: 'Short, descriptive feature request title',
                    },
                    use_case: {
                        type: 'string',
                        description: 'Why is this needed? What problem does it solve?',
                    },
                    expert_name: {
                        type: 'string',
                        description: 'Name of the AI expert filing the request',
                    },
                    expert_role: {
                        type: 'string',
                        description: 'Role/expertise of the filer',
                    },
                    project: {
                        type: 'string',
                        description: 'Name of the consuming project that needs this feature (optional)',
                    },
                    proposed_solution: {
                        type: 'string',
                        description: 'Optional suggestion on how to implement the feature',
                    },
                },
                required: ['package', 'title', 'use_case'],
            },
        },
        {
            name: 'list_issues',
            description: 'List open issues on the @colis packages GitHub repo. Filter by package, type, or status. Call this before filing a new issue to check for duplicates.',
            inputSchema: {
                type: 'object',
                properties: {
                    package: {
                        type: 'string',
                        description: 'Filter by package (e.g. keel or @colis/keel)',
                    },
                    type: {
                        type: 'string',
                        enum: ['bug', 'feature-request', 'question'],
                        description: 'Filter by issue type',
                    },
                    status: {
                        type: 'string',
                        enum: ['open', 'in-progress', 'resolved', 'awaiting-confirmation'],
                        description: 'Filter by status label',
                    },
                    limit: {
                        type: 'number',
                        description: 'Max issues to return (default 25)',
                    },
                },
            },
        },
        {
            name: 'close_issue',
            description: 'Close a @colis GitHub issue after confirming a fix works. Only the original opener (consuming project) should call this. Optionally add a closing comment.',
            inputSchema: {
                type: 'object',
                properties: {
                    issue_number: {
                        type: 'number',
                        description: 'GitHub issue number to close',
                    },
                    comment: {
                        type: 'string',
                        description: 'Optional comment to add before closing (e.g. "Confirmed fixed in v0.2.1")',
                    },
                },
                required: ['issue_number'],
            },
        },
    ],
}));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const input = (args ?? {});
    try {
        let result;
        switch (name) {
            case 'list_components':
                result = listComponents(input);
                break;
            case 'get_component_api':
                result = getComponentApi(input);
                break;
            case 'get_component_examples':
                result = getComponentExamples(input);
                break;
            case 'get_theme_tokens':
                result = getThemeTokens(input);
                break;
            case 'get_theme_recipes':
                result = getThemeRecipes(input);
                break;
            case 'get_story_links':
                result = getStoryLinks(input);
                break;
            case 'get_docs_links':
                result = getDocsLinks(input);
                break;
            case 'report_issue':
                result = reportIssue(input);
                break;
            case 'request_feature':
                result = requestFeature(input);
                break;
            case 'list_issues':
                result = listIssues(input);
                break;
            case 'close_issue':
                result = closeIssue(input);
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
    }
    catch (error) {
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
//# sourceMappingURL=server.js.map