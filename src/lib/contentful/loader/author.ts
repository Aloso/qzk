import type { Author } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client, type Item } from '..'

export async function loadAuthor(slug: string): Promise<Item<Author>> {
	const authors = await client.getEntries({
		content_type: 'author',
		'fields.slug': slug,
	})

	if (authors.items.length === 0) {
		error(404, 'Not found')
	}

	return authors.items[0] as unknown as Item<Author>
}
