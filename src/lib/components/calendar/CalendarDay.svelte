<script lang="ts">
	import { isBetween } from '$lib/events/intersections'
	import type { Event, Time } from '$lib/events/types'

	interface Props {
		day: number
		month: number
		year: number
		isCurrentMonth?: boolean
		allEvents: Event[]
		draftTimes?: Time[]
	}

	let { day, month, year, isCurrentMonth, allEvents, draftTimes }: Props = $props()

	let now = new Date()
	let isToday = $derived(
		now.getDate() === day && now.getMonth() === month && now.getFullYear() === year,
	)

	let dayStart = $derived(new Date(year, month, day))
	let dayEnd = $derived(new Date(year, month, day + 1))

	let dayEvents = $derived(allEvents.filter(event => isBetween(event.time, dayStart, dayEnd)))

	let hasDraftEvent = $derived.by(() => {
		if (!draftTimes) return false
		return isBetween(draftTimes, dayStart, dayEnd)
	})
</script>

<button type="button" class="calendar-day" class:isCurrentMonth class:isToday>
	<div class="day-label">{day}</div>
	<div class="badges">
		{#if dayEvents.length > 0}
			<div class="events-badge">{dayEvents.length}</div>
		{/if}
		{#if hasDraftEvent}
			<div class="draft-badge"></div>
		{/if}
	</div>
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

		.day-label {
			box-sizing: border-box;
			color: #0006;
			font-size: 1.25rem;
			padding: 0.3rem 0.5rem;
			flex: 1 0 100%;
		}

		.badges {
			display: flex;
			padding: 0 8px;

			@media (max-width: 600px) {
				padding: 0 6px;
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
			font-size: 0.95rem;
			font-weight: 600;
			height: 1.25rem;
			min-width: 1.25rem;
			box-sizing: border-box;
			vertical-align: top;
			z-index: 1;

			@media (max-width: 600px) {
				font-size: 0.85rem;
				padding: 1px 3px;
				height: 1.15rem;
				min-width: 1.15rem;
			}
		}

		.draft-badge {
			background-color: #00da8e;
			box-shadow: inset 0 0 0 2px #0002;
		}

		.events-badge + .draft-badge {
			margin-left: 4px;

			@media (max-width: 600px) {
				margin-left: -6px;
				z-index: 0;
			}
		}
	}
</style>
