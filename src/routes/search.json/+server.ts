// https://joyofcode.xyz/blazing-fast-sveltekit-search

import { loadAllBlogPosts, loadAllPersons, loadAllStatics } from '$lib/contentful/loader'
import { renderData } from '$lib/contentful/render'
import type { SearchResult } from '$lib/search'
import type { Document } from '@contentful/rich-text-types'
import { json } from '@sveltejs/kit'
import { htmlToText, type SelectorDefinition } from 'html-to-text'

import lunr from 'lunr'
// @ts-expect-error no type definitions available
import addStemmerSupport from 'lunr-languages/lunr.stemmer.support'
// @ts-expect-error no type definitions available
import addMultiLanguageSupport from 'lunr-languages/lunr.multi'
// @ts-expect-error no type definitions available
import addGermanSupport from 'lunr-languages/lunr.de'

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
	const [blogPosts, persons, statics] = await Promise.all([
		loadAllBlogPosts({}),
		loadAllPersons(),
		loadAllStatics(),
	])

	return [
		...blogPosts.items.map(
			(post): SearchResult => ({
				type: 'BlogPost',
				slug: `blog/${post.fields.published}/${post.fields.slug}`,
				n: post.fields.title,
				c: makeContent([
					new Date(post.fields.published).toLocaleDateString(),
					render(post.fields.teaser),
					render(post.fields.content),
				]),
				a: post.fields.authors.map(a => a.fields.name).join(', '),
			}),
		),
		...persons.items.map(
			(person): SearchResult => ({
				type: 'Person',
				slug: `person/${person.fields.slug}`,
				n: person.fields.name,
				c: makeContent([
					person.fields.pronouns,
					person.fields.role,
					person.fields.description ? render(person.fields.description) : undefined,
				]),
			}),
		),
		...statics.items.flatMap((staticPage): SearchResult | never[] => {
			const slug = getStaticSlug(staticPage.fields.slug)
			if (slug == null) return []
			return {
				type: 'StaticPage',
				slug,
				n: staticPage.fields.name,
				c: render(staticPage.fields.content),
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

const selectors: SelectorDefinition[] = [
	...['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(selector => ({ selector, format: 'block' })),
	{ selector: 'a', format: 'inline' },
	{ selector: 'hr', format: 'skip' },
]

function render(doc: Document): string {
	return htmlToText(renderData(doc, 900), { wordwrap: null, selectors }).replace(/\n{2,}/g, ' · ')
}

function makeContent(items: (string | undefined | null)[]): string {
	return items.filter(s => !!s).join(' · ')
}
