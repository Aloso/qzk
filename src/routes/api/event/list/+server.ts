import { getAllEvents } from '#backend/events/db.js'
import type { EventDto } from '#backend/events/event.js'
import { queryState, tryAuthentication } from '#backend/events/http.js'

// fetch all events
export async function GET({ request }): Promise<Response> {
	const isAdmin = tryAuthentication(request)
	const state = isAdmin ? (queryState(request) ?? 'public') : 'public'

	const events: Partial<EventDto>[] = await getAllEvents({}, state)

	if (!isAdmin) {
		events.forEach(event => {
			delete event.submitter
			delete event.orgaNotes
		})
	}
	return Response.json(events)
}
