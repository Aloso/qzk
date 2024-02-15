import type { Event } from '../types'

export async function editDraft(draft: Event, key: string): Promise<boolean> {
	const url = new URL('https://events.queereszentrumkassel.de/drafts')
	url.searchParams.set('key', key)
	const response = await fetch(url, { method: 'PUT', body: JSON.stringify(draft) })

	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	return true
}
