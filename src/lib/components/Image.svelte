<script lang="ts">
	import type { Image } from '$lib/data'
	import { error } from '@sveltejs/kit'
	import type { HTMLImgAttributes } from 'svelte/elements'
	import { getHtmlSize, getSize } from './imageCalc'

	interface Props extends HTMLImgAttributes {
		img: Image
		alt?: string
		fallbackAlt?: string
		width?: number
		height?: number
	}
	let { img, alt, fallbackAlt, width, height, ...rest }: Props = $props()

	let url = $derived(
		img.url || error(500, `Tried to include an asset that isn't published: ${img.id}`),
	)
	let size = $derived(getSize(img, width, height))
	let cssSize = $derived(getHtmlSize(size, width, height))
</script>

<img
	src="{url}?w={size.width}&fl=progressive&fm=jpg"
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
