import { getEvent } from '$backend/events/db'
import { wire2event } from '$lib/events/convert'
import type { Event } from '$lib/events/types'
import { error } from '@sveltejs/kit'

export async function load({ params, platform }): Promise<Event> {
	if (!platform) {
		error(500, 'Platform not available')
	}

	const event = await getEvent(platform.env, params.id)

	// we assume the user is not authorized to see this
	delete event.submitter
	delete event.orgaNotes

	return wire2event<object>(event)
}
