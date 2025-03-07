import { getEventOrDraft } from '$lib/server/events/db'
import { queryKey, tryAuthentication } from '$lib/server/events/http'
import { error, json } from '@sveltejs/kit'

// fetch
export async function GET({ request, platform }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const key = queryKey(request)
	if (!key) throw new Response('Missing key', { status: 401 })

	const isAdmin = tryAuthentication(request, platform.env)

	const { event, isPublished } = await getEventOrDraft(platform.env, key)
	if (isPublished && !isAdmin) {
		error(401)
	}
	return json(event)
}
