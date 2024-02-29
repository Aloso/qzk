import { host } from '.'
import type { Event } from '../types'
import { formatErrors } from './errors'

export async function updateDraft(draft: Event, key: string): Promise<Event | false> {
	const url = new URL(host + '/draft')
	url.searchParams.set('key', key)
	const response = await fetch(url, { method: 'PUT', body: JSON.stringify(draft) })

	if (!response.ok) {
		if (response.status === 404) {
			return false
		} else if (response.status === 400) {
			const json = await response.json()
			throw new Error(formatErrors(json), { cause: json })
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}

	const created = await response.json()
	return created
}
