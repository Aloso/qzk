import type { Event, WireEvent, WithSubmitter } from '$lib/events/types'
import { getEventOrDraft } from '$lib/server/events/db.js'
import { error } from '@sveltejs/kit'
import { wire2event } from '$lib/events/convert.js'

export interface Data {
	event: Event
	isPublished: boolean
}

type PartialEvent = WireEvent & Partial<WithSubmitter>

export async function load({ params, platform }): Promise<Data> {
	if (!platform) {
		error(500, 'Platform not available')
	}

	const { event, isPublished }: { event: PartialEvent; isPublished: boolean } =
		await getEventOrDraft(platform.env, params.id)

	// Authentication only works via the `Authorization` header, so we have to
	// assume the user is not authorized to see this
	delete event.submitter
	delete event.orgaNotes

	return { event: wire2event(event), isPublished }
}
