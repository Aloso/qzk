<script lang="ts">
	import type { Event } from '$lib/events/types'

	interface Props {
		day: number
		month: number
		year: number
		isCurrentMonth?: boolean
		allEvents: Event[]
		draftTime?: Event['time']
	}

	let { day, month, year, isCurrentMonth, allEvents, draftTime }: Props = $props()

	let now = new Date()
	let isToday = $derived(
		now.getDate() === day && now.getMonth() === month && now.getFullYear() === year,
	)

	let dayStart = $derived(new Date(year, month, day))
	let dayEnd = $derived(new Date(year, month, day + 1))

	let dayEvents = $derived(
		allEvents.filter((event) => {
			const start = new Date(event.time.start)
			const end = event.time.end ? new Date(event.time.end) : start
			return !(start > dayEnd || end < dayStart)
		}),
	)
	let hasDraftEvent = $derived.by(() => {
		if (!draftTime) return false

		const start = new Date(draftTime.start)
		const end = draftTime.end ? new Date(draftTime.end) : start
		return !(start > dayEnd || end < dayStart)
	})
</script>

<div class="calendar-day" class:isCurrentMonth class:isToday>
	<div class="day-label">{day}</div>
	{#if dayEvents.length > 0}
		<div class="events-badge">{dayEvents.length}</div>
	{/if}
	{#if hasDraftEvent}
		<div class="draft-badge" />
	{/if}
</div>

<style lang="scss">
	.calendar-day {
		display: inline-block;
		box-sizing: border-box;
		height: 70px;
		width: calc(100% / 7);
		vertical-align: top;
		border: 2px solid #d6d6d6;
		border-width: 0 2px 2px 0;
		background-color: #eee;
		transition: background-color 0.1s;

		.day-label {
			color: #0006;
			font-size: 1.25rem;
			padding: 0.3rem 0.5rem;
		}

		&:hover {
			background-color: #e3e3e3;
		}

		&.isCurrentMonth {
			background-color: white;

			.day-label {
				color: #0009;
			}

			&:hover {
				background-color: #f5f5f5;
			}
		}

		&.isToday {
			background-color: #fad2e3;
			border-color: #e26caf;
			box-shadow: -1px -1px 0 1px #e26caf;

			&:hover {
				background-color: #ffc3dc;
			}
		}

		.events-badge,
		.draft-badge {
			display: inline-block;
			background-color: var(--color-theme);
			color: white;
			padding: 2px 4px;
			text-align: center;
			border-radius: 100px;
			margin: 0 -10px 0 10px;
			font-size: 0.95rem;
			font-weight: 600;
			height: 1.25rem;
			min-width: 1.25rem;
			box-sizing: border-box;
			vertical-align: top;
		}

		.draft-badge {
			background-color: #00da8e;
			box-shadow: inset 0 0 0 2px #0002;
		}
	}
</style>
