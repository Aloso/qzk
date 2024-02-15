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
	import { createSubmittedDrafts } from '../../lib/hooks/createSubmittedDrafts.svelte'

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
	const submittedDrafts = createSubmittedDrafts()

	onMount(() => {
		const key = new URL(location.href).searchParams.get('key')
		if (key) {
			loadDraftEvent(key)
		}
	})

	async function loadDraftEvent(key: string) {
		eventKey = key
		isMissing = false
		const draft = await fetchDraft(key)
		if (draft === null) {
			isMissing = true
			submittedDrafts.remove(key)
		} else {
			defaults = {
				title: draft.title,
				description: draft.description,
				startDate: draft.time.start.split('T')[0],
				startTime: draft.time.start.split('T')[1] ?? '',
				endDate: draft.time.end?.split('T')[0] ?? '',
				endTime: draft.time.end?.split('T')[1] ?? '',
				wholeDay: !draft.time.start.includes('T'),
				placeType: draft.place.room ? 'QZ' : draft.place.type,
				placeRoom: draft.place.room,
				placeName: draft.place.name,
				placeAddress: draft.place.address ?? '',
				organizerName: draft.organizer?.name ?? '',
				organizerEmail: draft.organizer?.email ?? '',
				organizerPhone: draft.organizer?.phone ?? '',
				organizerWebsite: draft.organizer?.website ?? '',
				website: draft.website ?? '',
				pictureUrl: draft.pictureUrl ?? '',
				yourName: draft.submitter.name,
				yourEmail: draft.submitter.email,
			}
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
				submittedDrafts.add(key, `${new Date().toLocaleString()} - ${event.title}`)
				goto(`/planen?key=${encodeURIComponent(key)}`)
				loadDraftEvent(key)
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
				eventKey = undefined
				isMissing = false
			} else {
				error = 'Der Entwurf konnte nicht gelöscht werden. Vielleicht wurde er bereits akzeptiert!'
				isMissing = true
			}
			submittedDrafts.remove(eventKey!)
		}
	}
</script>

<StaticPageHeader {...data} />

{#if submittedDrafts.items.length}
	<h1>Eingereichte Veranstaltungen</h1>
	<ul>
		{#each submittedDrafts.items as { key, name }}
			<li class:active={key === eventKey}>
				<a href="/planen?key={encodeURIComponent(key)}">{name}</a>
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
