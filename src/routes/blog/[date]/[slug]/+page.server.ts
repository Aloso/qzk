import { client } from '$lib/contentful'
import type { LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ date: string; slug: string }>) {
	const posts = await client.getEntries({
		content_type: 'blogPost',
		'fields.published': params.date,
		'fields.slug': params.slug,
	})

	return posts.items[0].fields
}
