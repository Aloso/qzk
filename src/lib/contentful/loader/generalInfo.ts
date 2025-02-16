import type { GeneralInfo } from '$lib/data'
import { client, type Item } from '..'
import { withCache } from '../withCache'

export async function loadGeneralInfo(): Promise<Item<GeneralInfo>> {
	const entries = await withCache('generalInfo', () =>
		client.getEntries({ content_type: 'generalInfo' }),
	)

	if (entries.items.length !== 1) {
		throw new Error(`expected 1 item of type 'generalInfo', got ${entries.items.length}`)
	}

	return entries.items[0] as unknown as Item<GeneralInfo>
}
