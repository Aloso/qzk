import { client } from '$lib/contentful'

export async function load() {
	const posts = await client.getEntries({
		content_type: 'blogPost',
		limit: 20,
		order: ['fields.published'],
	})

	return posts
}
