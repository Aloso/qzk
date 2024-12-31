import { getSize } from '$lib/components/imageCalc'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { Document, AssetHyperlink, EntryHyperlink } from '@contentful/rich-text-types'
import type { Image, Item, Asset } from '$lib/contentful/types'
import type { Entry } from 'contentful'
import type { StaticPage, BlogPost, Person } from '$lib/data'

const allowedTypes = ['contact-form', 'instagram-profile', 'newsletter-signup'] as const

type ComponentType = (typeof allowedTypes)[number]

export interface ExtraComponent {
	type: ComponentType
}

export function renderDataToString(data: Document, width: number): string {
	return renderData(data, width)
		.filter(part => typeof part === 'string')
		.join('\n')
}

export function renderData(data: Document, width: number): (string | ExtraComponent)[] {
	const extraComponents: ExtraComponent[] = []
	let blockLevel = 0

	function inBlock(next: () => string) {
		blockLevel += 1
		const result = next()
		blockLevel -= 1
		return result
	}

	const separator = `{{separator-${Date.now()}}}`

	const html = documentToHtmlString(data, {
		preserveWhitespace: true,
		renderNode: {
			[BLOCKS.EMBEDDED_ENTRY]: node => {
				const target = node.data.target as Item<unknown>
				switch (target.sys.contentType?.sys.id) {
					case 'staticPage': {
						const { fields } = target as Item<StaticPage>
						return `<a class="embed" href="/${fields.slug}">
							<p class="embedTitle">${fields.name}</p>
							<p class="embedDescription">${fields.description}</p>
						</a>`
					}
					case 'blogPost': {
						const { fields } = target as Item<BlogPost>
						return `<a class="embed" href="/${fields.slug}">
							<p class="embedTitle">${fields.title}</p>
							<p class="embedDescription">Veröffentlicht: ${new Date(fields.published).toLocaleDateString('de', { dateStyle: 'long' })}</p>
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
					const size = getSize(image, width)
					return `<img src="${encodeURI(url)}?w=${size.width}&fl=progressive&fm=jpg"
          class="EmbeddedAsset-Image"
          style="aspect-ratio: ${size.width} / ${size.height}" />`
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
					const match = /^\{\{(?<value>[a-zA-Z0-9_-]+)\}\}\s*$/.exec(node.content[0].value)
					if (match) {
						const { value } = match.groups!
						if (allowedTypes.includes(value as ComponentType)) {
							extraComponents.push({ type: value as ComponentType })
							return separator
						}
					}
				}
				return inBlock(() => `<p>${children(node.content)}</p>`)
			},

			[BLOCKS.HEADING_1]: (node, children) => inBlock(() => `<h1>${children(node.content)}</h1>`),
			[BLOCKS.HEADING_2]: (node, children) => inBlock(() => `<h2>${children(node.content)}</h2>`),
			[BLOCKS.HEADING_3]: (node, children) => inBlock(() => `<h3>${children(node.content)}</h3>`),
			[BLOCKS.HEADING_4]: (node, children) => inBlock(() => `<h4>${children(node.content)}</h4>`),
			[BLOCKS.HEADING_5]: (node, children) => inBlock(() => `<h5>${children(node.content)}</h5>`),
			[BLOCKS.HEADING_6]: (node, children) => inBlock(() => `<h6>${children(node.content)}</h6>`),
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

	if (extraComponents.length === 0) return [html]

	const parts = html.split(separator)
	return parts.flatMap((part, i) => (extraComponents[i] ? [part, extraComponents[i]] : [part]))
}
