<script lang="ts">
	import { deleteDraft, updateDraft } from '$lib/events/draftApi'
	import { deleteEvent, publishDraft, updateEvent } from '$lib/events/eventApi'
	import type { Event } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import PlanningForm from '../../../routes/planen/PlanningForm.svelte'
	import EventDateTime from './EventDateTime.svelte'

	interface Props {
		event?: Event
		editable?: boolean
		published?: boolean
		onClose: () => void
		onEdited?: (newEvent: Event) => void
		onPublished?: () => void
		onDeletedOrUnpublished?: () => void
	}

	const credentials = createAdminCredentials()

	let { event, editable, published, onClose, onEdited, onPublished, onDeletedOrUnpublished } =
		$props<Props>()
	let overlay = $state<HTMLElement>()

	let editingStatus = $state<
		| { type: 'ready'; submitted?: boolean }
		| { type: 'submitting' }
		| { type: 'deleting' }
		| { type: 'error'; message: string; missing?: boolean }
	>()
	let popupError = $state<string>()
	const defaults = createEventPlanningDefaults()

	$effect(() => {
		if (event && overlay) {
			overlay.focus()
		}
	})

	async function onSubmit(newEvent: Event) {
		if (credentials.auth && event?.key) {
			try {
				editingStatus = { type: 'submitting' }
				if (published) {
					await updateEvent(credentials.auth, newEvent, event.key)
				} else {
					const success = await updateDraft(newEvent, event.key)
					if (!success) {
						editingStatus = { type: 'error', message: 'Fehler beim Bearbeiten!' }
						return
					}
				}
				editingStatus = undefined
				onEdited?.(newEvent)
			} catch (e) {
				if (e instanceof Error) {
					editingStatus = { type: 'error', message: e.message }
				}
			}
		}
	}

	async function onPublish() {
		if (credentials.auth && event?.key) {
			try {
				await publishDraft(event.key, credentials.auth)
				onPublished?.()
				onClose()
			} catch (e) {
				if (e instanceof Error) {
					popupError = e.message
				}
			}
		}
	}

	async function onDelete() {
		if (!published && !confirm('Bist du dir sicher?')) {
			return
		}

		if (credentials.auth && event?.key) {
			try {
				if (published) {
					await deleteEvent(credentials.auth, event.key)
				} else {
					const success = await deleteDraft(event.key)
					if (!success) {
						popupError = 'Fehler beim Bearbeiten!'
						return
					}
				}
				onDeletedOrUnpublished?.()
				onClose()
			} catch (e) {
				if (e instanceof Error) {
					popupError = e.message
				}
			}
		}
	}
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
		{#if editingStatus}
			<PlanningForm
				defaults={defaults.values}
				{onSubmit}
				onCancel={() => (editingStatus = undefined)}
				status={editingStatus}
				popup
			/>
		{:else}
			<div class="popup">
				<h2>{event.title}</h2>
				<div class="event-time">
					<EventDateTime time={event.time} />
				</div>
				<p class="event-description">{event.description}</p>

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
							<a href={event.organizer.website} target="_blank" rel="noreferrer noopener">Website</a
							>
						</p>
					{/if}
				{/if}
				{#if event.pictureUrl}
					<img src={event.pictureUrl} alt={event.title} />
				{/if}
				<div class="event-tags">
					{event.tags.join('\n')}
				</div>

				<div class="controls">
					{#if editable}
						<button class="delete-button" on:click={onDelete}>Löschen</button>
						<button
							class="edit-button"
							on:click={() => {
								if (event) {
									defaults.setToDraft(event)
									editingStatus = { type: 'ready' }
								}
							}}
						>
							Bearbeiten
						</button>
						{#if !published}
							<button class="publish-button" on:click={onPublish}>Veröffentlichen</button>
						{/if}
					{/if}

					<button class="close-button" on:click={() => onClose()}>Schließen</button>
				</div>
				{#if popupError}
					<p class="popup-error">{popupError}</p>
				{/if}
			</div>
		{/if}
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

	.event-description {
		white-space: pre-wrap;
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

	.controls {
		display: flex;
		justify-content: right;
		flex-wrap: wrap;
		gap: 1rem;
		margin: 1rem 0 0 auto;

		button,
		a {
			display: block;
			margin: 0;
			font: inherit;
			font-size: 1.2rem;
			padding: 15px 20px;
			border-radius: 15px;
			transition: 0.2s;
			text-decoration: none;
		}

		.close-button {
			border: none;
			color: white;
			background-color: var(--color-theme);

			&:hover,
			&:focus {
				background-color: var(--color-link);
			}
		}

		.edit-button,
		.delete-button,
		.publish-button {
			color: var(--color-theme);
			border: 2px solid var(--color-theme);
			padding: 11px 16px;
			background-color: white;

			&:hover,
			&:focus {
				color: var(--color-accent);
				border-color: var(--color-accent);
			}
		}

		.delete-button {
			color: #d10000;
			border-color: #d10000;
		}

		.publish-button {
			color: #009502;
			border-color: #009502;
		}
	}

	.popup-error {
		color: darkred;
	}
</style>
