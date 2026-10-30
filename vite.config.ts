import adapterCloudflare from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit({
			// https://kit.svelte.dev/docs/integrations#preprocessors
			preprocess: vitePreprocess(),
			compilerOptions: { experimental: { async: true } },
			experimental: { remoteFunctions: true },
			// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
			// If your environment is not supported or you settled on a specific environment, switch out the adapter.
			// See https://kit.svelte.dev/docs/adapters for more information about adapters.
			adapter: adapterCloudflare({
				routes: {
					include: [
						'/',
						'/__data.json',
						'/api/*',
						'/veranstaltungen',
						'/veranstaltungen/*',
						'/admin/*',
						'/en/',
						'/en/__data.json',
						'/en/veranstaltungen',
						'/en/veranstaltungen/*',
						'/en/admin/*',
					],
					exclude: [],
				},
			}),
		}),

		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'preferredLanguage', 'baseLocale'],
			disableAsyncLocalStorage: true,
		}),
	],
	server: { port: 4506 },
})
