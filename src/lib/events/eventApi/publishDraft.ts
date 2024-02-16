import { host } from '.'
import { authorizedHeaders, type Auth } from '..'

export async function publishDraft(key: string, auth: Auth): Promise<boolean> {
	const url = new URL(host + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, {
		method: 'POST',
		headers: authorizedHeaders(auth),
	})
	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	return true
}
