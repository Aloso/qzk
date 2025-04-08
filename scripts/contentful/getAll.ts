/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, Entry, EntrySkeletonType } from 'contentful'
import { config } from 'dotenv'
import * as fs from 'node:fs'
import { render } from './render'
import { BlogPost, GeneralInfo, Image, Navigation, Person, StaticPage } from './types'
import { getAllNavigations } from './parseNav'
import { getGeneralInfo } from './parseGeneralInfo'

config()

export const client = createClient({
	space: process.env.CONTENTFUL_SPACE_ID!,
	accessToken: process.env.CONTENTFUL_TOKEN!,
	host: 'cdn.contentful.com',
})

const items: Entry<EntrySkeletonType>[] = []
const pageSize = 100

for (let page = 0; ; page += 1) {
	const entries = await client.getEntries({
		skip: page * pageSize,
		limit: pageSize,
	})
	items.push(...entries.items)
	if (entries.total <= (page + 1) * pageSize) {
		break
	}
}

const result: Record<string, ReturnType<typeof transform>[]> = {
	person: [],
	blogPost: [],
	staticPage: [],
	navigation: [],
	generalInfo: [],
}

for (const entry of items) {
	const item = transform(entry)
	result[item.sys.contentType].push(item)
}

;(result as any).navigations = getAllNavigations(result.navigation as any[])
;(result as any).generalInfo = getGeneralInfo(result.generalInfo[0].fields as any)

result.blogPost.sort((a, b) => {
	return a.fields.published === b.fields.published
		? a.fields.title.localeCompare(b.fields.title)
		: -a.fields.published.localeCompare(b.fields.published)
})

fs.writeFileSync('src/lib/contentful/data.json', JSON.stringify(result, undefined, '\t'))

function transform(entry: Entry<EntrySkeletonType>) {
	let fields: any
	switch (entry.sys.contentType.sys.id) {
		case 'person': {
			const { name, slug, role, pronouns, photo, description } = entry.fields as unknown as Person
			fields = {
				name,
				slug,
				role,
				pronouns,
				photo: transformImage(photo),
				description: description ? render(description).content : undefined,
			}
			break
		}
		case 'blogPost': {
			const { title, slug, published, authors, photo, teaser, content } =
				entry.fields as unknown as BlogPost
			const rendered = render(content)
			fields = {
				title,
				slug,
				published,
				authorIds: authors.map(a => a.sys.id),
				photo: transformImage(photo),
				teaser: render(teaser)
					.content.filter(e => typeof e === 'string')
					.join('\n'),
				content: rendered.content,
			}
			break
		}
		case 'staticPage': {
			const { name, slug, description, content } = entry.fields as unknown as StaticPage
			const rendered = render(content)
			fields = {
				name,
				slug,
				description,
				content: rendered.content,
				headings: rendered.headings,
			}
			break
		}
		case 'navigation': {
			const { name, linksObject } = entry.fields as unknown as Navigation
			fields = { name, linksObject }
			break
		}
		case 'generalInfo': {
			const fieldsOrig = entry.fields as unknown as GeneralInfo
			// TODO
			fields = fieldsOrig
			break
		}
		default:
			throw new Error(`unsupported entry type ${entry.sys.contentType.sys.id}`)
	}
	const metadata = entry.metadata.tags.length
		? { tags: entry.metadata.tags.map(tag => tag.sys.id) }
		: {}
	const sys = {
		id: entry.sys.id,
		locale: entry.sys.locale,
		contentType: entry.sys.contentType.sys.id,
		createdAt: entry.sys.createdAt,
		updatedAt: entry.sys.updatedAt,
	}
	return { ...metadata, sys, fields }
}

function transformImage(img?: Image) {
	if (!img) return

	const imgSize = img.fields.file.details.image
	return {
		id: img.sys.id,
		url: img.fields.file.url,
		description: img.fields.description,
		width: imgSize.width,
		height: imgSize.height,
	}
}
