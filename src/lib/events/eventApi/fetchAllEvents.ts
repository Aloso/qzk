import { host } from '.'
import { authorizedHeaders, type Auth } from '..'
import { wire2event } from '../convert'
import type { Event, WireEvent, WithSubmitter } from '../types'

export async function fetchAllEvents(): Promise<Event[]>
export async function fetchAllEvents(auth: Auth): Promise<(Event & WithSubmitter)[]>
export async function fetchAllEvents(auth?: Auth): Promise<Event[]> {
	const response = await fetch(
		host() + '/events',
		auth ? { headers: authorizedHeaders(auth) } : undefined,
	)
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const events: WireEvent[] = await response.json()
	return events.map(wire2event)
}
