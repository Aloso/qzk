<script lang="ts">
	import { m } from '$lib/paraglide/messages'
	import { onMount } from 'svelte'

	let message = $state<string>()
	// TODO
	// let context = $state<string>() // should be 'CONTACT_FORM' | 'EVENT'
	// let backLink = $state<string>()

	onMount(() => {
		const params = new URLSearchParams(globalThis.location.search)

		message = params.get('message') ?? undefined
		// context = params.get('context') ?? undefined
		// backLink = params.get('backLink') ?? undefined
	})
</script>

<svelte:head>
	<title>{m.error()} | Queeres Zentrum Kassel</title>
</svelte:head>

<h1>{m.email_sending_failed()}</h1>
{#if message}
	<p class="message">{message}</p>
	<p>{m.email_sending_failed_contact()}</p>
	<p>
		<a href="mailto:kontakt@queereszentrumkassel.de">kontakt@queereszentrumkassel.de</a>
	</p>
{:else}
	<p>{m.email_sending_no_message()}</p>
{/if}

<style lang="scss">
	.message {
		font-weight: 600;
	}
</style>
