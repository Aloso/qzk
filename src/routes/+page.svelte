<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import EventView from '$lib/components/events/EventView.svelte'
	import type { StaticPage } from '$lib/data'
	import { fetchAllEvents } from '$lib/events/eventApi'
	import type { Event } from '$lib/events/types'
	import { onMount } from 'svelte'

	interface Props {
		data: StaticPage
	}

	let { data } = $props<Props>()

	let events = $state<Event[]>()

	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		const now = Date.now()
		events = (await fetchAllEvents()).filter((e) => getEnd(e.time) > now)
		events.sort((a, b) => a.time.start.localeCompare(b.time.start))
	}

	function getEnd(time: Event['time']) {
		let d = time.end ?? time.start
		if (!d.includes('T')) d = `${d}T23:59:59`
		return new Date(d).getTime()
	}
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<div class="layout">
	<section class="mainbar">
		<RichText data={data.content} width={900} />
	</section>

	<div class="sidebar">
		<div class="sidebar-title">Veranstaltungen</div>
		{#if events === undefined}
			Wird geladen...
		{:else}
			{#each events as event}
				<EventView {event} />
			{/each}
			<a href="/planen" class="add-event">Veranstaltung einreichen</a>
		{/if}
	</div>
</div>

<style lang="scss">
	.layout {
		display: flex;
		gap: 4rem;

		@media (max-width: 1200px) {
			flex-direction: column;
		}
	}

	.mainbar {
		width: 44rem;

		@media (max-width: 1200px) {
			width: auto;
		}
	}

	.sidebar {
		width: 22rem;
		margin: 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 1200px) {
			width: auto;
		}
	}

	.sidebar-title {
		font-size: 1.33rem;
		font-weight: 600;
		margin-bottom: 1em;
	}

	.add-event {
		display: inline-block;
		background-color: var(--color-theme);
		color: white;
		border: none;
		padding: 12px 18px;
		border-radius: 15px;
		font: inherit;
		font-size: 1rem;
		transition: background-color 0.2s;
		animation: 1s fade-in;
		text-decoration: none;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}
	}

	section {
		max-width: 44rem;
	}
</style>
