import adapterCloudflare from '@sveltejs/adapter-cloudflare'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// https://kit.svelte.dev/docs/integrations#preprocessors
	preprocess: vitePreprocess(),

	kit: {
		env: {
			publicPrefix: 'VITE_PUBLIC_',
		},

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
	},
}

export default config
