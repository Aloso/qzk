import type { StaticPage } from '$lib/data'
import { client, type Entries } from '..'
import { withCache } from '../withCache'

export async function loadAllStatics(): Promise<Entries<StaticPage>> {
	const statics = await withCache('allStatics', () =>
		client.getEntries({ content_type: 'staticPage' }),
	)

	return statics as unknown as Entries<StaticPage>
}
