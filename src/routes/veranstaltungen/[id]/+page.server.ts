import type { Event } from '$lib/events/types'
import { getEvent } from '$lib/server/events/db.js'
import { error } from '@sveltejs/kit'
import { wire2event } from '$lib/events/convert.js'

export interface Data {
	event: Event
	isPublished: boolean
}

export async function load({ params, platform }): Promise<Data> {
	if (!platform) {
		error(500, 'Platform not available')
	}

	const event = await getEvent(platform.env, params.id)

	// we assume the user is not authorized to see this
	delete event.submitter
	delete event.orgaNotes

	return { event: wire2event(event), isPublished: event.state === 'public' }
}
