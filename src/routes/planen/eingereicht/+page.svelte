<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from '../PlanningForm.svelte'
	import { deleteDraft, editDraft, fetchDraft } from '$lib/events/draftApi'
	import type { Event } from '$lib/events/types'
	import { createSubmittedDrafts } from '$lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { createEventPlanningRouter } from '$lib/hooks/createEventPlanningRouter.svelte'
	import { goto } from '$app/navigation'
	import SubmittedList from '../SubmittedList.svelte'

	let { data } = $props<{ data: StaticPage }>()

	type Status =
		| { type: 'loading' }
		| { type: 'ready'; submitted?: boolean }
		| { type: 'submitting' }
		| { type: 'error'; message: string; missing?: boolean }

	let status = $state<Status>({ type: 'loading' })
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	const router = createEventPlanningRouter({
		onMount(key) {
			status = { type: 'loading' }
			loadDraftEvent(key)
		},
	})

	async function loadDraftEvent(key: string, retries = 5) {
		const draft = await fetchDraft(key)
		if (draft === null) {
			status = { type: 'error', message: 'Die Veranstaltung existiert nicht', missing: true }
			if (retries) {
				await new Promise((resolve) => setTimeout(resolve, 1000))
				await loadDraftEvent(key, retries - 1)
			} else {
				submittedDrafts.remove(key)
			}
		} else {
			status = { type: 'ready' }
			defaults.setToDraft(draft)
		}
	}

	async function onSubmit(event: Event) {
		status = { type: 'submitting' }
		try {
			if (router.key) {
				const success = await editDraft(event, router.key)
				status = success
					? { type: 'ready', submitted: true }
					: {
							type: 'error',
							message:
								'Der Entwurf konnte nicht bearbeitet werden. Vielleicht wurde er bereits akzeptiert!',
						}
			}
		} catch (e) {
			if (e instanceof Error) {
				status = { type: 'error', message: e.message }
			}
		}
	}

	async function onDelete() {
		if (confirm('Bist du sicher?') && router.key) {
			submittedDrafts.remove(router.key)
			try {
				await deleteDraft(router.key)
				goto('/planen')
			} catch (e) {
				if (e instanceof Error) {
					status = { type: 'error', message: e.message }
				}
			}
		}
	}
</script>

<StaticPageHeader {...data} />

<section>
	{#if status.type === 'error' && status.missing}
		<h1>Fehler</h1>

		<p class="error">
			Die eingereichte Veranstaltung wurde nicht gefunden! Vielleicht wurde sie bereits akzeptiert,
			und kann von dir nicht mehr bearbeitet werden.
		</p>
	{:else}
		<RichText data={data.content} width={900} />
	{/if}

	<p>
		<a href="/planen">Neue Veranstaltung planen</a>
	</p>
</section>

<hr />

<SubmittedList
	selectedKey={router.key}
	onSelect={(key) => router.gotoEvent(key)}
	items={submittedDrafts.items}
/>

{#if status.type === 'loading'}
	<div class="loading">Lädt...</div>
{:else}
	<PlanningForm defaults={defaults.values} {onSubmit} {onDelete} {status} />
{/if}

<style lang="scss">
	.error {
		color: #ad1515;
	}
	.loading {
		display: block;
		text-align: center;
		box-sizing: border-box;
		padding: 6rem 0;
		height: 70vh;
	}
</style>
