import { host } from '.'
import type { Event } from '../types'

export async function fetchAllEvents(): Promise<Event[]> {
	const response = await fetch(host + '/events')
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const events = await response.json()
	return events
}
