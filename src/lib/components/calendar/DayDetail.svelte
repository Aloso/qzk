<script lang="ts">
	import { getInBetween, isBetween } from '$lib/events/intersections'
	import type { Event, Time } from '$lib/events/types'

	interface Props {
		day: Date
		allEvents: Event[]
		onClose: () => void
	}

	let { day, allEvents, onClose }: Props = $props()

	let { dayStart, dayEnd } = $derived.by(() => {
		const year = day.getFullYear()
		const month = day.getMonth()
		const date = day.getDate()
		const dayStart = +new Date(year, month, date)
		const dayEnd = +new Date(year, month, date + 1)
		return { dayStart, dayEnd }
	})

	let dayEvents = $derived(
		allEvents
			.map(event => {
				const time = getInBetween(event.allTimes ?? event.times, dayStart, dayEnd)
				return { ...event, time }
			})
			.filter(e => e.time.length > 0),
	)

	function formatPlace(place: Event['place']) {
		switch (place.type) {
			case 'PHYSICAL':
				if (place.name === 'Queeres Zentrum Kassel') return place.room
				else return place.name
			case 'ONLINE':
				return 'Online'
		}
	}

	function formatTimes(time: Time) {
		switch (time.variant) {
			case 'day':
			case 'day-range':
				return undefined
			case 'time':
				return formatDate(time.start)
			case 'time-range':
				return `${formatDate(time.start)} – ${formatDate(time.end)}`
		}
	}

	function formatDate(d: Date) {
		return d.toLocaleTimeString('de-DE', {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
		})
	}
</script>

<div class="day-detail">
	<div class="top">
		<button type="button" class="back-button" onclick={onClose} aria-label="Zurück"></button>
		{day.toLocaleDateString('de-DE', {
			day: 'numeric',
			month: 'long',
			weekday: 'long',
		})}
	</div>
	<ul class="event-list">
		{#each dayEvents as event}
			<li style="--badge-bg: oklch(0.65 0.15 {event.decoration?.colors[1] ?? '#db71dd'})">
				<a href="/veranstaltungen/{event.key}" class="title">{event.titleDe}</a><br />
				{[formatPlace(event.place), formatTimes(event.time[0])]
					.filter(s => s !== undefined)
					.join(' · ')}
			</li>
		{:else}
			<div class="empty">Keine Veranstaltungen an diesem Tag</div>
		{/each}
	</ul>
	<div class="bottom">
		<a class="plan-button" href="/planen?date={encodeURIComponent(day.toISOString())}">
			Veranstaltung hinzufügen
		</a>
	</div>
</div>

<style lang="scss">
	.day-detail {
		box-sizing: border-box;
		border: 2px solid #d6d6d6;
		border-radius: 25px;
		overflow: hidden;
		height: 25rem;
		display: flex;
		flex-direction: column;
		margin: 0 0 2rem 0;
		animation: 0.5s fade-in;
	}

	.top {
		display: flex;
		gap: 0.5rem;
		height: 2.4rem;
		font-size: 1.1rem;
		line-height: 2.4rem;

		.back-button {
			border: none;
			width: 2.4rem;
			height: 2.4rem;
			padding: 0;
			margin: 0;
			background-color: transparent;
			border-radius: 100%;
			font: inherit;
			color: #555;

			&:hover,
			&:focus {
				background-color: #eee;
			}

			&::after {
				content: '';
				width: 0.5rem;
				height: 0.5rem;
				display: inline-block;
				border: 2px solid #9700a8;
				border-width: 0 0 0.15rem 0.15rem;
				transform: rotate(45deg);
				margin-right: -0.3rem;
			}
		}
	}

	.event-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		list-style: none;
		margin: 0;
		padding: 1rem;
		font-size: 1rem;
		overflow: auto;
		flex-grow: 1;

		li {
			position: relative;
			padding-left: 15px;

			&::before {
				content: '';
				position: absolute;
				left: 0;
				top: 7px;
				width: 5px;
				bottom: 7px;
				border-radius: 5px;
				background-color: var(--badge-bg);
			}
		}

		.title {
			font-size: 1.1rem;
			font-weight: 600;
			color: #333;
			text-decoration-color: transparent;

			&:hover,
			&:focus {
				color: var(--color-link);
				text-decoration-color: var(--color-accent);
			}
		}
	}

	.empty {
		color: #777;
	}

	.bottom {
		padding: 1rem;

		.plan-button {
			display: inline-block;
			background-color: var(--color-theme);
			color: white;
			border: none;
			margin: 0;
			padding: 10px 15px;
			border-radius: 10px;
			font: inherit;
			font-size: 1rem;
			transition: background-color 0.2s;
			text-decoration: none;

			&:hover,
			&:focus {
				background-color: var(--color-link);
			}
		}
	}
</style>
