import { goto } from '$app/navigation'
import { localizeHref } from '$lib/paraglide/runtime'
import { host } from '.'

export async function publishDraft(key: string): Promise<boolean> {
	const response = await fetch(`${host()}/event/state?key=${key}&state=public`, { method: 'PUT' })
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
