// See https://kit.svelte.dev/docs/types#app

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
	}
}

declare module 'cloudflare:workers' {
	import type { D1Database } from '@cloudflare/workers-types'

	export const env: { [key: `USER_${string}`]: string } & {
		DB: D1Database
	}
}
