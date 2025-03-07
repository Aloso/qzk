import type { GeneralInfoTransformed, Navigations } from '$lib/data'
import data from './data.json' with { type: 'json' }

interface ExtraComponent {
	type: 'contact-form' | 'instagram-profile' | 'newsletter-signup' | 'youtube'
	param?: string
}

export type RichText = (string | ExtraComponent)[]

export interface Image {
	id: string
	url: string
	width: number
	height: number
	description?: string
}

export interface Heading {
	level: 1 | 2 | 3 | 4 | 5 | 6
	text: string
	id: string
}

interface GenericEntry<ContentType extends string> {
	tags?: string[]
	sys: {
		id: string
		createdAt: string
		updatedAt: string
		contentType: ContentType
		locale?: string
	}
}

export interface Person extends GenericEntry<'person'> {
	fields: {
		name: string
		slug: string
		role: string
		pronouns: string
		photo: Image
		description?: RichText
	}
}

export interface BlogPost extends GenericEntry<'blogPost'> {
	fields: {
		title: string
		slug: string
		published: string
		authorIds: string[]
		photo: Image
		teaser: string
		content: RichText
	}
}

export interface GeneralInfo extends GenericEntry<'generalInfo'> {
	fields: {
		name: string
		openingHoursMon?: string
		openingHoursTue?: string
		openingHoursWed?: string
		openingHoursThu?: string
		openingHoursFri?: string
		openingHoursSat?: string
		openingHoursSun?: string
		specialOpeningHours: string[]
		importantInfo: string[]
	}
}

export interface StaticPage extends GenericEntry<'staticPage'> {
	fields: {
		name: string
		slug: string
		description: string
		content: RichText
		headings: Heading[]
	}
}

export interface Navigation extends GenericEntry<'navigation'> {
	fields: {
		name: string
		links: string
	}
}

export default data as {
	person: Person[]
	blogPost: BlogPost[]
	staticPage: StaticPage[]
	generalInfo: GeneralInfoTransformed
	navigations: Navigations
}
