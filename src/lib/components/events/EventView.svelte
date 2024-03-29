<script lang="ts">
	import type { EventNoSubmitter } from '$lib/events/eventApi'
	import type { Event } from '$lib/events/types'
	import EventDateTime from './EventDateTime.svelte'
	import EventPopup from './EventPopup.svelte'

	interface Props {
		event: EventNoSubmitter
		showDescription?: boolean
		showPlace?: boolean
		editable?: boolean
		published?: boolean
		onEdited?: (newEvent: Event) => void
		onPublished?: () => void
		onDeletedOrUnpublished?: () => void
	}

	let {
		event,
		showDescription = true,
		showPlace = false,
		editable,
		published,
		onEdited,
		onPublished,
		onDeletedOrUnpublished,
	}: Props = $props()
	let overlayShown = $state(false)

	let descElem = $state<HTMLElement>()
	let overflown = $state(false)
	$effect(() => {
		if (descElem) {
			overflown = descElem.clientHeight < descElem.scrollHeight
		}
	})
</script>

<button class="event" onclick={() => (overlayShown = true)}>
	<div class="event-title">{event.title}</div>
	<div class="event-time">
		<EventDateTime time={event.time} concise />
	</div>
	{#if showDescription}
		<div class="event-description" class:overflown bind:this={descElem}>{@html event.descHtml}</div>
	{/if}
	{#if showPlace}
		<div class="event-place">
			{event.place.name}{event.place.room ? `, ${event.place.room}` : ''}
		</div>
	{/if}
	{#if event.time.repeats}
		<div class="event-repeats">
			Wiederholung: {event.time.repeats.cycle} - {event.time.repeats.days}
		</div>
	{/if}
</button>

<EventPopup
	event={overlayShown ? event : undefined}
	{editable}
	{published}
	onClose={() => (overlayShown = false)}
	{onEdited}
	{onPublished}
	{onDeletedOrUnpublished}
/>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

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

	.event-title {
		font-family: vars.$FONT_HEADING;
		font-weight: 600;
		font-size: 1.5rem;
		margin: 0;

		@supports (font-variation-settings: normal) {
			font-family: vars.$FONT_HEADING_VARIABLE;
		}
	}

	.event-description {
		position: relative;
		max-height: 150px;
		overflow: hidden;

		&.overflown::after {
			content: '';
			display: block;
			position: absolute;
			width: 100%;
			height: 50px;
			bottom: 0;
			background: linear-gradient(transparent, white);
		}

		:global(p),
		:global(ul),
		:global(ol),
		:global(li),
		:global(blockquote) {
			font-size: inherit;
		}

		:global(p) {
			margin: 0.5rem 0;
		}
	}

	.event-time {
		display: inline-block;
		background-color: #ffc7ec;
		padding: 5px 10px;
		margin: 5px 0;
		border-radius: 20px;
	}
</style>
