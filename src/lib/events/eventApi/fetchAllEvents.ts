import { host } from '.'
import { authorizedHeaders, type Auth } from '..'
import type { Event, Submitter } from '../types'

export interface EventNoSubmitter extends Omit<Event, 'submitter'> {
	submitter?: Submitter
}

export async function fetchAllEvents(auth?: Auth): Promise<EventNoSubmitter[]> {
	const response = await fetch(
		host + '/events',
		auth ? { headers: authorizedHeaders(auth) } : undefined,
	)
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const events = await response.json()
	return events
}
