import { host } from '.'
import type { Event } from '../types'
import { formatErrors } from './errors'

export async function submitDraft(draft: Event): Promise<Event> {
	const response = await fetch(host + '/draft', {
		method: 'POST',
		body: JSON.stringify(draft),
	})
	if (!response.ok) {
		if (response.status === 400) {
			const json = await response.json()
			throw new Error(formatErrors(json), { cause: json })
		} else {
			throw new Error(`request unsuccessful: ${response.status} ${response.statusText}`, {
				cause: response,
			})
		}
	}

	const created = await response.json()
	return created
}
