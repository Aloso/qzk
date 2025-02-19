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

	let times = event.allTimes ?? event.time
	const now = new Date()

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

	let controlsElem = $state<HTMLDivElement>()

	$effect(() => {
		if (controlsElem) {
			controlsElem.scrollIntoView()
			return () => {
				setTimeout(() => {
					const [left, top] = previousScrollPos
					window.scrollTo({ left, top })
				})
			}
		}
	})
</script>

<div class="controls" bind:this={controlsElem}>
	<button class="back" onclick={onClose}>
		<span style="vertical-align: 12px;">×</span>
	</button>

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
</div>

<div class="layout">
	<div class="main">
		<h1>{event.title}</h1>

		<div class="event-description">{@html event.descHtml}</div>
	</div>

	<div class="sidebar">
		<div class="sidebar-title">Termin{times.length > 1 ? 'e' : ''}</div>
		<div class="appointments">
			{#each times as time}
				<div class="row" class:in-past={(time.end ?? time.start) < now}>
					{@html formatAppointment(time)}
				</div>
			{/each}
		</div>
		{#if event.time[0].start.getTime() > Date.now() && !event.time[0].variant.startsWith('day')}
			<EventCountDown showLabel={event.time.length > 1} time={event.time[0].start} />
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

	// TODO: Align main headline and sidebar headline

	.layout {
		display: flex;
		gap: 2rem 3rem;
		align-items: flex-start;
		min-height: 100vh;

		@media (max-width: 1000px) {
			flex-direction: column;
		}
	}

	.controls {
		display: flex;
		flex-direction: row-reverse;
		margin-bottom: 2rem;
		gap: 1rem;
		align-items: center;

		@media (max-width: 1000px) {
			flex-direction: column;
			align-items: start;
		}
	}

	.main {
		flex-grow: 1;
		max-width: 44rem;

		:global(h1) {
			margin-top: 0;
		}
	}

	.sidebar {
		flex-shrink: 1;
		width: 21rem;
		min-width: 21rem;
		max-width: 100%;

		@media (max-width: 1000px) {
			width: 44rem;
			min-width: unset;
			margin-top: 0;
		}
	}

	.back {
		align-self: end;
		box-sizing: border-box;
		display: inline-block;
		width: 3rem;
		height: 3rem;
		border: none;
		background-color: transparent;
		color: #777;
		padding: 0;
		border-radius: 3rem;
		font-family: inherit;
		font-size: 3em;
		line-height: 1rem;
		cursor: pointer;

		&:hover {
			background-color: #eee;
		}
	}

	.admin-bar {
		display: flex;
		gap: 0.5rem;
		flex-grow: 1;
		flex-wrap: wrap;
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
		padding: 0.67rem 1rem;
		border-radius: 15px;
		font-size: 1.05rem;

		.row {
			display: flex;
			gap: 1rem;
			padding: 7px 0;
			justify-content: space-between;

			&.in-past {
				opacity: 0.6;
			}
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
