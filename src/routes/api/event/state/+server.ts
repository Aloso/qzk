import { setEventState } from '$lib/server/events/db'
import { queryKey, queryState, tryAuthentication } from '$lib/server/events/http'
import { error } from '@sveltejs/kit'

// publish/unpublish/archive/unarchive
export async function PUT({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		return error(401, 'Keine Berechtigung')
	}

	const params = new URL(request.url).searchParams
	const key = queryKey(params)
	const state = queryState(params)
	if (!key) error(401, 'Missing key')
	if (!state) error(401, 'Missing state')

	await setEventState(platform.env, key, state)
	return new Response('OK')
}
