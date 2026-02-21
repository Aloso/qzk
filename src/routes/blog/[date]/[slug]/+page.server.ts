import data, { type BlogPost } from '$lib/contentful/data'
import { selectPersonPreview, selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostViewTransformed } from '$lib/data'
import { error, type LoadEvent } from '@sveltejs/kit'

export const prerender = true

interface UrlParams extends Record<string, string> {
	date: string
	slug: string
}

export async function load({ params }: LoadEvent<UrlParams>): Promise<BlogPostViewTransformed> {
	const postItem =
		data.blogPost.find(p => p.fields.published === params.date && p.fields.slug === params.slug) ??
		error(404)
	const { title, slug, published, photo, content, authorIds } = postItem.fields
	const authors = authorIds.map(id => {
		const person = data.person.find(p => p.sys.id === id)
		if (!person) error(404)
		return selectPersonPreview(person.fields)
	})

	const tags = postItem.tags ?? []

	const acc: Accumulator = {
		authorIds: new Set(authorIds),
		tags: new Set(tags),
		existingPostIds: new Set([postItem.sys.id]),
		posts: [],
	}

	if (tags.length) {
		filterAndScoreAndAddToPosts(acc, findPostsWithTags(data.blogPost, tags))
	}
	filterAndScoreAndAddToPosts(acc, findPostsFromAuthors(data.blogPost, authorIds))
	if (acc.posts.length < 5) {
		filterAndScoreAndAddToPosts(acc, data.blogPost.slice(0, 5))
	}

	acc.posts.sort(([, score1], [, score2]) => score2 - score1)
	const related = acc.posts.map(([post]) => selectBlogPostPreview(post.fields)).slice(0, 5)

	return {
		title,
		slug,
		published,
		photo,
		parts: content,
		authors,
		related: related.map(related => ({
			...related,
			teaser: related.teaser,
		})),
		lang: 'de',
	}
}

interface Accumulator {
	readonly tags: Set<string>
	readonly authorIds: Set<string>
	existingPostIds: Set<string>
	posts: ScoredBlogPost[]
}

type ScoredBlogPost = readonly [BlogPost, number]

function filterAndScoreAndAddToPosts(acc: Accumulator, posts: BlogPost[]) {
	posts.forEach(post => {
		if (!acc.existingPostIds.has(post.sys.id)) {
			acc.existingPostIds.add(post.sys.id)

			const score =
				countMatchingTags(acc.tags, post.tags) +
				countMatchingAuthors(acc.authorIds, post.fields.authorIds)
			acc.posts.push([post, score])
		}
	})
}

function countMatchingTags(tags: Set<string>, reference?: string[]) {
	let n = 0
	reference?.forEach(tag => {
		if (tags.has(tag)) {
			n += 1
		}
	})
	return n
}

function countMatchingAuthors(authorIds: Set<string>, reference: string[]) {
	let n = 0
	reference.forEach(item => {
		if (authorIds.has(item)) {
			n += 1
		}
	})
	return n
}

function findPostsWithTags(posts: BlogPost[], tags: string[]) {
	return posts.filter(p => p.tags?.some(t => tags.includes(t))).slice(0, 20)
}

function findPostsFromAuthors(posts: BlogPost[], authorIds: string[]) {
	return posts.filter(p => p.fields.authorIds.some(id => authorIds.includes(id))).slice(0, 6)
}
