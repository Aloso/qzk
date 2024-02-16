import { host } from '.'
import { authorizedHeaders, type Auth } from '..'
import type { Event } from '../types'

export async function publishDraft(key: string, auth: Auth): Promise<Event | null> {
	const url = new URL(host + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, {
		method: 'POST',
		headers: authorizedHeaders(auth),
	})
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
