import type { Entries, Item } from '$lib/contentful'
import { loadAllBlogPosts, loadBlogPost } from '$lib/contentful/loader'
import { selectAuthorPreview } from '$lib/contentful/selector/selectAuthorPreview'
import { selectBlogPostPreview } from '$lib/contentful/selector/selectBlogPostPreview'
import type { Author, BlogPost, BlogPostView } from '$lib/data'
import type { LoadEvent } from '@sveltejs/kit'
import type { Tag } from 'contentful'

interface UrlParams extends Record<string, string> {
	date: string
	slug: string
}

export async function load({ params }: LoadEvent<UrlParams>): Promise<BlogPostView> {
	const postItem = await loadBlogPost(params.date, params.slug)
	const { title, slug, published, photo, content, authors: authorItems } = postItem.fields
	const authors = authorItems.map(selectAuthorPreview)

	const tags = postItem.metadata?.tags.map((tag) => tag.sys.id) ?? []
	const authorIds = postItem.fields.authors.map((a) => a.sys.id)

	const acc: Accumulator = {
		authorIds: new Set(authorIds),
		tags: new Set(tags),
		existingPostIds: new Set([postItem.sys.id]),
		posts: [],
	}

	if (tags.length) {
		filterAndScoreAndAddToPosts(acc, await loadAllBlogPosts({ limit: 20, tags }))
	}
	filterAndScoreAndAddToPosts(acc, await loadAllBlogPosts({ limit: 6, authorIds }))
	if (acc.posts.length < 5) {
		filterAndScoreAndAddToPosts(acc, await loadAllBlogPosts({ limit: 6 }))
	}

	acc.posts.sort(([, score1], [, score2]) => score2 - score1)
	const related = acc.posts.map(([post]) => selectBlogPostPreview(post)).slice(0, 5)

	return { title, slug, published, photo, content, authors, related }
}

interface Accumulator {
	readonly tags: Set<string>
	readonly authorIds: Set<string>
	existingPostIds: Set<string>
	posts: ScoredBlogPost[]
}

type ScoredBlogPost = readonly [Item<BlogPost>, number]

function filterAndScoreAndAddToPosts(acc: Accumulator, posts: Entries<BlogPost>) {
	posts.items.forEach((post) => {
		if (!acc.existingPostIds.has(post.sys.id)) {
			acc.existingPostIds.add(post.sys.id)

			const score =
				countMatchingTags(acc.tags, post.metadata?.tags) +
				countMatchingAuthors(acc.authorIds, post.fields.authors)
			acc.posts.push([post, score])
		}
	})
}

function countMatchingTags(tags: Set<string>, reference?: Tag[]) {
	let n = 0
	reference?.forEach((tag) => {
		if (tags.has(tag.sys.id)) {
			n += 1
		}
	})
	return n
}

function countMatchingAuthors(authorIds: Set<string>, reference: Item<Author>[]) {
	let n = 0
	reference.forEach((item) => {
		if (authorIds.has(item.sys.id)) {
			n += 1
		}
	})
	return n
}
