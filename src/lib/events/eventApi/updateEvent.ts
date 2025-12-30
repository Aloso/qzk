import type { EventDto } from '$lib/server/events/event'
import { host } from '.'
import { event2wire, wire2event } from '../convert'
import { formatErrors } from './errors'
import type { Event, WithSubmitter } from '../types'

export async function updateEvent(
	event: Event & WithSubmitter,
	key: string,
): Promise<(Event & WithSubmitter) | false> {
	const response = await fetch(`${host()}/event?key=${key}`, {
		method: 'PUT',
		body: JSON.stringify(event2wire(event)),
	})
	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else if (response.status === 400) {
			const json = await response.json()
			throw new Error(formatErrors(json), { cause: json })
		} else {
			throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
				cause: response,
			})
		}
	}
	const created: EventDto & WithSubmitter = await response.json()
	return wire2event(created)
}
