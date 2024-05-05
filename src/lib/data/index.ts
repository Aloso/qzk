import type { ExtraComponent } from '$lib/contentful/render'
import type { Image, Item } from '$lib/contentful/types'
import type { Document } from '@contentful/rich-text-types'

export interface BlogPost {
	title: string
	slug: string
	authors: Item<Person>[]
	published: string
	photo: Image
	teaser: Document
	content: Document
}

export interface BlogPostView {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	content: Document
	related: BlogPostPreview[]
}

export interface BlogPostViewTransformed {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	content: string
	related: BlogPostPreviewTransformed[]
}

export interface BlogPostPreview {
	title: string
	slug: string
	authors: PersonPreview[]
	published: string
	photo: Image
	teaser: Document
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
	id: string
	slug: string
	name: string
	role: string
	pronouns?: string
	photo: Image
	description?: Document
}

export interface PersonTransformed {
	id: string
	slug: string
	name: string
	role: string
	pronouns?: string
	photo: Image
	description?: string
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
	content: Document
}

export interface StaticPageTransformed {
	name: string
	slug: string
	description?: string
	parts: (string | ExtraComponent)[]
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
	text: string
	children: TypedNavigation[]
}
