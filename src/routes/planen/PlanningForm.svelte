<script lang="ts">
	import { submitDraft } from '$lib/events/submitDraft'
	import type { Event } from '$lib/events/types'

	// topic
	let title = $state('')
	let description = $state('')

	// time
	let startDate = $state('')
	let startTime = $state('')
	let endDate = $state('')
	let endTime = $state('')
	let wholeDay = $state(false)
	let noEnd = $state(false)

	// place
	let placeType = $state<'QZ' | 'PHYSICAL' | 'ONLINE'>('QZ')
	let placeRoom = $state<'room 1' | 'room 2' | 'room3'>()
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

	function submitForm() {
		const obj: Event = {
			title,
			description,
			time: {
				start: wholeDay ? startDate : `${startDate}T${startTime}`,
				end: noEnd ? undefined : wholeDay ? endDate : `${endDate}T${endTime}`,
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
		}
		actualSubmit(obj)
	}

	async function actualSubmit(event: Event) {
		try {
			const { key } = await submitDraft(event)
			console.log(key)
		} catch (error) {
			alert(error)
		}
	}
</script>

<form on:submit|preventDefault={submitForm}>
	Mit einem <span class="red-star">*</span> markierte Felder sind verpflichtend.

	<div class="section-title">Name und Beschreibung</div>
	<label>
		<em class="required">Name</em>
		<input type="text" bind:value={title} />
	</label>
	<label>
		<em class="required">Beschreibung</em>
		<textarea bind:value={description} rows="6" />
	</label>

	<div class="section-title">Zeit</div>
	<label for="_startDate">
		<em class="required">Beginn</em>
		<input id="_startDate" type="date" bind:value={startDate} />
		<input type="time" bind:value={startTime} class:hidden={wholeDay} />
	</label>
	<label>
		<em class="one-line">Ganztägig</em>
		<input type="checkbox" bind:checked={wholeDay} />
	</label>
	<label for="_endDate" class:hidden={noEnd}>
		<em class="required">Ende</em>
		<input id="_endDate" type="date" bind:value={endDate} />
		<input type="time" bind:value={endTime} class:hidden={wholeDay} />
	</label>
	<label>
		<em class="one-line">Kein Ende angeben</em>
		<input type="checkbox" bind:checked={noEnd} />
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
		<select bind:value={placeRoom}>
			<option value={undefined}>Bitte wählen...</option>
			<option value="room 1">Raum 1</option>
			<option value="room 2">Raum 2</option>
			<option value="room 3">Raum 3</option>
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
	<label>
		<em>Name</em>
		<input type="text" bind:value={organizerName} placeholder="Person oder Gruppe" />
	</label>
	{#if organizerName}
		<div style="margin: 1rem 0">Gib Kontaktdaten für die Teilnehmer*innen an (freiwillig):</div>
	{/if}
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

	<div class="section-title">Sonstiges</div>
	<label>
		<em>URL für Titelbild</em>
		<input type="text" bind:value={pictureUrl} />
	</label>
	<label>
		<em>Veranstaltungs-Website</em>
		<input type="text" bind:value={website} />
	</label>

	<div class="section-title">Kontakt</div>
	<div style="margin: 1rem 0">Diese Daten werden nicht veröffentlicht.</div>
	<label>
		<em class="required">Dein Name</em>
		<input type="text" bind:value={yourName} />
	</label>
	<label>
		<em class="required">Deine E-Mail</em>
		<input type="text" bind:value={yourEmail} />
	</label>

	<button type="submit">Absenden</button>
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
		margin: 0.5rem 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;

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
		width: calc(100% - 190px);

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	textarea {
		vertical-align: top;
	}

	label {
		display: block;
		margin: 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}

		&:first-child {
			margin-top: 0;
		}
	}

	.radio-label {
		padding: 8px 0;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 180px;
		padding: 10px 0;

		&.required::after {
			content: ' *';
			color: red;
		}

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin-top: 0.5rem;
			width: auto;

			&.one-line {
				display: inline-block;
				padding: 10px 0;
				margin: 0;
			}
		}
	}

	.red-star {
		color: red;
		font-size: 140%;
		line-height: 100%;
	}

	button[type='submit'] {
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
</style>
