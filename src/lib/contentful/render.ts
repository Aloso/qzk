import { getSize } from '$lib/components/imageCalc'
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { Document, AssetHyperlink, EntryHyperlink } from '@contentful/rich-text-types'
import type { Image, Item, Asset } from '$lib/contentful/types'
import type { Entry } from 'contentful'
import type { StaticPage, BlogPost, Author } from '$lib/data'

export function renderData(data: Document, width: number): string {
	return documentToHtmlString(data, {
		preserveWhitespace: true,
		renderNode: {
			[BLOCKS.EMBEDDED_ASSET]: node => {
				const image = node.data.target as Image
				const { contentType, url } = image.fields.file
				if (contentType.startsWith('image/')) {
					const size = getSize(image, width)
					return `<img src="${encodeURI(url)}?w=${size.width}&fl=progressive&fm=jpg"
          class="EmbeddedAsset-Image"
          style="aspect-ratio: ${size.width} / ${size.height}" />`
				}
				return ''
			},
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
				} else if (sys.contentType.sys.id === 'author') {
					const { slug } = fields as unknown as Author
					return `<a href="/autor/${slug}">${children(content)}</a>`
				} else {
					return '<span style="color: red">FEHLER: Nicht unterstützer Entry Type</span>'
				}
			},
		},
	})
}
