import { host } from '.'
import { event2wire, wire2event } from '../convert'
import { formatErrors } from '../draftApi/errors'
import type { Event, WireEvent, WithSubmitter } from '../types'

export async function updateEvent(
	event: Event & WithSubmitter,
	key: string,
): Promise<Event & WithSubmitter> {
	const url = new URL(host() + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify(event2wire(event)),
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
	const created: WireEvent & WithSubmitter = await response.json()
	return wire2event(created)
}
