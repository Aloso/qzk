import { json } from '@sveltejs/kit'
import { deleteEvent, putEvent, setEventPublished } from '$lib/server/events/db'
import { parseEvent } from '$lib/server/events/event'
import { queryKey, tryAuthentication } from '$lib/server/events/http'
import { sanitizeHtml } from '$lib/utils/sanitize'
import { error } from '@sveltejs/kit'

/*
	Everyone can fetch the list of published events. Only authorized users (admins) can
	edit published events, and (un)publish events.
*/

// publish
export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return error(401, 'Keine Berechtigung')
	}

	const key = queryKey(request)
	if (!key) {
		throw new Response('Missing key', { status: 401 })
	}
	await setEventPublished(platform.env, key, true)
	return new Response('OK')
}

// edit
export async function PUT({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return error(401, 'Keine Berechtigung')
	}

	const event = parseEvent(await request.json())
	const key = queryKey(request) ?? event.key
	if (!key) {
		throw new Response('Missing key', { status: 401 })
	}
	event.key = key
	event.descHtml = sanitizeHtml(event.descHtml)

	await putEvent(platform.env, key, event, true)
	return json(event)
}

// delete
export async function DELETE({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return error(401, 'Keine Berechtigung')
	}

	const key = queryKey(request)
	if (!key) {
		throw new Response('Missing key', { status: 401 })
	}
	await deleteEvent(platform.env, key, true)
	// await setEventPublished(platform.env, key, false)
	return new Response('OK')
}
