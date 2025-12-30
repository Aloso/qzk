import { json } from '@sveltejs/kit'
import { getAllEvents } from '$lib/server/events/db'
import { queryState, tryAuthentication } from '$lib/server/events/http'
import type { EventDto } from '$lib/server/events/event'
import { error } from '@sveltejs/kit'

// fetch all events
export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const isAdmin = tryAuthentication(request, platform.env)
	const state = isAdmin ? (queryState(request) ?? 'public') : 'public'

	const events: Partial<EventDto>[] = await getAllEvents(platform.env, {}, state)

	if (!isAdmin) {
		events.forEach(event => {
			delete event.submitter
			delete event.orgaNotes
		})
	}
	return json(events)
}
