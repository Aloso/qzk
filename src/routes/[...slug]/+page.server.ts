import { loadStatic } from '$lib/contentful/loader'
import type { LoadEvent } from '@sveltejs/kit'

// This tells SvelteKit to pre-render the following pages, which aren't linked to from anywhere
export function entries() {
	return [
		{ slug: 'newsletter/double-opt-in' },
		{ slug: 'newsletter/angemeldet' },
		{ slug: 'newsletter/abgemeldet' },
	]
}

export async function load({ params }: LoadEvent<{ slug: string }>) {
	return loadStatic(params.slug, 900)
}
