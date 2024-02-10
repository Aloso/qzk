import { loadAuthor, loadAllBlogPosts } from '$lib/contentful/loader'
import type { Author, BlogPostPreview } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

export interface Data {
	author: Author
	posts: BlogPostPreview[]
	totalPosts: number
}

export async function load({ params }: LoadEvent<{ slug: string }>): Promise<Data> {
	const { fields: author, sys } = await loadAuthor(params.slug)
	const postItems = await loadAllBlogPosts({ authorId: sys.id })

	const posts = postItems.items.map((post) => {
		const { title, slug, published, photo, teaser, authors: authorItems } = post.fields
		const authors = authorItems.map((author) => {
			const { slug, name, role, photo } = author.fields
			return { slug, name, role, photo }
		})
		return { title, slug, published, photo, teaser, authors }
	})

	return { author, posts, totalPosts: postItems.total }
}
