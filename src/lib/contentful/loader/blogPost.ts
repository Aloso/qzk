import type { BlogPost } from '$lib/data'
import { error } from '@sveltejs/kit'
import { client, type Item } from '..'
import { withCache } from '../withCache'

export async function loadBlogPost(date: string, slug: string): Promise<Item<BlogPost>> {
	const blogPosts = await withCache(`blogPost-${date}-${slug}`, () =>
		client.getEntries({
			content_type: 'blogPost',
			'fields.published': date,
			'fields.slug': slug,
		}),
	)

	if (blogPosts.items.length === 0) {
		error(404, 'Not found')
	}

	return blogPosts.items[0] as unknown as Item<BlogPost>
}
