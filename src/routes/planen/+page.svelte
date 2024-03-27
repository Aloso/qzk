<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from '$lib/components/planning-form/PlanningForm.svelte'
	import { submitDraft } from '$lib/events/draftApi'
	import type { Event } from '$lib/events/types'
	import { createSubmittedDrafts } from '../../lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { goto } from '$app/navigation'
	import SubmittedList from './SubmittedList.svelte'
	import CalendarView from '$lib/components/calendar/CalendarView.svelte'
	import { onMount } from 'svelte'
	import { fetchAllEvents, type EventNoSubmitter } from '$lib/events/eventApi'
	import EventView from '$lib/components/events/EventView.svelte'

	let { data }: { data: StaticPage } = $props()

	type Status = { type: 'ready' } | { type: 'submitting' } | { type: 'error'; message: string }

	let status = $state<Status>({ type: 'ready' })
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	async function onSubmit(event: Event) {
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

	let events = $state<EventNoSubmitter[]>()
	let draftTime = $state<Event['time']>()
	let showDate = $state(new Date())
	let intersecting = $derived.by(() => {
		if (!events || !draftTime) return []

		let eStart = new Date(draftTime.start)
		let eEnd = new Date(draftTime.end ?? draftTime.start)
		eEnd.setHours(23)
		eEnd.setMinutes(59)
		eEnd.setSeconds(59)

		return events.filter((event) => {
			const start = new Date(event.time.start)
			const end = event.time.end ? new Date(event.time.end) : start
			return !(start > eEnd || end < eStart)
		})
	})
	onMount(() => {
		loadEvents()
	})

	async function loadEvents() {
		const response = await (window.__fetchEventsPromise ?? fetchAllEvents())
		window.__fetchEventsPromise = undefined

		events = response
		events.sort((a, b) => a.time.start.localeCompare(b.time.start))
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
