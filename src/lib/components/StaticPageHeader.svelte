<script lang="ts">
	import type { Item } from '$lib/contentful'
	import type { StaticPage } from '$lib/data'

	let { fields } = $props<Item<StaticPage>>()
</script>

<svelte:head>
	<title>{fields?.name} - Queeres Zentrum Kassel</title>
	{#if fields?.description}
		<meta name="description" content={fields?.description} />
	{/if}
</svelte:head>
