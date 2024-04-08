import { loadAllBlogPosts } from '$lib/contentful/loader'
import { renderData } from '$lib/contentful/render'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed } from '$lib/data'

export interface Data {
	posts: BlogPostPreviewTransformed[]
}

export async function load(): Promise<Data> {
	const postItems = await loadAllBlogPosts({ limit: 20 })
	const posts = postItems.items.map(selectBlogPostPreview)
	return { posts: posts.map(post => ({ ...post, teaser: renderData(post.teaser, 700) })) }
}
