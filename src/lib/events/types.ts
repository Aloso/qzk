export interface DraftData {
	length: number
	events: (Event & WithSubmitter)[]
}

export interface WireDraftData {
	length: number
	events: (WireEvent & WithSubmitter)[]
}

export interface EventCommon {
	key?: string
	title: string
	description: string
	descHtml?: string
	website?: string
	place: Place
	organizer?: Organizer
	pictureUrl?: string
	tags: string[]
	submitter?: Submitter
}

export interface WithKey extends EventCommon {
	key: string
}

export interface WithSubmitter extends EventCommon {
	submitter: Submitter
	orgaNotes?: string
}

export interface WireEvent extends EventCommon {
	time: WireTime | WireTime[]
}

export interface Event extends EventCommon {
	time: Time[]
	allTimes?: Time[]
}

export interface WireTime {
	start: string
	end?: string
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
	name: string
	phone?: string
	email?: string
	website?: string
}

export interface Submitter {
	name: string
	email: string
}
