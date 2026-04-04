import { error } from '@sveltejs/kit'
import type { EventDto, EventState } from './event'
import { eventColumns, serializeDbEvent, parseState, type DbEvent } from './dbEvent'
import type { D1Result } from '@cloudflare/workers-types'
import { v4 as uuidv4 } from 'uuid'

interface GetAllEventsOptions {
	start?: number
	limit?: number
}

type Env = App.Platform['env']

/** Returns number of events in the given state */
export async function getEventNumber(env: Env, state: EventState): Promise<number> {
	const lengthQuery = 'SELECT count(*) length FROM events_migration WHERE state = ?'
	const lengthResult = await env.DB.prepare(lengthQuery)
		.bind(parseState(state))
		.first<{ length: number }>()
	const { length } = lengthResult ?? error(500, 'Failed to get number of events')
	return length
}

/** Returns all events in the given state (paginated). */
export async function getAllEvents(
	env: Env,
	options: GetAllEventsOptions,
	state: EventState,
): Promise<EventDto[]> {
	if (options.limit) {
		const query = 'SELECT * FROM events_migration WHERE state = ? LIMIT ? OFFSET ?'
		const { results } = await env.DB.prepare(query)
			.bind(parseState(state), options.limit, options.start ?? 0)
			.all<DbEvent>()
		return results.map(serializeDbEvent)
	} else {
		const query = 'SELECT * FROM events_migration WHERE state = ?'
		const { results } = await env.DB.prepare(query).bind(parseState(state)).all<DbEvent>()
		return results.map(serializeDbEvent)
	}
}

/** Returns the event identified by the given key, if it has the given state */
export async function getEvent(env: Env, key: string, state?: EventState): Promise<EventDto> {
	let result: DbEvent | null
	if (state) {
		const query = 'SELECT * FROM events_migration WHERE id = ? AND state = ?'
		result = await env.DB.prepare(query).bind(key, parseState(state)).first<DbEvent>()
	} else {
		const query = 'SELECT * FROM events_migration WHERE id = ?'
		result = await env.DB.prepare(query).bind(key).first<DbEvent>()
	}
	return serializeDbEvent(result ?? error(404, 'Event not found'))
}

/** Adds the event with a newly generated UUID as key and returns the key */
export async function addDraft(env: Env, event: EventDto): Promise<string> {
	if (event.state !== 'draft') error(400, 'state must be `draft`')
	const key = uuidv4()
	event.key = key
	sortEventTimes(event)

	const { cols, placeholders, values } = eventColumns([], event, key)
	const result = await env.DB.prepare(`INSERT INTO events_migration ${cols} VALUES ${placeholders}`)
		.bind(...values)
		.run()
	if (!result.success) {
		error(500, 'Failed to create event')
	}

	return key
}

export async function putEvent(env: Env, event: EventDto, key: string): Promise<void> {
	sortEventTimes(event)

	const { cols, placeholders, values } = eventColumns(['id', 'state'], event)
	const query = `UPDATE events_migration SET ${cols} = ${placeholders} WHERE id = ? AND state = ?`
	const result = await env.DB.prepare(query)
		.bind(...values, key, parseState(event.state))
		.run()
	if (!result.success) {
		await getEvent(env, key, event.state) // throws 404 if the event doesn't exist
		error(500, 'Failed to update event')
	}
}

export async function deleteEvent(env: Env, key: string, state: EventState): Promise<void> {
	const query = 'DELETE FROM events_migration WHERE id = ? AND state = ?'

	const result = await env.DB.prepare(query).bind(key, parseState(state)).run()
	if (!result.success) {
		await getEvent(env, key, state) // throws 404 if the event doesn't exist
		error(500, 'Failed to delete event')
	}
}

export async function setEventState(
	env: Env,
	key: string,
	newState: EventState,
	oldState?: EventState,
): Promise<void> {
	let result: D1Result
	if (oldState) {
		const query = `UPDATE events_migration SET state = ? WHERE id = ? AND state = ?`
		result = await env.DB.prepare(query).bind(parseState(newState), key, parseState(oldState)).run()
	} else {
		const query = `UPDATE events_migration SET state = ? WHERE id = ?`
		result = await env.DB.prepare(query).bind(parseState(newState), key).run()
	}

	if (!result.success) {
		await getEvent(env, key, oldState) // throws 404 if the event doesn't exist
		error(500, 'Failed to update event state')
	}
}

function sortEventTimes(event: EventDto) {
	event.times.sort((t1, t2) => {
		return +new Date(t1.start) - +new Date(t2.start)
	})
}
