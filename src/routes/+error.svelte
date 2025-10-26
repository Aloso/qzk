<script lang="ts">
	import { page } from '$app/state'
	import { m } from '$lib/paraglide/messages'
	import { localizeHref } from '$lib/paraglide/runtime'
</script>

<svelte:head>
	<title>{m.error()} | Queeres Zentrum Kassel</title>
</svelte:head>

<div class="inner">
	{#if page.status === 404}
		<h1>{m.e404_title()}</h1>
		<p>{m.e404_text()}</p>
		<p>
			<a href={localizeHref('/')}>{m.e404_home()}</a>
		</p>
	{:else}
		<h1>{m.error()} {page.status}</h1>
		<p>
			{page.error!.message}
		</p>
	{/if}
</div>

<style>
	.inner {
		font-size: 1.25rem;
	}
</style>
