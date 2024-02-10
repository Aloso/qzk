import { loadAllBlogPosts } from '$lib/contentful/loader'
import type { BlogPostPreview } from '$lib/data'

export interface Data {
	posts: BlogPostPreview[]
}

export async function load(): Promise<Data> {
	const postItems = await loadAllBlogPosts({ limit: 20 })
	const posts = postItems.items.map((post) => {
		const { title, slug, published, photo, teaser, authors: authorItems } = post.fields
		const authors = authorItems.map((author) => {
			const { slug, name, role, photo } = author.fields
			return { slug, name, role, photo }
		})
		return { title, slug, published, photo, teaser, authors }
	})

	return { posts }
}
