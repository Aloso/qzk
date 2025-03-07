import { CommonNode, documentToHtmlString, Next } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { Document, AssetHyperlink, EntryHyperlink } from '@contentful/rich-text-types'
import type { Entry } from 'contentful'
import { Asset, BlogPost, Image, Item, Person, StaticPage } from './types'

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

export function render(data: Document): RenderedHtml {
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
	const ids: string[] = []

	const html = documentToHtmlString(data, {
		preserveWhitespace: true,
		renderNode: {
			[BLOCKS.EMBEDDED_ENTRY]: node => {
				const target = node.data.target as Item<unknown>
				switch (target.sys.contentType?.sys.id) {
					case 'staticPage': {
						const { fields } = target as unknown as Item<StaticPage>
						return `<a class="embed" href="/${fields.slug}">
							<p class="embedTitle">${fields.name}</p>
							<p class="embedDescription">${fields.description}</p>
						</a>`
					}
					case 'blogPost': {
						const { fields } = target as Item<BlogPost>
						return `<a class="embed" href="/${fields.slug}">
							<p class="embedTitle">${fields.title}</p>
							<p class="embedDescription">Veröffentlicht: ${new Date(fields.published).toLocaleDateString('de', { timeZone: 'Europe/Berlin', dateStyle: 'long' })}</p>
							<p class="embedDescription">Von ${fields.authors.map(author => author.fields.name).join(', ')}</p>
						</a>`
					}
					case 'person': {
						const { fields } = target as Item<Person>
						return `<a class="embed" href="/${fields.slug}">
							<p class="embedTitle">${fields.name}</p>
							<p class="embedDescription">${fields.role}</p>
							${fields.pronouns ? `<p class="embedDescription">${fields.pronouns}</p>` : ''}
						</a>`
					}
					default:
						return ''
				}
			},
			[BLOCKS.EMBEDDED_ASSET]: node => {
				const image = node.data.target as Image
				const { contentType, url } = image.fields.file
				if (contentType.startsWith('image/')) {
					const { width, height } = image.fields.file.details.image
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
				const { target } = data as unknown as { target: Item<Asset> }
				return `<a href="${encodeURI(target.fields.file.url)}" target="_blank" rel="noopener"
				title="${target.fields.description ?? ''}">${children(content)}</a>`
			},
			[INLINES.ENTRY_HYPERLINK]: (node, children) => {
				const { content, data } = node as EntryHyperlink
				const { sys, fields } = data.target as unknown as Entry
				if (sys.contentType.sys.id === 'staticPage') {
					const { slug } = fields as unknown as StaticPage
					return `<a href="/${slug === 'index' ? '' : slug}">${children(content)}</a>`
				} else if (sys.contentType.sys.id === 'blogPost') {
					const { slug, published } = fields as unknown as BlogPost
					return `<a href="/blog/${published}/${slug}">${children(content)}</a>`
				} else if (sys.contentType.sys.id === 'person') {
					const { slug } = fields as unknown as Person
					return `<a href="/person/${slug}">${children(content)}</a>`
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
