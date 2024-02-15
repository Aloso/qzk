<script lang="ts">
	import RichText from '$lib/components/RichText.svelte'
	import StaticPageHeader from '$lib/components/StaticPageHeader.svelte'
	import type { StaticPage } from '$lib/data'
	import { onMount } from 'svelte'
	import PlanningForm from './PlanningForm.svelte'
	import type { FormValues } from './formValues'
	import { deleteDraft, editDraft, fetchDraft, submitDraft } from '$lib/events/draftApi'
	import type { Event } from '$lib/events/types'
	import { goto } from '$app/navigation'

	let { data } = $props<{ data: StaticPage }>()

	let defaults: FormValues = $state({
		title: '',
		description: '',
		startDate: '',
		startTime: '',
		endDate: '',
		endTime: '',
		wholeDay: false,
		placeType: 'QZ',
		placeRoom: undefined,
		placeName: '',
		placeAddress: '',
		organizerName: '',
		organizerEmail: '',
		organizerPhone: '',
		organizerWebsite: '',
		website: '',
		pictureUrl: '',
		yourName: '',
		yourEmail: '',
	})

	let eventKey = $state<string>()
	let isMissing = $state(false)
	let error = $state<string>()
	let createdDraftKeys = $state<string[]>([])

	$effect(() => {
		localStorage.setItem('createdDraftKeys', JSON.stringify(createdDraftKeys))
	})

	onMount(() => {
		const key = new URL(location.href).searchParams.get('key')
		if (key) {
			eventKey = key
			loadDraftEvent(key)
		}

		const lsDraftKeys = localStorage.getItem('createdDraftKeys')
		if (lsDraftKeys) {
			createdDraftKeys = JSON.parse(lsDraftKeys)
		}
	})

	async function loadDraftEvent(key: string) {
		isMissing = false
		const draft = await fetchDraft(key)
		if (draft === null) {
			isMissing = true
			createdDraftKeys = createdDraftKeys.filter((k) => k !== key)
			return
		}
	}

	async function onSubmit(event: Event) {
		try {
			if (eventKey) {
				if (await editDraft(event, eventKey)) {
					error = undefined
				} else {
					error =
						'Der Entwurf konnte nicht bearbeitet werden. Vielleicht wurde er bereits akzeptiert!'
				}
			} else {
				const { key } = await submitDraft(event)
				createdDraftKeys = [...createdDraftKeys, key]
				goto(`/planen?key=${encodeURIComponent(key)}`)
			}
		} catch (e) {
			console.error(e)
			if (e instanceof Error) {
				error = e.message
			}
		}
	}

	async function onDelete() {
		if (confirm('Bist du sicher?')) {
			if (await deleteDraft(eventKey!)) {
				goto('/planen')
			} else {
				error = 'Der Entwurf konnte nicht gelöscht werden. Vielleicht wurde er bereits akzeptiert!'
				isMissing = true
				createdDraftKeys = createdDraftKeys.filter((k) => k !== eventKey)
			}
		}
	}
</script>

<StaticPageHeader {...data} />

<section>
	<RichText data={data.content} width={900} />
</section>

<hr />

{#if createdDraftKeys.length}
	<h2>Eingereichte Veranstaltungen</h2>
	<ul>
		{#each createdDraftKeys as draftKey}
			<li><a href="/planen?key={encodeURIComponent(draftKey)}">{draftKey}</a></li>
		{/each}
	</ul>

	<hr />
{/if}

<h2>Veranstaltung {eventKey ? 'bearbeiten' : 'einreichen'}</h2>

{#if isMissing}
	<p class="error">
		Die eingereichte Veranstaltung wurde nicht gefunden! Vielleicht wurde sie bereits akzeptiert,
		und kann von dir nicht mehr bearbeitet werden.
	</p>
	<p>
		<a href="/planen">Neue Veranstaltung planen</a>
	</p>
{:else if eventKey}
	<p>
		Die Veranstaltung wurde eingereicht! Wir informieren dich, wenn wir die Veranstaltung
		akzeptieren und auf der Website veröffentlichen. Bis dahin kannst du sie noch hier bearbeiten.
	</p>
{/if}

<PlanningForm
	{defaults}
	onSubmit={(event) => onSubmit(event)}
	onDelete={eventKey ? onDelete : undefined}
	{error}
/>

<style>
	.error {
		color: #ad1515;
	}
</style>
