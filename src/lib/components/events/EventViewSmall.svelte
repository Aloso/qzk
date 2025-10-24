<script lang="ts">
	import type { Event, Time } from '$lib/events/types'
	import EventDateTime from './EventDateTime.svelte'
	import DOMPurify from 'dompurify'
	import { daysUntil } from '../timeCalc'
	import EventDateTimeDetailed from './EventDateTimeDetailed.svelte'
	import { getLocale, localizeHref } from '$lib/paraglide/runtime'
	import { m } from '$lib/paraglide/messages'

	interface Props {
		event: Event
		showMore?: boolean
		openInNewTab?: boolean
	}

	let { event, showMore = false, openInNewTab }: Props = $props()
	let locale = getLocale()

	let hyphenateTitle = $derived(/\p{Alpha}{16,}/u.test(event.title))
	let descHtml = $derived.by(() => {
		if (DOMPurify.isSupported) {
			return DOMPurify.sanitize(event.descHtml)
		} else {
			// on the server, we trust that the HTML is okay
			// this may cause hydration mismatches, because DOMPurify may
			// insert HTML entities and remove `target="_blank" from links.
			return event.descHtml
		}
	})
	let imgLabel = $derived(formatDateSoon(event.time[0]))

	function formatDateSoon({ start, end }: Time) {
		const days = daysUntil(start)
		if (days < 0 && end && daysUntil(end) >= 0) {
			return m.event_current()
		}
		if (days >= 0 && days < 6) {
			if (days === 0) return m.event_today()
			else if (days === 1) return m.event_tomorrow()
			else return start.toLocaleDateString(locale, { timeZone: 'Europe/Berlin', weekday: 'long' })
		}
	}
</script>

<div class="event">
	<div
		class="event-img"
		style={event.decoration
			? `--gradient1: oklch(0.83 0.15 ${event.decoration.colors[0]});
			   --gradient2: oklch(0.83 0.15 ${event.decoration.colors[1]});
			   --image: url('/banner/${event.decoration.blendImage.replace(/\P{Alpha}/gu, '')}.png')`
			: undefined}
	>
		{#if imgLabel}
			<div class="event-img-label">
				{imgLabel}
			</div>
		{/if}
	</div>

	<h3 class="event-title" class:hyphenateTitle>{event.title}</h3>

	<div class="event-description">{@html descHtml}</div>

	{#if showMore}
		<div class="event-place" aria-label="Ort">
			{#if event.place.type === 'ONLINE'}
				{m.event_online()}
			{:else}
				{event.place.room ?? event.place.name}
			{/if}
		</div>
	{/if}

	<div class="bottom">
		<div class="event-times" aria-label="Termin">
			<span class="event-time">
				{#if showMore}
					<EventDateTimeDetailed time={event.time[0]} />
				{:else}
					<EventDateTime time={event.time[0]} />
				{/if}
			</span>
		</div>
		<a
			class="open-button"
			href={localizeHref(`/veranstaltungen/${event.key}`)}
			target={openInNewTab ? '_blank' : undefined}
			style={event.decoration
				? `--bg: oklch(0.55 0.15 ${event.decoration.colors[1]}); --bg-focus: oklch(0.45 0.15 ${event.decoration.colors[1]})`
				: undefined}
		>
			{m.event_more_info()}
		</a>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars';

	.event {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: 25rem;
		border: none;
		margin: 0 0 2rem 0;
		padding: 1.5rem;
		background-color: #f4f4f4;
		box-shadow: inset 0 0 0 2px #0000000a;
		border-radius: 25px;
		text-align: left;
		color: inherit;
		font: inherit;
		overflow: hidden;
		max-width: calc(100vw - 2rem);

		@media (max-width: 22rem) {
			margin: 0 -1rem;
			padding: 1rem;
			border-radius: 0;
			box-shadow: none;
			max-width: 100vw;
		}
	}

	.event-img {
		display: block;
		box-sizing: border-box;
		margin: -1.5rem -1.5rem 1.5rem -1.5rem;
		padding: 0.8rem 0;
		min-height: 3.4rem;
		background-image:
			var(--image, url('/banner/confetti.png')),
			linear-gradient(to right in oklab, var(--gradient1, #6fb0c9), var(--gradient2, #db71dd));
		background-size: 120px, auto;

		@media (max-width: 22rem) {
			margin: -1rem -1rem 1rem -1rem;
		}

		.event-img-label {
			display: inline-block;
			text-transform: uppercase;
			background-color: white;
			margin: 0;
			padding: 0.4rem 0.7rem;
			border-radius: 0 8px 8px 0;
			opacity: 0.8;
			font-size: 1rem;
			line-height: 1rem;
			font-weight: 500;
			letter-spacing: 0.05rem;
		}
	}

	.event-title {
		font-family: inherit;
		font-weight: 600;
		font-size: 1.15rem;
		margin: 0 0 0.33rem 0;
		line-height: 1.4;

		&.hyphenateTitle {
			hyphens: auto;
		}
	}

	.event-description {
		position: relative;
		flex-grow: 1;
		flex-shrink: 1;
		overflow: hidden;
		font-size: 1rem;

		:global(p) {
			line-height: 1.5;
		}

		&::after {
			content: '';
			display: block;
			position: absolute;
			width: 100%;
			height: 50px;
			bottom: 0;
			background: linear-gradient(transparent, #f4f4f4);
		}

		:global(p),
		:global(ul),
		:global(ol),
		:global(li),
		:global(blockquote),
		:global(h1),
		:global(h2),
		:global(h3),
		:global(h4),
		:global(h5),
		:global(h6) {
			font-size: inherit;
			margin: 0.5rem 0;
		}

		:global(.a) {
			color: var(--color-theme);
		}
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 1rem 0 0 0;

		.event-times {
			flex-grow: 1;
			display: flex;
			align-items: center;
			gap: 0.33rem;
		}

		.open-button {
			align-self: flex-end;
			border: none;
			background-color: var(--bg, color.adjust(vars.$COLOR_T4, $lightness: +8%));
			color: white;
			transition: background-color 0.2s;
			border-radius: 8px;
			font-family: inherit;
			font-size: 1rem;
			padding: 0.4rem 0.6rem;
			text-decoration: none;

			margin: 0;

			&:hover,
			&:focus {
				background-color: var(--bg-focus, vars.$COLOR_T4);
			}
		}
	}

	.event-place {
		margin: 1rem 0 0 0;
		background-color: white;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		box-shadow: inset 0 0 0 2px #e5e5e5;
	}

	.event-time {
		display: flex;
		background-color: white;
		padding: 0.4rem 0.6rem;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: inset 0 0 0 2px #e5e5e5;

		:global(i) {
			font-style: normal;
			padding: 0.4rem 0.6rem;
			margin: -0.4rem -0.6rem;
			white-space: nowrap;

			&:not(.lone) {
				border-right: 2px solid #e5e5e5;
				margin-right: 10px;
			}
		}

		:global(em) {
			font-style: normal;
			font-weight: 600;
		}
	}
</style>
