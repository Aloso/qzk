<script lang="ts">
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import BlogPostPreview from './blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'
	import IgFeed from '$lib/components/IgFeed.svelte'
	import OpeningHours from '$lib/components/OpeningHours.svelte'
	import ImportantInfo from '$lib/components/ImportantInfo.svelte'

	interface Props {
		data: Data
	}

	const { data }: Props = $props()
	const { generalInfo, posts, events } = data
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<div class="layout">
	<section class="mainbar">
		<h1>Veranstaltungen</h1>

		<div class="event-container">
			{#each events as event}
				<EventViewSmall {event} />
			{/each}
			<div></div>
			<div></div>
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
</style>
