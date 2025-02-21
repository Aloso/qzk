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
	<section class="important">
		<h2 class="sidebar-title">Öffnungszeiten</h2>
		<OpeningHours {...generalInfo} />

		{#if generalInfo.importantInfo.length > 0}
			<h2 class="sidebar-title">Wichtig</h2>
			<ImportantInfo {...generalInfo} />
		{/if}
	</section>

	<section class="events">
		<h2>Veranstaltungen</h2>

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

	<section class="social-and-blog">
		<h2 class="sidebar-title">Instagram</h2>
		<IgFeed />

		<h2 class="sidebar-title">Veranstaltung planen</h2>
		<p>Du möchtest etwas im Queeren Zentrum veranstalten?</p>

		<a href="/planen" class="add-event">Neue Veranstaltung</a>

		<h2 class="sidebar-title">Neue Blog-Beiträge</h2>

		<div class="blog-posts">
			{#each posts as post}
				<BlogPostPreview {post} />
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	.layout {
		display: grid;
		grid-template: 'events important' 'events social-and-blog' / 2fr 1fr;
		gap: 0 3rem;

		@media (max-width: 1200px) {
			grid-template: 'important' 'events' 'social-and-blog' / 1fr;
			max-width: 44rem;
		}
	}

	.important {
		grid-area: important;
	}
	.events {
		grid-area: events;
	}
	.social-and-blog {
		grid-area: social-and-blog;
	}

	.events h2 {
		margin-bottom: 20px;
	}

	.event-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 0 2rem;
		align-items: start;
		margin: 1rem 0 0 0;
	}

	.important {
		margin-top: 1.8rem;

		@media (max-width: 1200px) {
			margin-top: 0;
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

	.blog-posts {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
