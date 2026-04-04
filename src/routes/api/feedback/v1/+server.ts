import { addFeedback } from '$backend/feedback.js'
import { error } from '@sveltejs/kit'
import z from 'zod'

export interface FeedbackV1 {
	emotion: number
	textResponse: string
}

const feedbackSchema = z.object({
	emotion: z.int().min(-2).max(2),
	textResponse: z.string()
})

export async function POST({ request, platform,  }): Promise<Response> {
	if (!platform) error(500, 'Platform not available')

	const feedback: FeedbackV1 = feedbackSchema.decode(await request.json())

	const feedbackId = await addFeedback(platform.env, 'v1', feedback)

	return new Response(null, {
		status: 201,
		headers: {
			'Set-Cookie': `feedback_v1=${feedbackId}; Max-Age=${365 * 24 * 60 * 60}; Path=/; SameSite=Strict`,
		},
	})
}
