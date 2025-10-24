import { goto } from '$app/navigation'
import { localizeHref } from '$lib/paraglide/runtime'
import { host } from '.'

export async function deleteEvent(key: string): Promise<void> {
	const url = new URL(host() + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, { method: 'DELETE' })
	if (!response.ok) {
		if (response.status === 401) {
			void goto(localizeHref('/admin?m=loginFailed'))
		} else {
			throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
				cause: response,
			})
		}
	}
}
