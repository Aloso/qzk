import { error } from '@sveltejs/kit'
import type { EventDto, EventState } from './event'

export interface DbEvent {
	id: string
	state: number
	titleDe: string
	titleEn?: string | null
	descDe: string
	descEn?: string | null
	website?: string | null
	pictureUrl?: string | null
	submName: string
	submEmail: string
	orgaName?: string | null
	orgaPhone?: string | null
	orgaEmail?: string | null
	orgaWebsite?: string | null
	orgaNotes?: string | null
	rngStart: number
	rngEnd: number
	times: string // json
	place: string // json
	tags: string // json
	decoration?: string // json
}

export function eventColumns(omitted: (keyof DbEvent)[], event: EventDto, key?: string) {
	const completeColumns: (keyof DbEvent)[] = [
		'id',
		'state',
		'titleDe',
		'titleEn',
		'descDe',
		'descEn',
		'website',
		'pictureUrl',
		'submName',
		'submEmail',
		'orgaName',
		'orgaPhone',
		'orgaEmail',
		'orgaWebsite',
		'orgaNotes',
		'rngStart',
		'rngEnd',
		'times',
		'place',
		'tags',
		'decoration',
	]
	const columns = omitted.length
		? completeColumns.filter(col => !omitted.includes(col))
		: completeColumns

	const vals = parseDbEvent(event, key ?? event.key ?? '', event.state)

	return {
		cols: `(\`${columns.join('`, `')}\`)`,
		placeholders: `(${columns.map(_ => '?').join(', ')})`,
		values: columns.map(c => vals[c] ?? null),
	}
}

export function serializeDbEvent(event: DbEvent): EventDto {
	return {
		key: event.id,
		state: stringifyState(event.state),
		titleDe: event.titleDe,
		titleEn: event.titleEn ?? undefined,
		descDe: event.descDe,
		descEn: event.descEn ?? undefined,
		website: event.website ?? undefined,
		times: JSON.parse(event.times),
		place: JSON.parse(event.place),
		organizer: {
			name: event.orgaName ?? undefined,
			phone: event.orgaPhone ?? undefined,
			email: event.orgaEmail ?? undefined,
			website: event.orgaWebsite ?? undefined,
		},
		pictureUrl: event.pictureUrl ?? undefined,
		tags: JSON.parse(event.tags),
		submitter: {
			name: event.submName,
			email: event.submEmail,
		},
		orgaNotes: event.orgaNotes ?? undefined,
		decoration: event.decoration ? JSON.parse(event.decoration) : undefined,
	}
}

function parseDbEvent(event: EventDto, key: string, state: EventState): DbEvent {
	if (!event.submitter) error(400, 'submitter missing')

	return {
		id: key,
		state: parseState(state),
		titleDe: event.titleDe,
		titleEn: event.titleEn,
		descDe: event.descDe,
		descEn: event.descEn,
		website: event.website,
		pictureUrl: event.pictureUrl,
		submName: event.submitter?.name,
		submEmail: event.submitter?.email,
		orgaName: event.organizer.name,
		orgaPhone: event.organizer.phone,
		orgaEmail: event.organizer.email,
		orgaWebsite: event.organizer.website,
		orgaNotes: event.orgaNotes,
		rngStart: 0,
		rngEnd: 0,
		times: JSON.stringify(event.times),
		place: JSON.stringify(event.place),
		tags: JSON.stringify(event.tags),
		decoration: event.decoration ? JSON.stringify(event.decoration) : undefined,
	}
}

export function parseState(state: EventState): 0 | 1 | 2 {
	return state === 'public' ? 1 : state === 'draft' ? 0 : 2
}

export function stringifyState(state: number): EventState {
	return state === 0 ? 'draft' : state === 1 ? 'public' : 'archived'
}
