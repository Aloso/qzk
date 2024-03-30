<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import EventView from '$lib/components/events/EventView.svelte'
	import { fetchAllEvents, fetchAllEventsWithCache } from '$lib/events/eventApi'
	import type { Event, Time, WireEvent } from '$lib/events/types'
	import { onMount } from 'svelte'
	import BlogPostPreview_ from './blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'
	import IgFeed from '$lib/components/IgFeed.svelte'
	import { wire2event } from '$lib/events/convert'

	interface Props {
		data: Data
	}

	const { data }: Props = $props()
	const { page, posts } = data

	let events = $state<Event[]>()

	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		const response = await fetchAllEventsWithCache()

		const now = Date.now()
		events = response.filter((e) => {
			const filteredTimes = e.time.filter((time) => getEnd(time) > now)
			filteredTimes.splice(3)
			e.time = filteredTimes
			return e.time.length > 0
		})
		events.sort((a, b) => +a.time[0].start - +b.time[0].start)
	}

	function getEnd(time: Time) {
		const d = new Date(time.end ?? time.start)
		if (!time.end || !time.hasStartTime) {
			d.setHours(23)
			d.setMinutes(59)
			d.setSeconds(59)
		}
		return d.getTime()
	}
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<div class="layout">
	<section class="mainbar">
		<RichText data={page.content} width={900} />

		<hr />
		<IgFeed />

		<hr />
		<h2>Neue Blog-Beiträge</h2>

		<div class="blogPosts">
			{#each posts as post}
				<BlogPostPreview_ {post} small />
			{/each}
		</div>
	</section>

	<div class="sidebar">
		<h2 class="sidebar-title">Veranstaltungen</h2>
		{#if events === undefined}
			Wird geladen...
		{:else}
			{#each events as event}
				<EventView {event} />
			{/each}
			<a href="/planen" class="add-event">Neue Veranstaltung</a>
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

	@media (min-width: 1201px) {
		.sidebar-title {
			font-family: inherit;
			font-size: 1.33rem;
			font-weight: 600;
			margin-bottom: 1em;
		}
	}

	.add-event {
		display: inline-block;
		background-color: var(--color-theme);
		color: white;
		border: none;
		margin: 0.5rem 0;
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

	.blogPosts {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
</style>
