import { host } from '.'
import { authorizedHeaders, type Auth } from '..'
import { formatErrors } from '../draftApi/errors'
import type { Event } from '../types'

export async function updateEvent(auth: Auth, event: Event, key: string): Promise<Event> {
	const url = new URL(host + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, {
		method: 'PUT',
		headers: authorizedHeaders(auth),
		body: JSON.stringify(event),
	})
	if (!response.ok) {
		if (response.status === 400) {
			const json = await response.json()
			throw new Error(formatErrors(json), { cause: json })
		} else {
			throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
				cause: response,
			})
		}
	}
	const created = await response.json()
	return created
}
