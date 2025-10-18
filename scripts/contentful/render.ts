import { CommonNode, documentToHtmlString, Next } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { Document, AssetHyperlink, EntryHyperlink } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'
import { Accordeon, Asset, BlogPost, Image, Item, Localized, Person, StaticPage } from './types'

const allowedTypes = ['contact-form', 'instagram-profile', 'newsletter-signup', 'youtube'] as const

export type ComponentType = 'contact-form' | 'instagram-profile' | 'newsletter-signup' | 'youtube'

interface Heading {
	level: 1 | 2 | 3 | 4 | 5 | 6
	text: string
	id: string
}

export interface ExtraComponent {
	type: ComponentType
	param?: string
}

export interface RenderedHtml {
	content: (string | ExtraComponent)[]
	headings: Heading[]
}

export function render(data: Document, ids: string[] = [], locale: 'de-DE' | 'en'): RenderedHtml {
	const isEn = locale === 'en'
	const extraComponents: ExtraComponent[] = []
	let blockLevel = 0

	function inBlock(next: () => string) {
		blockLevel += 1
		const result = next()
		blockLevel -= 1
		return result
	}

	const separator = `{{separator-${Date.now()}}}`

	const headings: Heading[] = []

	const html = documentToHtmlString(data, {
		preserveWhitespace: true,
		renderNode: {
			[BLOCKS.EMBEDDED_ENTRY]: node => {
				const target = node.data.target as Item<unknown>
				switch (target.sys.contentType?.sys.id) {
					case 'staticPage': {
						const { fields } = target as unknown as Item<Localized<StaticPage>>
						return `<a class="embed" href="${localUrl(locale, fields.slug)}">
							<p class="embedTitle">${local(fields.name, locale)}</p>
							<p class="embedDescription">${local(fields.description, locale)}</p>
						</a>`
					}
					case 'blogPost': {
						const { fields } = target as Item<Localized<BlogPost>>
						const publishLabel = isEn ? 'Published' : 'Veröffentlicht'
						const authorsLabel = isEn ? 'By' : 'Von'
						return `<a class="embed" href="${localUrl(locale, fields.slug)}">
							<p class="embedTitle">${local(fields.title, locale)}</p>
							<p class="embedDescription">${publishLabel}: ${new Date(local(fields.published, locale)).toLocaleDateString(locale, { timeZone: 'Europe/Berlin', dateStyle: 'long' })}</p>
							<p class="embedDescription">${authorsLabel} ${local(fields.authors, locale)
								.map(author => author.fields.name)
								.join(', ')}</p>
						</a>`
					}
					case 'person': {
						const { fields } = target as Item<Localized<Person>>
						return `<a class="embed" href="${localUrl(locale, fields.slug)}">
							<p class="embedTitle">${local(fields.name, locale)}</p>
							<p class="embedDescription">${local(fields.role, locale)}</p>
							${fields.pronouns ? `<p class="embedDescription">${local(fields.pronouns, locale)}</p>` : ''}
						</a>`
					}
					case 'accordeon': {
						const { fields } = target as Item<Localized<Accordeon>>
						const { content, headings: innerHeadings } = render(
							local(fields.content, locale),
							ids,
							locale,
						)
						headings.push(...innerHeadings)
						return `<details class="accordeon" open="${local(fields.open, locale)}"><summary>${local(fields.title, locale)}</summary>${content}</details>`
					}
					default:
						return ''
				}
			},
			[BLOCKS.EMBEDDED_ASSET]: node => {
				const image = node.data.target as Image
				const file = local(image.fields.file, locale)
				const { contentType, url } = file
				if (contentType.startsWith('image/')) {
					const { width, height } = file.details.image
					return `<img src="${encodeURI(url)}?fl=progressive&fm=jpg"
          class="EmbeddedAsset-Image"
          style="--width: ${width}; --height: ${height}" />`
				} else if (contentType.startsWith('video/')) {
					return `<video controls class="EmbeddedAsset-Video">
						<source src="${encodeURI(url)}" type="${contentType}" />
					</video>`
				}
				return ''
			},
			[BLOCKS.PARAGRAPH]: (node, children) => {
				if (
					blockLevel === 0 &&
					node.content.length === 1 &&
					node.content[0].nodeType === 'text' &&
					node.content[0].marks.length === 0
				) {
					const match = /^\{\{(?<value>[a-zA-Z0-9_-]+)(?<param> [a-zA-Z0-9_-]+)?\}\}\s*$/.exec(
						node.content[0].value,
					)
					if (match) {
						const { value, param } = match.groups!
						if (allowedTypes.includes(value as ComponentType)) {
							extraComponents.push({
								type: value as ComponentType,
								param: param?.trim() || undefined,
							})
							return separator
						}
					}
				}
				return inBlock(() => `<p>${children(node.content)}</p>`)
			},

			[BLOCKS.HEADING_1]: (node, children) =>
				inBlock(() => createHeading(1, node.content, children, ids, headings)),
			[BLOCKS.HEADING_2]: (node, children) =>
				inBlock(() => createHeading(2, node.content, children, ids, headings)),
			[BLOCKS.HEADING_3]: (node, children) =>
				inBlock(() => createHeading(3, node.content, children, ids, headings)),
			[BLOCKS.HEADING_4]: (node, children) =>
				inBlock(() => createHeading(4, node.content, children, ids, headings)),
			[BLOCKS.HEADING_5]: (node, children) =>
				inBlock(() => createHeading(5, node.content, children, ids, headings)),
			[BLOCKS.HEADING_6]: (node, children) =>
				inBlock(() => createHeading(6, node.content, children, ids, headings)),
			[BLOCKS.OL_LIST]: (node, children) => inBlock(() => `<ol>${children(node.content)}</ol>`),
			[BLOCKS.UL_LIST]: (node, children) => inBlock(() => `<ul>${children(node.content)}</ul>`),
			[BLOCKS.TABLE]: (node, children) => inBlock(() => `<table>${children(node.content)}</table>`),
			[BLOCKS.QUOTE]: (node, children) =>
				inBlock(() => `<blockquote>${children(node.content)}</blockquote>`),

			[INLINES.ASSET_HYPERLINK]: (node, children) => {
				const { content, data } = node as AssetHyperlink
				const { target } = data as unknown as { target: Item<Localized<Asset>> }
				const file = local(target.fields.file, locale)
				const description = target.fields.description
					? local(target.fields.description, locale)
					: undefined
				return `<a href="${encodeURI(file.url)}" target="_blank" rel="noopener" title="${description}">${children(content)}</a>`
			},
			[INLINES.ENTRY_HYPERLINK]: (node, children) => {
				const { content, data } = node as EntryHyperlink
				const { sys, fields } = data.target as unknown as Entry
				if (sys.contentType.sys.id === 'staticPage') {
					const { slug } = fields as unknown as Localized<StaticPage>
					return `<a href="${localUrl(locale, slug)}">${children(content)}</a>`
				} else if (sys.contentType.sys.id === 'blogPost') {
					const { slug, published } = fields as unknown as Localized<BlogPost>
					return `<a href="${localUrl(locale, 'blog', published, slug)}">${children(content)}</a>`
				} else if (sys.contentType.sys.id === 'person') {
					const { slug } = fields as unknown as Localized<Person>
					return `<a href="${localUrl(locale, 'person', slug)}">${children(content)}</a>`
				} else {
					return '<span style="color: red">FEHLER: Nicht unterstützer Entry Type</span>'
				}
			},
		},
	})

	if (extraComponents.length === 0) return { content: [html], headings }

	const parts = html.split(separator)
	return {
		content: parts.flatMap((part, i) => (extraComponents[i] ? [part, extraComponents[i]] : [part])),
		headings,
	}
}

