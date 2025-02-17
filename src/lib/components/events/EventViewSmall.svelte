<script lang="ts">
	import type { Event } from '$lib/events/types'
	import { onMount } from 'svelte'
	import EventDateTime from './EventDateTime.svelte'
	import { replaceState } from '$app/navigation'
	import DOMPurify from 'dompurify'
	import { daysUntil } from '../timeCalc'
	import EventDateTimeDetailed from './EventDateTimeDetailed.svelte'

	interface Props {
		event: Event
		showMore?: boolean
		editable?: boolean
		published?: boolean
		onOpen: () => void
	}

	let { event, showMore = false, onOpen }: Props = $props()

	let hyphenateTitle = $derived(/\p{Alpha}{16,}/u.test(event.title))
	let descHtml = $derived.by(() => {
		if (DOMPurify.isSupported) {
			return DOMPurify.sanitize(event.descHtml)
		} else {
			// on the server, we trust that the HTML
			return event.descHtml
		}
	})
	let imgLabel = $derived(formatDateSoon(event.time[0].start))

	let overlayShown = $state(false)

	onMount(() => {
		const hash = location.hash.replace(/^#event-/, '')
		if (hash === event.key) {
			openPopup()
		}
	})

	function formatDateSoon(d: Date) {
		const days = daysUntil(d)
		if (days >= 0 && days < 6) {
			if (days === 0) return 'Heute'
			else if (days === 1) return 'Morgen'
			else return d.toLocaleDateString('de-DE', { weekday: 'long' })
		}
	}

	function openPopup() {
		overlayShown = true
		const url = new URL(location.href)
		url.hash = `#event-${event.key}`
		replaceState(url, {})
	}
</script>

<div class="event">
	<div class="event-img">
		{#if imgLabel}
			<div class="event-img-label">
				{imgLabel}
			</div>
		{/if}
	</div>

	<div class="event-title" class:hyphenateTitle>{event.title}</div>

	<div class="event-description">{@html descHtml}</div>

	{#if showMore}
		<div class="event-place">
			{#if event.place.type === 'ONLINE'}
				Online-Veranstaltung
			{:else}
				{event.place.room ?? event.place.name}
			{/if}
		</div>
	{/if}

	<div class="bottom">
		<div class="event-times">
			<span class="event-time">
				{#if showMore}
					<EventDateTimeDetailed time={event.time[0]} />
				{:else}
					<EventDateTime time={event.time[0]} />
				{/if}
			</span>
			{#if !showMore && event.time.length > 1}
				<span class="omitted-times">···</span>
			{/if}
		</div>
		<button class="open-button" onclick={onOpen}>Mehr Infos</button>
	</div>
</div>

<style lang="scss">
	@use 'sass:color';
	@use '../../../routes/vars.scss' as vars;

	.event {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		height: 450px;
		border: none;
		margin: 0;
		padding: 1.5rem;
		background-color: #f4f4f4;
		box-shadow: inset 0 0 0 2px #0000000a;
		border-radius: 25px;
		text-align: left;
		color: inherit;
		font: inherit;
		overflow: hidden;
	}

	.event-img {
		display: block;
		box-sizing: border-box;
		margin: -1.5rem -1.5rem 1.5rem -1.5rem;
		padding: 0.8rem 0;
		min-height: 3.4rem;
		background-image: url('/banner/sew.png'), linear-gradient(to right in oklab, #6fb0c9, #db71dd);
		background-size: 100px, auto;

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
		:global(blockquote) {
			font-size: inherit;
		}

		:global(p) {
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

		.omitted-times {
			opacity: 0.7;
		}

		.open-button {
			align-self: flex-end;
			border: none;
			background-color: color.adjust(vars.$COLOR_T4, $lightness: +8%);
			color: white;
			transition: background-color 0.2s;
			border-radius: 8px;
			font-family: inherit;
			font-size: 1rem;
			padding: 0.4rem 0.6rem;

			margin: 0;

			&:hover,
			&:focus {
				background-color: vars.$COLOR_T4;
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
