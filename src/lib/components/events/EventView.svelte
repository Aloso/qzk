<script lang="ts">
	import type { Event } from '$lib/events/types'
	import EventDateTime from './EventDateTime.svelte'
	import EventPopup from './EventPopup.svelte'

	interface Props {
		event: Event
		editable?: boolean
	}

	let { event, editable } = $props<Props>()
	let overlayShown = $state(false)
</script>

<button class="event" on:click={() => (overlayShown = true)}>
	<div class="event-title">{event.title}</div>
	<div class="event-time">
		<EventDateTime time={event.time} concise />
	</div>
	<div class="event-description">{event.description}</div>
	{#if event.time.repeats}
		<div class="event-repeats">
			Wiederholung: {event.time.repeats.cycle} - {event.time.repeats.days}
		</div>
	{/if}
</button>

<EventPopup
	event={overlayShown ? event : undefined}
	onClose={() => (overlayShown = false)}
	{editable}
/>

<style lang="scss">
	.event {
		display: block;
		border: none;
		margin: 1rem 0;
		padding: 0;
		background-color: transparent;
		text-align: left;
		color: inherit;
		font: inherit;
		cursor: pointer;
		animation: 1s fade-in;

		&:hover {
			.event-title {
				color: var(--color-theme);
				text-decoration: underline 2px;
				text-decoration-color: var(--color-accent);
			}
		}
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	.event-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1.5rem;
		margin: 0;
	}

	.event-time {
		display: inline-block;
		background-color: #ffc7ec;
		padding: 5px 10px;
		margin: 5px 0;
		border-radius: 20px;
	}
</style>
