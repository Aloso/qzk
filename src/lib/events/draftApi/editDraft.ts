import { host } from '.'
import type { Event } from '../types'
import { formatErrors } from './errors'

export async function editDraft(draft: Event, key: string): Promise<boolean> {
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
	return true
}
