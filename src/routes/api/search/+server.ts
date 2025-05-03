import { error, json } from '@sveltejs/kit'
import { algoliasearch, type Algoliasearch } from 'algoliasearch'

let client: Algoliasearch

export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!client) {
		client = algoliasearch(platform.env.ALGOLIA_APP_ID, platform.env.ALGOLIA_API_KEY)
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

	return json(results)
}
