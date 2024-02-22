import type { BlogPost, BlogPostPreview } from '$lib/data'
import type { Item } from '..'
import { selectAuthorPreview } from '.'

export function selectBlogPostPreview(blogPost: Item<BlogPost>): BlogPostPreview {
	const { title, slug, published, photo, teaser, authors: authorItems } = blogPost.fields
	const authors = authorItems.map(selectAuthorPreview)
	return { title, slug, published, photo, teaser, authors }
}
