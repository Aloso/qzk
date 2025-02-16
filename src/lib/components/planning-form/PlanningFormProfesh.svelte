<script lang="ts">
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import type { FormTime, FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import PlanningDescription from './steps/PlanningDescription.svelte'
	import PlanningTime from './steps/PlanningTime.svelte'
	import PlanningOrganisators from './steps/PlanningOrganisators.svelte'
	import PlanningPersonalInfo from './steps/PlanningPersonalInfo.svelte'
	import PlanningPlace from './steps/PlanningPlace.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event & WithSubmitter) => void
		onCancelEdit?: () => void
		onDelete?: () => void
		onPublish?: () => void
		onTimeChange?: (time: Time) => void
		status:
			| { type: 'ready' | 'submitting' | 'submitted' | 'deleting' }
			| { type: 'error'; message: string; missing?: boolean }
	}

	let { defaults, onSubmit, onCancelEdit, onDelete, onPublish, onTimeChange, status }: Props =
		$props()

	let values = $state({ ...defaults })
	let valid = $state([false, false, false, false, false])
	let formLoaded = $state(false)

	$effect(() => {
		if (values.time[0] && isTimeValid(values.time[0])) {
			onTimeChange?.(values.time[0])
		}
	})

	onMount(() => {
		formLoaded = true
		const submitterData = localStorage.getItem('submitterData')
		if (submitterData) {
			const { name, email } = JSON.parse(submitterData)
			if (values.yourName === '') values.yourName = name
			if (values.yourEmail === '') values.yourEmail = email
		}
	})

	function submitForm(ev: SubmitEvent) {
		ev.preventDefault()

		localStorage.setItem(
			'submitterData',
			JSON.stringify({ name: values.yourName, email: values.yourEmail }),
		)

		const event: Event & WithSubmitter = {
			title: values.title,
			descHtml: values.descHtml,
			time: values.time.filter((time): time is Time => !!time.start),
			place: getPlace(),
			organizer: getOrganizer(),
			website: values.website === '' ? undefined : values.website,
			pictureUrl: values.pictureUrl === '' ? undefined : values.pictureUrl,
			tags: [],
			submitter: {
				name: values.yourName,
				email: values.yourEmail,
			},
			orgaNotes: values.orgaNotes === '' ? undefined : values.orgaNotes,
		}

		onSubmit(event)
	}

	function getPlace(): Event['place'] {
		return {
			name:
				values.placeType === 'PHYSICAL'
					? values.placeName
					: values.placeType === 'QZ'
						? 'Queeres Zentrum Kassel'
						: '',
			type: values.placeType === 'QZ' ? 'PHYSICAL' : values.placeType,
			address: values.placeType === 'QZ' ? 'Mauerstraße 11\n34117 Kassel' : values.placeAddress,
			url: values.placeType === 'ONLINE' ? values.placeUrl || undefined : undefined,
			room: values.placeType === 'QZ' ? values.placeRoom : undefined,
		}
	}

	function getOrganizer(): Event['organizer'] {
		return values.organizerName === ''
			? undefined
			: {
					name: values.organizerName,
					email: values.organizerEmail === '' ? undefined : values.organizerEmail,
					phone: values.organizerPhone === '' ? undefined : values.organizerPhone,
					website: values.organizerWebsite === '' ? undefined : values.organizerWebsite,
				}
	}

	function isTimeValid(time: FormTime): time is Time {
		return time.start != null
	}
</script>

{#if !formLoaded}
	Wird geladen...
{/if}

<form onsubmit={submitForm} class:hidden={!formLoaded} class="profesh-form">
	<PlanningDescription bind:values bind:valid={valid[0]} />
	<PlanningPlace bind:values bind:valid={valid[1]} />
	<PlanningTime bind:values bind:valid={valid[2]} professional />
	<PlanningOrganisators bind:values bind:valid={valid[3]} />
	<PlanningPersonalInfo bind:values bind:valid={valid[4]} professional />

	<button type="submit" disabled={status.type === 'error' && status.missing}>Absenden</button>
	{#if onCancelEdit}
		<button type="button" class="cancel-button" onclick={onCancelEdit}>Abbruch</button>
	{/if}
	{#if onDelete}
		<button
			type="button"
			class="delete-button"
			onclick={onDelete}
			disabled={status.type === 'error' && status.missing}
		>
			Löschen
		</button>
	{/if}
	{#if onPublish}
		<button
			type="button"
			class="publish-button"
			onclick={onPublish}
			disabled={status.type === 'error' ||
				status.type === 'submitting' ||
				status.type === 'deleting'}
		>
			Veröffentlichen
		</button>
	{/if}

	{#if status.type === 'submitting'}
		<p>Wird abgesendet...</p>
	{:else if status.type === 'deleting'}
		<p>Wird gelöscht...</p>
	{:else if status.type === 'error'}
		<p class="error">{status.message}</p>
	{:else if status.type === 'submitted'}
		<p>Gespeichert.</p>
	{/if}
</form>

<style lang="scss">
	.profesh-form {
		max-width: 44rem;
		--background: #fff;
	}

	.hidden {
		display: none;
	}

	button {
		background-color: var(--color-theme);
		border: none;
		color: white;
		padding: 15px;
		border-radius: 15px;
		margin: 1rem 0 0 0;
		font: inherit;

		&:hover,
		&:focus {
			background-color: var(--color-link);
		}

		&:disabled {
			opacity: 0.5;
		}
	}

	.delete-button {
		background-color: darkred;
		margin-left: 1rem;

		&:hover,
		&:focus {
			background-color: #ab0a0a;
		}
	}

	.publish-button {
		background-color: #06771b;
		margin-left: 1rem;

		&:hover,
		&:focus {
			background-color: #109b2a;
		}
	}

	.cancel-button {
		background-color: #656565;
		margin-left: 1rem;

		&:hover,
		&:focus {
			background-color: #7e7e7e;
		}
	}

	p {
		margin: 1rem 0;
		font-size: 93%;
	}

	.error {
		color: #aa0b0b;
		white-space: pre-wrap;
	}
</style>
