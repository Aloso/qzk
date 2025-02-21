<script lang="ts">
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import StaticPage from '$lib/components/StaticPage.svelte'
	import type { StaticPageTransformed } from '$lib/data'
	import PlanningForm from '$lib/components/planning-form/PlanningForm.svelte'
	import { submitDraft } from '$lib/events/draftApi'
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import { createSubmittedDrafts } from '$lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { goto } from '$app/navigation'
	import CalendarView from '$lib/components/calendar/CalendarView.svelte'
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import { narrowTimesToDraft } from '$lib/events/intersections'
	import SubmittedList from '$lib/components/events/SubmittedList.svelte'
	import { onMount } from 'svelte'
	import { fetchAllEvents } from '$lib/events/eventApi'

	let { data }: { data: StaticPageTransformed } = $props()

	type Status = { type: 'ready' } | { type: 'submitting' } | { type: 'error'; message: string }

	let status = $state<Status>({ type: 'ready' })

	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	async function onSubmit(event: Event & WithSubmitter) {
		status = { type: 'submitting' }
		try {
			const { key } = await submitDraft(event)
			const date = new Date().toLocaleString('de-DE', {
				timeZone: 'Europe/Berlin',
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
			submittedDrafts.add(key, `${date} - ${event.title}`)
			goto('/veranstaltungen/' + encodeURIComponent(key))
		} catch (e) {
			status = { type: 'error', message: e instanceof Error ? e.message : 'Fehler' }
		}
	}

	let clickCalendarDay = $state<(date: Date) => void>()

	let events = $state<Event[]>()
	let draftTimes = $state<Time[]>()
	let showDate = $state(new Date())
	let intersecting = $derived.by(() => {
		if (!events || !draftTimes) return []

		return events
			.flatMap<Event>(event => {
				const time = narrowTimesToDraft(event.time, draftTimes!)
				if (time.length === 0) return []
				return [{ ...event, time, allTimes: event.time }]
			})
			.sort((a, b) => +a.time[0].start - +b.time[0].start)
	})
	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		events = await fetchAllEvents()
		events.sort((a, b) => (a.time[0]?.start.getTime() ?? 0) - (b.time[0]?.start.getTime() ?? 0))
	}
</script>

<StaticPageHeader {...data} />

<section>
	<StaticPage {data} />
</section>

<hr />

<SubmittedList items={submittedDrafts.items} />

<h2>Veranstaltung einreichen</h2>

<div class="form-layout">
	<div class="form-left">
		<PlanningForm
			defaults={defaults.values}
			onSubmit={event => onSubmit(event)}
			onTimeChange={time => {
				draftTimes = time
				showDate = new Date(time[0].start)
			}}
			{status}
			bind:clickCalendarDay
		/>

		{#if intersecting.length > 0}
			<h3>
				{intersecting.length} Veranstaltung{intersecting.length > 1 ? 'en' : ''} im gewählten Zeitraum
			</h3>
			<p>Bitte überprüfe, dass kein Terminkonflikt entsteht.</p>
			<div class="event-container">
				{#each intersecting as event}
					<EventViewSmall {event} showMore openInNewTab />
				{/each}
				<div></div>
				<div></div>
			</div>
		{/if}
	</div>

	{#if events}
		<div class="calendar">
			<h2 class="sidebar-title">Kalender</h2>

			<CalendarView {events} {showDate} {draftTimes} onClickDay={clickCalendarDay} />
		</div>
	{/if}
</div>

<style lang="scss">
	.form-layout {
		display: flex;
		gap: 2rem 3rem;
		align-items: flex-start;

		.form-left {
			flex-grow: 1;
			max-width: 44rem;
		}

		@media (max-width: 1000px) {
			flex-direction: column;

			.form-left {
				width: 100%;
			}
		}
	}

	.sidebar-title {
		font-size: 1.33rem;
		font-weight: 600;
		margin: 1em 0;
		font-family: inherit;

		&:first-child {
			margin-top: 0;
		}
	}

	.calendar {
		width: 21rem;
		flex-grow: 0;
		flex-shrink: 1;
		box-sizing: border-box;

		@media (max-width: 1000px) {
			width: auto;
			max-width: 27rem;
		}
	}

	.event-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 0 2rem;
		align-items: start;
		margin: 1rem 0 0 0;
	}
</style>
