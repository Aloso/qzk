import { v4 as uuidv4 } from 'uuid'
import sanitizeHtml from 'sanitize-html'
import { queryKey } from '$lib/server/events/http'
import { json } from '@sveltejs/kit'
import { addEvent, getEvent, putEvent, deleteEvent } from '$lib/server/events/db'
import { parseEvent } from '$lib/server/events/event'
import { error } from '@sveltejs/kit'

/*
	The permissions for drafts are opposite to published event permissions:

	Everyone can create new drafts, edit and delete them. However, the `key` of drafts is a
	secret - only the creator of a draft knows it, therefore, editing or deleting a draft can
	only be done by the creator.

	The exception are authorized users (admins), who are the only ones who can fetch the
	list of drafts (including keys), and therefore edit/delete everything.
*/

// fetch
export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const key = queryKey(request)
	if (!key) {
		return new Response('Missing key', { status: 401 })
	}

	const draft = await getEvent(platform.env, key, false)
	return json(draft)
}

// create
export async function POST({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const event = parseEvent(await request.json())
	const key = uuidv4()
	event.key = key
	event.descHtml = sanitizeHtml(event.descHtml)

	await addEvent(platform.env, key, event, false)
	return json(event)
}

// edit
export async function PUT({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const key = queryKey(request)
	if (!key) {
		return new Response('Missing key', { status: 401 })
	}

	const event = parseEvent(await request.json())
	event.key = key
	event.descHtml = sanitizeHtml(event.descHtml)

	await putEvent(platform.env, key, event, false)
	return json(event)
}

// delete
export async function DELETE({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const key = queryKey(request)
	if (!key) {
		return new Response('Missing key', { status: 401 })
	}

	await deleteEvent(platform.env, key, false)
	return new Response('OK')
}
