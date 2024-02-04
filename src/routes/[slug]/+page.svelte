<script lang="ts">
	import type { Item } from '$lib/contentful/types'
	import type { StaticPage } from '$lib/data'
	import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

	export let data: Item<StaticPage>
</script>

<svelte:head>
	<title>{data.fields?.name} - Queeres Zentrum Kassel</title>
	{#if data.fields?.description}
		<meta name="description" content={data.fields?.description} />
	{/if}
</svelte:head>

<section>
	{@html documentToHtmlString(data.fields?.content)}
</section>
