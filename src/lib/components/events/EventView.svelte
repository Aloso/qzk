<script lang="ts">
	import type { Event, Time } from '$lib/events/types'
	import EventCountDown from './EventCountDown.svelte'

	interface Props {
		previousScrollPos: readonly [number, number]
		event: Event
		onClose: () => void
		published?: boolean
		onClickEdit?: () => void
		onPublished?: () => void
		onDeletedOrUnpublished?: () => void
	}

	let {
		previousScrollPos,
		event,
		onClose,
		published,
		onClickEdit,
		onPublished,
		onDeletedOrUnpublished,
	}: Props = $props()

	function formatAppointment(time: Time) {
		switch (time.variant) {
			case 'day':
				return `<span>${formatDate(time.start)}</span>`
			case 'time':
				return `<span>${formatDate(time.start)}</span><span>${formatTime(time.start)}</span>`
			case 'day-range':
				return `<span>${formatDate(time.start)} – ${formatDate(time.end)}</span>`
			case 'time-range':
				return `<span>${formatDate(time.start)}</span><span>${formatTime(time.start)} – ${formatTime(time.end)}</span>`
		}
	}

	function formatTime(date: Date) {
		return date.toLocaleTimeString('de-DE', {
			timeZone: 'Europe/Berlin',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	function formatDate(date: Date) {
		const withYear = date.getFullYear() !== new Date().getFullYear()

		return date
			.toLocaleDateString('de-DE', {
				timeZone: 'Europe/Berlin',
				weekday: withYear ? undefined : 'short',
				day: 'numeric',
				month: withYear ? 'numeric' : 'long',
				year: withYear ? 'numeric' : undefined,
			})
			.replace('.,', ',')
			.replace(/(\d).(?=\d)/g, '. ')
	}

	let layoutElem = $state<HTMLDivElement>()

	$effect(() => {
		if (layoutElem) {
			layoutElem.scrollIntoView()
			return () => {
				setTimeout(() => {
					const [left, top] = previousScrollPos
					window.scrollTo({ left, top })
				})
			}
		}
	})
</script>

<div class="layout" bind:this={layoutElem}>
	<div class="main">
		<button class="back mobile-only" onclick={onClose}>
			<span class="close-icon">×</span>
			Schließen
		</button>
		{#if onClickEdit || onPublished || onDeletedOrUnpublished}
			<div class="admin-bar">
				{#if onClickEdit}
					<button class="admin-button edit" onclick={onClickEdit}>Bearbeiten</button>
				{/if}
				{#if onPublished}
					<button class="admin-button publish" onclick={onPublished}>Veröffentlichen</button>
				{/if}
				{#if onDeletedOrUnpublished}
					<button class="admin-button delete" onclick={onDeletedOrUnpublished}>
						{published ? 'Als Entwurf markieren' : 'Löschen'}
					</button>
				{/if}
			</div>
		{/if}

		<h1>{event.title}</h1>

		<div class="event-description">{@html event.descHtml}</div>
	</div>

	<div class="sidebar">
		<button class="back mobile-hidden" onclick={onClose}>
			<span class="close-icon">×</span>
			Schließen
		</button>

		<div class="sidebar-title">Termine</div>
		<div class="appointments">
			{#each event.time as time}
				<div class="row">
					{@html formatAppointment(time)}
				</div>
			{/each}
		</div>
		{#if event.time[0].start.getTime() > Date.now() && !event.time[0].variant.startsWith('day')}
			<EventCountDown time={event.time[0].start} />
		{/if}

		<div class="sidebar-title">Ort</div>

		{#if event.place.type === 'PHYSICAL'}
			{#if event.place.room}
				<p><b>{event.place.room}</b></p>
				<p class="address">
					{event.place.name}<br />
					{event.place.address}
				</p>
				<p>
					<a class="button-link" href="/wegbeschreibung" target="_blank">Wegbeschreibung</a>
					<a
						class="button-link"
						href="https://maps.app.goo.gl/UcrvgAGBe8dn5b9F6"
						target="_blank"
						rel="noreferrer noopener"
					>
						Google Maps
					</a>
				</p>
			{:else}
				<p>{event.place.name}</p>
				<p class="address">{event.place.address}</p>
			{/if}
		{:else}
			<p>Online-Veranstaltung</p>

			{#if event.place.url}
				<p>{new URL(event.place.url).host.replace(/^www\./, '')}</p>

				<a href={event.place.url} target="_blank" rel="noopener noreferrer">
					Veranstaltung beitreten
				</a>
			{/if}
		{/if}

		{#if event.organizer}
			<div class="sidebar-title">Kontakt</div>

			{#if event.organizer.name}
				<p>{event.organizer.name}</p>
			{/if}
			{#if event.organizer.email}
				<p>E-Mail: <a href="mailto:{event.organizer.email}">{event.organizer.email}</a></p>
			{/if}
			{#if event.organizer.phone}
				<p>
					Telefon:
					<a href="tel:{event.organizer.phone.replace(/^0(?!0)/, '+49')}">
						{event.organizer.phone}
					</a>
				</p>
			{/if}
			{#if event.organizer.website}
				<p class="break">
					Website:
					<a href={event.organizer.website} target="_blank" rel="noreferrer noopener">
						{new URL(event.organizer.website).host}
					</a>
				</p>
			{/if}
		{/if}
	</div>
</div>

<style lang="scss">
	@use '../../../routes/vars.scss' as vars;

	.layout {
		display: flex;
		gap: 2rem 3rem;
		align-items: flex-start;
		min-height: 100vh;

		@media (max-width: 1000px) {
			flex-direction: column;
		}
	}

	.main {
		flex-grow: 1;
		max-width: 44rem;
	}

	.sidebar {
		flex-shrink: 1;
		width: 21rem;
		min-width: 21rem;
		max-width: 100%;
		margin-top: 3.2rem;

		@media (max-width: 1000px) {
			width: 44rem;
			min-width: unset;
			margin-top: 0;
		}
	}

	.back {
		display: block;
		width: 100%;
		margin-bottom: 1rem;
		border: none;
		background-color: var(--color-theme);
		color: white;
		padding: 0.6rem 1rem;
		border-radius: 15px;
		font-family: inherit;
		font-size: 1.1rem;
		cursor: pointer;

		&:hover {
			background-color: var(--color-link);
		}

		.close-icon {
			display: inline-block;
			font-size: 1.5em;
			margin: -15px 5px -5px 0;
		}

		@media (max-width: 1000px) {
			width: auto;
		}

		&.mobile-only {
			display: none;

			@media (max-width: 1000px) {
				display: block;
			}
		}

		&.mobile-hidden {
			@media (max-width: 1000px) {
				display: none;
			}
		}
	}

	.admin-bar {
		margin: 3rem 0 1rem;
		display: flex;
		gap: 0.5rem;
	}

	.admin-button {
		border: none;
		background-color: var(--color-theme);
		color: white;
		padding: 0.6rem 1rem;
		border-radius: 15px;
		font-family: inherit;
		font-size: 1.1rem;
		cursor: pointer;

		&:hover {
			background-color: var(--color-link);
		}

		&.edit {
			background-color: #008490;

			&:hover {
				background-color: #009caa;
			}
		}

		&.publish {
			background-color: #007921;

			&:hover {
				background-color: #009026;
			}
		}

		&.delete {
			background-color: #900000;

			&:hover {
				background-color: #aa0000;
			}
		}
	}

	.sidebar-title {
		font-size: 1.75rem;
		font-weight: 600;
		margin: 1rem 0;
		font-family: vars.$FONT_HEADING;

		@supports (font-variation-settings: normal) {
			font-family: vars.$FONT_HEADING_VARIABLE;
		}
	}

	.appointments {
		box-sizing: border-box;
		width: 100%;
		background-color: #eee;
		border: 2px solid #0001;
		padding: 0.7rem 1rem;
		border-radius: 15px;

		.row {
			display: flex;
			gap: 1rem;
			padding: 5px 0;
			justify-content: space-between;
		}
	}

	.address {
		white-space: pre-line;
	}

	.button-link {
		color: black;
		text-decoration: none;
		display: inline-block;
		padding: 0.4rem 0.7rem;
		margin-right: 0.5rem;
		background-color: #eee;
		border-radius: 10px;
		font-size: 1rem;

		&:hover,
		&:focus {
			background-color: vars.$COLOR_T0;
		}
	}

	.break {
		word-break: break-word;
	}
</style>
