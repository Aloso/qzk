<script lang="ts">
	import { isBetween, isBetweenAndOverlaps } from '$lib/events/intersections'
	import type { Event, Time } from '$lib/events/types'

	interface Props {
		day: number
		month: number
		year: number
		isCurrentMonth?: boolean
		isHighlighted?: boolean
		allEvents: Event[]
		draftTimes?: Time[]
		colorCoded?: boolean
		onClick?: (date: Date) => void
	}

	let {
		day,
		month,
		year,
		isCurrentMonth,
		isHighlighted,
		allEvents,
		draftTimes,
		colorCoded,
		onClick,
	}: Props = $props()

	let now = new Date()
	let isToday = $derived(
		now.getDate() === day && now.getMonth() === month && now.getFullYear() === year,
	)

	let dayStart = $derived(new Date(year, month, day))
	let dayEnd = $derived(new Date(year, month, day + 1))

	let dayEvents = $derived(
		allEvents.filter(event => isBetween(event.allTimes ?? event.time, dayStart, dayEnd)),
	)

	let [hasDraftEvent, notFirst, notLast] = $derived.by(() => {
		if (!draftTimes || !isBetween(draftTimes, dayStart, dayEnd)) return [false, false, false]
		return isBetweenAndOverlaps(draftTimes, dayStart, dayEnd)
	})
</script>

<li class="calendar-day" class:isCurrentMonth class:isHighlighted class:isToday>
	<button
		type="button"
		class="day-button"
		onclick={() => onClick?.(dayStart)}
		title={dayEvents.map(e => e.title).join('\n')}
	>
		<div class="day-label" class:hasDraftEvent class:notFirst class:notLast>{day}</div>
		<div class="badges">
			{#each dayEvents.slice(0, 3) as event}
				<div
					class="events-badge"
					style={colorCoded && event.decoration
						? `--badge-bg: oklch(0.65 0.15 ${event.decoration.colors[1]})`
						: undefined}
				></div>
			{/each}
		</div>
	</button>
</li>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	.calendar-day {
		display: block;
		position: relative;
		min-height: 3rem;
		border-radius: 10px;
		background-color: transparent;
		transition:
			background-color 0.1s,
			border-color 0.1s,
			box-shadow 0.1s;

		&:nth-child(7n) {
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}
		&:nth-child(7n + 1) {
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
		}
		&:nth-child(n + 36) {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}

		&:hover {
			background-color: #e3e3e3;
		}

		&.isToday {
			background-color: #fad2e3;

			&:hover {
				background-color: #ffc3dc;
			}
		}

		&.isHighlighted {
			background-color: #f9c2d9;
		}
	}

	.day-button {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		font-family: inherit;
		font-weight: normal;
		padding: 0.7rem 5px 0;
		border: none;
		background-color: transparent;
	}

	.day-label {
		color: #0005;
		font-size: 1.14rem;
		padding: 0.05rem 0;
		border: 2px solid transparent;

		.isCurrentMonth & {
			color: black;
		}

		&.hasDraftEvent {
			background-color: #00da8e;
			border-color: #00c17d;
			color: white;
			border-radius: 15px;

			&.notFirst {
				margin-left: -6px;
				padding-left: 6px;
				border-top-left-radius: 0;
				border-bottom-left-radius: 0;
				border-left-width: 0;
			}

			&.notLast {
				margin-right: -6px;
				padding-right: 6px;
				border-top-right-radius: 0;
				border-bottom-right-radius: 0;
				border-right-width: 0;
			}
		}
	}

	.badges {
		display: flex;
		padding: 3px 5px 0;
		justify-content: center;
		gap: 4px;
	}

	.events-badge {
		display: inline-block;
		background-color: var(--badge-bg, vars.$COLOR_T3);
		border-radius: 0.5rem;
		height: 0.5rem;
		width: 0.5rem;
	}
</style>
