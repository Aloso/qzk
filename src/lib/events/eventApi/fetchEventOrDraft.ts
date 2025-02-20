import { error } from '@sveltejs/kit'
import { host } from '.'
import { authorizedHeaders, type Auth } from '..'
import { wire2event } from '../convert'
import type { Event, WireEvent, WithSubmitter } from '../types'

export async function fetchEventOrDraft(key: string, auth?: Auth): Promise<Event & WithSubmitter> {
	const url = new URL(host() + '/eventOrDraft')
	url.searchParams.set('key', key)

	const response = await fetch(url, auth ? { headers: authorizedHeaders(auth) } : undefined)
	if (!response.ok) {
		throw new Error('request unsuccessful: ' + response.status, { cause: response })
	}
	const wireEvent: WireEvent = await response.json()
	const event = wire2event(wireEvent)
	if ('submitter' in event) {
		return event as Event & WithSubmitter
	} else {
		error(401, 'Du darfst diese Veranstaltung nicht bearbeiten')
	}
}
