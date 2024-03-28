<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from '$lib/components/planning-form/PlanningForm.svelte'
	import { submitDraft } from '$lib/events/draftApi'
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import { createSubmittedDrafts } from '../../lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { goto } from '$app/navigation'
	import SubmittedList from './SubmittedList.svelte'
	import CalendarView from '$lib/components/calendar/CalendarView.svelte'
	import { onMount } from 'svelte'
	import { fetchAllEvents, fetchAllEventsWithCache } from '$lib/events/eventApi'
	import EventView from '$lib/components/events/EventView.svelte'

	let { data }: { data: StaticPage } = $props()

	type Status = { type: 'ready' } | { type: 'submitting' } | { type: 'error'; message: string }

	let status = $state<Status>({ type: 'ready' })
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	async function onSubmit(event: Event & WithSubmitter) {
		status = { type: 'submitting' }
		try {
			const { key } = await submitDraft(event)
			const date = new Date().toLocaleString('de-DE', {
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
			submittedDrafts.add(key, `${date} - ${event.title}`)
			goto('/planen/eingereicht?key=' + encodeURIComponent(key))
		} catch (e) {
			if (e instanceof Error) {
				status = { type: 'error', message: e.message }
			}
		}
	}

	let events = $state<Event[]>()
	let draftTime = $state<Time>()
	let showDate = $state(new Date())
	let intersecting = $derived.by(() => {
		if (!events || !draftTime) return []

		let eStart = draftTime.start
		let eEnd = draftTime.end ?? draftTime.start
		eEnd.setHours(23)
		eEnd.setMinutes(59)
		eEnd.setSeconds(59)

		return events.filter((event) =>
			event.time.some((time) => !(time.start > eEnd || (time.end ?? time.start) < eStart)),
		)
	})
	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		events = await fetchAllEventsWithCache()
		events.sort((a, b) => (a.time[0]?.start.getTime() ?? 0) - (b.time[0]?.start.getTime() ?? 0))
	}
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.content} width={900} />
</section>

<hr />

<SubmittedList items={submittedDrafts.items} />

<h2>Veranstaltung einreichen</h2>

<div class="form-layout">
	<PlanningForm
		defaults={defaults.values}
		onSubmit={(event) => onSubmit(event)}
		onTimeChange={(time) => {
			draftTime = time
			showDate = new Date(time.start)
		}}
		{status}
	/>

	{#if events}
		<div class="calendar">
			<h2 class="sidebar-title">Kalender</h2>

			<CalendarView {events} {showDate} {draftTime} />

			{#if intersecting.length > 0}
				<h2 class="sidebar-title">
					{intersecting.length} Veranstaltung{intersecting.length > 1 ? 'en' : ''} im Zeitraum
				</h2>
				{#each intersecting as event}
					<EventView {event} showDescription={false} showPlace />
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.form-layout {
		display: flex;
		gap: 2rem;
		align-items: flex-start;

		@media (max-width: 1280px) {
			flex-direction: column;
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
		width: 30rem;
		flex-grow: 1;
		flex-shrink: 1;
		box-sizing: border-box;

		@media (max-width: 1280px) {
			width: auto;
			max-width: 40rem;
		}
	}
</style>
