import { json } from '@sveltejs/kit'
import { getAllEvents } from '$lib/server/events/db'
import { tryAuthentication } from '$lib/server/events/http'
import type { Event } from '$lib/server/events/event'

/*
	Everyone can fetch the list of published events. Only authorized users (admins) can
	edit published events, and (un)publish events.
*/

interface Ctx {
	request: Request
	platform: App.Platform
}

// fetch all
export async function GET({ request, platform }: Ctx): Promise<Response> {
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
