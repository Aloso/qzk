import { loadAuthor, loadAllBlogPosts } from '$lib/contentful/loader'
import { selectBlogPostPreview } from '$lib/contentful/selector/selectBlogPostPreview'
import type { Author, BlogPostPreview } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

export interface Data {
	author: Author
	posts: BlogPostPreview[]
	totalPosts: number
}

export async function load({ params }: LoadEvent<{ slug: string }>): Promise<Data> {
	const { fields: author, sys } = await loadAuthor(params.slug)
	const postEntries = await loadAllBlogPosts({ authorIds: [sys.id] })
	const posts = postEntries.items.map(selectBlogPostPreview)
	return { author, posts, totalPosts: postEntries.total }
}
