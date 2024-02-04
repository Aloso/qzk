import { client } from '$lib/contentful'
import { error, type LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ slug: string }>) {
	const pages = await client.getEntries({
		content_type: 'staticPage',
		'fields.slug': params.slug,
	})

	if (pages.items.length === 0 || params.slug === 'index') {
		error(404, 'Not found')
	}

	return pages.items[0]
}
