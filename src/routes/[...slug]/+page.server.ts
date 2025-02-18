import data from '$lib/contentful/data.js'
import type { StaticPageTransformed } from '$lib/data/index.js'
import { error, type LoadEvent } from '@sveltejs/kit'

export const prerender = true

// This tells SvelteKit to pre-render the following pages, which aren't linked to from anywhere
export function entries() {
	return [
		{ slug: 'newsletter/double-opt-in' },
		{ slug: 'newsletter/angemeldet' },
		{ slug: 'newsletter/abgemeldet' },
	]
}

export async function load({
	params,
}: LoadEvent<{ slug: string }>): Promise<StaticPageTransformed> {
	return data.staticPage.find(s => s.fields.slug === params.slug)?.fields ?? error(404)
}
