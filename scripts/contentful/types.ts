import { Document } from '@contentful/rich-text-types'

// These are the types received from contentful

export interface Item<T> {
	fields: T
	sys: {
		id: string
		contentType?: {
			sys: { id: string }
		}
	}
}

export interface StaticPage {
	slug: string
	name: string
	description: string
	content: Document
}

export interface BlogPost {
	title: string
	slug: string
	authors: Item<Person>[]
	published: string
	photo: Image
	teaser: Document
	content: Document
}

export interface Person {
	slug: string
	name: string
	role: string
	pronouns?: string
	photo: Image
	description?: Document
}

export interface DateRange {
	from: string
	to: string
}

export interface GeneralInfo {
	name: string
	openingHours: {
		regular: Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', DateRange[]>
		special: { date: string; hours: DateRange[] }[]
	}
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

export interface Navigation {
	name: string
	links?: string
	linksObject?: TopLevelNavItem[]
}

export interface TopLevelNavItem extends NavItem {
	children: NavItem[]
}

export interface NavItem {
	path: string
	name: string
	nameEn: string
}

export interface Asset<D extends Details = Details> {
	title: string
	description?: string
	file: {
		contentType: string
		details: D
		fileName: string
		url: string
	}
}

export type Image = Item<Asset<ImageDetails>>

export interface Details {
	size: number
}

export interface ImageDetails extends Details {
	image: {
		width: number
		height: number
	}
}
