import { getCookies } from '$backend/cookie'
import { getAllEvents } from '$backend/events/db'
import data from '$lib/contentful/data'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed, GeneralInfoTransformed } from '$lib/data'
import { wire2event } from '$lib/events/convert'
import { getEndOfTime } from '$lib/events/intersections'
import type { Event } from '$lib/events/types'
import { error } from '@sveltejs/kit'

export interface Data {
	generalInfo: GeneralInfoTransformed
	posts: BlogPostPreviewTransformed[]
	events: Event[]
	showFeedback: boolean
}

export async function load({ platform, request }): Promise<Data> {
	if (!platform) {
		error(500, 'Platform not available')
	}

	const eventsRaw = await getAllEvents(platform.env, {}, 'public')

	const eventsParsed = eventsRaw
		.map(({ submitter: _0, orgaNotes: _1, ...rest }) => rest)
		.map<Event>(wire2event)

	const now = Date.now()
	const inOneMonth = now + 30 * 24 * 60 * 60 * 1000
	// const events = eventsParsed.filter(e => {
	// 	const filteredTimes = (Array.isArray(e.time) ? e.time : [e.time]).filter(
	// 		time => +time.start < inOneMonth && getEndOfTime(time) > now,
	// 	)
	// 	e.time = filteredTimes
	// 	return e.time.length > 0
	// })
	const events = eventsParsed.map(e => {
		e.allTimes = e.times
		e.times = e.allTimes.filter(time => +time.start < inOneMonth && getEndOfTime(time) > now)
		if (e.times.length === 0) {
			e.descDe = ''
		}
		return e
	})
	events.sort((a, b) => {
		const aTime = a.times[0] ?? a.allTimes![0]
		const bTime = b.times[0] ?? b.allTimes![0]
		return +aTime.start - +bTime.start
	})

	const { feedback_v1 } = getCookies(request.headers)

	return {
		generalInfo: data.generalInfo,
		posts: data.blogPost.slice(0, 2).map(blogPost => selectBlogPostPreview(blogPost.fields)),
		events,
		showFeedback: feedback_v1 == null,
	}
}
