// https://joyofcode.xyz/blazing-fast-sveltekit-search

import type { SearchResult } from '$lib/search'
import { json } from '@sveltejs/kit'

import lunr from 'lunr'
// @ts-expect-error no type definitions available
import addStemmerSupport from 'lunr-languages/lunr.stemmer.support'
// @ts-expect-error no type definitions available
import addMultiLanguageSupport from 'lunr-languages/lunr.multi'
// @ts-expect-error no type definitions available
import addGermanSupport from 'lunr-languages/lunr.de'
import data from '$lib/contentful/data'

addStemmerSupport(lunr)
addMultiLanguageSupport(lunr)
addGermanSupport(lunr)

export const prerender = true

export async function GET() {
	const results = await getSearchResults()
	const index = createSearchIndex(results)
	return json({ results, index })
}

async function getSearchResults(): Promise<SearchResult[]> {
	return [
		...data.blogPost.map(
			(post): SearchResult => ({
				type: 'BlogPost',
				slug: `blog/${post.fields.published}/${post.fields.slug}`,
				n: post.fields.title,
				c: makeContent([
					new Date(post.fields.published).toLocaleDateString(),
					post.fields.teaser,
					...post.fields.content.filter(c => typeof c === 'string'),
				]),
				a: post.fields.authorIds
					.map(id => data.person.find(p => p.sys.id === id)!.fields.name)
					.join(', '),
			}),
		),
		...data.person.map(
			(person): SearchResult => ({
				type: 'Person',
				slug: `person/${person.fields.slug}`,
				n: person.fields.name,
				c: makeContent([
					person.fields.pronouns,
					person.fields.role,
					...(person.fields.description?.filter(d => typeof d === 'string') ?? []),
				]),
			}),
		),
		...data.staticPage.flatMap((staticPage): SearchResult | never[] => {
			const slug = getStaticSlug(staticPage.fields.slug)
			if (slug == null) return []
			return {
				type: 'StaticPage',
				slug,
				n: staticPage.fields.name,
				c: staticPage.fields.content.filter(c => typeof c === 'string').join('\n'),
			}
		}),
	]
}

function createSearchIndex(data: SearchResult[]) {
	return lunr(function () {
		// @ts-expect-error no type definitions available
		this.use(lunr.multiLanguage('en', 'de'))

		this.field('n', { boost: 3 }) // name
		this.field('a', { boost: 2 }) // authors
		this.field('c', { boost: 1 }) // content

		data.forEach((result, id) => {
			this.add({ ...result, id })
		})
	}).toJSON()
}

function getStaticSlug(slug: string): string | null {
	switch (slug) {
		case 'index':
			return ''
		case 'planen/eingereicht':
			return null
		default:
			return slug
	}
}

function makeContent(items: (string | undefined | null)[]): string {
	return items.filter(s => !!s).join(' · ')
}
