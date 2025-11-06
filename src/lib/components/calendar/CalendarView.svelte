<script lang="ts">
	import type { Event, Time } from '$lib/events/types'
	import CalendarDay from './CalendarDay.svelte'
	import MonthNav from './MonthNav.svelte'

	interface Props {
		events: Event[]
		showDate: Date
		draftTimes?: Time[]
		colorCoded?: boolean
		highlightedDate?: Date
		onClickDay?: (date: Date) => void
	}

	let { events, showDate, draftTimes, colorCoded, highlightedDate, onClickDay }: Props = $props()

	let highlightedYear = $derived(highlightedDate?.getFullYear())
	let highlightedMonth = $derived(highlightedDate?.getMonth())
	let highlightedDay = $derived(highlightedDate?.getDate())

	let draftEventYear = $derived(showDate.getFullYear())
	let draftEventMonth = $derived(showDate.getMonth())

	// svelte-ignore state_referenced_locally
	let year = $state(draftEventYear)
	// svelte-ignore state_referenced_locally
	let month = $state(draftEventMonth)

	$effect(() => {
		year = draftEventYear
		month = draftEventMonth
	})

	let firstDayOfMonth = $derived.by(() => {
		const date = new Date(showDate)
		date.setMonth(month)
		date.setDate(1)
		date.setHours(12, 0, 0, 0)
		return date
	})

	let firstWeekDay = $derived((firstDayOfMonth.getDay() + 6) % 7)
	let daysInMonth = $derived(new Date(year, month + 1, 0).getDate())
	let daysInLastMonth = $derived(new Date(year, month, 0).getDate())

	let days = $derived(
		Array.from({ length: 42 }).map((_, i) => {
			const absNumber = i - firstWeekDay + (firstWeekDay === 0 ? -6 : 1)
			return absNumber < 1
				? {
						day: daysInLastMonth + absNumber,
						month: (month + 11) % 12,
						year: month === 0 ? year - 1 : year,
					}
				: absNumber > daysInMonth
					? {
							day: absNumber - daysInMonth,
							month: (month + 1) % 12,
							year: month === 11 ? year + 1 : year,
						}
					: { day: absNumber, month, year, isCurrentMonth: true }
		}),
	)
</script>

<div class="calendar">
	<MonthNav bind:year bind:month />

	<div class="weekday-labels">
		{#each ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'] as weekDay}
			<div>{weekDay}</div>
		{/each}
	</div>
	<ul class="days">
		{#each days as day}
			<CalendarDay
				{...day}
				allEvents={events}
				{draftTimes}
				{colorCoded}
				isHighlighted={day.day === highlightedDay &&
					day.month === highlightedMonth &&
					day.year === highlightedYear}
				onClick={onClickDay}
			/>
		{/each}
	</ul>
</div>

<style lang="scss">
	.calendar {
		box-sizing: border-box;
		border: 2px solid var(--color-border);
		border-radius: 25px;
		overflow: hidden;
		height: 25rem;
		display: flex;
		flex-direction: column;
		margin: 0 0 2rem 0;
	}

	.weekday-labels {
		font-size: 1.1rem;
		margin: 0.5rem 0 0 0;
		text-align: center;
		display: flex;

		div {
			padding: 0.3rem 0.5rem;
			width: 15%;
			flex-shrink: 1;
			font-weight: 600;
			color: var(--color-text-dim);
		}
	}

	.days {
		flex-grow: 1;
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		list-style: none;
		margin: 0;
		padding: 0;
	}
</style>
