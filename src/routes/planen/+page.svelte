<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import PlanningForm from './PlanningForm.svelte'
	import { deleteDraft, editDraft, fetchDraft, submitDraft } from '$lib/events/draftApi'
	import type { Event } from '$lib/events/types'
	import { createSubmittedDrafts } from '../../lib/hooks/createSubmittedDrafts.svelte'
	import { createEventPlanningDefaults } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { createEventPlanningRouter } from '$lib/hooks/createEventPlanningRouter.svelte'

	let { data } = $props<{ data: StaticPage }>()

	let isMissing = $state(false)
	let error = $state<string>()
	const defaults = createEventPlanningDefaults()
	const submittedDrafts = createSubmittedDrafts()

	$effect(() => {
		console.log(router.key)
	})

	const router = createEventPlanningRouter({
		onEventMount(key) {
			isMissing = false
			error = undefined
			loadDraftEvent(key)
		},
		onMainMount() {
			isMissing = false
			error = undefined
			defaults.reset()
		},
	})

	async function loadDraftEvent(key: string) {
		const draft = await fetchDraft(key)
		if (draft === null) {
			isMissing = true
			submittedDrafts.remove(key)
		} else {
			defaults.setToDraft(draft)
		}
	}

	async function onSubmit(event: Event) {
		try {
			if (router.key) {
				const success = await editDraft(event, router.key)
				error = success
					? undefined
					: 'Der Entwurf konnte nicht bearbeitet werden. Vielleicht wurde er bereits akzeptiert!'
			} else {
				const { key } = await submitDraft(event)
				submittedDrafts.add(key, `${new Date().toLocaleString()} - ${event.title}`)
				router.gotoEvent(key)
			}
		} catch (e) {
			if (e instanceof Error) {
				error = e.message
			}
		}
	}

	async function onDelete() {
		if (confirm('Bist du sicher?')) {
			const key = router.key!
			submittedDrafts.remove(key)
			const success = await deleteDraft(key)
			error = success
				? undefined
				: 'Der Entwurf konnte nicht gelöscht werden. Vielleicht wurde er bereits akzeptiert!'
			router.gotoMain()
		}
	}
</script>

<StaticPageHeader {...data} />

{#if submittedDrafts.items.length}
	<h1>Eingereichte Veranstaltungen</h1>
	<ul>
		{#each submittedDrafts.items as { key, name }}
			<li class:active={key === router.key}>
				<a href="/planen?key={encodeURIComponent(key)}" on:click={() => router.gotoEvent(key)}>
					{name}
				</a>
			</li>
		{/each}
	</ul>

	<hr />
{:else}
	<section>
		<RichText data={data.content} width={900} />
	</section>

	<hr />
{/if}

{#if isMissing}
	<p class="error">
		Die eingereichte Veranstaltung wurde nicht gefunden! Vielleicht wurde sie bereits akzeptiert,
		und kann von dir nicht mehr bearbeitet werden.
	</p>
	<p>
		<a href="/planen">Neue Veranstaltung planen</a>
	</p>

	<h2>Veranstaltung bearbeiten</h2>
{:else if router.key}
	<p>
		Die Veranstaltung wurde eingereicht! Wir informieren dich, wenn wir die Veranstaltung
		akzeptieren und auf der Website veröffentlichen. Bis dahin kannst du sie noch hier bearbeiten.
	</p>

	<h2>Veranstaltung bearbeiten</h2>
{:else}
	<h2>Veranstaltung einreichen</h2>
{/if}

<PlanningForm
	defaults={defaults.values}
	onSubmit={(event) => onSubmit(event)}
	onDelete={router.key ? onDelete : undefined}
	{error}
/>

<style lang="scss">
	.error {
		color: #ad1515;
	}

	.active {
		font-weight: bold;

		a {
			text-decoration: none;
			color: black;
		}
	}
</style>
