import { createClient, type Entry, type EntrySkeletonType } from 'contentful'
import { config } from 'dotenv'
import * as fs from 'node:fs'
import { fetchContentfulEntries } from './fetchContentfulEntries'
import { getGeneralInfo } from './parseGeneralInfo'
import { getAllNavigations } from './parseNav'
import { render } from './render'
import type {
	Accordeon,
	BlogPost,
	DonationInfo,
	GeneralInfo,
	Image,
	Localized,
	Navigation,
	Person,
	StaticPage,
} from './types'
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
	donations: [],
}

for (const entry of items) {
	const item = transform(entry)
	data[item.sys.contentType].push(item)
}

;(data as any).navigations = getAllNavigations(data.navigation as any[])
;(data as any).generalInfo = getGeneralInfo(data.generalInfo[0].fields as any)
;(data as any).donations = data.donations[0]

delete data.navigation

data.blogPost.sort((a, b) => {
	return a.fields.published === b.fields.published
		? a.fields.title.localeCompare(b.fields.title)
		: -(a.fields.published?.localeCompare(b.fields.published) ?? 0)
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
			const { name, slug, role, pronouns, photo, description } =
				entry.fields as unknown as Localized<Person>
			fields = {
				name: name['de-DE'],
				slug: slug['de-DE'],
				role: role['de-DE'],
				roleEn: role['en'],
				pronouns: pronouns?.['de-DE'],
				pronounsEn: pronouns?.['en'],
				photo: transformImage(photo?.['de-DE']),
				description: description?.['de-DE']
					? render(description['de-DE'], [], 'de-DE').content
					: undefined,
				descriptionEn: description?.['en']
					? render(description['en'], [], 'en').content
					: undefined,
			}
			break
		}
		case 'blogPost': {
			const { title, slug, published, authors, photo, teaser, content } =
				entry.fields as unknown as Localized<BlogPost>
			const rendered = content ? render(content['de-DE'], [], 'de-DE') : { content: '' }
			fields = {
				title: title?.['de-DE'],
				slug: slug?.['de-DE'],
				published: published?.['de-DE'],
				authorIds: authors?.['de-DE'].map(a => a.sys.id),
				photo: transformImage(photo?.['de-DE']),
				teaser: render(teaser?.['de-DE'], [], 'de-DE')
					.content.filter(e => typeof e === 'string')
					.join('\n'),
				content: rendered.content,
			}
			break
		}
		case 'staticPage': {
			const { name, slug, description, content } = entry.fields as unknown as Localized<StaticPage>
			const rendered = render(content['de-DE'], [], 'de-DE')
			const renderedEn = render(content['en'] ?? content['de-DE'], [], 'en')
			fields = {
				name: name['de-DE'],
				nameEn: name['en'],
				slug: slug['de-DE'],
				description: description?.['de-DE'],
				descriptionEn: description?.['en'],
				content: rendered.content,
				contentEn: renderedEn?.content,
				headings: rendered.headings,
				headingsEn: renderedEn?.headings,
			}
			break
		}
		case 'navigation': {
			const { name, linksObject } = entry.fields as unknown as Localized<Navigation>
			fields = { name: name['de-DE'], linksObject: linksObject?.['de-DE'] }
			break
		}
		case 'generalInfo': {
			const { name, importantInfo, openingHours, specialOpeningHours } =
				entry.fields as unknown as Localized<GeneralInfo>
			fields = {
				name: name['de-DE'],
				importantInfo: importantInfo?.['de-DE'],
				importantInfoEn: importantInfo?.['en'],
				openingHours: openingHours?.['de-DE'],
				specialOpeningHours: specialOpeningHours?.['de-DE'],
			}
			break
		}
		case 'donations': {
			const { description, paypalUrl, accountOwner, iban, bic, finalDescription } =
				entry.fields as unknown as Localized<DonationInfo>

			const renderedDescDe = render(description['de-DE'], [], 'de-DE')
			const renderedDescEn = render(description['en'] ?? description['de-DE'], [], 'en')

			const renderedFinalDescDe = render(
				finalDescription['de-DE'],
				renderedDescDe.headings.map(h => h.id),
				'de-DE',
			)
			const renderedFinalDescEn = render(
				finalDescription['en'] ?? finalDescription['de-DE'],
				renderedDescEn.headings.map(h => h.id),
				'en',
			)

			fields = {
				description: renderedDescDe.content,
				descriptionEn: renderedDescEn.content,
				paypalUrl: paypalUrl?.['de-DE'],
				accountOwner: accountOwner['de-DE'],
				iban: iban?.['de-DE'],
				bic: bic?.['de-DE'],
				finalDescription: renderedFinalDescDe.content,
				finalDescriptionEn: renderedFinalDescEn.content,
			}
			break
		}
		case 'accordeon': {
			const { title, content, open } = entry.fields as unknown as Localized<Accordeon>
			const rendered = render(content['de-DE'], [], 'de-DE')
			fields = { title: title['de-DE'], content: rendered, open: open['de-DE'] }
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

	const imgSize = img.fields.file['de-DE'].details.image
	return {
		id: img.sys.id,
		url: img.fields.file['de-DE'].url,
		description: img.fields.description?.['de-DE'],
		width: imgSize.width,
		height: imgSize.height,
	}
}
