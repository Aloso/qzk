<script lang="ts">
	import { page } from '$app/state'
	import { localizeHref } from '$lib/paraglide/runtime'
</script>

<svelte:head>
	<title>Fehler - Queeres Zentrum Kassel</title>
</svelte:head>

<div class="inner">
	{#if page.status === 404}
		<h1>Seite nicht gefunden</h1>
		<p>Entschuldigung, wir haben nicht gefunden, wonach Du suchst.</p>
		<p>
			<a href={localizeHref('/')}>Zur Startseite</a>
		</p>
	{:else}
		<h1>Fehler {page.status}</h1>
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
