import { Entry, EntrySkeletonType, type ContentfulClientApi } from 'contentful'

export async function fetchContentfulEntries(
	client: ContentfulClientApi<undefined>,
	pageSize = 100,
) {
	const items: Entry<EntrySkeletonType>[] = []

	for (let page = 0; ; page += 1) {
		const entries = await client.withAllLocales.getEntries({
			skip: page * pageSize,
			limit: pageSize,
		})
		items.push(...entries.items)
		if (entries.total <= (page + 1) * pageSize) {
			break
		}
	}

	return items
}
