import type { StaticPage } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client } from '..'

export async function loadStatic(slug: string | null): Promise<StaticPage> {
	if (slug === 'index') {
		error(404, 'Not found')
	}

	const pages = await client.getEntries({
		content_type: 'staticPage',
		'fields.slug': slug ?? 'index',
	})

	if (pages.items.length === 0) {
		error(404, 'Not found')
	}

	return pages.items[0].fields as unknown as StaticPage
}
