import type { Heading, RichText } from '$lib/contentful/data'

export interface Image {
	id: string
	url: string
	description?: string
	width: number
	height: number
}

export type ComponentType = 'contact-form' | 'instagram-profile' | 'newsletter-signup' | 'youtube'

export interface ExtraComponent {
	type: ComponentType
	param?: string
}

export interface GeneralInfo {
	id: string
	name: string
	openingHoursMon: string
	openingHoursTue: string
	openingHoursWed: string
	openingHoursThu: string
	openingHoursFri: string
	openingHoursSat: string
	openingHoursSun: string
	specialOpeningHours: string[]
	importantInfo?: string[]
}

export interface GeneralInfoTransformed {
	openingHours: {
		mon: DateRange[]
		tue: DateRange[]
		wed: DateRange[]
		thu: DateRange[]
		fri: DateRange[]
		sat: DateRange[]
		sun: DateRange[]
	}
	specialOpeningHours: {
		date: string
		hours: DateRange[]
	}[]
	importantInfo?: string[]
	importantInfoEn?: string[]
}

export interface DateRange {
	from: string
	to: string
}

export interface BlogPost {
	title: string
	slug: string
	authorIds: string[]
	published: string
	photo: Image
	teaser: string
	content: RichText
}

export interface BlogPostView {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	content: RichText
	related: BlogPostPreview[]
}

export interface BlogPostViewTransformed {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	parts: RichText
	related: BlogPostPreviewTransformed[]
	lang: string
}

export interface BlogPostPreview {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	teaser: string
}

export interface BlogPostPreviewTransformed {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	teaser: string
}

export interface Person {
	slug: string
	name: string
	role: string
	pronouns?: string
	photo: Image
	description?: RichText
}

export interface PersonTransformed {
	slug: string
	name: string
	role: string
	pronouns?: string
	photo: Image
	description?: RichText
}

export interface PersonPreview {
	slug: string
	name: string
	role: string
	photo: Image
}

export interface StaticPage {
	name: string
	slug: string
	description?: string
	content: RichText
}

export interface StaticPageTransformed {
	name: string
	nameEn?: string
	slug: string
	description?: string
	descriptionEn?: string
	content: RichText
	contentEn?: RichText
	headings: Heading[]
	headingsEn?: Heading[]
}

export interface Navigation {
	name: 'Header' | 'Footer'
	links: string
}

export interface Navigations {
	header: TypedNavigation[]
	footer: TypedNavigation[]
}

export interface TypedNavigation {
	href?: string
	de: string
	en: string
	children?: TypedNavigation[]
}
