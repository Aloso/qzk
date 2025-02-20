import { json } from '@sveltejs/kit'
import { getAllEvents } from '$lib/server/events/db'
import { tryAuthentication } from '$lib/server/events/http'
import type { Event } from '$lib/server/events/event'
import { error } from '@sveltejs/kit'

/*
	Everyone can fetch the list of published events. Only authorized users (admins) can
	edit published events, and (un)publish events.
*/

// fetch all
export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const events: Partial<Event>[] = await getAllEvents(platform.env, {}, true)

	const authenticated = tryAuthentication(request, platform.env)
	if (!authenticated) {
		events.forEach(event => {
			delete event.submitter
			delete event.orgaNotes
			// delete event.key
		})
	}
	return json(events)
}
