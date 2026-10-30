import { tryAuthentication } from '#backend/events/http.js'
import { getAllFeedback, type DbFeedback } from '#backend/feedback.js'
import { error } from '@sveltejs/kit'

export interface Data {
	feedback: DbFeedback[]
}

export async function load({ request }): Promise<Data> {
	if (!tryAuthentication(request)) {
		error(401, 'Keine Berechtigung')
	}

	const feedback = await getAllFeedback('v1')

	return { feedback }
}
