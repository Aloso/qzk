import { goto } from '$app/navigation'
import { host } from '.'

export async function publishDraft(key: string): Promise<boolean> {
	const url = new URL(host() + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, { method: 'POST' })
	if (!response.ok) {
		if (response.status === 401) {
			goto('/admin?m=loginFailed')
		} else if (response.status === 404) {
			return false
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	return true
}
