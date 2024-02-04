import { client } from '$lib/contentful'
import type { Item } from '$lib/contentful/types'
import type { Author } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ slug: string }>) {
	const authors = await client.getEntries({
		content_type: 'author',
		'fields.slug': params.slug,
	})

	const { fields: author, sys } = authors.items[0] as unknown as Item<Author>

	const posts = await client.getEntries({
		content_type: 'blogPost',
		'fields.authors.sys.id': sys.id,
	})

	return { author, posts }
}
