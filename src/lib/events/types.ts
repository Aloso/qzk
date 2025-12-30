import type { EventDto, EventState, FullEventDto } from '$lib/server/events/event'

export interface DraftData {
	length: number
	events: (Event & WithSubmitter)[]
}

export interface WireDraftData {
	length: number
	events: FullEventDto[]
}

export interface EventCommon {
	key?: string
	state: EventState
	titleDe: string
	titleEn?: string
	descDe: string
	descEn?: string
	website?: string
	place: Place
	organizer: Organizer
	pictureUrl?: string
	tags: string[]
	decoration?: Decoration
}

export interface WithKey extends EventCommon {
	key: string
}

export interface WithSubmitter {
	submitter: Submitter
}

export interface Event extends EventCommon {
	times: Time[]
	allTimes?: Time[]
	orgaNotes?: string
}

/**
  - day:         Start date
  - time:        Start date + start time
  - day-range:   Start date + start time + end time
  - time-range:  Start date + end date
 */
export type TimeVariant = 'day' | 'day-range' | 'time' | 'time-range'

export type Time =
	| { variant: 'day' | 'time'; start: Date; end?: undefined }
	| { variant: 'day-range' | 'time-range'; start: Date; end: Date }

interface Place {
	name: string
	room?: string
	address?: string
	url?: string
	type: 'PHYSICAL' | 'ONLINE'
}

interface Organizer {
	name?: string
	phone?: string
	email?: string
	website?: string
}

export interface Submitter {
	name: string
	email: string
}

export interface Decoration {
	colors: number[]
	blendImage: string
}
