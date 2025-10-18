<script lang="ts">
	import { onMount } from 'svelte'
	import { m } from '$lib/paraglide/messages'
	import { localizeHref } from '$lib/paraglide/runtime'

	let message = $state<string>()
	// TODO
	// let context = $state<string>() // should be 'CONTACT_FORM' | 'EVENT'
	let backLink = $state<string>()

	onMount(() => {
		const params = new URLSearchParams(globalThis.location.search)

		message = params.get('message') ?? undefined
		// context = params.get('context') ?? undefined
		backLink = params.get('backLink') ?? undefined
	})
</script>

<svelte:head>
	<title>{m.email_sent()} - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>{m.email_sent()}</h1>
<p>{m.email_sent_body()}</p>
{#if message}
	<p class="message">{message}</p>
{/if}
<p><a href={backLink ? localizeHref(backLink) : ''}>{m.actions_back()}</a></p>

<style lang="scss">
	.message {
		font-weight: 600;
	}
</style>
