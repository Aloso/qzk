import type { StaticPage } from '$lib/data'
import { client, type Entries } from '..'

export async function loadAllStatics(): Promise<Entries<StaticPage>> {
	const statics = await client.getEntries({
		content_type: 'staticPage',
	})

	return statics as unknown as Entries<StaticPage>
}
