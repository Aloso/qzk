import { loadAuthor, loadAllBlogPosts } from '$lib/contentful/loader'
import { renderData } from '$lib/contentful/render'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { AuthorTransformed, BlogPostPreviewTransformed } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

export interface Data {
	author: AuthorTransformed
	posts: BlogPostPreviewTransformed[]
	totalPosts: number
}

export async function load({ params }: LoadEvent<{ slug: string }>): Promise<Data> {
	const { fields: author, sys } = await loadAuthor(params.slug)
	const postEntries = await loadAllBlogPosts({ authorIds: [sys.id] })
	const posts = postEntries.items.map(selectBlogPostPreview)
	return {
		author: { ...author, description: renderData(author.description, 700) },
		posts: posts.map(post => ({ ...post, teaser: renderData(post.teaser, 700) })),
		totalPosts: postEntries.total,
	}
}
