<script lang="ts">
	import type { Event, Time } from '$lib/events/types'
	import { getLocale } from '$lib/paraglide/runtime'
	import { getCalendarDays } from '../timeCalc'
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

	let locale = getLocale()
	let intlLocale = new Intl.Locale(navigator.language) as { weekInfo?: { firstDay: 1 | 7 } }
	let firstDayOfWeek = intlLocale.weekInfo?.firstDay ?? (locale === 'de' ? 1 : 7)

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

	let days = $derived(getCalendarDays(showDate, month, year, firstDayOfWeek))

	let weekdays =
		locale === 'de'
			? ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
			: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	if (firstDayOfWeek === 7) {
		weekdays.unshift(weekdays.pop()!)
	}
</script>

<div class="calendar">
	<MonthNav bind:year bind:month />

	<div class="weekday-labels">
		{#each weekdays as weekDay (weekDay)}
			<div>{weekDay}</div>
		{/each}
	</div>
	<ul class="days">
		{#each days as day (day)}
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
		border: 2px solid #d6d6d6;
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
			color: #444;
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
