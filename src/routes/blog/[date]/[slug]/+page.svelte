<script lang="ts">
	import PublishDate from '../../PublishDate.svelte'
	import Authors from '../../Authors.svelte'
	import Image from '$lib/components/Image.svelte'
	import type { BlogPost } from '$lib/data'
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

	export let data: BlogPost
</script>

<svelte:head>
	<title>{data.title} - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>{data.title}</h1>
<div><PublishDate date={data.published} withDescription /></div>
<Authors authors={data.authors} />
<Image class="BlogPost-photo" img={data.photo} width={800} />
<section>
	{@html documentToHtmlString(data.content)}
</section>

<style lang="scss">
	:global(.BlogPost-photo) {
		border-radius: 30px;
		margin-bottom: 1rem;
	}

	section {
		max-width: 800px;
	}
</style>
