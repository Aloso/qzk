<script lang="ts">
	import { goto } from '$app/navigation'
	import EventView from '$lib/components/events/EventView.svelte'
	import TabBar from '$lib/components/TabBar.svelte'
	import type { Auth } from '$lib/events'
	import { fetchAllDrafts } from '$lib/events/draftApi'
	import { fetchAllEvents } from '$lib/events/eventApi'
	import type { Event } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'

	const pageSize = 25

	let tab = $state<'drafts' | 'published'>('drafts')

	let data = $state<Event[]>([])
	let length = $state(0)
	let page = $state(0)
	let loading = $state(true)
	const credentials = createAdminCredentials()

	$effect(() => {
		if (credentials.auth) {
			loading = true
			setEvents(tab, credentials.auth, page)
		} else {
			goto('/admin', { replaceState: true })
		}
	})

	async function setEvents(tab: 'drafts' | 'published', auth: Auth, page: number) {
		if (tab === 'drafts') {
			const response = await fetchAllDrafts(auth, page * pageSize, pageSize)
			data = response.events
			length = response.length
			loading = false
		} else {
			data = await fetchAllEvents()
			data.sort((a, b) => a.time.start.localeCompare(b.time.start))

			length = data.length
			loading = false
		}
	}
</script>

<h1>Veranstaltungen</h1>
<TabBar
	tabs={[
		['drafts', 'Entwürfe'],
		['published', 'Veröffentlicht'],
	]}
	bind:active={tab}
/>

<div class:hidden={loading}>
	<p class="event-count">{data.length} {data.length === 1 ? 'Veranstaltung' : 'Veranstaltungen'}</p>
	{#if tab === 'drafts' && length > 25}
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

	<p class="warning">
		Warnung: {tab === 'drafts' ? 'Veröffentlichte/entfernte' : 'Entfernte'} Veranstaltungen können aufgrund
		von Caches bis zu 60 Sekunden später noch angezeigt werden.
	</p>

	{#each data as event, i}
		<EventView
			{event}
			editable
			published={tab === 'published'}
			onEdited={(e) => (data[i] = e)}
			onPublished={() => data.splice(i, 1)}
			onDeletedOrUnpublished={() => data.splice(i, 1)}
		/>
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
		border: 2px solid #aaa;
		border-radius: 10px;
		padding: 0.5rem 1rem;
		color: black;
		font: inherit;
		font-size: 94%;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: white;
		}
	}

	.warning {
		background-color: #f8efc2;
		padding: 10px 15px;
		border-radius: 15px;
		font-size: 1.1rem;
	}
</style>
