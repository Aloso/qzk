// See https://kit.svelte.dev/docs/types#app

import type { WireEvent } from '$lib/events/types'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		__searchInitialized?: boolean
		__fetchEventsPromise?: Promise<WireEvent[]>
		instgrm?: {
			Embeds: {
				process: () => void
			}
		}
	}
}

export {}
