<script lang="ts">
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import type { FormTime, FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import PlanningDescription from './steps/PlanningDescription.svelte'
	import PlanningTime from './steps/PlanningTime.svelte'
	import PlanningOrganisators from './steps/PlanningOrganisators.svelte'
	import PlanningPersonalInfo from './steps/PlanningPersonalInfo.svelte'
	import Progress from '../forms/Progress.svelte'
	import PlanningPlace from './steps/PlanningPlace.svelte'
	import PlanningDecoration from './steps/PlanningDecoration.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event & WithSubmitter) => void
		onTimeChange?: (times: Time[]) => void
		status:
			| { type: 'ready' | 'submitting' | 'submitted' }
			| { type: 'error'; message: string; missing?: boolean }
		popup?: boolean
		clickCalendarDay?: (date: Date) => void
	}

	let {
		defaults,
		onSubmit,
		onTimeChange,
		status,
		popup,
		clickCalendarDay = $bindable(),
	}: Props = $props()

	let values = $state($state.snapshot(defaults))

	let prevStep = $state(1)
	let step = $state(1)
	let valid = $state([false, false, false, false, false, false])

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

	$effect(() => {
		clickCalendarDay = date => {
			if (values.time.length === 1) {
				const time = values.time[0]
				if (
					time.start === undefined &&
					(time.end === undefined || time.variant === 'day' || time.variant === 'time')
				) {
					const dateNew = new Date(date)
					dateNew.setHours(12, 0, 0, 0)
					values.time[0] = { variant: 'day', start: dateNew }
				}
			}
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
			descHtml: values.descHtml,
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
			decoration: {
				colors: [values.color1, values.color2],
				blendImage: values.blendImage,
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
	<Progress min={1} max={6} value={step} bind:elem={progressElem} />

	{#if step === 1}
		<PlanningDescription bind:values bind:valid={valid[0]} />
	{:else if step === 2}
		<PlanningPlace bind:values bind:valid={valid[1]} />
	{:else if step === 3}
		<PlanningTime bind:values bind:valid={valid[2]} />
	{:else if step === 4}
		<PlanningOrganisators bind:values bind:valid={valid[3]} />
	{:else if step === 5}
		<PlanningDecoration bind:values bind:valid={valid[4]} />
	{:else}
		<PlanningPersonalInfo bind:values bind:valid={valid[5]} />
	{/if}

	<div class="nav-buttons">
		{#if step > 1}
			<button type="button" onclick={() => step--}>Zurück</button>
		{:else}
			<div></div>
		{/if}

		{#if step === 6}
			<button
				type="submit"
				disabled={!valid[step - 1] || (status.type === 'error' && status.missing)}
			>
				Absenden
			</button>
		{:else}
			<button type="button" disabled={!valid[step - 1]} onclick={() => step++}>Weiter</button>
		{/if}
	</div>

	{#if status.type === 'submitting'}
		<p>Wird abgesendet...</p>
	{:else if status.type === 'error'}
		<p class="error">{status.message}</p>
	{:else if status.type === 'submitted'}
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

		@media (max-width: 38rem) {
			width: auto;
			margin-left: -1rem;
			margin-right: -1rem;
			border-left-width: 0;
			border-right-width: 0;
			border-radius: 0;
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
		cursor: pointer;

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
