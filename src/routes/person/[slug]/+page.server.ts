import { loadPerson, loadAllBlogPosts } from '$lib/contentful/loader'
import { renderDataToString } from '$lib/contentful/render'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { PersonTransformed, BlogPostPreviewTransformed } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'

export interface Data {
	person: PersonTransformed
	posts: BlogPostPreviewTransformed[]
	totalPosts: number
}

export async function load({ params }: LoadEvent<{ slug: string }>): Promise<Data> {
	const { fields: person, sys } = await loadPerson(params.slug)
	const postEntries = await loadAllBlogPosts({ authorIds: [sys.id] })
	const posts = postEntries.items.map(selectBlogPostPreview)
	return {
		person: {
			...person,
			description: person.description ? renderDataToString(person.description, 700) : undefined,
		},
		posts: posts.map(post => ({ ...post, teaser: renderDataToString(post.teaser, 700) })),
		totalPosts: postEntries.total,
	}
}
