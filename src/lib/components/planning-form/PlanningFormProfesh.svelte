<script lang="ts">
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import type { FormTime, FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import Step1 from './Step1.svelte'
	import Step2 from './Step2.svelte'
	import Step3 from './Step3.svelte'
	import Step4 from './Step4.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event & WithSubmitter) => void
		onCancel?: () => void
		onDelete?: () => void
		onPublish?: () => void
		onTimeChange?: (time: Time) => void
		status:
			| { type: 'ready'; submitted?: boolean }
			| { type: 'submitting' }
			| { type: 'deleting' }
			| { type: 'error'; message: string; missing?: boolean }
	}

	let { defaults, onSubmit, onCancel, onDelete, onPublish, onTimeChange, status }: Props = $props()

	let values = $state(defaults)
	let valid = $state([false, false, false, false])
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
			description: values.description,
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

<form onsubmit={submitForm} class:hidden={!formLoaded}>
	<Step1 {values} bind:valid={valid[1]} />
	<Step2 {values} bind:valid={valid[2]} />
	<Step3 {values} bind:valid={valid[3]} />
	<Step4 {values} bind:valid={valid[4]} professional />

	<button type="submit" disabled={status.type === 'error' && status.missing}>Absenden</button>
	{#if onCancel}
		<button type="button" class="cancel-button" onclick={onCancel}>Abbruch</button>
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
	{:else if status.type === 'ready' && status.submitted}
		<p>Gespeichert.</p>
	{/if}
</form>

<style lang="scss">
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
