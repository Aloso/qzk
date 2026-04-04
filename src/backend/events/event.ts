/* eslint-disable no-empty-pattern */
import { json } from '@sveltejs/kit'
import { z } from 'zod'

export interface EventDto {
	key?: string
	state: EventState
	titleDe: string
	titleEn?: string
	descDe: string
	descEn?: string
	website?: string
	times: TimeDto[]
	place: Place
	organizer: Organizer
	pictureUrl?: string
	tags: string[]
	submitter?: Submitter
	orgaNotes?: string
	decoration?: Decoration
}

export interface FullEventDto extends EventDto {
	submitter: Submitter
}

export type EventState = 'public' | 'draft' | 'archived'

export interface TimeDto {
	start: string
	end?: string
	// repeats?: Repeats
}

// every day = { cycle: DAY }
// every other week = { cycle: WEEK, times: 2 }
// every 3 months = { cycle: MONTH, times: 3 }
// every Monday and Thursday = not possible
interface Repeats {
	cycle: 'DAY' | 'WEEK' | 'MONTH'
	times?: number
}

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

interface Submitter {
	name: string
	email: string
}

interface Decoration {
	colors: number[]
	blendImage: string
}

const timeSchema = z.object({
	start: z.string().min(1, 'Bitte Beginn der Veranstaltung angeben'),
	end: z.string().optional(),
})

const placeSchema = z.object({
	name: z.string(),
	room: z.string().optional(),
	address: z.string().optional(),
	url: z.url('Die Teilnahme-URL ist ungültig').optional(),
	type: z.enum(['PHYSICAL', 'ONLINE'], { error: 'Ungültiger Typ des Orts' }),
})

const phoneRegex = /^\s*\+?[0-9 /()-]+\s*$/

const organizerSchema = z.object({
	name: z.string().min(1, 'Bitte Name der Organisator*innen angeben').optional(),
	phone: z.string().regex(phoneRegex, 'Ungültige Telefonnummer angegeben').optional(),
	email: z.email('Ungültige E-Mail-Adresse bei Organisator*innen angegeben').optional(),
	website: z.url('Ungültige URL bei Organisator*innen angegeben').optional(),
})

const submitterSchema = z.object({
	name: z.string().min(1, 'Dein Name fehlt'),
	email: z.email('Ungültige E-Mail-Adresse angegeben'),
})

const decorationSchema = z.object({
	colors: z.array(z.number().min(0).max(360)).length(2),
	blendImage: z.string(),
})

const stateSchema = z.enum(['public', 'draft', 'archived'])

const schema = z.object({
	key: z.string().optional(),
	state: stateSchema,
	titleDe: z.string().min(1, 'Bitte Titel der Veranstaltung angeben'),
	titleEn: z.string().optional(),
	descDe: z.string().min(1, 'Bitte Beschreibung der Veranstaltung angeben'),
	descEn: z.string().optional(),
	website: z.url('Die angegebene Website ist keine gültige URL').optional(),
	times: z.array(timeSchema),
	place: placeSchema,
	organizer: organizerSchema,
	pictureUrl: z.url('Ungültige URL beim Bild angegeben').optional(),
	tags: z.string().min(1, 'Tag darf nicht leer sein').array(),
	submitter: submitterSchema,
	orgaNotes: z.string().optional(),
	decoration: decorationSchema.optional(),
})

export function parseEvent(data: unknown): EventDto {
	if (typeof data === 'object' && data && 'description' in data) {
		delete data.description
	}
	try {
		return schema.parse(data)
	} catch (error) {
		const { issues } = error as z.ZodError
		throw json({ errors: issues }, { status: 400 })
	}
}

export function parseState(state: string): EventState {
	try {
		return stateSchema.parse(state)
	} catch (error) {
		const { issues } = error as z.ZodError
		throw json({ errors: issues }, { status: 400 })
	}
}

// Ensure the type definitions are equivalent
type ZodEvent = z.infer<typeof schema>
const {}: EventDto = {} as ZodEvent
const {}: ZodEvent = {} as EventDto
