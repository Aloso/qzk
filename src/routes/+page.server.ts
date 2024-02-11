import { client, ids } from '$lib/contentful'

export const csr = false

export async function load() {
	const page = await client.getEntry(ids.home)
	return page
}
