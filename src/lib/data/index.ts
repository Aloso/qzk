import type { Image, Item } from '$lib/contentful/types'
import type { Document } from '@contentful/rich-text-types'

export interface BlogPost {
	title: string
	slug: string
	authors: Item<Author>[]
	published: string
	photo: Image
	teaser: Document
	content: Document
}

export interface Author {
	id: string
	slug: string
	name: string
	role: string
	pronouns: string
	photo: Image
	description: Document
}

export interface StaticPage {
	name: string
	slug: string
	description?: string
	content: Document
}

export interface ItemData<T> {
	data: Item<T>
}
