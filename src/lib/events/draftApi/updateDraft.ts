import { host } from '.'
import { event2wire, wire2event } from '../convert'
import type { Event, WireEvent, WithSubmitter } from '../types'
import { formatErrors } from './errors'

export async function updateDraft(
	draft: Event & WithSubmitter,
	key: string,
): Promise<(Event & WithSubmitter) | false> {
	const url = new URL(host + '/draft')
	url.searchParams.set('key', key)
	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify(event2wire(draft)),
	})

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

	const created: WireEvent & WithSubmitter = await response.json()
	return wire2event(created)
}
