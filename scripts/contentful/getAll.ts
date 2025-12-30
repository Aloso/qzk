import { createClient, Entry, EntrySkeletonType } from 'contentful'
import { config } from 'dotenv'
import * as fs from 'node:fs'
import { render } from './render'
import { Accordeon, BlogPost, GeneralInfo, Image, Navigation, Person, StaticPage } from './types'
import { getAllNavigations } from './parseNav'
import { getGeneralInfo } from './parseGeneralInfo'
import { fetchContentfulEntries } from './fetchContentfulEntries'
import { updateSearchIndex } from './updateSearchIndex'

config()

const contentfulClient = createClient({
	space: process.env.CONTENTFUL_SPACE_ID!,
	accessToken: process.env.CONTENTFUL_TOKEN!,
	// use 'cdn.contentful.com' for normal use and 'preview.contentful.com' for preview
	host: process.env.CONTENTFUL_HOST ?? 'cdn.contentful.com',
})
const items = await fetchContentfulEntries(contentfulClient)

const data: Record<string, ReturnType<typeof transform>[]> = {
	person: [],
	blogPost: [],
	staticPage: [],
	navigation: [],
	generalInfo: [],
	accordeon: [],
}

for (const entry of items) {
	const item = transform(entry)
	data[item.sys.contentType].push(item)
}

;(data as any).navigations = getAllNavigations(data.navigation as any[])
;(data as any).generalInfo = getGeneralInfo(data.generalInfo[0].fields as any)

delete data.navigation

data.blogPost.sort((a, b) => {
	return a.fields.published === b.fields.published
		? a.fields.title.localeCompare(b.fields.title)
		: -a.fields.published.localeCompare(b.fields.published)
})

console.log('writing data.json...')
fs.writeFileSync('src/lib/contentful/data.json', JSON.stringify(data, undefined, '\t'))

if (process.env.ALGOLIA_INDEX === '1') {
	console.log('updating search index...')
	await updateSearchIndex(data as any)
}

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
			fields = entry.fields as unknown as GeneralInfo
			break
		}
		case 'accordeon': {
			const { title, content, open } = entry.fields as unknown as Accordeon
			const rendered = render(content)
			fields = { title, content: rendered, open }
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
