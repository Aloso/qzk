<script lang="ts">
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import { fetchAllEventsWithCache } from '$lib/events/eventApi'
	import type { Event } from '$lib/events/types'
	import { onMount } from 'svelte'
	import BlogPostPreview from './blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'
	import { getEndOfTime } from '$lib/events/intersections'
	import IgFeed from '$lib/components/IgFeed.svelte'
	import OpeningHours from '$lib/components/OpeningHours.svelte'
	import ImportantInfo from '$lib/components/ImportantInfo.svelte'
	import EventView from '$lib/components/events/EventView.svelte'
	import { pushState, beforeNavigate } from '$app/navigation'

	interface Props {
		data: Data
	}

	const { data }: Props = $props()
	const { generalInfo, posts } = data

	let events = $state<Event[]>()
	let openEvent = $state<Event>()
	let scrollPos = $state<readonly [number, number]>([0, 0])

	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		const response = await fetchAllEventsWithCache()

		const now = Date.now()
		const inOneMonth = Date.now() + 30 * 24 * 60 * 60 * 1000
		events = response.filter(e => {
			const filteredTimes = e.time.filter(
				time => +time.start < inOneMonth && getEndOfTime(time) > now,
			)
			filteredTimes.splice(3)
			e.time = filteredTimes
			return e.time.length > 0
		})
		events.sort((a, b) => +a.time[0].start - +b.time[0].start)

		if (location.hash !== '') {
			hashChange({ newURL: location.href })
		}
	}

	function onOpenEvent(event: Event) {
		const url = new URL(location.href)
		url.hash = `#veranstaltung-${event.key}`
		pushState(url, {})
		hashChange({ newURL: url.toString() })
	}

	function onCloseEvent() {
		history.back()
	}

	function hashChange(change: { newURL: string }) {
		const hash = new URL(change.newURL).hash.replace('#', '').replace(/^(veranstaltung|event)-/, '')
		if (hash === '') {
			openEvent = undefined
			document.title = 'Queeres Zentrum Kassel'
		} else if (events) {
			const event = events.find(event => event.key === hash)
			if (event) {
				scrollPos = [document.documentElement.scrollLeft, document.documentElement.scrollTop]

				openEvent = event
				document.title = `${event.title} – Queeres Zentrum Kassel`
			}
		}
	}

	beforeNavigate(change => {
		if (change.to && change.from) {
			const fromUrl = new URL(change.from.url)
			const toUrl = new URL(change.to.url)
			fromUrl.hash = ''
			toUrl.hash = ''
			if (fromUrl.toString() === toUrl.toString()) {
				change.cancel()
				hashChange({ newURL: change.to.url.toString() })
			}
		}
	})

	$effect(() => {
		window.addEventListener('hashchange', hashChange)
		return () => {
			window.removeEventListener('hashchange', hashChange)
		}
	})
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

{#if openEvent}
	<EventView previousScrollPos={scrollPos} event={openEvent} onClose={onCloseEvent} />
{:else}
	<div class="layout">
		<section class="mainbar">
			<h1>Veranstaltungen</h1>

			<div class="event-container">
				{#if events === undefined}
					<div class="event-skeleton">Lädt...</div>
					<div class="event-skeleton">Lädt...</div>
					<div class="event-skeleton">Lädt...</div>
					<div class="event-skeleton">Lädt...</div>
				{:else}
					{#each events as event}
						<EventViewSmall {event} onOpen={() => onOpenEvent(event)} />
					{/each}
					<div></div>
				{/if}
			</div>
			{#if events}
				{#if events.length > 0}
					Es werden Veranstaltungen der nächsten 30 Tage angezeigt.
				{:else}
					Keine Veranstaltungen in den nächsten 30 Tagen
				{/if}
			{/if}
		</section>

		<div class="sidebar">
			<h2 class="sidebar-title">Öffnungszeiten</h2>
			<OpeningHours {...generalInfo} />

			{#if generalInfo.importantInfo.length > 0}
				<h2 class="sidebar-title">Wichtig</h2>
				<ImportantInfo {...generalInfo} />
			{/if}

			<h2 class="sidebar-title">Instagram</h2>
			<IgFeed />

			<h2 class="sidebar-title">Veranstaltung planen</h2>
			<p>Du möchtest etwas im Queeren Zentrum veranstalten?</p>

			<a href="/planen" class="add-event">Neue Veranstaltung</a>

			<h2 class="sidebar-title">Neue Blog-Beiträge</h2>

			<div class="blog-posts">
				{#each posts as post}
					<BlogPostPreview {post} small noImage />
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="scss">
	.layout {
		display: flex;
		gap: 1rem 3rem;

		@media (max-width: 1200px) {
			flex-direction: column;
		}
	}

	.mainbar {
		width: 44rem;

		@media (max-width: 1200px) {
			width: auto;
		}

		h1 {
			margin-bottom: 20px;
		}
	}

	.event-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		align-items: start;
		margin: 1rem 0;
	}

	.sidebar {
		width: 22rem;
		margin: 3rem 0 2rem 0;
		position: sticky;
		top: 0;

		@media (max-width: 1200px) {
			width: auto;
			border-top: 2px solid #ccc;
		}
	}

	@media (min-width: 1201px) {
		.sidebar-title {
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

	.blog-posts {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.event-skeleton {
		height: 450px;
		border-radius: 25px;
		background-color: #eee;
		animation: wobble 2s ease-in-out alternate infinite;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #0005;
	}

	@keyframes wobble {
		0% {
			background-color: #eee;
		}
		100% {
			background-color: #ddd;
		}
	}
</style>
