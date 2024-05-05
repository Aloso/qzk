import { loadAllBlogPosts, loadStatic } from '$lib/contentful/loader'
import { renderDataToString } from '$lib/contentful/render'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed, StaticPageTransformed } from '$lib/data'

export const prerender = true

export interface Data {
	page: StaticPageTransformed
	posts: BlogPostPreviewTransformed[]
}

export async function load(): Promise<Data> {
	const page = await loadStatic(null, 900)
	const postItems = await loadAllBlogPosts({ limit: 2 })
	const posts = postItems.items.map(selectBlogPostPreview)

	return {
		page,
		posts: posts.map(post => ({ ...post, teaser: renderDataToString(post.teaser, 700) })),
	}
}
