<script lang="ts">
	import type { Event } from '$lib/events/types'
	import EventDateTime from './EventDateTime.svelte'

	interface Props {
		event?: Event
		editable?: boolean
		onClose: () => void
	}

	let { event, editable, onClose } = $props<Props>()
	let overlay = $state<HTMLElement>()

	$effect(() => {
		if (event && overlay) {
			overlay.focus()
		}
	})
</script>

{#if event}
	<div
		class="overlay"
		role="button"
		tabindex="0"
		bind:this={overlay}
		on:click={(e) => {
			if (e.target === overlay) onClose()
		}}
		on:keydown={(e) => {
			if (e.key === 'Escape') onClose()
		}}
	>
		<div class="popup">
			<h2>{event.title}</h2>
			<div class="event-time">
				<EventDateTime time={event.time} />
			</div>
			<p>{event.description}</p>

			<div class="event-place">
				<p class="event-place-name"><b>Ort:</b> {event.place.name}</p>
				{#if event.place.type === 'PHYSICAL'}
					<p class="event-place-address">{event.place.address}</p>
					{#if event.place.room}
						<p class="event-place-room"><b>Raum:</b> {event.place.room}</p>
					{/if}
				{:else if event.place.url}
					<p><a href={event.place.url}>Link zur Teilnahme</a></p>
				{/if}
			</div>
			{#if event.website}
				<p>
					<a class="event-website" href={event.website} target="_blank" rel="noreferrer noopener">
						Website
					</a>
				</p>
			{/if}
			{#if event.organizer}
				<p><b>Kontakt:</b></p>
				<p class="event-organizer">{event.organizer.name}</p>
				{#if event.organizer.email}
					<p><a href="mailto:{event.organizer.email}">{event.organizer.email}</a></p>
				{/if}
				{#if event.organizer.phone}
					<p><a href="tel:{event.organizer.phone}">{event.organizer.phone}</a></p>
				{/if}
				{#if event.organizer.website}
					<p>
						<a href={event.organizer.website} target="_blank" rel="noreferrer noopener">Website</a>
					</p>
				{/if}
			{/if}
			{#if event.pictureUrl}
				<img src={event.pictureUrl} alt={event.title} />
			{/if}
			<div class="event-tags">
				{event.tags.join('\n')}
			</div>

			{#if editable}
				<p><a href="/planen/eingereicht?key={encodeURIComponent(event.key!)}">Bearbeiten</a></p>
			{/if}

			<button class="close-button" on:click={() => onClose()}>Schließen</button>
		</div>
	</div>
{/if}

<style lang="scss">
	.overlay {
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #0003;
		animation: 0.3s fade-in;
		z-index: 1000;
		overflow: auto;
	}

	.popup {
		display: block;
		box-sizing: border-box;
		background-color: white;
		border-radius: 30px;
		padding: 50px;
		width: 700px;
		max-width: 95vw;

		h2 {
			margin-top: 0;
		}
	}

	.event-place-address,
	.event-tags {
		white-space: pre-wrap;
	}

	.event-time {
		display: inline-block;
		background-color: #ffc7ec;
		padding: 8px 12px;
		margin: 0;
		font-size: 1.1rem;
		border-radius: 30px;
	}

	.close-button {
		display: block;
		margin: 1rem 0 0 auto;
		background-color: var(--color-theme);
		border: none;
		color: white;
		font: inherit;
		font-size: 1.2rem;
		padding: 15px 20px;
		border-radius: 15px;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}
	}
</style>
