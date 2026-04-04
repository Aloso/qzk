import { tryAuthentication } from '$backend/events/http'
import { getAllFeedback, type DbFeedback } from '$backend/feedback.js'
import { error } from '@sveltejs/kit'

export interface Data {
	feedback: DbFeedback[]
}

export async function load({ platform, request }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		error(401, 'Keine Berechtigung')
	}

	const feedback = await getAllFeedback(platform.env, 'v1')

	return { feedback }
}
