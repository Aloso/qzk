<script lang="ts">
	import { getHtmlSize, getSize } from './imageCalc'
	import type { Image } from '../contentful/types'
	import type { HTMLImgAttributes } from 'svelte/elements'

	interface Props extends HTMLImgAttributes {
		img: Image
		alt?: string
		fallbackAlt?: string
		width?: number
		height?: number
	}
	let { img, alt, fallbackAlt, width, height, ...rest } = $props<Props>()

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
