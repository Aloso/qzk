import { json } from '@sveltejs/kit'
import { putEvent, setEventPublished } from '$lib/server/events/db'
import { parseEvent } from '$lib/server/events/event'
import { authenticate, queryKey } from '$lib/server/events/http'
import { sanitizeHtml } from '$lib/utils/sanitize'

/*
	Everyone can fetch the list of published events. Only authorized users (admins) can
	edit published events, and (un)publish events.
*/

interface Ctx {
	request: Request
	platform: App.Platform
}

// publish
export async function POST({ request, platform }: Ctx): Promise<Response> {
	authenticate(request, platform.env)

	const key = queryKey(request)
	if (!key) {
		throw new Response('Missing key', { status: 401 })
	}
	await setEventPublished(platform.env, key, true)
	return new Response('OK')
}

// edit
export async function PUT({ request, platform }: Ctx): Promise<Response> {
	authenticate(request, platform.env)

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

// unpublish
export async function DELETE({ request, platform }: Ctx): Promise<Response> {
	authenticate(request, platform.env)

	const key = queryKey(request)
	if (!key) {
		throw new Response('Missing key', { status: 401 })
	}
	await setEventPublished(platform.env, key, false)
	return new Response('OK')
}
