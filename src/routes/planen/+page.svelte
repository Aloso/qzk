<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from './PlanningForm.svelte'
	import { submitDraft } from '$lib/events/draftApi'
	import type { Event } from '$lib/events/types'
	import { createSubmittedDrafts } from '../../lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { goto } from '$app/navigation'
	import SubmittedList from './SubmittedList.svelte'

	let { data }: { data: StaticPage } = $props()

	type Status = { type: 'ready' } | { type: 'submitting' } | { type: 'error'; message: string }

	let status = $state<Status>({ type: 'ready' })
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	async function onSubmit(event: Event) {
		status = { type: 'submitting' }
		try {
			const { key } = await submitDraft(event)
			const date = new Date().toLocaleString('de-DE', {
				month: 'numeric',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			})
			submittedDrafts.add(key, `${date} - ${event.title}`)
			goto('/planen/eingereicht?key=' + encodeURIComponent(key))
		} catch (e) {
			if (e instanceof Error) {
				status = { type: 'error', message: e.message }
			}
		}
	}
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.content} width={900} />
</section>

<hr />

<SubmittedList items={submittedDrafts.items} />

<h2>Veranstaltung einreichen</h2>

<PlanningForm defaults={defaults.values} onSubmit={(event) => onSubmit(event)} {status} />
