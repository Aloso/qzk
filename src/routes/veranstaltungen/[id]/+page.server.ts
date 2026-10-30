import { getEvent } from '#backend/events/db.js'
import { wire2event } from '#lib/events/convert.js'
import type { Event } from '#lib/events/types.js'

export async function load({ params }): Promise<Event> {
	const event = await getEvent(params.id)

	// we assume the user is not authorized to see this
	delete event.submitter
	delete event.orgaNotes

	return wire2event<object>(event)
}
