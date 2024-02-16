<script lang="ts">
	import { goto } from '$app/navigation'
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
			goto('/admin')
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
		<div class="event">
			<div class="event-title">{event.title}</div>
			<div class="event-description">{event.description}</div>
			<div class="event-time">
				{new Date(event.time.start).toLocaleString('de-DE')} –
				{event.time.end ? new Date(event.time.end).toLocaleString('de-DE') : ''}
			</div>
			{#if event.time.repeats}
				<div class="event-repeats">
					Wiederholung: {event.time.repeats.cycle} - {event.time.repeats.days}
				</div>
			{/if}
			<div class="event-place">
				<div class="event-place-name">Ort: {event.place.name}</div>
				{#if event.place.type === 'PHYSICAL'}
					<div class="event-place-address">{event.place.address}</div>
					{#if event.place.room}
						<div class="event-place-room">Raum: {event.place.room}</div>
					{/if}
				{:else if event.place.address}
					<a href={event.place.address}>Link zur Teilnahme</a>
				{/if}
			</div>
			{#if event.website}
				<a class="event-website" href={event.website} target="_blank" rel="noreferrer noopener">
					Website
				</a>
			{/if}
			{#if event.organizer}
				Kontakt:
				<div class="event-organizer">{event.organizer.name}</div>
				{#if event.organizer.email}
					<a href="mailto:{event.organizer.email}">{event.organizer.email}</a>
				{/if}
				{#if event.organizer.phone}
					<a href="tel:{event.organizer.phone}">{event.organizer.phone}</a>
				{/if}
				{#if event.organizer.website}
					<a href={event.organizer.website} target="_blank" rel="noreferrer noopener">Website</a>
				{/if}
			{/if}
			{#if event.pictureUrl}
				<img src={event.pictureUrl} alt={event.title} />
			{/if}
			<div class="event-tags">
				{event.tags.join('\n')}
			</div>
			<a href="/planen?key={encodeURIComponent(event.key!)}">Bearbeiten</a>
		</div>
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

	.event-title {
		font-weight: 600;
		font-size: 2rem;
		margin: 1rem 0 0.5rem 0;
	}

	.event-place-address,
	.event-tags {
		white-space: pre-wrap;
	}
</style>
