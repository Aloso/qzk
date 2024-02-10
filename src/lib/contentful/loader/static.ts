import type { StaticPage } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client, type Item } from '..'

export async function loadStatic(slug: string | null): Promise<Item<StaticPage>> {
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

	return pages.items[0] as unknown as Item<StaticPage>
}
