<script lang="ts">
	import type { EventNoSubmitter } from '$lib/events/eventApi'

	interface Props {
		day: number
		month: number
		year: number
		isCurrentMonth?: boolean
		allEvents: EventNoSubmitter[]
		draftTime?: EventNoSubmitter['time']
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

<button type="button" class="calendar-day" class:isCurrentMonth class:isToday>
	<div class="day-label">{day}</div>
	{#if dayEvents.length > 0}
		<div class="events-badge">{dayEvents.length}</div>
	{/if}
	{#if hasDraftEvent}
		<div class="draft-badge" />
	{/if}
</button>

<style lang="scss">
	.calendar-day {
		display: inline-flex;
		flex-wrap: wrap;
		align-content: flex-start;
		box-sizing: border-box;
		height: 70px;
		width: calc(100% / 7);
		vertical-align: top;
		text-align: left;
		font-family: inherit;
		padding: 0;
		border: 2px solid #d6d6d6;
		border-width: 0 2px 2px 0;
		background-color: #eee;
		transition:
			background-color 0.1s,
			border-color 0.1s,
			box-shadow 0.1s;

		.day-label {
			color: #0006;
			font-size: 1.25rem;
			padding: 0.3rem 0.5rem;
			flex: 1 0 100%;
		}

		&:hover {
			background-color: #e3e3e3;
			border-color: #b6b6b6;
			box-shadow: -1px -1px 0 1px #b6b6b6;
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
				border-color: #dc4f9f;
				box-shadow: -1px -1px 0 1px #dc4f9f;
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
			margin: 0 -6px 0 10px;
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
