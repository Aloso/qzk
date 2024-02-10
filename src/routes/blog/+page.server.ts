import { loadAllBlogPosts } from '$lib/contentful/loader'
import { selectBlogPostPreview } from '$lib/contentful/selector/selectBlogPostPreview'
import type { BlogPostPreview } from '$lib/data'

export interface Data {
	posts: BlogPostPreview[]
}

export async function load(): Promise<Data> {
	const postItems = await loadAllBlogPosts({ limit: 20 })
	const posts = postItems.items.map(selectBlogPostPreview)
	return { posts }
}
