import { authorizedHeaders, type Auth } from '.'
import type { DraftData } from './types'

export async function fetchDrafts(auth: Auth, start?: number, limit?: number): Promise<DraftData> {
	const url = new URL('https://events.queereszentrumkassel.de/drafts')
	if (start) url.searchParams.set('start', String(start))
	if (limit) url.searchParams.set('limit', String(limit))

	const response = await fetch(url, { headers: authorizedHeaders(auth) })
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const data = await response.json()
	return data
}
