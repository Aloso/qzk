import { loadStatic } from '$lib/contentful/loader'
import type { LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ slug: string }>) {
	return loadStatic(params.slug, 900)
}
