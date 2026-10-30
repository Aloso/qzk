import data from '#lib/contentful/data.js'
import { selectBlogPostPreview } from '#lib/contentful/selector/index.js'
import type { BlogPostPreviewTransformed } from '#lib/data/index.js'

export const prerender = true

export interface Data {
	posts: BlogPostPreviewTransformed[]
}

export async function load(): Promise<Data> {
	return {
		posts: data.blogPost.slice(0, 20).map(p => selectBlogPostPreview(p.fields)),
	}
}
