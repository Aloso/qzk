import z from 'zod'

import { addFeedback } from '#backend/feedback.js'
import { form, getRequestEvent } from '$app/server'

const feedbackSchema = z.object({
	emotion: z.int().min(-2).max(2),
	textResponse: z.string(),
})

export type FeedbackV1 = z.infer<typeof feedbackSchema>

export const postFeedback = form(feedbackSchema, async feedback => {
	const { cookies } = getRequestEvent()

	const feedbackId = await addFeedback('v1', feedback)

	cookies.set('feedback_v1', JSON.stringify({ id: feedbackId, date: Date.now() }), {
		maxAge: 365 * 24 * 60 * 60, // 1 year
		path: '/',
		sameSite: 'strict',
		httpOnly: true,
	})

	return { success: true }
})
