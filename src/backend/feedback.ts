import { error } from '@sveltejs/kit'
import { v4 as uuidv4 } from 'uuid'

export interface DbFeedback {
	id: string
	formId: string
	created: number
	jsonData: string
	notes?: string
}

type Env = App.Platform['env']

export async function addFeedback(env: Env, formId: string, feedback: object): Promise<string> {
	const id = uuidv4()

	const result = await env.DB.prepare(
		`INSERT INTO feedback (id, formId, created, jsonData, notes) VALUES (?1, ?2, ?3, ?4, ?5)`,
	)
		.bind(id, formId, +new Date(), JSON.stringify(feedback), null)
		.run()
	if (!result.success) {
		error(500, 'Failed to save feedback')
	}

	return id
}

export async function getAllFeedback(env: Env, formId: string): Promise<DbFeedback[]> {
	const query = 'SELECT * FROM feedback WHERE formId = ?'
	const { results } = await env.DB.prepare(query).bind(formId).all<DbFeedback>()
	return results
}
