import { goto } from '$app/navigation'
import type { EventState } from '$lib/server/events/event'
import { host } from '.'

export async function deleteEvent(key: string, state: EventState): Promise<boolean> {
	const response = await fetch(`${host()}/event?key=${key}&state=${state}`, { method: 'DELETE' })
	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else if (response.status === 401) {
			goto('/admin?m=loginFailed')
		} else {
			throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
				cause: response,
			})
		}
	}

	return true
}
