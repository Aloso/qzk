<script lang="ts">
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
	import {
		BLOCKS,
		INLINES,
		type Document,
		type AssetHyperlink,
		type EntryHyperlink,
	} from '@contentful/rich-text-types'
	import type { Image, Item, Asset } from '$lib/contentful/types'
	import { getSize } from './imageCalc'
	import type { Entry } from 'contentful'
	import type { StaticPage, BlogPost, Author } from '$lib/data'

	interface Props {
		data: Document
		width: number
		small?: boolean
	}

	const { data, width } = $props<Props>()
</script>

{@html documentToHtmlString(data, {
	preserveWhitespace: true,
	renderNode: {
		[BLOCKS.EMBEDDED_ASSET]: (node) => {
			const image = node.data.target as Image
      const { contentType, url } = image.fields.file;
      if (contentType.startsWith('image/')) {
	      const size = getSize(image, width)
        return `<img src="${encodeURI(url)}?w=${size.width}&fl=progressive&fm=jpg"
          class="EmbeddedAsset-Image"
          style="aspect-ratio: ${size.width} / ${size.height}" />`
      }
			return ''
		},
		[INLINES.ASSET_HYPERLINK]: (node, children) => {
			console.log(children)
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
})}

<style lang="scss">
	:global(.EmbeddedAsset-Image) {
		display: block;
		width: 100%;
		border-radius: 30px;
		margin: 1.33rem 0;
	}
</style>
