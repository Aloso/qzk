import { wire2event } from '$lib/events/convert'
import { getEndOfTime, getInBetween } from '$lib/events/intersections'
import type { Event, Time, WithSubmitter } from '$lib/events/types'
import { getAllEvents, getEventNumber } from '$lib/server/events/db'
import { tryAuthentication } from '$lib/server/events/http'
import { error } from '@sveltejs/kit'

export interface Data {
	type: 'drafts' | 'published' | 'past' | 'months'
	page: number
	maxPage: number
	count: number
	monthStart?: string
	events: (Event & WithSubmitter)[]
}

const limit = 24

export async function load({ params, platform, request }): Promise<Data> {
	if (!platform) error(500, 'Platform not available')

	if (!tryAuthentication(request, platform.env)) {
		error(401, 'Keine Berechtigung')
	}

	const type = params.type as string

	switch (type) {
		case 'drafts':
		case 'published':
		case 'past':
		case 'months': {
			const page = Number(params.page)
			if (Number.isNaN(page) && params.type !== 'months') {
				error(400, `Expected number in URL, got ${params.page}`)
			}

			const { length, events } = await getEvents(
				platform.env,
				type,
				(page - 1) * limit,
				params.page,
			)
			if (type === 'months') {
				return { type, page: 1, maxPage: 1, count: length, events, monthStart: params.page }
			} else {
				return { type, page, maxPage: Math.ceil(length / limit), count: length, events }
			}
		}
		default:
			error(400, 'Ungültige URL')
	}
}

async function getEvents(
	env: App.Platform['env'],
	type: 'drafts' | 'published' | 'past' | 'months',
	start: number,
	month: string,
): Promise<{ length: number; events: (Event & WithSubmitter)[] }> {
	if (type === 'drafts') {
		const length = await getEventNumber(env, false)
		const events = await getAllEvents(env, { start, limit }, false)
		return { length, events: events.map(wire2event) }
	} else if (type === 'published') {
		const now = Date.now()
		const events = await getAllEvents(env, { start: 0 }, true)
		const filteredEvents = events
			.map(wire2event)
			.map(event => ({
				...event,
				allTimes: event.time,
				time: event.time.filter(time => getEndOfTime(time) > now),
			}))
			.filter(event => event.time.length > 0)
			.toSorted((a, b) => getSortTime(a) - getSortTime(b))

		return {
			length: filteredEvents.length,
			events: filteredEvents.slice(start, start + limit),
		}
	} else if (type === 'past') {
		const now = Date.now()
		const events = await getAllEvents(env, { start: 0 }, true)
		const filteredEvents = events
			.map(wire2event)
			.map(event => ({
				...event,
				allTimes: event.time,
				time: event.time.filter(time => getEndOfTime(time) <= now),
			}))
			.filter(event => event.time.length > 0)
			.toSorted((a, b) => getSortTimeEnd(b) - getSortTimeEnd(a))

		return {
			length: filteredEvents.length,
			events: filteredEvents.slice(start, start + limit),
		}
	} else {
		// months
		const date = new Date(month)
		const monthStart = +date
		date.setMonth(date.getMonth() + 1)
		const monthEnd = +date - 1

		const events = await getAllEvents(env, { start: 0 }, true)
		const filteredEvents = events
			.map(wire2event)
			.map(event => ({
				...event,
				allTimes: event.time,
				time: getInBetween(event.time, monthStart, monthEnd),
			}))
			.filter(event => event.time.length > 0)
			.toSorted((a, b) => getSortTimeEnd(b) - getSortTimeEnd(a))

		return { length: filteredEvents.length, events: filteredEvents }
	}
}

function getSortTime(event: Event): number {
	return event.time[0]?.start.getTime() ?? 0
}

function getSortTimeEnd(event: Event): number {
	const t: Time | undefined = event.time[event.time.length - 1]
	return t?.end?.getTime() ?? t?.start.getTime() ?? 0
}
