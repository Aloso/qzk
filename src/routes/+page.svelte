<script lang="ts">
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import BlogPostPreview from './blog/BlogPostPreview.svelte'
	import type { Data } from './+page.server'
	import IgFeed from '$lib/components/IgFeed.svelte'
	import OpeningHours from '$lib/components/OpeningHours.svelte'
	import ImportantInfo from '$lib/components/ImportantInfo.svelte'
	import CalendarView from '$lib/components/calendar/CalendarView.svelte'
	import DayDetail from '$lib/components/calendar/DayDetail.svelte'
	import { m } from '$lib/paraglide/messages'

	interface Props {
		data: Data
	}

	const { data }: Props = $props()
	const { generalInfo, posts, events } = data

	const today = new Date()
	const filteredEvents = events?.filter(e => e.times.length > 0)

	let openCalendarDay = $state<Date>()
</script>

<svelte:head>
	<title>Queeres Zentrum Kassel</title>
	<meta name="description" content="Dies ist die Startseite des Queeren Zentrums Kassel" />
</svelte:head>

<div class="layout">
	<section class="important">
		<h2 class="sidebar-title">{m.home_opening_hours()}</h2>
		<OpeningHours {...generalInfo} />

		{#if generalInfo.importantInfo?.length}
			<h2 class="sidebar-title">{m.home_important()}</h2>
			<ImportantInfo {...generalInfo} />
		{/if}
	</section>

	<section class="events">
		<h2>{m.home_events()}</h2>

		<div class="event-container">
			<div class="calendar-wrapper" class:is-expanded={openCalendarDay !== undefined}>
				<CalendarView
					{events}
					showDate={today}
					colorCoded
					highlightedDate={openCalendarDay}
					onClickDay={day => {
						if (day === openCalendarDay) {
							openCalendarDay = undefined
						} else {
							openCalendarDay = day
						}
					}}
				/>
			</div>

			{#if openCalendarDay}
				<DayDetail
					day={openCalendarDay}
					allEvents={events}
					onClose={() => (openCalendarDay = undefined)}
				/>
			{/if}

			{#each filteredEvents as event (event.key)}
				<EventViewSmall {event} />
			{/each}
			<div></div>
			<div></div>
		</div>
		{#if filteredEvents}
			<div class="label-bottom">
				{#if filteredEvents.length > 0}
					{m.home_event_limit_reached()}
				{:else}
					{m.home_no_events()}
				{/if}
			</div>
		{/if}
	</section>

	<section class="social-and-blog">
		<h2 class="sidebar-title">Instagram</h2>
		<IgFeed />

		<h2 class="sidebar-title">{m.home_plan_event()}</h2>
		<p>{m.home_select_day_to_plan()}</p>
		<noscript><p>{m.noscript()}</p></noscript>
		<!--
		<p>Du möchtest etwas im Queeren Zentrum veranstalten?</p>

		<a href="/planen" class="add-event">Neue Veranstaltung</a>
		-->

		<h2 class="sidebar-title">{m.home_new_blog_posts()}</h2>

		<div class="blog-posts">
			{#each posts as post (post.slug)}
				<BlogPostPreview {post} />
			{/each}
		</div>
	</section>
</div>

<style lang="scss">
	.layout {
		display: grid;
		grid-template: 'events important' 0fr 'events social-and-blog' 1fr / 2fr 1fr;
		gap: 0 3rem;

		@media (max-width: 78rem) {
			grid-template: 'important' 'events' 'social-and-blog' / 1fr;
			max-width: 44rem;
		}
	}

	.important {
		grid-area: important;
		max-width: calc(100vw - 2rem);
	}
	.events {
		grid-area: events;
		max-width: calc(100vw - 2rem);
	}
	.social-and-blog {
		grid-area: social-and-blog;
		max-width: calc(100vw - 2rem);
	}

	.events h2 {
		margin-bottom: 20px;
	}

	.event-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 0 2rem;
		align-items: start;
		margin: 1.25rem 0 0;
	}

	.calendar-wrapper.is-expanded {
		@media (max-width: 750px) {
			display: none;
		}
	}

	.label-bottom {
		@media (max-width: 22rem) {
			margin: 1rem 0 0 0;
		}
	}

	.important {
		margin-top: 1.8rem;

		@media (max-width: 78rem) {
			margin-top: 0;
		}
	}

	@media (min-width: 78.01rem) {
		.sidebar-title {
			font-size: 1.33rem;
			font-weight: 600;
			margin-bottom: 1em;
		}
	}

	/*
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
	*/

	.blog-posts {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}
</style>
