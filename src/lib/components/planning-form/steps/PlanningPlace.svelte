<script lang="ts">
	import type { FormValuesPlace } from '$lib/hooks/createEventPlanningDefaults.svelte'

	interface Props {
		values: FormValuesPlace
		valid: boolean
		professional?: boolean
	}

	let { values = $bindable(), valid = $bindable(), professional }: Props = $props()

	$effect(() => {
		valid =
			values.placeType === 'QZ'
				? !!values.placeRoom
				: values.placeType === 'PHYSICAL'
					? !!values.placeName && !!values.placeAddress
					: true
	})
</script>

<div class="section-title">Ort</div>
<div class:professional>
	<label>
		<em class="required">Ort</em>
		<select bind:value={values.placeType}>
			<option value="QZ">Queeres Zentrum</option>
			<option value="PHYSICAL">Anderer Ort</option>
			<option value="ONLINE">Online</option>
		</select>
	</label>
	<label class:hidden={values.placeType !== 'QZ'}>
		<em class="required">Raum</em>
		<select bind:value={values.placeRoom} required={values.placeType === 'QZ'}>
			<option value={undefined}>Bitte wählen...</option>
			<option value="*innen-Raum">*innen-Raum</option>
			<option value="Gelber Raum">Gelber Raum</option>
			<option value="Blauer Raum">Blauer Raum</option>
			<option value="Rückzugsraum">Rückzugsraum</option>
			<option value="Ganzes Zentrum">Ganzes Zentrum</option>
		</select>
	</label>
	<label class:hidden={values.placeType !== 'PHYSICAL'}>
		<em class="required">Name</em>
		<input type="text" bind:value={values.placeName} required={values.placeType === 'PHYSICAL'} />
	</label>
	<label class:hidden={values.placeType !== 'PHYSICAL'}>
		<em class="required">Adresse</em>
		<textarea
			bind:value={values.placeAddress}
			placeholder="Adresszeile 1
Adresszeile 2"
			rows="2"
			required={values.placeType === 'PHYSICAL'}
		></textarea>
	</label>
	<label class:hidden={values.placeType !== 'ONLINE'}>
		<em>
			URL<br />
			<span class="optional">Freiwillige Angabe</span>
		</em>
		<input type="text" bind:value={values.placeUrl} placeholder="Z.B. Link zu Online-Meeting" />
	</label>
</div>

<style lang="scss">
	.section-title {
		font-weight: 600;
		font-size: 1.5rem;
		margin: 1.5rem 0 1rem 0;
	}

	label {
		display: block;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	.professional label {
		width: 100%;
	}

	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']) {
		background-color: white;
		border: 2px solid #aaa;
		font: inherit;
		font-size: 95%;
		margin: 0;
		padding: 10px 12px;
		border-radius: 15px;
		min-width: 50px;
		transition: border-color 0.2s;
		vertical-align: middle;

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
		width: calc(100% - 4.4rem);
		color: black;
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 4rem;
		padding: 10px 0;
		vertical-align: middle;
	}

	.optional {
		color: green;
		font-size: 90%;
	}
</style>
