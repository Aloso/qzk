import { loadAuthor, loadAllBlogPosts } from '$lib/contentful/loader'
import type { LoadEvent } from '@sveltejs/kit'

export async function load({ params }: LoadEvent<{ slug: string }>) {
	const { fields: author, sys } = await loadAuthor(params.slug)
	const posts = await loadAllBlogPosts({ authorId: sys.id })

	return { author, posts }
}
