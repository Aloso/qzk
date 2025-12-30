<script lang="ts">
	import { goto } from '$app/navigation'
	import PlanningFormProfesh from '$lib/components/planning-form/PlanningFormProfesh.svelte'
	import { updateEvent, fetchEventForAdmin } from '$lib/events/eventApi'
	import type { Event, WithSubmitter } from '$lib/events/types'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { m } from '$lib/paraglide/messages'
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

		event = await fetchEventForAdmin(key)
		defaults.setToDraft(event)
	})

	async function onSubmit(newEvent: Omit<Event, 'state'> & WithSubmitter) {
		if (event?.key && (loggedIn || !isPublished)) {
			const key = event.key
			try {
				status = { type: 'submitting' }
				const updated = await updateEvent(
					{ ...newEvent, state: isPublished && loggedIn ? 'public' : 'draft' },
					key,
				)
				if (!updated) {
					status = { type: 'error', message: 'Fehler beim Bearbeiten!' }
					return
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
	<title>{m.actions_edit()}: {event?.titleDe ?? m.loading()} | Queeres Zentrum Kassel</title>
</svelte:head>

{#if event}
	<PlanningFormProfesh {status} defaults={defaults.values} {onSubmit} />
{:else}
	<div style="text-align: center; margin: 4rem 0">{m.loading()}</div>
{/if}