function createHeading(
	level: 1 | 2 | 3 | 4 | 5 | 6,
	content: CommonNode[],
	children: Next,
	ids: string[],
	headings: Heading[],
): string {
	const text = contentText(content)
	const id = createId(text, ids)
	ids.push(id)
	const heading: Heading = { level, text, id }
	headings.push(heading)
	return `<h${level} id="${id}">${children(content)}</h${level}>`
}

function contentText(items: CommonNode[]): string {
	return items
		.map(content => {
			if ('value' in content) return content.value
			else return contentText(content.content)
		})
		.join('')
}

function createId(string: string, previousIds: string[]): string {
	const id = string
		.toLocaleLowerCase('de-DE')
		.replace(/\W/g, s => {
			if (s === 'ä') return 'ae'
			else if (s === 'ö') return 'oe'
			else if (s === 'ü') return 'ue'
			else if (s === 'ß') return 'ss'
			else return ' '
		})
		.trim()
		.replace(/ +/g, '-')

	if (previousIds.includes(id)) {
		let n = 0
		let idNumbered: string
		do {
			n++
			idNumbered = `${id}-${n}`
		} while (previousIds.includes(idNumbered))
		return idNumbered
	} else {
		return id
	}
}

function local<T>(object: Record<'de-DE' | 'en', T>, locale: 'de-DE' | 'en'): T {
	return object[locale] ?? object['de-DE']
}

function localUrl(
	locale: 'de-DE' | 'en',
	...slugs: (string | Record<'de-DE' | 'en', string>)[]
): string {
	const segments = slugs.map(s => (typeof s === 'object' ? (s[locale] ?? s['de-DE']) : s))
	if (segments.length === 1 && segments[0] === 'index') {
		slugs.pop()
	}

	if (locale === 'en') {
		return segments.length === 0 ? '/en' : '/en/' + segments.join('/')
	}
	return '/' + segments.join('/')
}
