<script lang="ts">
	import { getHtmlSize, getSize } from './imageCalc'
	import type { HTMLImgAttributes } from 'svelte/elements'
	import type { Image } from '$lib/data'

	interface Props extends HTMLImgAttributes {
		img: Image
		alt?: string
		fallbackAlt?: string
		width?: number
		height?: number
	}
	let { img, alt, fallbackAlt, width, height, ...rest }: Props = $props()

	if (!img.url) {
		throw new Error(`Tried to include an asset that isn't published: ${img.id}`)
	}

	const size = getSize(img, width, height)
	const cssSize = getHtmlSize(size, width, height)
</script>

<img
	src="{img.url}?w={size.width}&fl=progressive&fm=jpg"
	width={cssSize.width}
	height={cssSize.height}
	alt={alt ?? img.description ?? fallbackAlt}
	{...rest}
/>

<style>
	img {
		display: block;
		object-fit: cover;
		background-color: #eee;
		text-align: center;
		line-height: 1.5rem;
		color: #777;
		overflow: hidden;
	}
</style>
