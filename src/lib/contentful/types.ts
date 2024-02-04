import type { Asset as CAsset, Entry, Tag } from 'contentful'

export interface Entries<T> {
	includes: {
		Asset: CAsset[]
		Entry: Entry[]
	}
	items: Item<T>[]
	limit: number
	skip: number
	total: number
}

export interface Item<T> {
	fields: T
	metadata?: {
		tags: Tag[]
	}
	sys: {
		id: string
	}
}

export interface Asset<D extends Details> {
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

interface Details {
	size: number
}

interface ImageDetails extends Details {
	image: {
		width: number
		height: number
	}
}
