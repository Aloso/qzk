import { host } from '.'
import { wire2event } from '../convert'
import type { Event, WithSubmitter } from '../types'
import { goto } from '$app/navigation'
import { localizeHref } from '$lib/paraglide/runtime'
import type { EventDto } from '$lib/server/events/event'

export async function fetchEventForAdmin(key: string): Promise<Event & WithSubmitter> {
	const response = await fetch(`${host()}/event?key=${key}`)
	if (!response.ok) {
		if (response.status === 401) {
			void goto(localizeHref('/admin?m=loginFailed'))
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	const wireEvent: EventDto = await response.json()
	const event = wire2event(wireEvent)
	return event as Event & WithSubmitter
}
