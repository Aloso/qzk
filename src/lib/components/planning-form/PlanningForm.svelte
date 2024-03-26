<script lang="ts">
	import type { Event } from '$lib/events/types'
	import type { FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import Step1 from './Step1.svelte'
	import Step2 from './Step2.svelte'
	import Step3 from './Step3.svelte'
	import Step4 from './Step4.svelte'
	import Progress from '../forms/Progress.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event) => void
		onCancel?: () => void
		onDelete?: () => void
		onPublish?: () => void
		onTimeChange?: (time: Event['time']) => void
		status:
			| { type: 'ready'; submitted?: boolean }
			| { type: 'submitting' }
			| { type: 'deleting' }
			| { type: 'error'; message: string; missing?: boolean }
		popup?: boolean
	}

	let { defaults, onSubmit, onCancel, onDelete, onPublish, onTimeChange, status, popup }: Props =
		$props()

	let values = $state(defaults)

	let step = $state(1)
	let valid = $state([false, false, false, false])

	let progressElem = $state<HTMLElement>()
	$effect(() => {
		step

		setTimeout(() => {
			progressElem?.scrollIntoView({ behavior: 'smooth' })
		})
	})

	$effect(() => {
		// run when one of these changes
		values.endDate
		values.endTime
		if (values.startDate && (values.startTime || values.wholeDay)) {
			onTimeChange?.(getTime())
		}
	})

	let formLoaded = $state(false)

	onMount(() => {
		formLoaded = true
		const submitterData = localStorage.getItem('submitterData')
		if (submitterData) {
			const { name, email } = JSON.parse(submitterData)
			if (values.yourName === '') values.yourName = name
			if (values.yourEmail === '') values.yourEmail = email
		}
	})

	function submitForm() {
		localStorage.setItem(
			'submitterData',
			JSON.stringify({ name: values.yourName, email: values.yourEmail }),
		)

		const event: Event = {
			title: values.title,
			description: values.description,
			time: getTime(),
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

	function getTime(): Event['time'] {
		return {
			start: values.wholeDay ? values.startDate : `${values.startDate}T${values.startTime}`,
			end: values.wholeDay
				? values.endDate || undefined
				: values.endTime === ''
					? undefined
					: `${values.startDate}T${values.endTime}`,
		}
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
</script>

{#if !formLoaded}
	<form class:popup>Wird geladen...</form>
{/if}

<form on:submit|preventDefault={submitForm} class:popup class:hidden={!formLoaded}>
	<Progress min={1} max={4} value={step} bind:elem={progressElem} />

	{#if step === 1}
		<Step1 {values} bind:valid={valid[1]} />
	{:else if step === 2}
		<Step2 {values} bind:valid={valid[2]} />
	{:else if step === 3}
		<Step3 {values} bind:valid={valid[3]} />
	{:else}
		<Step4 {values} bind:valid={valid[4]} />
	{/if}

	<div class="nav-buttons">
		{#if step > 1}
			<button type="button" onclick={() => step--}>Zurück</button>
		{:else}
			<div />
		{/if}

		{#if step === 4}
			<button type="submit" disabled={!valid[step] || (status.type === 'error' && status.missing)}>
				Absenden
			</button>
		{:else}
			<button type="button" disabled={!valid[step]} onclick={() => step++}>Weiter</button>
		{/if}
	</div>

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
	form {
		box-sizing: border-box;
		background-color: #eee;
		border: 2px solid #ddd;
		border-radius: 30px;
		padding: 30px;
		width: 100%;
		max-width: 40rem;
		font-size: 105%;

		&.hidden {
			display: none;
		}

		&.popup {
			border: none;
			background-color: white;
			padding: 3rem;
			margin: auto;
		}
	}

	.nav-buttons {
		display: flex;
		justify-content: space-between;
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

	.error {
		color: #aa0b0b;
		white-space: pre-wrap;
	}
</style>
