<script lang="ts">
	import type { FormValuesStep1 } from '$lib/hooks/createEventPlanningDefaults.svelte'
	import TipTapEditor from '../TipTapEditor.svelte'

	interface Props {
		values: FormValuesStep1
		valid: boolean
	}

	let { values, valid = $bindable() }: Props = $props()
	let showHelp = $state(false)

	$effect(() => {
		valid =
			!!values.title &&
			!!values.descHtml &&
			(values.placeType === 'QZ'
				? !!values.placeRoom
				: values.placeType === 'PHYSICAL'
					? !!values.placeName && !!values.placeAddress
					: true)
	})
</script>

<label>
	<em class="full-width required">Name der Veranstaltung</em>
	<input class="full-width" type="text" bind:value={values.title} required />
</label>
<label for="desc-input">
	<em class="full-width required">Beschreibung</em>
	<TipTapEditor
		id="desc-input"
		bind:htmlValue={values.descHtml}
		bind:showHelp
		headingLevels={[2, 3, 4, 5]}
	/>
</label>
<div class="hint">
	<button type="button" class="a" onclick={() => (showHelp = !showHelp)}>Hilfe</button>
</div>

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
		placeholder={'Adresszeile 1\nAdresszeile 2'}
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

<style lang="scss">
	.hidden {
		display: none;
	}

	select,
	textarea,
	input:not([type='checkbox']),
	:global(#desc-input) {
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
	input[type='text'],
	:global(#desc-input) {
		box-sizing: border-box;
		width: calc(100% - 160px);
		color: black;

		@media (max-width: 650px) {
			width: 100%;
		}
	}

	.full-width,
	:global(#desc-input) {
		width: 100% !important;
	}

	:global(#desc-input) {
		padding-top: 0;
		padding-bottom: 0;
	}

	label {
		display: block;
		margin: 1rem 0;
		transition: color 0.2s;

		&:hover {
			color: var(--color-theme);
		}
	}

	em {
		font-style: normal;
		display: inline-block;
		width: 150px;
		padding: 10px 0;
		vertical-align: middle;

		@media (max-width: 650px) {
			display: block;
			padding: 0;
			margin: 0.5rem 0 0.3rem;
			width: auto;
		}
	}

	.hint {
		opacity: 0.6;
		font-size: 0.85rem;
		text-align: right;
		margin-top: -0.8rem;
		margin-bottom: 1rem;

		&:hover,
		&:focus-within {
			opacity: 1;
		}
	}

	.optional {
		color: green;
		font-size: 90%;
	}
</style>
