<script lang="ts">
	import type { Event, Time, WithSubmitter } from '$lib/events/types'
	import type { FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'
	import PlanningDescription from './steps/PlanningDescription.svelte'
	import PlanningTime from './steps/PlanningTime.svelte'
	import PlanningOrganisators from './steps/PlanningOrganisators.svelte'
	import PlanningPersonalInfo from './steps/PlanningPersonalInfo.svelte'
	import PlanningPlace from './steps/PlanningPlace.svelte'
	import PlanningDecoration from './steps/PlanningDecoration.svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Omit<Event, 'state'> & WithSubmitter) => void

		status: { type: 'ready' | 'submitting' } | { type: 'error'; message: string; missing?: boolean }
	}

	let { defaults, onSubmit, status }: Props = $props()

	let values = $state({ ...defaults })
	let valid = $state([false, false, false, false, false, false])

	onMount(() => {
		const submitterData = localStorage.getItem('submitterData')
		if (submitterData) {
			const { name, email } = JSON.parse(submitterData)
			if (values.yourName === '') values.yourName = name
			if (values.yourEmail === '') values.yourEmail = email
		}
	})

	function submitForm(ev: SubmitEvent) {
		ev.preventDefault()

		const event: Omit<Event, 'state'> & WithSubmitter = {
			titleDe: values.titleDe,
			descDe: values.descDe,
			times: values.times.filter((time): time is Time => !!time.start),
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
		return {
			name: values.organizerName === '' ? undefined : values.organizerName,
			email: values.organizerEmail === '' ? undefined : values.organizerEmail,
			phone: values.organizerPhone === '' ? undefined : values.organizerPhone,
			website: values.organizerWebsite === '' ? undefined : values.organizerWebsite,
		}
	}
</script>

<form onsubmit={submitForm} class="profesh-form">
	<div class="mainbar">
		<PlanningDescription bind:values bind:valid={valid[0]} professional />
	</div>
	<div class="sidebar">
		<PlanningTime bind:values bind:valid={valid[2]} professional />
		<PlanningPlace bind:values bind:valid={valid[1]} professional />
		<PlanningOrganisators bind:values bind:valid={valid[3]} />
		<PlanningPersonalInfo bind:values bind:valid={valid[4]} professional />
		<PlanningDecoration bind:values bind:valid={valid[5]} />
	</div>
	<div class="bottom">
		{#if status.type === 'submitting'}
			<p>Wird gespeichert...</p>
		{:else if status.type === 'error'}
			<p class="error">{status.message}</p>
		{:else}
			<p>Veranstaltung in Bearbeitung</p>
		{/if}

		<button
			type="submit"
			class="submit-button"
			disabled={status.type === 'error' && status.missing}
		>
			Speichern
		</button>
	</div>
</form>

<style lang="scss">
	.profesh-form {
		display: grid;
		grid-template: 'main side' 'bottom bottom' / 2fr 1fr;
		gap: 0 3rem;
		--background: #fff;

		@media (max-width: 78rem) {
			grid-template: 'main' 'side' 'bottom' / 1fr;
		}
	}

	.mainbar {
		grid-area: main;
		width: 2fr;
		max-width: 44rem;
	}

	.sidebar {
		grid-area: side;
		width: 1fr;
		max-width: 44rem;
	}

	.bottom {
		grid-area: bottom;
		display: flex;
		gap: 1rem;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 1rem;
		border-radius: 25px;
		background-color: #fff9c8;
		border: 2px solid #f0e587;
		padding: 1rem;
		min-height: calc(4rem + 4px);
		box-sizing: border-box;

		p {
			font-size: 1rem;
			margin: 0;
			flex-grow: 1;
		}

		.submit-button {
			display: inline-block;
			border: none;
			background-color: var(--color-theme);
			color: white;
			padding: 0.4rem 0.7rem;
			border-radius: 10px;
			font-family: inherit;
			font-size: 1rem;
			line-height: 1.2rem;
			text-decoration: none;
			cursor: pointer;

			&:hover {
				background-color: var(--color-link);
			}
		}

		.error {
			color: #790303;
			white-space: pre-wrap;
		}
	}
</style>
