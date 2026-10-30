import { addDraft, deleteEvent, getEvent, putEvent } from '#backend/events/db.js'
import { parseEvent } from '#backend/events/event.js'
import { queryKey, queryState, tryAuthentication } from '#backend/events/http.js'
import { sanitizeHtml } from '#lib/utils/sanitize.js'
import { error } from '@sveltejs/kit'

// fetch
export async function GET({ request }): Promise<Response> {
	const isAdmin = tryAuthentication(request)

	const params = new URL(request.url).searchParams
	const key = queryKey(params)
	const state = queryState(params)
	if (!key) error(400, 'Missing key')
	if (!state && !isAdmin) error(400, 'Missing state')

	const event = await getEvent(key, state)
	if (!isAdmin && event.state !== 'draft') {
		delete event.submitter
		delete event.orgaNotes
	}
	return Response.json(event)
}

// create draft
export async function POST({ request }): Promise<Response> {
	const event = parseEvent(await request.json())
	event.descDe = sanitizeHtml(event.descDe)
	if (!event.submitter) error(400, 'Missing submitter data')

	await addDraft(event)
	return Response.json(event)
}

// edit
export async function PUT({ request }): Promise<Response> {
	const isAdmin = tryAuthentication(request)

	const event = parseEvent(await request.json())
	if (!event.submitter) error(400, 'Missing submitter data')
	if (!isAdmin && event.state !== 'draft') {
		error(401, 'Keine Berechtigung')
	}

	event.key = queryKey(request) ?? event.key ?? error(400, 'Missing key')
	event.descDe = sanitizeHtml(event.descDe)

	await putEvent(event, event.key)
	return Response.json(event)
}

// delete
export async function DELETE({ request }): Promise<Response> {
	if (!tryAuthentication(request)) {
		error(401, 'Keine Berechtigung')
	}

	const params = new URL(request.url).searchParams
	const key = queryKey(params) ?? error(400, 'Missing key')
	const state = queryState(params) ?? error(400, 'Missing state')

	await deleteEvent(key, state)
	// await setEventState(key, 'archived')
	return new Response('OK')
}
