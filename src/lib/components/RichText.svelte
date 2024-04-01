<script lang="ts" context="module">
	if (dev && browser) {
		let showParagraphs = 'show-paragraphs' in localStorage
		if (showParagraphs) {
			document.body.classList.toggle('show-paragraphs')
		}

		const listener = (event: KeyboardEvent) => {
			if (event.key === '§' && event.target === document.body) {
				showParagraphs = !showParagraphs
				if (showParagraphs) {
					localStorage.setItem('show-paragraphs', 'true')
				} else {
					localStorage.removeItem('show-paragraphs')
				}
				document.body.classList.toggle('show-paragraphs')
			}
		}
		document.body.addEventListener('keypress', listener)
	}
</script>

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
	import { browser, dev } from '$app/environment'

	interface Props {
		data: Document
		width: number
		small?: boolean
	}

	const { data, width }: Props = $props()

	const html = $derived.by(() => {
		let result = documentToHtmlString(data, {
			preserveWhitespace: true,
			renderNode: {
				[BLOCKS.EMBEDDED_ASSET]: (node) => {
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
		return dev ? result.replaceAll('<br/>', '<span data-p-mark></span><br/>') : result
	})
</script>

{@html html}

<style lang="scss">
	:global(.EmbeddedAsset-Image) {
		display: block;
		width: 100%;
		border-radius: 30px;
		margin: 1.33rem 0;
	}
</style>
