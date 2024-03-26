export interface DraftData {
	length: number
	events: Event[]
}

export interface Event {
	key?: string
	title: string
	description: string
	descHtml?: string
	website?: string
	time: Time
	place: Place
	organizer?: Organizer
	pictureUrl?: string
	tags: string[]
	submitter: Submitter
}

interface Time {
	start: string
	end?: string
	repeats?: Repeats
}

interface Repeats {
	cycle: 'DAY' | 'WEEK' | 'MONTH'
	days?: number
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
