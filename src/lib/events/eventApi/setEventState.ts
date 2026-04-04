import { goto } from '$app/navigation'
import type { EventState } from '$backend/events/event'
import { localizeHref } from '$lib/paraglide/runtime'
import { host } from '.'

export async function setEventState(key: string, state: EventState): Promise<boolean> {
	const response = await fetch(`${host()}/event/state?key=${key}&state=${state}`, { method: 'PUT' })
	if (!response.ok) {
		if (response.status === 401) {
			void goto(localizeHref('/admin?m=loginFailed'))
		} else if (response.status === 404) {
			return false
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	return true
}
