// See https://kit.svelte.dev/docs/types#app

import type { D1Database } from '@cloudflare/workers-types'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}

		type EnvVars = { [key in `USER__${string}`]: string } & {
			DB: D1Database
			ALGOLIA_APP_ID: string
			ALGOLIA_API_KEY: string
		}

		interface Platform {
			env: EnvVars
			context: {
				waitUntil(promise: Promise<unknown>): void
			}
			caches: CacheStorage & { default: Cache }
		}
	}

	interface Window {
		instgrm?: {
			Embeds: {
				process: () => void
			}
		}
	}
}

export {}
