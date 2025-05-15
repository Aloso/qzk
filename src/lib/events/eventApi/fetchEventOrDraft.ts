import { host } from '.'
import { wire2event } from '../convert'
import type { Event, WireEvent, WithSubmitter } from '../types'
import { goto } from '$app/navigation'

export async function fetchEventOrDraft(key: string): Promise<Event & WithSubmitter> {
	const url = new URL(host() + '/eventOrDraft')
	url.searchParams.set('key', key)

	const response = await fetch(url)
	if (!response.ok) {
		if (response.status === 401) {
			goto('/admin?m=loginFailed')
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	const wireEvent: WireEvent = await response.json()
	const event = wire2event(wireEvent)
	return event as Event & WithSubmitter
}
