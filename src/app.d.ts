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

		type EnvVars = {
			[key in `USER__${string}`]: string
		}

		interface Platform {
			env: EnvVars & {
				DB: D1Database
			}
			context: {
				waitUntil(promise: Promise<unknown>): void
			}
			caches: CacheStorage & { default: Cache }
		}
	}

	interface Window {
		__searchInitialized?: boolean
		instgrm?: {
			Embeds: {
				process: () => void
			}
		}
	}
}

export {}
