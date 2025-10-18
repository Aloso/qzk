<script lang="ts">
	import { goto } from '$app/navigation'
	import PlanningFormProfesh from '$lib/components/planning-form/PlanningFormProfesh.svelte'
	import { updateDraft } from '$lib/events/draftApi'
	import { updateEvent } from '$lib/events/eventApi'
	import { fetchEventOrDraft as fetchEventOrDraft } from '$lib/events/eventApi/fetchEventOrDraft'
	import type { Event, WithSubmitter } from '$lib/events/types'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { localizeHref } from '$lib/paraglide/runtime'
	import { error } from '@sveltejs/kit'
	import { onMount } from 'svelte'

	type Status =
		| { type: 'ready' }
		| { type: 'submitting' }
		| { type: 'error'; message: string; missing?: boolean }

	const defaults = createEventPlanningDefaults({})
	let loggedIn = $state<boolean>()
	onMount(() => {
		loggedIn = !!localStorage.loggedIn
	})

	let event = $state<Event & WithSubmitter>()
	let isPublished = $state(false)
	let status = $state<Status>({ type: 'ready' })

	onMount(async () => {
		const params = new URLSearchParams(location.search)
		isPublished = params.get('isPublished') === 'true'
		const key = params.get('key') ?? error(404)

		event = await fetchEventOrDraft(key)
		defaults.setToDraft(event)
	})

	async function onSubmit(newEvent: Event & WithSubmitter) {
		if (event?.key && (loggedIn || !isPublished)) {
			const key = event.key
			try {
				status = { type: 'submitting' }
				if (isPublished && loggedIn) {
					await updateEvent(newEvent, key)
				} else {
					const updated = await updateDraft(newEvent, key)
					if (!updated) {
						status = { type: 'error', message: 'Fehler beim Bearbeiten!' }
						return
					}
				}
				goto(localizeHref(`/veranstaltungen/${event.key}`))
			} catch (e) {
				if (e instanceof Error) {
					status = { type: 'error', message: e.message }
				}
			}
		}
	}
</script>

<svelte:head>
	<title>Bearbeiten - {event?.title ?? 'Lädt...'} - Queeres Zentrum Kassel</title>
</svelte:head>

{#if event}
	<PlanningFormProfesh {status} defaults={defaults.values} {onSubmit} />
{:else}
	<div style="text-align: center; margin: 4rem 0">Lädt...</div>
{/if}
