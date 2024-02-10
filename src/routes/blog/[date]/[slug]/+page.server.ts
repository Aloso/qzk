import { loadBlogPost } from '$lib/contentful/loader'
import type { LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ date: string; slug: string }>) {
	return loadBlogPost(params.date, params.slug)
}
