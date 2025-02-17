import { json } from '@sveltejs/kit'
import { getAllEvents, getEventNumber } from '$lib/server/events/db'
import { authenticate, queryNumber } from '$lib/server/events/http'

/*
	The permissions for drafts are opposite to published event permissions:

	Everyone can create new drafts, edit and delete them. However, the `key` of drafts is a
	secret - only the creator of a draft knows it, therefore, editing or deleting a draft can
	only be done by the creator.

	The exception are authorized users (admins), who are the only ones who can fetch the
	list of drafts (including keys), and therefore edit/delete everything.
*/

interface Ctx {
	request: Request
	platform: App.Platform
}

// fetch all
export async function GET({ request, platform }: Ctx): Promise<Response> {
	authenticate(request, platform.env)

	const params = new URL(request.url).searchParams
	const start = queryNumber(params, 'start')
	const limit = queryNumber(params, 'limit')

	const length = await getEventNumber(platform.env, false)
	const events = await getAllEvents(platform.env, { start, limit }, false)
	return json({ length, events })
}
