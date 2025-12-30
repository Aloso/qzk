import data from '$lib/contentful/data.js'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed, GeneralInfoTransformed } from '$lib/data'
import type { Event } from '$lib/events/types.js'
import { error } from '@sveltejs/kit'
import { getAllEvents } from '$lib/server/events/db.js'
import { wire2event } from '$lib/events/convert.js'
import { getEndOfTime } from '$lib/events/intersections.js'

export interface Data {
	generalInfo: GeneralInfoTransformed
	posts: BlogPostPreviewTransformed[]
	events: Event[]
}

export async function load({ platform }): Promise<Data> {
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

	return {
		generalInfo: data.generalInfo,
		posts: data.blogPost.slice(0, 2).map(blogPost => selectBlogPostPreview(blogPost.fields)),
		events,
	}
}
