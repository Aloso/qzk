import { host } from '.'
import { wire2event } from '../convert'
import type { Event, WireEvent, WithSubmitter } from '../types'

export async function fetchDraft(key: string): Promise<(Event & WithSubmitter) | null> {
	const url = new URL(host() + '/draft')
	url.searchParams.set('key', key)

	const response = await fetch(url)
	if (!response.ok) {
		if (response.status === 404) {
			return null
		} else {
			throw new Error('request unsuccessful: ' + response.status, { cause: response })
		}
	}
	const data: WireEvent & WithSubmitter = await response.json()
	return wire2event(data)
}
