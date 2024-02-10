import { loadBlogPost } from '$lib/contentful/loader'
import { selectAuthorPreview } from '$lib/contentful/selector/selectAuthorPreview'
import type { BlogPostView } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

interface UrlParams extends Record<string, string> {
	date: string
	slug: string
}

export async function load({ params }: LoadEvent<UrlParams>): Promise<BlogPostView> {
	const postItem = await loadBlogPost(params.date, params.slug)
	const { title, slug, published, photo, content, authors: authorItems } = postItem.fields
	const authors = authorItems.map(selectAuthorPreview)
	return { title, slug, published, photo, content, authors }
}
