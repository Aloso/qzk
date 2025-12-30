<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	import EventCountDown from '$lib/components/events/EventCountDown.svelte'
	import Insert from '$lib/components/Insert.svelte'
	import { deleteEvent, setEventState } from '$lib/events/eventApi'
	import { getEndOfTime } from '$lib/events/intersections'
	import type { Event, Time } from '$lib/events/types'
	import { createSubmittedDrafts } from '$lib/hooks/createSubmittedDrafts.svelte'
	import { getLocale, localizeHref } from '$lib/paraglide/runtime'
	import { m } from '$lib/paraglide/messages'

	interface Props {
		data: Event
	}

	type Status =
		| { type: 'ready' }
		| { type: 'submitting' }
		| { type: 'deleting' }
		| { type: 'deleted' }
		| { type: 'error'; message: string }

	let { data }: Props = $props()
	let event = $state(data)
	let locale = getLocale()
	let hourCycle = browser ? new Intl.Locale(navigator.language).getHourCycles?.()[0] : undefined

	const now = Date.now()
	const todayUtc = new Date()
	todayUtc.setUTCHours(0, 0, 0, 0)

	let pastTimes = $derived(event.times.filter(t => getEndOfTime(t) <= now))
	let futureTimes = $derived(event.times.filter(t => getEndOfTime(t) > now))
	let nextTime = $derived(futureTimes[0])
	let showAll = $state(false)
	let status = $state<Status>({ type: 'ready' })

	let loggedIn = $state<boolean>()
	onMount(() => {
		loggedIn = !!localStorage.loggedIn
	})

	const submittedDrafts = createSubmittedDrafts()

	function formatAppointment(time: Time): string[] {
		switch (time.variant) {
			case 'day':
				return [formatDate(time.start)]
			case 'time':
				return [formatDate(time.start), formatTime(time.start)]
			case 'day-range':
				return [`${formatDate(time.start)} – ${formatDate(time.end)}`]
			case 'time-range':
				return [
					formatDate(time.start),
					`${formatTime(time.start)}\u{2009}–\u{2009}${formatTime(time.end)}`,
				]
		}
	}

	function formatTime(date: Date) {
		return date.toLocaleTimeString(locale, {
			timeZone: 'Europe/Berlin',
			hour: locale === 'en' ? 'numeric' : '2-digit',
			minute: '2-digit',
			hourCycle,
		})
	}

	function formatDate(date: Date) {
		const withYear = date.getFullYear() !== new Date().getFullYear()

		return date
			.toLocaleDateString(locale, {
				timeZone: 'Europe/Berlin',
				weekday: withYear ? undefined : 'short',
				day: 'numeric',
				month: withYear || locale === 'en' ? 'short' : 'long',
				year: withYear ? 'numeric' : undefined,
			})
			.replace('.,', ',')
	}

	function getRelativeDays(date: Date) {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const dateCopy = new Date(date)
		dateCopy.setHours(0, 0, 0, 0)
		// rounding should help with issues due to DST
		return Math.round((dateCopy.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
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
		if (loggedIn && event?.key) {
			status = { type: 'submitting' }
			try {
				await setEventState(event.key, 'public')
				event.state = 'public'
				status = { type: 'ready' }
			} catch (e) {
				status = { type: 'error', message: e instanceof Error ? e.message : m.error() }
			}
		}
	}

	async function deleteOrArchive() {
		if (event.state === 'draft') {
			if (!confirm(m.event_delete_draft_final())) return
		}

		if (event?.key && (loggedIn || event.state === 'draft')) {
			try {
				let success: boolean
				if (event.state === 'draft') {
					success = await deleteEvent(event.key, 'draft')
					if (success) {
						status = { type: 'deleted' }
						submittedDrafts.remove(event.key)
					}
				} else {
					success = await setEventState(event.key, 'archived')
					if (success) {
						status = { type: 'ready' }
						event.state = 'archived'
					}
					console.log(success, $state.snapshot(status), event.state)
				}
				if (!success) {
					status = { type: 'error', message: m.event_delete_failed() }
				}
			} catch (e) {
				status = { type: 'error', message: e instanceof Error ? e.message : m.error() }
			}
		}
	}
</script>

<svelte:head>
	<title>{event.titleDe} | Queeres Zentrum Kassel</title>
</svelte:head>

{#if loggedIn || event.state !== 'public'}
	<div
		class="admin-bar"
		class:published={status.type === 'submitting' ||
			(event.state === 'public' && status.type === 'ready')}
		class:deleted={status.type === 'deleted' || status.type === 'deleting'}
		class:error={status.type === 'error'}
	>
		{#if status.type === 'error'}
			<p>{status.message}</p>
		{:else if status.type === 'deleting'}
			<p>{m.deleting()}</p>
		{:else if status.type === 'deleted'}
			<p>{m.deleted()}</p>
		{:else if status.type === 'submitting'}
			<p>{m.publishing()}</p>
		{:else if event.state === 'public'}
			<p>{m.event_published_label()}</p>
		{:else if event.state === 'archived'}
			<p>{m.event_archived_label()}</p>
		{:else if loggedIn === false}
			<p>{m.event_submitted_label()}</p>
			<p>
				<Insert template={m.event_submitted_contact()}>
					{#snippet placeholder(_, text)}
						<a href={localizeHref('/kontakt')}>{text}</a>
					{/snippet}
				</Insert>
			</p>
		{:else}
			{m.event_draft_label()}
		{/if}

		{#if status.type === 'ready' && event}
			<div class="admin-controls">
				{#if loggedIn || event.state === 'draft'}
					<a
						class="admin-button edit"
						href={localizeHref(
							`/veranstaltungen/bearbeiten?${new URLSearchParams({
								key: event.key!,
								state: event.state,
							})}`,
						)}
					>
						{m.actions_edit()}
					</a>
				{/if}
				{#if (loggedIn || event.state === 'draft') && event.state !== 'archived'}
					<button class="admin-button delete" onclick={deleteOrArchive}>
						{event.state === 'draft' ? m.actions_delete() : m.actions_archive()}
					</button>
				{/if}
				{#if loggedIn && event.state !== 'public'}
					<button class="admin-button publish" onclick={publish}>{m.actions_publish()}</button>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<div class="layout">
	<div class="main">
		<h1>{event.titleDe}</h1>

		<div class="quick-links">
			<a href="#termine" onclick={scrollToAppointments}>
				{m.event_anchor_appointments({ count: event.times.length })}
				<svg class="arrow-down" viewBox="0 0 24 24">
					<path d="M4,14L12,22L20,14M12,22L12,2z" />
				</svg>
			</a>
			<a href="#ort" onclick={scrollToPlace}>
				{m.event_anchor_place()}
				<svg class="arrow-down" viewBox="0 0 24 24">
					<path d="M4,14L12,22L20,14M12,22L12,2z" />
				</svg>
			</a>
		</div>

		<div class="event-description">{@html event.descDe}</div>
	</div>

	<div class="sidebar">
		<div class="sidebar-title" id="termine">
			{m.event_anchor_appointments({ count: event.times.length })}
		</div>
		<div
			class="appointments"
			style={event.decoration
				? `--gradient1: oklch(0.97 0.06 ${event.decoration.colors[0]}deg); --gradient2: oklch(0.97 0.06 ${event.decoration.colors[1]}deg);`
				: undefined}
		>
			{#if showAll || futureTimes.length === 0}
				{#each showAll ? pastTimes : pastTimes.slice(-5) as time (time)}
					<div class="row in-past">
						{#each formatAppointment(time) as span (span)}
							<span>{span}</span>
						{/each}
					</div>
				{/each}
			{/if}
			{#each showAll ? futureTimes : futureTimes.slice(0, 5) as time (time)}
				<div class="row">
					{#each formatAppointment(time) as span (span)}
						<span>{span}</span>
					{/each}
				</div>
			{/each}
			{#if !showAll && (event.times.length > 5 || (futureTimes.length && pastTimes.length))}
				<button class="show-all-times" onclick={() => (showAll = true)}>
					{m.actions_show_all()}
				</button>
			{/if}
		</div>
		{#if nextTime && (nextTime.variant === 'day' || nextTime.variant === 'day-range')}
			<p>
				<Insert
					template={m.event_relative_days({
						days: getRelativeDays(
							nextTime.variant === 'day' || nextTime.start >= todayUtc
								? nextTime.start
								: nextTime.end!,
						),
						ty: nextTime.variant === 'day' ? 'once' : nextTime.start >= todayUtc ? 'start' : 'end',
					})}
				>
					{#snippet placeholder(_bold, text)}
						<b>{text}</b>
					{/snippet}
				</Insert>
			</p>
		{:else if nextTime}
			<EventCountDown
				showLabel={futureTimes.length > 1 || (showAll && event.times.length > 1)}
				time={nextTime.start}
			/>
		{/if}

		<div class="sidebar-title" id="ort">{m.event_anchor_place()}</div>

		{#if event.place.type === 'PHYSICAL'}
			{#if event.place.room}
				<p><b>{event.place.room}</b></p>
				<p class="address">
					{event.place.name}<br />
					{event.place.address}
				</p>
				<p>
					<a class="button-link" href={localizeHref('/wegbeschreibung')}>
						{m.event_anchor_directions()}
					</a>
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

		{#if event.organizer.name || event.organizer.email || event.organizer.phone || event.organizer.website}
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
	@use '../../../routes/vars';

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

		@media (max-width: vars.$DESKTOP_BP) {
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

		@media (max-width: vars.$DESKTOP_BP) {
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
		font-weight: normal;
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
			font-weight: normal;
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
