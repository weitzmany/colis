// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Colis Docs',
			description: 'Documentation for the @colis ecosystem — component library, theming, tooling, and more.',
			social: [],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Package Overview', slug: 'getting-started/packages' },
					],
				},
				{
					label: 'Design System',
					items: [
						{
							label: 'Getting Started',
							items: [
								{ label: 'Installation', slug: 'design-system/getting-started/installation' },
								{ label: 'Without Hull', slug: 'design-system/getting-started/without-hull' },
								{ label: 'With Hull', slug: 'design-system/getting-started/with-hull' },
							],
						},
						{
							label: 'Keel — Components',
							items: [
								{ label: 'Overview', slug: 'design-system/keel/overview' },
								{ label: 'Token Contract', slug: 'design-system/keel/token-contract' },
							],
						},
						{
							label: 'Hull — Theming',
							items: [
								{ label: 'Overview', slug: 'design-system/hull/overview' },
								{ label: 'Three-Layer Architecture', slug: 'design-system/hull/architecture' },
								{ label: 'Dark Mode', slug: 'design-system/hull/dark-mode' },
								{ label: 'Project Theming', slug: 'design-system/hull/project-theming' },
							],
						},
						{
							label: 'MCP — AI Assistant',
							items: [
								{ label: 'Overview', slug: 'design-system/mcp/overview' },
								{ label: 'Setup in Cursor', slug: 'design-system/mcp/setup-cursor' },
								{ label: 'Tool Reference', slug: 'design-system/mcp/tool-reference' },
							],
						},
					],
				},
				{
					label: 'Packages',
					items: [
						{ label: '@colis/rig', slug: 'packages/rig' },
						{ label: '@colis/logbook', slug: 'packages/logbook' },
						{ label: '@colis/embark', slug: 'packages/embark' },
						{ label: '@colis/deck', slug: 'packages/deck' },
						{ label: '@colis/shipyard', slug: 'packages/shipyard' },
					],
				},
			],
		}),
	],
});
