import data from '$lib/contentful/data'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed } from '$lib/data'

export interface Data {
	posts: BlogPostPreviewTransformed[]
}

export async function load(): Promise<Data> {
	return {
		posts: data.blogPost.slice(0, 20).map(p => selectBlogPostPreview(p.fields)),
	}
}
