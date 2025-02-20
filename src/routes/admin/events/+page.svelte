<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import MonthNav from '$lib/components/calendar/MonthNav.svelte'
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import TabBar from '$lib/components/TabBar.svelte'
	import type { Auth } from '$lib/events'
	import { fetchAllDrafts } from '$lib/events/draftApi'
	import { fetchAllEvents } from '$lib/events/eventApi'
	import { getInBetween, getEndOfTime } from '$lib/events/intersections'
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'

	const pageSize = 25

	let tab = $state<'drafts' | 'published' | 'past' | 'months'>('drafts')

	let data = $state<(Event & WithSubmitter)[]>([])
	let filteredData = $state<(Event & WithSubmitter)[]>([])
	let length = $state(0)
	let page = $state(0)
	let loading = $state(true)
	const credentials = createAdminCredentials()

	$effect(() => {
		if (credentials.auth) {
			loading = true
			setEvents(tab, credentials.auth, page)
		} else {
			goto('/admin', { replaceState: true })
		}
	})

	$effect(() => {
		function onFocus() {
			if (credentials.auth) {
				loading = true
				setEvents(tab, credentials.auth, page)
			} else {
				goto('/admin', { replaceState: true })
			}
		}
		window.addEventListener('focus', onFocus)
		return () => {
			window.removeEventListener('focus', onFocus)
		}
	})

	async function setEvents(
		tab: 'drafts' | 'published' | 'past' | 'months',
		auth: Auth,
		page: number,
	) {
		if (tab === 'drafts') {
			const response = await fetchAllDrafts(auth, page * pageSize, pageSize)
			if (tab !== 'drafts') return

			data = response.events
			length = response.length
		} else {
			data = await fetchAllEvents(auth)
		}

		loading = false
	}

	function getSortTime(event: Event): number {
		return event.time[0]?.start.getTime() ?? 0
	}
	function getSortTimeEnd(event: Event): number {
		const t: Time | undefined = event.time[event.time.length - 1]
		return t?.end?.getTime() ?? t?.start.getTime() ?? 0
	}

	let date = new Date()
	let year = $state(date.getFullYear())
	let month = $state(date.getMonth())
	let { monthStart, monthEnd } = $derived.by(() => {
		const date = new Date(`${year}-${String(month + 1).padStart(2, '0')}-01`)
		const monthStart = +date
		date.setMonth(date.getMonth() + 1)
		const monthEnd = +date - 1
		return { monthStart, monthEnd }
	})

	$effect(() => {
		if (loading) return

		let fd: (Event & WithSubmitter)[]

		if (tab === 'drafts') {
			filteredData = data
			return
		} else if (tab === 'published') {
			const now = Date.now()
			fd = data
				.map(event => ({
					...event,
					allTimes: event.time,
					time: event.time.filter(time => getEndOfTime(time) > now),
				}))
				.filter(event => event.time.length > 0)
				.toSorted((a, b) => getSortTime(a) - getSortTime(b))
		} else if (tab === 'past') {
			const now = Date.now()
			fd = data
				.map(event => ({
					...event,
					allTimes: event.time,
					time: event.time.filter(time => getEndOfTime(time) <= now),
				}))
				.filter(event => event.time.length > 0)
				.toSorted((a, b) => getSortTimeEnd(b) - getSortTimeEnd(a))
		} else if (tab === 'months') {
			fd = data
				.map(event => ({
					...event,
					allTimes: event.time,
					time: getInBetween(event.time, monthStart, monthEnd),
				}))
				.filter(event => event.time.length > 0)
				.toSorted((a, b) => getSortTime(a) - getSortTime(b))
		} else {
			return
		}

		filteredData = fd
		length = fd.length
	})
</script>

<h1>Veranstaltungen</h1>
<TabBar
	tabs={[
		['drafts', 'Entwürfe'],
		['published', 'Veröffentlicht'],
		['past', 'Ehemalig'],
		['months', 'Nach Monat'],
	]}
	bind:active={tab}
/>

{#if loading}
	<p>Veranstaltungen werden geladen...</p>
{/if}

<div class:hidden={loading}>
	<p class="event-count">
		{filteredData.length}
		{filteredData.length === 1 ? 'Veranstaltung' : 'Veranstaltungen'}
	</p>
	{#if tab === 'drafts' && length > 25}
		<p>
			Seite {page}
			<span class="pagination">
				<button disabled={page === 0} onclick={() => (page -= 1)}>Zurück</button>
				<button disabled={length <= page * pageSize} onclick={() => (page += 1)}>Weiter</button>
				{#if page > 1}
					<button onclick={() => (page = 0)}>Zum Anfang</button>
				{/if}
			</span>
		</p>
	{:else if tab === 'months'}
		<MonthNav bind:year bind:month />
		<br />
	{/if}

	<div class="event-grid">
		{#each filteredData as event}
			<EventViewSmall {event} editable published={tab !== 'drafts'} openInNewTab />
		{/each}
		<div></div>
		<div></div>
	</div>
</div>

<style lang="scss">
	.hidden {
		display: none;
	}

	h1 {
		margin-bottom: 0;
	}

	.event-count {
		margin-top: 0;
	}

	.event-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		align-items: start;
	}

	button {
		background-color: #eee;
		border: 2px solid #aaa;
		border-radius: 10px;
		padding: 0.5rem 1rem;
		color: black;
		font: inherit;
		font-size: 94%;
		transition: background-color 0.2s;

		&:hover,
		&:focus {
			background-color: white;
		}
	}
</style>
