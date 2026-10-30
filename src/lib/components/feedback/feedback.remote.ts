import { error } from '@sveltejs/kit'
import z from 'zod'

import { addFeedback } from '#backend/feedback.js'
import { form, getRequestEvent } from '$app/server'

const feedbackSchema = z.object({
	emotion: z.int().min(-2).max(2),
	textResponse: z.string(),
})

export type FeedbackV1 = z.infer<typeof feedbackSchema>

export const postFeedback = form(feedbackSchema, async feedback => {
	const { platform, cookies } = getRequestEvent()
	if (!platform) error(500, 'Platform not available')

	const feedbackId = await addFeedback(platform.env, 'v1', feedback)

	cookies.set('feedback_v1', JSON.stringify({ id: feedbackId, date: Date.now() }), {
		maxAge: 365 * 24 * 60 * 60, // 1 year
		path: '/',
		sameSite: 'strict',
		httpOnly: true,
	})

	return { success: true }
})
