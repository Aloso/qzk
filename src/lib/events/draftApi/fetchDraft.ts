import type { Event } from '../types'

export async function fetchDraft(key: string): Promise<Event | null> {
	const url = new URL('https://events.queereszentrumkassel.de/draft')
	url.searchParams.set('key', key)

	const response = await fetch(url)
	if (!response.ok) {
		if (response.status === 404) {
			return null
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	const data = await response.json()
	return data
}
