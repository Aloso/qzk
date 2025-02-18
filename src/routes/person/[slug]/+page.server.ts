import data from '$lib/contentful/data'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { PersonTransformed, BlogPostPreviewTransformed } from '$lib/data'
import { error, type LoadEvent } from '@sveltejs/kit'

export const prerender = true

export interface Data {
	person: PersonTransformed
	posts: BlogPostPreviewTransformed[]
	totalPosts: number
}

export async function load({ params }: LoadEvent<{ slug: string }>): Promise<Data> {
	const person = data.person.find(p => p.fields.slug === params.slug)
	if (!person) error(404)

	const postEntries = data.blogPost.filter(p => p.fields.authorIds.includes(person.sys.id))
	const posts = postEntries
		.slice(0, 20)
		.map(e => e.fields)
		.map(selectBlogPostPreview)
	return {
		person: person.fields,
		posts: posts,
		totalPosts: postEntries.length,
	}
}
