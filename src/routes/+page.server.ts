import { loadAllBlogPosts, loadStatic } from '$lib/contentful/loader'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreview, StaticPage } from '$lib/data'

export const prerender = true

export interface Data {
	page: StaticPage
	posts: BlogPostPreview[]
}

export async function load(): Promise<Data> {
	const page = await loadStatic(null)
	const postItems = await loadAllBlogPosts({ limit: 2 })
	const posts = postItems.items.map(selectBlogPostPreview)

	return { page, posts }
}
