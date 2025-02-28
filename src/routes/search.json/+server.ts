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
import data, { type RichText } from '$lib/contentful/data'
import sanitize from 'sanitize-html'

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
					new Date(post.fields.published).toLocaleDateString('de-DE', {
						timeZone: 'Europe/Berlin',
					}),
					post.fields.teaser,
					...processRichText(post.fields.content),
				]),
				a:
					'Von ' +
					post.fields.authorIds
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
					'Pronomen: ' + person.fields.pronouns,
					person.fields.role,
					...processRichText(person.fields.description ?? []),
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
				c: processRichText(staticPage.fields.content).join(' · '),
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
		default:
			return slug
	}
}

function makeContent(items: (string | undefined | null)[]): string {
	return items.filter(s => !!s).join(' · ')
}

function processRichText(richText: RichText): string[] {
	const output = richText
		.filter(c => typeof c === 'string')
		.map(html => sanitize(html, { allowedTags: [], textFilter: text => text + ' ' }))

	return output
}
