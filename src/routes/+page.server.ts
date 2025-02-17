import data from '$lib/contentful/data.js'
import { selectBlogPostPreview } from '$lib/contentful/selector'
import type { BlogPostPreviewTransformed, GeneralInfoTransformed } from '$lib/data'
import type { Event } from '$lib/events/types.js'
import { error } from '@sveltejs/kit'
import { getAllEvents } from '$lib/server/events/db.js'
import { wire2event } from '$lib/events/convert.js'

export interface Data {
	generalInfo: GeneralInfoTransformed
	posts: BlogPostPreviewTransformed[]
	events: Event[]
}

export async function load({ platform }): Promise<Data> {
	if (!platform) {
		error(500, 'Platform not available')
	}

	const events = await getAllEvents(platform.env, {}, true)

	return {
		generalInfo: data.generalInfo,
		posts: data.blogPost.slice(0, 2).map(blogPost => selectBlogPostPreview(blogPost.fields)),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		events: events.map(({ submitter, orgaNotes, ...rest }) => rest).map(wire2event),
	}
}
