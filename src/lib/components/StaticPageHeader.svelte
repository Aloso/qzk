<script lang="ts">
	import type { StaticPageTransformed } from '$lib/data'

	let { name, description }: StaticPageTransformed = $props()
</script>

<svelte:head>
	<title>{name} - Queeres Zentrum Kassel</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>
