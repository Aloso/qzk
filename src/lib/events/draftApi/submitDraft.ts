import { host } from '.'
import { event2wire, wire2event } from '../convert'
import type { Event, WireEvent, WithKey, WithSubmitter } from '../types'
import { formatErrors } from './errors'

export async function submitDraft(
	draft: Event & WithSubmitter,
): Promise<Event & WithSubmitter & WithKey> {
	draft.title = draft.title.trim()
	draft.submitter.name = draft.submitter.name.trim()
	draft.submitter.email = draft.submitter.email.trim()
	if (draft.organizer) {
		draft.organizer.email = draft.organizer.email?.trim() || undefined
		draft.organizer.phone = draft.organizer.phone?.trim() || undefined
		draft.organizer.website = draft.organizer.website?.trim() || undefined
	}

	const response = await fetch(host() + '/draft', {
		method: 'POST',
		body: JSON.stringify(event2wire(draft)),
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

	const created: WireEvent & WithSubmitter & WithKey = await response.json()
	return wire2event(created)
}
