import type { EventDto } from '$lib/server/events/event'
import { host } from '.'
import { event2wire, wire2event } from '../convert'
import type { Event, WithKey, WithSubmitter } from '../types'
import { formatErrors } from './errors'

export async function submitDraft(
	draft: Event & WithSubmitter,
): Promise<Event & WithSubmitter & WithKey> {
	draft.titleDe = draft.titleDe.trim()
	draft.submitter.name = draft.submitter.name.trim()
	draft.submitter.email = draft.submitter.email.trim()
	draft.organizer.name = draft.organizer.name?.trim() || undefined
	draft.organizer.email = draft.organizer.email?.trim() || undefined
	draft.organizer.phone = draft.organizer.phone?.trim() || undefined
	draft.organizer.website = draft.organizer.website?.trim() || undefined

	const response = await fetch(`${host()}/event`, {
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

	const created: EventDto & WithSubmitter & WithKey = await response.json()
	return wire2event(created)
}
