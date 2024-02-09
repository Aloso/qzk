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
	<title>Fehler - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Fehler beim Senden der Nachricht</h1>
{#if message}
	<p class="message">{message}</p>
	<p>Wir entschuldigen uns für die Störung. Bitte kontaktiere uns per E-Mail:</p>
	<p>
		<a href="mailto:orga-queereszentrumkassel@riseup.net">orga-queereszentrumkassel@riseup.net</a>
	</p>
{:else}
	<p>Keine Nachricht vorhanden!</p>
{/if}

<style lang="scss">
	.message {
		font-weight: 600;
	}
</style>
