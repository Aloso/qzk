<script lang="ts">
	import type { Event, Time } from '$lib/events/types'
	import CalendarDay from './CalendarDay.svelte'
	import MonthNav from './MonthNav.svelte'

	interface Props {
		events: Event[]
		showDate: Date
		draftTimes?: Time[]
		onClickDay?: (date: Date) => void
	}

	let { events, showDate, draftTimes, onClickDay }: Props = $props()

	let draftEventYear = $derived(showDate.getFullYear())
	let draftEventMonth = $derived(showDate.getMonth())

	let year = $state(0)
	let month = $state(0)

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
	<div class="days">
		{#each days as day}
			<CalendarDay {...day} allEvents={events} {draftTimes} onClick={onClickDay} />
		{/each}
	</div>
</div>

<style lang="scss">
	.calendar {
		border: 2px solid #d6d6d6;
		border-radius: 22px;
		overflow: hidden;
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
</style>
