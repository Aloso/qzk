<script lang="ts">
	import EventCountDown from '$lib/components/events/EventCountDown.svelte'
	import { deleteDraft } from '$lib/events/draftApi'
	import { deleteEvent, publishDraft } from '$lib/events/eventApi'
	import { getEndOfTime } from '$lib/events/intersections'
	import type { Time } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'
	import type { Data } from './+page.server'
	import { createSubmittedDrafts } from '$lib/hooks/createSubmittedDrafts.svelte'

	interface Props {
		data: Data
	}

	type Status =
		| { type: 'ready' }
		| { type: 'submitting' }
		| { type: 'deleting' }
		| { type: 'deleted' }
		| { type: 'error'; message: string }

	let { data }: Props = $props()

	const event = data.event
	const now = Date.now()
	const todayUtc = new Date()
	todayUtc.setUTCHours(0, 0, 0, 0)

	const pastTimes = $derived(event.time.filter(t => getEndOfTime(t) <= now))
	const futureTimes = $derived(event.time.filter(t => getEndOfTime(t) > now))
	let isPublished = $state(data.isPublished)
	let showAll = $state(false)
	let status = $state<Status>({ type: 'ready' })

	const credentials = createAdminCredentials()
	const submittedDrafts = createSubmittedDrafts()

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

	function formatRelativeDate(date: Date) {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const dateCopy = new Date(date)
		dateCopy.setHours(0, 0, 0, 0)
		// rounding should help with issues due to DST
		const diff = Math.round((dateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
		return diff === 0 ? '<b>Heute</b>' : diff === 1 ? '<b>Morgen</b>' : `in <b>${diff}</b> Tagen`
	}

	function scrollToAppointments(e: MouseEvent) {
		e.preventDefault()
		document.getElementById('termine')?.scrollIntoView({ behavior: 'smooth' })
	}

	function scrollToPlace(e: MouseEvent) {
		e.preventDefault()
		document.getElementById('ort')?.scrollIntoView({ behavior: 'smooth' })
	}

	async function publish() {
		if (credentials.auth && event?.key) {
			status = { type: 'submitting' }
			try {
				await publishDraft(event.key, credentials.auth)
				isPublished = true
				status = { type: 'ready' }
			} catch (e) {
				status = { type: 'error', message: e instanceof Error ? e.message : 'Fehler' }
			}
		}
	}

	async function remove() {
		if (!confirm(`${isPublished ? 'Veranstaltung' : 'Entwurf'} endgültig löschen?`)) {
			return
		}

		if (event?.key && (credentials.auth || !isPublished)) {
			try {
				if (isPublished && credentials.auth) {
					await deleteEvent(credentials.auth, event.key)
					status = { type: 'deleted' }

					submittedDrafts.remove(event.key)
				} else {
					const success = await deleteDraft(event.key)
					if (success) {
						status = { type: 'deleted' }
					} else {
						status = { type: 'error', message: 'Fehler beim Löschen!' }
					}
				}
			} catch (e) {
				status = { type: 'error', message: e instanceof Error ? e.message : 'Fehler' }
			}
		}
	}
</script>

<svelte:head>
	<title>{event.title} - Queeres Zentrum Kassel</title>
</svelte:head>

{#if credentials.auth || !isPublished}
	<div
		class="admin-bar"
		class:published={status.type === 'submitting' || (isPublished && status.type === 'ready')}
		class:deleted={status.type === 'deleted' || status.type === 'deleting'}
		class:error={status.type === 'error'}
	>
		{#if status.type === 'error'}
			<p>{status.message}</p>
		{:else if status.type === 'deleting'}
			<p>Wird gelöscht...</p>
		{:else if status.type === 'deleted'}
			<p>Gelöscht</p>
		{:else if status.type === 'submitting'}
			<p>Wird veröffentlicht...</p>
		{:else if isPublished}
			<p>Veröffentlichte Veranstaltung</p>
		{:else if credentials.initialized && !credentials.auth}
			<p>
				Die Veranstaltung wurde eingereicht. Wir informieren dich, wenn wir die Veranstaltung
				akzeptieren und auf der Website veröffentlichen. Bis dahin kannst du sie noch bearbeiten.
			</p>
			<p>
				Wenn du Fragen oder Wünsche hast, schreibe uns bitte über das
				<a href="/kontakt">Kontaktformular</a>.
			</p>
		{:else}
			Entwurf
		{/if}

		{#if status.type === 'ready' && event}
			<div class="admin-controls">
				{#if credentials.auth || !isPublished}
					<a
						class="admin-button edit"
						href="/veranstaltungen/bearbeiten?{new URLSearchParams({
							key: event.key!,
							isPublished: String(isPublished),
						})}"
					>
						Bearbeiten
					</a>
				{/if}
				{#if credentials.auth || !isPublished}
					<button class="admin-button delete" onclick={remove}>Löschen</button>
				{/if}
				{#if credentials.auth && !isPublished}
					<button class="admin-button publish" onclick={publish}>Veröffentlichen</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<div class="layout">
	<div class="main">
		<h1>{event.title}</h1>

		<div class="quick-links">
			<a href="#termine" onclick={scrollToAppointments}>
				Termine
				<svg class="arrow-down" viewBox="0 0 24 24">
					<path d="M4,14L12,22L20,14M12,22L12,2z" />
				</svg>
			</a>
			<a href="#ort" onclick={scrollToPlace}>
				Ort
				<svg class="arrow-down" viewBox="0 0 24 24">
					<path d="M4,14L12,22L20,14M12,22L12,2z" />
				</svg>
			</a>
		</div>

		<div class="event-description">{@html event.descHtml}</div>
	</div>

	<div class="sidebar">
		<div class="sidebar-title" id="termine">Termin{event.time.length > 1 ? 'e' : ''}</div>
		<div
			class="appointments"
			style={event.decoration
				? `--gradient1: oklch(0.97 0.06 ${event.decoration.colors[0]}deg); --gradient2: oklch(0.97 0.06 ${event.decoration.colors[1]}deg);`
				: undefined}
		>
			{#if showAll || futureTimes.length === 0}
				{#each showAll ? pastTimes : pastTimes.slice(-5) as time}
					<div class="row in-past">
						{@html formatAppointment(time)}
					</div>
				{/each}
			{/if}
			{#each showAll ? futureTimes : futureTimes.slice(0, 5) as time}
				<div class="row">
					{@html formatAppointment(time)}
				</div>
			{/each}
			{#if !showAll && (event.time.length > 5 || (futureTimes.length && pastTimes.length))}
				<button class="show-all-times" onclick={() => (showAll = true)}>Alle anzeigen</button>
			{/if}
		</div>
		{#if futureTimes.length > 0}
			{#if futureTimes[0].variant === 'day-range'}
				{#if futureTimes[0].start >= todayUtc}
					<p>Beginnt {@html formatRelativeDate(futureTimes[0].start)}</p>
				{:else}
					<p>Endet {@html formatRelativeDate(futureTimes[0].end)}</p>
				{/if}
			{:else if futureTimes[0].variant === 'day'}
				<p>Findet {@html formatRelativeDate(futureTimes[0].start)} statt</p>
			{:else}
				<EventCountDown
					showLabel={futureTimes.length > 1 || (showAll && event.time.length > 1)}
					time={futureTimes[0].start}
				/>
			{/if}
		{/if}

		<div class="sidebar-title" id="ort">Ort</div>

		{#if event.place.type === 'PHYSICAL'}
			{#if event.place.room}
				<p><b>{event.place.room}</b></p>
				<p class="address">
					{event.place.name}<br />
					{event.place.address}
				</p>
				<p>
					<a class="button-link" href="/wegbeschreibung">Wegbeschreibung</a>
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
		min-height: 80vh;

		@media (max-width: 78rem) {
			flex-direction: column;
		}
	}

	.main {
		flex-grow: 1;
		max-width: 44rem;

		:global(h1) {
			margin-bottom: 0.65rem;
		}
	}

	.event-description :global(:first-child) {
		margin-top: 0;
	}

	.quick-links {
		display: none;

		@media (max-width: 60rem) {
			display: flex;
			margin: 1rem 0 1.5rem 0;
			gap: 0.5rem;
		}

		a {
			text-decoration: none;
			color: inherit;
			display: inline-block;
			padding: 0.5rem 0.6rem;
			background: #eee;
			border-radius: 10px;
			font-size: 1.1rem;
			font-weight: 500;
		}

		.arrow-down {
			vertical-align: -1px;
			stroke: currentColor;
			fill: none;
			width: 0.88rem;
			height: 0.88rem;
			stroke-linejoin: round;
			stroke-linecap: round;
			stroke-width: 2.5;
		}
	}

	.sidebar {
		flex-shrink: 1;
		width: 21rem;
		min-width: 21rem;
		max-width: 100%;
		margin: 2rem 0 0 0;

		@media (max-width: 60rem) {
			width: 44rem;
			min-width: unset;
			margin-top: 0;
		}
	}

	.admin-bar {
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		max-width: 44rem;
		border-radius: 25px;
		background-color: #fff9c8;
		border: 2px solid #f0e587;
		padding: 1rem;
		min-height: calc(4rem + 4px);
		box-sizing: border-box;

		&.published {
			background-color: #deffd5;
			border-color: #c4eec0;
		}

		&.deleted {
			background-color: #ebebeb;
			border-color: #d6d6d6;
		}

		&.error {
			background-color: #ffd5d5;
			border-color: #eec0c0;
			color: #6d0000;
		}

		p {
			font-size: 1.1rem;
			margin: 0;
		}

		.admin-controls {
			display: flex;
			gap: 1rem;
			flex-wrap: wrap;
		}
	}

	.admin-button {
		--bg: var(--color-theme);
		--bg-hover: var(--color-link);

		display: inline-block;
		border: none;
		background-color: var(--bg);
		color: white;
		padding: 0.4rem 0.7rem;
		border-radius: 10px;
		font-family: inherit;
		font-size: 1rem;
		line-height: 1.2rem;
		text-decoration: none;
		cursor: pointer;

		&:hover {
			background-color: var(--bg-hover);
		}

		&.edit {
			--bg: #007b87;
			--bg-hover: #0093a1;
		}

		&.publish {
			--bg: #007921;
			--bg-hover: #009026;
		}

		&.delete {
			--bg: #900000;
			--bg-hover: #aa0000;
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

	#termine {
		margin-top: 1.5rem;
	}

	.appointments {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		box-sizing: border-box;
		width: 100%;
		background-color: #eee;
		background-image: linear-gradient(
			to right in oklab,
			var(--gradient1, transparent),
			var(--gradient2, transparent)
		);
		box-shadow: inset 0 0 0 2px #0001;
		padding: 0.7rem 1rem;
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

		.show-all-times {
			border: none;
			color: black;
			background-color: #0000000c;
			display: inline-block;
			padding: 0.3rem 0.6rem;
			margin-top: 0.5rem;
			border-radius: 10px;
			font-family: inherit;
			font-size: 0.9rem;
			align-self: center;

			&:hover,
			&:focus {
				background-color: #0000001a;
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
