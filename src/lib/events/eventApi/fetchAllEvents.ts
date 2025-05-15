import { host } from '.'
import { wire2event } from '../convert'
import type { Event, WireEvent } from '../types'

export async function fetchAllEvents(): Promise<Event[]> {
	const response = await fetch(host() + '/events')
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const events: WireEvent[] = await response.json()
	return events.map(wire2event)
}
