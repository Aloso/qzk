import { wire2event, wire2time } from '$lib/events/convert'
import { getEndOfTime, getInBetween, isSingleTimeBetween } from '$lib/events/intersections'
import type { Event, Time, WithSubmitter } from '$lib/events/types'
import { getAllEvents, getEventNumber } from '$lib/server/events/db'
import type { EventDto, EventState, FullEventDto } from '$lib/server/events/event.js'
import { tryAuthentication } from '$lib/server/events/http'
import { error } from '@sveltejs/kit'

export interface Data {
	type: 'draft' | 'archived' | 'published' | 'past' | 'months'
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
		case 'draft':
		case 'archived':
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
	type: 'draft' | 'archived' | 'published' | 'past' | 'months',
	start: number,
	month: string,
): Promise<{ length: number; events: (Event & WithSubmitter)[] }> {
	if (type === 'draft' || type === 'archived') {
		const length = await getEventNumber(env, type)
		const events = (await getAllEvents(env, { start, limit }, type)) as FullEventDto[]
		return { length, events: events.map(wire2event) }
	} else if (type === 'published') {
		const now = Date.now()
		return filterAndTransformEvents(
			env,
			'public',
			time => getEndOfTime(time) > now,
			(a, b) => getSortTime(a) - getSortTime(b),
			start,
		)
	} else if (type === 'past') {
		const now = Date.now()
		return filterAndTransformEvents(
			env,
			'public',
			time => getEndOfTime(time) <= now,
			(a, b) => getSortTimeEnd(b) - getSortTimeEnd(a),
			start,
		)
	} else {
		// months
		const date = new Date(month)
		const monthStart = +date
		date.setMonth(date.getMonth() + 1)
		const monthEnd = +date - 1

		return filterAndTransformEvents(
			env,
			'public',
			time => isSingleTimeBetween(time, monthStart, monthEnd),
			(a, b) => getSortTimeEnd(b) - getSortTimeEnd(a),
		)
	}
}

async function filterAndTransformEvents(
	env: App.Platform['env'],
	state: EventState,
	filterTimes: (time: Time) => boolean,
	sortTimes: (a: Event, b: Event) => number,
	start?: number,
): Promise<{ length: number; events: (Event & WithSubmitter)[] }> {
	const events = (await getAllEvents(env, { start: 0 }, state)) as (EventDto & WithSubmitter)[]
	const filteredEvents = events
		.map((event): Event & WithSubmitter => {
			const allTimes = event.times.map(wire2time)
			return { ...event, allTimes, times: allTimes.filter(filterTimes) }
		})
		.filter(event => event.times.length > 0)
		.sort(sortTimes)

	if (start !== undefined) {
		return {
			length: filteredEvents.length,
			events: filteredEvents.slice(start, start + limit),
		}
	}

	return { length: filteredEvents.length, events: filteredEvents }
}

function getSortTime(event: Event): number {
	return event.times[0]?.start.getTime() ?? 0
}

function getSortTimeEnd(event: Event): number {
	const t: Time | undefined = event.times[event.times.length - 1]
	return t?.end?.getTime() ?? t?.start.getTime() ?? 0
}
