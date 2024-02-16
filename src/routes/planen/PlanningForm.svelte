<script lang="ts">
	import type { Event } from '$lib/events/types'
	import type { FormValues } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import { onMount } from 'svelte'

	interface Props {
		defaults: FormValues
		onSubmit: (event: Event) => void
		onDelete?: () => void
		error?: string
	}

	let { defaults, onSubmit, onDelete, error } = $props<Props>()

	$effect(() => {
		title = defaults.title
		description = defaults.description
		startDate = defaults.startDate
		startTime = defaults.startTime
		endDate = defaults.endDate
		endTime = defaults.endTime
		wholeDay = defaults.wholeDay
		placeType = defaults.placeType
		placeRoom = defaults.placeRoom
		placeName = defaults.placeName
		placeAddress = defaults.placeAddress
		organizerName = defaults.organizerName
		organizerEmail = defaults.organizerEmail
		organizerPhone = defaults.organizerPhone
		organizerWebsite = defaults.organizerWebsite
		website = defaults.website
		pictureUrl = defaults.pictureUrl
		yourName = defaults.yourName
		yourEmail = defaults.yourEmail
	})

	// topic
	let title = $state('')
	let description = $state('')

	// time
	let startDate = $state('')
	let startTime = $state('')
	let endDate = $state('')
	let endTime = $state('')
	let wholeDay = $state(false)

	// place
	let placeType = $state<'QZ' | 'PHYSICAL' | 'ONLINE'>('QZ')
	let placeRoom = $state<string>()
	let placeName = $state('')
	let placeAddress = $state('')

	// organizer
	let organizerName = $state('')
	let organizerEmail = $state('')
	let organizerPhone = $state('')
	let organizerWebsite = $state('')

	// other
	let website = $state('')
	let pictureUrl = $state('')

	// contact
	let yourName = $state('')
	let yourEmail = $state('')

	let formLoaded = $state(false)

	onMount(() => {
		formLoaded = true
		const submitterData = localStorage.getItem('submitterData')
		if (submitterData) {
			const { name, email } = JSON.parse(submitterData)
			yourName = name
			yourEmail = email
		}
	})

	$effect(() => {
		if (startDate) {
			const start = new Date(startTime ? `${startDate}T${startTime}` : startDate)
			if (endDate) {
				const end = new Date(endDate)
				if (end < start) {
					endDate = startDate
				}
			} else {
				endDate = startDate
			}
		}
	})

	$effect(() => {
		if (organizerName && !yourName) {
			yourName = organizerName
		}
		if (organizerEmail && !yourEmail) {
			yourEmail = organizerEmail
		}
	})

	function submitForm() {
		localStorage.setItem('submitterData', JSON.stringify({ name: yourName, email: yourEmail }))

		const event: Event = {
			title,
			description,
			time: {
				start: wholeDay ? startDate : `${startDate}T${startTime}`,
				end: wholeDay
					? endDate || undefined
					: endTime === ''
						? undefined
						: `${startDate}T${endTime}`,
			},
			place: {
				name:
					placeType === 'PHYSICAL'
						? placeName
						: placeType === 'QZ'
							? 'Queeres Zentrum Kassel'
							: 'Online-Veranstaltung',
				type: placeType === 'QZ' ? 'PHYSICAL' : placeType,
				address: placeType === 'QZ' ? 'Mauerstraße 11\n34117 Kassel' : placeAddress,
				room: placeType === 'QZ' ? placeRoom : undefined,
			},
			organizer:
				organizerName === ''
					? undefined
					: {
							name: organizerName,
							email: organizerEmail === '' ? undefined : organizerEmail,
							phone: organizerPhone === '' ? undefined : organizerPhone,
							website: organizerWebsite === '' ? undefined : organizerWebsite,
						},
			website: website === '' ? undefined : website,
			pictureUrl: pictureUrl === '' ? undefined : pictureUrl,
			tags: [],
			submitter: {
				name: yourName,
				email: yourEmail,
			},
		}
		onSubmit(event)
	}
</script>

