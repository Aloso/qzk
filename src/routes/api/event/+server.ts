import { json } from '@sveltejs/kit'
import { addDraft, deleteEvent, putEvent } from '$lib/server/events/db'
import { parseEvent } from '$lib/server/events/event'
import { queryKey, queryState, tryAuthentication } from '$lib/server/events/http'
import { sanitizeHtml } from '$lib/utils/sanitize'
import { error } from '@sveltejs/kit'
import { getEvent } from '$lib/server/events/db'

// fetch
export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const isAdmin = tryAuthentication(request, platform.env)

	const params = new URL(request.url).searchParams
	const key = queryKey(params)
	const state = queryState(params)
	if (!key) error(400, 'Missing key')
	if (!state && !isAdmin) error(400, 'Missing state')

	const event = await getEvent(platform.env, key, state)
	if (!isAdmin && event.state !== 'draft') {
		delete event.submitter
		delete event.orgaNotes
	}
	return json(event)
}

// create draft
export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const event = parseEvent(await request.json())
	event.descDe = sanitizeHtml(event.descDe)
	if (!event.submitter) error(400, 'Missing submitter data')

	await addDraft(platform.env, event)
	return json(event)
}

// edit
export async function PUT({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const isAdmin = tryAuthentication(request, platform.env)

	const event = parseEvent(await request.json())
	if (!event.submitter) error(400, 'Missing submitter data')
	if (!isAdmin && event.state !== 'draft') {
		error(401, 'Keine Berechtigung')
	}

	event.key = queryKey(request) ?? event.key ?? error(400, 'Missing key')
	event.descDe = sanitizeHtml(event.descDe)

	await putEvent(platform.env, event, event.key)
	return json(event)
}

// delete
export async function DELETE({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		error(401, 'Keine Berechtigung')
	}

	const params = new URL(request.url).searchParams
	const key = queryKey(params) ?? error(400, 'Missing key')
	const state = queryState(params) ?? error(400, 'Missing state')

	await deleteEvent(platform.env, key, state)
	// await setEventState(platform.env, key, 'archived')
	return new Response('OK')
}
