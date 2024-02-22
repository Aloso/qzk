import { loadAllBlogPosts, loadStatic } from '$lib/contentful/loader'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreview, StaticPage } from '$lib/data'

export interface Data {
	content: StaticPage
	posts: BlogPostPreview[]
}

export async function load(): Promise<Data> {
	const content = await loadStatic(null)
	const postItems = await loadAllBlogPosts({ limit: 2 })
	const posts = postItems.items.map(selectBlogPostPreview)
	return { content, posts }
}
