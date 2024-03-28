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
}

export interface WireEvent extends EventCommon {
	time: WireTime | WireTime[]
}

export interface Event extends EventCommon {
	time: Time[]
}

export interface WireTime {
	start: string
	end?: string
}

export interface Time {
	hasStartTime: boolean
	start: Date
	end?: Date
}

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
