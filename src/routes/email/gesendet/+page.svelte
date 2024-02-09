<script lang="ts">
	import { onMount } from 'svelte'

	let message = $state<string>()
	let context = $state<string>() // should be 'CONTACT_FORM' | 'EVENT'
	let backLink = $state<string>()

	onMount(() => {
		const params = new URLSearchParams(globalThis.location.search)

		message = params.get('message') ?? undefined
		context = params.get('context') ?? undefined
		backLink = params.get('backLink') ?? undefined
	})
</script>

<svelte:head>
	<title>Nachricht gesendet - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Nachricht gesendet</h1>
<p>Wir haben Deine Nachricht erhalten.</p>
{#if message}
	<p class="message">{message}</p>
{/if}
<p><a href={backLink}>Zurück</a></p>

<style lang="scss">
	.message {
		font-weight: 600;
	}
</style>
