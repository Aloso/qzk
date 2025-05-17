<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import MonthNav from '$lib/components/calendar/MonthNav.svelte'
	import EventViewSmall from '$lib/components/events/EventViewSmall.svelte'
	import Pagination from '$lib/components/Pagination.svelte'
	import TabBar from '$lib/components/TabBar.svelte'
	import { onMount } from 'svelte'
	import type { Data } from './+page.server'

	interface Props {
		data: Data
	}

	let { data }: Props = $props()
	let monthStart = $derived(data.monthStart ? new Date(data.monthStart) : new Date())

	let currentMonthStart = new Date()
	currentMonthStart.setDate(1)
	currentMonthStart.setHours(12, 0, 0, 0)
	let monthDate = currentMonthStart.toISOString().split('T')[0]

	onMount(() => {
		const listener = () => {
			invalidateAll()
		}

		window.addEventListener('focus', listener)
		return () => {
			window.removeEventListener('focus', listener)
		}
	})
</script>

<svelte:head>
	<title>Admin: Veranstaltungen - Queeres Zentrum Kassel</title>
</svelte:head>

<h1>Veranstaltungen</h1>
<TabBar
	urls={[
		['/admin/events/drafts/1', 'drafts', 'Entwürfe'],
		['/admin/events/published/1', 'published', 'Öffentlich'],
		['/admin/events/past/1', 'past', 'Ehemalig'],
		[`/admin/events/months/${monthDate}`, 'months', 'Nach Monat'],
	]}
	active={data.type}
/>

<div>
	{#if data.type === 'months'}
		<MonthNav
			year={monthStart.getFullYear()}
			month={monthStart.getMonth()}
			onChange={(year, month) => {
				const monthNew = `${year}-${String(month + 1).padStart(2, '0')}-01`
				goto(`/admin/events/months/${monthNew}`, { replaceState: true })
			}}
		/>
		<br />
	{/if}

	<Pagination
		label="{data.count} {data.count === 1 ? 'Veranstaltung' : 'Veranstaltungen'}"
		page={data.page}
		maxPage={data.maxPage}
		createUrl={page => `/admin/events/${data.type}/${page}`}
	/>

	<div class="event-grid">
		{#each data.events as event}
			<EventViewSmall {event} editable openInNewTab />
		{/each}
		<div></div>
		<div></div>
		<div></div>
	</div>
</div>

<style lang="scss">
	h1 {
		margin-bottom: 0;
	}

	.event-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 0 2rem;
		align-items: start;
	}
</style>