{#if !formLoaded}
	<form>Wird geladen...</form>
{/if}

<form on:submit|preventDefault={submitForm} class:hidden={!formLoaded}>
	Mit einem <span class="red-star">*</span> markierte Felder sind verpflichtend.

	<div class="section-title">Name und Beschreibung</div>
	<label>
		<em class="full-width required">Name der Veranstaltung</em>
		<input class="full-width" type="text" bind:value={title} required />
	</label>
	<label>
		<em class="full-width required">Beschreibung</em>
		<textarea class="full-width" bind:value={description} rows="6" required />
	</label>

	<div class="section-title">Zeit</div>
	<label class="checkbox-label">
		<input type="checkbox" bind:checked={wholeDay} />
		Ganztagig bzw. über mehrere Tage
	</label>
	<label>
		<em class="required">{wholeDay ? 'Startdatum' : 'Datum'}</em>
		<input type="date" bind:value={startDate} required />
	</label>
	<label class:hidden={!wholeDay}>
		<em class="required">Enddatum</em>
		<input type="date" bind:value={endDate} required={wholeDay} />
	</label>
	<label class:hidden={wholeDay}>
		<em class="required">Beginn</em>
		<input type="time" bind:value={startTime} required={!wholeDay} />
	</label>
	<label class:hidden={wholeDay}>
		<em>Ende</em>
		<input type="time" bind:value={endTime} />
		<span class="more-info">(kann leer gelassen werden)</span>
	</label>

	<div class="section-title">Ort</div>
	<label class="radio-label">
		<input bind:group={placeType} type="radio" name="placeType" value="QZ" /> Queeres Zentrum
	</label>
	<label class="radio-label">
		<input bind:group={placeType} type="radio" name="placeType" value="PHYSICAL" /> Anderer Ort
	</label>
	<label class="radio-label">
		<input bind:group={placeType} type="radio" name="placeType" value="ONLINE" /> Online
	</label>
	<label class:hidden={placeType !== 'QZ'}>
		<em class="required">Raum</em>
		<select bind:value={placeRoom} required={placeType === 'QZ'}>
			<option value={undefined}>Bitte wählen...</option>
			<option value="*innen-Raum">*innen-Raum</option>
			<option value="Gelber Raum">Gelber Raum</option>
			<option value="Blauer Raum">Blauer Raum</option>
			<option value="Rückzugsraum">Rückzugsraum</option>
		</select>
	</label>
	<label class:hidden={placeType !== 'PHYSICAL'}>
		<em class="required">Name</em>
		<input type="text" bind:value={placeName} />
	</label>
	<label class:hidden={placeType !== 'PHYSICAL'}>
		<em class="required">Adresse</em>
		<textarea bind:value={placeAddress} placeholder={'Adresszeile 1\nAdresszeile 2'} rows="2" />
	</label>
	<label class:hidden={placeType !== 'ONLINE'}>
		<em class="required">Link zum Beitreten</em>
		<input type="text" bind:value={placeAddress} placeholder="z.B. Link zu Zoom" />
	</label>

	<div class="section-title">Organisator*innen</div>
	<p>Freiwillige Angaben – Kontaktdaten der organisierenden Person/Gruppe</p>
	<label>
		<em>Name(n)</em>
		<input type="text" bind:value={organizerName} />
	</label>
	<label class:hidden={organizerName === ''}>
		<em>E-Mail</em>
		<input type="text" bind:value={organizerEmail} />
	</label>
	<label class:hidden={organizerName === ''}>
		<em>Telefon</em>
		<input type="text" bind:value={organizerPhone} />
	</label>
	<label class:hidden={organizerName === ''}>
		<em>Website</em>
		<input type="text" bind:value={organizerWebsite} />
	</label>

	<div class="section-title">Persönliche Infos</div>
	<p>Diese Daten werden nicht veröffentlicht.</p>
	<label>
		<em class="required">Dein Name</em>
		<input type="text" bind:value={yourName} required />
	</label>
	<label>
		<em class="required">Deine E-Mail</em>
		<input type="text" bind:value={yourEmail} required />
	</label>

	<button type="submit">Absenden</button>

	{#if onDelete}
		<button class="delete-button" on:click|preventDefault|stopPropagation={onDelete}>
			Löschen
		</button>
	{/if}

	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

<style lang="scss">
	form {
		background-color: #eee;
		border: 2px solid #ddd;
		border-radius: 30px;
		padding: 30px;
		max-width: 700px;
		font-size: 105%;
	}

	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']):not([type='radio']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: top;

		&:hover,
		&:focus {
			border-color: var(--color-theme);
			outline: none;
		}
	}

	select,
	textarea,
	input[type='text'] {
		box-sizing: border-box;
		width: calc(100% - 150px);

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	.full-width {
		width: 100% !important;
	}

	label {
		display: block;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	.radio-label,
	.checkbox-label {
		margin: 0.5rem 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 140px;
		padding: 10px 0;
		vertical-align: -12px;

		&.required::after {
			content: ' *';
			color: red;
		}

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}

	.more-info {
		display: inline-block;
		padding: 0 6px;
		vertical-align: -12px;
	}

	.red-star {
		color: red;
		font-size: 140%;
		line-height: 100%;
	}

	button {
		background-color: var(--color-theme);
		border: none;
		color: white;
		padding: 15px;
		border-radius: 15px;
		margin: 1.5rem 0 0 0;
		font: inherit;

		&:hover,
		&:focus {
			background-color: var(--color-link);
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

	p {
		margin: 1rem 0;
		font-size: 93%;
	}

	.error {
		color: #aa0b0b;
		white-space: pre-wrap;
	}
</style>