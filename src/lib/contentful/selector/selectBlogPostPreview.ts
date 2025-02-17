import type { BlogPost, BlogPostPreview } from '$lib/data'
import { selectPersonPreview } from '.'
import data from '../data'

export function selectBlogPostPreview(blogPost: BlogPost): BlogPostPreview {
	const { title, slug, published, photo, teaser, authorIds } = blogPost
	const authors = authorIds.map(id => {
		const person = data.person.find(p => p.sys.id === id)
		if (!person) throw new Error(`Person with id ${id} not found`)
		return selectPersonPreview(person.fields)
	})
	return { title, slug, published, photo, teaser, authors }
}
