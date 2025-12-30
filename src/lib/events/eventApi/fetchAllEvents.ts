import type { EventDto, EventState } from '$lib/server/events/event'
import { host } from '.'
import { wire2event } from '../convert'
import type { Event } from '../types'

export async function fetchAllEvents(state: EventState): Promise<Event[]> {
	const response = await fetch(`${host()}/event/list?state=${state}`)
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const events: EventDto[] = await response.json()
	return events.map(wire2event)
}
