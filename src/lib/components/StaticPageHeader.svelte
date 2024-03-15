<script lang="ts">
	import type { StaticPage } from '$lib/data'

	let { name, description }: StaticPage = $props()
</script>

<svelte:head>
	<title>{name} - Queeres Zentrum Kassel</title>
	{#if description}
		<meta name="description" content={description} />
	{/if}
</svelte:head>
