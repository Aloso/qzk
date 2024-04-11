<script lang="ts">
	import { deleteDraft, updateDraft } from '$lib/events/draftApi'
	import { deleteEvent, publishDraft, updateEvent } from '$lib/events/eventApi'
	import type { Event, WithSubmitter } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import PlanningFormProfesh from '../planning-form/PlanningFormProfesh.svelte'
	import EventDateTime from './EventDateTime.svelte'

	interface Props {
		event?: Event
		title: string
		editable?: boolean
		published?: boolean
		onClose: () => void
		onEdited?: (newEvent: Event & WithSubmitter) => void
		onPublished?: () => void
		onDeletedOrUnpublished?: () => void
	}

	const credentials = createAdminCredentials()

	let {
		event,
		title,
		editable,
		published,
		onClose,
		onEdited,
		onPublished,
		onDeletedOrUnpublished,
	}: Props = $props()
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

	async function onSubmit(newEvent: Event & WithSubmitter) {
		if (credentials.auth && event?.key) {
			const key = event.key
			try {
				editingStatus = { type: 'submitting' }
				if (published) {
					newEvent = await updateEvent(credentials.auth, newEvent, key)
				} else {
					const updated = await updateDraft(newEvent, key)
					if (!updated) {
						editingStatus = { type: 'error', message: 'Fehler beim Bearbeiten!' }
						return
					}
					newEvent = updated
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
		onclick={e => {
			if (e.target === overlay) onClose()
		}}
		onkeydown={e => {
			if (e.key === 'Escape') onClose()
		}}
	>
		<div class="popup">
			{#if editingStatus}
				<PlanningFormProfesh
					defaults={defaults.values}
					{onSubmit}
					onCancel={() => (editingStatus = undefined)}
					status={editingStatus}
				/>
			{:else}
				<h2>{title}</h2>
				<div class="event-times">
					{#each event.allTimes ?? event.time as time}
						<span class="event-time">
							<EventDateTime {time} />
						</span>
					{/each}
				</div>
				<p class="event-description">{@html event.descHtml}</p>

				<div class="event-place">
					<p class="event-place-name">
						<b>Ort:</b>
						{event.place.name}
						{#if event.place.room}
							<br />
							<b>Raum:</b>
							{event.place.room}
						{/if}
					</p>
					{#if event.place.type === 'PHYSICAL'}
						{#if event.place.room}
							<p>
								<a class="button-link" href="/wegbeschreibung" target="_blank">Wegbeschreibung</a>
								<a
									class="button-link maps-link"
									href="https://maps.app.goo.gl/qv1zaX3k1F3RpL9g6"
									target="_blank"
									rel="noreferrer noopener"
								>
									Google Maps
								</a>
							</p>
						{/if}
						<p class="event-place-address">{event.place.address}</p>
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
					<p>
						<b>Kontakt:</b>
						{event.organizer.name}
						{#if event.organizer.email}
							<br /><a href="mailto:{event.organizer.email}">{event.organizer.email}</a>
						{/if}
					</p>

					{#if event.organizer.phone || event.organizer.website}
						<p>
							{#if event.organizer.phone}
								<a href="tel:{event.organizer.phone}">{event.organizer.phone}</a>
							{/if}
							{#if event.organizer.phone && event.organizer.website}
								<br />
							{/if}
							{#if event.organizer.website}
								<a href={event.organizer.website} target="_blank" rel="noreferrer noopener">
									Website
								</a>
							{/if}
						</p>
					{/if}
				{/if}
				{#if event.pictureUrl}
					<img src={event.pictureUrl} alt={event.title} />
				{/if}
				<div class="event-tags">
					{event.tags.join('\n')}
				</div>
				{#if editable && (event as WithSubmitter).orgaNotes}
					<p>
						<b>Notizen:</b>
					</p>
					<p style="white-space: pre-wrap">
						{(event as WithSubmitter).orgaNotes}
					</p>
				{/if}

				<div class="controls">
					{#if editable}
						<button class="delete-button" onclick={onDelete}>Löschen</button>
						<button
							class="edit-button"
							onclick={() => {
								if (event && event.submitter) {
									defaults.setToDraft(event as Event & WithSubmitter)
									editingStatus = { type: 'ready' }
								}
							}}
						>
							Bearbeiten
						</button>
						{#if !published}
							<button class="publish-button" onclick={onPublish}>Veröffentlichen</button>
						{/if}
					{/if}

					<button class="close-button" onclick={() => onClose()}>Schließen</button>
				</div>
				{#if popupError}
					<p class="popup-error">{popupError}</p>
				{/if}
			{/if}
		</div>
	</div>
{/if}

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	.overlay {
		box-sizing: border-box;
		display: flex;
		position: fixed;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		background-color: #0003;
		animation: 0.3s fade-in;
		z-index: 1000;
		overflow: auto;
		padding: 4rem 1.2rem;
	}

	.popup {
		margin: auto;
		display: block;
		box-sizing: border-box;
		background-color: white;
		border-radius: 30px;
		padding: min(3rem, 1.5rem + 1.3vw);
		width: calc(700px + 2vw);
		max-width: 95vw;

		h2 {
			margin-top: 0;
		}
	}

	.event-place-address,
	.event-tags {
		white-space: pre-wrap;
	}

	.event-times {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.event-time {
		display: inline-block;
		background-color: #ffc7ec;
		padding: 8px 12px;
		font-size: 1.1rem;
		border-radius: 20px;
		overflow: hidden;

		:global(i) {
			font-style: normal;
			background-color: #fface3;
			padding: 8px 12px;
			margin: -8px -12px;
			white-space: nowrap;

			&:not(.lone) {
				border-right: 1px solid #0003;
				margin-right: 12px;
			}
		}

		:global(em) {
			font-style: normal;
			font-weight: 600;
		}
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

	.button-link {
		display: inline-block;
		margin: 0;
		font: inherit;
		font-size: 1rem;
		padding: 7px 12px;
		border-radius: 10px;
		transition: 0.2s;
		text-decoration: none;
		background-color: #ffc7ec;
		color: inherit;

		&:hover {
			background-color: #ffb4e6;
		}
	}

	.maps-link {
		background-color: #0f850f;
		color: white;

		&:hover {
			background-color: #0b750b;
		}
	}
</style>
