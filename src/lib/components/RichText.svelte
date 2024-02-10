<script lang="ts">
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
	import { BLOCKS, type Document } from '@contentful/rich-text-types'
	import type { Image } from '$lib/contentful/types'
	import { getSize } from './imageCalc'

	interface Props {
		data: Document
		width: number
		small?: boolean
	}

	const { data, width } = $props<Props>()
</script>

{@html documentToHtmlString(data, {
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
