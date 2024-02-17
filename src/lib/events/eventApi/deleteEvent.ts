import { host } from '.'
import { authorizedHeaders, type Auth } from '..'

export async function deleteEvent(auth: Auth, key: string): Promise<void> {
	const url = new URL(host + '/event')
	url.searchParams.set('key', key)

	const response = await fetch(url, {
		method: 'DELETE',
		headers: authorizedHeaders(auth),
	})
	if (!response.ok) {
		throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
			cause: response,
		})
	}
}
