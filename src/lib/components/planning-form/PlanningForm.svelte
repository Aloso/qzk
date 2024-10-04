<script lang="ts">
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import type { FormTime, FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import Step1 from './Step1.svelte'
	import Step2 from './Step2.svelte'
	import Step3 from './Step3.svelte'
	import Step4 from './Step4.svelte'
	import Progress from '../forms/Progress.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event & WithSubmitter) => void
		onTimeChange?: (times: Time[]) => void
		status:
			| { type: 'ready'; submitted?: boolean }
			| { type: 'submitting' }
			| { type: 'deleting' }
			| { type: 'error'; message: string; missing?: boolean }
		popup?: boolean
	}

	let { defaults, onSubmit, onTimeChange, status, popup }: Props = $props()

	let values = $state(defaults)

	let prevStep = $state(1)
	let step = $state(1)
	let valid = $state([false, false, false, false])

	let progressElem = $state<HTMLElement>()
	$effect(() => {
		if (step !== prevStep) {
			prevStep = step

			setTimeout(() => {
				progressElem?.scrollIntoView({ behavior: 'smooth' })
			})
		}
	})

	$effect(() => {
		const validTimes = values.time.filter(isTimeValid)
		if (validTimes.length) {
			onTimeChange?.(validTimes)
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

	function submitForm(e: SubmitEvent) {
		e.preventDefault()
		localStorage.setItem(
			'submitterData',
			JSON.stringify({ name: values.yourName, email: values.yourEmail }),
		)

		const event: Event & WithSubmitter = {
			title: values.title,
			description: values.description,
			time: values.time as Time[],
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
	<form class:popup>Wird geladen...</form>
{/if}

<form onsubmit={submitForm} class:popup class:hidden={!formLoaded}>
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
			<div></div>
		{/if}

		{#if step === 4}
			<button type="submit" disabled={!valid[step] || (status.type === 'error' && status.missing)}>
				Absenden
			</button>
		{:else}
			<button type="button" disabled={!valid[step]} onclick={() => step++}>Weiter</button>
		{/if}
	</div>

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

	.error {
		color: #aa0b0b;
		white-space: pre-wrap;
	}
</style>
