import { loadBlogPost } from '$lib/contentful/loader'
import type { BlogPostView } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

interface UrlParams extends Record<string, string> {
	date: string
	slug: string
}

export async function load({ params }: LoadEvent<UrlParams>): Promise<BlogPostView> {
	const postItem = await loadBlogPost(params.date, params.slug)

	const { title, slug, published, photo, content, authors: authorItems } = postItem.fields
	const authors = authorItems.map((author) => {
		const { slug, name, role, photo } = author.fields
		return { slug, name, role, photo }
	})
	return { title, slug, published, photo, content, authors }
}
