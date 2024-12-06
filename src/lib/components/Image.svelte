<script lang="ts">
	import { getHtmlSize, getSize } from './imageCalc'
	import type { Image } from '../contentful/types'
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { page } from '$app/stores'

	interface Props extends HTMLImgAttributes {
		context: string
		img: Image
		alt?: string
		fallbackAlt?: string
		width?: number
		height?: number
	}
	let { context, img, alt, fallbackAlt, width, height, ...rest }: Props = $props()

	if (!img.fields) {
		const pathname = $page.url.pathname
		import('node:fs').then(fs => {
			fs.appendFileSync(
				'.sveltekit-errors.txt',
				`Fehler: Ein Bild wurde auf "${context}" verwendet, das noch nicht auf Contentful veröffentlicht wurde: \`${img.sys.id}\`\n`,
			)
		})

		throw new Error(`Tried to include an asset that isn't published: ${img.sys.id}`)
	}

	const size = getSize(img, width, height)
	const cssSize = getHtmlSize(size, width, height)
</script>

<img
	src="{img.fields.file.url}?w={size.width}&fl=progressive&fm=jpg"
	width={cssSize.width}
	height={cssSize.height}
	alt={alt ?? img.fields.description ?? fallbackAlt}
	{...rest}
/>

<style>
	img {
		object-fit: cover;
		background-color: #eee;
	}
</style>
