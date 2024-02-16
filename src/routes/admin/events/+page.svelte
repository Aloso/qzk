<script lang="ts">
	import { goto } from '$app/navigation'
	import EventView from '$lib/components/events/EventView.svelte'
	import { fetchAllDrafts } from '$lib/events/draftApi'
	import type { DraftData, Event } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'

	const pageSize = 25
	let data = $state<Event[]>([])
	let length = $state(0)
	let page = $state(0)
	let loading = $state(true)
	const credentials = createAdminCredentials()

	$effect(() => {
		if (credentials.auth) {
			const response = fetchAllDrafts(credentials.auth, page * pageSize, pageSize)
			handleResponse(response)
		} else {
			goto('/admin', { replaceState: true })
		}
	})

	async function handleResponse(responsePromise: Promise<DraftData>) {
		const response = await responsePromise
		data = response.events
		length = response.length
		loading = false
	}
</script>

<div class:hidden={loading}>
	<h1>Veranstaltungen - Entwürfe</h1>
	<p class="event-count">{data.length} {data.length === 1 ? 'Veranstaltung' : 'Veranstaltungen'}</p>
	{#if length > 25}
		<p>
			Seite {page}
			<span class="pagination">
				<button disabled={page === 0} on:click={() => (page -= 1)}>Zurück</button>
				<button disabled={length <= page * pageSize} on:click={() => (page += 1)}>Weiter</button>
				{#if page > 1}
					<button on:click={() => (page = 0)}>Zum Anfang</button>
				{/if}
			</span>
		</p>
	{/if}

	{#each data as event}
		<EventView {event} editable />
	{/each}
</div>

<style lang="scss">
	.hidden {
		display: none;
	}

	h1 {
		margin-bottom: 0;
	}

	.event-count {
		margin-top: 0;
	}

	button {
		background-color: #eee;
		border: 2px solid #bbb;
		border-radius: 10px;
		padding: 0.5rem 1rem;
		color: black;
		font: inherit;
		font-size: 0.94%;
		transition: 0.2s;

		&:hover,
		&:focus {
			background-color: white;
		}
	}
</style>
