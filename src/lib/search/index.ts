import lunr, { type Index } from 'lunr'

// @ts-expect-error no type definitions available
import addStemmerSupport from 'lunr-languages/lunr.stemmer.support'
// @ts-expect-error no type definitions available
import addMultiLanguageSupport from 'lunr-languages/lunr.multi'
// @ts-expect-error no type definitions available
import addGermanSupport from 'lunr-languages/lunr.de'

addStemmerSupport(lunr)
addMultiLanguageSupport(lunr)
addGermanSupport(lunr)

export interface SearchData {
	results: SearchResult[]
	index: object
}

export interface SearchResult {
	type: 'BlogPost' | 'Person' | 'StaticPage'
	slug: string
	// use short variable names to reduce index size
	/** name */
	n: string
	/** content */
	c: string
	/** authors */
	a?: string
}

type Metadata = Record<string, Record<'n' | 'c' | 'a', object>>

export interface SearchResultExt extends SearchResult {
	metadata: Metadata
}

let index: Index
let indexMap: SearchResult[]

export function initSearchIndex(data: SearchData) {
	indexMap = data.results
	index = lunr.Index.load(data.index)
}

export function search(searchQuery: string): SearchResultExt[] {
	if (searchQuery.length < 2) return []

	const found = index.search(searchQuery)
	return found.map(f => ({ ...indexMap[+f.ref], metadata: f.matchData.metadata as Metadata }))
}
