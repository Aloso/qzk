<script lang="ts">
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import StaticPage from '$lib/components/StaticPage.svelte'
	import type { StaticPageTransformed } from '$lib/data'
	import PlanningForm from '../../../lib/components/planning-form/PlanningFormProfesh.svelte'
	import { deleteDraft, updateDraft, fetchDraft } from '$lib/events/draftApi'
	import type { Event, WithSubmitter } from '$lib/events/types'
	import { createSubmittedDrafts } from '$lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { createEventPlanningRouter } from '$lib/hooks/createEventPlanningRouter.svelte'
	import { goto } from '$app/navigation'
	import SubmittedList from '../SubmittedList.svelte'
	import { createAdminCredentials } from '$lib/hooks/createAdminCredentials.svelte'
	import { publishDraft } from '$lib/events/eventApi'

	let { data }: { data: StaticPageTransformed } = $props()

	type Status =
		| { type: 'loading' }
		| { type: 'ready'; submitted?: boolean }
		| { type: 'submitting' }
		| { type: 'error'; message: string; missing?: boolean }

	let status = $state<Status>({ type: 'loading' })
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()
	const credentials = createAdminCredentials()

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
				await new Promise(resolve => setTimeout(resolve, 1000))
				await loadDraftEvent(key, retries - 1)
			} else {
				submittedDrafts.remove(key)
			}
		} else {
			status = { type: 'ready' }
			defaults.setToDraft(draft)
		}
	}

	async function onSubmit(event: Event & WithSubmitter) {
		status = { type: 'submitting' }
		try {
			if (router.key) {
				const success = await updateDraft(event, router.key)
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
		if (confirm('Möchtest du die Veranstaltung löschen?') && router.key) {
			submittedDrafts.remove(router.key)
			try {
				await deleteDraft(router.key)
				if (credentials.auth) {
					goto('/admin/events')
				} else {
					goto('/planen')
				}
			} catch (e) {
				if (e instanceof Error) {
					status = { type: 'error', message: e.message }
				}
			}
		}
	}

	async function onPublish() {
		if (
			confirm('Die Veranstaltung erscheint jetzt auf der Startseite. Bestätigen?') &&
			router.key &&
			credentials.auth
		) {
			try {
				const success = await publishDraft(router.key, credentials.auth)
				if (success) {
					submittedDrafts.remove(router.key)
					goto('/admin/events')
				} else {
					status = { type: 'error', message: 'Veranstaltung konnte nicht veröffentlicht werden' }
				}
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
		<StaticPage {data} />
	{/if}

	<p>
		<a href="/planen">Neue Veranstaltung planen</a>
	</p>
</section>

<hr />

<SubmittedList
	selectedKey={router.key}
	onSelect={key => router.gotoEvent(key)}
	items={submittedDrafts.items}
/>

{#if status.type === 'loading'}
	<div class="loading">Lädt...</div>
{:else}
	<PlanningForm
		defaults={defaults.values}
		{onSubmit}
		{onDelete}
		onPublish={credentials.auth ? onPublish : undefined}
		{status}
	/>
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
