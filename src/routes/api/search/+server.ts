import { ALGOLIA_API_KEY, ALGOLIA_APP_ID } from '$app/env/private'
import { algoliasearch, type Algoliasearch } from 'algoliasearch'

let client: Algoliasearch

export async function GET({ request }): Promise<Response> {
	if (!client) {
		client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY)
	}

	const url = new URL(request.url)
	const query = url.searchParams.get('q') ?? ''
	const page = url.searchParams.get('page') ?? '0'

	const results = await client.search({
		requests: [
			{
				indexName: 'queereszentrumkassel_de_pages',
				query,
				attributesToSnippet: ['description', 'textContent'],
				attributesToHighlight: ['title', 'authors'],
				attributesToRetrieve: ['objectId'],
				hitsPerPage: 25,
				page: Number.isNaN(page) ? 1 : Number(page),
			},
		],
	})

	return Response.json(results)
}
